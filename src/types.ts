export type Frequency = 'daily' | '3x' | 'weekly';

export type Room = 'Kitchen' | 'Bedroom' | 'Laundry' | 'Bathroom' | 'General' | 'Pets' | 'Outdoor';

export interface Chore {
  id: string;
  name: string;
  emoji: string;
  room: Room;
  /** Effort, 1 (easy) to 5 (hard). */
  points: number;
  minAge: number;
  frequency: Frequency;
  enabled: boolean;
  custom?: boolean;
}

export type Role = 'parent' | 'kid';

export interface Member {
  id: string;
  name: string;
  age: number;
  role: Role;
  avatar: string;
  color: string;
  /** Chore ids. */
  favorites: string[];
}

export interface Assignment {
  id: string;
  choreId: string;
  memberId: string;
  /** 0 = Monday … 6 = Sunday. */
  day: number;
  done: boolean;
}

export interface WeekPlan {
  /** ISO date (YYYY-MM-DD) of the Monday this plan covers. */
  weekStart: string;
  assignments: Assignment[];
  /** Chore ids nobody was old enough to do. */
  skipped: string[];
}

export interface AppData {
  version: 1;
  setupDone: boolean;
  pin: string;
  members: Member[];
  chores: Chore[];
  plan: WeekPlan | null;
}
