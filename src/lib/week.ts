export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** 0 = Monday … 6 = Sunday. */
export const dayIndex = (d = new Date()) => (d.getDay() + 6) % 7;

/** ISO date of the Monday of the week containing `d` (local time). */
export function weekStart(d = new Date()): string {
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayIndex(d));
  const mm = String(monday.getMonth() + 1).padStart(2, '0');
  const dd = String(monday.getDate()).padStart(2, '0');
  return `${monday.getFullYear()}-${mm}-${dd}`;
}

export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
