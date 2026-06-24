# Flowise Preproduccion Report

- Generated: 2026-06-23T22:53:11.602Z
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
  Bot: Barrio guardado: Cabecera del Llano. ¿Me das los datos que faltan?
- Cliente: referencia porteria azul
  Ruta: datos
  Bot: Perfecto, referencia "portería azul" guardada. ¿Me das los datos que faltan?
- Cliente: pago neqi
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

## Casos OK

Ninguno.

## Detalle Por Caso

### FAIL pp-001 fresas tradicionales, oblea y malteada con datos en partes

- Categoria: pedido_valido
- Session: preprod:pp-001:6c9713f2-f4a5-412e-897a-e2d92c435d4b
- Turns: 12

**Turn 1**
- Cliente: holaa
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: ¡Hola! Bienvenido a I Love Fresas Barranquilla. ¿Qué se te antoja hoy?
**Turn 2**
- Cliente: quiero unas frezas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?
**Turn 3**
- Cliente: tambien una oblea
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, oblea. ¿Cuál quieres? Arequipe, Arequipe crema, Nutella u otra de las opciones.
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Quieres arequipe como topping o salsa? Dime qué producto quieres primero.
**Turn 5**
- Cliente: y una malteada
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada. ¿De qué sabor? Fresa, chocolate, vainilla u oreo.
**Turn 6**
- Cliente: oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Para agregar Oreo necesito saber primero el producto. ¿Qué quieres pedir?
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
- Bot: Perfecto. Para el domicilio me faltan:

Nombre: (ya tengo Camila)

Direccion:

Barrio:

Referencia:

Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 9**
- Cliente: cra 39A #41-99
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Dirección guardada. ¿Nombre completo, barrio, referencia y método de pago?
**Turn 10**
- Cliente: barrio Cabecera del Llano
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Barrio guardado: Cabecera del Llano. ¿Me das los datos que faltan?
**Turn 11**
- Cliente: referencia porteria azul
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, referencia "portería azul" guardada. ¿Me das los datos que faltan?
**Turn 12**
- Cliente: pago neqi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo