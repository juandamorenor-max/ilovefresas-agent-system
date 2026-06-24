import { describe, expect, it } from "vitest";
import { prepareTelegramTurn } from "../../src/telegramSession.js";

describe("telegram session preparation", () => {
  it("creates an isolated Flowise session for normal messages", () => {
    const decision = prepareTelegramTurn(
      {
        chatId: 123,
        text: "quiero una oblea"
      },
      { createConversationId: () => "case-001" }
    );

    expect(decision).toMatchObject({
      chatId: 123,
      channelContact: "telegram:123",
      conversationId: "case-001",
      sessionId: "telegram:123:case-001",
      shouldCallFlowise: true,
      resetConversation: false,
      flowisePayload: {
        question: "quiero una oblea",
        sessionId: "telegram:123:case-001"
      }
    });
  });

  it("can attach catalogo_disponible to the Flowise payload", () => {
    const decision = prepareTelegramTurn(
      {
        chatId: 123,
        text: "quiero unas fresas"
      },
      {
        createConversationId: () => "case-001",
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
      }
    );

    expect(decision.flowisePayload?.catalogoDisponible).toMatchObject({
      productos: [expect.objectContaining({ name: "Fresas con crema tradicional" })]
    });
  });

  it("reuses the active conversation id for the same test chat", () => {
    const decision = prepareTelegramTurn(
      {
        chatId: 123,
        text: "agrega Oreo",
        activeConversationId: "case-001"
      },
      { createConversationId: () => "case-should-not-be-used" }
    );

    expect(decision.conversationId).toBe("case-001");
    expect(decision.sessionId).toBe("telegram:123:case-001");
    expect(decision.shouldCallFlowise).toBe(true);
  });

  it("handles /newchat without calling Flowise", () => {
    const decision = prepareTelegramTurn(
      {
        chatId: 123,
        text: "/newchat domicilio villa santos",
        activeConversationId: "case-old"
      },
      { createConversationId: () => "case-new" }
    );

    expect(decision).toMatchObject({
      conversationId: "case-new",
      sessionId: "telegram:123:case-new",
      shouldCallFlowise: false,
      resetConversation: true,
      controlAction: "new_chat",
      backtestLabel: "domicilio villa santos",
      responseText: "Listo, abri un chat nuevo para probar: domicilio villa santos."
    });
    expect(decision.flowisePayload).toBeUndefined();
  });

  it("supports bot-scoped Telegram commands", () => {
    const decision = prepareTelegramTurn(
      {
        chatId: "abc",
        text: "/newchat@ILoveFresasBot pedido completo",
        activeConversationId: "case-old"
      },
      { createConversationId: () => "case-new" }
    );

    expect(decision.shouldCallFlowise).toBe(false);
    expect(decision.conversationId).toBe("case-new");
    expect(decision.backtestLabel).toBe("pedido completo");
    expect(decision.sessionId).toBe("telegram:abc:case-new");
  });
});
