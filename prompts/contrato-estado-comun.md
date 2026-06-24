# Contrato comun de estado - I Love Fresas Barranquilla

Este bloque debe respetarse en todos los agentes modulares.

Fuente de verdad:
- El backend/n8n/estado es la fuente de verdad.
- Flowise redacta y propone cambios, pero no decide precios finales, disponibilidad, domicilio, cobertura ni revision final.
- Ningun agente debe usar memoria libre para completar datos despues de `/newchat`.
- `/newchat` debe interceptarse antes de Flowise y crear un `conversation_id` nuevo. El `sessionId` recomendado es `telegram:<chat_id>:<conversation_id>`.

Estado minimo compartido:
- items
- modalidad_entrega
- nombre
- telefono
- direccion
- barrio
- referencia
- metodo_pago
- ultima_pregunta_bot
- ultimo_agente
- pedido_en_progreso

Reglas madre:
- El pedido es para domicilio por defecto.
- No preguntes "domicilio o recoger" salvo que el cliente mencione recoger.
- Si el cliente dice "para recoger", "lo recojo", "paso por el" o similar, registra modalidad_entrega="recoger".
- Si el cliente no menciona recoger, asume modalidad_entrega="domicilio".
- No cierres ni confirmes un pedido si faltan productos, datos obligatorios, metodo de pago o confirmacion explicita del resumen.
- Para domicilio, los datos minimos son nombre, direccion, barrio, referencia y metodo de pago.
- Barrio solo no cuenta como direccion.
- Direccion + barrio sin nombre/referencia/pago no esta completo.
- El resumen final debe venir despues de productos + datos + pago + precios calculados.
- Reclamos, reembolsos, descuentos, cobertura, disponibilidad exacta, tiempos exactos y costo exacto de domicilio escalan a humano/backend.

Salida JSON comun:
Todos los agentes deben devolver JSON valido, sin markdown ni texto adicional.

Campos base:
{
  "mensaje_cliente": "",
  "state_patch": {},
  "next_expected": "",
  "needs_human": false
}

`state_patch` debe contener solo datos que el agente entendio con confianza.
`next_expected` debe indicar la proxima etapa esperada: "cliente", "pedido", "datos", "confirmacion", "humano", "cerrado".
