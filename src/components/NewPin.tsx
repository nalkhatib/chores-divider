import { useState } from 'react';
import { PinPad } from './PinPad';

/** Enter a new 4-digit PIN twice. */
export function NewPin({ onDone }: { onDone: (pin: string) => void }) {
  const [first, setFirst] = useState<string | null>(null);
  const [mismatch, setMismatch] = useState(false);
  return (
    <div className="center">
      <p className="muted">
        {mismatch ? "Those didn't match — let's try again." : first ? 'Type it once more to confirm' : 'Pick 4 digits only grown-ups know'}
      </p>
      <PinPad
        key={first ?? 'first'}
        onComplete={(pin) => {
          if (!first) {
            setFirst(pin);
            setMismatch(false);
            return;
          }
          if (pin === first) return onDone(pin);
          setFirst(null);
          setMismatch(true);
          return false;
        }}
      />
    </div>
  );
}
