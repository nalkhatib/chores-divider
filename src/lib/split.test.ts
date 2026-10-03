import { describe, expect, it } from 'vitest';
import { FAVORITE_BONUS, REPEAT_PENALTY, pointsByMember, splitChores } from './split';
import { PRESET_CHORES } from '../data/presets';
import type { Chore, Member } from '../types';

function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const member = (id: string, age: number, favorites: string[] = []): Member => ({
  id, name: id, age, favorites, role: age >= 18 ? 'parent' : 'kid', avatar: '🦁', color: '#FF6B6B',
});

const chore = (id: string, points: number, minAge: number, frequency: Chore['frequency']): Chore => ({
  id, name: id, emoji: '⭐', room: 'General', points, minAge, frequency, enabled: true,
});

const family = [member('mom', 40), member('dad', 42), member('teen', 14), member('kid', 9), member('tot', 5)];
const allChores = PRESET_CHORES.map((c) => ({ ...c, enabled: true }));

describe('splitChores', () => {
  it('creates one slot per occurrence: daily=7, 3x=3, weekly=1', () => {
    const chores = [chore('a', 1, 0, 'daily'), chore('b', 1, 0, '3x'), chore('c', 1, 0, 'weekly')];
    const { assignments } = splitChores(chores, family, { random: seeded(1) });
    const count = (id: string) => assignments.filter((a) => a.choreId === id).length;
    expect([count('a'), count('b'), count('c')]).toEqual([7, 3, 1]);
  });

  it('ignores disabled chores', () => {
    const chores = [chore('a', 1, 0, 'daily'), { ...chore('b', 1, 0, 'daily'), enabled: false }];
    const { assignments } = splitChores(chores, family, { random: seeded(2) });
    expect(assignments.every((a) => a.choreId === 'a')).toBe(true);
  });

  it('never gives a chore to someone too young', () => {
    for (let seed = 0; seed < 20; seed++) {
      const { assignments } = splitChores(allChores, family, { random: seeded(seed) });
      for (const a of assignments) {
        const c = allChores.find((x) => x.id === a.choreId)!;
        const m = family.find((x) => x.id === a.memberId)!;
        expect(m.age).toBeGreaterThanOrEqual(c.minAge);
      }
    }
  });

  it('keeps point totals close when everyone can do everything', () => {
    const adults = [member('a', 30), member('b', 30), member('c', 30)];
    for (let seed = 0; seed < 20; seed++) {
      const { assignments } = splitChores(allChores, adults, { random: seeded(seed) });
      const totals = [...pointsByMember(assignments, allChores).values()];
      const gap = Math.max(...totals) - Math.min(...totals);
      expect(gap).toBeLessThanOrEqual(5 + FAVORITE_BONUS + REPEAT_PENALTY);
    }
  });

  it('keeps a mixed-age family fair', () => {
    const { assignments } = splitChores(allChores, family, { random: seeded(7) });
    const totals = [...pointsByMember(assignments, allChores).values()];
    expect(Math.max(...totals) - Math.min(...totals)).toBeLessThanOrEqual(5 + FAVORITE_BONUS + REPEAT_PENALTY);
  });

  it('leans towards favorites', () => {
    const chores = [chore('dishes', 2, 0, 'daily'), chore('trash', 2, 0, 'daily')];
    const pair = [member('ana', 10, ['dishes']), member('ben', 10, ['trash'])];
    const { assignments } = splitChores(chores, pair, { random: seeded(3) });
    const ana = assignments.filter((a) => a.memberId === 'ana');
    expect(ana.filter((a) => a.choreId === 'dishes').length).toBeGreaterThan(ana.length / 2);
  });

  it('reports chores nobody is old enough for', () => {
    const kids = [member('a', 6), member('b', 8)];
    const { assignments, skipped } = splitChores([chore('mow', 5, 14, 'weekly'), chore('bed', 1, 4, 'daily')], kids);
    expect(skipped).toEqual(['mow']);
    expect(assignments.some((a) => a.choreId === 'mow')).toBe(false);
  });

  it('handles an empty family', () => {
    expect(splitChores(allChores, []).assignments).toEqual([]);
  });
});
