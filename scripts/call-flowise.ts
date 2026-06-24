import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createFlowiseClientFromEnv } from "../src/flowiseClient.js";

const question = process.argv.slice(2).join(" ").trim();

if (!question) {
  console.error('Usage: npm run flowise:ask -- "hola"');
  process.exit(1);
}

if (!process.env.FLOWISE_API_HOST || !(process.env.FLOWISE_FLOW_ID || process.env.FLOWISE_CHATFLOW_ID)) {
  console.error("Missing FLOWISE_API_HOST or FLOWISE_FLOW_ID. Check your .env file.");
  process.exit(1);
}

const client = createFlowiseClientFromEnv();
const sessionId = `local-${randomUUID()}`;
const response = await client.predict({ question, sessionId });

console.log(JSON.stringify(response, null, 2));
