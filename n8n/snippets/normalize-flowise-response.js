// n8n Code node: "Normalize Flowise Response"
// Place immediately after Flowise HTTP Request and before Telegram send.

const fallbackReply =
  "Perdon, tuve un problema entendiendo la respuesta. Te paso con el equipo para ayudarte.";

function getPath(value, path) {
  return path.reduce((current, key) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }

    return current[key];
  }, value);
}

const candidates = [
  ["text", getPath($json, ["text"])],
  ["mensaje_cliente", getPath($json, ["mensaje_cliente"])],
  ["json.mensaje_cliente", getPath($json, ["json", "mensaje_cliente"])],
  ["json.respuesta", getPath($json, ["json", "respuesta"])],
  ["response", getPath($json, ["response"])],
  ["answer", getPath($json, ["answer"])],
  ["message", getPath($json, ["message"])],
  ["output", getPath($json, ["output"])],
  ["data.text", getPath($json, ["data", "text"])],
  ["data.mensaje_cliente", getPath($json, ["data", "mensaje_cliente"])]
];

for (const [sourceField, value] of candidates) {
  if (typeof value === "string" && value.trim()) {
    return [
      {
        json: {
          ...$json,
          responseText: value.trim(),
          responseSourceField: sourceField
        }
      }
    ];
  }
}

return [
  {
    json: {
      ...$json,
      responseText: fallbackReply,
      responseSourceField: "fallback",
      needs_human: true
    }
  }
];
