/* ================================================================== */
/* SERVER FN — Isabella: evaluación de intención con contrato zod     */
/* ================================================================== */
/* La lógica vive en `src/lib/isabella/engine.ts` (motor determinista  */
/* compartido por la consola web y por el servidor).                   */
/* ================================================================== */

import { createServerFn } from "@tanstack/react-start";
import { IsabellaRequestSchema, IsabellaResponseSchema } from "../lib/contracts";
import { evaluateIntent } from "../lib/isabella/engine";

export const isabellaEvaluate = createServerFn({ method: "POST" })
  .inputValidator(IsabellaRequestSchema)
  .handler(async ({ data }) => {
    const { publishEvent, runWithTrace } = await import("../lib/events");

    return runWithTrace({}, () => {
      const verdict = evaluateIntent(data.prompt, data.domain);

      const response = IsabellaResponseSchema.parse({
        reply: verdict.reply,
        decision: verdict.decision,
        confidence: verdict.confidence,
        explanation: verdict.explanation,
        flags: verdict.flags,
        vad: verdict.vad,
        hitl: verdict.hitl,
        pipelineStage: 6,
        subsystem: verdict.subsystem,
      });

      publishEvent({
        type: "isabella.evaluate",
        source: "isabella-core",
        domain: "isabella",
        data: {
          sessionId: data.sessionId ?? null,
          decision: response.decision,
          confidence: response.confidence,
          hitl: response.hitl,
        },
        ...(data.sessionId ? { meta: { entityId: data.sessionId } } : {}),
      });

      return response;
    });
  });
