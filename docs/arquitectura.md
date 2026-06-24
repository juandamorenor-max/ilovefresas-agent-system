# Arquitectura

## Principio central

Flowise interpreta mensajes, clasifica intencion y devuelve respuestas o JSON estructurado. El backend propio debe ser el dueno de estado, pedidos, eventos, dashboard, escalamiento, disponibilidad y revision humana.

La arquitectura debe mantenerse modular. No queremos volver a un prompt gigante que intente hacer ruta, menu, pedido, datos, costos, resumen y cierre a la vez. Cada agente debe tener una responsabilidad pequena, testeable y facil de corregir.

## Flujo actual

```text
Start
-> ROUTER CENTRAL
-> Condition route
   -> escalamiento / Direct Reply humano
   -> AGENTE MENU
      -> CONDITION ENVIAR MENU
         -> HTTP SEND MENU PDF
         -> Direct Reply MENU PDF
         -> Direct Reply MENU TEXTO
   -> AGENTE PEDIDO
      -> Direct Reply
   -> AGENTE DATOS
      -> CONDITION PEDIDO CONFIRMADO
         -> Direct Reply pedido listo/revision
         -> Direct Reply pedir siguiente dato
   -> AGENTE GENERAL
      -> Direct Reply
```

## Agentes actuales

- ROUTER CENTRAL
- AGENTE MENU
- AGENTE PEDIDO
- AGENTE DATOS
- AGENTE GENERAL

## Agentes futuros

- AGENTE CONFIRMACION
- AGENTE ESCALAMIENTO

Por ahora confirmacion y escalamiento no existen como LLM separados.

El `AGENTE CONFIRMACION` no debe ser obligatorio para V1. El resumen del pedido puede generarlo el backend de forma deterministica desde estado validado. Si mas adelante se agrega un agente de resumen, debe ser solo una capa de redaccion sobre JSON validado, no el dueno del pedido.

## Responsabilidades por capa

- Flowise: interpretar, clasificar, responder y producir JSON estructurado.
- n8n: puente de pruebas entre Telegram y Flowise.
- Backend propio: estado canonico, pedidos, eventos, disponibilidad, dashboard y revision humana.
- Tests de este repo: detectar regresiones conversacionales antes de tocar produccion.

## Documentos base

- `docs/diagnostico-arquitectura-actual.md`: fotografia del estado actual y riesgos.
- `docs/matriz-regresiones-conversacionales.md`: casos que deben proteger la ruta.
- `docs/contrato-backend-flowise.md`: contrato de estado canonico entre interpretacion y backend.
- `docs/arquitectura-summary-cierre.md`: contrato de resumen del pedido y cierre post-pedido.
