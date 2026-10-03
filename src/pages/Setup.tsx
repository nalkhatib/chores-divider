import { useState } from 'react';
import { useApp } from '../state';
import { NewPin } from '../components/NewPin';
import { MemberForm } from '../components/MemberForm';
import { ChoreList } from '../components/ChoreList';
import { MemberTiles, saveMember } from './Family';
import { toggleChore, weeklyPoints } from './ChoreMenu';
import type { Member } from '../types';

const STEPS = ['Parent PIN', 'Family', 'Chores'];

export function Setup() {
  const { data, update, unlock } = useApp();
  const [step, setStep] = useState(data.pin ? 1 : 0);
  const [editing, setEditing] = useState<Member | 'new' | null>(data.members.length ? null : 'new');

  return (
    <div className="setup">
      <div className="setup-hero">
        <div className="big-emoji">🧹✨</div>
        <h1>Chores Divider</h1>
        <p className="muted">Fair chores for the whole family</p>
      </div>

      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? 'on' : i < step ? 'past' : ''}>
            <span>{i < step ? '✓' : i + 1}</span> {s}
          </li>
        ))}
      </ol>

      <div className="card setup-card">
        {step === 0 && (
          <>
            <h2>🔒 Set a parent PIN</h2>
            <p className="muted">Kids can tick off their chores. Changing chores, family or the split needs this PIN.</p>
            <NewPin
              onDone={(pin) => {
                update((d) => ({ ...d, pin }));
                unlock();
                setStep(1);
              }}
            />
          </>
        )}

        {step === 1 && (
          <>
            <h2>👨‍👩‍👧‍👦 Who's in the family?</h2>
            <p className="muted">Add everyone who'll share chores — kids and parents.</p>
            <MemberTiles
              members={data.members}
              chores={data.chores}
              onEdit={setEditing}
              onDelete={(m) => update((d) => ({ ...d, members: d.members.filter((x) => x.id !== m.id) }))}
            />
            {editing ? (
              <div className="inline-form">
                <h3>{editing === 'new' ? 'Add someone' : `Edit ${editing.name}`}</h3>
                <MemberForm
                  key={editing === 'new' ? `new-${data.members.length}` : editing.id}
                  initial={editing === 'new' ? undefined : editing}
                  chores={data.chores}
                  takenColors={data.members.map((m) => m.color)}
                  onCancel={() => setEditing(null)}
                  onSave={(m) => {
                    update(saveMember(m));
                    setEditing(null);
                  }}
                />
              </div>
            ) : (
              <div className="form-actions">
                <button className="btn btn-secondary" onClick={() => setEditing('new')}>＋ Add someone</button>
                <button className="btn btn-primary" disabled={data.members.length === 0} onClick={() => setStep(2)}>Next →</button>
              </div>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <h2>🧺 Pick your chores</h2>
            <p className="muted">
              We turned on some common ones. Switch on what your family does — you can add your own later.
              <br />
              <strong>{weeklyPoints(data.chores)} points a week</strong>, about {Math.round(weeklyPoints(data.chores) / Math.max(1, data.members.length))} each.
            </p>
            <ChoreList chores={data.chores} onToggle={(id) => update(toggleChore(id))} />
            <div className="form-actions sticky">
              <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary btn-big" onClick={() => update((d) => ({ ...d, setupDone: true }))}>Let's go! 🎉</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
