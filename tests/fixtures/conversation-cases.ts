import type { AgentRoute, ConversationCase } from "../../src/types.js";

export const routerCases: ConversationCase<{ route: AgentRoute }>[] = [
  {
    name: "saludo va a general",
    messages: ["hola"],
    expected: { route: "general" }
  },
  {
    name: "menu va a menu",
    messages: ["menu"],
    expected: { route: "menu" }
  },
  {
    name: "toppings va a menu",
    messages: ["que toppings tienen"],
    expected: { route: "menu" }
  },
  {
    name: "fresas con crema va a pedido",
    messages: ["quiero unas fresas con crema"],
    expected: { route: "pedido" }
  },
  {
    name: "tradicional como continuacion va a pedido",
    messages: ["tradicional"],
    context: { lastQuestion: "Que variante de fresas con crema quieres?" },
    expected: { route: "pedido" }
  },
  {
    name: "pago por nequi va a datos",
    messages: ["pago por nequi"],
    expected: { route: "datos" }
  },
  {
    name: "hablar con alguien va a escalamiento",
    messages: ["quiero hablar con alguien"],
    expected: { route: "escalamiento" }
  },
  {
    name: "agregar topping va a pedido",
    messages: ["agrega Oreo"],
    context: { activeItem: { producto: "Fresas con crema tradicional" } },
    expected: { route: "pedido" }
  },
  {
    name: "cambiar cantidad como continuacion va a pedido",
    messages: ["mejor dos"],
    context: { activeItem: { producto: "Oblea arequipe", cantidad: 1 } },
    expected: { route: "pedido" }
  },
  {
    name: "domicilio va a datos si no pregunta costo exacto",
    messages: ["es para domicilio"],
    expected: { route: "datos" }
  },
  {
    name: "costo de domicilio exacto escala",
    messages: ["cuanto cuesta el domicilio hasta Villa Santos"],
    expected: { route: "escalamiento" }
  },
  {
    name: "descuento riesgoso escala",
    messages: ["me haces un descuento?"],
    expected: { route: "escalamiento" }
  }
];

export const pedidoCases = [
  {
    name: "fresas con crema pregunta variante",
    message: "quiero unas fresas con crema",
    expectedQuestionIncludes: "opciones de fresas"
  },
  {
    name: "fresas genericas pregunta opciones cerradas",
    message: "quiero unas fresas",
    expectedQuestionIncludes: "opciones de fresas"
  },
  {
    name: "tradicional interpreta continuacion",
    message: "tradicional",
    context: { lastQuestion: "Que variante de fresas con crema quieres?" },
    expectedItem: "Fresas con crema tradicional"
  },
  {
    name: "malteada pregunta sabor",
    message: "quiero una malteada",
    expectedQuestionIncludes: "sabor"
  },
  {
    name: "oreo como sabor de malteada crea item",
    message: "Oreo",
    context: { lastQuestion: "Que sabor de malteada quieres: fresa, chocolate, vainilla u Oreo?" },
    expectedItem: "Malteada de Oreo",
    expectedFlavor: "Oreo"
  },
  {
    name: "oblea pregunta tipo",
    message: "quiero una oblea",
    expectedQuestionIncludes: "tipo"
  },
  {
    name: "arequipe como tipo de oblea crea item",
    message: "arequipe",
    context: { lastQuestion: "Que tipo de oblea quieres?" },
    expectedItem: "Oblea arequipe"
  },
  {
    name: "fresas con helado pregunta sabor",
    message: "fresas con helado",
    expectedQuestionIncludes: "sabor"
  },
  {
    name: "agregale oreo sin item pregunta producto",
    message: "agregale oreo",
    expectedQuestionIncludes: "producto"
  },
  {
    name: "agregale oreo con item activo agrega topping",
    message: "agregale oreo",
    context: { activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 } },
    expectedItem: "Fresas con crema tradicional",
    expectedTopping: "Oreo"
  },
  {
    name: "agrega oreo con item activo agrega topping",
    message: "agrega Oreo",
    context: { activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 } },
    expectedItem: "Fresas con crema tradicional",
    expectedTopping: "Oreo"
  },
  {
    name: "mas crema sin item claro pregunta producto",
    message: "ponle mas crema",
    expectedQuestionIncludes: "producto"
  },
  {
    name: "mas crema con item activo agrega adicion",
    message: "ponle mas crema",
    context: { activeItem: { producto: "Fresas con crema tradicional", cantidad: 1 } },
    expectedItem: "Fresas con crema tradicional",
    expectedAddition: "Crema adicional"
  },
  {
    name: "mejor dos actualiza cantidad en item activo",
    message: "mejor dos",
    context: { activeItem: { producto: "Oblea arequipe", cantidad: 1 } },
    expectedItem: "Oblea arequipe",
    expectedQuantity: 2
  },
  {
    name: "malteada tambien pregunta sabor",
    message: "quiero una malteada tambien",
    expectedQuestionIncludes: "sabor"
  }
];

export const menuCases = [
  {
    name: "menu activa enviar menu",
    message: "menu",
    expectedEnviarMenu: true
  },
  {
    name: "toppings no activa enviar menu",
    message: "que toppings tienen",
    expectedEnviarMenu: false,
    expectedResponseIncludes: "Oreo"
  },
  {
    name: "precio malteada oreo",
    message: "cuanto vale una malteada de oreo",
    expectedEnviarMenu: false,
    expectedResponseIncludes: "15000"
  },
  {
    name: "precio ambiguo no anota producto",
    message: "cuanto vale?",
    expectedEnviarMenu: false,
    expectedResponseIncludes: "producto"
  },
  {
    name: "domicilio no inventa costo",
    message: "cuanto cuesta el domicilio",
    expectedEnviarMenu: false,
    expectedResponseIncludes: "asesor"
  },
  {
    name: "disponibilidad exacta requiere humano",
    message: "tienen disponible para entregar ya?",
    expectedEnviarMenu: false,
    expectedResponseIncludes: "equipo"
  }
];

export const datosCases = [
  {
    name: "extrae nombre direccion barrio y pregunta siguiente dato",
    message: "Soy Juan, vivo en cra 20 #10-15, barrio centro",
    expected: {
      nombre: "Juan",
      direccion: "cra 20 #10-15",
      barrio: "centro"
    },
    expectedQuestionIncludes: "referencia"
  },
  {
    name: "normaliza nequi",
    message: "pago por nequi",
    expectedMetodoPago: "nequi"
  },
  {
    name: "normaliza efectivo",
    message: "pago en efectivo",
    expectedMetodoPago: "efectivo"
  },
  {
    name: "domicilio sin datos pregunta nombre",
    message: "es para domicilio",
    expectedQuestionIncludes: "nombre"
  },
  {
    name: "extrae referencia de apartamento",
    message: "referencia apartamento 302 torre 2",
    expected: {
      referencia: "apartamento 302 torre 2"
    }
  },
  {
    name: "extrae telefono whatsapp",
    message: "mi numero es 300 123 4567",
    expected: {
      telefono: "3001234567"
    }
  }
];
