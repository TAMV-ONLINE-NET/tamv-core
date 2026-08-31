/* ================================================================== */
/* API CATALOG — Metadatos de dominio, roadmap y requisitos           */
/* ================================================================== */
/* Capa de lectura sobre `src/data/api-catalog.ts`. No implementa     */
/* endpoints: describe el contrato, su orden de ejecución y lo que    */
/* falta para que una entrada pase de `contract` a producción.        */
/* ================================================================== */

import { API_CATALOG, type ApiCatalogEntry, type ApiMethod } from "@/data/api-catalog";

export type { ApiCatalogEntry, ApiMethod };
export {
  API_CATALOG,
  API_CATALOG_NOTES,
  API_CATALOG_SCHEMA,
  API_CATALOG_STATUS,
  API_CATALOG_VERSION,
} from "@/data/api-catalog";

export interface ApiDomainMeta {
  key: string;
  label: string;
  purpose: string;
  subsystem: string;
}

/** Dominios canónicos del catálogo (12), en orden de dependencia. */
export const API_DOMAINS: ApiDomainMeta[] = [
  {
    key: "identity",
    label: "Identity",
    purpose: "Sesiones, usuarios, tenants y scopes. Toda identidad se deriva del token validado, nunca del cliente.",
    subsystem: "CROWN · ARGUS",
  },
  {
    key: "crown",
    label: "CROWN",
    purpose: "Gobernanza soberana: políticas, ratificaciones, invariantes del KEC y decisiones de última instancia.",
    subsystem: "CROWN",
  },
  {
    key: "heads",
    label: "Heads",
    purpose: "Cabezas cognitivas (Alpha/Beta) e hipermódulos especializados que resuelven intención por dominio.",
    subsystem: "ISA · SOPHIA",
  },
  {
    key: "memory",
    label: "Memory",
    purpose: "Memoria viva de Isabella: episódica, semántica y vectorial, con derecho al olvido auditable.",
    subsystem: "SOPHIA",
  },
  {
    key: "evidence",
    label: "Evidence",
    purpose: "Custodia de evidencia: adjuntos, firmas, cadena de custodia y verificación independiente.",
    subsystem: "ARGUS",
  },
  {
    key: "praxis",
    label: "PRAXIS",
    purpose: "Sandbox de ejecución acotada: simular una acción antes de que toque el territorio real.",
    subsystem: "ORION",
  },
  {
    key: "bookpi",
    label: "BookPI",
    purpose: "Registro encadenado SHA-256: escritura sellada, consulta pública y verificación de integridad.",
    subsystem: "BookPI™",
  },
  {
    key: "topology",
    label: "Topology",
    purpose: "Nodos, federaciones y CITEMESH: cómo se conectan territorios sin centralizar autoridad.",
    subsystem: "ORION",
  },
  {
    key: "quantum",
    label: "Quantum",
    purpose: "Laboratorio cuántico: experimentos, jobs y resultados reproducibles, aislados del núcleo productivo.",
    subsystem: "Laboratorio",
  },
  {
    key: "pqc",
    label: "PQC",
    purpose: "Criptografía post-cuántica: perfiles, rotación de llaves y migración de sellos existentes.",
    subsystem: "ARGUS",
  },
  {
    key: "billing",
    label: "Billing",
    purpose: "Economía operativa: planes, consumo y liquidaciones que alimentan el FRI 20/30/50.",
    subsystem: "Economía TAMV",
  },
  {
    key: "ops",
    label: "Ops",
    purpose: "Salud, SLO, runbooks y observabilidad del núcleo. El estado del sistema es información pública.",
    subsystem: "ARGUS",
  },
];

/** Orden de implementación recomendado (no negociable en su secuencia). */
export const API_ROADMAP: { step: number; title: string; domains: string[]; note: string }[] = [
  { step: 1, title: "Identity + health", domains: ["identity", "ops"], note: "Sin identidad validada y sin health no hay superficie segura sobre la que construir." },
  { step: 2, title: "CROWN + BookPI", domains: ["crown", "bookpi"], note: "Gobernanza y sellado antes que funcionalidad: toda mutación posterior queda auditada desde el día uno." },
  { step: 3, title: "Memory + evidence", domains: ["memory", "evidence"], note: "Memoria y custodia de evidencia habilitan trazabilidad real de cada decisión." },
  { step: 4, title: "Heads y Alpha/Beta", domains: ["heads"], note: "Las cabezas cognitivas solo se activan cuando ya existe registro de lo que deciden." },
  { step: 5, title: "PRAXIS sandbox", domains: ["praxis"], note: "Ejecución acotada: simular impacto antes de permitir efectos en el territorio." },
  { step: 6, title: "Topology y CITEMESH", domains: ["topology"], note: "Federación de nodos una vez que un nodo aislado ya es confiable." },
  { step: 7, title: "PQC", domains: ["pqc"], note: "Migración post-cuántica de sellos y llaves con cadena antigua todavía verificable." },
  { step: 8, title: "Quantum laboratory", domains: ["quantum"], note: "Laboratorio experimental, siempre fuera del camino crítico." },
  { step: 9, title: "Billing", domains: ["billing"], note: "Monetización al final: la economía se conecta a un núcleo ya auditable." },
  { step: 10, title: "SDKs y conformance tests", domains: [], note: "Generación de SDKs y pruebas de conformidad contra el contrato versionado." },
];

/** Lo que exige cada entrada antes de declararse implementada. */
export const API_READINESS_CHECKLIST: string[] = [
  "OpenAPI schema",
  "Request/response models",
  "Scopes",
  "RBAC/ABAC",
  "Rate limits",
  "Idempotency",
  "Error contracts",
  "Audit policy",
  "Tenant isolation",
  "Integration tests",
  "Owner técnico",
  "SLO",
  "Runbook",
];

/** Línea base de seguridad aplicable a todo `/v1`. */
export const API_SECURITY_BASELINE: string[] = [
  "Validación OIDC/JWKS del lado servidor",
  "Tenant derivado de la identidad validada, nunca del cliente",
  "Scopes de mínimo privilegio",
  "Idempotencia obligatoria en mutaciones",
  "Eventos de auditoría estructurados en mutaciones",
  "Rate limiting y payloads acotados",
  "Sin secretos ni PII cruda en logs",
  "Contrato versionado /v1 con política de deprecación",
];

export function domainOf(entry: ApiCatalogEntry): string {
  return entry.id.split(".")[0] ?? "otros";
}

export function catalogStats() {
  const total = API_CATALOG.length;
  const mutations = API_CATALOG.filter((e) => e.method !== "GET").length;
  const audited = API_CATALOG.filter((e) => e.audit).length;
  const idempotent = API_CATALOG.filter((e) => e.idempotency).length;
  return { total, mutations, audited, idempotent, domains: API_DOMAINS.length };
}

export function entriesByDomain(domain: string): ApiCatalogEntry[] {
  return API_CATALOG.filter((e) => domainOf(e) === domain);
}
