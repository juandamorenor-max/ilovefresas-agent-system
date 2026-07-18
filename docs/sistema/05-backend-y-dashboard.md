# Backend conversacional y dashboard

> **Estado:** Operativo en Railway e integrado con Telegram mediante n8n  
> **Ultima verificacion:** 2026-07-17, modo agentes desplegado  
> **Fuentes verificadas:** codigo del repositorio `chatbot i love fresas v2`, Railway production y dashboard desplegado  
> **Componentes:** Express, `AgentFlowTurnService`, catalogo, pedidos, dashboard y contabilidad

## Responsabilidad del backend

El backend recibe el turno, mantiene la sesion, entrega contexto a Flowise,
valida las operaciones resultantes y persiste el estado. En modo `agents` no
interpreta el texto normal ni selecciona la siguiente pregunta. Es fuente de
verdad para:

- catalogo, precios y disponibilidad;
- validacion de IDs, opciones y modificaciones propuestas;
- persistencia del draft, datos y foco entre turnos;
- subtotal, domicilio, descuento y total;
- comprobantes, pedidos y transiciones operativas;
- notificaciones y registro contable.

El webhook de Telegram sigue alojado en n8n, pero cada update valido se reenvia a
este backend mediante `POST /bot/turn`. n8n funciona como adaptador de canal y ya
no decide el estado ni llama Flowise directamente.

## Orden real de procesamiento

`AgentFlowTurnService` en modo `agents` evalua un turno aproximadamente en este orden:

1. reinicio mediante `/newchat`;
2. mensaje vacio o adjunto no procesable;
3. comprobante enviado antes de la etapa correcta;
4. validacion o descarga de comprobante cuando la etapa lo permite;
5. solicitud del PDF del menu;
6. carga del catalogo y estado persistido;
7. llamada a Flowise con `sessionId` estable;
8. extraccion del Structured Output ejecutado;
9. validacion y aplicacion de operaciones/foco;
10. cotizacion u orden final cuando Flowise solicita la herramienta;
11. persistencia de una sola respuesta validada.

Los early returns conversacionales de required options, modificaciones dirigidas,
datos y fuera de alcance quedan desactivados con `TURN_DECISION_OWNER=agents`.
El modo `legacy` se conserva como rollback temporal.

## Opciones obligatorias

El backend define por datos que opciones necesita cada producto. Ejemplos
verificados:

| Producto | Opciones requeridas |
| --- | --- |
| Waffle tradicional/chocolate | fruta, sabor de helado y salsa |
| Vaso fantasia | sabor de helado, topping y salsa |
| Fresas con helado | sabor de helado |

Los productos configurables con cantidad mayor a uno se pueden representar como
unidades independientes. El foco conserva la unidad y el campo actual para poder
preguntar y corregir una por una. El cliente puede contestar una, varias o todas
las opciones en un solo mensaje. `sin helado` se trata como una decision explicita
solo cuando la regla del producto permita omitir esa opcion; no debe inventarse
una configuracion incompatible.

## Catalogo y calculos

- Los productos y modificadores se filtran por `isActive` y `isOutOfStock`.
- El backend vuelve a validar disponibilidad antes de crear la orden.
- Los precios se leen del catalogo persistido, no del prompt.
- Calculo vigente: `subtotal + domicilio - descuento = total`.
- El domicilio predeterminado reportado por produccion es `$5,000`.
- Los importes visibles deben formatearse como `$xx,xxx`.

## Comprobantes

El backend solo debe procesar un comprobante cuando la etapa sea
`comprobante_pago`. La implementacion combina señales textuales y un validador
visual configurado con `gpt-4o-mini`; el umbral observado es `0.65`.

La validacion visual indica que la imagen parece un comprobante y busca señales
como estado, valor y referencia. No confirma que el dinero haya ingresado a una
cuenta. La aprobacion final sigue siendo responsabilidad del operario.

## Dashboard desplegado

El dashboard se sirve desde `/dashboard/`, esta protegido por sesion y consulta
las rutas `/admin/*`. La interfaz contempla:

- **Operacion:** indicadores y cola de pedidos.
- **Conversaciones:** transcript, respuesta manual y pausa/reactivacion del bot.
- **Pedidos:** detalle y cambios de estado.
- **Disponibilidad:** productos, toppings y adiciones.
- **Catalogo:** edicion administrativa.
- **Pagos:** numeros o cuentas mostrados al cliente.
- **Contabilidad:** consulta y exportacion de pedidos despachados.

La UI tiene perfiles visuales `operator`, `admin` y `demo`. La seguridad real V0
es una contraseña compartida y cookie HttpOnly; esos perfiles no sustituyen un
sistema multiusuario con autorizacion por rol.

## Estados de pedido y acciones

La ruta administrativa reconoce estados como `pending_review`, `confirmed`,
`preparing`, `dispatched`, `completed` y `cancelled`. La interfaz presenta las
acciones correspondientes, pero la auditoria del codigo encontro que la ruta de
actualizacion valida el nombre del estado y no garantiza en todos los casos la
secuencia completa entre estados. Esto permanece como riesgo conocido.

Al marcar `dispatched`, el sistema intenta notificar al cliente y registrar el
pedido en el ledger contable. Esas tres operaciones deben leerse por separado:
cambiar estado, notificar y registrar contabilidad no son atomicamente lo mismo.

## Contrato con Flowise

Cuando el backend si llama Flowise, construye una pregunta con contexto delimitado
y envia un `sessionId` estable. Ademas usa `overrideConfig.vars` para entregar el
estado y el catalogo resumido. La forma conceptual es:

```json
{
  "question": "<available_catalog>...</available_catalog>\n<conversation_state>...</conversation_state>\n<ultimo_mensaje_cliente>...</ultimo_mensaje_cliente>",
  "sessionId": "channel:chatId:conversationId",
  "overrideConfig": {
    "vars": {
      "available_catalog": "...",
      "conversation_context": "...",
      "order_draft": "...",
      "current_stage": "...",
      "pending_selection": "..."
    }
  }
}
```

La duplicacion controlada entre variables y bloques de contexto existe porque
Flowise Cloud no aplico consistentemente `overrideConfig.vars` durante la
verificacion. Ninguno de esos bloques contiene secretos.

No se documentan valores secretos. El cliente Flowise actual no tiene timeout ni
politica de reintentos verificada en el codigo auditado.

## Capacidades incorporadas al recorrido activo

La conexion publicada permite que Telegram utilice:

- catalogo y disponibilidad editados en el dashboard;
- required options y modificaciones dirigidas del backend;
- totales y resumen calculados por backend;
- descarga y validacion de imagenes Telegram;
- creacion de pedidos y ledger contable;
- trazas de `AgentFlowTurnService`.

La configuracion fue verificada en n8n Cloud. Falta ejecutar nuevamente el flujo
manual completo para considerar cada capacidad aceptada de punta a punta.
