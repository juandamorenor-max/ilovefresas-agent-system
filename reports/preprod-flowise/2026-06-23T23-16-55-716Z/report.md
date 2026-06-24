# Flowise Preproduccion Report

- Generated: 2026-06-23T23:17:42.788Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 9
- Passed: 0
- Failed: 1

## Resultado

NO APTO

## Fallos

### pp-004 fresas con topping y adicion en mensajes separados

- missing text somewhere: "Resumen"
- missing text somewhere: "Total"

Ultimas respuestas:

- Cliente: barrio Boston
  Ruta: datos
  Bot: Perfecto, barrio Boston guardado. ¿Me das los datos que faltan? Nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
- Cliente: referencia casa blanca
  Ruta: datos
  Bot: Perfecto, guardé "casa blanca" como referencia. ¿Me das los datos que faltan? Nombre, dirección, barrio y método de pago.
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto, método de pago Nequi guardado. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia:

## Casos OK

Ninguno.

## Detalle Por Caso

### FAIL pp-004 fresas con topping y adicion en mensajes separados

- Categoria: pedido_valido
- Session: preprod:pp-004:f58bacd2-ddb4-4ee9-bf31-eefbe170b32a
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
- Bot: No hay un producto activo para agregar Oreo. ¿Qué quieres pedir?
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
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 6**
- Cliente: direccion cra 43 #70-12
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: barrio Boston
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, barrio Boston guardado. ¿Me das los datos que faltan? Nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 8**
- Cliente: referencia casa blanca
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, guardé "casa blanca" como referencia. ¿Me das los datos que faltan? Nombre, dirección, barrio y método de pago.
**Turn 9**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, método de pago Nequi guardado. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: