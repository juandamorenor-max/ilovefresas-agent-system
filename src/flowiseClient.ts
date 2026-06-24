import type { FlowisePredictionRequest, FlowisePredictionResponse } from "./types.js";

export interface FlowiseClientConfig {
  host: string;
  flowId: string;
  apiKey?: string;
}

export class FlowiseClient {
  private readonly config: FlowiseClientConfig;

  constructor(config: FlowiseClientConfig) {
    this.config = {
      ...config,
      host: config.host.replace(/\/+$/, "")
    };
  }

  async predict(request: FlowisePredictionRequest): Promise<FlowisePredictionResponse> {
    if (!this.config.host) {
      throw new Error("FLOWISE_API_HOST is required.");
    }

    if (!this.config.flowId) {
      throw new Error("FLOWISE_FLOW_ID is required.");
    }

    const response = await fetch(
      `${this.config.host}/api/v1/prediction/${this.config.flowId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.apiKey
            ? { Authorization: `Bearer ${this.config.apiKey}` }
            : {})
        },
        body: JSON.stringify(buildFlowisePredictionBody(request))
      }
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Flowise request failed: ${response.status} ${response.statusText} ${body}`);
    }

    return response.json() as Promise<FlowisePredictionResponse>;
  }
}

export function buildFlowisePredictionBody(request: FlowisePredictionRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {
    question: renderFlowiseQuestion(request.question, request.conversationState),
    sessionId: request.sessionId
  };

  const vars: Record<string, string> = {};

  if (request.catalogoDisponible) {
    vars.catalogo_disponible =
      typeof request.catalogoDisponible === "string"
        ? request.catalogoDisponible
        : JSON.stringify(request.catalogoDisponible, null, 2);
  }

  for (const [key, value] of Object.entries(request.conversationState ?? {})) {
    vars[key] = stringifyFlowiseVar(value);
  }

  if (Object.keys(vars).length > 0) {
    body.overrideConfig = {
      vars
    };
  }

  return body;
}

function renderFlowiseQuestion(
  question: string,
  conversationState: FlowisePredictionRequest["conversationState"]
): string {
  if (!conversationState) {
    return question;
  }

  return [
    "<contexto_externo_n8n_backend>",
    ...Object.entries(conversationState).map(([key, value]) => `${key}: ${stringifyFlowiseVar(value)}`),
    "</contexto_externo_n8n_backend>",
    "",
    "<ultimo_mensaje_cliente>",
    question,
    "</ultimo_mensaje_cliente>"
  ].join("\n");
}

function stringifyFlowiseVar(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

export function createFlowiseClientFromEnv(env: NodeJS.ProcessEnv = process.env): FlowiseClient {
  return new FlowiseClient({
    host: env.FLOWISE_API_HOST ?? "",
    flowId: env.FLOWISE_FLOW_ID ?? env.FLOWISE_CHATFLOW_ID ?? "",
    apiKey: env.FLOWISE_API_KEY
  });
}
