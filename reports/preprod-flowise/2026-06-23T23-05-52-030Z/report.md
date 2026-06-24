# Flowise Preproduccion Report

- Generated: 2026-06-23T23:06:55.371Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 12
- Passed: 0
- Failed: 1

## Resultado

NO APTO

## Fallos

### pp-001 fresas tradicionales, oblea y malteada con datos en partes

- missing text somewhere: "Resumen"
- missing text somewhere: "Total"

Ultimas respuestas:

- Cliente: barrio Cabecera del Llano
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: referencia porteria azul
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: pago neqi
  Ruta: datos
  Bot: pago neqi

## Casos OK

Ninguno.

## Detalle Por Caso

### FAIL pp-001 fresas tradicionales, oblea y malteada con datos en partes

- Categoria: pedido_valido
- Session: preprod:pp-001:7ed60bb2-7aad-441c-85a8-474bcf6c9f8f
- Turns: 12

**Turn 1**
- Cliente: holaa
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Hola! Bienvenido a I Love Fresas Barranquilla. ¿Qué se te antoja hoy?
**Turn 2**
- Cliente: quiero unas frezas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
**Turn 3**
- Cliente: tambien una oblea
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Cuál oblea quieres? Tenemos: Arequipe, Arequipe crema, Arequipe dulce de mora, Arequipe queso, Nutella, Arequipe crema y dulce de mora, Arequipe queso y crema, Crema y Nutella, Arequipe queso crema dulce de mora, Arequipe queso crema fresa, Arequipe queso crema durazno, Arequipe queso crema dulce de mora fresa, Arequipe queso crema dulce de mora durazno.
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Qué producto quieres con arequipe? Tenemos obleas o fresas con crema.
**Turn 5**
- Cliente: y una malteada
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿De qué sabor la malteada? Fresa, chocolate, vainilla u oreo.
**Turn 6**
- Cliente: oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Oreo como topping o producto? Tenemos Fresas con crema de Oreo o Mix Oreo.
**Turn 7**
- Cliente: no mas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 8**
- Cliente: soy Camila
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, Camila. Para el domicilio me faltan: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 9**
- Cliente: cra 39A #41-99
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Dirección guardada. Me faltan nombre, barrio, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 10**
- Cliente: barrio Cabecera del Llano
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 11**
- Cliente: referencia porteria azul
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 12**
- Cliente: pago neqi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: pago neqi