/**
 * localStorage persistence. No backend, no accounts, no tracking – all progress
 * lives on the child's own device. Reads are defensive: a corrupt or missing
 * value simply falls back to defaults so the app can never crash on boot.
 */
export const STORAGE_KEY = 'uhrenheld:v1';

export function loadState<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<T>;
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

export function saveState<T>(state: T): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be full or disabled (private mode) – progress just won't
    // persist, which is acceptable and must not break gameplay.
  }
}

/** Today's date as an ISO day string, used for the practice streak. */
export function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

/** Whether `b` is the calendar day right after `a` (both ISO day strings). */
export function isNextDay(a: string, b: string): boolean {
  const da = new Date(`${a}T00:00:00Z`).getTime();
  const db = new Date(`${b}T00:00:00Z`).getTime();
  return db - da === 24 * 60 * 60 * 1000;
}
