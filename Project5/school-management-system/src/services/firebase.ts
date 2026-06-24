/*
 * firebase.ts - localStorage-based data persistence wrapper.
 * Simulates Firebase CRUD operations using the browser's localStorage,
 * scoped under a shared prefix to avoid key collisions.
 */

/** Namespace prefix for all stored keys */
const STORAGE_PREFIX = 'kidoschool_'

/**
 * Retrieves and parses a stored value by key.
 * @returns The parsed value, or null if not found / parse fails.
 */
export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

/**
 * Serializes and stores a value under the given key.
 */
export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
}

/**
 * Removes a single item from storage.
 */
export function removeItem(key: string): void {
  localStorage.removeItem(STORAGE_PREFIX + key)
}

/**
 * Clears all items that were created with the app's storage prefix.
 */
export function clear(): void {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX))
  keys.forEach(k => localStorage.removeItem(k))
}
