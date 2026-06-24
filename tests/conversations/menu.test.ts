import { describe, expect, it } from "vitest";
import { mockHandleMenu } from "../../src/conversationRunner.js";
import { menuCases } from "../fixtures/conversation-cases.js";

describe("agente menu mock", () => {
  it.each(menuCases)("$name", (testCase) => {
    const result = mockHandleMenu(testCase.message);

    expect(result.enviar_menu).toBe(testCase.expectedEnviarMenu);

    if (testCase.expectedResponseIncludes) {
      expect(result.respuesta).toContain(testCase.expectedResponseIncludes);
    }
  });
});
