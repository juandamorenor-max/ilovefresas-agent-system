# Reset de conversacion con /newchat

`/newchat` no debe depender del LLM. Debe manejarse antes de llamar a Flowise.

## Problema

Flowise mantiene memoria por `sessionId`. Si Telegram sigue llamando a Flowise con el mismo `sessionId`, el agentflow puede recordar datos anteriores aunque el usuario escriba `/newchat`.

Ejemplo de fallo:

- conversacion anterior tenia direccion/barrio;
- usuario manda `/newchat`;
- inicia pedido nuevo;
- agente de datos omite `Direccion` porque cree que ya la tiene.

## Comportamiento correcto

Cuando el cliente mande `/newchat`:

1. n8n detecta el comando antes del HTTP Request a Flowise.
2. n8n crea un nuevo `sessionId` para ese usuario.
3. n8n responde algo como: `Listo, empezamos una conversacion nueva. Que se te antoja hoy?`
4. n8n no llama Flowise para ese mensaje, o llama Flowise con estado limpio.

## SessionId recomendado

No uses solo:

```text
telegram:<chat_id>
```

porque eso conserva la misma memoria siempre.

Usa algo versionado por conversacion:

```text
telegram:<chat_id>:<conversation_id>
```

Ejemplo:

```text
telegram:5563026168:2026-06-23T19-30-00
```

## Implementacion simple en n8n

V1 manual/simple:

- Agregar un nodo IF despues de Telegram Trigger:
  - condicion: `{{$json.message.text === "/newchat"}}`
- Rama true:
  - responder por Telegram: `Listo, empezamos una conversacion nueva. Que se te antoja hoy?`
  - no llamar Flowise
- Rama false:
  - continuar a Flowise

Para que realmente cambie memoria, hay que guardar un `conversation_id` por chat.

Opciones:

- Data Store de n8n
- variable en backend
- base de datos futura

Cuando llega `/newchat`, actualizar ese `conversation_id`.

## Contrato futuro

Entrada a Flowise:

```json
{
  "question": "mensaje del cliente",
  "sessionId": "telegram:<chat_id>:<conversation_id>"
}
```

Mientras no exista `conversation_id`, `/newchat` solo sera un mensaje mas y no limpiara memoria real.
