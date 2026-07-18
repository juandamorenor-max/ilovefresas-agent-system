# Pruebas y preparacion para produccion

> **Estado:** Cobertura local y aceptacion productiva inicial del modo agentes  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** scripts npm, fixtures, suites QA y arquitectura activa  
> **Componentes:** Agentic, backend, dashboard, Flowise, Telegram y operacion

## Tipos de prueba

### Deterministas y mock

Validan contratos, estado, catalogo, opciones, calculos y respuestas conocidas sin
llamar modelos de produccion. Son rapidas y no consumen predicciones de Flowise ni
tokens reales cuando los clientes externos estan simulados.

### Integracion local

Ejecutan servicios y rutas reales con dependencias controladas. Verifican que el
backend, dashboard y persistencia cooperen, pero no demuestran por si solas que el
webhook cloud apunta al servicio correcto.

### Live controladas

Usan Telegram, n8n, Flowise y/o Railway reales. Consumen ejecuciones y llamadas de
modelo. Deben reservarse para validar despliegues concretos después de pasar las
suites deterministas.

## Comandos del repositorio Agentic

```powershell
npm test
npm run build
```

El repositorio contiene fixtures para rutas, configuracion secuencial, contratos
backend/Flowise y conversaciones simuladas. Los scripts live deben revisarse antes
de ejecutarlos para conocer costo, endpoint y Agentflow objetivo.

## Comandos del backend

Desde `C:\Users\PC\Documents\chatbot i love fresas v2`:

```powershell
npm run build:all
npm run test:bot-integration
npm run test:dashboard-operational
npm run test:runtime-store
npm run test:catalog
npm run qa:required-options
npm run qa:realistic-waffle-orders
npm run qa:payment-proof
npm run qa:accounting-ledger
npm run qa:telegram-webhook
npm run qa:bot-quote-contract
```

La presencia de un script no demuestra por si sola el recorrido cloud. La ruta
n8n -> Railway ya esta publicada, pero sus escenarios deben repetirse manualmente
en Telegram despues de cualquier cambio de integracion.

## Matriz minima de regresiones

| Area | Caso obligatorio | Invariante |
| --- | --- | --- |
| Sesion | `/newchat` | no hereda items ni datos |
| Ruta | respuesta breve contextual | permanece en la etapa correcta |
| Pedido | varios productos | no pierde ni duplica items |
| Required options | waffles por unidad | no avanza con campos pendientes |
| Correccion | `el segundo con mango` | modifica una sola unidad |
| Adicion | helado dirigido a un item | no crea un producto nuevo |
| Datos | todo en una linea | extrae y pide solo lo faltante |
| Catalogo | producto agotado | no se ofrece ni confirma |
| Precio | cambio en dashboard | total usa valor vigente |
| Confirmacion | respuesta ambigua | no crea orden |
| Comprobante | imagen aleatoria | no se acepta |
| Comprobante | antes del total | se rechaza por etapa |
| Handoff | chat pausado | el bot no sigue respondiendo |
| Despacho | boton operario | estado, notificacion y ledger verificables |
| Duplicado | mismo message ID | no produce dos efectos |
| Fuera de alcance | tema ajeno | respuesta fija y retorno al negocio |

## Fallos conocidos

1. La aceptacion inicial cubre dos waffles; faltan diez conversaciones variadas.
2. Menú y ramas legadas conservan contratos historicos que deben retirarse por partes.
3. El nodo HTTP del menu en Flowise es un placeholder.
4. La API de Flowise no esta protegida con key.
5. xAI puede presentar errores temporales de capacidad.
6. No existe inbox/outbox durable ni idempotencia productiva completa.
7. Las transiciones administrativas no estan endurecidas como maquina de estados.
8. WhatsApp no comparte aun el mismo orquestador ni procesa media.
9. No se verifico cierre automatico postpedido ni pregunta programada de seguimiento.

## Criterio de salida a produccion supervisada

Antes de recibir clientes reales debe existir una sola ruta declarada de canal y
cumplirse al menos:

- catalogo/precios/disponibilidad del dashboard gobiernan el chat;
- ninguna orden se crea sin productos, opciones, datos y confirmacion explicita;
- comprobantes solo se procesan en su etapa y siempre quedan para revision humana;
- `/newchat` reinicia estado de punta a punta;
- no hay respuestas duplicadas;
- el operario puede pausar, corregir y despachar;
- notificacion y ledger reportan fallos por separado;
- secretos rotados y Flowise protegido;
- backups y rollback probados;
- 20 conversaciones Telegram supervisadas sin fallos criticos.

## Tabla de aceptacion actual

| Capacidad | Estado |
| --- | --- |
| Chat textual Telegram | Operativo |
| Enrutamiento Flowise especializado | Operativo, requiere regresiones |
| Required options en Flowise | Dos waffles por unidad verificados en produccion |
| Catalogo dinamico en chat | Integrado; regresion manual pendiente |
| Resumen y total backend | Integrado; regresion manual pendiente |
| Comprobante visual Telegram | Integrado; regresion manual pendiente |
| Operacion dashboard | Operativa |
| Contabilidad Postgres | Parcial, depende de ordenes backend |
| Produccion sin supervision | No aceptada |
| WhatsApp | Pendiente |

## Validacion ejecutada el 2026-07-17

| Comando/suite | Resultado |
| --- | --- |
| Agentic `npm test` | 17 archivos y 146 tests pasaron; 12 live omitidos |
| Backend `npm run build:all` | OK, incluido build Vite del dashboard |
| `test:bot-integration` | OK |
| `test:dashboard-operational` | OK; notifico correctamente la ausencia de token Telegram en el entorno local |
| `test:runtime-store` | OK |
| `test:catalog` | OK |
| `qa:required-options` | OK |
| `qa:realistic-waffle-orders` | OK |
| `qa:payment-proof` | 3/3 escenarios pasaron |
| `qa:accounting-ledger` | OK |
| `qa:telegram-webhook` | OK sobre el artefacto compilado |
| `qa:post-dispatch` | 16/16 escenarios pasaron |
| `qa:bot-quote-contract` | OK: unidades, foco, quote y consumo unico |
| Agentflow export test | 4/4: incluye rehidratacion entre ejecuciones |

El 2026-07-17 se ejecuto una conversacion productiva aislada: dos waffles con
configuraciones distintas, respuesta combinada de tres opciones, avance de foco,
pregunta de producto adicional y transicion a datos solo despues de `no`. Los
cuatro turnos procedieron de `flowise_agentflow_agents`.

El 2026-07-18 se agrego una regresion para la presentacion inicial de
`requiredOptions`. La prueba exige que dos waffles muestren una sola vez las
listas de frutas, helados y salsas, permitan responder juntas o por partes y que
el turno siguiente continue con la opcion pendiente sin repetir la introduccion.
