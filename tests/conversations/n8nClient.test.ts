import { describe, expect, it } from "vitest";
import { buildN8nApiBase, prepareWorkflowForUpdate } from "../../src/n8nClient.js";

describe("n8n client helpers", () => {
  it("normalizes cloud base url to public api base", () => {
    expect(buildN8nApiBase("https://i-love-fresas.app.n8n.cloud")).toBe(
      "https://i-love-fresas.app.n8n.cloud/api/v1"
    );
  });

  it("does not duplicate api path when provided", () => {
    expect(buildN8nApiBase("https://i-love-fresas.app.n8n.cloud/api/v1/")).toBe(
      "https://i-love-fresas.app.n8n.cloud/api/v1"
    );
  });

  it("keeps only workflow update fields", () => {
    const workflow = prepareWorkflowForUpdate({
      id: "existing",
      active: true,
      name: "Target",
      nodes: [],
      connections: {},
      settings: { executionOrder: "v1" },
      tags: [],
      versionId: "readonly"
    });

    expect(workflow).toEqual({
      name: "Target",
      nodes: [],
      connections: {},
      settings: { executionOrder: "v1" },
      staticData: null,
      tags: []
    });
  });
});
