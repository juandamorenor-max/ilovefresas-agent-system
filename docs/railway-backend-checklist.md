# Railway checklist backend/dashboard

No hace falta desplegar Railway para compilar o seguir desarrollando local. Si queremos probar con n8n Cloud o Telegram fuera del PC, si necesitamos un backend publico.

## Servicio a desplegar

Repositorio/carpeta:

```text
C:\Users\PC\Documents\chatbot i love fresas v2
```

Comandos:

```text
npm install
npm run build
npm start
```

Health check:

```text
GET /health
```

Integration check:

```text
GET /health/integration
```

Ese endpoint confirma si Flowise esta configurado, si `BOT_INTEGRATION_SECRET` esta activo, el domicilio default y que por ahora el storage sigue en memoria.

Dashboard:

```text
/dashboard
```

Bot turn endpoint:

```text
POST /bot/turn
```

## Variables necesarias

Minimas para n8n + Flowise:

```text
PORT=3000
NODE_ENV=production
APP_BASE_URL=https://TU-APP.railway.app
FLOWISE_API_URL=https://cloud.flowiseai.com
FLOWISE_CHATFLOW_ID=e52f27b3-06e2-4fb0-b853-30e936b99839
FLOWISE_API_KEY=
BOT_INTEGRATION_SECRET=un_secreto_largo_para_n8n
BOT_TURN_INCLUDE_RAW=false
DEFAULT_DELIVERY_FEE=5000
MENU_PDF_PATH=
```

Si Flowise sigue sin Authorization, `FLOWISE_API_KEY` puede quedar vacia.

Para Telegram directo desde backend local no es obligatorio si n8n envia las respuestas. Si despues usamos el runner interno:

```text
TELEGRAM_CLIENT_BOT_TOKEN=
TELEGRAM_ADMIN_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=
```

## Pendiente antes de produccion real

- Cambiar `demoStore` en memoria por Postgres.
- Persistir conversaciones, mensajes, pedidos y disponibilidad.
- Agregar auth para rutas `/admin`.
- Configurar `BOT_INTEGRATION_SECRET` y mandar el mismo valor desde n8n como header `X-Bot-Secret`.
- Configurar `MENU_PDF_PATH` como URL publica o almacenamiento persistente.
- Definir dominio estable para n8n.
