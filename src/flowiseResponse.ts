export interface NormalizedFlowiseReply {
  responseText: string;
  sourceField: string;
}

const fallbackReply =
  "Perdon, tuve un problema entendiendo la respuesta. Te paso con el equipo para ayudarte.";

export function normalizeFlowiseReply(response: unknown): NormalizedFlowiseReply {
  const candidates = [
    ["text", getPath(response, ["text"])],
    ["mensaje_cliente", getPath(response, ["mensaje_cliente"])],
    ["json.mensaje_cliente", getPath(response, ["json", "mensaje_cliente"])],
    ["json.respuesta", getPath(response, ["json", "respuesta"])],
    ["response", getPath(response, ["response"])],
    ["answer", getPath(response, ["answer"])],
    ["message", getPath(response, ["message"])],
    ["output", getPath(response, ["output"])],
    ["data.text", getPath(response, ["data", "text"])],
    ["data.mensaje_cliente", getPath(response, ["data", "mensaje_cliente"])]
  ] as const;

  for (const [sourceField, value] of candidates) {
    if (typeof value === "string" && value.trim()) {
      return {
        responseText: value.trim(),
        sourceField
      };
    }
  }

  return {
    responseText: fallbackReply,
    sourceField: "fallback"
  };
}

function getPath(value: unknown, path: string[]): unknown {
  return path.reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null || Array.isArray(current)) {
      return undefined;
    }

    return (current as Record<string, unknown>)[key];
  }, value);
}
