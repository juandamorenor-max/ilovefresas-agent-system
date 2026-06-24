# Flowise Preproduccion Report Regraded

- Original generated: 2026-06-23T22:38:22.396Z
- Regraded: 2026-06-23T22:40:11.219Z
- Cases: 30
- Turns/predictions: 150
- Passed: 11
- Failed: 19

## Resultado

NO APTO

## Fallos

### pp-001 fresas tradicionales, oblea y malteada con datos en partes
- missing text somewhere: "Resumen"
- missing text somewhere: "Total"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-002 pedido largo de cinco productos con cantidades mixtas
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

### pp-004 fresas con topping y adicion en mensajes separados
- missing text somewhere: "Oreo"
- missing text somewhere: "Resumen"
- missing text somewhere: "Total"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-005 combinados y vaso helado con typos
- final route expected datos, got general
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-006 pedido para recoger no debe pedir direccion completa
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-007 fresas genericas deben pedir variante concreta
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-008 pedido largo con cambio de cantidad
- missing text somewhere: "2"
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-009 falta referencia
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-010 falta metodo de pago
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-011 barrio solo no cuenta como direccion
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-012 direccion sin barrio
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-014 confirmacion temprana no confirma pedido incompleto
- final route expected pedido, got general
- missing text somewhere: "Nombre"
- missing any text somewhere: "Direccion" | "Dirección"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-015 agregar topping despues de pregunta de otro producto
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-016 cambiar cantidad a dos
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

### pp-017 cambiar direccion antes del resumen
- missing text somewhere: "Resumen"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-018 cambiar metodo de pago
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"
- forbidden text found: "etc."

### pp-019 anade otro producto despues de solo eso
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-020 producto inexistente chocomix
- missing any text somewhere: "no aparece en el menu" | "no está en el menú" | "no lo manejamos"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

### pp-022 topping inexistente
- missing any text somewhere: "no aparece" | "no lo manejamos" | "opciones disponibles" | "no tenemos"
- forbidden text found: "si ya esta asi, dime no"
- forbidden text found: "si ya está así, dime no"

## Casos OK

- pp-003 wafle con fruta helado salsa y otro producto
- pp-013 wafle incompleto no debe avanzar a datos
- pp-021 producto externo pizza
- pp-023 sabor no autorizado
- pp-024 producto mal escrito no inequivoco
- pp-025 reclamo escala
- pp-026 reembolso escala
- pp-027 descuento escala
- pp-028 tiempo exacto escala
- pp-029 menu completo activa envio menu
- pp-030 toppings no deben mandar pdf ni inventar costo extra