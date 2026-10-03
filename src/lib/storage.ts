import type { AppData } from '../types';

/**
 * Everything the app persists goes through this interface.
 * To add syncing later (Firebase, Supabase, …), implement it and swap `store`.
 */
export interface DataStore {
  load(): AppData | null;
  save(data: AppData): void;
  clear(): void;
}

const KEY = 'chores-divider:v1';

export const localStore: DataStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw) as AppData;
      return data?.version === 1 ? data : null;
    } catch {
      return null;
    }
  },
  save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      // Storage full or blocked (private mode): the app keeps working in memory.
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Nothing saved to clear.
    }
  },
};

export const store: DataStore = localStore;
