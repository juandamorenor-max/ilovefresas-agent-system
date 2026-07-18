# Documentacion maestra - I Love Fresas

> **Estado:** Canonico  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** codigo de ambos repositorios, Flowise Cloud, n8n Cloud, Telegram Bot API y Railway production  
> **Componentes:** Telegram, n8n, Flowise, backend, dashboard, Railway, Postgres y WhatsApp

Este directorio es la fuente de verdad documental del sistema. Describe lo que
existe y funciona hoy, no una arquitectura ideal ni una propuesta futura.

## Lectura recomendada

1. [Resumen para el dueno](01-resumen-para-el-dueno.md)
2. [Arquitectura actual](02-arquitectura-actual.md)
3. [Recorrido de un pedido](03-recorrido-del-pedido.md)
4. [Flowise Agentflow V2](04-flowise-agentflow-v2.md)
5. [Backend y dashboard](05-backend-y-dashboard.md)
6. [Datos y persistencia](06-datos-y-persistencia.md)
7. [Canales e integraciones](07-canales-e-integraciones.md)
8. [Operacion y despliegue](08-operacion-y-despliegue.md)
9. [Pruebas y produccion](09-pruebas-y-produccion.md)
10. [Referencia tecnica](10-referencia-tecnica.md)
11. [Glosario](11-glosario.md)
12. [Inventario documental e historico](12-inventario-documental.md)
13. [Decisiones conversacionales en Flowise](13-decisiones-conversacionales-flowise.md)

## Fotografia ejecutiva

| Componente | Estado verificado | Observacion principal |
| --- | --- | --- |
| Telegram | Integrado por n8n con Railway | El webhook apunta a n8n y n8n reenvia cada update a `/bot/turn`. |
| n8n | Operativo, publicado | Adaptador sin estado: normaliza Telegram, llama Railway y devuelve `responseText`. |
| Flowise V2 | Operativo en modo agentes | Router, Guard, especialistas y Custom Function deciden progresion conversacional. |
| Backend Railway | Operativo e integrado al chat | Transporta, rehidrata estado, valida, cotiza y persiste ordenes. |
| Dashboard | Operativo y protegido | Sirve desde `/dashboard/`, usa runtime JSON y ledger Postgres. |
| Catalogo dinamico | Integrado | Telegram consulta indirectamente el catalogo del backend; n8n ya no conserva una copia. |
| Menu PDF | Integrado por backend | Railway sirve y puede enviar `Menu 2026.pdf` al chat Telegram. |
| Comprobantes | Integrados tecnicamente | n8n entrega `file_id` al backend; falta regresion manual posterior a la publicacion. |
| Contabilidad | Parcial | Postgres esta configurado; depende de ordenes creadas/despachadas por backend. |
| WhatsApp | Preparado, no activo | Hay webhook y envio de texto, pero no credenciales ni validacion productiva confirmada. |
| V3 Shadow | Historico | Experimento descartado; no es parte del sistema vigente. |

## Conclusion operativa

El camino publicado es ahora unico:

```text
Telegram -> n8n -> Railway -> Flowise -> Railway/runtime/dashboard
         -> n8n -> Telegram
```

n8n conserva nombres de nodos como `Flowise Prediction`, pero son nombres legados:
el HTTP Request publicado apunta a Railway. El cambio fue verificado en la UI de
n8n. El escenario de dos waffles con configuraciones independientes y transicion
explicita a datos fue aceptado en produccion el 2026-07-17.

## Regla de actualizacion

Todo cambio productivo debe actualizar como minimo:

- la fecha de verificacion del capitulo afectado;
- la matriz de estado de este archivo;
- el diagrama de arquitectura si cambia el recorrido de mensajes;
- el inventario documental si reemplaza una decision anterior;
- la suite o prueba que demuestra el cambio.

No se documentan secretos. Los valores reales viven en los gestores de
credenciales de Railway, n8n, Flowise, Telegram, Meta u OpenAI.
