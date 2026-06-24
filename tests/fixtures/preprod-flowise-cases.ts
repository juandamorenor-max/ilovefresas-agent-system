import type { AgentRoute } from "../../src/types.js";

export interface PreprodFlowiseCase {
  id: string;
  name: string;
  category: "pedido_valido" | "faltantes" | "modificacion" | "anti_invencion" | "escalamiento" | "menu";
  messages: string[];
  expectedTurnRoutes?: AgentRoute[];
  finalRoute?: AgentRoute;
  mustContainSomewhere?: string[];
  mustContainAnySomewhere?: string[][];
  mustContainFinal?: string[];
  mustNotContainAnywhere?: string[];
}

const neverSay = [
  "tu pedido ya se esta preparando",
  "tu pedido ya está preparando",
  "ya va en camino",
  "ya salio",
  "ya salió",
  "si ya esta asi, dime no",
  "si ya está así, dime no",
  "etc."
];

export const preprodFlowiseCases: PreprodFlowiseCase[] = [
  {
    id: "pp-001",
    name: "fresas tradicionales, oblea y malteada con datos en partes",
    category: "pedido_valido",
    messages: [
      "holaa",
      "quiero unas frezas tradicionales",
      "tambien una oblea",
      "arequipe",
      "y una malteada",
      "oreo",
      "no mas",
      "soy Camila",
      "cra 39A #41-99",
      "barrio Cabecera del Llano",
      "referencia porteria azul",
      "pago neqi"
    ],
    expectedTurnRoutes: [
      "general",
      "pedido",
      "pedido",
      "pedido",
      "pedido",
      "pedido",
      "pedido",
      "datos",
      "datos",
      "datos",
      "datos",
      "datos"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Resumen", "Domicilio", "Total"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-002",
    name: "pedido largo de cinco productos con cantidades mixtas",
    category: "pedido_valido",
    messages: [
      "quiero hacer un pedido grande",
      "dos fresas con crema tradicionales",
      "agregales oreo",
      "un brownie con helado",
      "una pavlova",
      "dos obleas de nutella",
      "una malteada de vainilla",
      "listo",
      "me llamo Andres",
      "direccion calle 84 #52-20",
      "barrio Alto Prado",
      "referencia edificio gris apto 302",
      "efectivo"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Resumen", "Fresas", "Brownie", "Pavlova", "Nutella", "Malteada"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-003",
    name: "wafle con fruta helado salsa y otro producto",
    category: "pedido_valido",
    messages: [
      "quiero un wafle tradicional",
      "con fresa",
      "helado de vainilla",
      "salsa de arequipe",
      "tambien una malteada oreo",
      "ya",
      "Laura",
      "cra 50 #80-10",
      "Villa Country",
      "torre 1 apto 604",
      "Bancolombia"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["wafle", "fresa", "vainilla", "arequipe", "malteada"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-004",
    name: "fresas con topping y adicion en mensajes separados",
    category: "pedido_valido",
    messages: [
      "unas fresas tradicionales",
      "con oreo",
      "ponle helado de vainilla",
      "nada mas",
      "Maria Jose",
      "direccion cra 43 #70-12",
      "barrio Boston",
      "referencia casa blanca",
      "Nequi"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Oreo", "helado", "Resumen", "Total"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-005",
    name: "combinados y vaso helado con typos",
    category: "pedido_valido",
    messages: [
      "buenas quiero un combiando fresa durazno con crema",
      "y un vaso elado de dos sabores",
      "fresa y chocolate",
      "solo eso",
      "Santiago Perez",
      "cll 72 #46-18",
      "barrio El Prado",
      "referencia al lado de la tienda",
      "bre-b"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["fresa", "durazno", "vaso", "Resumen"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-006",
    name: "pedido para recoger no debe pedir direccion completa",
    category: "pedido_valido",
    messages: [
      "quiero una malteada de chocolate y una oblea arequipe",
      "para recoger",
      "soy Natalia",
      "pago en efectivo"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["recoger", "malteada", "oblea"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-007",
    name: "fresas genericas deben pedir variante concreta",
    category: "pedido_valido",
    messages: ["hola", "quiero unas fresas", "tradicional", "no"],
    expectedTurnRoutes: ["general", "pedido", "pedido", "pedido"],
    finalRoute: "pedido",
    mustContainSomewhere: ["tradicional"],
    mustNotContainAnywhere: [...neverSay, "alguna otra", "otra opcion"]
  },
  {
    id: "pp-008",
    name: "pedido largo con cambio de cantidad",
    category: "pedido_valido",
    messages: [
      "quiero una oblea de arequipe",
      "mejor dos",
      "y una malteada oreo",
      "no mas",
      "Carlos Mendoza",
      "direccion cra 53 #76-22",
      "barrio El Golf",
      "referencia lobby principal",
      "nequi"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["2", "Oblea", "Malteada", "Resumen"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-009",
    name: "falta referencia",
    category: "faltantes",
    messages: [
      "quiero unas fresas tradicionales",
      "no",
      "soy Valentina",
      "direccion cra 44 #82-11",
      "barrio Riomar",
      "Nequi"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Referencia"],
    mustNotContainAnywhere: [...neverSay, "Total:"]
  },
  {
    id: "pp-010",
    name: "falta metodo de pago",
    category: "faltantes",
    messages: [
      "quiero una pavlova",
      "eso es todo",
      "Daniela",
      "calle 79 #50-35",
      "barrio Alto Prado",
      "referencia porteria"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Metodo de pago", "método de pago"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-011",
    name: "barrio solo no cuenta como direccion",
    category: "faltantes",
    messages: [
      "una malteada de vainilla",
      "no",
      "Jorge",
      "barrio Boston",
      "referencia casa amarilla",
      "efectivo"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Direccion", "dirección"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-012",
    name: "direccion sin barrio",
    category: "faltantes",
    messages: [
      "unas fresas con helado",
      "vainilla",
      "no mas",
      "soy Lucia",
      "cra 45 #80-22",
      "referencia edificio blanco",
      "Bancolombia"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["Barrio"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-013",
    name: "wafle incompleto no debe avanzar a datos",
    category: "faltantes",
    messages: ["quiero un wafle", "fresa", "vainilla"],
    finalRoute: "pedido",
    mustContainSomewhere: ["salsa"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-014",
    name: "confirmacion temprana no confirma pedido incompleto",
    category: "faltantes",
    messages: ["quiero unas fresas tradicionales", "si"],
    finalRoute: "pedido",
    mustContainAnySomewhere: [["que otro producto", "qué otro producto", "datos", "Nombre"]],
    mustNotContainAnywhere: ["Listo, dejo tu pedido en revision", ...neverSay]
  },
  {
    id: "pp-015",
    name: "agregar topping despues de pregunta de otro producto",
    category: "modificacion",
    messages: ["fresas tradicionales", "con milo", "no", "Ana", "cra 46 #85-10", "Riomar", "apto 201", "Nequi"],
    finalRoute: "datos",
    mustContainSomewhere: ["Milo", "Resumen"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-016",
    name: "cambiar cantidad a dos",
    category: "modificacion",
    messages: ["una oblea arequipe", "mejor dos", "no mas", "Pedro", "cll 76 #52-34", "El Golf", "casa 2", "efectivo"],
    finalRoute: "datos",
    mustContainSomewhere: ["2", "Oblea"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-017",
    name: "cambiar direccion antes del resumen",
    category: "modificacion",
    messages: [
      "malteada oreo",
      "no",
      "soy Paula",
      "direccion cra 40 #70-10",
      "mejor direccion cra 40 #70-20",
      "barrio Prado",
      "referencia porteria negra",
      "Nequi"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["70-20", "Resumen"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-018",
    name: "cambiar metodo de pago",
    category: "modificacion",
    messages: [
      "quiero una pavlova",
      "listo",
      "Roberto",
      "cra 51 #79-25",
      "Alto Prado",
      "recepcion",
      "Nequi",
      "mejor efectivo"
    ],
    finalRoute: "datos",
    mustContainSomewhere: ["efectivo"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-019",
    name: "anade otro producto despues de solo eso",
    category: "modificacion",
    messages: ["fresas tradicionales", "solo eso", "espera tambien una oblea", "arequipe"],
    finalRoute: "pedido",
    mustContainSomewhere: ["Oblea", "arequipe"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-020",
    name: "producto inexistente chocomix",
    category: "anti_invencion",
    messages: ["quiero unas fresas tradicionales", "y un chocomix"],
    finalRoute: "pedido",
    mustContainAnySomewhere: [["no aparece en el menu", "no está en el menú", "no lo manejamos"]],
    mustNotContainAnywhere: ["Fresa con crema + Oreo + Milo", ...neverSay]
  },
  {
    id: "pp-021",
    name: "producto externo pizza",
    category: "anti_invencion",
    messages: ["quiero una pizza hawaiana"],
    finalRoute: "pedido",
    mustContainAnySomewhere: [["no aparece en el menu", "no está en el menú", "no lo manejamos", "no tenemos pizza"]],
    mustNotContainAnywhere: ["fresas con crema + oreo + milo", ...neverSay]
  },
  {
    id: "pp-022",
    name: "topping inexistente",
    category: "anti_invencion",
    messages: ["fresas tradicionales", "ponle gomitas acidas"],
    finalRoute: "pedido",
    mustContainAnySomewhere: [["no aparece", "no lo manejamos", "opciones disponibles", "no tenemos"]],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-023",
    name: "sabor no autorizado",
    category: "anti_invencion",
    messages: ["quiero una malteada de pistacho"],
    finalRoute: "pedido",
    mustContainSomewhere: ["fresa", "chocolate", "vainilla", "Oreo"],
    mustNotContainAnywhere: ["pistacho:"]
  },
  {
    id: "pp-024",
    name: "producto mal escrito no inequivoco",
    category: "anti_invencion",
    messages: ["quiero un fresiloco mega"],
    finalRoute: "pedido",
    mustContainAnySomewhere: [["no aparece", "menu", "menú", "no tenemos"]],
    mustNotContainAnywhere: ["Fresas frutos rojos", "Fresas explosion"]
  },
  {
    id: "pp-025",
    name: "reclamo escala",
    category: "escalamiento",
    messages: ["quiero poner un reclamo por un pedido"],
    finalRoute: "escalamiento",
    mustContainSomewhere: ["equipo", "persona"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-026",
    name: "reembolso escala",
    category: "escalamiento",
    messages: ["quiero que me devuelvan la plata"],
    finalRoute: "escalamiento",
    mustContainSomewhere: ["equipo", "persona"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-027",
    name: "descuento escala",
    category: "escalamiento",
    messages: ["me haces descuento si compro varias?"],
    finalRoute: "escalamiento",
    mustContainSomewhere: ["equipo", "persona"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-028",
    name: "tiempo exacto escala",
    category: "escalamiento",
    messages: ["me llega en 15 minutos exactos?"],
    finalRoute: "escalamiento",
    mustContainSomewhere: ["equipo", "persona"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-029",
    name: "menu completo activa envio menu",
    category: "menu",
    messages: ["me mandas el menu completo pdf"],
    finalRoute: "menu",
    mustContainSomewhere: ["menu", "menú"],
    mustNotContainAnywhere: neverSay
  },
  {
    id: "pp-030",
    name: "toppings no deben mandar pdf ni inventar costo extra",
    category: "menu",
    messages: ["que toppings tienen para las fresas?"],
    finalRoute: "menu",
    mustContainSomewhere: ["Oreo", "Milo"],
    mustNotContainAnywhere: ["te envio el menu completo", "PDF", ...neverSay]
  }
];
