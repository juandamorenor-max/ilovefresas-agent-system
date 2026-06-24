export interface N8nClientConfig {
  apiUrl: string;
  apiKey: string;
}

export interface N8nWorkflowPayload {
  name: string;
  nodes: unknown[];
  connections: Record<string, unknown>;
  settings?: Record<string, unknown>;
  staticData?: Record<string, unknown> | null;
  tags?: unknown[];
}

export class N8nClient {
  private readonly apiBase: string;
  private readonly apiKey: string;

  constructor(config: N8nClientConfig) {
    if (!config.apiUrl) {
      throw new Error("N8N_API_URL is required.");
    }

    if (!config.apiKey) {
      throw new Error("N8N_API_KEY is required.");
    }

    this.apiBase = buildN8nApiBase(config.apiUrl);
    this.apiKey = config.apiKey;
  }

  async getWorkflow(workflowId: string): Promise<unknown> {
    return this.request(`/workflows/${workflowId}`);
  }

  async updateWorkflow(workflowId: string, workflow: N8nWorkflowPayload): Promise<unknown> {
    return this.request(`/workflows/${workflowId}`, {
      method: "PUT",
      body: JSON.stringify(workflow)
    });
  }

  async activateWorkflow(workflowId: string): Promise<unknown> {
    return this.request(`/workflows/${workflowId}/activate`, {
      method: "POST"
    });
  }

  private async request(path: string, init: RequestInit = {}): Promise<unknown> {
    const response = await fetch(`${this.apiBase}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-N8N-API-KEY": this.apiKey,
        ...init.headers
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`n8n request failed: ${response.status} ${response.statusText} ${body}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json() as Promise<unknown>;
  }
}

export function createN8nClientFromEnv(env: NodeJS.ProcessEnv = process.env): N8nClient {
  return new N8nClient({
    apiUrl: env.N8N_API_URL ?? "",
    apiKey: env.N8N_API_KEY ?? ""
  });
}

export function buildN8nApiBase(apiUrl: string): string {
  const trimmed = apiUrl.replace(/\/+$/, "");
  return trimmed.endsWith("/api/v1") ? trimmed : `${trimmed}/api/v1`;
}

export function prepareWorkflowForUpdate(input: unknown): N8nWorkflowPayload {
  if (!isRecord(input)) {
    throw new Error("Workflow JSON must be an object.");
  }

  if (typeof input.name !== "string") {
    throw new Error("Workflow JSON must include name.");
  }

  if (!Array.isArray(input.nodes)) {
    throw new Error("Workflow JSON must include nodes array.");
  }

  if (!isRecord(input.connections)) {
    throw new Error("Workflow JSON must include connections object.");
  }

  return {
    name: input.name,
    nodes: input.nodes,
    connections: input.connections,
    settings: isRecord(input.settings) ? input.settings : {},
    staticData: isRecord(input.staticData) ? input.staticData : null,
    tags: Array.isArray(input.tags) ? input.tags : []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
