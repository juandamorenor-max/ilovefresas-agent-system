# Referencia tecnica

> **Estado:** Referencia verificada de la implementacion actual  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** rutas Express, `.env.example`, scripts npm, Flowise Cloud y Railway  
> **Componentes:** APIs, schemas, variables, estados, catalogo y comandos

## Endpoints publicos y de integracion

| Metodo/ruta | Proposito | Proteccion observada |
| --- | --- | --- |
| `GET /health` | salud basica | publica |
| `GET /health/integration` | estado de integraciones | publica al verificar |
| `GET /dashboard/` | frontend administrativo | login en operaciones admin |
| `POST /webhook/telegram` | webhook directo Telegram | validacion por token/configuracion |
| `GET /webhook/whatsapp` | verificacion Meta | verify token |
| `POST /webhook/whatsapp` | eventos WhatsApp | no productivo |
| `POST /bot/turn` | turno normalizado | `BOT_INTEGRATION_SECRET` |
| `POST /bot/quote` | cotizacion validada y temporal | `BOT_INTEGRATION_SECRET` |
| `POST /bot/orders/confirmed` | consume quote y crea `pending_review` | `BOT_INTEGRATION_SECRET` |
| `GET /bot/menu/pdf` | descarga `Menu 2026.pdf` | publica al verificar |
| `GET /bot/catalog/available` | catalogo para integracion | secreto requerido |

## Endpoints administrativos principales

Todas las rutas `/admin/*` operativas requieren sesion, salvo el estado/login de
sesion segun su funcion.

| Area | Rutas representativas |
| --- | --- |
| Sesion | `GET /admin/session`, `POST /admin/session/login`, `POST /admin/session/logout` |
| Resumen | `GET /admin/dashboard/summary` |
| Pedidos | listar, detalle y actualizar estado bajo `/admin/dashboard/orders` |
| Conversaciones | listar, detalle, responder y pausar/reactivar |
| Productos | listar, crear, editar y disponibilidad |
| Modificadores | listar, crear, editar y disponibilidad |
| Catalogo bot | `GET /admin/dashboard/bot-catalog` |
| Pagos/configuracion | rutas administrativas de negocio/pagos |
| Contabilidad | consulta y CSV de pedidos despachados |

Los nombres exactos deben consultarse en los routers del backend antes de crear un
cliente nuevo; esta tabla es funcional, no un reemplazo del contrato OpenAPI.

## Contratos de canal y Flowise

### Llamada n8n activa a Railway

```json
{
  "channel": "telegram",
  "chatId": "<chat_id>",
  "text": "<texto o caption>",
  "caption": null,
  "hasAttachment": false,
  "attachmentType": null,
  "attachmentFileId": null,
  "mimeType": null
}
```

Destino: `POST https://ilovefresas-backend-dashboard-production.up.railway.app/bot/turn`.
Header: `x-bot-secret` con el secreto de integracion, nunca incluido en Git.
Respuesta usada por n8n: `responseText`.

### Llamada del backend

El backend agrega un bloque de estado externo y variables con draft, etapa,
seleccion y catalogo disponible. Flowise interpreta; el backend valida antes de
aplicar cambios.

## Schemas Flowise observados

### Router

```json
{
  "route": "general|menu|pedido|datos|escalamiento",
  "confidence": 0,
  "reason": "",
  "mensaje_cliente": "",
  "enviar_menu": false,
  "needs_human": false,
  "pedido_confirmado": false
}
```

### Pedido activo

```json
{
  "operations": [],
  "action": "configure_item|ask_more_products|collect_data|clarify|request_quote",
  "target_item_id": null,
  "target_option_key": null,
  "reply": "",
  "needs_human": false
}
```

El Custom Function devuelve el snapshot validado de items y foco. La salida fue
verificada en el canvas productivo y en la exportacion del 2026-07-17.

## Etapas backend

La taxonomia objetivo usada por la implementacion incluye:

```text
pedido | datos | confirmacion | comprobante_pago | humano | postventa | cerrado
```

Flowise conserva ademas rutas de clasificacion como `general`, `menu`, `pedido`,
`datos` y `escalamiento`. Una ruta describe quien interpreta el turno; una etapa
describe en que punto se encuentra el proceso. No son el mismo concepto.

## Variables de entorno

| Variable | Proposito | Requerida segun funcion |
| --- | --- | --- |
| `NODE_ENV` | modo de ejecucion | si |
| `APP_BASE_URL` | URL publica del backend | despliegue/integraciones |
| `FLOWISE_API_URL` | base de Prediction API | para llamar Flowise |
| `FLOWISE_CHATFLOW_ID` | Agentflow objetivo | para llamar Flowise |
| `FLOWISE_API_KEY` | proteccion de Flowise | vacia actualmente; recomendada |
| `BOT_INTEGRATION_SECRET` | protege `/bot/*` sensible | si |
| `BOT_TURN_INCLUDE_RAW` | incluye diagnostico crudo | solo debug controlado |
| `TURN_DECISION_OWNER` | `legacy` o decisiones conversacionales en `agents` | `agents` activo en produccion |
| `DEFAULT_DELIVERY_FEE` | domicilio por defecto | si para calculos |
| `MENU_PDF_PATH` | archivo del menu | para PDF |
| `RUNTIME_STORE_PATH` | snapshot persistente | si en Railway |
| `TELEGRAM_CLIENT_BOT_TOKEN` | Bot API | para Telegram directo/notificaciones |
| `DATABASE_URL` | Postgres contable | para ledger |
| `DASHBOARD_ACCESS_PASSWORD` | login V0 | si para dashboard privado |
| `DASHBOARD_SESSION_SECRET` | firma de cookie/sesion | si |
| `OPENAI_API_KEY` | vision | para comprobantes |
| `OPENAI_VISION_MODEL` | modelo visual | opcional/configurable |
| `WHATSAPP_ACCESS_TOKEN` | Graph API | solo al activar WhatsApp |
| `WHATSAPP_PHONE_NUMBER_ID` | numero Meta | solo al activar WhatsApp |
| `WHATSAPP_VERIFY_TOKEN` | verificacion webhook | solo al activar WhatsApp |

Los nombres deben reconciliarse con `.env.example` en cada release. No copiar
valores reales a este documento.

## Precios y disponibilidad

- `isActive=true` y `isOutOfStock=false` determinan oferta normal.
- Productos, toppings y adiciones se entregan por separado al chat.
- El backend calcula subtotal desde items validados.
- Domicilio predeterminado verificado: `5000`.
- Descuento predeterminado: `0`, salvo regla autorizada.
- Total: `subtotal + deliveryFee - discount`.

## Comandos de construccion y prueba

Agentic:

```powershell
npm install
npm run build
npm test
```

Backend/dashboard:

```powershell
npm install
npm run build:all
npm run test:bot-integration
npm run test:dashboard-operational
```

Los comandos de QA adicionales estan en [Pruebas y produccion](09-pruebas-y-produccion.md).
