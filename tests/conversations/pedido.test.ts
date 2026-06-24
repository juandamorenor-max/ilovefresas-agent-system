import { describe, expect, it } from "vitest";
import { buildAvailableCatalogContext } from "../../src/availabilityCatalog.js";
import { mockHandlePedido } from "../../src/conversationRunner.js";
import { pedidoCases } from "../fixtures/conversation-cases.js";

describe("agente pedido mock", () => {
  it.each(pedidoCases)("$name", (testCase) => {
    const result = mockHandlePedido(testCase.message, testCase.context);

    if (testCase.expectedQuestionIncludes) {
      expect(result.necesita_aclaracion).toBe(true);
      expect(result.pregunta?.toLowerCase()).toContain(
        testCase.expectedQuestionIncludes.toLowerCase()
      );
    }

    if (testCase.expectedItem) {
      expect(result.items.some((item) => item.producto === testCase.expectedItem)).toBe(true);
    }

    if (testCase.expectedTopping) {
      expect(result.items.some((item) => item.toppings?.includes(testCase.expectedTopping))).toBe(
        true
      );
    }

    if (testCase.expectedFlavor) {
      expect(result.items.some((item) => item.sabor === testCase.expectedFlavor)).toBe(true);
    }

    if (testCase.expectedAddition) {
      expect(result.items.some((item) => item.adiciones?.includes(testCase.expectedAddition))).toBe(
        true
      );
    }

    if (testCase.expectedQuantity) {
      expect(result.items.some((item) => item.cantidad === testCase.expectedQuantity)).toBe(true);
    }
  });

  it("ofrece solo opciones autorizadas cuando piden fresas sin variante", () => {
    const result = mockHandlePedido("quiero unas fresas con crema");

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.pregunta).toContain("tradicional");
    expect(result.pregunta).toContain("crema de Oreo");
    expect(result.pregunta).not.toMatch(/\b(etc|otra|otras|entre otras)\b/i);
  });

  it("interpreta unas fresas tradicionales como cantidad uno y no pregunta cantidad", () => {
    const result = mockHandlePedido("gracias, quiero unas fresas tradicionales");

    expect(result.necesita_aclaracion).toBe(false);
    expect(result.items).toEqual([
      expect.objectContaining({
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        variante: "tradicional"
      })
    ]);
    expect(result.mensaje_cliente).toBe(
      "Perfecto, fresas con crema tradicional. Quieres agregar otro producto al pedido?"
    );
    expect(result.mensaje_cliente).not.toContain("dime no");
    expect(result.pregunta ?? "").not.toMatch(/cantidad|1 o mas/i);
  });

  it("despues de preguntar por otro producto, con oreo modifica el item activo", () => {
    const result = mockHandlePedido("con oreo", {
      activeItem: {
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        variante: "tradicional",
        precio_unitario: 16000
      },
      lastQuestion:
        "Quieres agregar otro producto al pedido?"
    });

    expect(result.necesita_aclaracion).toBe(false);
    expect(result.items).toEqual([
      expect.objectContaining({
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        toppings: ["Oreo"]
      })
    ]);
    expect(result.mensaje_cliente).toBe(
      "Listo, le agrego topping de Oreo. Quieres agregar otro producto al pedido?"
    );
    expect(result.next_expected).toBe("pedido");
  });

  it("despues de preguntar por otro producto, un dato avanza a datos sin exigir no", () => {
    const result = mockHandlePedido("Juan Moreno", {
      activeItem: {
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        variante: "tradicional",
        precio_unitario: 16000
      },
      lastQuestion: "Quieres agregar otro producto al pedido?"
    });

    expect(result.necesita_aclaracion).toBe(false);
    expect(result.next_expected).toBe("datos");
    expect(result.mensaje_cliente).not.toMatch(/dime no|confirmame/i);
  });

  it("no convierte un producto desconocido en el producto parecido mas cercano", () => {
    const result = mockHandlePedido("tradicional, y ademas otro chocomix", {
      lastQuestion: "Que variante de fresas con crema quieres?"
    });

    expect(result.necesita_aclaracion).toBe(false);
    expect(result.items).toEqual([
      expect.objectContaining({
        producto: "Fresas con crema tradicional",
        cantidad: 1
      })
    ]);
    expect(result.items).not.toEqual([
      expect.objectContaining({
        producto: "Fresa con crema + Oreo + Milo"
      })
    ]);
    expect(result.mensaje_cliente).toContain("no aparece en el menu");
    expect(result.mensaje_cliente).toContain("Quieres agregar otro producto al pedido?");
    expect(result.mensaje_cliente).not.toMatch(/dime no|si ya esta/i);
  });

  it("rechaza un producto desconocido sin agregarlo al pedido", () => {
    const result = mockHandlePedido("quiero un chocomix");

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.items).toEqual([]);
    expect(result.pregunta).toContain("no aparece en el menu");
    expect(result.pregunta).not.toMatch(/oreo|milo/i);
  });

  it("rechaza cualquier producto fuera del catalogo sin buscar parecidos", () => {
    const result = mockHandlePedido("quiero una pizza hawaiana");

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.items).toEqual([]);
    expect(result.pregunta).toContain("no aparece en el menu");
    expect(result.pregunta).not.toMatch(/fresas|oblea|malteada|wafle/i);
  });

  it("cuando el cliente dice no despues del item pide plantilla completa de domicilio", () => {
    const result = mockHandlePedido("no", {
      activeItem: {
        producto: "Fresas con crema tradicional",
        cantidad: 1,
        variante: "tradicional",
        precio_unitario: 16000
      }
    });

    expect(result.necesita_aclaracion).toBe(false);
    expect(result.mensaje_cliente).toContain("Para el domicilio");
    expect(result.mensaje_cliente).toContain("Nombre:");
    expect(result.mensaje_cliente).toContain("Direccion:");
    expect(result.mensaje_cliente).toContain("Barrio:");
    expect(result.mensaje_cliente).toContain("Referencia:");
    expect(result.mensaje_cliente).toContain("Metodo de pago");
    expect(result.mensaje_cliente).not.toMatch(/domicilio o recoger|recoger o domicilio/i);
    expect(result.next_expected).toBe("datos");
  });

  it("no ofrece fresas agotadas cuando catalogo_disponible las marca agotadas", () => {
    const catalogoDisponible = buildAvailableCatalogContext({
      products: [
        {
          id: "prod_tradicional",
          name: "Fresas con crema tradicional",
          category: "Fresas y combinados",
          basePrice: 16000,
          isOutOfStock: true
        },
        {
          id: "prod_oreo",
          name: "Fresas con crema de Oreo",
          category: "Fresas y combinados",
          basePrice: 18000,
          isOutOfStock: false
        }
      ]
    });

    const result = mockHandlePedido("quiero unas fresas", { catalogoDisponible });

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.pregunta).not.toContain("tradicional");
    expect(result.pregunta).toContain("crema de Oreo");
    expect(result.items).toEqual([]);
  });

  it("no agrega un producto agotado aunque el cliente lo pida exacto", () => {
    const catalogoDisponible = buildAvailableCatalogContext({
      products: [
        {
          id: "prod_tradicional",
          name: "Fresas con crema tradicional",
          category: "Fresas y combinados",
          basePrice: 16000,
          isOutOfStock: true
        },
        {
          id: "prod_oreo",
          name: "Fresas con crema de Oreo",
          category: "Fresas y combinados",
          basePrice: 18000,
          isOutOfStock: false
        }
      ]
    });

    const result = mockHandlePedido("quiero unas fresas tradicionales", { catalogoDisponible });

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.pregunta).toContain("agotado");
    expect(result.pregunta).toContain("crema de Oreo");
    expect(result.items).toEqual([]);
  });

  it("no agrega un topping agotado aunque exista un item activo", () => {
    const catalogoDisponible = buildAvailableCatalogContext({
      products: [
        {
          id: "prod_tradicional",
          name: "Fresas con crema tradicional",
          category: "Fresas y combinados",
          basePrice: 16000
        }
      ],
      modifiers: [{ id: "mod_oreo", name: "Oreo", priceDelta: 2000, isActive: false }]
    });

    const result = mockHandlePedido("agrega Oreo", {
      activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 },
      catalogoDisponible
    });

    expect(result.necesita_aclaracion).toBe(true);
    expect(result.pregunta).toContain("agotado");
    expect(result.items).toEqual([]);
  });
});
