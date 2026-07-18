# Datos y persistencia

> **Estado:** Operativo con persistencia hibrida  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** runtime store, servicios de persistencia, health de Railway y esquema contable  
> **Componentes:** Flow State, n8n, Railway Volume, JSON runtime y Postgres

## No existe una sola memoria

El sistema usa varios almacenamientos con propositos distintos. No deben tratarse
como si fueran una base de datos unificada.

| Capa | Que conserva | Alcance actual |
| --- | --- | --- |
| Flowise Flow State | items, datos, ruta y foco del Agentflow | Sesion de Flowise |
| Memoria de agentes | mensajes previos segun configuracion del nodo | Solo especialistas con memoria activa |
| n8n | No conserva estado conversacional; adapta el update | Ejecucion actual del turno |
| Runtime JSON | negocio, catalogo, conversaciones, mensajes, pedidos y trazas | Backend Railway |
| Postgres | ledger de pedidos despachados | Contabilidad basica |

## Runtime JSON

Railway reporta el almacenamiento como `snapshot-json`, configurado, existente y
escribible en:

```text
/data/ilovefresas-runtime-store.json
```

El archivo vive en un Railway Volume y contiene entidades operativas como:

- negocio, horarios, cierres y zonas;
- productos, modificadores y promociones;
- clientes y conversaciones;
- mensajes y trazas;
- pedidos;
- usuarios administrativos V0.

El Volume evita perder el archivo en un redeploy normal, pero no ofrece por si
solo transacciones, consultas concurrentes, replicacion ni auditoria equivalentes
a una base relacional. El runtime actual es apropiado para un piloto de una sola
instancia; escalar horizontalmente sin migrarlo generaria riesgo de concurrencia.

## Postgres contable

`DATABASE_URL` esta configurada en produccion. La tabla verificada
`accounting_dispatched_orders` recibe un `upsert` cuando un pedido se marca como
despachado. Guarda al menos:

- identificador y fecha del pedido;
- canal/telefono y datos del cliente;
- nombre, direccion, barrio y referencia;
- metodo de pago;
- subtotal, domicilio, descuento y total;
- snapshot JSON del pedido.

Postgres no es actualmente la fuente de verdad de conversaciones, drafts,
catalogo ni pedidos en curso. Su uso productivo se limita al ledger contable.

## Datos de clientes

El sistema puede almacenar datos personales y operativos:

- identificador de chat y canal;
- telefono si el canal o el cliente lo entrega;
- nombre;
- direccion, barrio y referencia;
- metodo de pago;
- productos, opciones, valores y estado del pedido;
- mensajes e imagenes/referencias de comprobantes segun el canal.

No se almacena ni debe almacenarse la clave de una cuenta bancaria del cliente.
La documentacion tampoco replica tokens, passwords, API keys o secretos de sesion.

## Reinicio con `/newchat`

En el workflow publicado, `/newchat` se reenvia a `/bot/turn`. El backend reinicia
la conversacion del `chatId` y crea la nueva sesion; n8n no conserva una segunda
copia del identificador de conversacion.

La expectativa funcional es que una conversacion nueva no herede items, datos,
preguntas pendientes ni confirmaciones. Debe comprobarse en el canal que realmente
atienda produccion cada vez que cambie la integracion.

## Adjuntos y comprobantes

El workflow n8n publica `attachmentType`, `attachmentFileId`, `mimeType` y caption
en el turno normalizado. El backend puede descargar el archivo mediante Telegram
Bot API y entregarlo al validador visual cuando la etapa es la correcta.

Para WhatsApp, el webhook y el envio de texto existen, pero la descarga de media
desde Graph API esta documentada en el codigo como pendiente.

## Retencion, respaldo y borrado

No se verifico una politica automatica de retencion o anonimizado. Para operacion
segura deben definirse antes de produccion abierta:

- tiempo de conservacion de conversaciones y comprobantes;
- quien puede consultar o exportar datos;
- procedimiento para borrar datos de un cliente;
- respaldo del Volume y Postgres;
- restauracion probada;
- rotacion de logs que puedan contener payloads.
