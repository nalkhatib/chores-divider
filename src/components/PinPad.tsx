import { useEffect, useState } from 'react';

interface Props {
  /** Return false to reject the PIN (shakes and clears). */
  onComplete: (pin: string) => boolean | void;
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];

export function PinPad({ onComplete }: Props) {
  const [digits, setDigits] = useState('');
  const [shake, setShake] = useState(false);

  const press = (k: string) => {
    if (k === '⌫') return setDigits((d) => d.slice(0, -1));
    if (!k || digits.length >= 4) return;
    const next = digits + k;
    setDigits(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (onComplete(next) === false) {
          setShake(true);
          setTimeout(() => setShake(false), 400);
        }
        setDigits('');
      }, 120);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      else if (e.key === 'Backspace') press('⌫');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="pinpad">
      <div className={`pin-dots ${shake ? 'shake' : ''}`} aria-live="polite" aria-label={`${digits.length} of 4 digits`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < digits.length ? 'filled' : ''} />
        ))}
      </div>
      <div className="pin-keys">
        {KEYS.map((k, i) =>
          k ? (
            <button key={i} type="button" className="pin-key" onClick={() => press(k)} aria-label={k === '⌫' ? 'Delete' : k}>
              {k}
            </button>
          ) : (
            <span key={i} />
          ),
        )}
      </div>
    </div>
  );
}
