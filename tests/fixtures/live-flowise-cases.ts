import type { AgentRoute } from "../../src/types.js";

export interface LiveFlowiseCase {
  name: string;
  messages: string[];
  expectedRoute: AgentRoute;
  expectedTextIncludes?: string;
  forbiddenTextIncludes?: string[];
}

export const liveFlowiseCases: LiveFlowiseCase[] = [
  {
    name: "saludo muestra bienvenida",
    messages: ["hola"],
    expectedRoute: "general",
    expectedTextIncludes: "I Love Fresas"
  },
  {
    name: "menu enruta a menu",
    messages: ["menu"],
    expectedRoute: "menu"
  },
  {
    name: "toppings es menu sin costo inventado",
    messages: ["que toppings tienen"],
    expectedRoute: "menu"
  },
  {
    name: "fresas con crema inicia pedido",
    messages: ["quiero unas fresas con crema"],
    expectedRoute: "pedido"
  },
  {
    name: "continuacion tradicional sigue en pedido",
    messages: ["quiero unas fresas con crema", "tradicional"],
    expectedRoute: "pedido"
  },
  {
    name: "agrega oreo sigue en pedido",
    messages: ["quiero unas fresas con crema", "tradicional", "agrega Oreo"],
    expectedRoute: "pedido"
  },
  {
    name: "cambio de cantidad sigue en pedido",
    messages: ["quiero una oblea", "arequipe", "mejor dos"],
    expectedRoute: "pedido"
  },
  {
    name: "pago por nequi va a datos",
    messages: ["pago por nequi"],
    expectedRoute: "datos"
  },
  {
    name: "domicilio sin costo exacto va a datos",
    messages: ["es para domicilio"],
    expectedRoute: "datos"
  },
  {
    name: "costo de domicilio exacto escala",
    messages: ["cuanto cuesta el domicilio hasta Villa Santos"],
    expectedRoute: "escalamiento",
    forbiddenTextIncludes: ["5000", "6000", "7000", "8000"]
  },
  {
    name: "descuento riesgoso escala",
    messages: ["me haces un descuento?"],
    expectedRoute: "escalamiento"
  },
  {
    name: "humano escala",
    messages: ["quiero hablar con alguien"],
    expectedRoute: "escalamiento"
  }
];
