import { describe, expect, it } from "vitest";
import { normalizeFlowiseReply } from "../../src/flowiseResponse.js";

describe("Flowise response normalization", () => {
  it("uses top-level text first", () => {
    expect(normalizeFlowiseReply({ text: " Hola " })).toEqual({
      responseText: "Hola",
      sourceField: "text"
    });
  });

  it("accepts structured router/menu fields", () => {
    expect(normalizeFlowiseReply({ json: { mensaje_cliente: "Listo" } })).toEqual({
      responseText: "Listo",
      sourceField: "json.mensaje_cliente"
    });
  });

  it("accepts respuesta from menu-like output", () => {
    expect(normalizeFlowiseReply({ json: { respuesta: "Tenemos Oreo" } })).toEqual({
      responseText: "Tenemos Oreo",
      sourceField: "json.respuesta"
    });
  });

  it("falls back safely when no text exists", () => {
    const reply = normalizeFlowiseReply({ json: { route: "pedido" } });

    expect(reply.sourceField).toBe("fallback");
    expect(reply.responseText).toContain("equipo");
  });
});
