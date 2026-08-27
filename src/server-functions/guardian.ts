/* ================================================================== */
/* SERVER FN — Guardian: resolución HITL sellada en BookPI            */
/* ================================================================== */
/* Las dependencias de servidor (node:crypto, node:async_hooks) se     */
/* importan dentro del handler para no contaminar el bundle cliente.   */
/* ================================================================== */

import { createServerFn } from "@tanstack/react-start";
import { GuardianResolveSchema, GuardianResolveResultSchema } from "../lib/contracts";

export const guardianResolve = createServerFn({ method: "POST" })
  .inputValidator(GuardianResolveSchema)
  .handler(async ({ data }) => {
    const { appendEntry, lastEntry } = await import("../lib/bookpi");
    const { sealBookPIEntry } = await import("../lib/bookpi/registry");
    const { publishEvent, runWithTrace } = await import("../lib/events");

    return runWithTrace({}, () => {
      const prev = lastEntry();
      const id = `evt-gdn-${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffff).toString(36)}`;
      const timestamp = new Date().toISOString();
      const payload = {
        actionId: data.actionId,
        decision: data.decision,
        guardianId: data.guardianId,
        note: data.note ?? null,
      };

      const hash = sealBookPIEntry({
        id,
        type: "guardian.resolution",
        source: "guardian-svc",
        domain: "guardian",
        timestamp,
        data: payload,
        prevHash: prev?.hash ?? null,
      });

      appendEntry({
        id,
        type: "guardian.resolution",
        source: "guardian-svc",
        domain: "guardian",
        timestamp,
        data: payload,
        hash,
        prevHash: prev?.hash ?? null,
      });

      publishEvent({
        type: "guardian.resolution.sealed",
        source: "guardian-svc",
        domain: "guardian",
        data: { actionId: data.actionId, decision: data.decision, hash },
        meta: { entityId: data.actionId },
      });

      const result = GuardianResolveResultSchema.parse({
        ok: true,
        actionId: data.actionId,
        decision: data.decision,
        sealed: true,
        hash,
      });

      return { ...result, prevHash: prev?.hash ?? null, entryId: id, timestamp };
    });
  });
