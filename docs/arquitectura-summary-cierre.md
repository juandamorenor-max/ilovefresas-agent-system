# Arquitectura de resumen y cierre

Este documento define como debe terminar una conversacion de pedido sin volver al error de un prompt gigante. La ruta correcta se resuelve antes; el resumen y el cierre son una fase posterior, controlada por estado estructurado.

## Principio

El resumen del pedido no debe depender de memoria libre del LLM. Debe salir del estado canonico validado por backend.

Flowise puede interpretar y proponer, pero no debe decidir por si solo que el pedido esta completo. El backend debe validar productos, cantidades, datos, contacto, metodo de pago, reglas operativas y si hace falta revision humana.

## Por que no un prompt gigante

Un prompt unico que intenta rutear, vender, recordar, validar domicilio, confirmar pedido, resumir y cerrar chat es dificil de depurar. Cuando falla, no sabemos si fallo la ruta, el catalogo, la extraccion de datos, la memoria, el tono o la regla operativa.

La arquitectura correcta divide responsabilidades:

- Router: decide la ruta del ultimo mensaje.
- Menu: responde dudas de catalogo y decide si conviene enviar menu.
- Pedido: construye items, cantidades, sabores, toppings y adiciones.
- Datos: extrae nombre, direccion, barrio, referencia, metodo de pago y contacto si hace falta.
- Backend: valida estado canonico, disponibilidad, costos, domicilio, revision y cierre.
- Resumen: redacta sobre estado ya validado.
- Escalamiento: entrega casos riesgosos a humano.

Asi cada fallo se convierte en un test pequeno y se corrige el agente correcto.

## Datos minimos antes del resumen

El pedido solo puede quedar listo para revision cuando exista:

- Productos claros.
- Cantidades.
- Sabores o variantes cuando apliquen.
- Toppings/adiciones cuando el cliente los haya pedido.
- Nombre.
- Contacto de canal o telefono escrito por el cliente.
- Direccion.
- Barrio/zona.
- Metodo de pago.

El telefono no debe pedirse siempre. En WhatsApp el numero del remitente puede ser contacto suficiente; en Telegram puede servir el `chatId` o usuario si n8n/backend lo entrega. Solo se pide telefono cuando no hay contacto util.

## Summary deterministico

El backend debe generar un summary deterministico para operacion:

```text
Resumen del pedido para revision:

Productos:
- 2 x Fresas con crema tradicional | toppings: Oreo

Cliente: Laura
Contacto: whatsapp:+573001234567
Direccion: Calle 80 #50-20
Barrio/zona: Alto Prado
Referencia: Porteria principal
Metodo de pago: nequi
Observaciones: Sin cerezas

Faltantes: Ninguno
Estado: listo para revision del operario.
```

Si faltan datos, el summary debe decirlo y no marcar el pedido como listo.

## Agente de resumen opcional

Puede existir un `AGENTE CONFIRMACION / RESUMEN`, pero no como fuente de verdad.

Rol permitido:

- Tomar un JSON validado por backend.
- Redactar el mensaje final con tono amable.
- Mantener el contenido fiel al estado.
- Devolver JSON validable.

Rol prohibido:

- Inventar productos, precios, domicilios, tiempos o disponibilidad.
- Decidir que el pedido esta completo sin backend.
- Confirmar preparacion o despacho.
- Cerrar el chat por su cuenta.

Para V1, el summary deterministico es suficiente. El agente de resumen se puede agregar despues si el texto necesita sonar mas natural.

## Flujo recomendado

```text
Cliente
-> n8n/canal
-> Backend carga estado de conversacion
-> Flowise interpreta ultimo mensaje
-> Backend valida y actualiza pedido canonico
-> Backend decide siguiente accion
   -> pedir dato faltante
   -> responder menu/duda
   -> escalar humano
   -> generar summary para revision
-> n8n/canal responde al cliente
```

Cuando el pedido queda listo:

```text
Backend genera summary
-> marca order_status = listo_para_revision
-> envia al dashboard/operario
-> responde al cliente que el equipo revisara el pedido
-> programa cierre post-pedido
```

## Cierre post-pedido

Una hora despues de enviar el pedido a revision, el sistema debe preguntar:

```text
¿Necesitas algo más?
```

Ese temporizador no debe vivir en un prompt. Debe vivir en backend o temporalmente en n8n.

Reglas:

- Si el cliente responde que no necesita nada mas, cerrar conversacion.
- Si no responde despues del timeout configurado, cerrar conversacion.
- Al cerrar, limpiar o archivar estado conversacional activo.
- El proximo mensaje debe iniciar conversacion nueva.
- Si el cliente pide algo mas antes del cierre, reabrir flujo de pedido con el estado vigente.

## Comandos de backtesting

En Telegram debe existir un comando de control para comenzar pruebas limpias:

```text
/newchat
/newchat domicilio villa santos
```

Este comando debe interceptarse en n8n/backend antes de Flowise. Su efecto es cerrar o archivar la conversacion activa de ese chat de prueba, crear un nuevo `conversationId` y usar un `sessionId` nuevo para Flowise.

Formato recomendado:

```text
telegram:{chatId}:{conversationId}
```

Asi una prueba de ruta, pedido o domicilio no hereda memoria de una prueba anterior.

Estados sugeridos:

```text
open
collecting_order
collecting_data
ready_for_review
sent_for_review
closing_prompt_sent
closed
escalated
cancelled
```

## Tests que deben proteger esto

- Pedido incompleto no genera `ready_for_review=true`.
- Pedido con contacto de canal no exige telefono escrito.
- Malteada/helado sin sabor no queda listo.
- Summary incluye productos, cantidades, toppings, contacto, direccion, barrio y metodo de pago.
- Cierre pregunta `¿Necesitas algo más?` una hora despues.
- Cierre no se repite si ya fue enviado.
- Respuesta `no gracias` cierra la conversacion.
- Timeout despues del cierre cierra la conversacion.

## Siguiente implementacion

1. Mantener `src/orderLifecycle.ts` como contrato local de summary/cierre.
2. Expandir fixtures con conversaciones reales completas.
3. Definir el contrato backend/Flowise para guardar estado canonico.
4. Hacer que n8n entregue contacto de canal al backend.
5. Solo despues decidir si vale la pena crear un agente LLM de resumen.
