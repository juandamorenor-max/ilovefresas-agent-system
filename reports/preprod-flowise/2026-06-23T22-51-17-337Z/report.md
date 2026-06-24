# Flowise Preproduccion Report

- Generated: 2026-06-23T22:51:26.603Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 2
- Passed: 1
- Failed: 0

## Resultado

APTO

## Fallos

Sin fallos criticos.

## Casos OK

- pp-020 producto inexistente chocomix

## Detalle Por Caso

### PASS pp-020 producto inexistente chocomix

- Categoria: anti_invencion
- Session: preprod:pp-020:e93c64e4-d98b-411e-a8a9-6dcb65a40872
- Turns: 2

**Turn 1**
- Cliente: quiero unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
**Turn 2**
- Cliente: y un chocomix
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Ese producto no aparece en el menu por ahora. Te puedo ayudar con las opciones disponibles.