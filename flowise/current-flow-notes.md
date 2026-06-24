# Notas del flujo actual

```text
Start
-> ROUTER CENTRAL
-> Condition route
   -> escalamiento / Direct Reply humano
   -> AGENTE MENU
      -> CONDITION ENVIAR MENU
         -> HTTP SEND MENU PDF
         -> Direct Reply MENU PDF
         -> Direct Reply MENU TEXTO
   -> AGENTE PEDIDO
      -> Direct Reply
   -> AGENTE DATOS
      -> CONDITION PEDIDO CONFIRMADO
         -> Direct Reply pedido listo/revision
         -> Direct Reply pedir siguiente dato
   -> AGENTE CONFIRMACION DE PEDIDO (requiere condicion por next_expected para confirmacion/comprobante)
   -> AGENTE GENERAL
      -> Direct Reply
```

Agentes actuales:

- ROUTER CENTRAL
- AGENTE MENU
- AGENTE PEDIDO
- AGENTE DATOS
- AGENTE GENERAL
- AGENTE CONFIRMACION DE PEDIDO (contrato/prompt local listo; requiere cableado por estado en produccion)

No existen todavia como LLM separados:

- AGENTE ESCALAMIENTO

## Cambios aplicados en Flowise copia

Fecha: 2026-06-23

Agentflow:

```text
e52f27b3-06e2-4fb0-b853-30e936b99839
```

### ROUTER CENTRAL

Se reemplazo el prompt visible por una version modular mas corta, alineada con `prompts/router-central.md`.

Cambios importantes:

- Reforzado que Flowise no es dueno del estado ni confirma pedidos finales.
- Costo exacto de domicilio, valor de envio, zona/cobertura, disponibilidad exacta y tiempo exacto ahora deben ir a `escalamiento`.
- Continuaciones cortas como `tradicional`, `oreo`, `vainilla`, `dos`, `agregale oreo`, `ponle mas crema` siguen yendo a `pedido`, no a `menu`.
- `enviar_menu=true` solo cuando piden menu completo, carta o PDF.
- Preguntas puntuales de toppings, sabores o precio puntual no fuerzan PDF.
- Corregido Update Flow State de `needs_human`:

```text
Antes: {{ output.needs_human }
Ahora: {{ output.needs_human }}
```

### AGENTE MENU

Se reemplazo el prompt visible por una version limpia alineada con `prompts/agente-menu.md`.

Cambios importantes:

- Eliminado contenido pegado con ruido de documento como `Pagina 8`.
- `enviar_menu=true` solo para menu completo/PDF/carta.
- Preguntas puntuales de toppings, sabores o precio especifico responden en texto y `enviar_menu=false`.
- Costo de domicilio, zona/cobertura, disponibilidad exacta, descuentos no listados o tiempos exactos quedan como validacion humana con `needs_human=true`.

No se corrieron tests live despues de estos cambios para evitar gasto de tokens/API. La validacion pendiente es una corrida enfocada contra la copia cuando el usuario lo autorice.

### AGENTE CONFIRMACION DE PEDIDO

Se preparo el prompt local en `prompts/futuras/agente-confirmacion.md` y se intento crear/cablear el nodo en la copia de Flowise.

Resultado seguro:

- El contrato local/backend ya define la fase `ready_for_customer_confirmation`.
- El prompt define que el agente redacta el resumen y no confirma preparacion/despacho.
- El output esperado es `mensaje_cliente`, `pedido_confirmado_por_cliente`, `needs_human`.
- El domicilio temporal es `5000`.

Decision operativa:

No se dejo cableado en Flowise todavia porque el Agentflow actual no recibe desde backend/n8n los campos estructurados `subtotal_productos`, `domicilio`, `total`, `faltantes` y `ready_for_customer_confirmation`. Cablearlo antes de eso podria hacer que el agente intente resumir con estado incompleto o fuerce escalamiento. La ruta existente de `CONDITION PEDIDO CONFIRMADO -> Direct Reply 3` fue restaurada despues de la prueba de cableado.

### Actualizacion pendiente: pago y comprobante

Fecha: 2026-06-24

El contrato local ahora define una fase intermedia:

```text
ready_for_customer_confirmation
-> awaiting_payment_proof
-> ready_for_review
```

Para Nequi, Bancolombia y Bre-B, la respuesta `si` al resumen ya no debe mandar a revision humana. Debe volver a `AGENTE CONFIRMACION DE PEDIDO`, enviar datos de pago y pedir comprobante:

- Nequi: `3000000000`
- Bancolombia: `72600000000`
- Bre-B: `@test`

El canvas necesita una condicion por estado antes de las rutas normales:

```text
if next_expected == "confirmacion" -> AGENTE CONFIRMACION DE PEDIDO
if next_expected == "comprobante_pago" -> AGENTE CONFIRMACION DE PEDIDO
else -> Condition 0 normal
```

Sin esa condicion, un `si` despues del resumen puede caer en `AGENTE GENERAL`.
