import { describe, expect, it } from "vitest";
import {
  buildCustomerConfirmationSummary,
  buildClosingMessage,
  calculateOrderPricing,
  buildOrderReviewSummary,
  shouldCloseConversation,
  shouldSendClosingPrompt
} from "../../src/orderLifecycle.js";

describe("order lifecycle contract", () => {
  it("marks an incomplete order as not ready for review", () => {
    const summary = buildOrderReviewSummary({
      items: [{ producto: "Fresas con crema tradicional", cantidad: 1 }],
      datos: {
        nombre: "Juan",
        direccion: "Cra 20 #10-15",
        barrio: "Centro"
      }
    });

    expect(summary.readyForReview).toBe(false);
    expect(summary.missingFields).toContain("contacto de canal");
    expect(summary.missingFields).toContain("metodo_pago");
    expect(summary.missingFields).toContain("referencia");
    expect(summary.summaryText).toContain("faltan datos");
  });

  it("marks a complete order as ready for operator review", () => {
    const summary = buildOrderReviewSummary({
      items: [
        {
          producto: "Fresas con crema tradicional",
          cantidad: 2,
          toppings: ["Oreo"]
        }
      ],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      },
      channelContact: "whatsapp:+573001234567",
      observaciones: ["Sin cerezas"]
    });

    expect(summary.readyForReview).toBe(true);
    expect(summary.missingFields).toEqual([]);
    expect(summary.summaryText).toContain("listo para revisión del operario");
    expect(summary.summaryText).toContain("2 x Fresas con crema tradicional");
    expect(summary.summaryText).toContain("whatsapp:+573001234567");
  });

  it("requires flavor for products where flavor applies", () => {
    const summary = buildOrderReviewSummary({
      items: [{ producto: "Malteada", cantidad: 1 }],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "efectivo"
      },
      channelContact: "telegram:123"
    });

    expect(summary.readyForReview).toBe(false);
    expect(summary.missingFields).toContain("sabor de Malteada");
  });

  it("calculates product subtotal, fixed delivery and total", () => {
    const pricing = calculateOrderPricing([
      { producto: "Fresas con crema tradicional", cantidad: 2, precio_unitario: 16000 },
      { producto: "Oblea arequipe", cantidad: 1, precio_unitario: 7000 }
    ]);

    expect(pricing).toEqual({
      canCalculate: true,
      subtotalProductos: 39000,
      domicilio: 5000,
      total: 44000,
      missingPriceItems: []
    });
  });

  it("builds a customer confirmation summary with total and review question", () => {
    const summary = buildCustomerConfirmationSummary({
      items: [
        {
          producto: "Fresas con crema tradicional",
          cantidad: 2,
          toppings: ["Oreo"],
          precio_unitario: 16000
        }
      ],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      },
      channelContact: "telegram:123"
    });

    expect(summary.readyForCustomerConfirmation).toBe(true);
    expect(summary.pricing.total).toBe(41000);
    expect(summary.messageText).toContain("2 x Fresas con crema tradicional");
    expect(summary.messageText).toContain("Domicilio: 5000");
    expect(summary.messageText).toContain("Total: 41000");
    expect(summary.messageText).toContain("Esta correcto para dejarlo en revision con el equipo?");
    expect(summary.messageText).not.toMatch(/preparando|despacho/i);
  });

  it("does not build a final customer summary when an item has no price", () => {
    const summary = buildCustomerConfirmationSummary({
      items: [{ producto: "Producto sin precio", cantidad: 1 }],
      datos: {
        nombre: "Laura",
        direccion: "Calle 80 #50-20",
        barrio: "Alto Prado",
        referencia: "Porteria principal",
        metodo_pago: "nequi"
      },
      channelContact: "telegram:123"
    });

    expect(summary.readyForCustomerConfirmation).toBe(false);
    expect(summary.pricing.canCalculate).toBe(false);
    expect(summary.missingFields).toContain("precio de Producto sin precio");
    expect(summary.messageText).not.toContain("Total:");
  });

  it("sends closing prompt one hour after order was sent for review", () => {
    const orderSentAt = new Date("2026-06-23T10:00:00.000Z");

    expect(
      shouldSendClosingPrompt({
        orderSentAt,
        now: new Date("2026-06-23T11:00:00.000Z")
      })
    ).toBe(true);
  });

  it("does not repeat closing prompt once it was sent", () => {
    expect(
      shouldSendClosingPrompt({
        orderSentAt: new Date("2026-06-23T10:00:00.000Z"),
        closingPromptSentAt: new Date("2026-06-23T11:00:00.000Z"),
        now: new Date("2026-06-23T12:30:00.000Z")
      })
    ).toBe(false);
  });

  it("uses a short closing prompt", () => {
    expect(buildClosingMessage()).toBe("Necesitas algo mas?");
  });

  it("closes when customer says they do not need anything else", () => {
    const decision = shouldCloseConversation({
      lastCustomerMessage: "no gracias",
      now: new Date("2026-06-23T11:05:00.000Z")
    });

    expect(decision).toEqual({
      shouldClose: true,
      reason: "customer_declined_more_help"
    });
  });

  it("closes after timeout if customer does not answer closing prompt", () => {
    const decision = shouldCloseConversation({
      closingPromptSentAt: new Date("2026-06-23T11:00:00.000Z"),
      now: new Date("2026-06-23T11:30:00.000Z")
    });

    expect(decision).toEqual({
      shouldClose: true,
      reason: "closing_prompt_timeout"
    });
  });
});
