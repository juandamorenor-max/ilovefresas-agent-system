# Flowise: confirmacion, pago y comprobante

Este cambio evita que un pedido confirmado por el cliente pase directo a revision humana sin comprobante.

## Flujo objetivo

```text
Pedido + datos completos
-> AGENTE CONFIRMACION DE PEDIDO muestra resumen
-> Cliente dice "si / correcto / listo"
-> AGENTE CONFIRMACION DE PEDIDO envia datos de pago
-> Cliente envia comprobante
-> Backend/dashboard recibe pedido para revision humana
```

Para pagos por transferencia, `si` no significa `send_to_review`. Significa `ask_payment_proof`.

## Datos de pago V1

- Nequi: `3000000000`
- Bancolombia: `72600000000`
- Bre-B: `@test`

Si el metodo de pago es `efectivo`, no se pide comprobante.

## Cambio necesario en el canvas

El problema actual es arquitectonico: despues del resumen, el siguiente mensaje del cliente vuelve a `ROUTER CENTRAL`. Si el router no tiene una salida hacia `AGENTE CONFIRMACION DE PEDIDO`, el `si` puede caer en `AGENTE GENERAL`.

Agregar una condicion antes o despues del router que revise estado:

```text
if next_expected == "confirmacion"
  -> AGENTE CONFIRMACION DE PEDIDO

if next_expected == "comprobante_pago"
  -> AGENTE CONFIRMACION DE PEDIDO

else
  -> rutas normales: menu / pedido / datos / general / escalamiento
```

En Flowise actual, si no quieres crear una ruta nueva en el router, usa una `Condition` basada en `{{$vars.next_expected}}` o `{{$flow.state.next_expected}}` antes de `Condition 0`.

## Human in the Loop

La tool `Human in the Loop` puede servir cuando:

- el pedido ya tiene comprobante;
- el cliente tiene problema con pago;
- el cliente pide humano;
- hay reclamo, descuento, reembolso, demora o cobertura.

No debe usarse para reemplazar el backend/dashboard como fuente de verdad. El backend debe guardar estado, pedido, comprobante y resumen; Human in the Loop solo ayuda a que el operario interactue.

## Limite de tema

Durante un pedido activo, el bot no debe responder temas externos como:

- que dia es hoy;
- clima;
- noticias;
- politica;
- chistes o tareas generales.

Respuesta esperada si falta comprobante:

```text
Para continuar con tu pedido, enviame el comprobante del pago por aqui.
```

Respuesta esperada si falta confirmacion del resumen:

```text
Para seguir con tu pedido, revisa el resumen y dime si esta correcto o que quieres corregir.
```

## Estado minimo nuevo

Agregar estos campos al estado persistido por backend/n8n:

```json
{
  "next_expected": "confirmacion|comprobante_pago|pedido|datos|humano",
  "pedido_confirmado_por_cliente": false,
  "comprobante_pago_pendiente": false,
  "comprobante_pago_recibido": false
}
```

## Regresion que debe pasar

```text
Cliente: unas fresas tradicionales
Bot: Quieres agregar otro producto al pedido?
Cliente: no
Bot: pide datos
Cliente: datos completos + Nequi
Bot: resumen + total + pregunta si esta correcto
Cliente: si
Bot: Nequi 3000000000 + pide comprobante
Cliente: que dia es hoy?
Bot: Para continuar con tu pedido, enviame el comprobante del pago por aqui.
Cliente: te envio el comprobante
Bot: Listo, recibimos tu comprobante y dejo tu pedido en revision con el equipo.
```
