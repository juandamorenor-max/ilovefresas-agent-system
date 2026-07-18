import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "flowise", "exports", "agentflow-e52f27b3-2026-07-17-before-agents-migration.json");
const outputPath = path.join(root, "flowise", "exports", "agentflow-e52f27b3-2026-07-17-agents-owner.json");
const flow = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const prompt = (name: string) => {
  const markdown = fs.readFileSync(path.join(root, "prompts", name), "utf8");
  const match = markdown.match(/```text\r?\n([\s\S]*?)\r?\n```/);
  if (!match) throw new Error(`Prompt block not found: ${name}`);
  return match[1];
};

const node = (id: string) => {
  const found = flow.nodes.find((entry: { id: string }) => entry.id === id);
  if (!found) throw new Error(`Node not found: ${id}`);
  return found;
};

const state = node("startAgentflow_0").data.inputs.startState as Array<{ key: string; value: string }>;
const stateDefaults: Record<string, string> = {
  stage: "pedido",
  pending_action: "",
  target_item_id: "",
  target_option_key: "",
  validated_quote: "",
  pedido_confirmado_por_cliente: "false"
};
for (const [key, value] of Object.entries(stateDefaults)) {
  if (!state.some((entry) => entry.key === key)) state.push({ key, value });
}

const router = node("llmAgentflow_0");
router.data.inputs.llmMessages[0].content = prompt("router-central.md");
router.data.inputs.llmStructuredOutput = [
  { key: "route", type: "string", enumValues: "", jsonSchema: "", description: "menu, pedido, datos, confirmacion, general o escalamiento" },
  { key: "confidence", type: "number", enumValues: "", jsonSchema: "", description: "Confianza entre 0 y 1" },
  { key: "reason", type: "string", enumValues: "", jsonSchema: "", description: "Razon breve" }
];
router.data.inputs.llmUpdateState = [
  { key: "route", value: "{{ output.route }}" },
  { key: "confidence", value: "{{ output.confidence }}" },
  { key: "reason", value: "{{ output.reason }}" }
];

const guard = node("customFunctionAgentflow_0");
guard.data.inputs.customFunctionInputVariables.push(
  { variableName: "stage", variableValue: "{{ $flow.state.stage }}" },
  { variableName: "pending_action", variableValue: "{{ $flow.state.pending_action }}" }
);
guard.data.inputs.customFunctionJavascriptFunction = `const clean = (value) => String(value || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
const original = clean($flow.state.route).toLowerCase() || 'general';
const stage = clean($flow.state.stage).toLowerCase();
const pending = clean($flow.state.pending_action).toLowerCase();
const human = clean($flow.state.needs_human).toLowerCase() === 'true';
const fullMenu = clean($flow.state.enviar_menu).toLowerCase() === 'true';
let route = original;
if (human || original === 'escalamiento') route = 'escalamiento';
else if (pending === 'configure_item' || pending === 'ask_more_products') route = 'pedido';
else if (stage === 'confirmacion') route = 'confirmacion';
else if (stage === 'datos' && original === 'general') route = 'datos';
else if (fullMenu) route = 'menu';
$flow.state.route = route;
return route;`;

const mainCondition = node("conditionAgentflow_0");
mainCondition.data.inputs.conditions.push({
  type: "string",
  value1: "{{ $flow.state.route }}",
  operation: "equal",
  value2: "confirmacion"
});
mainCondition.data.outputAnchors = [0, 1, 2, 3, 4, 5, 6].map((index) => ({
  id: `conditionAgentflow_0-output-${index}`,
  label: index,
  name: index,
  description: index === 6 ? "Else" : `Condition ${index}`
}));
flow.edges.push({
  source: "conditionAgentflow_0",
  sourceHandle: "conditionAgentflow_0-output-5",
  target: "llmAgentflow_5",
  targetHandle: "llmAgentflow_5",
  data: { sourceColor: "#FFB938", targetColor: "#64B5F6", edgeLabel: "5", isHumanInput: false },
  type: "agentFlow",
  id: "conditionAgentflow_0-output-5-llmAgentflow_5"
});

const orderAgent = node("llmAgentflow_1");
orderAgent.data.inputs.llmMessages[0].content = prompt("agente-pedido.md");
orderAgent.data.inputs.llmStructuredOutput = [
  { key: "operations", type: "string", enumValues: "", jsonSchema: "", description: "Array JSON serializado de operaciones permitidas" },
  { key: "action", type: "string", enumValues: "", jsonSchema: "", description: "configure_item, ask_more_products, collect_data o clarify" },
  { key: "target_item_id", type: "string", enumValues: "", jsonSchema: "", description: "ID del item enfocado o vacio" },
  { key: "target_option_key", type: "string", enumValues: "", jsonSchema: "", description: "Clave de required option enfocada o vacia" },
  { key: "reply", type: "string", enumValues: "", jsonSchema: "", description: "Respuesta visible breve" },
  { key: "needs_human", type: "boolean", enumValues: "", jsonSchema: "", description: "Solo ante bloqueo real" }
];
orderAgent.data.inputs.llmUpdateState = [
  { key: "mensaje_cliente", value: "{{ output.reply }}" },
  { key: "needs_human", value: "{{ output.needs_human }}" }
];

const applyOperations = JSON.parse(JSON.stringify(guard));
applyOperations.id = "customFunctionAgentflow_1";
applyOperations.position = { x: 810, y: 173 };
applyOperations.data.id = "customFunctionAgentflow_1";
applyOperations.data.label = "APLICAR OPERACIONES PEDIDO";
applyOperations.data.inputs.customFunctionInputVariables = [
  { variableName: "operations", variableValue: "{{ llmAgentflow_1.output.operations }}" },
  { variableName: "action", variableValue: "{{ llmAgentflow_1.output.action }}" },
  { variableName: "target_item_id", variableValue: "{{ llmAgentflow_1.output.target_item_id }}" },
  { variableName: "target_option_key", variableValue: "{{ llmAgentflow_1.output.target_option_key }}" },
  { variableName: "reply", variableValue: "{{ llmAgentflow_1.output.reply }}" },
  { variableName: "turn_context", variableValue: "{{ question }}" }
];
applyOperations.data.inputs.customFunctionJavascriptFunction = `const clean = (value) => String(value ?? '').replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
const parse = (value, fallback) => { try { let parsed = value; for (let i = 0; i < 2 && typeof parsed === 'string'; i++) parsed = JSON.parse(clean(parsed)); return parsed ?? fallback; } catch { return fallback; } };
const rawTurnContext = String($turn_context ?? '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const contextCatalog = rawTurnContext.match(/<available_catalog>([\\s\\S]*?)<\\/available_catalog>/)?.[1] || '';
const contextState = rawTurnContext.match(/<conversation_state>([\\s\\S]*?)<\\/conversation_state>/)?.[1] || '';
const catalog = parse($vars.available_catalog || contextCatalog, {});
const externalState = parse($vars.conversation_context || contextState, {});
const products = Array.isArray(catalog.productos) ? catalog.productos : [];
const modifiers = [...(catalog.toppings || []), ...(catalog.adiciones || [])];
let items = parse(externalState.items ?? $vars.order_draft ?? $flow.state.items, []);
if (!Array.isArray(items)) items = [];
items = items.map((item, index) => ({
  id: item.id || item.item_id || ('legacy_' + index),
  productId: item.productId || item.product_id || '',
  producto: item.producto || item.productName || '',
  quantity: Number(item.quantity || item.cantidad || 1),
  selectedOptions: item.selectedOptions || {},
  modifierIds: item.modifierIds || [],
  observaciones: item.observaciones || ''
}));
const ops = parse($operations, []);
const canonical = (value) => clean(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/^(prod|product)_/, '').replace(/[^a-z0-9]+/g, '');
const findProduct = (op) => {
  const candidates = [op.product_id, op.productId, op.product_name, op.producto].map(canonical).filter(Boolean);
  const matches = products.filter((product) => [product.id, product.name, ...(product.aliases || [])].map(canonical).some((value) => candidates.includes(value)));
  return matches.length === 1 ? matches[0] : null;
};
let createdSequence = 0;
const uniqueId = (productId) => productId + '_' + Date.now().toString(36) + '_' + (createdSequence++);
let changed = false;
for (const op of Array.isArray(ops) ? ops : []) {
  const type = clean(op.type);
  if (type === 'add_item') {
    const product = findProduct(op); if (!product) continue;
    const quantity = Math.max(1, Math.trunc(Number(op.quantity || 1)));
    const configurable = Array.isArray(product.requiredOptions) && product.requiredOptions.length > 0;
    const units = configurable ? quantity : 1;
    for (let i = 0; i < units; i++) items.push({ id: uniqueId(product.id), productId: product.id, producto: product.name, quantity: configurable ? 1 : quantity, selectedOptions: {}, modifierIds: [], observaciones: '' });
    changed = true;
  } else if (type === 'remove_item') {
    const before = items.length; items = items.filter((item) => item.id !== op.target_item_id); changed = changed || before !== items.length;
  } else if (type === 'change_quantity') {
    const item = items.find((entry) => entry.id === op.target_item_id); const product = item && products.find((p) => p.id === item.productId);
    if (item && !(product?.requiredOptions?.length)) { item.quantity = Math.max(1, Math.trunc(Number(op.quantity || 1))); changed = true; }
  } else if (type === 'set_required_option') {
    const item = items.find((entry) => entry.id === op.target_item_id); const product = item && products.find((p) => p.id === item.productId);
    const option = product?.requiredOptions?.find((entry) => entry.key === op.option_key);
    const value = option?.options?.find((candidate) => clean(candidate).toLowerCase() === clean(op.value).toLowerCase());
    if (item && option && value) { item.selectedOptions[option.key] = [value]; changed = true; }
  } else if (type === 'add_modifier' || type === 'remove_modifier') {
    const item = items.find((entry) => entry.id === op.target_item_id); const modifier = modifiers.find((entry) => entry.id === op.modifier_id);
    if (item && modifier) { item.modifierIds = type === 'add_modifier' ? [...new Set([...item.modifierIds, modifier.id])] : item.modifierIds.filter((id) => id !== modifier.id); changed = true; }
  } else if (type === 'correct_item') {
    const item = items.find((entry) => entry.id === op.target_item_id); const product = findProduct(op);
    if (item && product) { item.productId = product.id; item.producto = product.name; item.quantity = 1; item.selectedOptions = {}; item.modifierIds = []; changed = true; }
  } else if (type === 'copy_item_configuration') {
    const source = items.find((entry) => entry.id === op.source_item_id);
    if (source) for (const id of op.target_item_ids || []) { const target = items.find((entry) => entry.id === id && entry.productId === source.productId); if (target) { target.selectedOptions = JSON.parse(JSON.stringify(source.selectedOptions)); target.modifierIds = [...source.modifierIds]; changed = true; } }
  }
}
const missing = [];
for (const item of items) {
  const product = products.find((p) => p.id === item.productId || p.name === item.producto);
  for (const option of product?.requiredOptions || []) if (option.required && (item.selectedOptions?.[option.key]?.length || 0) < option.minSelections) missing.push({ item, option });
}
const requestedAction = clean($action) || clean(externalState.pending_action) || 'clarify';
const focus = missing[0] || null;
const action = focus ? 'configure_item' : items.length === 0 && requestedAction === 'configure_item' ? 'clarify' : requestedAction === 'collect_data' ? 'collect_data' : requestedAction === 'clarify' ? 'clarify' : 'ask_more_products';
const targetItemId = focus?.item.id || (action === 'configure_item' ? clean($target_item_id) || clean(externalState.target_item_id) : '');
const targetOptionKey = focus?.option.key || (action === 'configure_item' ? clean($target_option_key) || clean(externalState.target_option_key) : '');
const stage = action === 'collect_data' ? 'datos' : 'pedido';
const ordinalNames = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];
const focusIndex = focus ? items.indexOf(focus.item) : -1;
const focusProduct = focus ? products.find((product) => product.id === focus.item.productId) : null;
const focusLabel = clean(focus?.option.label || focus?.option.key).toLowerCase();
const focusOptions = Array.isArray(focus?.option.options) ? focus.option.options : [];
const focusedReply = focus
  ? ('Vamos con el ' + (ordinalNames[focusIndex] || ('producto ' + (focusIndex + 1))) + ' ' + (focusProduct?.name || focus.item.producto) + ' 🍓 ¿Qué ' + focusLabel + ' quieres' + (focusOptions.length ? ': ' + focusOptions.join(', ') : '') + '?')
  : '';
const reply = focusedReply || clean($reply);
items = items.map((item) => ({ ...item, toppings: item.modifierIds.map((id) => modifiers.find((modifier) => modifier.id === id)?.name).filter(Boolean) }));
$flow.state.items = JSON.stringify(items);
$flow.state.stage = stage;
$flow.state.pending_action = action;
$flow.state.target_item_id = targetItemId;
$flow.state.target_option_key = targetOptionKey;
$flow.state.ultima_pregunta_bot = action === 'configure_item' ? ('pedido_opcion:' + targetItemId + ':' + targetOptionKey) : action === 'ask_more_products' ? 'pedido_otro_producto' : action === 'collect_data' ? 'datos_domicilio' : 'pedido_aclaracion';
$flow.state.mensaje_cliente = reply;
if (changed) $flow.state.validated_quote = '';
return JSON.stringify({ items, stage, pending_action: action, target_item_id: targetItemId, target_option_key: targetOptionKey, next_expected: stage, reply, mensaje_cliente: reply });`;
applyOperations.data.inputs.customFunctionUpdateState = [];
applyOperations.data.outputAnchors = [{
  id: "customFunctionAgentflow_1-output-customFunctionAgentflow",
  label: "Custom Function",
  name: "customFunctionAgentflow"
}];
flow.nodes.push(applyOperations);

flow.edges = flow.edges.filter((edge: { source: string; target: string }) => !(edge.source === "llmAgentflow_1" && edge.target === "directReplyAgentflow_0"));
flow.edges.push(
  {
    source: "llmAgentflow_1", sourceHandle: "llmAgentflow_1-output-llmAgentflow",
    target: "customFunctionAgentflow_1", targetHandle: "customFunctionAgentflow_1",
    data: { sourceColor: "#64B5F6", targetColor: "#E4B7FF", isHumanInput: false }, type: "agentFlow",
    id: "llmAgentflow_1-to-customFunctionAgentflow_1"
  },
  {
    source: "customFunctionAgentflow_1", sourceHandle: "customFunctionAgentflow_1-output-customFunctionAgentflow",
    target: "directReplyAgentflow_0", targetHandle: "directReplyAgentflow_0",
    data: { sourceColor: "#E4B7FF", targetColor: "#4DDBBB", isHumanInput: false }, type: "agentFlow",
    id: "customFunctionAgentflow_1-to-directReplyAgentflow_0"
  }
);
node("directReplyAgentflow_0").position = { x: 1090, y: 173 };
node("directReplyAgentflow_0").data.inputs.directReplyMessage = "{{$flow.state.mensaje_cliente}}";

const dataAgent = node("llmAgentflow_2");
const dataPrompt = String(dataAgent.data.inputs.llmMessages[0].content)
  .replace("Tu trabajo es recolectar y corregir datos de entrega/contacto/pago. No modificas productos y no confirmas pedidos finales.", "Tu trabajo es recolectar y corregir datos de entrega/contacto/pago. No modificas productos ni calculas precios. Cuando todos los datos obligatorios estén completos, devuelve action=\"request_quote\"; Railway calculará y validará la cotización.")
  .replace(/pedido_confirmado=true/g, "action=\"request_quote\" y pedido_confirmado=false");
dataAgent.data.inputs.llmMessages[0].content = dataPrompt;
dataAgent.data.inputs.llmStructuredOutput.push({ key: "action", type: "string", enumValues: "", jsonSchema: "", description: "request_quote cuando los datos estén completos; collect_data mientras falten" });
dataAgent.data.inputs.llmUpdateState.push({ key: "stage", value: "datos" });

const menuAgent = node("llmAgentflow_4");
const menuDescriptions: Record<string, string> = {
  mensaje_cliente: "Respuesta breve basada exclusivamente en el catálogo dinámico.",
  enviar_menu: "true únicamente cuando el cliente pide menú completo, carta o PDF.",
  topic: "Tema principal de la consulta de catálogo.",
  needs_human: "true únicamente cuando hace falta una decisión operativa humana."
};
for (const output of menuAgent.data.inputs.llmStructuredOutput) {
  output.description = menuDescriptions[output.key] ?? "Salida del agente de menú.";
}

const confirmation = node("llmAgentflow_5");
confirmation.data.inputs.llmUserMessage = `Eres el AGENTE CONFIRMACION DE PEDIDO de I Love Fresas Barranquilla.
La cotizacion validada llega dentro de <tool_result_quote> en el mensaje o en validated_quote. Nunca calcules ni cambies precios.

Si recibes una cotizacion sin blockingErrors, presenta un resumen claro con items, datos, subtotal, domicilio y total, y pregunta: "¿Está correcto para dejarlo en revisión con el equipo?"
Si blockingErrors no está vacío, explica brevemente qué debe corregirse y action="correct".
Si el cliente confirma explícitamente un resumen ya mostrado, action="confirm_order", pedido_confirmado_por_cliente=true.
Si corrige algo, action="correct", indica si debe volver a pedido o datos.
Si es ambiguo, action="unclear" y pide confirmación breve.
No afirmes preparación ni despacho.

Estado: items={{$flow.state.items}}, nombre={{$flow.state.nombre}}, direccion={{$flow.state.direccion}}, barrio={{$flow.state.barrio}}, referencia={{$flow.state.referencia}}, metodo_pago={{$flow.state.metodo_pago}}, validated_quote={{$flow.state.validated_quote}}
Mensaje actual: {{question}}

Devuelve solo JSON válido.`;
confirmation.data.inputs.llmStructuredOutput = [
  { key: "reply", type: "string", enumValues: "", jsonSchema: "", description: "Respuesta visible" },
  { key: "action", type: "string", enumValues: "", jsonSchema: "", description: "confirm_order, correct o unclear" },
  { key: "pedido_confirmado_por_cliente", type: "boolean", enumValues: "", jsonSchema: "", description: "true solo con confirmacion explicita" },
  { key: "next_expected", type: "string", enumValues: "", jsonSchema: "", description: "confirmacion, pedido, datos o comprobante_pago" },
  { key: "needs_human", type: "boolean", enumValues: "", jsonSchema: "", description: "Solo bloqueo real" }
];
confirmation.data.inputs.llmUpdateState = [
  { key: "mensaje_cliente", value: "{{ output.reply }}" },
  { key: "stage", value: "confirmacion" },
  { key: "pedido_confirmado_por_cliente", value: "{{ output.pedido_confirmado_por_cliente }}" },
  { key: "needs_human", value: "{{ output.needs_human }}" }
];
node("directReplyAgentflow_3").data.inputs.directReplyMessage = "{{llmAgentflow_5.output.reply}}";

fs.writeFileSync(outputPath, JSON.stringify(flow, null, 2));
console.log(outputPath);
