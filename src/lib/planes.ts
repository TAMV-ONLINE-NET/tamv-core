/* ================================================================== */
/* PLANOS — Arquitectura de navegación unificada de Isabella          */
/* ================================================================== */

export interface PlaneLink {
  to: string;
  label: string;
  detail: string;
}

export interface Plane {
  order: number;
  key: string;
  label: string;
  tagline: string;
  icon: string;
  links: PlaneLink[];
}

export const PLANES: Plane[] = [
  {
    order: 1,
    key: "isabella",
    label: "Isabella",
    tagline: "Plano principal · consola cognitiva",
    icon: "sparkles",
    links: [
      { to: "/", label: "Umbral", detail: "Puerta de entrada al territorio" },
      { to: "/isabella", label: "Consola Isabella", detail: "Diálogo, razonamiento y sellado en vivo" },
      { to: "/guardian", label: "Consola Guardián", detail: "Human-in-the-loop y ratificación" },
    ],
  },
  {
    order: 2,
    key: "sistema",
    label: "Sistema",
    tagline: "Plano secundario · APIs, skills, funciones y ajustes",
    icon: "cpu",
    links: [
      { to: "/apis", label: "Catálogo de APIs", detail: "720 contratos en 12 dominios" },
      { to: "/skills", label: "Skills y funciones", detail: "Capacidades activas del kernel" },
      { to: "/arquitectura", label: "Arquitectura", detail: "Capas L0–L7 y motor AST" },
      { to: "/ledger", label: "BookPI Ledger", detail: "Cadena SHA-256 auditable" },
    ],
  },
  {
    order: 3,
    key: "monetizacion",
    label: "Monetización",
    tagline: "Tercer plano · FRI, ingresos y derivados",
    icon: "coins",
    links: [
      { to: "/economia", label: "Economía FRI", detail: "Simulador 20/30/50 y Fondo Fénix" },
      { to: "/monetizacion", label: "Fuentes y derivados", detail: "22 flujos, licencias y regalías" },
    ],
  },
  {
    order: 4,
    key: "legal",
    label: "Documentación",
    tagline: "Cuarto plano · canon, licencias y blindaje",
    icon: "scroll",
    links: [
      { to: "/documentacion", label: "Canon y licenciamiento", detail: "Sellos, marcos y derechos digitales" },
    ],
  },
  {
    order: 5,
    key: "tamv",
    label: "TAMV Online",
    tagline: "Quinto plano · territorio federado",
    icon: "globe",
    links: [{ to: "/tamv", label: "TAMV Online", detail: "Nodos, federación y estados AST" }],
  },
  {
    order: 6,
    key: "proyectos",
    label: "Proyectos",
    tagline: "Sexto plano · derivados del territorio",
    icon: "layers",
    links: [{ to: "/proyectos", label: "Proyectos TAMV", detail: "Hipermódulos, pilotos y roadmap" }],
  },
];

export const ALL_PLANE_LINKS = PLANES.flatMap((p) => p.links);
