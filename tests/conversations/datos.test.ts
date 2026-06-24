import { describe, expect, it } from "vitest";
import { mockHandleDatos } from "../../src/conversationRunner.js";
import { datosCases } from "../fixtures/conversation-cases.js";

describe("agente datos mock", () => {
  it.each(datosCases)("$name", (testCase) => {
    const result = mockHandleDatos(testCase.message);

    if (testCase.expected) {
      expect(result.datos).toMatchObject(testCase.expected);
    }

    if (testCase.expectedMetodoPago) {
      expect(result.datos.metodo_pago).toBe(testCase.expectedMetodoPago);
    }

    if (testCase.expectedQuestionIncludes) {
      expect(result.siguiente_pregunta?.toLowerCase()).toContain(
        testCase.expectedQuestionIncludes.toLowerCase()
      );
    }
  });

  it("barrio solo no cuenta como direccion y pide plantilla con direccion", () => {
    const result = mockHandleDatos("Cabecera del Llano");

    expect(result.datos.barrio).toBe("Cabecera del Llano");
    expect(result.datos.direccion).toBeUndefined();
    expect(result.completo).toBe(false);
    expect(result.siguiente_pregunta).toContain("Direccion:");
  });

  it("extrae barrio y direccion cuando vienen en el mismo mensaje", () => {
    const result = mockHandleDatos("cabecera del llano, cra 39A # 41-99");

    expect(result.datos).toMatchObject({
      modalidad_entrega: "domicilio",
      barrio: "cabecera del llano",
      direccion: "cra 39A # 41-99"
    });
    expect(result.siguiente_pregunta).toContain("Nombre:");
    expect(result.siguiente_pregunta).toContain("Referencia:");
    expect(result.siguiente_pregunta).toContain("Metodo de pago");
    expect(result.siguiente_pregunta).not.toContain("Direccion:");
    expect(result.siguiente_pregunta).not.toContain("Barrio:");
  });
});
