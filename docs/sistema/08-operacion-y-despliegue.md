# Operacion y despliegue

> **Estado:** Railway operativo; procedimientos parcialmente formalizados  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** Railway CLI/produccion, scripts npm y rutas de health  
> **Componentes:** Railway, GitHub, dashboard, logs, variables, backups y recuperacion

## Servicios cloud verificados

| Servicio | Uso | Estado |
| --- | --- | --- |
| Railway | Backend, dashboard, Volume y conexion Postgres | Operativo |
| Flowise Cloud | Agentflow V2 | Operativo |
| n8n Cloud | Webhook y adaptador Telegram | Operativo, cuenta en prueba al verificar |
| Telegram Bot API | Canal piloto | Operativo por n8n |
| OpenAI | LLM y vision segun componente | Configurado |
| xAI | Agentes Pedido, Datos y Confirmacion | Configurado en Flowise |
| Meta WhatsApp | Futuro canal | No productivo |

## Railway

- Proyecto verificado: `loyal-rejoicing`.
- Servicio: `ilovefresas-backend-dashboard`.
- URL publica: `https://ilovefresas-backend-dashboard-production.up.railway.app`.
- El ultimo despliegue observado estaba en estado `success` el 2026-07-17.
- El commit del backend auditado es `bc7468c` (`Generalize required option handling`).

El despliegue y el commit tienen marcas de tiempo coincidentes, pero `/health` no
publica el SHA. Se trata de una inferencia fuerte, no de una prueba criptografica.

## Health checks

| Ruta | Acceso | Uso |
| --- | --- | --- |
| `GET /health` | Publico | proceso y estado basico |
| `GET /health/integration` | Publico en la verificacion | storage, Flowise, vision, auth, fee y contabilidad |
| `GET /dashboard/` | Publico, requiere login funcional | aplicacion Vite |
| `GET /admin/session` | Publico | estado de autenticacion |

`/health/integration` confirmo Volume escribible, Postgres contable configurado,
Flowise configurado sin API key, secreto de integracion, auth de dashboard y vision.
No debe ampliarse este endpoint para revelar valores de secretos.

## Variables de entorno

La referencia completa vive en [Referencia tecnica](10-referencia-tecnica.md).
Las categorias esenciales son:

- URL e ID de Flowise;
- secreto de integracion del bot;
- token del bot Telegram;
- ruta del runtime Volume;
- URL de Postgres;
- contraseña y secreto de sesion del dashboard;
- credenciales OpenAI para vision;
- domicilio predeterminado;
- variables Meta cuando se active WhatsApp.

Los valores se administran en Railway/n8n/Flowise. Nunca deben guardarse en Git,
capturas, documentación, exports o mensajes de soporte.

## Procedimiento seguro de despliegue

1. Confirmar rama, diff y pruebas locales.
2. Crear snapshot o respaldo del runtime y exportar el Agentflow si se modificara.
3. Hacer commit con un cambio acotado.
4. Desplegar el backend/dashboard sin alterar webhooks cuando no corresponda.
5. Esperar `success` y revisar logs de arranque.
6. Probar `/health` y `/health/integration`.
7. Probar login y una lectura del dashboard.
8. Ejecutar un chat nuevo controlado en Telegram.
9. Verificar que la ruta observada coincide con la arquitectura esperada.
10. Registrar commit, fecha, pruebas y rollback.

## Logs y trazabilidad

Hay tres lugares distintos:

- **n8n Executions:** muestra trigger, adaptacion, llamada a `/bot/turn` y envio.
- **Railway logs/runtime traces:** muestra guardrails, estado, respuesta y errores
  de cada turno recibido.
- **Flowise traces/canvas:** aparece solamente cuando Railway decide consultar el
  Agentflow y muestra Router, Guard, Condition y especialista ejecutado.

Para seguir un mensaje se empieza en n8n, se continua en Railway y se revisa
Flowise solo si la respuesta no fue determinista. Si aparece en n8n pero no en
Railway, revisar URL, header `x-bot-secret` y el nodo HTTP.

## Backup y recuperacion

Antes de cambios de alto riesgo:

- exportar el Agentflow V2;
- exportar el workflow n8n sin credenciales;
- respaldar el archivo del Railway Volume;
- comprobar backups de Postgres;
- registrar webhook actual antes de reemplazarlo;
- conservar el commit desplegado y un procedimiento de rollback.

No se verifico un simulacro completo de restauracion. Debe hacerse antes de una
apertura sin supervision.

## Rotacion de secretos

Si un token, password o API key aparece en chat, Git, capturas o logs compartidos:

1. revocarlo en el proveedor;
2. generar uno nuevo;
3. actualizar el gestor de variables correspondiente;
4. redeploy/republicar;
5. probar la integracion;
6. limpiar el secreto de archivos e historial cuando aplique.
