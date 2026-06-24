import {
  applyFlowiseTurn,
  createEmptyOrderState,
  type BackendOrderDecision,
  type CanonicalOrderState,
  type ConversationChannel
} from "./backendOrder.js";
import {
  mockHandleDatos,
  mockHandleMenu,
  mockHandlePedido,
  mockRouteMessage
} from "./conversationRunner.js";
import type { AgentRoute, ConversationContext, PedidoItem } from "./types.js";

const welcomeMessage =
  "Hola! Bienvenido a I Love Fresas Barranquilla. Las mejores fresas de Barranquilla. Que se te antoja hoy?";

export interface MultiTurnConversationOptions {
  conversationId: string;
  channel: ConversationChannel;
  channelContact?: string;
}

export interface MultiTurnConversationTurn {
  customerMessage: string;
  route: AgentRoute;
  customerReply: string;
  state: CanonicalOrderState;
  decision: BackendOrderDecision;
}

export interface MultiTurnConversationResult {
  turns: MultiTurnConversationTurn[];
  state: CanonicalOrderState;
  finalDecision: BackendOrderDecision;
}

export function runMockMultiTurnConversation(
  messages: string[],
  options: MultiTurnConversationOptions
): MultiTurnConversationResult {
  let state = createEmptyOrderState(options);
  let decision = applyFlowiseTurn(state, {
    route: "general",
    confidence: 0.9,
    reason: "initial evaluation"
  });
  let context: ConversationContext = {};
  const turns: MultiTurnConversationTurn[] = [];

  for (const customerMessage of messages) {
    if (state.status === "ready_for_customer_confirmation" && isCustomerConfirmation(customerMessage)) {
      const turn = handleCustomerConfirmation(customerMessage, state);
      state = turn.decision.state;
      decision = turn.decision;
      turns.push(turn);
      continue;
    }

    if (state.status === "awaiting_payment_proof") {
      const turn = handlePaymentProofTurn(customerMessage, state);
      state = turn.decision.state;
      decision = turn.decision;
      turns.push(turn);
      continue;
    }

    const routeResult = mockRouteMessage(customerMessage, context);
    const turn = handleTurn(customerMessage, routeResult.route, state, context);

    state = turn.decision.state;
    decision = turn.decision;
    context = updateContext(context, turn);
    turns.push(turn);
  }

  return {
    turns,
    state,
    finalDecision: decision
  };
}

function handleCustomerConfirmation(
  customerMessage: string,
  state: CanonicalOrderState
): MultiTurnConversationTurn {
  const decision = applyFlowiseTurn(state, {
    route: "general",
    confidence: 0.95,
    reason: "customer confirmed order summary",
    pedido_confirmado: true
  });

  return {
    customerMessage,
    route: "general",
    customerReply: replyFromDecision(decision),
    state: decision.state,
    decision
  };
}

function handlePaymentProofTurn(
  customerMessage: string,
  state: CanonicalOrderState
): MultiTurnConversationTurn {
  const paymentProofReceived = isPaymentProof(customerMessage);
  const decision = applyFlowiseTurn(state, {
    route: "general",
    confidence: 0.95,
    reason: paymentProofReceived
      ? "customer sent payment proof"
      : "customer has not sent payment proof",
    comprobante_pago_recibido: paymentProofReceived
  });

  return {
    customerMessage,
    route: "general",
    customerReply: paymentProofReceived
      ? replyFromDecision(decision)
      : "Para dejar tu pedido en revision, enviame el comprobante del pago por aqui.",
    state: decision.state,
    decision
  };
}

function handleTurn(
  customerMessage: string,
  route: AgentRoute,
  state: CanonicalOrderState,
  context: ConversationContext
): MultiTurnConversationTurn {
  if (route === "pedido") {
    const pedido = mockHandlePedido(customerMessage, context);
    const decision = applyFlowiseTurn(state, {
      route,
      confidence: 0.9,
      reason: "mock pedido turn",
      items: normalizeItems(pedido.items)
    });

    return {
      customerMessage,
      route,
      customerReply: pedido.mensaje_cliente ?? pedido.pregunta ?? replyFromDecision(decision),
      state: decision.state,
      decision
    };
  }

  if (route === "datos") {
    const datosResult = mockHandleDatos(customerMessage);
    const decision = applyFlowiseTurn(state, {
      route,
      confidence: 0.9,
      reason: "mock datos turn",
      datos: datosResult.datos
    });

    return {
      customerMessage,
      route,
      customerReply: replyFromDecision(decision),
      state: decision.state,
      decision
    };
  }

  if (route === "menu") {
    const menu = mockHandleMenu(customerMessage);
    const decision = applyFlowiseTurn(state, {
      route,
      confidence: 0.9,
      reason: "mock menu turn"
    });

    return {
      customerMessage,
      route,
      customerReply: menu.respuesta,
      state: decision.state,
      decision
    };
  }

  if (route === "escalamiento") {
    const decision = applyFlowiseTurn(state, {
      route,
      confidence: 0.9,
      reason: "mock escalation turn",
      needs_human: true
    });

    return {
      customerMessage,
      route,
      customerReply: "Te paso con una persona del equipo para revisar eso bien.",
      state: decision.state,
      decision
    };
  }

  const decision = applyFlowiseTurn(state, {
    route,
    confidence: 0.85,
    reason: "mock general turn"
  });

  return {
    customerMessage,
    route,
    customerReply: welcomeMessage,
    state: decision.state,
    decision
  };
}

function updateContext(
  context: ConversationContext,
  turn: MultiTurnConversationTurn
): ConversationContext {
  const activeItem = latestItem(turn.state.items) ?? context.activeItem;
  const nextContext: ConversationContext = {
    ...context,
    activeItem
  };

  if (turn.route === "pedido" && turn.decision.missingFields.some((field) => field.startsWith("cantidad de"))) {
    nextContext.lastQuestion = "Que cantidad quieres?";
  } else if (turn.route === "pedido" && turn.customerReply.includes("opciones de fresas")) {
    nextContext.lastQuestion = "Que variante de fresas con crema quieres?";
  } else if (turn.route === "pedido" && turn.customerReply.includes("tipo de oblea")) {
    nextContext.lastQuestion = "Que tipo de oblea quieres?";
  } else if (turn.route === "pedido" && turn.customerReply.includes("sabor")) {
    nextContext.lastQuestion = turn.customerReply;
  } else if (turn.route === "pedido") {
    nextContext.lastQuestion = undefined;
  }

  return nextContext;
}

function replyFromDecision(decision: BackendOrderDecision): string {
  if (decision.nextAction === "ask_customer_confirmation") {
    return decision.customerSummaryText ?? "Esta correcto para dejarlo en revision con el equipo?";
  }

  if (decision.nextAction === "send_to_review") {
    return "Listo, dejo tu pedido en revision con el equipo. Te confirmamos por aqui antes de prepararlo.";
  }

  if (decision.nextAction === "ask_payment_proof") {
    return (
      decision.paymentInstructionsText ??
      "Para continuar con la revision del pedido, enviame el comprobante del pago por aqui."
    );
  }

  if (decision.nextAction === "escalate_to_human") {
    return "Te paso con una persona del equipo para revisar eso bien.";
  }

  if (decision.nextAction === "ask_for_order") {
    return "Que te gustaria pedir?";
  }

  return questionForMissingField(decision.missingFields[0]);
}

function isCustomerConfirmation(message: string): boolean {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  return ["si", "correcto", "listo", "asi esta bien", "confirmo"].some(
    (phrase) => normalized === phrase || normalized.includes(phrase)
  );
}

function isPaymentProof(message: string): boolean {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

  return [
    "comprobante",
    "soporte",
    "transferencia hecha",
    "ya pague",
    "ya lo pague",
    "te envio el pago",
    "adjunto"
  ].some((phrase) => normalized.includes(phrase));
}

function questionForMissingField(field?: string): string {
  if (!field) {
    return "Me regalas el siguiente dato?";
  }

  if (field.startsWith("cantidad de")) {
    return "Cuantas unidades quieres?";
  }

  if (field.startsWith("sabor de")) {
    return "Que sabor quieres?";
  }

  const questions: Record<string, string> = {
    productos: "Que te gustaria pedir?",
    nombre: "Me regalas tu nombre?",
    direccion: "Me regalas la direccion?",
    barrio: "En que barrio o zona estas?",
    referencia: "Me regalas una referencia para ubicar la direccion?",
    metodo_pago: "Como vas a pagar: Nequi, Bancolombia, Breb o efectivo?",
    "contacto de canal": "Me regalas tu telefono o WhatsApp?"
  };

  return questions[field] ?? "Me regalas el siguiente dato?";
}

function normalizeItems(items: PedidoItem[]): PedidoItem[] {
  return items.map((item) => ({
    ...item,
    cantidad: item.cantidad ?? 1
  }));
}

function latestItem(items: PedidoItem[]): PedidoItem | undefined {
  return items.at(-1);
}
