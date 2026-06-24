import { describe, expect, it } from "vitest";
import {
  applyFlowiseTurn,
  createEmptyOrderState,
  evaluateCanonicalOrder
} from "../../src/backendOrder.js";

describe("backend canonical order contract", () => {
  it("starts by asking for products when there are no items", () => {
    const state = createEmptyOrderState({
      conversationId: "case-001",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const decision = evaluateCanonicalOrder(state);

    expect(decision.state.status).toBe("collecting_order");
    expect(decision.nextAction).toBe("ask_for_order");
    expect(decision.missingFields).toContain("productos");
  });

  it("keeps collecting data when products exist but customer data is incomplete", () => {
    const state = createEmptyOrderState({
      conversationId: "case-002",
      channel: "whatsapp",
      channelContact: "whatsapp:+573001234567"
    });

    const decision = applyFlowiseTurn(state, {
      route: "pedido",
      confidence: 0.9,
      reason: "customer ordered product",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 2 }]
    });

    expect(decision.state.status).toBe("collecting_data");
    expect(decision.nextAction).toBe("ask_for_data");
    expect(decision.missingFields).toEqual(
      expect.arrayContaining(["nombre", "direccion", "barrio", "referencia", "metodo_pago"])
    );
  });

  it("uses channel contact and asks customer to confirm before review", () => {
    const state = createEmptyOrderState({
      conversationId: "case-003",
      channel: "whatsapp",
      channelContact: "whatsapp:+573001234567"
    });

    const decision = applyFlowiseTurn(state, {
      route: "datos",
      confidence: 0.91,
      reason: "complete structured order",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 1, precio_unitario: 16000 }],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      }
    });

    expect(decision.state.status).toBe("ready_for_customer_confirmation");
    expect(decision.nextAction).toBe("ask_customer_confirmation");
    expect(decision.readyForReview).toBe(false);
    expect(decision.missingFields).not.toContain("contacto de canal");
    expect(decision.customerSummaryText).toContain("whatsapp:+573001234567");
    expect(decision.customerSummaryText).toContain("Domicilio: 5000");
    expect(decision.customerSummaryText).toContain("Total: 21000");
  });

  it("sends to review only after explicit customer confirmation", () => {
    const state = createEmptyOrderState({
      conversationId: "case-003b",
      channel: "whatsapp",
      channelContact: "whatsapp:+573001234567"
    });

    const confirmation = applyFlowiseTurn(state, {
      route: "datos",
      confidence: 0.91,
      reason: "complete structured order",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 1, precio_unitario: 16000 }],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      }
    });

    const review = applyFlowiseTurn(confirmation.state, {
      route: "general",
      confidence: 0.95,
      reason: "customer confirmed summary",
      pedido_confirmado: true
    });

    expect(review.state.status).toBe("ready_for_review");
    expect(review.nextAction).toBe("send_to_review");
    expect(review.readyForReview).toBe(true);
    expect(review.customerSummaryText).toContain("Total: 21000");
  });

  it("ignores Flowise pedido_confirmado when backend data is incomplete", () => {
    const state = createEmptyOrderState({
      conversationId: "case-004",
      channel: "telegram"
    });

    const decision = applyFlowiseTurn(state, {
      route: "pedido",
      confidence: 0.88,
      reason: "Flowise tried to confirm",
      pedido_confirmado: true,
      items: [{ producto: "Malteada", cantidad: 1 }]
    });

    expect(decision.readyForReview).toBe(false);
    expect(decision.state.status).toBe("collecting_data");
    expect(decision.missingFields).toEqual(
      expect.arrayContaining(["sabor de Malteada", "contacto de canal", "referencia", "metodo_pago"])
    );
  });

  it("escalates risky or low confidence proposals before review", () => {
    const state = createEmptyOrderState({
      conversationId: "case-005",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const decision = applyFlowiseTurn(state, {
      route: "escalamiento",
      confidence: 0.8,
      reason: "customer asks exact delivery cost"
    });

    expect(decision.state.status).toBe("escalated");
    expect(decision.nextAction).toBe("escalate_to_human");
    expect(decision.state.humanReviewReasons).toContain("customer asks exact delivery cost");
  });

  it("merges repeated item updates without duplicating toppings", () => {
    const state = createEmptyOrderState({
      conversationId: "case-006",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const first = applyFlowiseTurn(state, {
      route: "pedido",
      confidence: 0.9,
      reason: "product",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 1, toppings: ["Oreo"] }]
    });

    const second = applyFlowiseTurn(first.state, {
      route: "pedido",
      confidence: 0.9,
      reason: "quantity update",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 2, toppings: ["Oreo"] }]
    });

    expect(second.state.items).toHaveLength(1);
    expect(second.state.items[0]).toMatchObject({
      producto: "Fresas con crema tradicional",
      cantidad: 2,
      toppings: ["Oreo"]
    });
  });

  it("escalates complete orders when an item has no price for total calculation", () => {
    const state = createEmptyOrderState({
      conversationId: "case-007",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const decision = applyFlowiseTurn(state, {
      route: "datos",
      confidence: 0.9,
      reason: "complete order with missing price",
      items: [{ producto: "Fresas con crema tradicional", cantidad: 1 }],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      }
    });

    expect(decision.state.status).toBe("escalated");
    expect(decision.nextAction).toBe("escalate_to_human");
    expect(decision.customerSummaryText).toBeUndefined();
    expect(decision.missingFields).toContain("precio de Fresas con crema tradicional");
  });

  it("rejects unknown products from Flowise before they enter canonical state", () => {
    const state = createEmptyOrderState({
      conversationId: "case-008",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const decision = applyFlowiseTurn(state, {
      route: "pedido",
      confidence: 0.9,
      reason: "Flowise proposed an invented product",
      items: [{ producto: "Chocomix", cantidad: 1 }]
    });

    expect(decision.state.status).toBe("escalated");
    expect(decision.nextAction).toBe("escalate_to_human");
    expect(decision.state.items).toEqual([]);
    expect(decision.state.humanReviewReasons).toContain("unknown_product:Chocomix");
  });

  it("keeps valid products while rejecting invented products in the same proposal", () => {
    const state = createEmptyOrderState({
      conversationId: "case-009",
      channel: "telegram",
      channelContact: "telegram:123"
    });

    const decision = applyFlowiseTurn(state, {
      route: "pedido",
      confidence: 0.9,
      reason: "mixed proposal",
      items: [
        { producto: "Fresas con crema tradicional", cantidad: 1, precio_unitario: 16000 },
        { producto: "Pizza hawaiana", cantidad: 1 }
      ]
    });

    expect(decision.state.status).toBe("escalated");
    expect(decision.state.items).toEqual([
      expect.objectContaining({ producto: "Fresas con crema tradicional" })
    ]);
    expect(decision.state.items).not.toEqual([
      expect.objectContaining({ producto: "Pizza hawaiana" })
    ]);
    expect(decision.state.humanReviewReasons).toContain("unknown_product:Pizza hawaiana");
  });
});
