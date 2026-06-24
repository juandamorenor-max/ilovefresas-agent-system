# Matriz de regresiones conversacionales

Esta matriz convierte los riesgos del diagnostico en comportamientos verificables. No reemplaza el backend ni Flowise; define la vara minima que el sistema debe cumplir antes de tocar un flujo de pruebas o produccion.

## Router

- `hola` debe ir a `general`.
- `menu`, `carta`, `me mandas el menu` deben ir a `menu`.
- `que toppings tienen` debe ir a `menu`, pero no debe forzar PDF.
- `quiero unas fresas con crema` debe ir a `pedido`.
- `tradicional`, `oreo`, `vainilla`, `mejor dos` deben ir a `pedido` cuando son continuacion.
- `pago por nequi` debe ir a `datos`.
- `es para domicilio` debe ir a `datos` si no pregunta costo exacto.
- `cuanto cuesta el domicilio hasta X` debe escalar porque el bot no debe inventar costos.
- `quiero hablar con alguien`, reclamos, reembolsos, demoras y descuentos deben ir a `escalamiento`.

## Pedido

- `quiero unas fresas con crema` debe preguntar variante.
- `tradicional` con contexto de fresas con crema debe crear `Fresas con crema tradicional`.
- `quiero una malteada` y `quiero una malteada tambien` deben preguntar sabor.
- `quiero una oblea` debe preguntar tipo.
- `fresas con helado` debe preguntar sabor de helado.
- `agregale oreo` sin item activo debe preguntar a que producto.
- `agregale oreo` con item activo debe agregar topping sin inventar otro producto.
- `ponle mas crema` sin item activo debe preguntar a que producto.
- `mejor dos` con item activo debe actualizar cantidad a 2.

## Menu

- `menu` debe activar `enviar_menu=true`.
- Preguntas puntuales de toppings, sabores o precio deben responder en texto con `enviar_menu=false`.
- `cuanto cuesta el domicilio` no debe inventar precio; debe indicar validacion por asesor/equipo.
- Preguntas de disponibilidad exacta deben mandar a validacion humana/equipo.

## Datos

- Datos mezclados en un mensaje deben extraerse juntos cuando sea posible.
- `pago por nequi`, `pago en efectivo`, `pago por bancolombia` y `breb` deben normalizarse.
- `es para domicilio` debe iniciar recoleccion de datos obligatorios, no confirmar pedido.
- Contacto de canal debe estar disponible para revision. En WhatsApp puede venir del numero; en Telegram puede venir del `chatId`. El bot solo debe pedir telefono si el canal/backend no lo aporta.
- Referencias como apartamento, torre, casa azul o porteria deben conservarse.

## Confirmacion y seguridad operativa

- `pedido_confirmado=true` solo debe existir con productos claros, cantidades, datos completos, metodo de pago y confirmacion explicita.
- Al dejar un pedido listo para revision, el sistema debe generar un resumen con productos, cantidades, sabores si aplican, toppings/adiciones, nombre, contacto de canal, direccion, barrio, metodo de pago y observaciones.
- Una hora despues de enviar el pedido a revision, el sistema debe preguntar `¿Necesitas algo más?`.
- Si el cliente responde que no necesita nada mas, o si no responde despues del timeout configurado, el chat debe cerrarse para que el proximo mensaje empiece una conversacion nueva.
- Costos de domicilio, tiempos exactos, disponibilidad exacta, descuentos, reclamos y reembolsos deben escalar o quedar para validacion humana/backend.
- El backend futuro debe ser la fuente de verdad; Flowise solo interpreta y propone.

## Ejecucion live

La matriz se puede contrastar contra la copia de Flowise con:

```bash
RUN_LIVE_FLOWISE_TESTS=true npm run test:live
```

Los tests live quedan apagados por defecto para no hacer llamadas externas durante `npm test`.

## Uso de la matriz

Esta matriz existe para proteger una arquitectura modular. Si aparece un bug conversacional, no se debe resolver agrandando un prompt global.

Primero se identifica que contrato fallo:

- Router.
- Menu.
- Pedido.
- Datos.
- Summary/cierre.
- Escalamiento.

Luego se agrega un fixture pequeno y se corrige el agente o capa responsable.
