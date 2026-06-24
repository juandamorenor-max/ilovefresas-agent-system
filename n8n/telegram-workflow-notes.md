# Telegram workflow notes

Flujo esperado:

```text
Telegram
-> n8n webhook
-> detectar comandos de control (/newchat)
-> Flowise prediction
-> n8n response
-> Telegram
```

Comando de backtesting:

- `/newchat`: reinicia la conversacion activa del chat de prueba y no llama Flowise.
- `/newchat etiqueta`: reinicia la conversacion y guarda la etiqueta para identificar el caso probado.

El `sessionId` recomendado para Flowise es `telegram:{chatId}:{conversationId}`.

Pendientes:

- Documentar webhook real cuando exista.
- Exportar workflow en `n8n/exports/`.
- Confirmar si el flujo es solo para pruebas o tambien para beta.
- Definir donde se guarda temporalmente el `conversationId` activo por `chatId`.
- Agregar nodo Code/Function antes de HTTP Request para interceptar `/newchat`.
- Usar `telegram:{chatId}:{conversationId}` como `sessionId` en el body hacia Flowise.

## Estado de edicion UI

Ultimo intento en n8n cloud:

- Se abrio el workflow `1whquJktIBm3WqkG`.
- Se edito el nodo `HTTP Request` en pantalla.
- URL cambiada de `e75ef448-0577-4e72-b457-c74aae18cdf5` a `e52f27b3-06e2-4fb0-b853-30e936b99839`.
- `sessionId` paso de vacio a expresion basada en chat de Telegram:

```text
={{ 'telegram:' + $('Telegram Trigger').item.json.message.chat.id }}
```

- Se logro publicar el borrador desde una pestaña limpia de n8n.
- La UI volvio a mostrar `Published`.
- El nodo `HTTP Request` publicado muestra:

```text
POST: https://cloud.flowiseai.com/api/v1/prediction/e52f27b3-06e2-4fb0-b853-30e936b99839
```

- Queda pendiente completar los nodos `/newchat`.
- Se intento agregar un nodo `Code` desde el panel de nodos para implementar `/newchat`, pero al seleccionar el resultado `Code` Chrome volvio a bloquear automatizacion por una UI de extension abierta sobre la pagina.
- La sesion de Chrome se finalizo dejando la pestana de n8n como handoff.

Snippet listo para el siguiente intento:

```text
n8n/snippets/prepare-telegram-session.js
```

Workflow objetivo local:

```text
n8n/exports/telegram-flowise-newchat-target.json
```

Ese JSON documenta la estructura deseada con:

- `Telegram Trigger`
- `Prepare Telegram Session`
- `Should Call Flowise?`
- `Flowise Prediction`
- `Normalize Flowise Response`
- `Send Flowise Text`
- `Send Control Text`

`Normalize Flowise Response` existe para no depender de un unico shape de Flowise. Acepta campos como `text`, `mensaje_cliente`, `json.mensaje_cliente`, `json.respuesta`, `response`, `answer`, `message` y `data.text`. Si no encuentra texto, responde con fallback seguro y marca `needs_human=true`.
