import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { SiteChrome, SectionHeading } from "@/components/tamv/SiteChrome";
import {
  API_CATALOG,
  API_CATALOG_NOTES,
  API_CATALOG_SCHEMA,
  API_CATALOG_STATUS,
  API_CATALOG_VERSION,
  API_DOMAINS,
  API_READINESS_CHECKLIST,
  API_ROADMAP,
  API_SECURITY_BASELINE,
  catalogStats,
  domainOf,
  type ApiCatalogEntry,
} from "@/lib/api-catalog";

const TITLE = "Catálogo de APIs · Isabella Villaseñor AI (contrato /v1)";
const DESC =
  "Catálogo contractual versionado de 720 endpoints en 12 dominios —identity, CROWN, heads, memory, evidence, PRAXIS, BookPI, topology, quantum, PQC, billing y ops— con su orden de implementación y línea base de seguridad.";

export const Route = createFileRoute("/apis")({
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
  component: ApisPage,
});

const METHODS = ["GET", "POST", "PATCH", "DELETE"] as const;

const METHOD_TONE: Record<string, string> = {
  GET: "border-teal-400/40 text-teal-200",
  POST: "border-primary/50 text-primary",
  PATCH: "border-amber-400/40 text-amber-200",
  DELETE: "border-rose-400/40 text-rose-200",
};

function ApisPage() {
  const stats = catalogStats();
  const [domain, setDomain] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(40);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return API_CATALOG.filter((e: ApiCatalogEntry) => {
      if (domain && domainOf(e) !== domain) return false;
      if (method && e.method !== method) return false;
      if (needle && !`${e.id} ${e.path}`.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [domain, method, q]);

  const visible = filtered.slice(0, limit);

  return (
    <SiteChrome>
      <section className="mx-auto max-w-7xl px-6 pt-16">
        <SectionHeading
          eyebrow="Superficie contractual · /v1"
          title="Catálogo de APIs de Isabella Villaseñor AI"
          lead="Un contrato versionado, no una promesa cumplida. Estas 720 entradas describen la superficie que el territorio necesita; ninguna se considera implementada por aparecer aquí."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Entradas", String(stats.total)],
            ["Dominios", String(stats.domains)],
            ["Mutaciones", String(stats.mutations)],
            ["Con auditoría", String(stats.audited)],
            ["Idempotentes", String(stats.idempotent)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border/60 bg-secondary/20 p-5">
              <p className="label-canon">{label}</p>
              <p className="mt-2 font-display text-3xl text-gold">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-5">
          <p className="label-canon">Advertencia canónica</p>
          <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
            {API_CATALOG_NOTES.map((n) => (
              <li key={n}>· {n}</li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {API_CATALOG_SCHEMA} · v{API_CATALOG_VERSION} · estado: {API_CATALOG_STATUS}
          </p>
        </div>
      </section>

      {/* Dominios */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <SectionHeading
          eyebrow="12 dominios"
          title="Qué gobierna cada dominio"
          lead="Cada dominio expone las mismas seis operaciones: listar, consultar por ID, crear, ejecutar acciones, actualizar y eliminar."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {API_DOMAINS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setDomain(d.key);
                setLimit(40);
              }}
              className="rounded-2xl border border-border/60 bg-secondary/15 p-6 text-left transition-colors hover:border-primary/40 hover:bg-secondary/30"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-2xl text-gold">{d.label}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {API_CATALOG.filter((e) => domainOf(e) === d.key).length} rutas
                </span>
              </div>
              <p className="mt-1 label-canon">{d.subsystem}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.purpose}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Explorador */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <SectionHeading
          eyebrow="Explorador"
          title="Recorre el contrato ruta por ruta"
          lead="Filtra por dominio, método o texto libre. Cada fila declara autenticación, idempotencia, auditoría y estado."
        />

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setDomain("");
              setLimit(40);
            }}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              domain === "" ? "border-primary/60 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            Todos
          </button>
          {API_DOMAINS.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => {
                setDomain(d.key);
                setLimit(40);
              }}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                domain === d.key ? "border-primary/60 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMethod("")}
            className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
              method === "" ? "border-primary/60 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            ALL
          </button>
          {METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                method === m ? METHOD_TONE[m] : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setLimit(40);
            }}
            placeholder="Buscar por id o path…"
            className="ml-auto w-full max-w-xs rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm outline-none focus:border-primary/50 sm:w-64"
          />
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {filtered.length} entrada{filtered.length === 1 ? "" : "s"} coinciden.
        </p>

        <div className="mt-4 overflow-hidden rounded-2xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/30 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-normal">Método</th>
                <th className="px-4 py-3 font-normal">Path</th>
                <th className="hidden px-4 py-3 font-normal md:table-cell">ID</th>
                <th className="hidden px-4 py-3 font-normal lg:table-cell">Auth</th>
                <th className="px-4 py-3 font-normal">Flags</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr key={e.id} className="border-t border-border/40 align-top">
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-1 font-mono text-[11px] ${METHOD_TONE[e.method]}`}>
                      {e.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{e.path}</td>
                  <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground md:table-cell">{e.id}</td>
                  <td className="hidden px-4 py-3 font-mono text-[11px] text-muted-foreground lg:table-cell">{e.auth}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5 font-mono text-[10px] uppercase text-muted-foreground">
                      {e.idempotency ? <span className="rounded border border-border/60 px-1.5 py-0.5">idem</span> : null}
                      {e.audit ? <span className="rounded border border-border/60 px-1.5 py-0.5">audit</span> : null}
                      <span className="rounded border border-amber-400/30 px-1.5 py-0.5 text-amber-200/80">{e.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                    Ninguna entrada coincide con ese filtro.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {limit < filtered.length ? (
          <button
            type="button"
            onClick={() => setLimit((l) => l + 60)}
            className="mt-6 rounded-full border border-primary/40 px-6 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
          >
            Mostrar 60 más ({filtered.length - limit} restantes)
          </button>
        ) : null}
      </section>

      {/* Roadmap */}
      <section className="mx-auto max-w-7xl px-6 pt-20">
        <SectionHeading
          eyebrow="Secuencia de ejecución"
          title="Orden de implementación recomendado"
          lead="El orden no es preferencia estética: cada paso construye la garantía que el siguiente necesita."
        />
        <ol className="mt-8 space-y-3">
          {API_ROADMAP.map((s) => (
            <li key={s.step} className="flex gap-5 rounded-2xl border border-border/60 bg-secondary/15 p-5">
              <span className="font-display text-3xl text-gold">{String(s.step).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-xl">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.note}</p>
                {s.domains.length > 0 ? (
                  <p className="mt-2 font-mono text-[11px] text-muted-foreground">
                    {s.domains.map((d) => `${API_CATALOG.filter((e) => domainOf(e) === d).length} rutas · ${d}`).join("   |   ")}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Requisitos y seguridad */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-secondary/15 p-7">
            <p className="label-canon">De contrato a producción</p>
            <h3 className="mt-3 font-display text-3xl">Checklist por endpoint</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Una entrada solo abandona el estado <span className="font-mono">contract</span> cuando cumple los trece puntos.
            </p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {API_READINESS_CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/15 p-7">
            <p className="label-canon">Invariante transversal</p>
            <h3 className="mt-3 font-display text-3xl">Línea base de seguridad</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Aplica a las 720 entradas sin excepción, en cualquier dominio y federación.
            </p>
            <ul className="mt-5 space-y-2">
              {API_SECURITY_BASELINE.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
