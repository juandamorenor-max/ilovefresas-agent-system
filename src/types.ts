export type AgentRoute = "general" | "menu" | "pedido" | "datos" | "escalamiento";

export interface RouterResult {
  route: AgentRoute;
  confidence: number;
  reason: string;
  mensaje_cliente: string;
  enviar_menu: boolean;
  needs_human: boolean;
  pedido_confirmado: boolean;
  state_patch?: Record<string, unknown>;
  next_expected?: string;
}

export interface MenuResult {
  enviar_menu: boolean;
  respuesta: string;
}

export interface PedidoItem {
  producto: string;
  cantidad?: number;
  variante?: string;
  sabor?: string;
  toppings?: string[];
  adiciones?: string[];
  precio_unitario?: number;
}

export interface PedidoResult {
  necesita_aclaracion: boolean;
  mensaje_cliente?: string;
  pregunta?: string;
  items: PedidoItem[];
  needs_human?: boolean;
  state_patch?: Record<string, unknown>;
  next_expected?: string;
}

export interface DashboardProductAvailability {
  id: string;
  name: string;
  category?: string;
  basePrice?: number;
  price?: number;
  isActive?: boolean;
  isOutOfStock?: boolean;
  availabilityStatus?: "available" | "out_of_stock" | "hidden" | string;
}

export interface DashboardModifierAvailability {
  id?: string;
  name: string;
  priceDelta?: number;
  price?: number;
  isActive?: boolean;
  modifierGroupId?: string;
}

export interface AvailableCatalogItem {
  id: string;
  name: string;
  category?: string;
  price: number;
  isActive: boolean;
  isOutOfStock: boolean;
  availabilityStatus: "available" | "out_of_stock" | "hidden";
}

export interface AvailableModifierItem {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
  kind: "topping" | "adicion";
}

export interface AvailableCatalogContext {
  productos: AvailableCatalogItem[];
  toppings: AvailableModifierItem[];
  adiciones: AvailableModifierItem[];
  unavailableProducts?: AvailableCatalogItem[];
  unavailableModifiers?: AvailableModifierItem[];
}

export interface DatosPedido {
  modalidad_entrega?: "domicilio" | "recoger";
  nombre?: string;
  telefono?: string;
  direccion?: string;
  barrio?: string;
  referencia?: string;
  metodo_pago?: "nequi" | "bancolombia" | "breb" | "efectivo";
}

export interface OrderReviewSummary {
  readyForReview: boolean;
  missingFields: string[];
  summaryText: string;
}

export interface OrderPricingSummary {
  canCalculate: boolean;
  subtotalProductos: number;
  domicilio: number;
  total: number;
  missingPriceItems: string[];
}

export interface CustomerConfirmationSummary {
  readyForCustomerConfirmation: boolean;
  missingFields: string[];
  pricing: OrderPricingSummary;
  messageText: string;
}

export interface PaymentInstructions {
  requiresProof: boolean;
  messageText: string;
}

export interface ClosingDecision {
  shouldClose: boolean;
  reason?: "customer_declined_more_help" | "closing_prompt_timeout";
}

export interface DatosResult {
  datos: DatosPedido;
  siguiente_pregunta?: string;
  completo: boolean;
  state_patch?: Record<string, unknown>;
  next_expected?: string;
  needs_human?: boolean;
}

export interface ConversationContext {
  lastQuestion?: string;
  activeItem?: PedidoItem;
  catalogoDisponible?: AvailableCatalogContext;
}

export interface ConversationCase<TExpected = unknown> {
  name: string;
  messages: string[];
  expected: TExpected;
  context?: ConversationContext;
}

export interface FlowisePredictionRequest {
  question: string;
  sessionId: string;
  catalogoDisponible?: string | AvailableCatalogContext;
  conversationState?: FlowiseConversationState;
}

export interface FlowisePredictionResponse {
  text?: string;
  json?: unknown;
  [key: string]: unknown;
}

export interface FlowiseConversationState {
  route?: string;
  confidence?: string | number;
  reason?: string;
  mensaje_cliente?: string;
  nombre?: string;
  telefono?: string;
  direccion?: string;
  barrio?: string;
  referencia?: string;
  metodo_pago?: string;
  items?: string;
  pedido_confirmado?: string | boolean;
  needs_human?: string | boolean;
  enviar_menu?: string | boolean;
  phone?: string;
  channel?: string;
  menu_topic?: string;
  ultima_pregunta_bot?: string;
  ultimo_agente?: string;
  pedido_en_progreso?: string | boolean;
  modalidad_entrega?: string;
  next_expected?: string;
  comprobante_pago_recibido?: string | boolean;
}
