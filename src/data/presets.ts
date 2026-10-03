import type { Chore, Frequency, Room } from '../types';

export const ROOMS: { room: Room; emoji: string }[] = [
  { room: 'Kitchen', emoji: '🍽️' },
  { room: 'Bedroom', emoji: '🛏️' },
  { room: 'Laundry', emoji: '🧺' },
  { room: 'Bathroom', emoji: '🚿' },
  { room: 'General', emoji: '🏠' },
  { room: 'Pets', emoji: '🐾' },
  { room: 'Outdoor', emoji: '🌿' },
];

export const FREQUENCIES: { value: Frequency; label: string; perWeek: number }[] = [
  { value: 'daily', label: 'Every day', perWeek: 7 },
  { value: '3x', label: '3× a week', perWeek: 3 },
  { value: 'weekly', label: 'Once a week', perWeek: 1 },
];

export const timesPerWeek = (f: Frequency) => FREQUENCIES.find((x) => x.value === f)!.perWeek;

// [id, emoji, name, room, points, minAge, frequency, on by default]
type Row = [string, string, string, Room, number, number, Frequency, boolean];

const ROWS: Row[] = [
  ['set-table', '🍽️', 'Set the table', 'Kitchen', 1, 4, 'daily', true],
  ['clear-table', '🧹', 'Clear the table', 'Kitchen', 1, 5, 'daily', true],
  ['dishwasher', '🫧', 'Load / unload dishwasher', 'Kitchen', 2, 7, 'daily', true],
  ['wash-dishes', '🧽', 'Wash the dishes', 'Kitchen', 3, 10, 'daily', false],
  ['wipe-counters', '🧼', 'Wipe counters & table', 'Kitchen', 1, 6, 'daily', false],
  ['cooking', '🍳', 'Help with cooking', 'Kitchen', 2, 6, '3x', true],

  ['make-bed', '🛏️', 'Make bed', 'Bedroom', 1, 4, 'daily', false],
  ['tidy-room', '🧸', 'Tidy room & toys', 'Bedroom', 1, 3, 'daily', false],
  ['change-sheets', '🛌', 'Change bed sheets', 'Bedroom', 3, 10, 'weekly', true],

  ['hamper', '🧦', 'Clothes in the hamper', 'Laundry', 1, 3, 'daily', false],
  ['fold-laundry', '👕', 'Fold & put away laundry', 'Laundry', 2, 7, '3x', true],
  ['run-washer', '🌀', 'Run washer & dryer', 'Laundry', 3, 11, '3x', false],

  ['wipe-sink', '🪥', 'Wipe sink & mirror', 'Bathroom', 2, 7, '3x', false],
  ['restock-tp', '🧻', 'Restock toilet paper & towels', 'Bathroom', 1, 5, 'weekly', false],
  ['clean-bathroom', '🚽', 'Clean the bathroom', 'Bathroom', 4, 11, 'weekly', true],

  ['shoes-away', '👟', 'Put shoes & coats away', 'General', 1, 3, 'daily', false],
  ['dust', '🪶', 'Dust the shelves', 'General', 2, 6, 'weekly', true],
  ['vacuum', '🧹', 'Sweep or vacuum', 'General', 3, 9, '3x', true],
  ['mop', '🪣', 'Mop the floors', 'General', 3, 11, 'weekly', false],
  ['trash', '🗑️', 'Take out the trash', 'General', 2, 8, '3x', true],
  ['recycling', '♻️', 'Sort the recycling', 'General', 1, 6, '3x', false],
  ['groceries', '🛒', 'Help with grocery trips', 'General', 2, 5, 'weekly', true],

  ['feed-pet', '🥣', 'Feed pet & refill water', 'Pets', 1, 5, 'daily', false],
  ['walk-dog', '🦮', 'Walk the dog', 'Pets', 3, 10, 'daily', false],
  ['litter', '🐱', 'Clean litter box / cage', 'Pets', 3, 10, '3x', false],

  ['water-plants', '🪴', 'Water the plants', 'Outdoor', 1, 5, '3x', true],
  ['rake', '🍂', 'Rake leaves / pull weeds', 'Outdoor', 3, 8, 'weekly', false],
  ['wash-car', '🚗', 'Help wash the car', 'Outdoor', 2, 7, 'weekly', false],
  ['mow', '🌱', 'Mow the lawn', 'Outdoor', 5, 14, 'weekly', false],
];

export const PRESET_CHORES: Chore[] = ROWS.map(
  ([id, emoji, name, room, points, minAge, frequency, enabled]) => ({
    id, emoji, name, room, points, minAge, frequency, enabled,
  }),
);

export const MEMBER_COLORS = ['#FF6B6B', '#4ECDC4', '#5DA9E9', '#A78BFA', '#FF9F43'];

export const AVATARS = ['🦁', '🐼', '🦊', '🐸', '🐯', '🐨', '🦄', '🐙', '🐻', '🐰', '🦖', '🐝', '👩', '👨', '🧑'];
