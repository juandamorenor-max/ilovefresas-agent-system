# Glosario

> **Estado:** Vigente  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** implementacion y configuracion activa  
> **Componentes:** todos

**Agentflow V2:** lienzo de Flowise que conecta nodos LLM, condiciones, codigo y
respuestas para procesar un turno.

**Backend:** servicio Express desplegado en Railway. Aplica reglas, administra el
catalogo, calcula valores, persiste operacion y sirve el dashboard.

**Catalogo disponible:** subconjunto estructurado de productos y modificadores
activos y no agotados que puede ofrecerse al cliente.

**Comprobante:** imagen o documento que parece demostrar una transferencia. La
clasificacion visual no equivale a confirmar ingreso bancario.

**Condition:** nodo determinista de Flowise que elige una rama usando un valor ya
calculado; no interpreta lenguaje libre como un LLM.

**Configuracion actual / foco:** referencia al item, unidad y opcion que se esta
completando, por ejemplo fruta del segundo waffle.

**Conversation ID:** identificador de una sesion comercial. `/newchat` debe crear
uno nuevo sin cambiar necesariamente el `chatId` del canal.

**Draft:** pedido en construccion. Puede tener items, opciones y datos incompletos;
todavia no es una orden operativa.

**Flow State:** objeto de estado del Agentflow. Permite que nodos del mismo flujo y
sesion lean y actualicen claves como items, nombre o ultima pregunta.

**Guard de Ruta:** nodo de codigo posterior al Router. Corrige la ruta usando
prioridades deterministas, por ejemplo mantener `pedido` si hay una opcion pendiente.

**Guardrail:** regla de codigo que bloquea o dirige una accion antes o después del
modelo. Protege invariantes como disponibilidad, etapa de comprobante o total.

**Handoff / escalamiento:** transferencia del chat a un operario. El bot debe
quedar pausado mientras la intervencion humana siga activa.

**Idempotencia:** propiedad por la que procesar dos veces el mismo mensaje externo
no duplica respuestas, items, pedidos ni cobros.

**Inbox/outbox:** patrones persistentes para registrar mensajes recibidos y
notificaciones pendientes, permitiendo reintentos y evitando perdidas/duplicados.
No estan implementados completamente en el sistema actual.

**n8n:** orquestador visual que actualmente recibe Telegram, prepara la sesion,
llama Flowise y envia la respuesta.

**Operacion:** cambio validado que agrega, modifica o elimina datos del draft. Es
preferible a permitir que un modelo reescriba todo el estado libremente.

**Orden/pedido operativo:** registro que el equipo puede revisar, preparar y
despachar. Se crea después del draft completo y confirmacion requerida.

**Out of scope / fuera de alcance:** consulta ajena a pedidos y servicio del
restaurante. Debe recibir una respuesta fija breve.

**Required options:** selecciones necesarias para completar un producto, como
fruta, sabor de helado y salsa.

**Router Central:** LLM que clasifica la intencion/ruta del ultimo turno. No debe
calcular precios, crear ordenes ni ser dueño del estado.

**Runtime JSON:** snapshot persistente del backend en Railway Volume. Contiene la
operacion V0 fuera de Postgres.

**Session ID:** identificador enviado a Flowise para separar la memoria de cada
conversacion, normalmente `canal:chat:conversacion`.

**Static data de n8n:** almacenamiento interno del workflow usado para conservar el
`conversationId` por chat. No es la base de pedidos del negocio.

**Structured Output:** schema que restringe los campos que debe devolver un nodo
LLM. Prompt y schema deben coincidir exactamente.

**Webhook:** URL a la que Telegram o Meta envia un evento. Un token de Telegram
solo puede tener un webhook activo.

