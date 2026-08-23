/**
 * Renders the correct entry widget for a task and reports the child's answer.
 * Each widget is remounted per task (via `key={task.id}` upstream), so it starts
 * empty. Multiple-choice auto-submits for snappy timed play.
 */
import { useState } from 'react';
import type { InputSpec, UserAnswer } from '../lib/tasks';

interface Props {
  input: InputSpec;
  disabled: boolean;
  onChange: (answer: UserAnswer | null) => void;
  onSubmit: (answer: UserAnswer) => void;
}

function NumberBox({
  label,
  max,
  value,
  onValue,
  disabled,
  width = 'w-20',
}: {
  label: string;
  max: number;
  value: string;
  onValue: (v: string) => void;
  disabled: boolean;
  width?: string;
}) {
  return (
    <label className="flex flex-col items-center gap-1 text-sm font-semibold text-slate-600">
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onValue(e.target.value)}
        className={`${width} rounded-xl border-2 border-slate-300 bg-white px-3 py-2 text-center text-2xl font-bold focus:border-heft-orange`}
        aria-label={label}
      />
      {label}
    </label>
  );
}

function parseInt0(v: string): number | null {
  if (v.trim() === '') return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

function toDayMinutes(h: number | null, m: number | null): number | null {
  if (h === null || m === null) return null;
  if (h > 23 || m > 59) return null;
  return h * 60 + m;
}

export function AnswerInput({ input, disabled, onChange, onSubmit }: Props) {
  // Local text state for the various widgets.
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');

  if (input.widget === 'choice') {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {input.options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            disabled={disabled}
            onClick={() => onSubmit({ widget: 'choice', index: i })}
            className="btn-secondary min-w-[88px] text-2xl"
          >
            {opt}
          </button>
        ))}
      </div>
    );
  }

  const emit = (next: UserAnswer | null) => onChange(next);

  if (input.widget === 'time') {
    const update = (hv: string, mv: string) => {
      const value = toDayMinutes(parseInt0(hv), parseInt0(mv));
      emit(value === null ? null : { widget: 'time', value });
    };
    return (
      <div className="flex items-end justify-center gap-2">
        <NumberBox label="Stunde" max={23} value={a} disabled={disabled}
          onValue={(v) => { setA(v); update(v, b); }} />
        <span className="pb-3 text-3xl font-black">:</span>
        <NumberBox label="Minute" max={59} value={b} disabled={disabled}
          onValue={(v) => { setB(v); update(a, v); }} />
        <span className="pb-3 text-lg font-bold text-slate-500">Uhr</span>
      </div>
    );
  }

  if (input.widget === 'timeDouble') {
    const update = (av: string, bv: string, cv: string, dv: string) => {
      const first = toDayMinutes(parseInt0(av), parseInt0(bv));
      const second = toDayMinutes(parseInt0(cv), parseInt0(dv));
      emit(
        first === null && second === null
          ? null
          : { widget: 'timeDouble', a: first, b: second },
      );
    };
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-end gap-2">
          <span className="pb-3 w-24 text-right text-sm font-bold text-slate-500">Vormittag</span>
          <NumberBox label="Stunde" max={23} value={a} disabled={disabled}
            onValue={(v) => { setA(v); update(v, b, c, d); }} />
          <span className="pb-3 text-3xl font-black">:</span>
          <NumberBox label="Minute" max={59} value={b} disabled={disabled}
            onValue={(v) => { setB(v); update(a, v, c, d); }} />
        </div>
        <div className="flex items-end gap-2">
          <span className="pb-3 w-24 text-right text-sm font-bold text-slate-500">Nachmittag</span>
          <NumberBox label="Stunde" max={23} value={c} disabled={disabled}
            onValue={(v) => { setC(v); update(a, b, v, d); }} />
          <span className="pb-3 text-3xl font-black">:</span>
          <NumberBox label="Minute" max={59} value={d} disabled={disabled}
            onValue={(v) => { setD(v); update(a, b, c, v); }} />
        </div>
      </div>
    );
  }

  if (input.widget === 'hm') {
    const update = (hv: string, mv: string) => {
      const h = parseInt0(hv);
      const m = parseInt0(mv);
      if (h === null && m === null) return emit(null);
      emit({ widget: 'hm', total: (h ?? 0) * 60 + (m ?? 0) });
    };
    return (
      <div className="flex items-end justify-center gap-3">
        <NumberBox label="Stunden (h)" max={99} value={a} disabled={disabled}
          onValue={(v) => { setA(v); update(v, b); }} />
        <NumberBox label="Minuten (min)" max={59} value={b} disabled={disabled}
          onValue={(v) => { setB(v); update(a, v); }} />
      </div>
    );
  }

  if (input.widget === 'minsec') {
    const update = (mv: string, sv: string) => {
      const m = parseInt0(mv);
      const s = parseInt0(sv);
      if (m === null && s === null) return emit(null);
      emit({ widget: 'minsec', total: (m ?? 0) * 60 + (s ?? 0) });
    };
    return (
      <div className="flex items-end justify-center gap-3">
        <NumberBox label="Minuten (min)" max={99} value={a} disabled={disabled}
          onValue={(v) => { setA(v); update(v, b); }} />
        <NumberBox label="Sekunden (s)" max={59} value={b} disabled={disabled}
          onValue={(v) => { setB(v); update(a, v); }} />
      </div>
    );
  }

  // number
  const unit = input.unit;
  const update = (v: string) => {
    const n = parseInt0(v);
    emit(n === null ? null : { widget: 'number', value: n });
  };
  return (
    <div className="flex items-end justify-center gap-2">
      <NumberBox label={unit === 's' ? 'Sekunden' : 'Minuten'} max={9999}
        width="w-28" value={a} disabled={disabled}
        onValue={(v) => { setA(v); update(v); }} />
      <span className="pb-3 text-lg font-bold text-slate-500">{unit}</span>
    </div>
  );
}
