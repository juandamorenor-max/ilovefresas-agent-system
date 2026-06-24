import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface N8nTargetWorkflow {
  nodes: Array<{
    name: string;
    type: string;
    parameters?: Record<string, unknown>;
  }>;
  connections: Record<string, unknown>;
}

const workflow = JSON.parse(
  readFileSync("n8n/exports/telegram-flowise-newchat-target.json", "utf8")
) as N8nTargetWorkflow;

describe("n8n target workflow", () => {
  it("contains the required Telegram and Flowise nodes", () => {
    expect(workflow.nodes.map((node) => node.name)).toEqual(
      expect.arrayContaining([
        "Telegram Trigger",
        "Prepare Telegram Session",
        "Should Call Flowise?",
        "Flowise Prediction",
        "Normalize Flowise Response",
        "Send Flowise Text",
        "Send Control Text"
      ])
    );
  });

  it("points Flowise HTTP request to the edited Agentflow copy", () => {
    const flowiseNode = workflow.nodes.find((node) => node.name === "Flowise Prediction");

    expect(flowiseNode?.parameters?.url).toBe(
      "https://cloud.flowiseai.com/api/v1/prediction/e52f27b3-06e2-4fb0-b853-30e936b99839"
    );
  });

  it("keeps /newchat out of Flowise", () => {
    const prepareNode = workflow.nodes.find((node) => node.name === "Prepare Telegram Session");
    const jsCode = String(prepareNode?.parameters?.jsCode ?? "");

    expect(jsCode).toContain('command === "/newchat"');
    expect(jsCode).toContain("shouldCallFlowise: false");
  });

  it("passes catalogo_disponible to Flowise through overrideConfig vars", () => {
    const prepareNode = workflow.nodes.find((node) => node.name === "Prepare Telegram Session");
    const jsCode = String(prepareNode?.parameters?.jsCode ?? "");

    expect(jsCode).toContain("DEFAULT_CATALOGO_DISPONIBLE");
    expect(jsCode).toContain("catalogo_disponible");

    const flowiseNode = workflow.nodes.find((node) => node.name === "Flowise Prediction");
    const parameters = flowiseNode?.parameters?.bodyParameters as
      | { parameters?: Array<{ name?: string; value?: string }> }
      | undefined;

    expect(parameters?.parameters).toEqual(
      expect.arrayContaining([
        {
          name: "overrideConfig",
          value: "={{ $json.flowisePayload.overrideConfig }}"
        }
      ])
    );
  });

  it("normalizes Flowise response before sending Telegram text", () => {
    expect(workflow.connections["Flowise Prediction"]).toEqual({
      main: [[{ node: "Normalize Flowise Response", type: "main", index: 0 }]]
    });
    expect(workflow.connections["Normalize Flowise Response"]).toEqual({
      main: [[{ node: "Send Flowise Text", type: "main", index: 0 }]]
    });

    const sendNode = workflow.nodes.find((node) => node.name === "Send Flowise Text");
    expect(sendNode?.parameters?.text).toBe("={{ $json.responseText }}");
  });
});
