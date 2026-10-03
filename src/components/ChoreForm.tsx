import { useState } from 'react';
import type { Chore, Frequency, Room } from '../types';
import { FREQUENCIES, ROOMS } from '../data/presets';
import { newId } from '../lib/week';

interface Props {
  initial?: Chore;
  onSave: (c: Chore) => void;
  onCancel: () => void;
}

export function ChoreForm({ initial, onSave, onCancel }: Props) {
  const [emoji, setEmoji] = useState(initial?.emoji ?? '⭐');
  const [name, setName] = useState(initial?.name ?? '');
  const [room, setRoom] = useState<Room>(initial?.room ?? 'General');
  const [points, setPoints] = useState(initial?.points ?? 2);
  const [minAge, setMinAge] = useState(String(initial?.minAge ?? 5));
  const [frequency, setFrequency] = useState<Frequency>(initial?.frequency ?? 'weekly');

  const valid = name.trim() !== '' && minAge !== '' && Number(minAge) >= 0;

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSave({
          id: initial?.id ?? `custom-${newId()}`,
          emoji: emoji.trim() || '⭐',
          name: name.trim(),
          room,
          points,
          minAge: Number(minAge),
          frequency,
          enabled: initial?.enabled ?? true,
          custom: initial?.custom ?? true,
        });
      }}
    >
      <div className="form-row">
        <label className="field emoji-field">
          <span>Emoji</span>
          <input value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} />
        </label>
        <label className="field grow">
          <span>Chore name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Feed the fish" autoFocus maxLength={40} />
        </label>
      </div>

      <div className="form-row">
        <label className="field grow">
          <span>Room</span>
          <select value={room} onChange={(e) => setRoom(e.target.value as Room)}>
            {ROOMS.map((r) => (
              <option key={r.room} value={r.room}>{r.emoji} {r.room}</option>
            ))}
          </select>
        </label>
        <label className="field grow">
          <span>How often</span>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </label>
        <label className="field age">
          <span>Min age</span>
          <input type="number" inputMode="numeric" min={0} max={99} value={minAge} onChange={(e) => setMinAge(e.target.value)} />
        </label>
      </div>

      <div className="field">
        <span>Effort points</span>
        <div className="stars-input">
          {[1, 2, 3, 4, 5].map((p) => (
            <button type="button" key={p} className={p <= points ? 'on' : ''} onClick={() => setPoints(p)} aria-label={`${p} points`}>
              ★
            </button>
          ))}
          <span className="muted">{['', 'Super easy', 'Easy', 'Medium', 'Hard', 'Big job'][points]}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!valid}>{initial ? 'Save' : 'Add chore'}</button>
      </div>
    </form>
  );
}
