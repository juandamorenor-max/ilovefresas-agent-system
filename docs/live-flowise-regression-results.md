# Resultados de regresion live Flowise

Ultima corrida registrada:

```text
Fecha: 2026-06-23
Agentflow: e52f27b3-06e2-4fb0-b853-30e936b99839
Comando: RUN_LIVE_FLOWISE_TESTS=true npm run test:live
```

## Resultado observado

La primera corrida live ejecuto 12 casos contra la copia de Flowise:

- 10 casos pasaron.
- 1 caso fallo por timeout de 30s.
- 1 caso fallo por ruta incorrecta.

## Brechas detectadas

### Costo de domicilio enruta mal

Mensaje:

```text
cuanto cuesta el domicilio hasta Villa Santos
```

Esperado:

```text
route = escalamiento
```

Recibido:

```text
route = menu
```

Impacto:

- El bot puede intentar responder desde menu una pregunta operativa que no debe inventar.
- Costo de domicilio debe validarlo backend u operario.
- El router de Flowise debe priorizar costo de domicilio, zonas y disponibilidad exacta como escalamiento o validacion operativa.

### Timeout en pedido inicial

Mensaje:

```text
quiero unas fresas con crema
```

Resultado:

```text
Timeout de test a los 30s
```

Accion tomada:

- Se subio el timeout por caso live a 60s para distinguir lentitud real de fallo funcional.

## Lectura del estado actual

La copia de Flowise ya cumple varios casos importantes:

- Saludo y bienvenida.
- Menu basico.
- Pregunta de toppings.
- Continuaciones de pedido como `tradicional`, `agrega Oreo` y `mejor dos`.
- Pago por Nequi.
- Domicilio sin costo exacto como datos.
- Descuento riesgoso y humano como escalamiento.

La primera brecha funcional prioritaria es domicilio/costo exacto.

## Cambios posteriores en Flowise copia

Fecha: 2026-06-23

Se editaron directamente en la UI de Flowise los nodos:

- `ROUTER CENTRAL`
- `AGENTE MENÚ`

Objetivo de la edicion:

- Corregir ruta de domicilio/costo exacto hacia `escalamiento`.
- Evitar que preguntas puntuales de toppings, sabores o precio disparen envio de PDF.
- Corregir `needs_human` roto en Update Flow State.
- Reducir prompt pegado/ruidoso en `AGENTE MENÚ`.

No se ejecuto otra corrida live despues del cambio para evitar gasto. Pendiente cuando se autorice:

```bash
RUN_LIVE_FLOWISE_TESTS=true npm run test:live
```
