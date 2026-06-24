# n8n y Telegram

n8n funciona por ahora como puente de pruebas entre Telegram y Flowise.

## Variables

```text
N8N_API_URL=
N8N_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_TEST_CHAT_ID=
```

## Flujo esperado de pruebas

1. Telegram recibe mensaje del cliente o chat de prueba.
2. n8n recibe el webhook.
3. n8n detecta comandos de control como `/newchat`.
4. Si es comando, responde a Telegram sin llamar Flowise.
5. Si es mensaje normal, n8n arma `sessionId` y llama Flowise.
6. n8n envia la respuesta a Telegram.

## Comandos de prueba

Telegram debe soportar comandos de control para backtesting. Estos comandos se interceptan antes de llamar Flowise.

### `/newchat`

Uso:

```text
/newchat
/newchat domicilio villa santos
```

Comportamiento esperado:

- n8n/backend detecta el comando.
- No llama Flowise.
- Cierra o archiva la conversacion activa de ese chat de prueba.
- Crea un nuevo `conversationId` o `sessionId`.
- Responde algo como: `Listo, abri un chat nuevo para pruebas.`
- Si trae texto despues del comando, guardarlo como etiqueta de backtest.

El `sessionId` enviado a Flowise deberia incluir el chat de Telegram y el id de conversacion activo:

```text
telegram:{chatId}:{conversationId}
```

Esto evita que una prueba contamine otra con memoria vieja.

## Payload recomendado hacia Flowise

Antes del HTTP Request, n8n debe resolver:

```json
{
  "chatId": "123456",
  "channelContact": "telegram:123456",
  "conversationId": "case-001",
  "sessionId": "telegram:123456:case-001",
  "question": "quiero una oblea",
  "catalogo_disponible": {
    "productos": [],
    "toppings": [],
    "adiciones": []
  }
}
```

El HTTP Request a Flowise debe enviar:

```json
{
  "question": "quiero una oblea",
  "sessionId": "telegram:123456:case-001",
  "overrideConfig": {
    "vars": {
      "catalogo_disponible": "{\"productos\":[],\"toppings\":[],\"adiciones\":[]}"
    }
  }
}
```

`catalogo_disponible` es un JSON string dentro de `overrideConfig.vars` para que Flowise lo lea como `{{ $vars.catalogo_disponible }}` en `AGENTE PEDIDO`.

El `conversationId` activo debe guardarse por `chatId`. Para beta/backtesting puede vivir temporalmente en n8n Data Store; en produccion debe vivir en backend.

## Pseudoflujo n8n

```text
Telegram Trigger
-> Code/Function: preparar sesion y detectar /newchat
   -> si shouldCallFlowise=false: Send a text message
   -> si shouldCallFlowise=true: HTTP Request Flowise
-> Send a text message
```

Contrato local equivalente:

```text
src/telegramSession.ts
tests/conversations/telegramSession.test.ts
```

## Implementacion n8n propuesta

Snippet listo para pegar en un nodo Code:

```text
n8n/snippets/prepare-telegram-session.js
```

Ese nodo debe ir inmediatamente despues de `Telegram Trigger`.

Despues debe ir un IF node:

```text
n8n/snippets/if-should-call-flowise.md
```

El flujo objetivo queda:

```text
Telegram Trigger
-> Prepare Telegram Session
-> IF shouldCallFlowise
   true  -> HTTP Request Flowise -> Normalize Flowise Response -> Send a text message
   false -> Send a text message
```

Estado actual de UI n8n al ultimo intento:

- `HTTP Request` fue publicado llamando `e52f27b3-06e2-4fb0-b853-30e936b99839`.
- `sessionId` fue publicado como `telegram:{chatId}`.
- Queda pendiente completar los nodos `/newchat` para aislar backtests por `conversationId`.

## Automatizacion por API

Si Chrome sigue bloqueado, se puede usar la API de n8n con:

```text
N8N_API_URL=https://i-love-fresas.app.n8n.cloud
N8N_API_KEY=...
N8N_WORKFLOW_ID=1whquJktIBm3WqkG
N8N_TARGET_WORKFLOW_PATH=n8n/exports/telegram-flowise-newchat-target.json
```

Exportar workflow actual:

```bash
npm run n8n:export
```

Ver el plan de update sin tocar n8n:

```bash
npm run n8n:update-target
```

Aplicar el workflow objetivo:

```bash
npm run n8n:update-target -- --apply
```

Aplicar y activar/publicar:

```bash
npm run n8n:update-target -- --apply --activate
```

No ejecutes `--apply` sin revisar antes el export actual y el JSON objetivo.

## Limite importante

n8n no debe convertirse en base de datos ni fuente de verdad del pedido. Si se necesita estado durable, debe vivir en el backend propio.
