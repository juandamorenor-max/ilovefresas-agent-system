import { describe, expect, it } from "vitest";
import { buildFlowisePredictionBody } from "../../src/flowiseClient.js";

describe("Flowise prediction body", () => {
  it("passes catalogo_disponible through overrideConfig vars", () => {
    expect(
      buildFlowisePredictionBody({
        question: "quiero unas fresas",
        sessionId: "telegram:123:case-001",
        catalogoDisponible: {
          productos: [
            {
              id: "prod_tradicional",
              name: "Fresas con crema tradicional",
              category: "Fresas y combinados",
              price: 16000,
              isActive: true,
              isOutOfStock: false,
              availabilityStatus: "available"
            }
          ],
          toppings: [],
          adiciones: []
        }
      })
    ).toEqual({
      question: "quiero unas fresas",
      sessionId: "telegram:123:case-001",
      overrideConfig: {
        vars: {
          catalogo_disponible: expect.stringContaining("Fresas con crema tradicional")
        }
      }
    });
  });

  it("passes conversation state through overrideConfig vars", () => {
    const body = buildFlowisePredictionBody({
        question: "Nequi",
        sessionId: "telegram:123:case-001",
        conversationState: {
          items: "[{\"producto\":\"Fresas con crema tradicional\",\"cantidad\":1}]",
          nombre: "Maria Jose",
          direccion: "cra 43 #70-12",
          barrio: "Boston",
          referencia: "casa blanca",
          metodo_pago: "",
          modalidad_entrega: "domicilio",
          ultima_pregunta_bot: "datos_domicilio",
          pedido_en_progreso: true
        }
      });

    expect(body).toEqual({
      question: expect.stringContaining("<ultimo_mensaje_cliente>\nNequi\n</ultimo_mensaje_cliente>"),
      sessionId: "telegram:123:case-001",
      overrideConfig: {
        vars: {
          items: "[{\"producto\":\"Fresas con crema tradicional\",\"cantidad\":1}]",
          nombre: "Maria Jose",
          direccion: "cra 43 #70-12",
          barrio: "Boston",
          referencia: "casa blanca",
          metodo_pago: "",
          modalidad_entrega: "domicilio",
          ultima_pregunta_bot: "datos_domicilio",
          pedido_en_progreso: "true"
        }
      }
    });
    expect(String(body.question)).toContain("nombre: Maria Jose");
  });
});
