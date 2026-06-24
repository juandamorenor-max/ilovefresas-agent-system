import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createN8nClientFromEnv, prepareWorkflowForUpdate } from "../src/n8nClient.js";

const args = new Set(process.argv.slice(2));
const workflowId = process.env.N8N_WORKFLOW_ID ?? "";
const targetPath =
  process.env.N8N_TARGET_WORKFLOW_PATH ?? "n8n/exports/telegram-flowise-newchat-target.json";
const shouldApply = args.has("--apply");
const shouldActivate = args.has("--activate");

if (!workflowId) {
  console.error("Missing N8N_WORKFLOW_ID in .env.");
  process.exit(1);
}

const raw = await readFile(targetPath, "utf8");
const target = prepareWorkflowForUpdate(JSON.parse(raw) as unknown);

console.log(
  JSON.stringify(
    {
      workflowId,
      targetPath,
      dryRun: !shouldApply,
      activate: shouldActivate,
      name: target.name,
      nodeCount: target.nodes.length,
      connectionCount: Object.keys(target.connections).length
    },
    null,
    2
  )
);

if (!shouldApply) {
  console.log("Dry-run only. Re-run with --apply to update n8n.");
  process.exit(0);
}

if (!process.env.N8N_API_URL || !process.env.N8N_API_KEY) {
  console.error("Missing N8N_API_URL or N8N_API_KEY. Check your .env file.");
  process.exit(1);
}

const client = createN8nClientFromEnv();
await client.updateWorkflow(workflowId, target);
console.log("Updated n8n workflow.");

if (shouldActivate) {
  await client.activateWorkflow(workflowId);
  console.log("Activated n8n workflow.");
}
