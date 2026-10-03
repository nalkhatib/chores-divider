import { useState } from 'react';
import { useApp } from './state';
import { Board } from './pages/Board';
import { ChoreMenu } from './pages/ChoreMenu';
import { Family } from './pages/Family';
import { Setup } from './pages/Setup';

type Tab = 'week' | 'chores' | 'family';

const TABS: { id: Tab; label: string; emoji: string; parent: boolean }[] = [
  { id: 'week', label: 'This week', emoji: '📅', parent: false },
  { id: 'chores', label: 'Chores', emoji: '🧺', parent: true },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', parent: true },
];

export default function App() {
  const { data, unlocked, lock, requireParent } = useApp();
  const [tab, setTab] = useState<Tab>('week');

  if (!data.setupDone) return <Setup />;

  const go = (t: Tab) => (TABS.find((x) => x.id === t)!.parent ? requireParent(() => setTab(t)) : setTab(t));

  return (
    <div className="app">
      <header className="topbar">
        <div className="logo">🧹 <span>Chores Divider</span></div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={`tab ${tab === t.id ? 'on' : ''}`} onClick={() => go(t.id)} aria-current={tab === t.id ? 'page' : undefined}>
              <span className="tab-emoji">{t.emoji}</span>
              <span className="tab-label">{t.label}</span>
              {t.parent && !unlocked && <span className="lock">🔒</span>}
            </button>
          ))}
        </nav>
        {unlocked && (
          <button
            className="btn btn-ghost lock-btn"
            onClick={() => {
              lock();
              setTab('week');
            }}
            title="Lock grown-up controls"
          >
            🔓 Lock
          </button>
        )}
      </header>
      <main className="page">
        {tab === 'week' && <Board goToFamily={() => go('family')} />}
        {tab === 'chores' && <ChoreMenu />}
        {tab === 'family' && <Family />}
      </main>
    </div>
  );
}
