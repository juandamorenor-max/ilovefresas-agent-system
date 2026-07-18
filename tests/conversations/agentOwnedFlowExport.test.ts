import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const exportPath = path.resolve(
  "flowise/exports/agentflow-e52f27b3-2026-07-17-agents-owner.json"
);
const flow = JSON.parse(fs.readFileSync(exportPath, "utf8"));
const applyNode = flow.nodes.find(
  (node: { id: string }) => node.id === "customFunctionAgentflow_1"
);
const applyCode = applyNode.data.inputs.customFunctionJavascriptFunction as string;
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

const catalog = {
  productos: [
    {
      id: "prod_waffle_tradicional",
      name: "Waffle Tradicional",
      requiredOptions: [
        { key: "fruit", label: "fruta", required: true, minSelections: 1, options: ["Fresa", "Banano"] },
        { key: "iceCreamFlavor", label: "sabor de helado", required: true, minSelections: 1, options: ["Fresa", "Vainilla"] },
        { key: "sauce", label: "salsa", required: true, minSelections: 1, options: ["Arequipe", "Nutella"] }
      ]
    }
  ],
  toppings: [],
  adiciones: []
};

async function apply(
  state: Record<string, unknown>,
  operations: unknown[],
  action = "configure_item",
  externalState: Record<string, unknown> | null = null
) {
  const flowContext = { state };
  const fn = new AsyncFunction(
    "$flow",
    "$vars",
    "$operations",
    "$action",
    "$target_item_id",
    "$target_option_key",
    "$reply",
    "$turn_context",
    applyCode
  );
  const raw = await fn(
    flowContext,
    { available_catalog: JSON.stringify(catalog) },
    JSON.stringify(operations),
    action,
    "",
    "",
    "respuesta",
    [
      `<available_catalog>${JSON.stringify(catalog)}</available_catalog>`,
      externalState
        ? `<conversation_state>${JSON.stringify(externalState)}</conversation_state>`
        : ""
    ].join("\n")
  );
  return { state: flowContext.state, result: JSON.parse(raw) };
}

describe("Agentflow con decisiones en agentes", () => {
  it("conserva dos waffles como unidades y enfoca el primero", async () => {
    const { state, result } = await apply(
      { items: "[]", validated_quote: "quote_vieja" },
      [
        { type: "add_item", product_id: "waffle_tradicional", quantity: 1 },
        { type: "add_item", product_id: "waffle_tradicional", quantity: 1 }
      ]
    );
    const items = JSON.parse(String(state.items));
    expect(items).toHaveLength(2);
    expect(items.every((item: { quantity: number }) => item.quantity === 1)).toBe(true);
    expect(new Set(items.map((item: { id: string }) => item.id)).size).toBe(2);
    expect(result.pending_action).toBe("configure_item");
    expect(result.target_item_id).toBe(items[0].id);
    expect(result.target_option_key).toBe("fruit");
    expect(result.reply).toContain("fruta");
    expect(result.reply).toContain("Para cada waffle tradicional");
    expect(result.reply).toContain("🍓 Frutas: Fresa o Banano");
    expect(result.reply).toContain("🍦 Helados: Fresa o Vainilla");
    expect(result.reply).toContain("🍫 Salsas: Arequipe o Nutella");
    expect(result.reply).toContain("Puedes enviarme todas las opciones juntas o responder una por una.");
    expect(result.reply).toContain("Vamos con el primer waffle tradicional");
    expect(result.reply).not.toContain("Toppings:");
    expect(state.validated_quote).toBe("");
  });

  it("completa solo la unidad enfocada y luego solicita la segunda", async () => {
    const initial = await apply(
      { items: "[]", validated_quote: "" },
      [{ type: "add_item", product_id: "prod_waffle_tradicional", quantity: 2 }]
    );
    const items = JSON.parse(String(initial.state.items));
    const firstId = items[0].id;
    const secondId = items[1].id;
    const completedFirst = await apply(
      { items: "[]", validated_quote: "" },
      [
        { type: "set_required_option", target_item_id: firstId, option_key: "fruit", value: "Fresa" },
        { type: "set_required_option", target_item_id: firstId, option_key: "iceCreamFlavor", value: "Fresa" },
        { type: "set_required_option", target_item_id: firstId, option_key: "sauce", value: "Arequipe" }
      ],
      "configure_item",
      {
        items: JSON.stringify(items),
        pending_action: "configure_item",
        target_item_id: firstId,
        target_option_key: "fruit"
      }
    );
    expect(completedFirst.result.target_item_id).toBe(secondId);
    expect(completedFirst.result.target_option_key).toBe("fruit");
    const nextItems = JSON.parse(String(completedFirst.state.items));
    expect(nextItems[0].selectedOptions).toEqual({
      fruit: ["Fresa"],
      iceCreamFlavor: ["Fresa"],
      sauce: ["Arequipe"]
    });
    expect(nextItems[1].selectedOptions).toEqual({});
    expect(completedFirst.result.reply.toLowerCase()).toContain("segundo waffle tradicional");
    expect(completedFirst.result.reply).not.toContain("Para cada waffle tradicional");
  });

  it("no permite pasar a datos si queda una opción obligatoria", async () => {
    const initial = await apply(
      { items: "[]", validated_quote: "" },
      [{ type: "add_item", product_id: "prod_waffle_tradicional", quantity: 1 }],
      "collect_data"
    );
    expect(initial.result.pending_action).toBe("configure_item");
    expect(initial.result.next_expected).toBe("pedido");
  });

  it("rehidrata items e IDs desde el contexto externo en una ejecución nueva", async () => {
    const initial = await apply(
      { items: "[]", validated_quote: "" },
      [{ type: "add_item", product_id: "prod_waffle_tradicional", quantity: 2 }]
    );
    const persistedItems = JSON.parse(String(initial.state.items));
    const firstId = persistedItems[0].id;
    const secondId = persistedItems[1].id;

    const nextExecution = await apply(
      { items: "[]", validated_quote: "" },
      [
        { type: "set_required_option", target_item_id: firstId, option_key: "fruit", value: "Fresa" },
        { type: "set_required_option", target_item_id: firstId, option_key: "iceCreamFlavor", value: "Fresa" },
        { type: "set_required_option", target_item_id: firstId, option_key: "sauce", value: "Arequipe" }
      ],
      "configure_item",
      {
        items: JSON.stringify(persistedItems),
        pending_action: "configure_item",
        target_item_id: firstId,
        target_option_key: "fruit"
      }
    );

    expect(nextExecution.result.items).toHaveLength(2);
    expect(nextExecution.result.target_item_id).toBe(secondId);
    expect(nextExecution.result.target_option_key).toBe("fruit");
    expect(nextExecution.result.items[0].selectedOptions).toEqual({
      fruit: ["Fresa"],
      iceCreamFlavor: ["Fresa"],
      sauce: ["Arequipe"]
    });
    expect(nextExecution.result.items[1].selectedOptions).toEqual({});
  });
});
