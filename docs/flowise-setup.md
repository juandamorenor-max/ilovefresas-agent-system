# Flowise setup

## Host y Agentflow

Configura en `.env`:

```text
FLOWISE_API_HOST=https://cloud.flowiseai.com
FLOWISE_FLOW_ID=
FLOWISE_API_KEY=
```

El cliente local usa:

```text
POST ${FLOWISE_API_HOST}/api/v1/prediction/${FLOWISE_FLOW_ID}
```

`FLOWISE_FLOW_ID` debe ser el ID del Agentflow. Flowise documenta el endpoint de prediccion como `/prediction/{id}` para enviar mensajes al flow. Para Agentflow V2 el body tambien puede usar `form`, pero para el flujo conversacional de Telegram/WhatsApp usamos `question` y `sessionId`.

## Exportaciones

Guarda exports manuales en `flowise/exports/`. No subas secretos.

## Prompts

Los prompts fuente viven en `prompts/`. Flowise debe actualizarse desde esos archivos o desde un script futuro que use una API confirmada.

## Nota

No se inventan endpoints privados de Flowise. Cualquier automatizacion de import/export debe documentar el endpoint oficial usado.
