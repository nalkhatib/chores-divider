import { useState } from 'react';
import { useApp } from '../state';
import { ChoreForm } from '../components/ChoreForm';
import { ChoreList } from '../components/ChoreList';
import { Modal } from '../components/Modal';
import { timesPerWeek } from '../data/presets';
import type { AppData, Chore } from '../types';

export const toggleChore = (id: string) => (d: AppData): AppData => ({
  ...d,
  chores: d.chores.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)),
});

export function weeklyPoints(chores: Chore[]) {
  return chores.filter((c) => c.enabled).reduce((s, c) => s + c.points * timesPerWeek(c.frequency), 0);
}

export function ChoreMenu() {
  const { data, update } = useApp();
  const [editing, setEditing] = useState<Chore | 'new' | null>(null);
  const on = data.chores.filter((c) => c.enabled);
  const perPerson = data.members.length ? Math.round(weeklyPoints(data.chores) / data.members.length) : 0;

  const save = (chore: Chore) => {
    update((d) => ({
      ...d,
      chores: d.chores.some((c) => c.id === chore.id) ? d.chores.map((c) => (c.id === chore.id ? chore : c)) : [...d.chores, chore],
    }));
    setEditing(null);
  };

  const remove = (chore: Chore) => {
    if (!confirm(`Delete "${chore.name}"?`)) return;
    update((d) => ({
      ...d,
      chores: d.chores.filter((c) => c.id !== chore.id),
      members: d.members.map((m) => ({ ...m, favorites: m.favorites.filter((f) => f !== chore.id) })),
      plan: d.plan && { ...d.plan, assignments: d.plan.assignments.filter((a) => a.choreId !== chore.id) },
    }));
  };

  return (
    <div>
      <div className="board-head">
        <div>
          <h1>Chore menu</h1>
          <p className="muted">
            {on.length} chores on · {weeklyPoints(data.chores)} points a week
            {perPerson > 0 && ` · about ${perPerson} each`}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>＋ Add a chore</button>
      </div>
      <p className="muted hint">Turn on the chores your family does. Changes apply the next time you split.</p>
      <ChoreList chores={data.chores} onToggle={(id) => update(toggleChore(id))} onEdit={setEditing} onDelete={remove} />
      {editing && (
        <Modal title={editing === 'new' ? 'New chore' : 'Edit chore'} onClose={() => setEditing(null)}>
          <ChoreForm initial={editing === 'new' ? undefined : editing} onSave={save} onCancel={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
