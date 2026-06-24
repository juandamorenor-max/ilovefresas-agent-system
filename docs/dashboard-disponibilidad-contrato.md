# Contrato de disponibilidad dashboard -> backend/n8n -> Flowise

Este documento captura el primer puente de disponibilidad para I Love Fresas.

No se copia ni se modifica el proyecto viejo `C:\Users\PC\Documents\chatbot i love fresas v2`. Solo se extrajo el contrato visible de su carpeta `dashboard/`.

## Fuente dashboard

El dashboard antiguo tiene una vista de disponibilidad rapida donde el operario puede marcar productos y toppings como disponibles o agotados.

Endpoints que espera la UI:

```text
GET   /admin/dashboard/products
GET   /admin/dashboard/modifiers
PATCH /admin/products/:id/availability
PATCH /admin/modifiers/:id/availability
```

Producto esperado por el dashboard:

```json
{
  "id": "prod_fresas_tradicional",
  "name": "Fresas con crema tradicional",
  "category": "Fresas y combinados",
  "basePrice": 16000,
  "isActive": true,
  "isOutOfStock": false,
  "availabilityStatus": "available"
}
```

Modifier/topping esperado:

```json
{
  "id": "mod_oreo",
  "name": "Oreo",
  "priceDelta": 2000,
  "isActive": true,
  "modifierGroupId": "mg_toppings"
}
```

## Variable para Flowise

Antes de llamar Flowise, backend/n8n debe construir:

```text
catalogo_disponible
```

Contenido recomendado:

```json
{
  "productos": [
    {
      "id": "prod_fresas_tradicional",
      "name": "Fresas con crema tradicional",
      "category": "Fresas y combinados",
      "price": 16000
    }
  ],
  "toppings": [
    {
      "id": "mod_oreo",
      "name": "Oreo",
      "price": 2000
    }
  ],
  "adiciones": [
    {
      "id": "mod_crema_adicional",
      "name": "Crema adicional",
      "price": 4000
    }
  ]
}
```

Reglas:

- Incluir solo productos con `isActive=true` y `isOutOfStock=false`.
- Incluir solo toppings/adiciones con `isActive=true`.
- Enviar un resumen corto, no todo el estado interno del dashboard.
- Flowise no decide disponibilidad; solo lee este contexto.
- Si no llega `catalogo_disponible`, Flowise puede usar `docs/catalogo.md` como catalogo autorizado, pero no debe afirmar disponibilidad exacta.

## Implementacion local

La normalizacion local vive en:

```text
src/availabilityCatalog.ts
```

Funciones principales:

```text
buildAvailableCatalogContext()
buildFlowiseAvailableCatalogText()
```

Estas funciones permiten probar el contrato sin llamar Flowise ni gastar predicciones.
