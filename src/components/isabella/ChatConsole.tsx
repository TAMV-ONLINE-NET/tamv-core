import { useMemo, useRef, useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  Brain,
  ChevronDown,
  Loader2,
  Plus,
  ShieldCheck,
  Square,
  Wrench,
} from "lucide-react";
import { ISABELLA_MODES } from "@/lib/isabella/persona";
import { cn } from "@/lib/utils";

interface Thread {
  id: string;
  title: string;
}

const SUGGESTIONS = [
  {
    title: "Diseña una ruta viva",
    prompt:
      "Diseña una ruta nocturna minera en Real del Monte que conecte tres comercios verificados con la memoria cultural del territorio.",
  },
  {
    title: "Audita una intención",
    prompt:
      "Quiero un feed infinito con contador de likes para que la gente pase más tiempo en TAMV. Audítalo contra el KEC.",
  },
  {
    title: "Recalcula el ciclo FRI",
    prompt:
      "Recalcula el ciclo FRI 20/30/50 sobre una utilidad bruta de 1,200,000 MXN y explica cada línea del reparto.",
  },
  {
    title: "Explora el catálogo",
    prompt: "¿Qué endpoints contractuales existen en el dominio pqc y qué falta para producción?",
  },
];

export function ChatConsole({ plane = "isabella" }: { plane?: string }) {
  const [mode, setMode] = useState("canon");
  const [modeOpen, setModeOpen] = useState(false);
  const [input, setInput] = useState("");
  const [threads, setThreads] = useState<Thread[]>([{ id: "t1", title: "Sesión canónica" }]);
  const [activeThread, setActiveThread] = useState("t1");
  const endRef = useRef<HTMLDivElement>(null);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({ mode, plane }),
      }),
    [mode, plane],
  );

  const { messages, sendMessage, status, stop, error, setMessages } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const activeMode = ISABELLA_MODES.find((m) => m.key === mode)!;

  function send(text: string) {
    const value = text.trim();
    if (!value || busy) return;
    if (messages.length === 0) {
      setThreads((t) =>
        t.map((x) => (x.id === activeThread ? { ...x, title: value.slice(0, 42) } : x)),
      );
    }
    void sendMessage({ text: value });
    setInput("");
  }

  function newThread() {
    const id = `t${Date.now()}`;
    setThreads((t) => [{ id, title: "Nueva deliberación" }, ...t]);
    setActiveThread(id);
    setMessages([]);
  }

  return (
    <div className="grid h-[calc(100vh-8.5rem)] grid-cols-1 lg:grid-cols-[260px_1fr]">
      {/* Hilos */}
      <aside className="hidden flex-col border-r border-border/60 bg-sidebar/40 lg:flex">
        <button
          onClick={newThread}
          className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/10"
        >
          <Plus className="size-4 text-primary" /> Nueva deliberación
        </button>
        <p className="label-canon px-5 pt-6 pb-2">Hilos</p>
        <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              className={cn(
                "block w-full truncate rounded-lg px-3 py-2 text-left text-sm transition-colors",
                t.id === activeThread
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50",
              )}
            >
              {t.title}
            </button>
          ))}
        </div>
        <div className="border-t border-border/60 px-5 py-4">
          <p className="label-canon">Kernel</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-accent" /> KEC · 4 invariantes activos
          </p>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">MD-X4 · Capa 4</p>
        </div>
      </aside>

      {/* Conversación */}
      <section className="flex min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <div className="mx-auto max-w-3xl space-y-8">
            {messages.length === 0 ? (
              <div className="pt-10">
                <h1 className="font-display text-4xl text-gold md:text-5xl">
                  ¿Qué deliberamos hoy?
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Cada intención atraviesa seis etapas antes de convertirse en acción. Puedo evaluar
                  el Kernel Ético, sellar en BookPI, leer el ledger y consultar los 720 contratos de
                  API del territorio.
                </p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => send(s.prompt)}
                      className="panel-veil p-4 text-left transition-colors hover:border-primary/50"
                    >
                      <p className="text-sm text-foreground">{s.title}</p>
                      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">
                        {s.prompt}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m) => (
              <article key={m.id} className={cn(m.role === "user" && "flex justify-end")}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-secondary px-4 py-3 text-sm leading-relaxed">
                    {m.parts.map((p, i) =>
                      p.type === "text" ? <span key={i}>{p.text}</span> : null,
                    )}
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <span className="relative mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-primary/40">
                      <span className="absolute inset-0 animate-breathe rounded-full bg-primary/20 blur-md" />
                      <span className="relative size-1.5 rounded-full bg-primary" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-3">
                      {m.parts.map((p, i) => {
                        if (p.type === "reasoning") {
                          return (
                            <details key={i} className="rounded-xl border border-border/60 p-3">
                              <summary className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                                <Brain className="size-3.5 text-accent" /> Deliberación interna
                              </summary>
                              <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                                {p.text}
                              </p>
                            </details>
                          );
                        }
                        if (p.type === "text") {
                          return (
                            <div
                              key={i}
                              className="prose-invert whitespace-pre-wrap text-[15px] leading-relaxed"
                            >
                              {p.text}
                            </div>
                          );
                        }
                        if (p.type.startsWith("tool-")) {
                          const name = p.type.replace("tool-", "");
                          return (
                            <div
                              key={i}
                              className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-[11px] text-accent"
                            >
                              <Wrench className="size-3.5" /> {name}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}
              </article>
            ))}

            {busy ? (
              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin text-primary" /> Isabella atraviesa el
                pipeline cognitivo…
              </p>
            ) : null}

            {error ? (
              <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
                {error.message || "El gateway no respondió. Intenta de nuevo."}
              </p>
            ) : null}
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 bg-background/70 px-5 py-4 backdrop-blur-xl">
          <div className="mx-auto max-w-3xl">
            <div className="panel-veil flex items-end gap-3 p-3">
              <div className="relative">
                <button
                  onClick={() => setModeOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {activeMode.label}
                  <ChevronDown className="size-3" />
                </button>
                {modeOpen ? (
                  <div className="absolute bottom-full left-0 z-30 mb-2 w-64 rounded-xl border border-border/60 bg-popover p-1.5 shadow-2xl">
                    {ISABELLA_MODES.map((m) => (
                      <button
                        key={m.key}
                        onClick={() => {
                          setMode(m.key);
                          setModeOpen(false);
                        }}
                        className={cn(
                          "block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary/60",
                          m.key === mode && "bg-secondary",
                        )}
                      >
                        <p className="text-sm">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.hint}</p>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Declara tu intención ante Isabella…"
                className="max-h-40 min-h-[2.5rem] flex-1 resize-none bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              {busy ? (
                <button
                  onClick={() => stop()}
                  className="grid size-9 place-items-center rounded-lg border border-border/60 text-muted-foreground hover:text-foreground"
                >
                  <Square className="size-3.5" />
                </button>
              ) : (
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim()}
                  className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-30"
                >
                  <ArrowUp className="size-4" />
                </button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Isabella delibera bajo el Kernel Ético Central. Toda decisión sensible se sella en
              BookPI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
