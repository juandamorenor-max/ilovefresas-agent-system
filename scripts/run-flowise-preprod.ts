import "dotenv/config";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { FlowiseClient } from "../src/flowiseClient.js";
import { normalizeFlowiseReply } from "../src/flowiseResponse.js";
import type {
  AgentRoute,
  FlowiseConversationState,
  FlowisePredictionResponse
} from "../src/types.js";
import {
  preprodFlowiseCases,
  type PreprodFlowiseCase
} from "../tests/fixtures/preprod-flowise-cases.js";

interface PreprodTurnResult {
  index: number;
  message: string;
  route?: AgentRoute;
  nodeLabels: string[];
  responseText: string;
  sourceField: string;
  rawResponse?: FlowisePredictionResponse;
  error?: string;
}

interface PreprodCaseResult {
  id: string;
  name: string;
  category: string;
  sessionId: string;
  passed: boolean;
  failures: string[];
  turns: PreprodTurnResult[];
}

interface PreprodReport {
  generatedAt: string;
  flowiseHost: string;
  flowiseFlowId: string;
  strict: boolean;
  totals: {
    cases: number;
    passed: number;
    failed: number;
    turns: number;
  };
  results: PreprodCaseResult[];
}

const args = process.argv.slice(2);
const selectedCaseId = readArgValue("--case");
const limit = readNumberArg("--limit");
const delayMs = readNumberArg("--delay-ms") ?? 250;
const strict = !hasArg("--allow-fail");
const outputRoot = readArgValue("--output-dir") ?? "reports/preprod-flowise";
const includeRaw = hasArg("--include-raw");

const flowiseHost = process.env.FLOWISE_API_HOST ?? "https://cloud.flowiseai.com";
const flowiseFlowId =
  process.env.FLOWISE_FLOW_ID ??
  process.env.FLOWISE_CHATFLOW_ID ??
  "e52f27b3-06e2-4fb0-b853-30e936b99839";

if (!flowiseHost || !flowiseFlowId) {
  console.error("Missing FLOWISE_API_HOST or FLOWISE_FLOW_ID. Check your .env file.");
  process.exit(1);
}

const cases = selectCases(preprodFlowiseCases);
const client = new FlowiseClient({
  host: flowiseHost,
  flowId: flowiseFlowId,
  apiKey: process.env.FLOWISE_API_KEY
});
const reportDir = path.resolve(outputRoot, safeStamp(new Date()));
const results: PreprodCaseResult[] = [];

console.log(`Running ${cases.length} Flowise preprod case(s) against ${flowiseFlowId}`);
console.log(`Reports will be written to ${reportDir}`);

for (const testCase of cases) {
  const result = await runCase(testCase);
  results.push(result);
  const marker = result.passed ? "PASS" : "FAIL";
  console.log(`${marker} ${testCase.id} ${testCase.name}`);

  if (!result.passed) {
    for (const failure of result.failures) {
      console.log(`  - ${failure}`);
    }
  }
}

const report: PreprodReport = {
  generatedAt: new Date().toISOString(),
  flowiseHost,
  flowiseFlowId,
  strict,
  totals: {
    cases: results.length,
    passed: results.filter((result) => result.passed).length,
    failed: results.filter((result) => !result.passed).length,
    turns: results.reduce((total, result) => total + result.turns.length, 0)
  },
  results
};

await mkdir(reportDir, { recursive: true });
await writeFile(path.join(reportDir, "report.json"), JSON.stringify(report, null, 2));
await writeFile(path.join(reportDir, "report.md"), renderMarkdownReport(report));

console.log("\nSummary:");
console.log(`- Cases: ${report.totals.cases}`);
console.log(`- Passed: ${report.totals.passed}`);
console.log(`- Failed: ${report.totals.failed}`);
console.log(`- Turns/predictions: ${report.totals.turns}`);
console.log(`- Report: ${path.join(reportDir, "report.md")}`);

if (strict && report.totals.failed > 0) {
  process.exit(1);
}

async function runCase(testCase: PreprodFlowiseCase): Promise<PreprodCaseResult> {
  const sessionId = `preprod:${testCase.id}:${randomUUID()}`;
  const turns: PreprodTurnResult[] = [];
  const conversationState = createInitialConversationState();

  for (const [index, message] of testCase.messages.entries()) {
    if (index > 0 && delayMs > 0) {
      await delay(delayMs);
    }

    try {
      const rawResponse = await client.predict({
        question: message,
        sessionId,
        conversationState
      });
      const reply = normalizeFlowiseReply(rawResponse);
      mergeConversationState(conversationState, rawResponse);
      turns.push({
        index,
        message,
        route: extractRouterRoute(rawResponse),
        nodeLabels: extractNodeLabels(rawResponse),
        responseText: reply.responseText,
        sourceField: reply.sourceField,
        rawResponse: includeRaw ? rawResponse : undefined
      });
    } catch (error) {
      turns.push({
        index,
        message,
        nodeLabels: [],
        responseText: "",
        sourceField: "error",
        error: (error as Error).message
      });
    }
  }

  const failures = evaluateCase(testCase, turns);

  return {
    id: testCase.id,
    name: testCase.name,
    category: testCase.category,
    sessionId,
    passed: failures.length === 0,
    failures,
    turns
  };
}

function createInitialConversationState(): FlowiseConversationState {
  return {
    route: "",
    confidence: 0,
    reason: "",
    mensaje_cliente: "",
    nombre: "",
    telefono: "",
    direccion: "",
    barrio: "",
    referencia: "",
    metodo_pago: "",
    items: "[]",
    pedido_confirmado: false,
    needs_human: false,
    enviar_menu: false,
    phone: "",
    channel: "preprod",
    menu_topic: "",
    ultima_pregunta_bot: "",
    ultimo_agente: "",
    pedido_en_progreso: false,
    modalidad_entrega: "domicilio",
    next_expected: ""
  };
}

function mergeConversationState(
  conversationState: FlowiseConversationState,
  response: FlowisePredictionResponse
): void {
  const executedData = response.agentFlowExecutedData;
  if (!Array.isArray(executedData)) {
    return;
  }

  for (const node of executedData) {
    if (!isRecord(node) || !isRecord(node.data) || !isRecord(node.data.output)) {
      continue;
    }

    mergeOutput(conversationState, node.data.output);
  }
}

function mergeOutput(
  conversationState: FlowiseConversationState,
  output: Record<string, unknown>
): void {
  mergeOutputFields(conversationState, output);

  if (isRecord(output.state_patch)) {
    mergeOutputFields(conversationState, output.state_patch);
  }

  if (isRecord(output.datos)) {
    mergeOutputFields(conversationState, output.datos);
  }
}

function mergeOutputFields(
  conversationState: FlowiseConversationState,
  output: Record<string, unknown>
): void {
  const fields: (keyof FlowiseConversationState)[] = [
    "route",
    "confidence",
    "reason",
    "mensaje_cliente",
    "nombre",
    "telefono",
    "direccion",
    "barrio",
    "referencia",
    "metodo_pago",
    "items",
    "pedido_confirmado",
    "needs_human",
    "enviar_menu",
    "phone",
    "channel",
    "menu_topic",
    "ultima_pregunta_bot",
    "ultimo_agente",
    "pedido_en_progreso",
    "modalidad_entrega",
    "next_expected"
  ];

  for (const field of fields) {
    if (!(field in output)) {
      continue;
    }

    const value = output[field];
    if (!shouldMergeValue(conversationState[field], value)) {
      continue;
    }

    const writableState = conversationState as Record<string, string | boolean | number | undefined>;
    writableState[field] = normalizeStateValue(field, value);
  }
}

function shouldMergeValue(currentValue: unknown, nextValue: unknown): boolean {
  if (nextValue === undefined || nextValue === null) {
    return false;
  }

  if (typeof nextValue === "string") {
    const trimmed = nextValue.trim();
    if (!trimmed) {
      return false;
    }

    if (trimmed === "[]" && typeof currentValue === "string" && currentValue.trim() !== "[]") {
      return false;
    }
  }

  return true;
}

function normalizeStateValue(field: keyof FlowiseConversationState, value: unknown): string | boolean | number {
  if (field === "items" && Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return JSON.stringify(value);
}

function evaluateCase(testCase: PreprodFlowiseCase, turns: PreprodTurnResult[]): string[] {
  const failures: string[] = [];
  const allText = normalizeForSearch(turns.map((turn) => turn.responseText).join("\n"));
  const finalTurn = turns.at(-1);

  for (const turn of turns) {
    if (turn.error) {
      failures.push(`turn ${turn.index + 1} request error: ${turn.error}`);
    }
  }

  if (testCase.expectedTurnRoutes) {
    for (const [index, expectedRoute] of testCase.expectedTurnRoutes.entries()) {
      const actualRoute = turns[index]?.route;
      if (actualRoute !== expectedRoute) {
        failures.push(
          `turn ${index + 1} route expected ${expectedRoute}, got ${actualRoute ?? "missing"}`
        );
      }
    }
  }

  if (testCase.finalRoute && finalTurn?.route !== testCase.finalRoute) {
    failures.push(`final route expected ${testCase.finalRoute}, got ${finalTurn?.route ?? "missing"}`);
  }

  for (const phrase of testCase.mustContainSomewhere ?? []) {
    if (!containsNormalized(allText, phrase)) {
      failures.push(`missing text somewhere: "${phrase}"`);
    }
  }

  const finalText = normalizeForSearch(finalTurn?.responseText ?? "");
  for (const phrase of testCase.mustContainFinal ?? []) {
    if (!containsNormalized(finalText, phrase)) {
      failures.push(`missing text in final response: "${phrase}"`);
    }
  }

  for (const phrase of testCase.mustNotContainAnywhere ?? []) {
    if (containsNormalized(allText, phrase)) {
      failures.push(`forbidden text found: "${phrase}"`);
    }
  }

  return failures;
}

function selectCases(cases: PreprodFlowiseCase[]): PreprodFlowiseCase[] {
  let selected = selectedCaseId
    ? cases.filter((testCase) => testCase.id === selectedCaseId)
    : cases;

  if (limit !== undefined) {
    selected = selected.slice(0, limit);
  }

  if (selectedCaseId && selected.length === 0) {
    throw new Error(`No preprod case found with id ${selectedCaseId}`);
  }

  return selected;
}

function renderMarkdownReport(report: PreprodReport): string {
  const failed = report.results.filter((result) => !result.passed);
  const passed = report.results.filter((result) => result.passed);

  return [
    "# Flowise Preproduccion Report",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Flowise host: ${report.flowiseHost}`,
    `- Flow ID: ${report.flowiseFlowId}`,
    `- Strict mode: ${report.strict ? "yes" : "no"}`,
    `- Cases: ${report.totals.cases}`,
    `- Turns/predictions: ${report.totals.turns}`,
    `- Passed: ${report.totals.passed}`,
    `- Failed: ${report.totals.failed}`,
    "",
    "## Resultado",
    "",
    report.totals.failed === 0 ? "APTO" : "NO APTO",
    "",
    "## Fallos",
    "",
    failed.length === 0
      ? "Sin fallos criticos."
      : failed.map(renderFailedCase).join("\n\n"),
    "",
    "## Casos OK",
    "",
    passed.length === 0
      ? "Ninguno."
      : passed.map((result) => `- ${result.id} ${result.name}`).join("\n"),
    "",
    "## Detalle Por Caso",
    "",
    report.results.map(renderCaseDetails).join("\n\n")
  ].join("\n");
}

function renderFailedCase(result: PreprodCaseResult): string {
  return [
    `### ${result.id} ${result.name}`,
    "",
    ...result.failures.map((failure) => `- ${failure}`),
    "",
    "Ultimas respuestas:",
    "",
    ...result.turns.slice(-3).map((turn) => {
      return `- Cliente: ${turn.message}\n  Ruta: ${turn.route ?? "missing"}\n  Bot: ${truncate(turn.responseText)}`;
    })
  ].join("\n");
}

function renderCaseDetails(result: PreprodCaseResult): string {
  return [
    `### ${result.passed ? "PASS" : "FAIL"} ${result.id} ${result.name}`,
    "",
    `- Categoria: ${result.category}`,
    `- Session: ${result.sessionId}`,
    `- Turns: ${result.turns.length}`,
    "",
    ...result.turns.map((turn) => {
      return [
        `**Turn ${turn.index + 1}**`,
        `- Cliente: ${turn.message}`,
        `- Ruta: ${turn.route ?? "missing"}`,
        `- Nodos: ${turn.nodeLabels.join(" -> ") || "none"}`,
        `- Bot: ${truncate(turn.responseText)}`
      ].join("\n");
    })
  ].join("\n");
}

function extractRouterRoute(response: FlowisePredictionResponse | undefined): AgentRoute | undefined {
  const executedData = response?.agentFlowExecutedData;

  if (!Array.isArray(executedData)) {
    return undefined;
  }

  const routerNode = executedData.find((node) => isRecord(node) && node.nodeLabel === "ROUTER CENTRAL");

  if (!isRecord(routerNode) || !isRecord(routerNode.data)) {
    return undefined;
  }

  const output = routerNode.data.output;
  if (!isRecord(output) || typeof output.route !== "string") {
    return undefined;
  }

  return output.route as AgentRoute;
}

function extractNodeLabels(response: FlowisePredictionResponse | undefined): string[] {
  const executedData = response?.agentFlowExecutedData;
  if (!Array.isArray(executedData)) {
    return [];
  }

  return executedData
    .map((node) => (isRecord(node) && typeof node.nodeLabel === "string" ? node.nodeLabel : undefined))
    .filter((label): label is string => Boolean(label));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readArgValue(name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function readNumberArg(name: string): number | undefined {
  const value = readArgValue(name);
  return value ? Number(value) : undefined;
}

function hasArg(name: string): boolean {
  return args.includes(name);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function containsNormalized(haystack: string, needle: string): boolean {
  return haystack.includes(normalizeForSearch(needle));
}

function safeStamp(date: Date): string {
  return date.toISOString().replace(/[:.]/gu, "-");
}

function truncate(value: string, maxLength = 500): string {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}
