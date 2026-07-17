// Keyed by the version being migrated FROM. Each migration returns the
// state shape for (version + 1). Empty for now — the app has only ever
// shipped schema version 1 — but the seam exists so future shape changes
// don't require a hand rolled one-off migration path.
export const migrations: Record<number, (old: unknown) => unknown> = {}
