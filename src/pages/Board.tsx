import { useState, type CSSProperties, type ReactNode } from 'react';
import { useApp } from '../state';
import { splitChores } from '../lib/split';
import { DAYS, dayIndex, weekStart } from '../lib/week';
import { Points } from '../components/ChoreList';
import type { Assignment, Member } from '../types';

export function Board({ goToFamily }: { goToFamily: () => void }) {
  const { data, update, unlocked, requireParent } = useApp();
  const [day, setDay] = useState(dayIndex());
  const thisWeek = weekStart();
  const plan = data.plan?.weekStart === thisWeek ? data.plan : null;
  const choreById = new Map(data.chores.map((c) => [c.id, c]));
  const assignments = plan?.assignments.filter((a) => choreById.has(a.choreId)) ?? [];
  const pts = (list: Assignment[]) => list.reduce((s, a) => s + choreById.get(a.choreId)!.points, 0);

  const split = () =>
    requireParent(() => {
      if (plan?.assignments.some((a) => a.done) && !confirm('Split again? Chores already ticked off this week will be cleared.')) return;
      const { assignments, skipped } = splitChores(data.chores, data.members);
      update((d) => ({ ...d, plan: { weekStart: thisWeek, assignments, skipped } }));
    });

  const editPlan = (fn: (a: Assignment) => Assignment) =>
    update((d) => (d.plan ? { ...d, plan: { ...d.plan, assignments: d.plan.assignments.map(fn) } } : d));
  const toggle = (id: string) => editPlan((a) => (a.id === id ? { ...a, done: !a.done } : a));
  const move = (id: string, memberId: string) => editPlan((a) => (a.id === id ? { ...a, memberId } : a));

  if (data.members.length === 0) {
    return (
      <Empty emoji="👨‍👩‍👧‍👦" title="Who's in the family?" text="Add family members to start splitting chores.">
        <button className="btn btn-primary" onClick={goToFamily}>Add family</button>
      </Empty>
    );
  }

  if (!plan) {
    return (
      <Empty
        emoji="🎲"
        title={data.plan ? "It's a new week!" : 'Ready to split the chores?'}
        text="A grown-up taps the button and everyone gets a fair share."
      >
        <button className="btn btn-primary btn-big" onClick={split}>🎲 Split this week's chores</button>
      </Empty>
    );
  }

  const skipped = plan.skipped.map((id) => choreById.get(id)).filter((c) => c?.enabled);

  return (
    <div className="board">
      <div className="board-head">
        <div>
          <h1>This week</h1>
          <p className="muted">{pts(assignments)} points of chores, shared fairly ✨</p>
        </div>
        <button className="btn btn-secondary" onClick={split}>🎲 Split again</button>
      </div>

      {skipped.length > 0 && (
        <p className="notice">
          Nobody is old enough yet for: {skipped.map((c) => `${c!.emoji} ${c!.name}`).join(', ')}.
        </p>
      )}

      <div className="days" role="tablist">
        {DAYS.map((d, i) => {
          const left = assignments.filter((a) => a.day === i && !a.done).length;
          return (
            <button key={d} role="tab" aria-selected={day === i} className={`day ${day === i ? 'on' : ''} ${i === dayIndex() ? 'today' : ''}`} onClick={() => setDay(i)}>
              {d}
              {i === dayIndex() && <small>today</small>}
              {left === 0 && assignments.some((a) => a.day === i) && <small>✅</small>}
            </button>
          );
        })}
      </div>

      <div className="members">
        {data.members.map((m) => {
          const mine = assignments.filter((a) => a.memberId === m.id);
          const total = pts(mine);
          const done = pts(mine.filter((a) => a.done));
          const today = mine.filter((a) => a.day === day);
          const allDone = today.length > 0 && today.every((a) => a.done);
          return (
            <section key={m.id} className={`member card ${allDone ? 'celebrate' : ''}`} style={{ '--c': m.color } as CSSProperties}>
              <header>
                <span className="avatar">{m.avatar}</span>
                <div className="grow">
                  <h2>{m.name}</h2>
                  <div className="bar" aria-label={`${done} of ${total} points this week`}>
                    <span style={{ width: total ? `${(done / total) * 100}%` : 0 }} />
                  </div>
                  <small className="muted">⭐ {done} / {total} points this week</small>
                </div>
              </header>

              {today.length === 0 ? (
                <p className="muted rest">🌴 Day off!</p>
              ) : (
                <ul className="tasks">
                  {today.map((a) => {
                    const c = choreById.get(a.choreId)!;
                    return (
                      <li key={a.id} className={a.done ? 'done' : ''}>
                        <button className="check" onClick={() => toggle(a.id)} role="checkbox" aria-checked={a.done} aria-label={c.name}>
                          {a.done ? '✓' : ''}
                        </button>
                        <span className="chore-emoji">{c.emoji}</span>
                        <span className="chore-name">
                          <span>{c.name}{m.favorites.includes(c.id) && <span title="Favorite"> 💛</span>}</span>
                          {unlocked && (
                            <select className="move" value={a.memberId} onChange={(e) => move(a.id, e.target.value)} aria-label={`Move ${c.name} to`}>
                              {data.members.map((o: Member) => (
                                <option key={o.id} value={o.id} disabled={o.age < c.minAge}>{o.avatar} {o.name}</option>
                              ))}
                            </select>
                          )}
                        </span>
                        <Points n={c.points} />
                      </li>
                    );
                  })}
                </ul>
              )}
              {allDone && <div className="hooray">🎉 All done for {DAYS[day]}!</div>}
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Empty({ emoji, title, text, children }: { emoji: string; title: string; text: string; children: ReactNode }) {
  return (
    <div className="empty card">
      <div className="big-emoji">{emoji}</div>
      <h1>{title}</h1>
      <p className="muted">{text}</p>
      {children}
    </div>
  );
}
