const STORAGE_PREFIX = 'kidoschool_'

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
}

export function removeItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

export function clear(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
  keys.forEach(k => localStorage.removeItem(k))
}
