# Flowise Preproduccion Report

- Generated: 2026-06-23T22:38:22.396Z
- Flowise host: https://cloud.flowiseai.com
- Flow ID: e52f27b3-06e2-4fb0-b853-30e936b99839
- Strict mode: yes
- Cases: 30
- Turns/predictions: 150
- Passed: 9
- Failed: 21

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
  Bot: Entendido, barrio Cabecera del Llano. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: referencia porteria azul
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: pago neqi
  Ruta: datos
  Bot: Entendido, pago con Nequi. ¿Me das los demás datos para el domicilio? Nombre, dirección, barrio y referencia.

### pp-002 pedido largo de cinco productos con cantidades mixtas

- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

Ultimas respuestas:

- Cliente: barrio Alto Prado
  Ruta: datos
  Bot: Recibido barrio Alto Prado. ¿Me das los demás datos para el domicilio? Nombre, Dirección, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
- Cliente: referencia edificio gris apto 302
  Ruta: datos
  Bot: Referencia recibida: edificio gris apto 302. ¿Me das los datos que faltan? Nombre, dirección, barrio y método de pago.
- Cliente: efectivo
  Ruta: datos
  Bot: Perfecto, registrado pago en efectivo. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia:

### pp-004 fresas con topping y adicion en mensajes separados

- missing text somewhere: "Oreo"
- missing text somewhere: "Resumen"
- missing text somewhere: "Total"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio Boston
  Ruta: datos
  Bot: Barrio Boston registrado. ¿Cuál es tu nombre, dirección, referencia y método de pago?
- Cliente: referencia casa blanca
  Ruta: datos
  Bot: Referencia guardada: casa blanca. ¿Nombre, dirección, barrio o método de pago?
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto, registrado Nequi como método de pago. ¿Me compartes nombre, dirección, barrio y referencia para el domicilio?

### pp-005 combinados y vaso helado con typos

- final route expected datos, got general
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio El Prado
  Ruta: datos
  Bot: Perfecto, barrio El Prado registrado. Para el domicilio me faltan: Nombre, Direccion, Referencia y Metodo de pago (Nequi, Bancolombia, Bre-B o efectivo).
- Cliente: referencia al lado de la tienda
  Ruta: datos
  Bot: Referencia recibida: al lado de la tienda. ¿Me puedes dar tu nombre, dirección, barrio y método de pago?
- Cliente: bre-b
  Ruta: general
  Bot: No entendí el mensaje. Si quieres, salúdame o cuéntame qué se te antoja.

### pp-006 pedido para recoger no debe pedir direccion completa

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: para recoger
  Ruta: datos
  Bot: Entendido, para recoger. ¿Me compartes tu nombre y método de pago (Nequi, Bancolombia, Bre-B o efectivo)?
- Cliente: soy Natalia
  Ruta: datos
  Bot: Perfecto, Natalia. Para el domicilio me compartes estos datos, por favor:
- Cliente: pago en efectivo
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### pp-007 fresas genericas deben pedir variante concreta

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: quiero unas fresas
  Ruta: pedido
  Bot: ¿Quieres fresas con crema tradicional, fresas con helado o alguna de las combinadas como fresa durazno?
- Cliente: tradicional
  Ruta: pedido
  Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
- Cliente: no
  Ruta: pedido
  Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### pp-008 pedido largo con cambio de cantidad

- missing text somewhere: "2"
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio El Golf
  Ruta: datos
  Bot: Recibido barrio El Golf. ¿Me das los demás datos para el domicilio? (Nombre, Dirección, Referencia, Método de pago)
- Cliente: referencia lobby principal
  Ruta: datos
  Bot: Referencia guardada: lobby principal. ¿Me puedes dar los datos que faltan? Nombre, dirección, barrio y método de pago.
- Cliente: nequi
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### pp-009 falta referencia

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: direccion cra 44 #82-11
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: barrio Riomar
  Ruta: datos
  Bot: Recibí el barrio Riomar. ¿Me puedes dar nombre, dirección, referencia y método de pago?
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto, registrado Nequi como método de pago. ¿Me compartes los datos que faltan para el domicilio?

### pp-010 falta metodo de pago

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: calle 79 #50-35
  Ruta: datos
  Bot: Entendido, dirección: calle 79 #50-35. ¿Me puedes dar tu nombre, barrio, referencia y método de pago?
- Cliente: barrio Alto Prado
  Ruta: datos
  Bot: Recibido barrio Alto Prado. ¿Me das los demás datos para el domicilio? Nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
- Cliente: referencia porteria
  Ruta: datos
  Bot: Entendido, referencia: portería. ¿Me das los demás datos para el domicilio? Nombre, dirección, barrio y método de pago.

### pp-011 barrio solo no cuenta como direccion

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio Boston
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: referencia casa amarilla
  Ruta: datos
  Bot: referencia casa amarilla
- Cliente: efectivo
  Ruta: datos
  Bot: Perfecto, registrado pago en efectivo. ¿Me compartes los demás datos para el domicilio? Nombre, Dirección, Barrio, Referencia.

### pp-012 direccion sin barrio

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: cra 45 #80-22
  Ruta: datos
  Bot: Perfecto, dirección registrada: cra 45 #80-22. Ahora, para completar tus datos de domicilio, por favor comparte: Nombre, Barrio, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
- Cliente: referencia edificio blanco
  Ruta: datos
  Bot: Referencia guardada. ¿Qué más necesitas?
- Cliente: Bancolombia
  Ruta: datos
  Bot: Bancolombia

### pp-014 confirmacion temprana no confirma pedido incompleto

- final route expected pedido, got general
- missing text somewhere: "Nombre"
- missing text somewhere: "Direccion"
- missing text somewhere: "Dirección"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: quiero unas fresas tradicionales
  Ruta: pedido
  Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
- Cliente: si
  Ruta: general
  Bot: Listo. Me cuentas que se te antoja.

### pp-015 agregar topping despues de pregunta de otro producto

- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: Riomar
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: apto 201
  Ruta: datos
  Bot: Ese dato corresponde a nombre, direccion, barrio, referencia o metodo de pago?
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### pp-016 cambiar cantidad a dos

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

Ultimas respuestas:

- Cliente: El Golf
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: casa 2
  Ruta: datos
  Bot: ¿Ese "casa 2" es tu referencia (casa, edificio, etc.)? Por favor confírmame o dame los datos completos.
- Cliente: efectivo
  Ruta: datos
  Bot: Perfecto, registrado pago en efectivo. Para el domicilio me compartes estos datos, por favor: Nombre: Direccion: Barrio: Referencia:

### pp-017 cambiar direccion antes del resumen

- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: barrio Prado
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: referencia porteria negra
  Ruta: datos
  Bot: ¿Algo más para la referencia o seguimos con los demás datos?
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto, registrado Nequi como método de pago. Para el domicilio me compartes estos datos, por favor: Nombre: Direccion: Barrio: Referencia:

### pp-018 cambiar metodo de pago

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

Ultimas respuestas:

- Cliente: recepcion
  Ruta: datos
  Bot: Ese dato "recepcion" no lo reconozco como nombre, direccion, barrio, referencia o metodo de pago. ¿A cuál de esos campos corresponde?
- Cliente: Nequi
  Ruta: datos
  Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: mejor efectivo
  Ruta: datos
  Bot: Perfecto, efectivo. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:

### pp-019 anade otro producto despues de solo eso

- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: solo eso
  Ruta: pedido
  Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
- Cliente: espera tambien una oblea
  Ruta: pedido
  Bot: Que oblea quieres? Arequipe, Arequipe crema, Nutella o Arequipe queso?
- Cliente: arequipe
  Ruta: pedido
  Bot: ¿Qué producto quieres con arequipe? Tenemos obleas, malteadas o antojitos.

### pp-020 producto inexistente chocomix

- missing text somewhere: "no aparece en el menu"
- missing text somewhere: "no está en el menú"
- missing text somewhere: "no lo manejamos"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: quiero unas fresas tradicionales
  Ruta: pedido
  Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
- Cliente: y un chocomix
  Ruta: pedido
  Bot: Perfecto, chocomix. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.

### pp-021 producto externo pizza

- missing text somewhere: "no aparece en el menu"
- missing text somewhere: "no está en el menú"
- missing text somewhere: "no lo manejamos"

Ultimas respuestas:

- Cliente: quiero una pizza hawaiana
  Ruta: pedido
  Bot: Lo siento, no tenemos pizza hawaiana en el menú. ¿Quieres ver opciones de fresas con crema, obleas, malteadas o wafles?

### pp-022 topping inexistente

- missing text somewhere: "no aparece"
- missing text somewhere: "no lo manejamos"
- missing text somewhere: "opciones disponibles"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

Ultimas respuestas:

- Cliente: fresas tradicionales
  Ruta: pedido
  Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
- Cliente: ponle gomitas acidas
  Ruta: pedido
  Bot: Primero elige un producto para agregarle gomitas.

### pp-024 producto mal escrito no inequivoco

- missing text somewhere: "no aparece"
- missing text somewhere: "menu"
- missing text somewhere: "menú"

Ultimas respuestas:

- Cliente: quiero un fresiloco mega
  Ruta: pedido
  Bot: No tenemos fresiloco mega disponible. Quieres alguna de estas fresas: Fresas con crema tradicional o Fresas con helado?

## Casos OK

- pp-003 wafle con fruta helado salsa y otro producto
- pp-013 wafle incompleto no debe avanzar a datos
- pp-023 sabor no autorizado
- pp-025 reclamo escala
- pp-026 reembolso escala
- pp-027 descuento escala
- pp-028 tiempo exacto escala
- pp-029 menu completo activa envio menu
- pp-030 toppings no deben mandar pdf ni inventar costo extra

## Detalle Por Caso

### FAIL pp-001 fresas tradicionales, oblea y malteada con datos en partes

- Categoria: pedido_valido
- Session: preprod:pp-001:bedb57b4-f8eb-4f36-acb7-8b9372495a83
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
- Bot: Tambien una oblea. Cual de estas quieres: Arequipe, Arequipe crema, Arequipe dulce de mora, Arequipe queso, Nutella, Arequipe crema y dulce de mora, Arequipe queso y crema, Crema y Nutella, Arequipe queso crema dulce de mora, Arequipe queso crema fresa, Arequipe queso crema durazno, Arequipe queso crema dulce de mora fresa o Arequipe queso crema dulce de mora durazno?
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Para que producto quieres arequipe?
**Turn 5**
- Cliente: y una malteada
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿De qué sabor la malteada? Fresa, chocolate, vainilla u oreo.
**Turn 6**
- Cliente: oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Oreo como topping o producto? Tenemos Fresas con crema de Oreo, Mix Oreo o Mix Oreo Milo. Cual prefieres?
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
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 10**
- Cliente: barrio Cabecera del Llano
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, barrio Cabecera del Llano. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 11**
- Cliente: referencia porteria azul
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 12**
- Cliente: pago neqi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, pago con Nequi. ¿Me das los demás datos para el domicilio? Nombre, dirección, barrio y referencia.

### FAIL pp-002 pedido largo de cinco productos con cantidades mixtas

- Categoria: pedido_valido
- Session: preprod:pp-002:65dd9ddd-f6f5-4c1c-8ff0-d175eaea5f2f
- Turns: 13

**Turn 1**
- Cliente: quiero hacer un pedido grande
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, ¿qué productos quieres para tu pedido grande? Por ejemplo: fresas con crema tradicional, wafle tradicional, etc.
**Turn 2**
- Cliente: dos fresas con crema tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, 2 fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 3**
- Cliente: agregales oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: agregales oreo
**Turn 4**
- Cliente: un brownie con helado
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, brownie con helado. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 5**
- Cliente: una pavlova
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, pavlova. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 6**
- Cliente: dos obleas de nutella
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, 2 obleas de nutella. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 7**
- Cliente: una malteada de vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada de vainilla. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 8**
- Cliente: listo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: listo
**Turn 9**
- Cliente: me llamo Andres
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, nombre registrado.
**Turn 10**
- Cliente: direccion calle 84 #52-20
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: ¡Dirección registrada! ¿Me compartes nombre, barrio, referencia y método de pago?
**Turn 11**
- Cliente: barrio Alto Prado
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Recibido barrio Alto Prado. ¿Me das los demás datos para el domicilio? Nombre, Dirección, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 12**
- Cliente: referencia edificio gris apto 302
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia recibida: edificio gris apto 302. ¿Me das los datos que faltan? Nombre, dirección, barrio y método de pago.
**Turn 13**
- Cliente: efectivo
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado pago en efectivo. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia:

### PASS pp-003 wafle con fruta helado salsa y otro producto

- Categoria: pedido_valido
- Session: preprod:pp-003:953a0786-f3b8-420a-a12c-83958a267c6b
- Turns: 11

**Turn 1**
- Cliente: quiero un wafle tradicional
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Listo, para el wafle tradicional escoge una fruta: fresa, banano o durazno.
**Turn 2**
- Cliente: con fresa
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Que sabor de helado quieres: vainilla, chocolate, fresa u oreo?
**Turn 3**
- Cliente: helado de vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Qué producto quieres con helado de vainilla? Tenemos fresas con crema, wafles, malteadas u otros.
**Turn 4**
- Cliente: salsa de arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: salsa de arequipe
**Turn 5**
- Cliente: tambien una malteada oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: tambien una malteada oreo
**Turn 6**
- Cliente: ya
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Listo. Me cuentas que se te antoja.
**Turn 7**
- Cliente: Laura
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre: (ya tengo Laura)

Direccion:

Barrio:

Referencia:

Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 8**
- Cliente: cra 50 #80-10
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Dirección guardada. ¿Me das tu nombre, barrio, referencia y método de pago?
**Turn 9**
- Cliente: Villa Country
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, barrio Villa Country anotado. ¿Me das el resto de tus datos para el domicilio? Nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 10**
- Cliente: torre 1 apto 604
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, guardé la referencia. ¿Me das tu nombre, dirección, barrio y método de pago?
**Turn 11**
- Cliente: Bancolombia
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Bancolombia

### FAIL pp-004 fresas con topping y adicion en mensajes separados

- Categoria: pedido_valido
- Session: preprod:pp-004:60badea1-2e1f-4e27-a44b-b5b677527d34
- Turns: 9

**Turn 1**
- Cliente: unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: con oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: No hay un producto activo todavia. Que te gustaria pedir? Fresas con crema tradicional, wafle tradicional u otra opcion del catalogo?
**Turn 3**
- Cliente: ponle helado de vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, le agrego helado de vainilla. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
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
- Bot: Maria Jose
**Turn 6**
- Cliente: direccion cra 43 #70-12
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Recibí tu dirección: cra 43 #70-12. ¿Me puedes dar tu nombre, barrio, referencia y método de pago?
**Turn 7**
- Cliente: barrio Boston
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Barrio Boston registrado. ¿Cuál es tu nombre, dirección, referencia y método de pago?
**Turn 8**
- Cliente: referencia casa blanca
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia guardada: casa blanca. ¿Nombre, dirección, barrio o método de pago?
**Turn 9**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado Nequi como método de pago. ¿Me compartes nombre, dirección, barrio y referencia para el domicilio?

### FAIL pp-005 combinados y vaso helado con typos

- Categoria: pedido_valido
- Session: preprod:pp-005:e7c57e6c-2609-43fd-b838-83a7ce00c239
- Turns: 9

**Turn 1**
- Cliente: buenas quiero un combiando fresa durazno con crema
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, combinado fresa durazno con crema. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: y un vaso elado de dos sabores
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, vaso helado de dos sabores. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 3**
- Cliente: fresa y chocolate
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con chocolate. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 4**
- Cliente: solo eso
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: Santiago Perez
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 6**
- Cliente: cll 72 #46-18
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Dirección registrada. Para completar el domicilio necesito: nombre, barrio, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 7**
- Cliente: barrio El Prado
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, barrio El Prado registrado. Para el domicilio me faltan: Nombre, Direccion, Referencia y Metodo de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 8**
- Cliente: referencia al lado de la tienda
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia recibida: al lado de la tienda. ¿Me puedes dar tu nombre, dirección, barrio y método de pago?
**Turn 9**
- Cliente: bre-b
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: No entendí el mensaje. Si quieres, salúdame o cuéntame qué se te antoja.

### FAIL pp-006 pedido para recoger no debe pedir direccion completa

- Categoria: pedido_valido
- Session: preprod:pp-006:4a36338b-97dd-45b4-9d3b-2ee29e537aa6
- Turns: 4

**Turn 1**
- Cliente: quiero una malteada de chocolate y una oblea arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada de chocolate y oblea arequipe. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: para recoger
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, para recoger. ¿Me compartes tu nombre y método de pago (Nequi, Bancolombia, Bre-B o efectivo)?
**Turn 3**
- Cliente: soy Natalia
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, Natalia. Para el domicilio me compartes estos datos, por favor:
**Turn 4**
- Cliente: pago en efectivo
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### FAIL pp-007 fresas genericas deben pedir variante concreta

- Categoria: pedido_valido
- Session: preprod:pp-007:77c99994-37a0-4a36-89d0-8aae34f9a9d1
- Turns: 4

**Turn 1**
- Cliente: hola
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Hola! Bienvenido a I Love Fresas Barranquilla. Que se te antoja hoy?
**Turn 2**
- Cliente: quiero unas fresas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Quieres fresas con crema tradicional, fresas con helado o alguna de las combinadas como fresa durazno?
**Turn 3**
- Cliente: tradicional
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 4**
- Cliente: no
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### FAIL pp-008 pedido largo con cambio de cantidad

- Categoria: pedido_valido
- Session: preprod:pp-008:00333c7d-0184-4de9-a3dc-32ee4fd59e5f
- Turns: 9

**Turn 1**
- Cliente: quiero una oblea de arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, oblea de arequipe. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: mejor dos
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Listo. Me cuentas que se te antoja.
**Turn 3**
- Cliente: y una malteada oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada oreo. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 4**
- Cliente: no mas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: Carlos Mendoza
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre: Carlos Mendoza

Direccion:

Barrio:

Referencia:

Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 6**
- Cliente: direccion cra 53 #76-22
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: barrio El Golf
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Recibido barrio El Golf. ¿Me das los demás datos para el domicilio? (Nombre, Dirección, Referencia, Método de pago)
**Turn 8**
- Cliente: referencia lobby principal
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia guardada: lobby principal. ¿Me puedes dar los datos que faltan? Nombre, dirección, barrio y método de pago.
**Turn 9**
- Cliente: nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### FAIL pp-009 falta referencia

- Categoria: faltantes
- Session: preprod:pp-009:6858de82-1369-4547-84e0-1d679d1723de
- Turns: 6

**Turn 1**
- Cliente: quiero unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: no
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 3**
- Cliente: soy Valentina
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, Valentina. Para el domicilio me faltan: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: direccion cra 44 #82-11
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: barrio Riomar
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Recibí el barrio Riomar. ¿Me puedes dar nombre, dirección, referencia y método de pago?
**Turn 6**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado Nequi como método de pago. ¿Me compartes los datos que faltan para el domicilio?

### FAIL pp-010 falta metodo de pago

- Categoria: faltantes
- Session: preprod:pp-010:e9336261-d6ae-4520-80ae-741cd3796d8e
- Turns: 6

**Turn 1**
- Cliente: quiero una pavlova
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, pavlova. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: eso es todo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 3**
- Cliente: Daniela
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre: Daniela

Direccion:

Barrio:

Referencia:

Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: calle 79 #50-35
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, dirección: calle 79 #50-35. ¿Me puedes dar tu nombre, barrio, referencia y método de pago?
**Turn 5**
- Cliente: barrio Alto Prado
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Recibido barrio Alto Prado. ¿Me das los demás datos para el domicilio? Nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 6**
- Cliente: referencia porteria
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, referencia: portería. ¿Me das los demás datos para el domicilio? Nombre, dirección, barrio y método de pago.

### FAIL pp-011 barrio solo no cuenta como direccion

- Categoria: faltantes
- Session: preprod:pp-011:9dbc49af-04df-493e-97ab-f91c71ebc790
- Turns: 6

**Turn 1**
- Cliente: una malteada de vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada de vainilla. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: no
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 3**
- Cliente: Jorge
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre: Jorge

Direccion:

Barrio:

Referencia:

Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: barrio Boston
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: referencia casa amarilla
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: referencia casa amarilla
**Turn 6**
- Cliente: efectivo
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado pago en efectivo. ¿Me compartes los demás datos para el domicilio? Nombre, Dirección, Barrio, Referencia.

### FAIL pp-012 direccion sin barrio

- Categoria: faltantes
- Session: preprod:pp-012:2f006e70-9575-4109-87a2-4c8aae72fe18
- Turns: 7

**Turn 1**
- Cliente: unas fresas con helado
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con helado. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: vainilla
**Turn 3**
- Cliente: no mas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Entiendo que no quieres agregar más productos. ¿Qué te gustaría pedir entonces? Dime un producto del catálogo.
**Turn 4**
- Cliente: soy Lucia
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, Lucia. Para el domicilio me faltan: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 5**
- Cliente: cra 45 #80-22
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, dirección registrada: cra 45 #80-22. Ahora, para completar tus datos de domicilio, por favor comparte: Nombre, Barrio, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 6**
- Cliente: referencia edificio blanco
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Referencia guardada. ¿Qué más necesitas?
**Turn 7**
- Cliente: Bancolombia
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Bancolombia

### PASS pp-013 wafle incompleto no debe avanzar a datos

- Categoria: faltantes
- Session: preprod:pp-013:2273f411-c6c7-4fc1-a44e-b92f0fee4cb3
- Turns: 3

**Turn 1**
- Cliente: quiero un wafle
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Listo, para el wafle tradicional escoge una fruta: fresa, banano o durazno.
**Turn 2**
- Cliente: fresa
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Quieres fresas con crema tradicional?
**Turn 3**
- Cliente: vainilla
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Que salsa quieres: arequipe, chocolate, mora o nutella?

### FAIL pp-014 confirmacion temprana no confirma pedido incompleto

- Categoria: faltantes
- Session: preprod:pp-014:70727bc3-988c-44fc-a6dc-949ab9255679
- Turns: 2

**Turn 1**
- Cliente: quiero unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: si
- Ruta: general
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE GENERAL -> Direct Reply 2
- Bot: Listo. Me cuentas que se te antoja.

### FAIL pp-015 agregar topping despues de pregunta de otro producto

- Categoria: modificacion
- Session: preprod:pp-015:051208f3-5fa6-436d-b85e-99c79eba362b
- Turns: 8

**Turn 1**
- Cliente: fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: con milo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Qué producto quieres con Milo? Por ejemplo, fresas con crema o un wafle.
**Turn 3**
- Cliente: no
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: Ana
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Ana
**Turn 5**
- Cliente: cra 46 #85-10
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, dirección registrada: cra 46 #85-10. Para el domicilio me faltan: Nombre, Barrio, Referencia, Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 6**
- Cliente: Riomar
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: apto 201
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Ese dato corresponde a nombre, direccion, barrio, referencia o metodo de pago?
**Turn 8**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo

### FAIL pp-016 cambiar cantidad a dos

- Categoria: modificacion
- Session: preprod:pp-016:8245adfe-d4a4-4580-8949-629899858dd8
- Turns: 8

**Turn 1**
- Cliente: una oblea arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, oblea arequipe. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: mejor dos
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: mejor dos
**Turn 3**
- Cliente: no mas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: Pedro
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Hola, ¿qué producto te gustaría pedir? Tenemos fresas con crema, obleas, malteadas, etc.
**Turn 5**
- Cliente: cll 76 #52-34
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, dirección registrada: cll 76 #52-34. Para completar el domicilio necesito: Nombre, Barrio, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 6**
- Cliente: El Golf
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: casa 2
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: ¿Ese "casa 2" es tu referencia (casa, edificio, etc.)? Por favor confírmame o dame los datos completos.
**Turn 8**
- Cliente: efectivo
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado pago en efectivo. Para el domicilio me compartes estos datos, por favor: Nombre: Direccion: Barrio: Referencia:

### FAIL pp-017 cambiar direccion antes del resumen

- Categoria: modificacion
- Session: preprod:pp-017:4b2331df-3af9-450c-8be6-42cdd1c27134
- Turns: 8

**Turn 1**
- Cliente: malteada oreo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, malteada de Oreo. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: no
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 3**
- Cliente: soy Paula
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto Paula. Para el domicilio me faltan: Direccion: Barrio: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 4**
- Cliente: direccion cra 40 #70-10
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, dirección cra 40 #70-10. ¿Nombre, barrio, referencia y método de pago?
**Turn 5**
- Cliente: mejor direccion cra 40 #70-20
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Dirección actualizada a cra 40 #70-20. ¿Qué más necesitas?
**Turn 6**
- Cliente: barrio Prado
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan: Nombre: Direccion: Referencia: Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 7**
- Cliente: referencia porteria negra
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: ¿Algo más para la referencia o seguimos con los demás datos?
**Turn 8**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, registrado Nequi como método de pago. Para el domicilio me compartes estos datos, por favor: Nombre: Direccion: Barrio: Referencia:

### FAIL pp-018 cambiar metodo de pago

- Categoria: modificacion
- Session: preprod:pp-018:528f4b95-ae8e-4375-bff6-04cf140ab2e5
- Turns: 8

**Turn 1**
- Cliente: quiero una pavlova
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, pavlova. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: listo
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Que producto te gustaria pedir? Tenemos fresas con crema tradicional, fresas con helado, wafle tradicional, etc.
**Turn 3**
- Cliente: Roberto
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Roberto
**Turn 4**
- Cliente: cra 51 #79-25
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, guardé la dirección cra 51 #79-25. Para el domicilio me faltan: Nombre, Barrio, Referencia y Método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 5**
- Cliente: Alto Prado
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Entendido, barrio Alto Prado. Para completar el domicilio necesito nombre, dirección, referencia y método de pago (Nequi, Bancolombia, Bre-B o efectivo).
**Turn 6**
- Cliente: recepcion
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Ese dato "recepcion" no lo reconozco como nombre, direccion, barrio, referencia o metodo de pago. ¿A cuál de esos campos corresponde?
**Turn 7**
- Cliente: Nequi
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto. Para el domicilio me faltan:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 8**
- Cliente: mejor efectivo
- Ruta: datos
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE DATOS -> CONDITION PEDIDO CONFIRMADO -> Direct Reply 1
- Bot: Perfecto, efectivo. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:

### FAIL pp-019 anade otro producto despues de solo eso

- Categoria: modificacion
- Session: preprod:pp-019:783ebf16-1d90-4942-b76a-6daababe5c74
- Turns: 4

**Turn 1**
- Cliente: fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: solo eso
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto. Para el domicilio me compartes estos datos, por favor:

Nombre:
Direccion:
Barrio:
Referencia:
Metodo de pago: Nequi, Bancolombia, Bre-B o efectivo
**Turn 3**
- Cliente: espera tambien una oblea
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Que oblea quieres? Arequipe, Arequipe crema, Nutella o Arequipe queso?
**Turn 4**
- Cliente: arequipe
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: ¿Qué producto quieres con arequipe? Tenemos obleas, malteadas o antojitos.

### FAIL pp-020 producto inexistente chocomix

- Categoria: anti_invencion
- Session: preprod:pp-020:41f58f49-bc9a-4db8-ba76-53743d03d073
- Turns: 2

**Turn 1**
- Cliente: quiero unas fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: y un chocomix
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, chocomix. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.

### FAIL pp-021 producto externo pizza

- Categoria: anti_invencion
- Session: preprod:pp-021:2451adae-92fe-4557-a0e5-448caeda98e5
- Turns: 1

**Turn 1**
- Cliente: quiero una pizza hawaiana
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Lo siento, no tenemos pizza hawaiana en el menú. ¿Quieres ver opciones de fresas con crema, obleas, malteadas o wafles?

### FAIL pp-022 topping inexistente

- Categoria: anti_invencion
- Session: preprod:pp-022:c88d7110-f716-401d-89a0-a76ec9e72c09
- Turns: 2

**Turn 1**
- Cliente: fresas tradicionales
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Perfecto, fresas con crema tradicional. Te gustaria anadir algun otro producto? Si ya esta asi, dime no y seguimos con tus datos de domicilio.
**Turn 2**
- Cliente: ponle gomitas acidas
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Primero elige un producto para agregarle gomitas.

### PASS pp-023 sabor no autorizado

- Categoria: anti_invencion
- Session: preprod:pp-023:b0ca889c-cc4c-4195-8109-79b563bc7033
- Turns: 1

**Turn 1**
- Cliente: quiero una malteada de pistacho
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: Lo siento, no tenemos malteada de pistacho. Las opciones son fresa, chocolate, vainilla u oreo.

### FAIL pp-024 producto mal escrito no inequivoco

- Categoria: anti_invencion
- Session: preprod:pp-024:6aaa799f-ebb1-4f24-9414-6e734da28bfe
- Turns: 1

**Turn 1**
- Cliente: quiero un fresiloco mega
- Ruta: pedido
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE PEDIDO -> Direct Reply 0
- Bot: No tenemos fresiloco mega disponible. Quieres alguna de estas fresas: Fresas con crema tradicional o Fresas con helado?

### PASS pp-025 reclamo escala

- Categoria: escalamiento
- Session: preprod:pp-025:9718ef0a-582b-4167-b0c6-b9f7024016be
- Turns: 1

**Turn 1**
- Cliente: quiero poner un reclamo por un pedido
- Ruta: escalamiento
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> Direct Reply 4
- Bot: En un momento te atiende una persona del equipo.

### PASS pp-026 reembolso escala

- Categoria: escalamiento
- Session: preprod:pp-026:562b2f3c-c9bb-4c60-b9cc-2efaec5e0959
- Turns: 1

**Turn 1**
- Cliente: quiero que me devuelvan la plata
- Ruta: escalamiento
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> Direct Reply 4
- Bot: En un momento te atiende una persona del equipo.

### PASS pp-027 descuento escala

- Categoria: escalamiento
- Session: preprod:pp-027:7a5896bc-456a-48ca-a916-259b443c4811
- Turns: 1

**Turn 1**
- Cliente: me haces descuento si compro varias?
- Ruta: escalamiento
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> Direct Reply 4
- Bot: En un momento te atiende una persona del equipo.

### PASS pp-028 tiempo exacto escala

- Categoria: escalamiento
- Session: preprod:pp-028:b98c1264-c7d0-4be8-ac06-7d6d06f1fda6
- Turns: 1

**Turn 1**
- Cliente: me llega en 15 minutos exactos?
- Ruta: escalamiento
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> Direct Reply 4
- Bot: En un momento te atiende una persona del equipo.

### PASS pp-029 menu completo activa envio menu

- Categoria: menu
- Session: preprod:pp-029:3f9d9ec2-1cd7-43ef-9410-da956819c4aa
- Turns: 1

**Turn 1**
- Cliente: me mandas el menu completo pdf
- Ruta: menu
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE MENÚ -> CONDITION ENVIAR MENÚ -> HTTP SEND MENU PDF -> Direct Reply 5
- Bot: Aquí está el menú!

### PASS pp-030 toppings no deben mandar pdf ni inventar costo extra

- Categoria: menu
- Session: preprod:pp-030:2db0a9a0-dee2-4b66-a00c-9d340ca1a188
- Turns: 1

**Turn 1**
- Cliente: que toppings tienen para las fresas?
- Ruta: menu
- Nodos: Start -> ROUTER CENTRAL -> Condition 0 -> AGENTE MENÚ -> CONDITION ENVIAR MENÚ -> Direct Reply 6
- Bot: Tenemos estos toppings para tus fresas: leche condensada, arequipe, Oreo, merengue, brownie, salsa Hershey, chips de chocolate negro, chips de chocolate blancos, chips de chocolate colores, Krispi, Milo, coco, Choco Crispi, Mym y Chokis.