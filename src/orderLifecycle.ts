import type {
  ClosingDecision,
  CustomerConfirmationSummary,
  DatosPedido,
  OrderPricingSummary,
  OrderReviewSummary,
  PaymentInstructions,
  PedidoItem
} from "./types.js";

export interface OrderReviewInput {
  items: PedidoItem[];
  datos: DatosPedido;
  channelContact?: string;
  observaciones?: string[];
}

export const DEFAULT_DELIVERY_FEE = 5000;

export const PAYMENT_ACCOUNTS = {
  nequi: "3000000000",
  bancolombia: "72600000000",
  breb: "@test"
} as const;

const toppingPrices = new Map<string, number>([
  ["leche condensada", 2000],
  ["arequipe", 2000],
  ["oreo", 2000],
  ["merengue", 2000],
  ["brownie", 2000],
  ["salsa hershey", 2000],
  ["chips de chocolate negro", 2000],
  ["chips de chocolate blancos", 2000],
  ["chips de chocolate colores", 2000],
  ["krispi", 2000],
  ["milo", 2000],
  ["coco", 2000],
  ["choco crispi", 2000],
  ["mym", 3000],
  ["chokis", 3000]
]);

const additionPrices = new Map<string, number>([
  ["helado", 4000],
  ["queso", 4000],
  ["nutella", 4000],
  ["chocorramo", 4000],
  ["crema adicional", 4000],
  ["barquillo", 4000],
  ["cerezas", 4000],
  ["arandanos", 4000],
  ["dulce de mora", 3000]
]);

export interface ClosingPromptInput {
  orderSentAt: Date;
  closingPromptSentAt?: Date;
  now: Date;
  delayMinutes?: number;
}

export interface ClosingDecisionInput {
  lastCustomerMessage?: string;
  closingPromptSentAt?: Date;
  now: Date;
  timeoutMinutes?: number;
}

const requiredDataFields: Array<keyof DatosPedido> = [
  "nombre",
  "direccion",
  "barrio",
  "referencia",
  "metodo_pago"
];

export function buildOrderReviewSummary(input: OrderReviewInput): OrderReviewSummary {
  const missingFields = getMissingOrderFields(input.items, input.datos, input.channelContact);
  const readyForReview = missingFields.length === 0;

  return {
    readyForReview,
    missingFields,
    summaryText: renderSummary(input, missingFields, readyForReview)
  };
}

export function calculateOrderPricing(
  items: PedidoItem[],
  deliveryFee = DEFAULT_DELIVERY_FEE
): OrderPricingSummary {
  const missingPriceItems = items.flatMap(missingPricesForItem);

  const subtotalProductos = items.reduce((total, item) => total + itemTotal(item), 0);

  const canCalculate = missingPriceItems.length === 0;

  return {
    canCalculate,
    subtotalProductos,
    domicilio: deliveryFee,
    total: canCalculate ? subtotalProductos + deliveryFee : 0,
    missingPriceItems
  };
}

export function buildCustomerConfirmationSummary(
  input: OrderReviewInput,
  deliveryFee = DEFAULT_DELIVERY_FEE
): CustomerConfirmationSummary {
  const reviewSummary = buildOrderReviewSummary(input);
  const pricing = calculateOrderPricing(input.items, deliveryFee);
  const readyForCustomerConfirmation = reviewSummary.readyForReview && pricing.canCalculate;

  return {
    readyForCustomerConfirmation,
    missingFields: [
      ...reviewSummary.missingFields,
      ...pricing.missingPriceItems.map((item) => `precio de ${item}`)
    ],
    pricing,
    messageText: readyForCustomerConfirmation
      ? renderCustomerConfirmation(input, pricing)
      : "Aun faltan datos o precios para armar el resumen final del pedido."
  };
}

export function paymentRequiresProof(method?: DatosPedido["metodo_pago"]): boolean {
  return method === "nequi" || method === "bancolombia" || method === "breb";
}

export function buildPaymentInstructions(
  method: DatosPedido["metodo_pago"],
  total: number
): PaymentInstructions {
  if (method === "nequi") {
    return {
      requiresProof: true,
      messageText: [
        "Perfecto. Para continuar con la revision del pedido, puedes hacer la transferencia por Nequi:",
        "",
        `Nequi: ${PAYMENT_ACCOUNTS.nequi}`,
        `Total: ${total}`,
        "",
        "Cuando la hagas, enviame el comprobante por aqui."
      ].join("\n")
    };
  }

  if (method === "bancolombia") {
    return {
      requiresProof: true,
      messageText: [
        "Perfecto. Para continuar con la revision del pedido, puedes hacer la transferencia a Bancolombia:",
        "",
        `Cuenta Bancolombia: ${PAYMENT_ACCOUNTS.bancolombia}`,
        `Total: ${total}`,
        "",
        "Cuando la hagas, enviame el comprobante por aqui."
      ].join("\n")
    };
  }

  if (method === "breb") {
    return {
      requiresProof: true,
      messageText: [
        "Perfecto. Para continuar con la revision del pedido, puedes hacer la transferencia por Bre-B:",
        "",
        `Llave Bre-B: ${PAYMENT_ACCOUNTS.breb}`,
        `Total: ${total}`,
        "",
        "Cuando la hagas, enviame el comprobante por aqui."
      ].join("\n")
    };
  }

  return {
    requiresProof: false,
    messageText:
      "Perfecto, dejamos el pago en efectivo. Dejo tu pedido en revision con el equipo."
  };
}

export function shouldSendClosingPrompt(input: ClosingPromptInput): boolean {
  if (input.closingPromptSentAt) {
    return false;
  }

  const delayMinutes = input.delayMinutes ?? 60;
  return minutesBetween(input.orderSentAt, input.now) >= delayMinutes;
}

export function buildClosingMessage(): string {
  return "Necesitas algo mas?";
}

export function shouldCloseConversation(input: ClosingDecisionInput): ClosingDecision {
  if (input.lastCustomerMessage && customerDeclinesMoreHelp(input.lastCustomerMessage)) {
    return {
      shouldClose: true,
      reason: "customer_declined_more_help"
    };
  }

  if (!input.closingPromptSentAt) {
    return { shouldClose: false };
  }

  const timeoutMinutes = input.timeoutMinutes ?? 30;
  if (minutesBetween(input.closingPromptSentAt, input.now) >= timeoutMinutes) {
    return {
      shouldClose: true,
      reason: "closing_prompt_timeout"
    };
  }

  return { shouldClose: false };
}

function getMissingOrderFields(
  items: PedidoItem[],
  datos: DatosPedido,
  channelContact?: string
): string[] {
  const missing = new Set<string>();

  if (items.length === 0) {
    missing.add("productos");
  }

  for (const [index, item] of items.entries()) {
    const itemLabel = item.producto || `item ${index + 1}`;

    if (!item.producto) {
      missing.add("producto");
    }

    if (!item.cantidad) {
      missing.add(`cantidad de ${itemLabel}`);
    }

    if (requiresFlavor(item) && !item.sabor) {
      missing.add(`sabor de ${itemLabel}`);
    }
  }

  for (const field of requiredDataFields) {
    if (!datos[field]) {
      missing.add(field);
    }
  }

  if (!datos.telefono && !channelContact) {
    missing.add("contacto de canal");
  }

  return [...missing];
}

function renderSummary(
  input: OrderReviewInput,
  missingFields: string[],
  readyForReview: boolean
): string {
  const itemsText =
    input.items.length > 0
      ? input.items.map(renderItem).join("\n")
      : "- Sin productos claros todavia";

  const datos = input.datos;
  const observations =
    input.observaciones && input.observaciones.length > 0
      ? input.observaciones.join("; ")
      : "Sin observaciones adicionales";

  const missingText =
    missingFields.length > 0 ? missingFields.join(", ") : "Ninguno";

  return [
    "Resumen del pedido para revisión:",
    "",
    "Productos:",
    itemsText,
    "",
    `Cliente: ${datos.nombre ?? "pendiente"}`,
    `Contacto: ${datos.telefono ?? input.channelContact ?? "pendiente"}`,
    `Dirección: ${datos.direccion ?? "pendiente"}`,
    `Barrio/zona: ${datos.barrio ?? "pendiente"}`,
    `Referencia: ${datos.referencia ?? "pendiente"}`,
    `Método de pago: ${datos.metodo_pago ?? "pendiente"}`,
    `Observaciones: ${observations}`,
    "",
    `Faltantes: ${missingText}`,
    readyForReview
      ? "Estado: listo para revisión del operario."
      : "Estado: faltan datos antes de enviar a revisión."
  ].join("\n");
}

function renderCustomerConfirmation(
  input: OrderReviewInput,
  pricing: OrderPricingSummary
): string {
  const datos = input.datos;
  const itemsText = input.items.map(renderItemWithPrice).join("\n");
  const observations =
    input.observaciones && input.observaciones.length > 0
      ? input.observaciones.join("; ")
      : "Sin observaciones adicionales";

  return [
    "Resumen de tu pedido:",
    "",
    itemsText,
    "",
    `Nombre: ${datos.nombre}`,
    `Contacto: ${datos.telefono ?? input.channelContact}`,
    `Direccion: ${datos.direccion}`,
    `Barrio/zona: ${datos.barrio}`,
    `Referencia: ${datos.referencia ?? "Sin referencia"}`,
    `Metodo de pago: ${datos.metodo_pago}`,
    `Observaciones: ${observations}`,
    "",
    `Subtotal productos: ${pricing.subtotalProductos}`,
    `Domicilio: ${pricing.domicilio}`,
    `Total: ${pricing.total}`,
    "",
    "Esta correcto para dejarlo en revision con el equipo?"
  ].join("\n");
}

function renderItem(item: PedidoItem): string {
  const parts = [
    `${item.cantidad ?? "?"} x ${item.producto}`,
    item.variante ? `variante ${item.variante}` : undefined,
    item.sabor ? `sabor ${item.sabor}` : undefined,
    item.toppings?.length ? `toppings: ${item.toppings.join(", ")}` : undefined,
    item.adiciones?.length ? `adiciones: ${item.adiciones.join(", ")}` : undefined
  ].filter(Boolean);

  return `- ${parts.join(" | ")}`;
}

function renderItemWithPrice(item: PedidoItem): string {
  const quantity = item.cantidad ?? 0;
  const lineTotal = itemTotal(item);
  const parts = [
    `${quantity} x ${item.producto}`,
    item.variante ? `variante ${item.variante}` : undefined,
    item.sabor ? `sabor ${item.sabor}` : undefined,
    item.toppings?.length ? `toppings: ${item.toppings.join(", ")}` : undefined,
    item.adiciones?.length ? `adiciones: ${item.adiciones.join(", ")}` : undefined,
    `subtotal: ${lineTotal}`
  ].filter(Boolean);

  return `- ${parts.join(" | ")}`;
}

function itemTotal(item: PedidoItem): number {
  if (!item.precio_unitario || !item.cantidad) {
    return 0;
  }

  const toppingsTotal = (item.toppings ?? []).reduce(
    (total, topping) => total + (toppingPrices.get(normalizeKey(topping)) ?? 0),
    0
  );
  const additionsTotal = (item.adiciones ?? []).reduce(
    (total, addition) => total + (additionPrices.get(normalizeKey(addition)) ?? 0),
    0
  );

  return (item.precio_unitario + toppingsTotal + additionsTotal) * item.cantidad;
}

function missingPricesForItem(item: PedidoItem): string[] {
  const missing: string[] = [];

  if (item.precio_unitario === undefined || item.precio_unitario <= 0) {
    missing.push(item.producto);
  }

  for (const topping of item.toppings ?? []) {
    if (!toppingPrices.has(normalizeKey(topping))) {
      missing.push(`topping ${topping} en ${item.producto}`);
    }
  }

  for (const addition of item.adiciones ?? []) {
    if (!additionPrices.has(normalizeKey(addition))) {
      missing.push(`adicion ${addition} en ${item.producto}`);
    }
  }

  return missing;
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function requiresFlavor(item: PedidoItem): boolean {
  const normalized = item.producto.toLowerCase();
  return normalized.includes("malteada") || normalized.includes("helado");
}

function customerDeclinesMoreHelp(message: string): boolean {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  return [
    "no",
    "no gracias",
    "nada mas",
    "eso es todo",
    "asi esta bien",
    "listo gracias"
  ].some((phrase) => normalized.includes(phrase));
}

function minutesBetween(from: Date, to: Date): number {
  return (to.getTime() - from.getTime()) / 60000;
}
