export function readJSON<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return undefined
    return JSON.parse(raw) as T
  } catch (error) {
    console.warn(`[storage] failed to read "${key}"`, error)
    return undefined
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn(`[storage] failed to write "${key}"`, error)
  }
}
