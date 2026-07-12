// Safe wrappers around localStorage that never crash, even when opened
// from file:// / content:// contexts where storage may be disabled.

const isStorageAvailable = () => {
  if (typeof window === "undefined") return false
  try {
    const test = "__kads_storage_test__"
    window.localStorage.setItem(test, test)
    window.localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

export const safeStorage = {
  getItem(key: string): string | null {
    if (!isStorageAvailable()) return null
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem(key: string, value: string): boolean {
    if (!isStorageAvailable()) return false
    try {
      window.localStorage.setItem(key, value)
      return true
    } catch {
      return false
    }
  },
  removeItem(key: string): boolean {
    if (!isStorageAvailable()) return false
    try {
      window.localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}
