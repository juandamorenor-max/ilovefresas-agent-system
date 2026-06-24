# n8n: HTTP Request unico hacia backend

Usar este nodo despues de `Telegram Trigger`.

## Node

```text
HTTP Request
```

## Method

```text
POST
```

## URL local

```text
http://localhost:3000/bot/turn
```

## URL produccion

```text
https://TU_BACKEND_PUBLICO/bot/turn
```

## Body JSON

```json
{
  "channel": "telegram",
  "chatId": "={{ $('Telegram Trigger').item.json.message.chat.id }}",
  "text": "={{ $('Telegram Trigger').item.json.message.text || '' }}"
}
```

## Header opcional recomendado en produccion

Name:

```text
X-Bot-Secret
```

Value:

```text
TU_SECRETO_COMPARTIDO
```

## Telegram Send Message

Chat ID:

```text
={{ $('Telegram Trigger').item.json.message.chat.id }}
```

Text:

```text
={{ $json.responseText }}
```

## Nota

Con este camino n8n no guarda estado ni arma el payload de Flowise. El backend hace:

```text
cargar conversacion -> catalogo disponible -> Flowise -> guardar estado -> crear pedido si confirma
```
