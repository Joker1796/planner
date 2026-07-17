// Keyed by the version being migrated FROM. Each migration returns the
// state shape for (version + 1).
export const migrations: Record<number, (old: unknown) => unknown> = {
  1: (old) => {
    const state = old as Record<string, unknown>
    return {
      ...state,
      version: 2,
      familyMembers: [],
    }
  },
  2: (old) => {
    const state = old as Record<string, unknown>
    return {
      ...state,
      version: 3,
      listItems: [],
    }
  },
  3: (old) => {
    const state = old as Record<string, unknown>
    return {
      ...state,
      version: 4,
      budgetGoals: [],
      budgetTransactions: [],
    }
  },
}
