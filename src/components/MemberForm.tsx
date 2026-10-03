import { useState } from 'react';
import type { Chore, Member, Role } from '../types';
import { AVATARS, MEMBER_COLORS } from '../data/presets';
import { newId } from '../lib/week';

const MAX_FAVORITES = 3;

interface Props {
  initial?: Member;
  chores: Chore[];
  /** Used to pick a color nobody has yet. */
  takenColors: string[];
  onSave: (m: Member) => void;
  onCancel: () => void;
}

export function MemberForm({ initial, chores, takenColors, onSave, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [age, setAge] = useState(initial ? String(initial.age) : '');
  const [role, setRole] = useState<Role>(initial?.role ?? 'kid');
  const [avatar, setAvatar] = useState(initial?.avatar ?? AVATARS[Math.floor(Math.random() * 12)]);
  const [color, setColor] = useState(
    initial?.color ?? MEMBER_COLORS.find((c) => !takenColors.includes(c)) ?? MEMBER_COLORS[takenColors.length % MEMBER_COLORS.length],
  );
  const [favorites, setFavorites] = useState<string[]>(initial?.favorites ?? []);

  const ageNum = Number(age);
  const valid = name.trim() !== '' && age !== '' && ageNum >= 1 && ageNum <= 120;
  const canDo = chores.filter((c) => c.enabled && (!valid || c.minAge <= ageNum));

  const toggleFav = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : f.length < MAX_FAVORITES ? [...f, id] : f));

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSave({
          id: initial?.id ?? newId(),
          name: name.trim(),
          age: ageNum,
          role,
          avatar,
          color,
          favorites: favorites.filter((id) => canDo.some((c) => c.id === id)),
        });
      }}
    >
      <div className="form-row">
        <label className="field grow">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Layla" autoFocus maxLength={20} />
        </label>
        <label className="field age">
          <span>Age</span>
          <input type="number" inputMode="numeric" min={1} max={120} value={age} onChange={(e) => setAge(e.target.value)} />
        </label>
      </div>

      <div className="field">
        <span>Who is this?</span>
        <div className="seg">
          {(['kid', 'parent'] as Role[]).map((r) => (
            <button type="button" key={r} className={role === r ? 'on' : ''} onClick={() => setRole(r)}>
              {r === 'kid' ? '🧒 Kid' : '🧑 Parent'}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Avatar</span>
        <div className="picker">
          {AVATARS.map((a) => (
            <button type="button" key={a} className={`pick ${avatar === a ? 'on' : ''}`} onClick={() => setAvatar(a)} aria-label={`Avatar ${a}`}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>Color</span>
        <div className="picker">
          {MEMBER_COLORS.map((c) => (
            <button type="button" key={c} className={`swatch ${color === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={`Color ${c}`} />
          ))}
        </div>
      </div>

      <div className="field">
        <span>Favorite tasks <small className="muted">(up to {MAX_FAVORITES} — they'll get these more often)</small></span>
        <div className="chips">
          {canDo.map((c) => (
            <button type="button" key={c.id} className={`chip ${favorites.includes(c.id) ? 'on' : ''}`} onClick={() => toggleFav(c.id)}>
              {c.emoji} {c.name}
            </button>
          ))}
          {canDo.length === 0 && <span className="muted">No chores turned on yet.</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!valid}>{initial ? 'Save' : 'Add to family'}</button>
      </div>
    </form>
  );
}
