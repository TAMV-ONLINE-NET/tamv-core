import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { SiteChrome, SectionHeading } from "@/components/tamv/SiteChrome";
import { bookpiQuery } from "@/server-functions/bookpi";

const TITLE = "Ledger BookPI™ · Cadena pública verificable de Isabella Villaseñor AI";
const DESC =
  "Registro encadenado SHA-256 de cada decisión de Isabella y cada resolución del Guardián: hash, prev_hash, dominio y verificación pública de integridad de la cadena.";

export const Route = createFileRoute("/ledger")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LedgerPage,
});

interface Entry {
  id: string;
  type: string;
  source: string;
  domain: string;
  timestamp: string;
  hash: string;
  prevHash: string | null;
}

function LedgerPage() {
  const query = useServerFn(bookpiQuery);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [chainValid, setChainValid] = useState(true);
  const [persistence, setPersistence] = useState("memoria-encadenada");
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState<string>("");

  const load = useCallback(
    async (d: string) => {
      setLoading(true);
      try {
        const res = await query({ data: d ? { limit: 100, domain: d } : { limit: 100 } });
        setEntries(res.entries as Entry[]);
        setChainValid(res.chainValid);
        setPersistence(res.persistence);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [query],
  );

  useEffect(() => {
    void load(domain);
  }, [domain, load]);

  const FILTERS = [
    ["", "Toda la cadena"],
    ["isabella", "Isabella"],
    ["guardian", "Guardián"],
    ["bookpi", "BookPI"],
  ] as const;

  return (
    <SiteChrome>
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-10">
        <SectionHeading
          eyebrow="Capa 5 · BookPI™ Registry"
          title="La memoria no se promete: se verifica"
          lead="Cada decisión del kernel y cada resolución humana queda sellada con SHA-256 encadenado. Cualquiera puede recomputar la cadena y comprobar que nada fue reescrito."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <span
            className={`rounded-full border px-4 py-2 font-mono text-xs tracking-widest ${
              chainValid ? "border-accent/60 text-accent" : "border-destructive/60 text-destructive"
            }`}
          >
            {chainValid ? "CADENA ÍNTEGRA" : "CADENA COMPROMETIDA"}
          </span>
          <span className="rounded-full border border-border px-4 py-2 font-mono text-xs tracking-widest text-muted-foreground">
            {entries.length} ENTRADAS · {persistence.toUpperCase()}
          </span>
          <button
            type="button"
            onClick={() => void load(domain)}
            className="rounded-full border border-primary/60 bg-primary/10 px-4 py-2 font-mono text-xs tracking-widest text-primary transition hover:bg-primary/20"
          >
            RECOMPUTAR
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map(([value, label]) => (
            <button
              key={label}
              type="button"
              onClick={() => setDomain(value)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${
                domain === value
                  ? "border-accent/60 text-accent"
                  : "border-border/70 text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl border border-border/60 bg-secondary/30" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
            La cadena está en génesis. Formula una intención en la consola de Isabella o resuelve una
            acción en la Consola Guardián y su sello aparecerá aquí.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((e) => (
              <article key={e.hash} className="panel-veil p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs tracking-widest text-muted-foreground">
                    {e.id}
                  </span>
                  <span className="rounded-full border border-primary/50 px-3 py-1 font-mono text-[0.62rem] tracking-widest text-primary">
                    {e.type}
                  </span>
                  <span className="font-mono text-[0.62rem] tracking-widest text-accent">
                    {e.domain.toUpperCase()} · {e.source}
                  </span>
                  <span className="font-mono text-[0.62rem] tracking-widest text-muted-foreground">
                    {new Date(e.timestamp).toLocaleString("es-MX")}
                  </span>
                </div>
                <p className="mt-3 break-all font-mono text-xs text-muted-foreground">
                  hash: {e.hash}
                </p>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                  prev_hash: {e.prevHash ?? "genesis"}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </SiteChrome>
  );
}
