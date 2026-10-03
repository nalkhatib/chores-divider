import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppData } from './types';
import { PRESET_CHORES } from './data/presets';
import { store } from './lib/storage';
import { PinDialog } from './components/PinDialog';

const initialData = (): AppData => ({
  version: 1,
  setupDone: false,
  pin: '',
  members: [],
  chores: PRESET_CHORES.map((c) => ({ ...c })),
  plan: null,
});

interface AppCtx {
  data: AppData;
  update: (fn: (d: AppData) => AppData) => void;
  unlocked: boolean;
  lock: () => void;
  unlock: () => void;
  /** Runs `then` right away if a parent is unlocked, otherwise after the PIN is entered. */
  requireParent: (then: () => void) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => store.load() ?? initialData());
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState<(() => void) | null>(null);

  useEffect(() => store.save(data), [data]);

  const update = useCallback((fn: (d: AppData) => AppData) => setData(fn), []);
  const requireParent = useCallback(
    (then: () => void) => (unlocked ? then() : setPending(() => then)),
    [unlocked],
  );

  const value = useMemo<AppCtx>(
    () => ({
      data,
      update,
      unlocked,
      lock: () => setUnlocked(false),
      unlock: () => setUnlocked(true),
      requireParent,
    }),
    [data, update, unlocked, requireParent],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      {pending && (
        <PinDialog
          pin={data.pin}
          onCancel={() => setPending(null)}
          onSuccess={() => {
            setUnlocked(true);
            const then = pending;
            setPending(null);
            then();
          }}
        />
      )}
    </Ctx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
