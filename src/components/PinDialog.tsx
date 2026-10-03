import { useState } from 'react';
import { PinPad } from './PinPad';

interface Props {
  pin: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PinDialog({ pin, onSuccess, onCancel }: Props) {
  const [wrong, setWrong] = useState(false);
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="dialog card" role="dialog" aria-modal="true" aria-labelledby="pin-title" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-emoji">🔒</div>
        <h2 id="pin-title">Grown-ups only</h2>
        <p className="muted">{wrong ? 'Oops, try again!' : 'Enter the parent PIN'}</p>
        <PinPad
          onComplete={(entered) => {
            if (entered === pin) return onSuccess();
            setWrong(true);
            return false;
          }}
        />
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
