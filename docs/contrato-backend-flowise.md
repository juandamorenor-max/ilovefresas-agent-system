# Contrato backend / Flowise

Este contrato define como Flowise debe entregar interpretacion y como el backend decide el estado real del pedido.

## Principio

Flowise propone. El backend valida y persiste.

Esto evita que un prompt grande confirme pedidos, invente costos o arrastre estado viejo. Cada turno debe producir una propuesta estructurada; el backend la acepta parcialmente, la rechaza o escala.

## Entrada desde canal

El backend o n8n debe construir:

```json
{
  "conversationId": "case-001",
  "channel": "telegram",
  "channelContact": "telegram:123",
  "message": "quiero unas fresas con crema",
  "catalogo_disponible": {
    "productos": [],
    "toppings": [],
    "adiciones": []
  }
}
```

Para Telegram, el contrato local vive en `src/telegramSession.ts`. Ese paso debe ocurrir antes de llamar Flowise para poder manejar `/newchat` y aislar backtests.

`channelContact` puede ser:

- `whatsapp:+573001234567`
- `telegram:123456789`

Si existe contacto de canal, el bot no debe pedir telefono solo por pedirlo.

`catalogo_disponible` debe construirse desde backend/n8n antes de llamar Flowise. Para V1, el contrato de disponibilidad extraido del dashboard esta documentado en `docs/dashboard-disponibilidad-contrato.md`.

Flowise puede leer `catalogo_disponible`, pero no es dueno de disponibilidad. Si el contexto falta, los agentes pueden usar el catalogo local como lista autorizada, pero no deben afirmar disponibilidad exacta.

## Propuesta esperada desde Flowise

```json
{
  "route": "pedido",
  "confidence": 0.9,
  "reason": "cliente pide producto",
  "items": [
    {
      "producto": "Fresas con crema tradicional",
      "cantidad": 2,
      "toppings": ["Oreo"]
    }
  ],
  "datos": {
    "nombre": "Laura",
    "direccion": "Calle 80 #50-20",
    "barrio": "Alto Prado",
    "metodo_pago": "nequi"
  },
  "observaciones": ["sin cerezas"],
  "needs_human": false,
  "pedido_confirmado": false
}
```

El campo `pedido_confirmado` no es autoridad final. Si Flowise lo manda en `true` pero faltan datos, el backend debe ignorarlo.

## Estado canonico del backend

Estados sugeridos:

```text
open
collecting_order
collecting_data
ready_for_customer_confirmation
ready_for_review
sent_for_review
closing_prompt_sent
closed
escalated
cancelled
```

El backend decide el estado segun:

- Items validos.
- Cantidades.
- Sabores/variantes requeridos.
- Datos de entrega.
- Contacto de canal o telefono.
- Metodo de pago.
- Reglas de escalamiento.

## Acciones posibles

```text
ask_for_order
ask_for_data
ask_customer_confirmation
send_to_review
escalate_to_human
reply
```

`ask_customer_confirmation` significa que el backend ya valido datos, calculo subtotal/domicilio/total y debe mostrarle al cliente el resumen para que diga si esta correcto.

`send_to_review` no significa preparar ni despachar. Significa que el cliente ya confirmo el resumen y el pedido esta listo para que el operario lo revise.

## Reglas duras

- Costos de domicilio exactos escalan o esperan backend operativo.
- Disponibilidad exacta escala o espera backend operativo.
- Descuentos no listados escalan.
- Reclamos, reembolsos y demoras escalan.
- Baja confianza de Flowise escala.
- Pedido incompleto nunca pasa a revision.
- Flowise no calcula totales finales desde memoria libre.
- Para V1, el domicilio es fijo `5000`.
- En el futuro, el agente de confirmacion puede gestionar precio de domicilio solo si recibe una tabla/regla estructurada de backend.
- El pedido no pasa a `send_to_review` hasta que el cliente confirme explicitamente el resumen.

## Implementacion local

El contrato esta modelado en:

- `src/backendOrder.ts`
- `tests/conversations/backendOrder.test.ts`
- `src/orderLifecycle.ts`

Estos archivos no llaman Flowise ni consumen tokens. Sirven como red de seguridad local para convertir bugs de conversacion en tests.

La primera API interna para conectar n8n con el dashboard/backend quedo documentada en:

- `docs/n8n-dashboard-flowise-bridge.md`

Y esta implementada en el backend existente:

- `C:\Users\PC\Documents\chatbot i love fresas v2\src\routes\bot-integration.routes.ts`
- `C:\Users\PC\Documents\chatbot i love fresas v2\src\services\bot-integration.service.ts`
