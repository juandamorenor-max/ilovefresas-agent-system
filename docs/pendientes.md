# Guia de pendientes

Esta guia resume lo que falta despues de crear la base del repo `ilovefresas-agent-system`. La idea es usarla como mapa de trabajo para la siguiente sesion.

## Objetivo inmediato

Convertir este repo en el centro operativo para versionar prompts, probar regresiones conversacionales y preparar cambios seguros antes de tocar Flowise, n8n o produccion.

## 1. Revisar y afinar prompts actuales

Estado actual: existen prompts iniciales para router, menu, pedido, datos y general.

Pendiente:

- Probar los prompts contra conversaciones reales o ejemplos copiados del chat.
- Ajustar tono de respuesta para que suene natural a I Love Fresas.
- Validar que el router no mande respuestas cortas como "tradicional", "oreo", "vainilla" o "chocolate" a menu por error.
- Reforzar la politica de no inventar productos, precios, sabores, disponibilidad ni domicilios.
- Definir formato final de JSON esperado por cada nodo de Flowise.

Criterio de listo:

- Cada prompt tiene ejemplos claros.
- Los JSON de salida coinciden con lo que Flowise necesita para enrutar.
- Hay tests para los casos que mas se pueden romper.

## 2. Traer o documentar el Flowise actual

Estado actual: hay notas manuales del Agentflow en `flowise/current-flow-notes.md`.

Pendiente:

- Exportar manualmente el flujo actual desde Flowise si la plataforma lo permite.
- Guardar el export en `flowise/exports/`.
- Documentar fecha, Agentflow, version y cambios relevantes.
- Comparar los nombres reales de nodos con los prompts del repo.
- Confirmar si Flowise permite actualizar prompts por API oficial.

Criterio de listo:

- El repo contiene una fotografia verificable del Flowise actual.
- Sabemos exactamente que nodos usan que prompts.
- No dependemos de memoria o capturas sueltas para reconstruir el flujo.

## 3. Preparar pruebas live contra Flowise

Estado actual: los tests corren en mock y no hacen llamadas reales.

Pendiente:

- Crear un Agentflow de pruebas o confirmar uno seguro.
- Agregar tests live detras de `RUN_LIVE_FLOWISE_TESTS=true`.
- Evitar que tests live escriban estado real o contacten clientes.
- Validar shape de respuestas reales: texto, JSON, errores y rutas.
- Crear fixtures con conversaciones completas, no solo mensajes sueltos.

Criterio de listo:

- `npm test` sigue siendo rapido y mock por defecto.
- `RUN_LIVE_FLOWISE_TESTS=true npm test` prueba un ambiente seguro.
- Una regresion de prompt se detecta antes de tocar produccion.

## 4. Conectar mejor n8n y Telegram

Estado actual: n8n esta documentado como puente de pruebas.

Pendiente:

- Exportar o describir el workflow real de Telegram.
- Confirmar que datos recibe n8n desde Telegram.
- Confirmar que payload envia n8n a Flowise.
- Documentar como n8n responde al chat.
- Decidir si n8n seguira solo como puente de pruebas o beta temporal.

Criterio de listo:

- `n8n/telegram-workflow-notes.md` permite entender el flujo sin abrir n8n.
- Cualquier export esta en `n8n/exports/`.
- No hay secretos en el repo.

## 5. Definir contrato con backend propio

Estado actual: el repo establece que Flowise no es el dueno del estado.

Pendiente:

- Definir eventos que Flowise/n8n enviaran al backend.
- Definir estructura de pedido canonico.
- Definir estados del pedido: abierto, recolectando_pedido, recolectando_datos, listo_para_revision, enviado_a_revision, cierre_enviado, cerrado, escalado, cancelado.
- Definir cuando se pide revision humana.
- Definir como se valida catalogo, disponibilidad, domicilio y metodo de pago.
- Definir quien genera el summary deterministico del pedido.
- Definir donde vive el temporizador para preguntar `¿Necesitas algo más?`.

Criterio de listo:

- Existe un documento de contrato backend/Flowise.
- Flowise solo interpreta y propone.
- El backend decide y guarda estado.
- El summary y cierre post-pedido no dependen de memoria libre del LLM.

Avance actual:

- `docs/contrato-backend-flowise.md` define la propuesta esperada de Flowise, estado canonico y acciones del backend.
- `src/backendOrder.ts` implementa una primera version local del contrato.

## 5.1. Resumen y cierre de pedido

Estado actual: existe `src/orderLifecycle.ts` como contrato local inicial y `docs/arquitectura-summary-cierre.md` como guia.

Pendiente:

- Conectar summary a estado canonico real del backend.
- Asegurar que contacto de canal cuente como contacto valido.
- Enviar el pedido a revision humana/dashboard antes de cualquier preparacion.
- Programar el mensaje de cierre una hora despues de enviar a revision.
- Cerrar el chat si el cliente dice que no necesita nada mas o si no responde despues del timeout.

Criterio de listo:

- El cliente recibe un cierre claro.
- El operario recibe un summary completo.
- El proximo mensaje despues del cierre inicia conversacion nueva.
- Los tests cubren todo el ciclo.

## 6. Mejorar fixtures y regresiones

Estado actual: hay 19 tests mock iniciales.

Pendiente:

- Agregar conversaciones multi-turno completas.
- Incluir casos de error y ambiguedad.
- Incluir reclamos, reembolsos, demoras y descuento riesgoso.
- Incluir pedidos con multiples items y toppings.
- Incluir datos mezclados en un solo mensaje.

Criterio de listo:

- Cada bug conversacional nuevo se convierte en fixture.
- Los tests cubren router, menu, pedido, datos y escalamiento.

## 7. Resolver mantenimiento tecnico

Estado actual: `npm install` funciona, pero `npm audit` reporto vulnerabilidades.

Pendiente:

- Revisar `npm audit`.
- Actualizar dependencias sin romper `tsx`, `vitest` ni TypeScript.
- Decidir si se fija version de Node recomendada.
- Agregar `npm run typecheck`.
- Considerar un `vitest.config.ts` si necesitamos controlar workers o tests live.

Criterio de listo:

- `npm test` pasa.
- `npx tsc --noEmit` pasa.
- El arbol de dependencias queda razonablemente limpio.

## 8. Automatizar import/export con cuidado

Estado actual: hay placeholders para Flowise y n8n.

Pendiente:

- No inventar endpoints privados.
- Confirmar APIs oficiales.
- Implementar export real solo cuando sepamos endpoint, auth y formato.
- Implementar update de prompts primero contra ambiente de pruebas.
- Agregar dry-run antes de cualquier update real.

Criterio de listo:

- Los scripts pueden correr sin riesgo por defecto.
- Cualquier cambio destructivo o productivo exige confirmacion explicita.
- Hay logs claros de que se actualizo y donde.

## Orden recomendado para manana

1. Revisar documentos base y confirmar arquitectura modular.
2. Exportar/documentar el Agentflow actual.
3. Crear conversaciones reales de prueba en fixtures.
4. Ajustar tests mock segun esas conversaciones.
5. Definir contrato minimo de backend, summary y cierre.
6. Revisar prompts contra el Flowise real por agente, no como prompt unico.
7. Preparar Agentflow seguro para tests live.
8. Revisar `npm audit` y scripts de mantenimiento.

## Preguntas que conviene resolver antes de construir mas

- Cual es el Flowise de pruebas y cual es el de produccion?
- El menu PDF se envia desde Flowise, n8n o backend?
- Donde vive el catalogo canonico: backend, archivo, base de datos o Flowise por ahora?
- Como se calcula domicilio?
- Que casos deben escalar siempre a humano?
- Quien confirma el pedido final antes de enviarlo a preparacion?
- Telegram es solo beta o canal real?
- WhatsApp entra despues con el mismo contrato de mensajes?

## Definicion de avance para la siguiente etapa

La siguiente etapa queda bien cerrada cuando podamos decir:

- Tenemos prompts versionados y alineados con Flowise.
- Tenemos fixtures basados en conversaciones reales.
- Tenemos tests mock confiables.
- Tenemos un camino claro para tests live sin tocar produccion.
- Tenemos claro que datos debe recibir el backend propio.
