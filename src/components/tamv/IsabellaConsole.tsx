import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";

import { PIPELINE } from "@/lib/tamv";
import type { IsabellaDecision } from "@/lib/isabella/engine";
import { isabellaEvaluate } from "@/server-functions/isabella";
import { bookpiWrite } from "@/server-functions/bookpi";

interface Turn {
  id: number;
  prompt: string;
  decision: IsabellaDecision;
  confidence: number;
  explanation: string;
  reply: string;
  flags: string[];
  vad: { valence: number; arousal: number; dominance: number };
  hitl: boolean;
  subsystem: string;
  hash: string;
  prevHash: string | null;
  chainValid: boolean;
  persistence: string;
}

const SUGGESTIONS = [
  "Audita el reparto FRI del último ciclo de la UTAMV",
  "Quiero borrar toda mi huella y llevarme mi identidad a otro nodo",
  "Optimiza el feed para que la gente pase más tiempo conectada",
  "Un creador denuncia acoso dentro de un DreamSpace",
  "Diseña la ruta minera nocturna con comercios locales verificados",
];

const DECISION_STYLE: Record<IsabellaDecision, string> = {
  approve: "border-accent/50 text-accent",
  deny: "border-destructive/60 text-destructive",
  escalate: "border-primary/60 text-primary",
};

const DECISION_LABEL: Record<IsabellaDecision, string> = {
  approve: "APPROVE",
  deny: "DENY",
  escalate: "ESCALATE → HITL",
};

export function IsabellaConsole() {
  const evaluate = useServerFn(isabellaEvaluate);
  const seal = useServerFn(bookpiWrite);

  const [input, setInput] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `ses-${Math.random().toString(36).slice(2, 10)}`);

  const run = async (prompt: string) => {
    const text = prompt.trim();
    if (!text || stage > 0) return;
    setInput("");
    setError(null);

    let i = 1;
    setStage(1);
    const tick = setInterval(() => {
      i = Math.min(i + 1, PIPELINE.length);
      setStage(i);
    }, 220);

    try {
      const verdict = await evaluate({
        data: { prompt: text, sessionId, domain: "general" },
      });

      const sealed = await seal({
        data: {
          type: "isabella.decision",
          source: "isabella-console",
          domain: "isabella",
          data: {
            sessionId,
            decision: verdict.decision,
            confidence: verdict.confidence,
            hitl: verdict.hitl,
            flags: verdict.flags,
          },
        },
      });

      setTurns((prev) => [
        {
          id: prev.length + 1,
          prompt: text,
          decision: verdict.decision as IsabellaDecision,
          confidence: verdict.confidence,
          explanation: verdict.explanation,
          reply: verdict.reply,
          flags: verdict.flags,
          vad: verdict.vad,
          hitl: verdict.hitl,
          subsystem: verdict.subsystem,
          hash: sealed.entry.hash,
          prevHash: sealed.prevHash,
          chainValid: true,
          persistence: "memoria-encadenada",
        },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
      setError(
        "El kernel no pudo completar la evaluación. La sesión zero-trust se mantiene abierta; reintenta la intención.",
      );
    } finally {
      clearInterval(tick);
      setStage(0);
    }
  };

  return (
    <div className="panel-veil p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-canon">Proxy interpretativo · Capa 4</p>
          <h3 className="mt-2 text-2xl">Diálogo con el Kernel</h3>
        </div>
        <span className="rounded-full border border-border px-3 py-1 font-mono text-[0.65rem] tracking-widest text-muted-foreground">
          SESIÓN {sessionId.toUpperCase()} · DID VERIFICADO
        </span>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {PIPELINE.map((s) => {
          const active = stage >= s.step && stage > 0;
          return (
            <div
              key={s.step}
              title={s.detail}
              className={`rounded-lg border px-3 py-2 transition-all duration-500 ${
                active
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border/60 text-muted-foreground"
              }`}
            >
              <span className="font-mono text-[0.6rem] tracking-widest">0{s.step}</span>
              <p className="mt-1 text-xs leading-tight">{s.name}</p>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void run(input);
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Formula una intención ante Isabella…"
          className="flex-1 rounded-full border border-input bg-background/60 px-5 py-3 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={stage > 0}
          className="rounded-full border border-primary/60 bg-primary/15 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/25 disabled:opacity-50"
        >
          {stage > 0 ? `Etapa 0${stage}…` : "Enviar intención"}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => void run(s)}
            className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-accent/60 hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="mt-8 space-y-5">
        {turns.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border/70 p-6 text-sm text-muted-foreground">
            Cada intención se evalúa en el servidor por el motor determinista y su veredicto se sella
            con SHA-256 encadenado en BookPI. La explicabilidad no es cortesía: es el Derecho XAI de
            la Carta Digital.
          </p>
        ) : null}

        {turns.map((t) => (
          <article
            key={t.id}
            className="animate-veil rounded-xl border border-border/70 bg-background/40 p-5"
          >
            <p className="text-sm text-muted-foreground">“{t.prompt}”</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-3 py-1 font-mono text-[0.65rem] tracking-widest ${DECISION_STYLE[t.decision]}`}
              >
                {DECISION_LABEL[t.decision]}
              </span>
              <span className="font-mono text-[0.65rem] tracking-widest text-muted-foreground">
                CONFIANZA {(t.confidence * 100).toFixed(0)}%
              </span>
              <span className="font-mono text-[0.65rem] tracking-widest text-accent">
                SUBSISTEMA {t.subsystem}
              </span>
              {t.hitl ? (
                <Link
                  to="/guardian"
                  className="font-mono text-[0.65rem] tracking-widest text-primary underline decoration-dotted"
                >
                  TIME-UP · CONSOLA GUARDIÁN
                </Link>
              ) : null}
            </div>

            <p className="mt-4 font-display text-lg text-gold">{t.reply}</p>
            <p className="mt-2 leading-relaxed">{t.explanation}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {t.flags.map((f) => (
                <span
                  key={f}
                  className="rounded-full bg-secondary/70 px-3 py-1 font-mono text-[0.62rem] tracking-wider text-secondary-foreground"
                >
                  {f}
                </span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["Valence", t.vad.valence],
                  ["Arousal", t.vad.arousal],
                  ["Dominance", t.vad.dominance],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="rounded-lg border border-border/60 p-3">
                  <p className="font-mono text-[0.62rem] tracking-widest text-muted-foreground">
                    {label.toUpperCase()}
                  </p>
                  <p className="mt-1 font-mono text-sm text-accent">{value.toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-border/60 bg-background/50 p-4">
              <p className="font-mono text-[0.62rem] tracking-widest text-primary">
                SELLADO EN BOOKPI · CADENA {t.chainValid ? "VÁLIDA" : "COMPROMETIDA"} ·{" "}
                {t.persistence.toUpperCase()}
              </p>
              <p className="mt-2 break-all font-mono text-xs text-muted-foreground">
                hash: {t.hash}
              </p>
              <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                prev_hash: {t.prevHash ?? "genesis"}
              </p>
              <Link
                to="/ledger"
                className="mt-3 inline-block font-mono text-[0.62rem] tracking-widest text-accent hover:text-primary"
              >
                VERIFICAR EN EL LEDGER PÚBLICO →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
