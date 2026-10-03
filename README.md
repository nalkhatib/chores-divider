# 🧹 Chores Divider

A simple, playful web app that splits household chores fairly across the whole family.

- **Preset chore menu** of ~30 everyday chores, grouped by room. Parents switch on what the family does and can add their own.
- **Family profiles**: name, age, kid or parent, avatar, color and up to 3 favorite tasks.
- **Fair weekly split**: every chore has effort points (1–5), a minimum age and a frequency (daily, 3× a week, weekly). One tap splits the week so everyone ends up with a similar points total, nobody gets a chore they're too young for, and favorites are preferred.
- **This Week board**: day tabs, big tick boxes, a points progress bar and a celebration when the day is done.
- **Parent PIN** protects the chore menu, family profiles and re-splitting. Kids can still tick off their own chores. (It keeps little hands out; it isn't real security.)

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # fair-split unit tests
npm run build    # static site in dist/ (works on GitHub Pages)
```

## How the split works

`src/lib/split.ts` turns each enabled chore into one slot per occurrence that week (daily → 7, 3× → Mon/Wed/Fri, weekly → the assignee's lightest day, weekend first). Slots are handed out hardest-first to the eligible person with the fewest points so far, with a small bonus for favorites and a small penalty for the same chore on back-to-back days.

## Data and syncing

Everything is saved in the browser's local storage through the `DataStore` interface in `src/lib/storage.ts`. To sync across devices later (Firebase, Supabase, …), implement that interface and swap `store`. Nothing else needs to change.

## Colors: Berry Pop

| | |
|---|---|
| Background | cream `#FFF8EC` |
| Primary buttons | coral `#FF6B6B` |
| Points & highlights | purple `#9B5DE5` |
| Done | mint `#4ECDC4` |
| Selected day / info | sky `#5DA9E9` |
| Text | ink `#2D3047` |
| Member colors | coral, mint, sky, grape `#A78BFA`, tangerine `#FF9F43` |
