import { useState, type CSSProperties } from 'react';
import { useApp } from '../state';
import { MemberForm } from '../components/MemberForm';
import { Modal } from '../components/Modal';
import { NewPin } from '../components/NewPin';
import { store } from '../lib/storage';
import type { AppData, Member } from '../types';

export const saveMember = (member: Member) => (d: AppData): AppData => ({
  ...d,
  members: d.members.some((m) => m.id === member.id)
    ? d.members.map((m) => (m.id === member.id ? member : m))
    : [...d.members, member],
});

export function MemberTiles({ members, chores, onEdit, onDelete }: {
  members: Member[];
  chores: AppData['chores'];
  onEdit: (m: Member) => void;
  onDelete: (m: Member) => void;
}) {
  return (
    <div className="tiles">
      {members.map((m) => (
        <div key={m.id} className="tile card" style={{ '--c': m.color } as CSSProperties}>
          <span className="avatar">{m.avatar}</span>
          <div className="grow">
            <h3>{m.name}</h3>
            <small className="muted">{m.role === 'parent' ? 'Parent' : 'Kid'} · {m.age} years</small>
            {m.favorites.length > 0 && (
              <div className="fav-line">
                💛 {m.favorites.map((id) => chores.find((c) => c.id === id)?.emoji).filter(Boolean).join(' ')}
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={() => onEdit(m)} aria-label={`Edit ${m.name}`}>✏️</button>
          <button className="icon-btn" onClick={() => onDelete(m)} aria-label={`Remove ${m.name}`}>🗑️</button>
        </div>
      ))}
    </div>
  );
}

export function Family() {
  const { data, update } = useApp();
  const [editing, setEditing] = useState<Member | 'new' | null>(null);
  const [changingPin, setChangingPin] = useState(false);

  const remove = (m: Member) => {
    if (!confirm(`Remove ${m.name} from the family? Their chores this week will be unassigned — split again to share them out.`)) return;
    update((d) => ({
      ...d,
      members: d.members.filter((x) => x.id !== m.id),
      plan: d.plan && { ...d.plan, assignments: d.plan.assignments.filter((a) => a.memberId !== m.id) },
    }));
  };

  return (
    <div>
      <div className="board-head">
        <div>
          <h1>Family</h1>
          <p className="muted">Everyone here gets a fair share of the chores.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing('new')}>＋ Add someone</button>
      </div>

      <MemberTiles members={data.members} chores={data.chores} onEdit={setEditing} onDelete={remove} />

      <section className="card settings">
        <h3>⚙️ Grown-up settings</h3>
        <div className="form-actions start">
          <button className="btn btn-secondary" onClick={() => setChangingPin(true)}>Change parent PIN</button>
          <button
            className="btn btn-ghost danger"
            onClick={() => {
              if (confirm('Erase everything and start over? This cannot be undone.')) {
                store.clear();
                location.reload();
              }
            }}
          >
            Start over
          </button>
        </div>
      </section>

      {editing && (
        <Modal title={editing === 'new' ? 'New family member' : `Edit ${editing.name}`} onClose={() => setEditing(null)}>
          <MemberForm
            initial={editing === 'new' ? undefined : editing}
            chores={data.chores}
            takenColors={data.members.map((m) => m.color)}
            onCancel={() => setEditing(null)}
            onSave={(m) => {
              update(saveMember(m));
              setEditing(null);
            }}
          />
        </Modal>
      )}
      {changingPin && (
        <Modal title="New parent PIN" onClose={() => setChangingPin(false)}>
          <NewPin
            onDone={(pin) => {
              update((d) => ({ ...d, pin }));
              setChangingPin(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
