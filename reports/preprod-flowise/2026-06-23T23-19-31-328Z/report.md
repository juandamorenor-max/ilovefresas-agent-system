# Flowise Preproduccion Report

- Generated: 2026-06-23T23:20:18.151Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 9
- Passed: 1
- Failed: 0

## Resultado

APTO

## Fallos

Sin fallos criticos.

## Casos OK

- pp-004 fresas con topping y adicion en mensajes separados

## Detalle Por Caso

### PASS pp-004 fresas con topping y adicion en mensajes separados

- Categoria: pedido_valido
- Session: preprod:pp-004:60c8ba29-f24c-4c74-8d53-dc66fcd8f401
- Turns: 9

**Turn 1**
- Cliente: unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
**Turn 2**
- Cliente: con oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Listo, le agrego topping de Oreo. Quieres agregar otro producto al pedido?
**Turn 3**
- Cliente: ponle helado de vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, le agrego helado de vainilla. Quieres agregar otro producto al pedido?
**Turn 4**
- Cliente: nada mas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: Maria Jose
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 6**
- Cliente: direccion cra 43 #70-12
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: barrio Boston
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 8**
- Cliente: referencia casa blanca
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. ¿Método de pago? (Nequi, Bancolombia, Bre-B o efectivo)
**Turn 9**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> AGENTE CONFIRMACION DE PEDIDO -> Direct Reply 3
- Bot: Resumen de tu pedido:

Producto:
- 1 x Fresas con crema tradicional: 16000
- Topping Oreo: 2000
- Adicion helado de vainilla: 4000

Tus datos:
- Nombre: Maria Jose
- Direccion: cra 43 #70-12
- Barrio: Boston
- Referencia: casa blanca
- Metodo de pago: nequi

Subtotal productos: 22000
Domicilio: 5000
Total: 27000

Esta correcto para dejarlo en revision con el equipo?