/* ================================================================== */
/* SERVER FN — BookPI: escritura y consulta del registro encadenado   */
/* ================================================================== */
/* Solo el cuerpo de los handlers corre en servidor: las dependencias  */
/* con node:crypto / node:async_hooks se importan dentro del handler.  */
/* ================================================================== */

import { createServerFn } from "@tanstack/react-start";
import { BookPIWriteRequestSchema, BookPIQuerySchema } from "../lib/contracts";

export const bookpiWrite = createServerFn({ method: "POST" })
  .inputValidator(BookPIWriteRequestSchema)
  .handler(async ({ data }) => {
    const { lastEntry, appendEntry } = await import("../lib/bookpi");
    const { sealWrite } = await import("../lib/bookpi/registry");
    const { publishEvent, runWithTrace } = await import("../lib/events");

    return runWithTrace({}, () => {
      const prev = lastEntry();
      const entry = sealWrite({ ...data, prevHash: prev?.hash ?? null });
      appendEntry(entry);

      publishEvent({
        type: "bookpi.write",
        source: "isabella-core",
        domain: "bookpi",
        data: { id: entry.id, domain: entry.domain },
        meta: { entityId: entry.id },
      });

      return { ok: true as const, entry, prevHash: entry.prevHash };
    });
  });

export const bookpiQuery = createServerFn({ method: "GET" })
  .inputValidator(BookPIQuerySchema)
  .handler(async ({ data }) => {
    const { listEntries } = await import("../lib/bookpi");
    const { verifyChain } = await import("../lib/bookpi/registry");
    const { persistenceMode } = await import("../lib/db");

    const entries = listEntries(data.limit, data.domain);
    return {
      ok: true as const,
      count: entries.length,
      chainValid: verifyChain([...entries].reverse()),
      persistence: persistenceMode(),
      entries,
    };
  });
