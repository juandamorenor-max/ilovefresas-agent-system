// n8n Code node: "Prepare Telegram Session"
// Place immediately after Telegram Trigger.
//
// Output fields:
// - shouldCallFlowise: false for control commands like /newchat
// - flowisePayload: body for the HTTP Request node
// - responseText: direct Telegram response for control commands

const staticData = $getWorkflowStaticData("global");
staticData.telegramConversations ??= {};

const DEFAULT_CATALOGO_DISPONIBLE = {
  productos: [
    { id: "prod_fresas_tradicional", name: "Fresas con crema tradicional", category: "Fresas y combinados", price: 16000 },
    { id: "prod_fresas_helado", name: "Fresas con helado", category: "Fresas y combinados", price: 18000 },
    { id: "prod_fresas_oreo", name: "Fresas con crema de Oreo", category: "Fresas y combinados", price: 18000 },
    { id: "prod_mix_oreo", name: "Mix Oreo", category: "Fresas y combinados", price: 20000 },
    { id: "prod_mix_oreo_milo", name: "Mix Oreo Milo", category: "Fresas y combinados", price: 22000 },
    { id: "prod_fresa_oreo_milo", name: "Fresa con crema + Oreo + Milo", category: "Fresas y combinados", price: 20000 },
    { id: "prod_fresas_chocolate", name: "Fresas con chocolate", category: "Fresas y combinados", price: 18000 },
    { id: "prod_fresas_explosion_chocolate", name: "Fresas explosion de chocolate", category: "Fresas y combinados", price: 18000 },
    { id: "prod_fresas_frutos_rojos", name: "Fresas frutos rojos", category: "Fresas y combinados", price: 18000 }
  ],
  toppings: [
    { id: "mod_oreo", name: "Oreo", price: 2000 },
    { id: "mod_arequipe", name: "Arequipe", price: 2000 },
    { id: "mod_brownie", name: "Brownie", price: 2000 },
    { id: "mod_milo", name: "Milo", price: 2000 }
  ],
  adiciones: [
    { id: "add_crema_adicional", name: "Crema adicional", price: 4000 },
    { id: "add_helado", name: "Helado", price: 4000 },
    { id: "add_nutella", name: "Nutella", price: 4000 }
  ]
};

const message = $json.message ?? {};
const chatId = message.chat?.id;
const text = String(message.text ?? "").trim();

if (!chatId) {
  return [
    {
      json: {
        shouldCallFlowise: false,
        responseText: "No pude identificar el chat de Telegram.",
        error: "missing_chat_id"
      }
    }
  ];
}

const command = text.split(/\s+/)[0]?.toLowerCase().split("@")[0];
const args = text.split(/\s+/).slice(1).join(" ").trim();
const chatKey = String(chatId);

function newConversationId() {
  return `tg-${chatKey}-${Date.now().toString(36)}`;
}

if (command === "/newchat") {
  const conversationId = newConversationId();
  staticData.telegramConversations[chatKey] = {
    conversationId,
    backtestLabel: args || undefined,
    createdAt: new Date().toISOString()
  };

  return [
    {
      json: {
        chatId,
        channelContact: `telegram:${chatId}`,
        conversationId,
        sessionId: `telegram:${chatId}:${conversationId}`,
        shouldCallFlowise: false,
        resetConversation: true,
        backtestLabel: args || undefined,
        responseText: args
          ? `Listo, abri un chat nuevo para probar: ${args}.`
          : "Listo, abri un chat nuevo para pruebas."
      }
    }
  ];
}

const existing = staticData.telegramConversations[chatKey];
const conversationId = existing?.conversationId ?? newConversationId();
staticData.telegramConversations[chatKey] ??= {
  conversationId,
  createdAt: new Date().toISOString()
};

const sessionId = `telegram:${chatId}:${conversationId}`;
const catalogoDisponible = staticData.catalogoDisponible ?? DEFAULT_CATALOGO_DISPONIBLE;
staticData.catalogoDisponible ??= catalogoDisponible;

return [
  {
    json: {
      chatId,
      channelContact: `telegram:${chatId}`,
      conversationId,
      sessionId,
      shouldCallFlowise: true,
      resetConversation: false,
      flowisePayload: {
        question: text,
        sessionId,
        overrideConfig: {
          vars: {
            catalogo_disponible: JSON.stringify(catalogoDisponible)
          }
        }
      }
    }
  }
];
