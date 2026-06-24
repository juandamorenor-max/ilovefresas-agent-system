import "dotenv/config";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createFlowiseClientFromEnv } from "../../src/flowiseClient.js";
import type { AgentRoute, FlowisePredictionResponse } from "../../src/types.js";
import { liveFlowiseCases } from "../fixtures/live-flowise-cases.js";

const runLive = process.env.RUN_LIVE_FLOWISE_TESTS === "true";
const hasFlowiseEnv = Boolean(
  process.env.FLOWISE_API_HOST && (process.env.FLOWISE_FLOW_ID || process.env.FLOWISE_CHATFLOW_ID)
);

const describeLive = runLive && hasFlowiseEnv ? describe : describe.skip;

describeLive("flowise live regression", () => {
  const client = createFlowiseClientFromEnv();

  it.each(liveFlowiseCases)("$name", async (testCase) => {
    const sessionId = `live-${randomUUID()}`;
    let response: FlowisePredictionResponse | undefined;

    for (const message of testCase.messages) {
      response = await client.predict({ question: message, sessionId });
    }

    expect(response, "Flowise did not return a response").toBeDefined();

    const route = extractRouterRoute(response);
    expect(route).toBe(testCase.expectedRoute);

    if (testCase.expectedTextIncludes) {
      expect(String(response?.text ?? "")).toContain(testCase.expectedTextIncludes);
    }

    for (const forbiddenText of testCase.forbiddenTextIncludes ?? []) {
      expect(String(response?.text ?? "")).not.toContain(forbiddenText);
    }
  }, 60000);
});

function extractRouterRoute(response: FlowisePredictionResponse | undefined): AgentRoute | undefined {
  const executedData = response?.agentFlowExecutedData;

  if (!Array.isArray(executedData)) {
    return undefined;
  }

  const routerNode = executedData.find((node) => {
    return isRecord(node) && node.nodeLabel === "ROUTER CENTRAL";
  });

  if (!isRecord(routerNode)) {
    return undefined;
  }

  const data = routerNode.data;
  if (!isRecord(data)) {
    return undefined;
  }

  const output = data.output;
  if (!isRecord(output) || typeof output.route !== "string") {
    return undefined;
  }

  return output.route as AgentRoute;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
