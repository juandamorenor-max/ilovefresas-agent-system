import type {
  AgentRoute,
  ConversationContext,
  DatosPedido,
  DatosResult,
  MenuResult,
  PedidoResult,
  RouterResult
} from "./types.js";
import {
  availableFresasOptions,
  isModifierAvailableByName,
  isProductAvailableByName
} from "./availabilityCatalog.js";

const catalogPrices = new Map<string, number>([
  ["malteada de oreo", 15000],
  ["fresas con crema tradicional", 16000],
  ["fresas con helado", 18000],
  ["oblea arequipe", 7000]
]);

const fullDeliveryDataTemplate = [
  "Perfecto. Para el domicilio me compartes estos datos, por favor:",
  "",
  "Nombre:",
  "Direccion:",
  "Barrio:",
  "Referencia:",
  "Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo"
].join("\n");

const askAnotherProductMessage =
  "Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?";

const askAnotherProductAfterModifierMessage =
  "Listo, le agrego topping de Oreo. Quieres agregar otro producto al pedido?";

const unsupportedProductReply =
  "Ese producto no aparece en el menu por ahora. Te puedo ayudar con las opciones disponibles.";

function fresasOptionsPrompt(context: ConversationContext): string {
  const options = availableFresasOptions(context.catalogoDisponible);
  return `Tenemos estas opciones de fresas: ${options.join(", ")}. Cual quieres?`;
}

export function mockRouteMessage(message: string, context: ConversationContext = {}): RouterResult {
  const normalized = normalize(message);
  const route = classifyRoute(normalized, context);

  return {
    route,
    confidence: route === "general" ? 0.8 : 0.9,
    reason: `Mock route by keyword/context: ${route}`,
    mensaje_cliente: "",
    enviar_menu: route === "menu" && wantsFullMenu(normalized),
    needs_human: route === "escalamiento",
    pedido_confirmado: false,
    state_patch: {
      ultimo_agente: "router-central",
      route
    },
    next_expected: nextExpectedForRoute(route)
  };
}

export function mockHandleMenu(message: string): MenuResult {
  const normalized = normalize(message);

  if (wantsFullMenu(normalized)) {
    return {
      enviar_menu: true,
      respuesta: "Claro, te envio el menu completo."
    };
  }

  if (normalized.includes("domicilio")) {
    return {
      enviar_menu: false,
      respuesta: "Un asesor confirma el costo del domicilio antes de dejar el pedido en revision."
    };
  }

  if (hasAny(normalized, ["disponible", "disponibilidad", "entregar ya", "llega ya"])) {
    return {
      enviar_menu: false,
      respuesta: "El equipo debe validar la disponibilidad exacta antes de confirmarte."
    };
  }

  if (normalized.includes("topping")) {
    return {
      enviar_menu: false,
      respuesta:
        "Tenemos toppings desde 2000: leche condensada, arequipe, Oreo, merengue, brownie, Hershey, chips, Krispi, Milo, coco y Choco Crispi. Mym y Chokis valen 3000."
    };
  }

  if (normalized.includes("malteada") && normalized.includes("oreo")) {
    return {
      enviar_menu: false,
      respuesta: `La malteada de Oreo vale ${catalogPrices.get("malteada de oreo")}.`
    };
  }

  if (hasAny(normalized, ["cuanto vale", "cuanto cuesta", "precio", "vale?"])) {
    return {
      enviar_menu: false,
      respuesta: "Claro, dime de que producto quieres saber el precio."
    };
  }

  return {
    enviar_menu: false,
    respuesta: "Te ayudo con precios, sabores, toppings o el menu completo."
  };
}

export function mockHandlePedido(
  message: string,
  context: ConversationContext = {}
): PedidoResult {
  const normalized = normalize(message);

  if (declinesMoreItems(normalized) && context.activeItem) {
    return {
      necesita_aclaracion: false,
      mensaje_cliente: fullDeliveryDataTemplate,
      items: [context.activeItem],
      state_patch: {
        pedido_en_progreso: true,
        modalidad_entrega: "domicilio",
        ultima_pregunta_bot: fullDeliveryDataTemplate,
        ultimo_agente: "pedido"
      },
      next_expected: "datos"
    };
  }

  if (askedAnotherProduct(context) && looksLikeCustomerData(normalized)) {
    return {
      necesita_aclaracion: false,
      mensaje_cliente: "Perfecto, seguimos con tus datos de domicilio.",
      items: context.activeItem ? [context.activeItem] : [],
      state_patch: {
        pedido_en_progreso: true,
        ultimo_agente: "pedido",
        ultima_pregunta_bot: "datos_domicilio"
      },
      next_expected: "datos"
    };
  }

  if (requestedUnavailableProduct(normalized, "fresas con crema tradicional", context)) {
    return unavailableProductReply(context, "Fresas con crema tradicional");
  }

  if (mentionsUnknownProduct(normalized) && includesTraditionalVariant(normalized, context)) {
    const item = buildTraditionalFresasPedido();
    return {
      ...item,
      mensaje_cliente: `Perfecto, fresas con crema tradicional. ${unsupportedProductReply} Quieres agregar otro producto al pedido?`,
      state_patch: {
        items: item.items,
        pedido_en_progreso: true,
        ultimo_agente: "pedido",
        ultima_pregunta_bot: "pedido_otro_producto"
      },
      next_expected: "pedido"
    };
  }

  if (mentionsUnknownProduct(normalized) || isUnsupportedProductRequest(normalized)) {
    return {
      necesita_aclaracion: true,
      needs_human: false,
      pregunta: unsupportedProductReply,
      items: [],
      next_expected: "pedido"
    };
  }

  if (context.lastQuestion?.toLowerCase().includes("malteada") && hasFlavor(normalized)) {
    const flavor = flavorFromMessage(normalized);
    return {
      necesita_aclaracion: false,
      items: [
        {
          producto: `Malteada de ${flavor}`,
          cantidad: 1,
          sabor: flavor,
          precio_unitario:
            flavor.toLowerCase() === "oreo" ? catalogPrices.get("malteada de oreo") : 15000
        }
      ],
      next_expected: "pedido"
    };
  }

  if (asksForFresasWithoutKnownVariant(normalized)) {
    return {
      necesita_aclaracion: true,
      pregunta: fresasOptionsPrompt(context),
      items: [],
      next_expected: "pedido"
    };
  }

  if (normalized === "tradicional" && context.lastQuestion?.toLowerCase().includes("variante")) {
    return buildTraditionalFresasPedido();
  }

  if (
    hasAny(normalized, ["fresas tradicionales", "fresa tradicional", "fresas con crema tradicional"])
  ) {
    const item = buildTraditionalFresasPedido();
    return {
      ...item,
      mensaje_cliente: askAnotherProductMessage,
      state_patch: {
        items: item.items,
        pedido_en_progreso: true,
        ultimo_agente: "pedido",
        ultima_pregunta_bot: "pedido_otro_producto"
      },
      next_expected: "pedido"
    };
  }

  if (normalized.includes("malteada") && !hasFlavor(normalized)) {
    return {
      necesita_aclaracion: true,
      pregunta: "Que sabor de malteada quieres: fresa, chocolate, vainilla u Oreo?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (normalized.includes("oblea") && !hasAny(normalized, ["arequipe", "nutella", "queso", "crema"])) {
    return {
      necesita_aclaracion: true,
      pregunta: "Que tipo de oblea quieres?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (context.lastQuestion?.toLowerCase().includes("oblea") && hasAny(normalized, ["arequipe"])) {
    return {
      necesita_aclaracion: false,
      items: [
        {
          producto: "Oblea arequipe",
          cantidad: 1,
          precio_unitario: catalogPrices.get("oblea arequipe")
        }
      ],
      next_expected: "pedido"
    };
  }

  if (normalized.includes("fresas con helado") && !hasFlavor(normalized)) {
    return {
      necesita_aclaracion: true,
      pregunta: "Que sabor de helado quieres?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (asksToAddOreo(normalized) && isModifierAvailableByName("Oreo", context.catalogoDisponible) === false) {
    return {
      necesita_aclaracion: true,
      needs_human: false,
      pregunta: "Oreo aparece agotado por ahora. Quieres elegir otro topping disponible?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (asksToAddOreo(normalized) && context.activeItem) {
    return {
      necesita_aclaracion: false,
      mensaje_cliente: askAnotherProductAfterModifierMessage,
      items: [
        {
          ...context.activeItem,
          toppings: [...(context.activeItem.toppings ?? []), "Oreo"]
        }
      ],
      state_patch: {
        items: [
          {
            ...context.activeItem,
            toppings: [...(context.activeItem.toppings ?? []), "Oreo"]
          }
        ],
        pedido_en_progreso: true,
        ultimo_agente: "pedido",
        ultima_pregunta_bot: "pedido_otro_producto"
      },
      next_expected: "pedido"
    };
  }

  if (asksToAddOreo(normalized) && !context.activeItem) {
    return {
      necesita_aclaracion: true,
      pregunta: "A que producto le agrego Oreo?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (normalized.includes("mas crema") && context.activeItem) {
    return {
      necesita_aclaracion: false,
      items: [
        {
          ...context.activeItem,
          adiciones: [...(context.activeItem.adiciones ?? []), "Crema adicional"]
        }
      ],
      next_expected: "pedido"
    };
  }

  if (normalized.includes("mas crema") && !context.activeItem) {
    return {
      necesita_aclaracion: true,
      pregunta: "A que producto le agrego mas crema?",
      items: [],
      next_expected: "pedido"
    };
  }

  if (hasAny(normalized, ["mejor dos", "mejor 2"]) && context.activeItem) {
    return {
      necesita_aclaracion: false,
      items: [
        {
          ...context.activeItem,
          cantidad: 2
        }
      ],
      next_expected: "pedido"
    };
  }

  return {
    necesita_aclaracion: false,
    items: [],
    next_expected: "pedido"
  };
}

export function mockHandleDatos(message: string): DatosResult {
  const normalized = normalize(message);
  const datos: DatosPedido = {
    modalidad_entrega: hasPickupIntent(normalized) ? "recoger" : "domicilio"
  };

  const nameMatch = message.match(/\bsoy\s+([A-Za-zÁÉÍÓÚáéíóúÑñ ]+?)(?:,|$)/i);
  if (nameMatch) {
    datos.nombre = nameMatch[1].trim();
  }

  const namedAsMatch = message.match(/\bme llamo\s+([A-Za-zÁÉÍÓÚáéíóúÑñ ]+?)(?:,|$)/i);
  if (namedAsMatch) {
    datos.nombre = namedAsMatch[1].trim();
  }

  const phoneMatch = message.match(/\b(?:telefono|celular|whatsapp|mi numero es)\s+(\+?\d[\d\s-]{6,})/i);
  if (phoneMatch) {
    datos.telefono = phoneMatch[1].replace(/[^\d+]/g, "");
  }

  const addressMatch = message.match(/\b(?:vivo en|direccion|dir)\s+([^,]+?)(?:,\s*barrio|\s*$)/i);
  if (addressMatch) {
    datos.direccion = addressMatch[1].trim();
  }

  const addressAndNeighborhood = extractAddressAndNeighborhood(message);
  if (addressAndNeighborhood.direccion && !datos.direccion) {
    datos.direccion = addressAndNeighborhood.direccion;
  }
  if (addressAndNeighborhood.barrio) {
    datos.barrio = addressAndNeighborhood.barrio;
  }

  if (!datos.barrio && looksLikeKnownNeighborhood(normalized)) {
    datos.barrio = message.trim();
  }

  const neighborhoodMatch = message.match(/\bbarrio\s+([^,]+)$/i);
  if (neighborhoodMatch) {
    datos.barrio = neighborhoodMatch[1].trim();
  }

  const referenceMatch = message.match(/\breferencia\s+(.+)$/i);
  if (referenceMatch) {
    datos.referencia = referenceMatch[1].trim();
  }

  if (normalized.includes("nequi")) {
    datos.metodo_pago = "nequi";
  } else if (normalized.includes("bancolombia")) {
    datos.metodo_pago = "bancolombia";
  } else if (normalized.includes("breb")) {
    datos.metodo_pago = "breb";
  } else if (normalized.includes("efectivo")) {
    datos.metodo_pago = "efectivo";
  }

  const required =
    datos.modalidad_entrega === "recoger"
      ? ["nombre", "metodo_pago"]
      : ["nombre", "direccion", "barrio", "referencia", "metodo_pago"];
  const missingFields = required.filter((field) => !datos[field as keyof DatosPedido]);
  const siguientePregunta =
    missingFields.length > 0 ? questionForMissingFields(missingFields, datos) : undefined;

  return {
    datos,
    siguiente_pregunta: siguientePregunta,
    completo: missingFields.length === 0,
    state_patch: {
      ...datos,
      ultimo_agente: "datos",
      ultima_pregunta_bot: siguientePregunta
    },
    next_expected: missingFields.length > 0 ? "datos" : "confirmacion",
    needs_human: false
  };
}

function buildTraditionalFresasPedido(): PedidoResult {
  return {
    necesita_aclaracion: false,
    items: [
      {
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        variante: "tradicional",
        precio_unitario: catalogPrices.get("fresas con crema tradicional")
      }
    ],
    state_patch: {
      pedido_en_progreso: true
    },
    next_expected: "pedido"
  };
}

function requestedUnavailableProduct(
  normalized: string,
  productName: string,
  context: ConversationContext
): boolean {
  return (
    hasAny(normalized, ["fresas tradicionales", "fresa tradicional", "fresas con crema tradicional"]) &&
    isProductAvailableByName(productName, context.catalogoDisponible) === false
  );
}

function unavailableProductReply(
  context: ConversationContext,
  productName: string
): PedidoResult {
  return {
    necesita_aclaracion: true,
    needs_human: false,
    pregunta: `${productName} aparece agotado por ahora. Disponibles: ${availableFresasOptions(
      context.catalogoDisponible
    ).join(", ")}. Cual prefieres?`,
    items: [],
    next_expected: "pedido"
  };
}

function extractAddressAndNeighborhood(message: string): Pick<DatosPedido, "direccion" | "barrio"> {
  const trimmed = message.trim();
  const parts = trimmed
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return looksLikeAddress(trimmed) ? { direccion: trimmed } : {};
  }

  const addressPart = parts.find(looksLikeAddress);
  const neighborhoodPart = parts.find((part) => part !== addressPart && !looksLikeReference(part));

  return {
    direccion: addressPart,
    barrio: neighborhoodPart
  };
}

function questionForMissingFields(fields: string[], datos: DatosPedido): string {
  if (datos.modalidad_entrega === "recoger") {
    return buildMissingDataTemplate(fields, "Perfecto, lo dejamos para recoger. Me compartes:");
  }

  if (fields.includes("direccion") || fields.includes("barrio")) {
    return fullDeliveryDataTemplate;
  }

  return buildMissingDataTemplate(fields, "Perfecto. Para el domicilio me faltan:");
}

function buildMissingDataTemplate(fields: string[], intro: string): string {
  const labels: Record<string, string> = {
    nombre: "Nombre:",
    direccion: "Direccion:",
    barrio: "Barrio:",
    referencia: "Referencia:",
    metodo_pago: "Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo"
  };

  return [intro, "", ...fields.map((field) => labels[field] ?? `${field}:`)].join("\n");
}

function classifyRoute(normalized: string, context: ConversationContext): AgentRoute {
  if (
    hasAny(normalized, ["humano", "alguien", "reembolso", "reclamo", "demora", "descuento"]) ||
    (normalized.includes("domicilio") && hasAny(normalized, ["cuanto", "costo", "cuesta", "vale"])) ||
    hasAny(normalized, [
      "cobertura",
      "zona",
      "valor de envio",
      "costo de envio",
      "cuanto cuesta el envio",
      "disponibilidad exacta",
      "disponible ahora",
      "disponible hoy",
      "entregar ya",
      "llega ya",
      "tiempo exacto"
    ])
  ) {
    return "escalamiento";
  }

  if (declinesMoreItems(normalized) && context.activeItem) {
    return "pedido";
  }

  if (askedAnotherProduct(context) && isProductOrModifierIntent(normalized)) {
    return "pedido";
  }

  if (askedAnotherProduct(context) && mentionsUnknownProduct(normalized)) {
    return "pedido";
  }

  if (askedAnotherProduct(context) && looksLikeCustomerData(normalized)) {
    return "datos";
  }

  if (
    hasAny(normalized, [
      "nequi",
      "bancolombia",
      "breb",
      "efectivo",
      "direccion",
      "barrio",
      "referencia",
      "pago",
      "domicilio",
      "telefono",
      "celular",
      "whatsapp",
      "soy ",
      "me llamo",
      "te mando la direccion"
    ]) ||
    looksLikeAddress(normalized)
  ) {
    return "datos";
  }

  if (asksCatalogQuestion(normalized)) {
    return "menu";
  }

  if (
    hasAny(normalized, ["quiero", "agregale", "agrega", "ponle", "fresas con crema", "fresas con helado", "malteada", "oblea"]) ||
    hasAny(normalized, ["fresas tradicionales", "fresa tradicional", "unas fresas"]) ||
    (isShortPedidoContinuation(normalized) && context.lastQuestion)
    || (isShortPedidoContinuation(normalized) && context.activeItem)
  ) {
    return "pedido";
  }

  if (
    hasAny(normalized, [
      "menu",
      "carta",
      "precios",
      "que venden",
      "toppings",
      "sabores",
      "cuanto vale",
      "cuanto cuesta",
      "precio",
      "vale?"
    ])
  ) {
    return "menu";
  }

  if (hasAny(normalized, ["hola", "buenas", "gracias", "ok"])) {
    return "general";
  }

  return "general";
}

function nextExpectedForRoute(route: AgentRoute): string {
  const mapping: Record<AgentRoute, string> = {
    general: "cliente",
    menu: "cliente",
    pedido: "pedido",
    datos: "datos",
    escalamiento: "humano"
  };

  return mapping[route];
}

function wantsFullMenu(normalized: string): boolean {
  return hasAny(normalized, ["menu", "carta", "pdf", "completo"]);
}

function asksCatalogQuestion(normalized: string): boolean {
  return (
    wantsFullMenu(normalized) ||
    hasAny(normalized, [
      "precios",
      "que venden",
      "toppings",
      "sabores",
      "cuanto vale",
      "cuanto cuesta",
      "precio",
      "vale?"
    ])
  );
}

function hasKnownFresasVariant(normalized: string): boolean {
  return hasAny(normalized, ["tradicional", "oreo", "chocolate", "helado", "frutos rojos"]);
}

function asksForFresasWithoutKnownVariant(normalized: string): boolean {
  return /\bfresas?\b/u.test(normalized) && !hasKnownFresasVariant(normalized);
}

function asksToAddOreo(normalized: string): boolean {
  return hasAny(normalized, ["agregale oreo", "agrega oreo", "ponle oreo", "con oreo"]) || normalized === "oreo";
}

function askedAnotherProduct(context: ConversationContext): boolean {
  const lastQuestion = normalize(context.lastQuestion ?? "");
  return (
    lastQuestion.includes("quieres agregar otro producto al pedido") ||
    lastQuestion.includes("te gustaria anadir algun otro producto")
  );
}

function isProductOrModifierIntent(normalized: string): boolean {
  return (
    hasAny(normalized, [
      "quiero",
      "me das",
      "me regalas",
      "agregale",
      "agrega",
      "ponle",
      "con ",
      "fresas",
      "malteada",
      "oblea",
      "wafle",
      "waffle",
      "brownie",
      "pavlova",
      "vaso",
      "helado",
      "oreo",
      "crema",
      "topping",
      "adicion"
    ]) || isShortPedidoContinuation(normalized)
  );
}

function mentionsUnknownProduct(normalized: string): boolean {
  return hasAny(normalized, ["chocomix", "choco mix", "choco-mix"]);
}

function isUnsupportedProductRequest(normalized: string): boolean {
  if (!hasOrderIntent(normalized)) {
    return false;
  }

  return !hasKnownCatalogIntent(normalized);
}

function hasOrderIntent(normalized: string): boolean {
  return hasAny(normalized, ["quiero", "me das", "me regalas", "voy a pedir", "pideme"]);
}

function hasKnownCatalogIntent(normalized: string): boolean {
  return hasAny(normalized, [
    "fresa",
    "fresas",
    "durazno",
    "banano",
    "banana",
    "maracufresa",
    "love banana",
    "oblea",
    "malteada",
    "brownie",
    "wafle",
    "waffle",
    "vaso fantasia",
    "vaso helado",
    "vaso waffle",
    "pavlova"
  ]);
}

function includesTraditionalVariant(normalized: string, context: ConversationContext): boolean {
  return (
    hasAny(normalized, ["fresas tradicionales", "fresa tradicional", "fresas con crema tradicional"]) ||
    (normalized.includes("tradicional") &&
      normalize(context.lastQuestion ?? "").includes("variante"))
  );
}

function looksLikeCustomerData(normalized: string): boolean {
  return (
    hasAny(normalized, [
      "nequi",
      "bancolombia",
      "breb",
      "efectivo",
      "direccion",
      "barrio",
      "referencia",
      "pago",
      "domicilio",
      "telefono",
      "celular",
      "whatsapp",
      "soy ",
      "me llamo",
      "edificio",
      "torre",
      "apto",
      "apartamento",
      "porteria",
      "casa",
      "conjunto",
      "te mando la direccion"
    ]) ||
    looksLikeAddress(normalized) ||
    looksLikeKnownNeighborhood(normalized) ||
    looksLikePersonName(normalized)
  );
}

function looksLikePersonName(normalized: string): boolean {
  if (hasAny(normalized, ["fresa", "fresas", "oreo", "wafle", "waffle", "malteada", "oblea", "helado"])) {
    return false;
  }

  return /^[a-z]+(?:\s+[a-z]+){1,3}$/u.test(normalized);
}

function isShortPedidoContinuation(normalized: string): boolean {
  return hasAny(normalized, [
    "tradicional",
    "vainilla",
    "oreo",
    "chocolate",
    "fresa",
    "arequipe",
    "nutella",
    "dos",
    "una",
    "mejor dos",
    "mejor 2"
  ]);
}

function declinesMoreItems(normalized: string): boolean {
  return /^(no|nada mas|solo eso|asi|asi esta|listo|ya|ya no)$/u.test(normalized);
}

function hasPickupIntent(normalized: string): boolean {
  return hasAny(normalized, ["recoger", "recojo", "paso por", "voy por"]);
}

function looksLikeAddress(value: string): boolean {
  return /\b(cra|carrera|calle|cll|avenida|av|transversal|tv|diagonal|dg)\b.*[#0-9]/iu.test(value);
}

function looksLikeReference(value: string): boolean {
  return hasAny(normalize(value), ["referencia", "apartamento", "apto", "torre", "porteria", "casa", "local"]);
}

function looksLikeKnownNeighborhood(value: string): boolean {
  return hasAny(value, ["cabecera del llano"]);
}

function hasAny(value: string, keywords: string[]): boolean {
  return keywords.some((keyword) => value.includes(keyword));
}

function hasFlavor(value: string): boolean {
  return /\b(fresa|chocolate|vainilla|oreo)\b/u.test(value);
}

function flavorFromMessage(value: string): "Fresa" | "Chocolate" | "Vainilla" | "Oreo" {
  if (value.includes("chocolate")) {
    return "Chocolate";
  }

  if (value.includes("vainilla")) {
    return "Vainilla";
  }

  if (value.includes("oreo")) {
    return "Oreo";
  }

  return "Fresa";
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}
