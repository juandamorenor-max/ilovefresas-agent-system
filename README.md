# ilovefresas-agent-system

Repositorio operativo para versionar prompts, documentacion, configuraciones y pruebas de regresion conversacional del sistema agentico de I Love Fresas Barranquilla.

I Love Fresas vende fresas con crema, obleas, malteadas, antojitos, toppings y adiciones por canales como WhatsApp y Telegram. Este repo no es el backend del negocio: es la base mantenible para mejorar, probar y desplegar configuraciones de agentes.

## Principio central

Flowise no debe ser la base de datos ni el dueno real del estado. Flowise interpreta mensajes, clasifica intencion y devuelve respuestas o JSON estructurado. El backend propio debe ser el dueno del estado, pedidos, eventos, dashboard, escalamiento, disponibilidad y revision humana.

n8n funciona por ahora como puente de pruebas entre Telegram y Flowise.

## Instalacion

```bash
npm install
```

## Configuracion

Copia `.env.example` a `.env` y completa solo las variables que vayas a usar.

```bash
cp .env.example .env
```

No guardes credenciales reales en git.

## Tests

Los tests corren en modo mock por defecto y no llaman Flowise real.

```bash
npm test
```

Para pruebas reales futuras:

```bash
RUN_LIVE_FLOWISE_TESTS=true npm test
```

Ese flag queda preparado, pero los tests reales deben agregarse con cuidado para no tocar produccion accidentalmente.

## Llamar Flowise

Con `.env` configurado:

```bash
npm run flowise:ask -- "hola"
```

El cliente llama:

```text
POST ${FLOWISE_API_HOST}/api/v1/prediction/${FLOWISE_FLOW_ID}
```

con body:

```json
{
  "question": "hola",
  "sessionId": "session-id"
}
```

Si `FLOWISE_API_KEY` existe, se envia `Authorization: Bearer <key>`.

## Como mejorar prompts

1. Edita los archivos en `prompts/`.
2. Agrega o ajusta casos en `tests/fixtures/conversation-cases.ts`.
3. Corre `npm test`.
4. Exporta o documenta el cambio en `flowise/current-flow-notes.md`.
5. Solo despues actualiza Flowise manualmente o usando un script futuro.

## Encaje con Telegram y n8n

Telegram envia mensajes a n8n. n8n puede llamar Flowise durante pruebas y devolver la respuesta al chat. La logica durable de pedidos, estado, disponibilidad y revision humana debe vivir en el backend propio, no en n8n ni Flowise.

## Que NO debe hacer Flowise

- No guardar estado canonico de pedidos.
- No decidir disponibilidad real.
- No calcular reglas finales de domicilio sin backend.
- No aprobar descuentos riesgosos.
- No reemplazar revision humana cuando haya reclamos, demoras, reembolsos o ambiguedades operativas.
- No ser fuente unica de verdad para catalogo, clientes o eventos.

## Resumen y cierre

El pedido debe terminar con un summary generado desde estado validado, no desde memoria libre del LLM. El contrato inicial vive en `src/orderLifecycle.ts` y la arquitectura en `docs/arquitectura-summary-cierre.md`.

Una hora despues de enviar el pedido a revision, backend o n8n debe preguntar `¿Necesitas algo más?`. Si el cliente dice que no o no responde despues del timeout, el chat se cierra para que el proximo mensaje arranque una conversacion nueva.

## Pendiente

- Conectar exportaciones reales de Flowise cuando el API/flujo de trabajo este confirmado.
- Conectar exportaciones reales de n8n sin inventar endpoints privados.
- Agregar tests live aislados de produccion.
- Conectar backend propio como dueno de estado.
- Definir dashboard de revision humana.
