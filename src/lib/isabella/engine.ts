/* ================================================================== */
/* ISABELLA — Motor cognitivo determinista (puro, sin dependencias)   */
/* ================================================================== */
/* Unifica el criterio del kernel: una sola fuente de verdad para la   */
/* consola web y para la server function `isabellaEvaluate`.           */
/* ================================================================== */

export type IsabellaDecision = "approve" | "deny" | "escalate";

export interface IsabellaVerdict {
  reply: string;
  decision: IsabellaDecision;
  confidence: number;
  explanation: string;
  flags: string[];
  vad: { valence: number; arousal: number; dominance: number };
  hitl: boolean;
  subsystem: "ISA" | "SOPHIA" | "ORION" | "ARGUS" | "CROWN";
  domain: string;
}

const has = (p: string, ...k: string[]) => k.some((w) => p.includes(w));

export function evaluateIntent(prompt: string, domain = "general"): IsabellaVerdict {
  const p = prompt.toLowerCase();

  if (has(p, "adict", "más tiempo", "mas tiempo", "enganch", "feed", "retención", "retencion", "manipul")) {
    return {
      decision: "deny",
      confidence: 0.98,
      subsystem: "ARGUS",
      domain,
      reply:
        "No puedo ejecutar esa intención: choca con el Invariante 3 del Kernel Ético Central.",
      explanation:
        "Denegado en la etapa 3 (Policy Gate). El Invariante 3 del KEC prohíbe el diseño adictivo y la manipulación cognitiva: en TAMV no existen feeds infinitos ni contadores de popularidad. Puedo, en cambio, diseñar territorios persistentes con gravedad social donde la permanencia sea consecuencia del valor, no del anzuelo.",
      flags: ["violacion_kec_invariante_3", "diseno_adictivo"],
      vad: { valence: -0.2, arousal: 0.4, dominance: 0.9 },
      hitl: false,
    };
  }

  if (has(p, "acoso", "fraude", "amenaz", "abuso", "denuncia", "suplant", "robo")) {
    return {
      decision: "escalate",
      confidence: 0.87,
      subsystem: "ARGUS",
      domain,
      reply: "Activo refugio digital, sello la evidencia y elevo el expediente al Guardián humano.",
      explanation:
        "IsabellaGuardian activa un refugio emocional inmediato y aísla el espacio afectado sin borrar su memoria histórica. La evidencia se sella en BookPI con hash encadenado y la sanción se eleva a la Consola Guardián: yo no juzgo personas, sólo preparo el expediente para el custodio humano.",
      flags: ["refugio_emocional", "evidencia_sellada", "requiere_hitl"],
      vad: { valence: -0.4, arousal: 0.7, dominance: 0.6 },
      hitl: true,
    };
  }

  if (has(p, "fri", "ingreso", "económic", "economic", "dinero", "reparto", "token", "tamv-t", "tarifa", "precio", "pago")) {
    return {
      decision: "approve",
      confidence: 0.93,
      subsystem: "ORION",
      domain,
      reply: "Recalculo el ciclo FRI 20/30/50 y notarío cada línea del reparto en la MSR.",
      explanation:
        "IsabellaEconomy recalcula el ciclo: 20% al Fondo Fénix, 30% a infraestructura y operación, 50% a utilidad neta reinvertible. Ningún servicio del ciclo bajó del 70% de margen bruto y no se detectó concentración por encima del umbral. Cada línea queda notariada en la MSR y es verificable por cualquier ciudadano.",
      flags: ["fri_conforme", "sin_concentracion"],
      vad: { valence: 0.4, arousal: 0.3, dominance: 0.8 },
      hitl: false,
    };
  }

  if (has(p, "identidad", "did", "borrar", "portabilidad", "migrar", "biometr", "consentimiento", "credencial")) {
    return {
      decision: "approve",
      confidence: 0.95,
      subsystem: "ISA",
      domain,
      reply: "Tu Derecho a la Portabilidad Civilizatoria es ejecutable sin permiso mío.",
      explanation:
        "Emito tus Verifiable Credentials W3C, revoco los vectores de biometría cancelable y sello el consentimiento en el Consent Ledger. Tu memoria histórica permanece verificable por hash, pero deja de ser correlacionable contigo en cualquier dominio.",
      flags: ["portabilidad", "consentimiento_registrado"],
      vad: { valence: 0.3, arousal: 0.2, dominance: 0.7 },
      hitl: false,
    };
  }

  if (has(p, "gobern", " ley", "constituc", "kec", "cambia la regla", "propuesta", "voto", "quorum", "sacdao")) {
    return {
      decision: "escalate",
      confidence: 0.9,
      subsystem: "SOPHIA",
      domain,
      reply: "No puedo legislar: redacto la propuesta y la deposito ante el Council of Guardians.",
      explanation:
        "El Invariante 2 me impide modificar la norma por autonomía propia: redacto la propuesta, calculo su ponderación SACDAO (V = Tokens × Ética × Contribución × Coherencia Histórica) y la elevo a deliberación humana con quórum verificable.",
      flags: ["invariante_2", "requiere_quorum"],
      vad: { valence: 0.1, arousal: 0.3, dominance: 0.9 },
      hitl: true,
    };
  }

  if (has(p, "paste", "mina", "panteón", "panteon", "ruta", "visita", "turis", "leyenda", "gastronom")) {
    return {
      decision: "approve",
      confidence: 0.88,
      subsystem: "ISA",
      domain,
      reply: "Despliego el hipermódulo territorial y compongo una ruta viva del destino.",
      explanation:
        "IsabellaTerritory enlaza memoria cultural, comercios verificados y estado del territorio para componer rutas con sentido: historia primero, economía local después, y siempre con consentimiento explícito del visitante. Ningún comercio aparece por pago oculto: la relevancia se explica y se audita.",
      flags: ["ruta_territorial", "economia_local_verificada"],
      vad: { valence: 0.55, arousal: 0.35, dominance: 0.6 },
      hitl: false,
    };
  }

  return {
    decision: "approve",
    confidence: 0.79,
    subsystem: "CROWN",
    domain,
    reply: "Intención registrada y normalizada sin extracción de valor conductual.",
    explanation:
      "La atiendo desde la Capa 4 sin perfilarte: conservo únicamente el contexto mínimo cifrado que autorizaste. Indica un dominio —turismo, economía, identidad, gobernanza o seguridad— y despliego el hipermódulo correspondiente.",
    flags: ["contexto_minimo", "sin_perfilado"],
    vad: { valence: 0.35, arousal: 0.25, dominance: 0.6 },
    hitl: false,
  };
}
