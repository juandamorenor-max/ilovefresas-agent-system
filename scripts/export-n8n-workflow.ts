import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createN8nClientFromEnv } from "../src/n8nClient.js";

const workflowId = process.env.N8N_WORKFLOW_ID ?? process.argv[2] ?? "";

if (!workflowId) {
  console.error("Missing N8N_WORKFLOW_ID or workflow id argument.");
  process.exit(1);
}

if (!process.env.N8N_API_URL || !process.env.N8N_API_KEY) {
  console.error("Missing N8N_API_URL or N8N_API_KEY. Check your .env file.");
  process.exit(1);
}

const client = createN8nClientFromEnv();
const workflow = await client.getWorkflow(workflowId);
const outputDir = "n8n/exports";
const outputPath = join(outputDir, `${workflowId}.json`);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(workflow, null, 2)}\n`, "utf8");

console.log(`Exported n8n workflow to ${outputPath}`);
