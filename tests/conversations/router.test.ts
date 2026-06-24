import { describe, expect, it } from "vitest";
import { mockRouteMessage } from "../../src/conversationRunner.js";
import { routerCases } from "../fixtures/conversation-cases.js";

describe("router central mock", () => {
  it.each(routerCases)("$name", (testCase) => {
    const result = mockRouteMessage(testCase.messages.at(-1) ?? "", testCase.context);

    expect(result.route).toBe(testCase.expected.route);
  });

  it.each(["para domicilio", "es para domicilio", "domicilio"])(
    "no escala una indicacion simple de domicilio: %s",
    (message) => {
      const result = mockRouteMessage(message);

      expect(result.route).toBe("datos");
      expect(result.needs_human).toBe(false);
    }
  );

  it("escala solo cuando preguntan costo exacto de domicilio", () => {
    const result = mockRouteMessage("cuanto cuesta el domicilio hasta Villa Santos");

    expect(result.route).toBe("escalamiento");
    expect(result.needs_human).toBe(true);
  });

  it.each([
    ["menu completo", true],
    ["mandame la carta", true],
    ["que toppings tienen", false],
    ["cuanto vale una malteada de Oreo", false]
  ])("clasifica menu por intencion y controla enviar_menu: %s", (message, enviarMenu) => {
    const result = mockRouteMessage(message);

    expect(result.route).toBe("menu");
    expect(result.enviar_menu).toBe(enviarMenu);
  });

  it.each([
    "que zonas cubren?",
    "tienen disponible ahora?",
    "quiero poner un reclamo",
    "me haces un descuento?",
    "quiero hablar con un humano"
  ])("escala intenciones operativas riesgosas: %s", (message) => {
    const result = mockRouteMessage(message);

    expect(result.route).toBe("escalamiento");
    expect(result.needs_human).toBe(true);
  });

  it("no trata una confirmacion ambigua como pedido confirmado", () => {
    const result = mockRouteMessage("si");

    expect(result.route).toBe("general");
    expect(result.pedido_confirmado).toBe(false);
    expect(result.needs_human).toBe(false);
  });

  it.each(["no", "nada mas", "solo eso", "listo"])(
    "mantiene pedido cuando el cliente no quiere agregar mas: %s",
    (message) => {
      const result = mockRouteMessage(message, {
        activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 }
      });

      expect(result.route).toBe("pedido");
      expect(result.route).not.toBe("general");
    }
  );

  it("despues de preguntar por otro producto, un dato va a datos", () => {
      const result = mockRouteMessage("Juan Moreno", {
        activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 },
      lastQuestion: "Quieres agregar otro producto al pedido?"
    });

    expect(result.route).toBe("datos");
  });

  it("despues de preguntar por otro producto, un modificador sigue en pedido", () => {
      const result = mockRouteMessage("con oreo", {
        activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 },
      lastQuestion: "Quieres agregar otro producto al pedido?"
    });

    expect(result.route).toBe("pedido");
  });

  it("despues de preguntar por otro producto, un producto desconocido va a pedido para rechazarlo sin inventar", () => {
    const result = mockRouteMessage("chocomix", {
      activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 },
      lastQuestion: "Quieres agregar otro producto al pedido?"
    });

    expect(result.route).toBe("pedido");
    expect(result.needs_human).toBe(false);
  });
});
