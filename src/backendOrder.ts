import type { AgentRoute, DatosPedido, PedidoItem } from "./types.js";
import { isKnownProductName } from "./availabilityCatalog.js";
import { buildCustomerConfirmationSummary, buildOrderReviewSummary } from "./orderLifecycle.js";

export type ConversationChannel = "telegram" | "whatsapp";

export type CanonicalOrderStatus =
  | "open"
  | "collecting_order"
  | "collecting_data"
  | "ready_for_customer_confirmation"
  | "ready_for_review"
  | "sent_for_review"
  | "closing_prompt_sent"
  | "closed"
  | "escalated"
  | "cancelled";

export type BackendNextAction =
  | "ask_for_order"
  | "ask_for_data"
  | "ask_customer_confirmation"
  | "send_to_review"
  | "escalate_to_human"
  | "reply";

export interface CanonicalOrderState {
  conversationId: string;
  channel: ConversationChannel;
  channelContact?: string;
  status: CanonicalOrderStatus;
  items: PedidoItem[];
  datos: DatosPedido;
  observaciones: string[];
  humanReviewReasons: string[];
  lastRoute?: AgentRoute;
  customerConfirmed?: boolean;
}

export interface FlowiseTurnProposal {
  route: AgentRoute;
  confidence: number;
  reason: string;
  items?: PedidoItem[];
  datos?: DatosPedido;
  observaciones?: string[];
  pedido_confirmado?: boolean;
  needs_human?: boolean;
}

export interface BackendOrderDecision {
  state: CanonicalOrderState;
  nextAction: BackendNextAction;
  missingFields: string[];
  readyForReview: boolean;
  summaryText?: string;
  customerSummaryText?: string;
}

export interface SanitizeItemsResult {
  acceptedItems: PedidoItem[];
  rejectedItems: PedidoItem[];
}

export function createEmptyOrderState(input: {
  conversationId: string;
  channel: ConversationChannel;
  channelContact?: string;
}): CanonicalOrderState {
  return {
    conversationId: input.conversationId,
    channel: input.channel,
    channelContact: input.channelContact,
    status: "open",
    items: [],
    datos: {},
    observaciones: [],
    humanReviewReasons: []
  };
}

export function applyFlowiseTurn(
  current: CanonicalOrderState,
  proposal: FlowiseTurnProposal
): BackendOrderDecision {
  const sanitizedItems = sanitizeProposedItems(proposal.items ?? []);
  const nextState: CanonicalOrderState = {
    ...current,
    lastRoute: proposal.route,
    items: mergeItems(current.items, sanitizedItems.acceptedItems),
    datos: {
      ...current.datos,
      ...removeEmptyData(proposal.datos ?? {})
    },
    observaciones: mergeUnique(current.observaciones, proposal.observaciones ?? []),
    humanReviewReasons: mergeUnique(
      current.humanReviewReasons,
      rejectedItemReasons(sanitizedItems.rejectedItems)
    ),
    customerConfirmed: nextCustomerConfirmed(current, proposal)
  };

  if (sanitizedItems.rejectedItems.length > 0 || shouldEscalate(proposal)) {
    nextState.status = "escalated";
    if (shouldEscalate(proposal)) {
      nextState.humanReviewReasons = mergeUnique(nextState.humanReviewReasons, [
        escalationReason(proposal)
      ]);
    }

    return evaluateCanonicalOrder(nextState);
  }

  return evaluateCanonicalOrder(nextState);
}

export function sanitizeProposedItems(items: PedidoItem[]): SanitizeItemsResult {
  return items.reduce<SanitizeItemsResult>(
    (result, item) => {
      if (!item.producto || !isKnownProductName(item.producto)) {
        return {
          ...result,
          rejectedItems: [...result.rejectedItems, item]
        };
      }

      return {
        ...result,
        acceptedItems: [...result.acceptedItems, item]
      };
    },
    { acceptedItems: [], rejectedItems: [] }
  );
}

export function evaluateCanonicalOrder(state: CanonicalOrderState): BackendOrderDecision {
  if (state.status === "escalated") {
    return {
      state,
      nextAction: "escalate_to_human",
      missingFields: [],
      readyForReview: false
    };
  }

  const summary = buildOrderReviewSummary({
    items: state.items,
    datos: state.datos,
    channelContact: state.channelContact,
    observaciones: state.observaciones
  });

  if (summary.readyForReview) {
    const customerSummary = buildCustomerConfirmationSummary({
      items: state.items,
      datos: state.datos,
      channelContact: state.channelContact,
      observaciones: state.observaciones
    });

    if (!customerSummary.pricing.canCalculate) {
      const escalatedState: CanonicalOrderState = {
        ...state,
        status: "escalated",
        humanReviewReasons: mergeUnique(state.humanReviewReasons, [
          `missing_price:${customerSummary.pricing.missingPriceItems.join(",")}`
        ])
      };

      return {
        state: escalatedState,
        nextAction: "escalate_to_human",
        missingFields: customerSummary.missingFields,
        readyForReview: false,
        summaryText: summary.summaryText
      };
    }

    if (state.customerConfirmed) {
      const readyState = { ...state, status: "ready_for_review" as const };
      return {
        state: readyState,
        nextAction: "send_to_review",
        missingFields: [],
        readyForReview: true,
        summaryText: summary.summaryText,
        customerSummaryText: customerSummary.messageText
      };
    }

    const confirmationState = {
      ...state,
      status: "ready_for_customer_confirmation" as const
    };

    return {
      state: confirmationState,
      nextAction: "ask_customer_confirmation",
      missingFields: [],
      readyForReview: false,
      summaryText: summary.summaryText,
      customerSummaryText: customerSummary.messageText
    };
  }

  const nextStatus: CanonicalOrderStatus =
    state.items.length === 0 || summary.missingFields.includes("productos")
      ? "collecting_order"
      : "collecting_data";

  const pendingState = { ...state, status: nextStatus };

  return {
    state: pendingState,
    nextAction: nextStatus === "collecting_order" ? "ask_for_order" : "ask_for_data",
    missingFields: summary.missingFields,
    readyForReview: false,
    summaryText: summary.summaryText
  };
}

function nextCustomerConfirmed(
  current: CanonicalOrderState,
  proposal: FlowiseTurnProposal
): boolean {
  if (proposal.pedido_confirmado === true) {
    return true;
  }

  if ((proposal.items?.length ?? 0) > 0 || Object.keys(proposal.datos ?? {}).length > 0) {
    return false;
  }

  return current.customerConfirmed ?? false;
}

function shouldEscalate(proposal: FlowiseTurnProposal): boolean {
  return proposal.route === "escalamiento" || proposal.needs_human === true || proposal.confidence < 0.55;
}

function escalationReason(proposal: FlowiseTurnProposal): string {
  if (proposal.route === "escalamiento") {
    return proposal.reason || "route_escalamiento";
  }

  if (proposal.needs_human) {
    return proposal.reason || "flowise_needs_human";
  }

  return `low_confidence:${proposal.confidence}`;
}

function rejectedItemReasons(items: PedidoItem[]): string[] {
  return items.map((item) => `unknown_product:${item.producto || "sin_nombre"}`);
}

function mergeItems(current: PedidoItem[], incoming: PedidoItem[]): PedidoItem[] {
  return incoming.reduce((items, item) => upsertItem(items, item), current);
}

function upsertItem(items: PedidoItem[], item: PedidoItem): PedidoItem[] {
  if (!item.producto) {
    return items;
  }

  const key = itemKey(item);
  const index = items.findIndex((existing) => itemKey(existing) === key);

  if (index === -1) {
    return [...items, item];
  }

  return items.map((existing, currentIndex) =>
    currentIndex === index
      ? {
          ...existing,
          ...item,
          toppings: mergeUnique(existing.toppings ?? [], item.toppings ?? []),
          adiciones: mergeUnique(existing.adiciones ?? [], item.adiciones ?? [])
        }
      : existing
  );
}

function itemKey(item: PedidoItem): string {
  return [item.producto, item.variante, item.sabor].map((value) => normalizeKey(value ?? "")).join("|");
}

function removeEmptyData(datos: DatosPedido): DatosPedido {
  return Object.fromEntries(
    Object.entries(datos).filter(([, value]) => value !== undefined && value !== "")
  ) as DatosPedido;
}

function mergeUnique<T>(current: T[], incoming: T[]): T[] {
  return [...new Set([...current, ...incoming])];
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}
