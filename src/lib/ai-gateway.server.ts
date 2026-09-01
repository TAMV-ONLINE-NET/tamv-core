/* ================================================================== */
/* AI GATEWAY — Proveedor Lovable AI para Isabella Villaseñor AI       */
/* ================================================================== */
/* Solo servidor. Nunca importar desde componentes de cliente.         */
/* ================================================================== */

import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export interface RunIdFetch {
  fetch: typeof fetch;
  get runId(): string | undefined;
}

/** Envuelve `fetch` para capturar y reenviar el run-id que emite el gateway. */
export function createLovableAiGatewayRunIdFetch(initialRunId?: string): RunIdFetch {
  let runId = initialRunId;
  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);
    const res = await fetch(input, { ...init, headers });
    runId = res.headers.get(RUN_ID_HEADER) ?? runId;
    return res;
  };
  return {
    fetch: wrapped,
    get runId() {
      return runId;
    },
  };
}

export function getLovableAiGatewayRunId(request: Request): string | undefined {
  return request.headers.get(RUN_ID_HEADER) ?? undefined;
}

export function withLovableAiGatewayRunIdHeader(response: Response, rf: RunIdFetch): Response {
  if (rf.runId) response.headers.set(RUN_ID_HEADER, rf.runId);
  return response;
}

/** Proveedor del gateway. `apiKey` satisface al SDK; el gateway autentica por header. */
export function createLovableAiGatewayProvider(apiKey: string, runIdFetch?: RunIdFetch) {
  return createOpenAICompatible({
    name: "lovable-ai-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    ...(runIdFetch ? { fetch: runIdFetch.fetch } : {}),
  });
}

/** Modelo canónico de Isabella: razonamiento rápido, contexto amplio. */
export const ISABELLA_MODEL = "google/gemini-3.7-flash";
