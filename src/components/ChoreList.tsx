import type { Chore } from '../types';
import { FREQUENCIES, ROOMS } from '../data/presets';

interface Props {
  chores: Chore[];
  onToggle: (id: string) => void;
  onEdit?: (c: Chore) => void;
  onDelete?: (c: Chore) => void;
}

export const Points = ({ n }: { n: number }) => (
  <span className="points" aria-label={`${n} points`}>{'★'.repeat(n)}</span>
);

export function ChoreList({ chores, onToggle, onEdit, onDelete }: Props) {
  return (
    <div className="rooms">
      {ROOMS.map(({ room, emoji }) => {
        const list = chores.filter((c) => c.room === room);
        if (!list.length) return null;
        return (
          <section key={room} className="room card">
            <h3>{emoji} {room}</h3>
            <ul>
              {list.map((c) => (
                <li key={c.id} className={c.enabled ? '' : 'off'}>
                  <button className={`toggle ${c.enabled ? 'on' : ''}`} onClick={() => onToggle(c.id)} role="switch" aria-checked={c.enabled} aria-label={`${c.name} ${c.enabled ? 'on' : 'off'}`}>
                    <span />
                  </button>
                  <span className="chore-emoji">{c.emoji}</span>
                  <span className="chore-name">
                    {c.name}
                    <small className="muted">
                      {FREQUENCIES.find((f) => f.value === c.frequency)!.label} · age {c.minAge}+{c.custom ? ' · custom' : ''}
                    </small>
                  </span>
                  <Points n={c.points} />
                  {onEdit && <button className="icon-btn" onClick={() => onEdit(c)} aria-label={`Edit ${c.name}`}>✏️</button>}
                  {onDelete && c.custom && <button className="icon-btn" onClick={() => onDelete(c)} aria-label={`Delete ${c.name}`}>🗑️</button>}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
