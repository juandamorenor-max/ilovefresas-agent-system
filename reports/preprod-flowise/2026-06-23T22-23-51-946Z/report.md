# Flowise Preproduccion Report

- Generated: 2026-06-23T22:25:01.440Z
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
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio Cabecera del Llano
  Ruta: datos
  Bot: Barrio registrado: Cabecera del Llano. ¿Me das los demás datos?
- Cliente: referencia porteria azul
  Ruta: datos
  Bot: Referencia guardada: portería azul. ¿Me das los datos que faltan para el domicilio? Nombre, dirección, barrio y método de pago.
- Cliente: pago neqi
  Ruta: datos
  Bot: Entendido, pago con Nequi. ¿Me compartes nombre, dirección, barrio y referencia?

## Casos OK

Ninguno.

## Detalle Por Caso

### FAIL pp-001 fresas tradicionales, oblea y malteada con datos en partes

- Categoria: pedido_valido
- Session: preprod:pp-001:a3feafca-9288-4126-a413-322f74e3ec83
- Turns: 12

**Turn 1**
- Cliente: holaa
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Hola! Bienvenido a I Love Fresas Barranquilla. Que se te antoja hoy?
**Turn 2**
- Cliente: quiero unas frezas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 3**
- Cliente: tambien una oblea
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Claro, ¿cuál oblea quieres? Arequipe, Arequipe crema, Arequipe dulce de mora, Arequipe queso o Nutella.
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, oblea de arequipe. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 5**
- Cliente: y una malteada
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿De qué sabor la malteada? Fresa, chocolate, vainilla u oreo.
**Turn 6**
- Cliente: oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Quieres agregar Oreo a qué producto? Dime el producto primero.
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
- Bot: Perfecto Camila. Para el domicilio me compartes: Dirección, Barrio, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 9**
- Cliente: cra 39A #41-99
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 10**
- Cliente: barrio Cabecera del Llano
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Barrio registrado: Cabecera del Llano. ¿Me das los demás datos?
**Turn 11**
- Cliente: referencia porteria azul
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia guardada: portería azul. ¿Me das los datos que faltan para el domicilio? Nombre, dirección, barrio y método de pago.
**Turn 12**
- Cliente: pago neqi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, pago con Nequi. ¿Me compartes nombre, dirección, barrio y referencia?