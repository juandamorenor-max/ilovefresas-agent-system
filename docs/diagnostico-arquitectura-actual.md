# Diagnostico y arquitectura actual

Documento base para entender el estado actual del sistema agentico de I Love Fresas Barranquilla antes de hacer mejoras profundas en Flowise, n8n, prompts, tests o backend.

La intencion de este documento no es resolver todavia. Es dejar una fotografia honesta, accionable y compartible de lo que existe, que falla, que riesgos hay y por donde conviene avanzar.

## Investigacion documental base

Este diagnostico se cruza contra los documentos y artefactos locales existentes, no contra memoria suelta:

- `docs/pendientes.md`: lista el backlog original y confirma que el repo debe ser el centro operativo antes de tocar Flowise, n8n o produccion.
- `docs/arquitectura.md`: define el principio central de separacion entre Flowise, n8n, backend y tests.
- `flowise/current-flow-notes.md`: conserva el mapa manual del Agentflow inspeccionado.
- `docs/matriz-regresiones-conversacionales.md`: convierte fallos conversacionales en comportamientos verificables.
- `docs/testing.md`: separa tests mock de tests live para evitar llamadas externas accidentales.
- `prompts/`: contiene prompts modulares por agente, que no deben fusionarse en un prompt gigante.
- `src/orderLifecycle.ts`: empieza a modelar el contrato deterministico para resumen y cierre de pedido.

Conclusion de la investigacion: el problema no se arregla escribiendo un prompt mas grande. Se arregla manteniendo agentes pequenos, estado canonico fuera de Flowise, tests por regresion y contratos explicitos entre ruta, pedido, datos, resumen y cierre.

## Resumen ejecutivo

El sistema actual ya tiene una base util:

- Un repo local `ilovefresas-agent-system` para versionar prompts, documentacion, scripts y tests.
- Una copia de Flowise tipo Agentflow para probar cambios sin tocar produccion directamente.
- Un workflow publicado en n8n que conecta Telegram con Flowise.
- Tests mock iniciales para router, pedido, menu y datos.
- Un contrato local inicial para generar summary de pedido y cierre post-pedido sin depender de memoria libre del LLM.

Pero todavia hay problemas importantes de arquitectura:

- n8n esta llamando un Flowise ID distinto al Agentflow copia que estamos editando.
- Flowise conserva estado conversacional, pero todavia no existe un backend propio como fuente real de verdad.
- Algunos nodos de Flowise tienen bugs de estado y placeholders.
- Los prompts actuales todavia pueden enrutar mal, asumir cosas o activar flujos que no corresponden.
- Los tests actuales son demasiado pequenos para detectar muchos fallos reales.
- El cierre de conversacion y el summary final aun no estan conectados a backend/n8n real.

La prioridad inmediata debe ser convertir esta foto actual en una lista de mejoras verificables, y convertir cada fallo conversacional en un test antes de seguir editando Flowise.

Un objetivo igual de importante: evitar que el sistema vuelva a depender de un solo prompt enorme. La correccion debe ocurrir por contratos pequenos: router, menu, pedido, datos, summary/cierre y escalamiento.

## Estado actual del sistema

### Repo local

Ruta local:

```text
C:\Users\PC\Documents\PROYECTO I LOVE FRESAS AGENTIC
```

Nombre del paquete:

```text
ilovefresas-agent-system
```

El repo contiene:

- Prompts versionados en `prompts/`.
- Documentacion en `docs/`.
- Notas y placeholders de Flowise en `flowise/`.
- Notas y placeholders de n8n en `n8n/`.
- Scripts TypeScript en `scripts/`.
- Utilidades en `src/`.
- Tests mock en `tests/`.

Scripts relevantes:

```bash
npm test
npm run flowise:ask -- "hola"
npm run flowise:test
npm run flowise:export
npm run flowise:update-prompts
npm run n8n:export
```

Los scripts de export/import siguen siendo placeholders. No hay automatizacion real de exportar o actualizar Flowise/n8n.

### Flowise copia

Agentflow inspeccionado:

```text
https://cloud.flowiseai.com/v2/agentcanvas/e52f27b3-06e2-4fb0-b853-30e936b99839
```

ID:

```text
e52f27b3-06e2-4fb0-b853-30e936b99839
```

Nombre visible:

```text
FUTURO TEMPLATE CON IA
```

Estado de autorizacion:

```text
No Authorization
```

Este Agentflow puede llamarse sin API key mediante el endpoint de prediccion. Esto es comodo para pruebas, pero significa que cualquiera que conozca el ID podria ejecutar el flow.

Welcome message actual probado:

```text
¡Hola! 🍓 Bienvenido a I Love Fresas Barranquilla. Las mejores fresas de Barranquilla 😋✨ ¿Qué se te antoja hoy?
```

### n8n actual

Instancia visible:

```text
https://i-love-fresas.app.n8n.cloud
```

Workflow publicado:

```text
My workflow
```

Proyecto visible:

```text
Personal
```

Workflow ID visible en URL:

```text
1whquJktIBm3WqkG
```

Estructura visible:

```text
Telegram Trigger
-> HTTP Request
-> Send a text message
```

Indicadores visibles:

- Workflow publicado.
- 12 ejecuciones de produccion.
- 1 ejecucion fallida.
- Failure rate visible: 8.3%.
- Run time promedio visible: 6.64 s.

Hallazgo importante: el nodo HTTP de n8n llama a este Flowise ID:

```text
e75ef448-0577-4e72-b457-c74aae18cdf5
```

No llama al Agentflow copia:

```text
e52f27b3-06e2-4fb0-b853-30e936b99839
```

Esto significa que podemos mejorar la copia en Flowise y aun asi Telegram podria seguir usando otro flujo distinto.

## Mapa de arquitectura actual

### Flowise

Mapa inspeccionado:

```text
Start
-> ROUTER CENTRAL
-> Condition 0
   -> escalamiento / Direct Reply 4
   -> AGENTE MENÚ
      -> CONDITION ENVIAR MENÚ
         -> HTTP SEND MENU PDF
         -> Direct Reply 5
         -> Direct Reply 6
   -> AGENTE PEDIDO
      -> Direct Reply 0
   -> AGENTE DATOS
      -> CONDITION PEDIDO CONFIRMADO
         -> Direct Reply 3
         -> Direct Reply 1
   -> AGENTE GENERAL
      -> Direct Reply 2
```

Agentes LLM actuales:

- `ROUTER CENTRAL` con OpenAI `gpt-5.4-nano`.
- `AGENTE MENÚ` con OpenAI `gpt-5.4-nano`.
- `AGENTE PEDIDO` con xAI Grok `grok-3-mini`.
- `AGENTE DATOS` con xAI Grok `grok-3-mini-fast`.
- `AGENTE GENERAL` con OpenAI `gpt-5.4-nano`.

Nodos no LLM relevantes:

- `Condition 0`.
- `CONDITION ENVIAR MENÚ`.
- `CONDITION PEDIDO CONFIRMADO`.
- `HTTP SEND MENU PDF`.
- `Direct Reply 0` a `Direct Reply 6`.

### n8n

Mapa visible:

```text
Telegram Trigger
-> HTTP Request
-> Send a text message
```

El nodo HTTP visible llama:

```text
POST https://cloud.flowiseai.com/api/v1/prediction/e75ef448-0577-4e72-b457-c74aae18cdf5
```

Pendiente: documentar o exportar el payload exacto que n8n envia a Flowise y como toma la respuesta para Telegram.

### Backend propio

Todavia no existe como componente real dentro de esta arquitectura.

Principio acordado:

```text
Flowise no debe ser la base de datos ni el dueno real del estado.
```

El backend propio deberia ser el dueno de:

- Estado canonico del pedido.
- Items del pedido.
- Catalogo canonico.
- Costos de domicilio.
- Disponibilidad real.
- Resumen del pedido para revision.
- Seguimiento post-pedido y cierre de chat.
- Eventos de conversacion.
- Escalamiento humano.
- Revision del equipo.
- Dashboard operativo.

## Interfaces y contratos actuales

### Flowise prediction

Endpoint usado para probar Agentflows:

```text
POST https://cloud.flowiseai.com/api/v1/prediction/{FLOWISE_FLOW_ID}
```

Body actual:

```json
{
  "question": "hola",
  "sessionId": "session-id"
}
```

Autorizacion actual:

```text
Sin Authorization por ahora.
```

Variables locales recomendadas:

```env
FLOWISE_API_HOST=https://cloud.flowiseai.com
FLOWISE_FLOW_ID=e52f27b3-06e2-4fb0-b853-30e936b99839
FLOWISE_API_KEY=
```

### Estado Flowise actual

Estado inicial observado:

```text
route
confidence
reason
mensaje_cliente
nombre
direccion
barrio
referencia
metodo_pago
items
pedido_confirmado
needs_human
enviar_menu
phone
channel
menu_topic
```

Problema conceptual: este estado puede servir como memoria temporal de Flowise, pero no debe convertirse en fuente canonica del negocio.

### n8n actual

Contrato observado de alto nivel:

```text
Telegram Trigger recibe mensaje
HTTP Request llama Flowise
Send a text message responde a Telegram
```

Pendientes de contrato:

- Confirmar payload exacto de Telegram hacia Flowise.
- Confirmar si se envia `sessionId` estable por usuario/chat.
- Confirmar si se envia `phone`, `channel` o metadata.
- Confirmar como se extrae `text` o respuesta de Flowise.
- Confirmar manejo de errores cuando Flowise falla.

## Hallazgos criticos

### 1. n8n no apunta a la copia que estamos editando

n8n llama:

```text
e75ef448-0577-4e72-b457-c74aae18cdf5
```

La copia inspeccionada/editada es:

```text
e52f27b3-06e2-4fb0-b853-30e936b99839
```

Impacto:

- Podemos mejorar el Agentflow copia y Telegram no reflejaria esos cambios.
- Las pruebas manuales contra la copia no necesariamente validan lo que recibe un cliente por Telegram.
- Antes de cualquier mejora real, hay que decidir que flow es beta, cual es produccion y cual debe llamar n8n.

### 2. `needs_human` esta mal guardado en el router

En `ROUTER CENTRAL`, update state contiene:

```text
{{ output.needs_human }
```

Debe ser:

```text
{{ output.needs_human }}
```

Impacto:

- El estado puede guardar el literal roto en vez de `true/false`.
- Rutas o respuestas posteriores pueden creer que no hay escalamiento real.
- Casos de reclamo, demora, reembolso o humano podrian no comportarse bien.

### 3. `confidence` no se persiste en estado

El router produce `confidence`, pero el estado observado mantiene:

```text
confidence: "0"
```

No se observo un update state para `confidence`.

Impacto:

- No se puede usar confidence para auditoria, debugging o decisiones futuras.
- El dashboard o logs futuros perderian una senal util.

### 4. `enviar_menu=true` esta demasiado amplio

En prompts y reglas visibles hay formulaciones tipo:

```text
enviar_menu=true solo si route = menu
```

o reglas de menu que activan `enviar_menu=true` si el cliente pide "precios", "que venden" o productos en general.

Impacto:

- Una pregunta como "que toppings tienen" puede terminar activando PDF aunque deberia responder en texto.
- Una pregunta puntual de precio podria mandar menu completo innecesariamente.

Regla objetivo:

```text
enviar_menu=true solo cuando el cliente pida menu completo, carta, PDF o menu como archivo.
```

Preguntas puntuales deben responderse en texto.

### 5. `HTTP SEND MENU PDF` usa placeholder

URL visible:

```text
https://tudashboard.com/api/send-menu
```

Impacto:

- El envio real de PDF no esta conectado.
- Si el flujo llega a ese nodo, puede fallar o llamar una URL inexistente.
- No hay garantia de que n8n/backend esten enviando el PDF realmente.

### 6. Flowise esta cargando demasiada responsabilidad de estado

Flowise guarda `items`, datos de entrega, metodo de pago y confirmacion.

Impacto:

- El pedido puede vivir solo dentro de la conversacion y perder trazabilidad.
- No hay validacion canonica contra backend.
- No hay control fuerte de disponibilidad, domicilio, revision humana o auditoria.

Principio objetivo:

```text
Flowise interpreta y propone.
El backend valida, decide y persiste.
```

### 7. Tests actuales no cubren los riesgos reales

Los tests mock actuales cubren 19 casos basicos:

- Router simple.
- Pedido ambiguo simple.
- Menu simple.
- Datos simples.

No cubren todavia:

- Conversaciones multi-turno completas.
- Costos de domicilio.
- Toppings/adiciones con precio extra.
- Fallos de ruta entre menu/pedido/datos.
- Reclamos y escalamiento.
- Disponibilidad exacta.
- Confirmacion indebida.
- n8n apuntando a Flowise incorrecto.
- Respuestas reales del Agentflow.

Impacto:

- Los tests pueden pasar aunque el bot falle en situaciones reales.
- No hay red de seguridad suficiente antes de editar Flowise.

## Fallos funcionales a vigilar

Estos son los tipos de fallos que deben convertirse en fixtures y tests:

### Rutas equivocadas

Ejemplos de riesgo:

- "tradicional" debe continuar pedido, no ir a menu.
- "oreo" puede ser topping, sabor o variante segun contexto.
- "pago por nequi" debe ir a datos.
- "quiero hablar con alguien" debe ir a escalamiento.
- "cuanto vale la de oreo" puede necesitar contexto.

### Supuestos sobre productos

Flowise no debe inventar:

- Producto.
- Variante.
- Sabor.
- Topping.
- Adicion.
- Tamano.
- Precio.
- Disponibilidad.

Ejemplos:

- "fresas con crema" es ambiguo si no dice variante.
- "malteada" necesita sabor.
- "oblea" necesita tipo.
- "fresas con helado" puede necesitar sabor de helado.
- "agregale oreo" necesita item objetivo si no hay contexto claro.

### Costos extra y domicilio

Flowise no debe asumir:

- Costo de domicilio.
- Zonas cubiertas.
- Tiempo exacto de entrega.
- Disponibilidad exacta.
- Descuentos o promociones no listadas.

Regla objetivo:

```text
Todo costo de domicilio o disponibilidad operativa debe validarlo backend o humano.
```

### Confirmacion indebida

No debe marcarse `pedido_confirmado=true` sin:

- Items claros.
- Datos completos.
- Metodo de pago valido.
- Confirmacion explicita del cliente.
- Validacion posterior del backend o revision humana segun aplique.

Cuando el pedido este listo para revision, el sistema debe generar un resumen claro para el operario. Ese resumen debe incluir productos, cantidades, sabores si aplican, toppings/adiciones, nombre, contacto de canal, direccion, barrio/zona, metodo de pago y observaciones relevantes. En WhatsApp el contacto puede venir del numero del remitente; en Telegram puede venir del `chatId`. El bot solo debe pedir telefono si el backend/n8n no puede aportar ningun contacto util.

### Cierre post-pedido

Despues de enviar el pedido a revision, el sistema necesita una fase de cierre:

- Una hora despues, enviar un mensaje corto: `¿Necesitas algo más?`.
- Si el cliente responde que no necesita nada mas, cerrar el chat.
- Si el cliente no responde despues del timeout configurado, cerrar el chat.
- Al cerrar, el proximo mensaje del cliente debe iniciar una conversacion nueva y no arrastrar estado viejo.

Este temporizador no deberia vivir en el prompt de Flowise. Debe vivir en backend o, temporalmente, en n8n.

### Escalamiento humano

Deben escalar:

- Reclamos.
- Reembolsos.
- Demoras.
- Cliente molesto.
- Pedido anterior.
- Disponibilidad exacta.
- Descuentos riesgosos.
- Confusion repetida.
- Casos donde el bot no logra resolver ambiguedad critica.

## Diferencias entre repo y Flowise

### Repo

El repo contiene prompts limpios y modulares, pero no necesariamente son identicos a los que vive Flowise.

Ejemplo:

- `prompts/agente-general.md` ya contiene el welcome message nuevo.
- Flowise tambien fue actualizado con ese welcome message.
- `ROUTER CENTRAL` y `AGENTE MENÚ` fueron actualizados manualmente en la copia Flowise `e52f...` para alinearse mejor con los prompts modulares del repo.
- Otros prompts de Flowise todavia pueden tener contenido mas extenso o diferente al repo.

### Flowise

Flowise tiene configuracion real de nodos, modelos, structured outputs y update state.

Problema:

- No hay export JSON versionado del Agentflow.
- La UI inspeccionada es la fuente real por ahora.
- Cualquier cambio manual puede desalinear repo y Flowise si no se documenta.

### n8n

n8n muestra workflow publicado, pero el repo no contiene export real del workflow.

Problema:

- No sabemos todavia el payload exacto.
- No sabemos el manejo de errores.
- No sabemos si `sessionId` es estable.
- n8n apunta a otro Flowise ID.

## Arquitectura objetivo inicial

### Separacion de responsabilidades

Objetivo:

```text
Telegram/WhatsApp
-> n8n o webhook
-> Backend propio
-> Flowise para interpretacion
-> Backend valida/persiste
-> n8n/backend responde al canal
```

Transicion posible mientras no exista backend:

```text
Telegram
-> n8n
-> Flowise copia/beta
-> n8n responde
```

Pero con reglas claras:

- Flowise no confirma costos de domicilio.
- Flowise no decide disponibilidad exacta.
- Flowise no crea pedido final.
- Flowise no aplica descuentos.
- Flowise escala cuando hay duda operativa.

### Flowise objetivo

Flowise debe especializarse en:

- Clasificar intencion.
- Extraer datos conversacionales.
- Proponer items en JSON.
- Hacer preguntas de aclaracion.
- Generar respuesta visible.
- Marcar casos que necesitan humano.

Flowise no debe:

- Ser base de datos.
- Ser catalogo canonico final.
- Calcular domicilio final.
- Confirmar pedido irreversible.
- Reemplazar dashboard/humano.

### n8n objetivo

n8n debe servir como:

- Puente temporal de Telegram.
- Orquestador liviano de llamadas.
- Punto de pruebas/beta.

n8n no debe:

- Ser fuente de verdad del pedido.
- Guardar logica compleja de negocio.
- Ocultar errores de Flowise.
- Llamar flows distintos sin documentacion.

### Backend objetivo

El backend propio debe recibir o construir:

- Cliente/canal.
- Mensaje entrante.
- Session/conversation ID.
- Estado canonico.
- Items normalizados.
- Datos de entrega.
- Metodo de pago.
- Eventos de escalamiento.
- Resultado de validaciones.

Debe responder con:

- Estado actualizado.
- Accion recomendada.
- Mensaje permitido.
- Necesidad de humano.
- Errores o datos faltantes.
- Resumen para revision del operario.
- Proxima accion temporal: programar cierre, enviar cierre o cerrar conversacion.

## Prioridades recomendadas

### Prioridad 1: Alinear Flowise usado por n8n

Decidir:

- Cual Flowise ID es beta.
- Cual Flowise ID es produccion.
- Si n8n debe apuntar a `e52f...` o si la copia debe duplicarse hacia `e75...`.

No avanzar con mejoras profundas hasta resolver esta desalineacion.

### Prioridad 2: Arreglar bugs de estado

Cambios esperados:

- Corregir `{{ output.needs_human }` a `{{ output.needs_human }}`.
- Persistir `confidence`.
- Revisar tipos string/boolean en conditions.
- Verificar que `pedido_confirmado`, `needs_human` y `enviar_menu` se comparen correctamente.

### Prioridad 3: Endurecer reglas de menu y pedido

Cambios esperados:

- `enviar_menu=true` solo para menu completo/PDF/carta.
- Preguntas puntuales de precio/toppings/sabores responden en texto.
- Pedido no debe asumir variante/sabor/topping/adicion.
- Pedido no debe asumir costos extra.

### Prioridad 4: Crear fixtures reales

Convertir fallos reales en tests:

- Mensajes sueltos.
- Conversaciones multi-turno.
- Casos ambiguos.
- Casos de escalamiento.
- Costos/domicilio.
- Confirmacion indebida.

### Prioridad 5: Exportar n8n y Flowise

Guardar en repo:

- Export del Agentflow.
- Export del workflow n8n.
- Notas de version/fecha.

Objetivo:

```text
Lo que esta corriendo debe poder reconstruirse desde el repo o desde exports versionados.
```

### Prioridad 6: Definir contrato minimo de backend

Antes de construir backend completo, definir:

- Payload de entrada.
- Payload de salida.
- Estados de pedido.
- Eventos.
- Reglas de escalamiento.
- Donde vive el catalogo canonico.

## Preguntas abiertas

- El Flowise ID `e75ef448-0577-4e72-b457-c74aae18cdf5` es produccion, beta o una copia vieja?
- n8n debe apuntar al Agentflow copia `e52f27b3-06e2-4fb0-b853-30e936b99839`?
- El menu PDF debe enviarlo Flowise, n8n o backend?
- Donde debe vivir el catalogo canonico a corto plazo?
- Como se calcula domicilio?
- Cuales barrios/zonas estan permitidos?
- Que casos deben escalar siempre a humano?
- Quien confirma el pedido final antes de preparacion?
- Telegram es canal real, beta o solo pruebas?
- WhatsApp usara el mismo contrato que Telegram?

## Criterios para decir que el sistema esta mejorando

El sistema empieza a estar bajo control cuando:

- n8n y Flowise apuntan al mismo flow documentado.
- Cada cambio de prompt queda versionado en repo.
- Cada fallo real se convierte en fixture.
- Tests mock cubren las rutas criticas.
- Tests live existen solo contra entorno seguro.
- Flowise deja de asumir costos o disponibilidad.
- Backend propio queda definido como fuente de verdad.
- Los casos humanos se escalan de forma consistente.

## Proximo bloque de trabajo sugerido

1. Confirmar si n8n debe apuntar al Agentflow `e52f...`.
2. Arreglar bugs de estado del router en la copia Flowise.
3. Ajustar regla de `enviar_menu`.
4. Crear una primera bateria de conversaciones reales problemáticas.
5. Convertir esas conversaciones en tests mock/live.
6. Exportar o documentar payload exacto del workflow n8n.
7. Empezar contrato minimo de backend.

## Nota final

Este documento debe tratarse como el punto de partida. Cada vez que se descubra un fallo nuevo en conversacion real, debe agregarse como evidencia y luego convertirse en test o regla operacional.
