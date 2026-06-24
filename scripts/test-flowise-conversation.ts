import "dotenv/config";
import { randomUUID } from "node:crypto";
import { createFlowiseClientFromEnv } from "../src/flowiseClient.js";

const messages = process.argv.slice(2);

const conversation = messages.length > 0 ? messages : ["hola", "menu", "quiero unas fresas con crema"];

if (!process.env.FLOWISE_API_HOST || !(process.env.FLOWISE_FLOW_ID || process.env.FLOWISE_CHATFLOW_ID)) {
  console.error("Missing FLOWISE_API_HOST or FLOWISE_FLOW_ID. Check your .env file.");
  process.exit(1);
}

const client = createFlowiseClientFromEnv();
const sessionId = `conversation-${randomUUID()}`;

for (const message of conversation) {
  const response = await client.predict({ question: message, sessionId });
  console.log(`\n> ${message}`);
  console.log(JSON.stringify(response, null, 2));
}
