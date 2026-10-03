import type { Assignment, Chore, Frequency, Member } from '../types';
import { newId } from './week';

/** A favorite chore can go to someone up to this many points ahead of the lowest total. */
export const FAVORITE_BONUS = 2;
/** Discourages giving someone the same chore on back-to-back days. */
export const REPEAT_PENALTY = 1.5;

/** Weekly chores land on the assignee's lightest day, preferring the weekend. */
const WEEKLY_DAY_ORDER = [5, 6, 0, 1, 2, 3, 4];

/** Fixed days for a frequency, or null when the day is chosen per person. */
export function fixedDays(f: Frequency): number[] | null {
  if (f === 'daily') return [0, 1, 2, 3, 4, 5, 6];
  if (f === '3x') return [0, 2, 4];
  return null;
}

export interface SplitResult {
  assignments: Assignment[];
  /** Enabled chores nobody in the family is old enough for. */
  skipped: string[];
}

export interface SplitOptions {
  random?: () => number;
  makeId?: () => string;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Splits a week of chores so everyone ends with a similar points total.
 * Hardest slots go first, each to the eligible (old enough) person with the
 * lowest total, nudged towards favorites and away from back-to-back repeats.
 */
export function splitChores(chores: Chore[], members: Member[], opts: SplitOptions = {}): SplitResult {
  const random = opts.random ?? Math.random;
  const makeId = opts.makeId ?? newId;

  const slots: { chore: Chore; day: number | null }[] = [];
  for (const chore of chores.filter((c) => c.enabled)) {
    const days = fixedDays(chore.frequency);
    if (days) days.forEach((day) => slots.push({ chore, day }));
    else slots.push({ chore, day: null });
  }
  // Shuffle first so equal-point slots come in a different order each split.
  const ordered = shuffle(slots, random).sort((a, b) => b.chore.points - a.chore.points);

  const load = new Map(members.map((m) => [m.id, 0]));
  const dayLoad = new Map(members.map((m) => [m.id, [0, 0, 0, 0, 0, 0, 0]]));
  // `${choreId}:${memberId}` -> days that person already has this chore.
  const taken = new Map<string, Set<number>>();
  const assignments: Assignment[] = [];
  const skipped = new Set<string>();

  for (const { chore, day } of ordered) {
    const eligible = members.filter((m) => m.age >= chore.minAge);
    if (eligible.length === 0) {
      skipped.add(chore.id);
      continue;
    }

    const score = (m: Member) => {
      let s = load.get(m.id)!;
      if (m.favorites.includes(chore.id)) s -= FAVORITE_BONUS;
      const days = taken.get(`${chore.id}:${m.id}`);
      if (day !== null && days && (days.has(day - 1) || days.has(day + 1))) s += REPEAT_PENALTY;
      return s;
    };
    let best = eligible[0];
    for (const m of shuffle(eligible, random)) {
      if (score(m) < score(best)) best = m;
    }

    const loads = dayLoad.get(best.id)!;
    const finalDay = day ?? WEEKLY_DAY_ORDER.reduce((a, b) => (loads[b] < loads[a] ? b : a));

    assignments.push({ id: makeId(), choreId: chore.id, memberId: best.id, day: finalDay, done: false });
    load.set(best.id, load.get(best.id)! + chore.points);
    loads[finalDay] += chore.points;
    const key = `${chore.id}:${best.id}`;
    if (!taken.has(key)) taken.set(key, new Set());
    taken.get(key)!.add(finalDay);
  }

  assignments.sort((a, b) => a.day - b.day);
  return { assignments, skipped: [...skipped] };
}

/** Total points per member for a set of assignments. */
export function pointsByMember(assignments: Assignment[], chores: Chore[]): Map<string, number> {
  const pts = new Map(chores.map((c) => [c.id, c.points]));
  const totals = new Map<string, number>();
  for (const a of assignments) totals.set(a.memberId, (totals.get(a.memberId) ?? 0) + (pts.get(a.choreId) ?? 0));
  return totals;
}
