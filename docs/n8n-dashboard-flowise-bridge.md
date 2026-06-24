# Puente n8n + dashboard/backend + Flowise

Este es el contrato operativo para la beta:

```text
Telegram/WhatsApp
  -> n8n
  -> backend/dashboard: cargar conversacion y catalogo disponible
  -> Flowise Agentflow: clasificar/redactar/extraer
  -> backend/dashboard: guardar estado o crear pedido en revision
  -> n8n
  -> Telegram/WhatsApp
```

## Backend disponible

La primera version quedo implementada en:

```text
C:\Users\PC\Documents\chatbot i love fresas v2
```

Endpoints internos para n8n:

```text
POST  /bot/turn
GET   /bot/catalog/available
GET   /bot/conversations/:channel/:chatId/active
POST  /bot/conversations/:channel/:chatId/new
PATCH /bot/conversations/:conversationId/state
POST  /bot/conversations/:conversationId/orders/review
```

Para V1, el endpoint recomendado es `POST /bot/turn`. Los otros endpoints quedan como piezas internas/debug o para armar el flujo manual si algun dia queremos que n8n vea cada paso.

El dashboard ya usa sus rutas existentes:

```text
GET   /admin/dashboard/orders
GET   /admin/dashboard/conversations
GET   /admin/dashboard/products
GET   /admin/dashboard/modifiers
PATCH /admin/products/:id/availability
PATCH /admin/modifiers/:id/availability
```

## Flujo n8n recomendado V1

La version mas simple y menos fragil en n8n es:

```text
Telegram Trigger
  -> HTTP Request: POST /bot/turn
  -> Telegram Send Message
```

### HTTP Request hacia backend

```text
POST https://TU_BACKEND_PUBLICO/bot/turn
```

Body:

```json
{
  "channel": "telegram",
  "chatId": "{{ $json.message.chat.id }}",
  "text": "{{ $json.message.text }}"
}
```

Headers, si `BOT_INTEGRATION_SECRET` esta configurado en backend:

```text
X-Bot-Secret: TU_SECRETO_COMPARTIDO
```

Respuesta esperada:

```json
{
  "conversationId": "conv_x",
  "sessionId": "telegram:531515729:conv_x",
  "responseText": "Perfecto, fresas con crema tradicional. Quieres agregarle algo mas?",
  "shouldSendReply": true,
  "source": "flowise_agentflow",
  "state": "collecting_delivery_details",
  "orderId": null
}
```

En Telegram Send Message:

```text
Chat ID: {{ $('Telegram Trigger').item.json.message.chat.id }}
Text: {{ $json.responseText }}
```

Si `shouldSendReply=false`, n8n no deberia enviar nada.

### /newchat

El backend ya intercepta `/newchat` dentro de `/bot/turn`.

No necesitas armar IF en n8n para eso en V1.

## Flujo manual alternativo

### 1. Telegram Trigger

Recibe:

```text
chat_id = message.chat.id
text = message.text
```

### 2. IF /newchat

Si `text` es `/newchat`:

```text
POST /bot/conversations/telegram/{{chat_id}}/new
```

Responder:

```text
Listo, abrimos un chat nuevo para probar desde cero.
```

No llamar Flowise en ese turno.

### 3. Cargar conversacion activa

```text
GET /bot/conversations/telegram/{{chat_id}}/active
```

Respuesta relevante:

```json
{
  "id": "conv_x",
  "conversationState": {
    "items": "[]",
    "nombre": "",
    "direccion": "",
    "barrio": "",
    "referencia": "",
    "metodo_pago": "",
    "modalidad_entrega": "domicilio",
    "pedido_en_progreso": false,
    "ultima_pregunta_bot": "",
    "next_expected": "pedido"
  }
}
```

### 4. Cargar catalogo disponible

```text
GET /bot/catalog/available
```

n8n debe mandar este JSON a Flowise como `catalogo_disponible`.

### 5. Llamar Flowise

Body recomendado:

```json
{
  "question": "<contexto_externo_n8n_backend>\nitems: ...\nnombre: ...\ndireccion: ...\nbarrio: ...\nreferencia: ...\nmetodo_pago: ...\nmodalidad_entrega: domicilio\nultima_pregunta_bot: ...\nnext_expected: ...\n</contexto_externo_n8n_backend>\n\n<ultimo_mensaje_cliente>\nTexto del cliente\n</ultimo_mensaje_cliente>",
  "sessionId": "telegram:{{chat_id}}:{{conversation_id}}",
  "overrideConfig": {
    "vars": {
      "catalogo_disponible": "{...}",
      "items": "...",
      "nombre": "...",
      "direccion": "...",
      "barrio": "...",
      "referencia": "...",
      "metodo_pago": "...",
      "modalidad_entrega": "domicilio",
      "next_expected": "pedido"
    }
  }
}
```

La envoltura en `question` es importante porque en Flowise Cloud las variables no siempre resolvieron igual dentro de todos los prompts.

### 6. Guardar estado luego de Flowise

Después de extraer la salida del agente ejecutado, llamar:

```text
PATCH /bot/conversations/{{conversation_id}}/state
```

Body ejemplo:

```json
{
  "items": [
    {
      "producto": "Fresas con crema tradicional",
      "cantidad": 1,
      "toppings": ["Oreo"]
    }
  ],
  "nombre": "Laura",
  "direccion": "Cra 39A #41-99",
  "barrio": "Cabecera del Llano",
  "referencia": "Casa blanca",
  "metodo_pago": "Nequi",
  "modalidad_entrega": "domicilio",
  "mensaje_cliente": "Perfecto, te dejo el resumen...",
  "customerMessage": "mensaje original del cliente",
  "botMessage": "respuesta enviada al cliente",
  "next_expected": "confirmacion"
}
```

El backend convierte eso en `draftOrder`, calcula precios con el catalogo y lo deja visible para el dashboard.

### 7. Crear pedido en revision

Solo cuando el cliente ya confirmo el resumen:

```text
POST /bot/conversations/{{conversation_id}}/orders/review
```

Eso crea o sincroniza un pedido con status `pending_review`, visible en el dashboard.

## Reglas importantes

- n8n no guarda memoria de pedido en variables sueltas.
- Flowise no es la base de datos.
- `/newchat` crea una conversacion nueva y vacia.
- El dashboard/backend conserva conversaciones y pedidos.
- El bot debe usar `telegram:<chat_id>:<conversation_id>` como `sessionId`.
- Si el backend responde `pending_human`, n8n debe mandar mensaje de escalamiento y no seguir preguntando como bot.
- Aunque Flowise mande confirmacion, el backend no crea pedido en revision si faltan productos, precios, nombre, direccion, barrio, referencia o metodo de pago.
- El domicilio temporal se calcula con `DEFAULT_DELIVERY_FEE=5000` salvo recogida o una zona con valor configurado.
