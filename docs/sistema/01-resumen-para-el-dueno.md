# Resumen para el dueno

> **Estado:** Canonico  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** servicios cloud y codigo vigente  
> **Componentes:** producto completo

## Que se esta construyendo

Un asistente de I Love Fresas Barranquilla que conversa con el cliente, entiende
su pedido, pide las opciones necesarias, recolecta datos de domicilio, muestra un
resumen y deja el pedido listo para que un operario lo revise y despache.

La meta final es WhatsApp Business. Telegram es el canal de prueba supervisada.

## Que funciona hoy

- Telegram recibe texto, fotos y documentos mediante n8n y los reenvia a Railway.
- `/newchat` crea una conversacion nueva en el backend y una sesion nueva de Flowise.
- Flowise separa Menu, Pedido, Datos, General y Confirmacion.
- El Guard de Ruta conserva el contexto cuando se esta configurando un producto.
- Railway tiene un backend publico, catalogo, precios, disponibilidad, sesiones,
  comprobantes, ordenes y reglas de cierre.
- El dashboard permite operar pedidos y conversaciones, editar disponibilidad,
  catalogo, pagos y consultar contabilidad.
- Railway conserva el estado operativo en un Volume y los pedidos despachados en
  Postgres.
- El menu PDF esta publicado como `Menu 2026.pdf`.

## Conexion publicada recientemente

El 2026-07-17 se cambio el workflow publicado para que n8n llame Railway
`/bot/turn` en lugar de Flowise directamente. Con esto:

- el chat usa el catalogo, precios y agotados del dashboard;
- el backend administra `/newchat`, draft y opciones obligatorias;
- las ordenes pueden llegar al dashboard y posteriormente al ledger;
- fotos y documentos entregan su `file_id` al validador backend;
- Flowise sigue interpretando, pero solo cuando Railway decide llamarlo.

La configuracion publicada fue verificada en n8n. Aun debe ejecutarse una
conversacion manual completa posterior al cambio para validar texto, PDF,
comprobante, aparicion en dashboard y despacho como una sola cadena.

## Que hace cada pieza

| Pieza | Responsabilidad real actual |
| --- | --- |
| Telegram | Interfaz de prueba con clientes. |
| n8n | Recibe el webhook, construye el payload, llama Railway y devuelve `responseText`. |
| Flowise | Interpreta el mensaje, decide una ruta y redacta la respuesta. |
| Backend Railway | Gobierna el trafico Telegram, estado, catalogo, calculos, comprobantes y pedidos. |
| Dashboard | Permite al operario gestionar la informacion almacenada por el backend. |
| Runtime JSON | Guarda catalogo, conversaciones, mensajes, trazas y ordenes del backend. |
| Postgres | Guarda el ledger de pedidos que el backend marca como despachados. |
| Operario | Verifica el pedido, pago, preparacion y despacho. |

## Que nunca debe decidir solamente la IA

- disponibilidad real;
- precios y total final;
- costo de domicilio;
- aprobacion de comprobante o ingreso real del dinero;
- promesa de preparacion, despacho o tiempo exacto;
- descuentos, reembolsos o reclamos;
- creacion de un pedido incompleto.

## Estado para produccion

El sistema esta avanzado y la conexion estructural principal ya esta publicada.
Todavia no es un flujo productivo sin supervision porque falta aceptación manual
end-to-end y endurecimiento de seguridad, idempotencia y recuperación.

Antes de produccion se debe demostrar que un mismo pedido:

1. usa catalogo y precios del dashboard;
2. conserva estado sin duplicar ni perder productos;
3. llega al resumen con todos los datos;
4. acepta comprobante solo en el momento correcto;
5. aparece en el dashboard;
6. puede ser despachado por un operario;
7. notifica al mismo cliente;
8. queda registrado en contabilidad.
