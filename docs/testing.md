# Testing conversacional

Los tests viven en `tests/conversations/` y usan fixtures en `tests/fixtures/conversation-cases.ts`.

## Modo mock

Por defecto:

```bash
npm test
```

No llama Flowise real.

## Modo live

Preparado para futuro:

```bash
RUN_LIVE_FLOWISE_TESTS=true npm test
```

Antes de activar tests live, confirma que el Agentflow sea de pruebas y que no escriba estado productivo.

Tambien puedes correr solo la regresion live contra Flowise:

```bash
npm run test:live
```

Para que ejecute casos reales, define `RUN_LIVE_FLOWISE_TESTS=true` y `FLOWISE_API_HOST` + `FLOWISE_FLOW_ID`.

## Regla de arquitectura para tests

Los tests deben ayudar a corregir agentes pequenos, no a justificar un prompt gigante. Cuando falle una conversacion real, primero se decide que contrato fallo:

- Ruta.
- Menu.
- Pedido.
- Datos.
- Summary/cierre.
- Escalamiento.

Despues se agrega el fixture en el lugar correcto.

## Que probar

- Router no confunde continuaciones cortas con menu.
- Pedido pregunta aclaraciones cuando faltan variante, sabor o tipo.
- Datos extrae campos presentes y pregunta solo el siguiente faltante.
- Menu no envia PDF si el cliente solo pregunta toppings o precio especifico.
- Ciclo post-pedido genera resumen, pregunta `¿Necesitas algo más?` y cierra el chat segun respuesta/timeout.
