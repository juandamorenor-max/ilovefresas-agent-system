# Flowise Preproduccion Report

- Generated: 2026-06-23T23:21:25.674Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: no
- Cases: 1
- Turns/predictions: 12
- Passed: 1
- Failed: 0

## Resultado

APTO

## Fallos

Sin fallos criticos.

## Casos OK

- pp-001 fresas tradicionales, oblea y malteada con datos en partes

## Detalle Por Caso

### PASS pp-001 fresas tradicionales, oblea y malteada con datos en partes

- Categoria: pedido_valido
- Session: preprod:pp-001:75e5bf17-8e28-4dfe-8b34-34689af3babf
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
- Bot: Claro, ¿qué oblea quieres? Arequipe, Nutella o Arequipe crema.
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, oblea de arequipe. Quieres agregar otro producto al pedido?
**Turn 5**
- Cliente: y una malteada
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada. ¿De qué sabor? Fresa, chocolate, vainilla u oreo.
**Turn 6**
- Cliente: oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada de oreo. Quieres agregar otro producto al pedido?
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
- Bot: Perfecto Camila. Para el domicilio me faltan:

Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 9**
- Cliente: cra 39A #41-99
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 10**
- Cliente: barrio Cabecera del Llano
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 11**
- Cliente: referencia porteria azul
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. ¿Cuál es tu método de pago? (Nequi, Bancolombia, Bre-B o efectivo)
**Turn 12**
- Cliente: pago neqi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> AGENTE CONFIRMACION DE PEDIDO -> Direct Reply 3
- Bot: Resumen de tu pedido:

Producto:
- 1 x Fresas con crema tradicional: 16000
- 1 x Oblea Arequipe
- 1 x Malteada oreo

Tus datos:
- Nombre: Camila
- Direccion: cra 39A #41-99
- Barrio: Cabecera del Llano
- Referencia: porteria azul
- Metodo de pago: nequi

Subtotal productos: 
Domicilio: 5000
Total: 

Falta precio de algunos productos. Esta correcto para dejarlo en revision con el equipo?