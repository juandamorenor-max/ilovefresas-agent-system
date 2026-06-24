import "dotenv/config";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type FlowiseChatflow = {
  id: string;
  name: string;
  flowData: string;
  [key: string]: unknown;
};

type FlowData = {
  nodes?: FlowNode[];
  edges?: unknown[];
  [key: string]: unknown;
};

type FlowNode = {
  id: string;
  data?: {
    label?: string;
    name?: string;
    inputs?: Record<string, unknown>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type PromptTarget = {
  label: string;
  marker: string;
  promptPath: string;
};

const targets: PromptTarget[] = [
  {
    label: "ROUTER CENTRAL",
    marker: "Eres el ROUTER CENTRAL",
    promptPath: "prompts/router-central.md"
  },
  {
    label: "AGENTE PEDIDO",
    marker: "Eres el AGENTE PEDIDO",
    promptPath: "prompts/agente-pedido.md"
  },
  {
    label: "AGENTE DATOS",
    marker: "Eres el AGENTE DATOS",
    promptPath: "prompts/agente-datos.md"
  },
  {
    label: "AGENTE GENERAL",
    marker: "Eres el AGENTE GENERAL",
    promptPath: "prompts/agente-general.md"
  },
  {
    label: "AGENTE CONFIRMACION DE PEDIDO",
    marker: "Eres el AGENTE CONFIRMACION DE PEDIDO",
    promptPath: "prompts/agente-confirmacion.md"
  }
];

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");
const host = trimTrailingSlash(process.env.FLOWISE_API_HOST ?? "https://cloud.flowiseai.com");
const flowId =
  readArgValue("--flow-id") ??
  process.env.FLOWISE_FLOW_ID ??
  "e52f27b3-06e2-4fb0-b853-30e936b99839";
const apiKey = process.env.FLOWISE_API_KEY;

if (!apiKey) {
  throw new Error(
    "Missing FLOWISE_API_KEY. Add it to .env, then run npm run flowise:update-prompts -- --apply"
  );
}

const chatflow = await fetchChatflow(flowId);
const flowData = parseFlowData(chatflow.flowData);
const prompts = await loadPrompts();
const changes = applyPromptUpdates(flowData, prompts);

if (changes.length !== targets.length) {
  const changedLabels = new Set(changes.map((change) => change.label));
  const missing = targets
    .map((target) => target.label)
    .filter((label) => !changedLabels.has(label));

  throw new Error(`Could not update every target prompt. Missing: ${missing.join(", ")}`);
}

await writeBackup(chatflow);

console.log("Flowise prompt update plan:");
for (const change of changes) {
  console.log(
    `- ${change.label} (${change.nodeId}) ${change.fieldPath}: ${change.previousLength} -> ${change.nextLength}`
  );
}

if (!apply) {
  console.log("\nDry-run only. Re-run with --apply to update Flowise.");
  process.exit(0);
}

const updated = await updateChatflow(chatflow, flowData);
console.log(`\nUpdated Flowise Agentflow: ${updated.name ?? chatflow.name} (${flowId})`);

function readArgValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/u, "");
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
}

async function fetchChatflow(id: string): Promise<FlowiseChatflow> {
  const response = await fetch(`${host}/api/v1/chatflows/${id}`, {
    headers: authHeaders()
  });

  if (!response.ok) {
    throw new Error(`Flowise GET failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as FlowiseChatflow;
}

async function updateChatflow(chatflow: FlowiseChatflow, flowData: FlowData): Promise<FlowiseChatflow> {
  const response = await fetch(`${host}/api/v1/chatflows/${chatflow.id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({
      name: chatflow.name,
      flowData: JSON.stringify(flowData)
    })
  });

  if (!response.ok) {
    throw new Error(`Flowise PUT failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as FlowiseChatflow;
}

function parseFlowData(raw: string): FlowData {
  try {
    return JSON.parse(raw) as FlowData;
  } catch (error) {
    throw new Error(`Could not parse flowData JSON: ${(error as Error).message}`);
  }
}

async function loadPrompts(): Promise<Map<string, string>> {
  const entries = await Promise.all(
    targets.map(async (target) => {
      const text = await readFile(path.resolve(target.promptPath), "utf8");
      return [target.label, text] as const;
    })
  );

  return new Map(entries);
}

function applyPromptUpdates(flowData: FlowData, prompts: Map<string, string>) {
  const nodes = flowData.nodes ?? [];

  return targets.map((target) => {
    const node = findNode(nodes, target);
    const prompt = prompts.get(target.label);

    if (!prompt) {
      throw new Error(`Missing prompt text for ${target.label}`);
    }

    const match = findPromptField(node, target.marker);
    if (!match) {
      throw new Error(`Could not find prompt field for ${target.label}`);
    }

    match.container[match.key] = prompt;

    return {
      label: target.label,
      nodeId: node.id,
      fieldPath: `data.inputs.${match.key}`,
      previousLength: match.previous.length,
      nextLength: prompt.length
    };
  });
}

function findNode(nodes: FlowNode[], target: PromptTarget): FlowNode {
  const node = nodes.find((candidate) => {
    const label = String(candidate.data?.label ?? "");
    return label.toLowerCase() === target.label.toLowerCase();
  });

  if (!node) {
    throw new Error(`Could not find node with label ${target.label}`);
  }

  return node;
}

function findPromptField(
  node: FlowNode,
  marker: string
): { container: Record<string, unknown>; key: string; previous: string } | undefined {
  const inputs = node.data?.inputs;
  if (!inputs) {
    return undefined;
  }

  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value === "string" && value.includes(marker)) {
      return { container: inputs, key, previous: value };
    }
  }

  return undefined;
}

async function writeBackup(chatflow: FlowiseChatflow): Promise<void> {
  const dir = path.resolve("flowise/exports");
  await mkdir(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/gu, "-");
  const file = path.join(dir, `${stamp}-${chatflow.id}-before-prompt-update.json`);
  await writeFile(file, JSON.stringify(chatflow, null, 2));
  console.log(`Backup written: ${file}`);
}
