/* ================================================================== */
/* DB — Adaptador de persistencia (opcional)                          */
/* ================================================================== */
/* El core TAMV corre en un runtime edge sin cliente SQL embebido.     */
/* La cadena BookPI vive en el índice en memoria del servidor y este   */
/* módulo expone únicamente el estado de la persistencia externa.      */
/* ================================================================== */

export function getDbUrl(): string | null {
  return process.env["DATABASE_URL"] ?? null;
}

export function hasDatabase(): boolean {
  return Boolean(getDbUrl());
}

export type PersistenceMode = "memoria-encadenada" | "postgres-externo";

export function persistenceMode(): PersistenceMode {
  return hasDatabase() ? "postgres-externo" : "memoria-encadenada";
}
