# Inventario documental e historico

> **Estado:** Canonico  
> **Ultima verificacion:** 2026-07-17  
> **Fuentes verificadas:** arbol documental completo del repositorio Agentic  
> **Componentes:** documentacion, snapshots, prompts y exports

## Regla de precedencia

Cuando dos documentos se contradicen, usar este orden:

1. codigo desplegado y configuracion activa;
2. codigo actual de los repositorios;
3. exportaciones recientes de Flowise/n8n;
4. este manual canonico;
5. documentacion historica.

La prioridad de codigo sobre este manual no elimina la obligacion de actualizar
el manual cuando el producto cambie.

## Documentos canonicos

Los archivos dentro de `docs/sistema/` son la explicacion vigente. El contrato
conceptual backend/Flowise vive en este repositorio; la implementacion ejecutable
continua en el repositorio backend separado.

## Soporte parcialmente vigente

| Documento | Clasificacion | Uso permitido |
| --- | --- | --- |
| `docs/arquitectura.md` | Parcialmente vigente | principios y contexto anterior |
| `docs/arquitectura-summary-cierre.md` | Parcialmente vigente | diseño de resumen/cierre, no prueba de activacion |
| `docs/catalogo.md` | Parcialmente vigente | referencia humana; backend manda en produccion |
| `docs/contrato-backend-flowise.md` | Vigente como contrato de trabajo | contrastar con codigo antes de integrar |
| `docs/auditoria-prompts-flowise-cloud.md` | Snapshot vigente con fecha | auditoria puntual, no manual operativo |
| `docs/flowise-cloud-estado-completo.md` | Snapshot vigente con fecha | topologia/configuracion observada |
| `docs/matriz-regresiones-conversacionales.md` | Vigente | casos que deben conservarse |
| `docs/reglas-operativas.md` | Parcialmente vigente | validar cada regla contra backend |
| `docs/testing.md` | Parcialmente vigente | complementar con capitulo 09 |
| `docs/railway-backend-checklist.md` | Parcialmente vigente | checklist de despliegue |

## Historico

Los documentos movidos a `docs/historico/` describen etapas anteriores, planes no
completados o integraciones reemplazadas. Se conservan como evidencia y no deben
usarse para operar produccion sin contrastarlos con este manual.

Incluyen diagnosticos iniciales, instructivos antiguos de n8n/Flowise, planes de
optimizacion y resultados de pruebas live anteriores. El experimento **V3 Shadow**
se clasifica exclusivamente como historico/descartado y no representa la
arquitectura activa.

## Prompts y exports

- `prompts/` contiene versiones locales. Pueden diferir de lo pegado en Cloud.
- `flowise/exports/` contiene exportaciones fechadas; ninguna debe considerarse
  actual si no incluye todos los nodos visibles, incluido `GUARD DE RUTA`.
- `flowise/snapshots/` contiene capturas/configuraciones por nodo y fecha.
- `n8n/snippets/` documenta el codigo publicado del adaptador Telegram -> Railway.

Para cambiar un prompt live: exportar primero, editar la version local completa,
actualizar schema si corresponde, probar y registrar exactamente lo publicado.

## Mantenimiento

Cada cambio de arquitectura debe:

- actualizar el capitulo correspondiente;
- reclasificar documentos reemplazados;
- incluir fecha y fuentes verificadas;
- actualizar el PDF generado;
- evitar secretos y datos personales reales;
- conservar evidencia historica sin presentarla como vigente.
