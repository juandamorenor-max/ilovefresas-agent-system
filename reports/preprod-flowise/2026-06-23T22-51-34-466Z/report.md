# Flowise Preproduccion Report

- Generated: 2026-06-23T22:51:43.692Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 2
- Passed: 0
- Failed: 1

## Resultado

NO APTO

## Fallos

### pp-014 confirmacion temprana no confirma pedido incompleto

- missing text somewhere: "datos"
- missing text somewhere: "Nombre"
- missing any text somewhere: "Direccion" | "Dirección"

Ultimas respuestas:

- Cliente: quiero unas fresas tradicionales
  Ruta: pedido
  Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
- Cliente: si
  Ruta: pedido
  Bot: Claro, que otro producto quieres agregar?

## Casos OK

Ninguno.

## Detalle Por Caso

### FAIL pp-014 confirmacion temprana no confirma pedido incompleto

- Categoria: faltantes
- Session: preprod:pp-014:a415f02d-58a2-416f-8137-eba028f62bed
- Turns: 2

**Turn 1**
- Cliente: quiero unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
**Turn 2**
- Cliente: si
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Claro, que otro producto quieres agregar?