import { describe, expect, it } from "vitest";
import {
  buildAvailableCatalogContext,
  buildFlowiseAvailableCatalogText,
  isModifierAvailableByName,
  isProductAvailableByName
} from "../../src/availabilityCatalog.js";

describe("dashboard availability catalog contract", () => {
  it("filters unavailable products and modifiers before sending catalogo_disponible to Flowise", () => {
    const context = buildAvailableCatalogContext({
      products: [
        {
          id: "prod_tradicional",
          name: "Fresas con crema tradicional",
          category: "Fresas y combinados",
          basePrice: 16000,
          isActive: true,
          isOutOfStock: false
        },
        {
          id: "prod_helado",
          name: "Fresas con helado",
          category: "Fresas y combinados",
          basePrice: 18000,
          isActive: true,
          isOutOfStock: true
        }
      ],
      modifiers: [
        { id: "mod_oreo", name: "Oreo", priceDelta: 2000, isActive: true },
        { id: "mod_crema", name: "Crema adicional", priceDelta: 4000, isActive: true },
        { id: "mod_brownie", name: "Brownie", priceDelta: 2000, isActive: false }
      ]
    });

    expect(context.productos.map((product) => product.name)).toEqual([
      "Fresas con crema tradicional"
    ]);
    expect(context.unavailableProducts?.map((product) => product.name)).toEqual([
      "Fresas con helado"
    ]);
    expect(context.toppings.map((modifier) => modifier.name)).toEqual(["Oreo"]);
    expect(context.adiciones.map((modifier) => modifier.name)).toEqual(["Crema adicional"]);
    expect(context.unavailableModifiers?.map((modifier) => modifier.name)).toEqual(["Brownie"]);

    expect(isProductAvailableByName("Fresas con crema tradicional", context)).toBe(true);
    expect(isProductAvailableByName("Fresas con helado", context)).toBe(false);
    expect(isModifierAvailableByName("Oreo", context)).toBe(true);
    expect(isModifierAvailableByName("Brownie", context)).toBe(false);

    const flowiseText = buildFlowiseAvailableCatalogText(context);

    expect(flowiseText).toContain("Fresas con crema tradicional");
    expect(flowiseText).toContain("Oreo");
    expect(flowiseText).not.toContain("Fresas con helado");
    expect(flowiseText).not.toContain("Brownie");
  });
});
