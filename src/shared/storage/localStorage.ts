function getBrowserStorage() {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function readLocalStorage<T>(key: string): T | undefined {
  const storage = getBrowserStorage();

  if (!storage) {
    return undefined;
  }

  try {
    const value = storage.getItem(key);

    return value ? (JSON.parse(value) as T) : undefined;
  } catch {
    return undefined;
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Callers retain their in-memory state when browser storage is unavailable.
  }
}

export function removeLocalStorage(key: string) {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

export function clearLocalStorage() {
  const storage = getBrowserStorage();

  if (!storage) {
    return;
  }

  try {
    storage.clear();
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}
