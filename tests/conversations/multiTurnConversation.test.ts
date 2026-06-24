import { describe, expect, it } from "vitest";
import { runMockMultiTurnConversation } from "../../src/multiTurnConversation.js";

describe("multi-turn conversation harness", () => {
  it("shows the configured welcome message on a plain greeting", () => {
    const result = runMockMultiTurnConversation(["hola"], {
      conversationId: "telegram:welcome:test",
      channel: "telegram",
      channelContact: "telegram:welcome"
    });

    expect(result.turns[0].route).toBe("general");
    expect(result.turns[0].customerReply).toBe(
      "Hola! Bienvenido a I Love Fresas Barranquilla. Las mejores fresas de Barranquilla. Que se te antoja hoy?"
    );
  });

  it("completa el flujo minimo de fresas tradicionales por domicilio", () => {
    const result = runMockMultiTurnConversation(
      [
        "hola",
        "unas fresas tradicionales",
        "no",
        "cabecera del llano, cra 39A # 41-99",
        "soy Maria",
        "referencia porteria azul",
        "pago por Nequi",
        "si"
      ],
      {
        conversationId: "telegram:minimo:test",
        channel: "telegram",
        channelContact: "telegram:531515729"
      }
    );

    expect(result.turns.map((turn) => turn.route)).toEqual([
      "general",
      "pedido",
      "pedido",
      "datos",
      "datos",
      "datos",
      "datos",
      "general"
    ]);
    expect(result.turns[2].customerReply).toContain("Nombre:");
    expect(result.turns[2].customerReply).toContain("Direccion:");
    expect(result.turns[2].customerReply).not.toMatch(/domicilio o recoger|recoger o domicilio/i);
    expect(result.turns.at(-2)?.customerReply).toContain("Resumen de tu pedido");
    expect(result.turns.at(-2)?.customerReply).toContain("Fresas con crema tradicional");
    expect(result.turns.at(-2)?.customerReply).toContain("Domicilio: 5000");
    expect(result.turns.at(-2)?.customerReply).toContain("Total: 21000");
    expect(result.finalDecision.nextAction).toBe("send_to_review");
    expect(result.state.status).toBe("ready_for_review");
  });

  it("guides a strawberry order through customer confirmation and then operator review", () => {
    const result = runMockMultiTurnConversation(
      [
        "quiero unas fresas",
        "tradicional",
        "agrega Oreo",
        "mejor dos",
        "soy Laura",
        "direccion Calle 80 #50-20",
        "barrio Alto Prado",
        "referencia porteria principal",
        "pago por Nequi",
        "listo"
      ],
      {
        conversationId: "telegram:123:test",
        channel: "telegram",
        channelContact: "telegram:123"
      }
    );

    expect(result.turns.map((turn) => turn.route)).toEqual([
      "pedido",
      "pedido",
      "pedido",
      "pedido",
      "datos",
      "datos",
      "datos",
      "datos",
      "datos",
      "general"
    ]);

    expect(result.turns[0].customerReply).toContain("opciones de fresas");
    expect(result.turns[0].customerReply).not.toMatch(/\b(etc|otra|otras|entre otras)\b/i);

    expect(result.turns.at(-2)?.decision.nextAction).toBe("ask_customer_confirmation");
    expect(result.turns.at(-2)?.customerReply).toContain("Resumen de tu pedido");
    expect(result.turns.at(-2)?.customerReply).toContain("Domicilio: 5000");
    expect(result.turns.at(-2)?.customerReply).toContain("Total: 41000");

    expect(result.finalDecision.readyForReview).toBe(true);
    expect(result.finalDecision.nextAction).toBe("send_to_review");
    expect(result.state.status).toBe("ready_for_review");
    expect(result.state.items).toEqual([
      expect.objectContaining({
        producto: "Fresas con crema tradicional",
        cantidad: 2,
        toppings: ["Oreo"]
      })
    ]);
    expect(result.state.datos).toMatchObject({
      nombre: "Laura",
      direccion: "Calle 80 #50-20",
      barrio: "Alto Prado",
      referencia: "porteria principal",
      metodo_pago: "nequi"
    });

    expect(result.finalDecision.customerSummaryText).toContain("2 x Fresas con crema tradicional");
    expect(result.finalDecision.customerSummaryText).toContain("toppings: Oreo");
    expect(result.finalDecision.customerSummaryText).toContain("Laura");
    expect(result.finalDecision.customerSummaryText).toContain("telegram:123");
    expect(result.finalDecision.customerSummaryText).toContain("Calle 80 #50-20");
    expect(result.finalDecision.customerSummaryText).toContain("Alto Prado");
    expect(result.finalDecision.customerSummaryText).toContain("porteria principal");
    expect(result.finalDecision.customerSummaryText).toContain("nequi");
    expect(result.finalDecision.customerSummaryText).not.toMatch(/preparando|despacho/i);
  });

  it("does not ask for customer confirmation when a required field is missing", () => {
    const result = runMockMultiTurnConversation(
      ["quiero unas fresas", "tradicional", "soy Laura", "pago por Nequi"],
      {
        conversationId: "telegram:456:test",
        channel: "telegram",
        channelContact: "telegram:456"
      }
    );

    expect(result.finalDecision.readyForReview).toBe(false);
    expect(result.finalDecision.nextAction).toBe("ask_for_data");
    expect(result.finalDecision.missingFields).toEqual(
      expect.arrayContaining(["direccion", "barrio", "referencia"])
    );
    expect(result.finalDecision.customerSummaryText).toBeUndefined();
  });

  it("handles an oblea plus an additional malteada before asking customer confirmation", () => {
    const result = runMockMultiTurnConversation(
      [
        "quiero una oblea",
        "arequipe",
        "quiero una malteada tambien",
        "Oreo",
        "me llamo Carlos",
        "direccion Cra 43 #70-12",
        "barrio Boston",
        "referencia casa blanca",
        "pago en efectivo"
      ],
      {
        conversationId: "whatsapp:+573001112233:test",
        channel: "whatsapp",
        channelContact: "whatsapp:+573001112233"
      }
    );

    expect(result.finalDecision.readyForReview).toBe(false);
    expect(result.finalDecision.nextAction).toBe("ask_customer_confirmation");
    expect(result.state.status).toBe("ready_for_customer_confirmation");
    expect(result.state.items).toEqual([
      expect.objectContaining({
        producto: "Oblea arequipe",
        cantidad: 1
      }),
      expect.objectContaining({
        producto: "Malteada de Oreo",
        cantidad: 1,
        sabor: "Oreo"
      })
    ]);
    expect(result.finalDecision.customerSummaryText).toContain("1 x Oblea arequipe");
    expect(result.finalDecision.customerSummaryText).toContain("1 x Malteada de Oreo");
    expect(result.finalDecision.customerSummaryText).toContain("Carlos");
    expect(result.finalDecision.customerSummaryText).toContain("efectivo");
    expect(result.finalDecision.customerSummaryText).toContain("Domicilio: 5000");
  });

  it("recalculates the customer summary after a correction before confirmation", () => {
    const result = runMockMultiTurnConversation(
      [
        "quiero unas fresas",
        "tradicional",
        "soy Laura",
        "direccion Calle 80 #50-20",
        "barrio Alto Prado",
        "referencia porteria principal",
        "pago por Nequi",
        "mejor dos"
      ],
      {
        conversationId: "telegram:321:test",
        channel: "telegram",
        channelContact: "telegram:321"
      }
    );

    expect(result.finalDecision.nextAction).toBe("ask_customer_confirmation");
    expect(result.state.status).toBe("ready_for_customer_confirmation");
    expect(result.state.items[0]).toMatchObject({
      producto: "Fresas con crema tradicional",
      cantidad: 2
    });
    expect(result.finalDecision.customerSummaryText).toContain("2 x Fresas con crema tradicional");
    expect(result.finalDecision.customerSummaryText).toContain("Total: 37000");
  });

  it("answers menu and price questions without adding fake items", () => {
    const result = runMockMultiTurnConversation(
      ["me mandas el menu?", "cuanto vale?"],
      {
        conversationId: "telegram:789:test",
        channel: "telegram",
        channelContact: "telegram:789"
      }
    );

    expect(result.turns.map((turn) => turn.route)).toEqual(["menu", "menu"]);
    expect(result.state.items).toEqual([]);
    expect(result.turns[1].customerReply).toContain("producto");
    expect(result.finalDecision.nextAction).toBe("ask_for_order");
  });
});
