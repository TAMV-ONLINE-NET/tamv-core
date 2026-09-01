import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  ISABELLA_MODEL,
  createLovableAiGatewayProvider,
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { buildSystemPrompt } from "@/lib/isabella/persona";
import { evaluateIntent } from "@/lib/isabella/engine";
import { API_CATALOG, API_DOMAINS, catalogStats } from "@/lib/api-catalog";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "Falta LOVABLE_API_KEY en el servidor." }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }

        const body = (await request.json()) as {
          messages: UIMessage[];
          mode?: string;
          plane?: string;
        };

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const gateway = createLovableAiGatewayProvider(apiKey, runIdFetch);

        const result = streamText({
          model: gateway(ISABELLA_MODEL),
          system: buildSystemPrompt(body.mode ?? "canon", body.plane),
          messages: convertToModelMessages(body.messages ?? []),
          stopWhen: stepCountIs(50),
          abortSignal: request.signal,
          tools: {
            evaluarKEC: tool({
              description:
                "Evalúa una intención contra el Kernel Ético Central (KEC) y devuelve decisión, subsistema, confianza, banderas y vector VAD. Úsala antes de cualquier decisión sensible.",
              inputSchema: z.object({
                intencion: z.string().describe("La intención del usuario, en texto plano"),
                dominio: z
                  .string()
                  .describe(
                    "general | turismo | gobernanza | economia | identidad | seguridad",
                  ),
              }),
              execute: async ({ intencion, dominio }) => evaluateIntent(intencion, dominio),
            }),
            sellarBookPI: tool({
              description:
                "Sella un evento en el registro BookPI (cadena SHA-256). Úsala cuando una decisión deba quedar registrada de forma auditable.",
              inputSchema: z.object({
                tipo: z.string().describe("Tipo de evento, formato <dominio>.<accion>"),
                dominio: z.string(),
                resumen: z.string().describe("Resumen breve de lo que se sella"),
              }),
              execute: async ({ tipo, dominio, resumen }) => {
                const { bookpiWrite } = await import("@/server-functions/bookpi");
                const res = await bookpiWrite({
                  data: {
                    type: tipo,
                    source: "isabella-chat",
                    domain: dominio,
                    data: { resumen },
                  },
                });
                return { hash: res.entry.hash, prevHash: res.prevHash, id: res.entry.id };
              },
            }),
            consultarLedger: tool({
              description: "Lee las últimas entradas selladas del ledger BookPI.",
              inputSchema: z.object({
                limite: z.number().describe("Cuántas entradas devolver (1-50)"),
                dominio: z.string().nullable().describe("Filtro de dominio o null"),
              }),
              execute: async ({ limite, dominio }) => {
                const { bookpiQuery } = await import("@/server-functions/bookpi");
                return bookpiQuery({
                  data: {
                    limit: Math.min(Math.max(limite, 1), 50),
                    ...(dominio ? { domain: dominio } : {}),
                  },
                });
              },
            }),
            consultarCatalogoAPI: tool({
              description:
                "Consulta el catálogo contractual de 720 endpoints del TAMV. Devuelve coincidencias y estadísticas. Los endpoints son contratos, no rutas en producción.",
              inputSchema: z.object({
                busqueda: z.string().describe("Texto a buscar en id o path"),
                dominio: z.string().nullable().describe("Dominio del catálogo o null"),
              }),
              execute: async ({ busqueda, dominio }) => {
                const q = busqueda.toLowerCase();
                const matches = API_CATALOG.filter(
                  (e) =>
                    (!dominio || e.id.startsWith(`${dominio}.`)) &&
                    (e.id.toLowerCase().includes(q) || e.path.toLowerCase().includes(q)),
                ).slice(0, 25);
                return {
                  stats: catalogStats(),
                  dominios: API_DOMAINS.map((d) => d.key),
                  coincidencias: matches,
                  aviso: "Estado 'contract': catálogo versionado, no implementación en producción.",
                };
              },
            }),
          },
        });

        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({ sendReasoning: true }),
          runIdFetch,
        );
      },
    },
  },
});
