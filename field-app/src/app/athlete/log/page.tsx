'use client';

import { useState, useRef } from 'react';
import { LOG_EXERCISES } from '@/lib/sampleData';
import { useElapsedTimer } from '@/hooks/useElapsedTimer';
import type { LogExercise, BadgeType } from '@/types/log';

// ─── Badge styles ────────────────────────────────────────────────────────────

const BADGE_STYLE: Record<BadgeType, string> = {
  up:   'text-[var(--lime)]  bg-[var(--lime-dim)]',
  pr:   'text-[var(--gold)]  bg-[var(--gold-dim)]',
  same: 'text-[var(--text3)] bg-[var(--s4)]',
};

// ─── Set/rep/weight stepper field ────────────────────────────────────────────

function StepField({
  label, value, min, max, step = 1,
  onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1">
      <label className="text-[10px] uppercase tracking-widest text-[var(--text3)] font-semibold">{label}</label>
      <div className="flex items-center gap-1">
        <button
          onMouseDown={() => onChange(Math.max(min, value - step))}
          className="w-8 h-8 rounded-[var(--rxs)] bg-[var(--s4)] text-[var(--text2)] font-bold text-sm border border-[var(--border)] active:opacity-70"
        >−{step > 1 ? step : ''}</button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          inputMode="numeric"
          onChange={e => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
          className="flex-1 h-8 text-center text-sm font-bold bg-[var(--s3)] border border-[var(--border)] rounded-[var(--rxs)] text-[var(--text)] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          onMouseDown={() => onChange(Math.min(max, value + step))}
          className="w-8 h-8 rounded-[var(--rxs)] bg-[var(--s4)] text-[var(--text2)] font-bold text-sm border border-[var(--border)] active:opacity-70"
        >+{step > 1 ? step : ''}</button>
      </div>
    </div>
  );
}

// ─── Single exercise card ────────────────────────────────────────────────────

interface CardProps {
  ex: LogExercise;
  result: { sets: number; reps: number; weight: number };
  depth: number;
  editOpen: boolean;
  selectedChips: string[];
  onToggleEdit: () => void;
  onChangeResult: (field: 'sets' | 'reps' | 'weight', val: number) => void;
  onToggleChip: (chip: string) => void;
  onSkip: () => void;
  onConfirm: () => void;
  exiting: 'right' | 'left' | null;
  total: number;
  index: number;
}

function LogCard({
  ex, result, depth, editOpen, selectedChips,
  onToggleEdit, onChangeResult, onToggleChip, onSkip, onConfirm,
  exiting, total, index,
}: CardProps) {
  const unit = ex.est.isPlus ? '' : ' lbs';
  const isTop = depth === 0;

  const baseStyle: React.CSSProperties = depth === 0
    ? { position: 'relative', zIndex: 10 }
    : {
        position: 'absolute',
        top:      depth * 9,
        left:     0, right: 0,
        transform: `scale(${1 - depth * 0.03})`,
        transformOrigin: 'top center',
        opacity:  depth === 1 ? 0.55 : 0.28,
        zIndex:   10 - depth,
        pointerEvents: 'none',
      };

  const exitClass = isTop && exiting === 'right' ? 'translate-x-[110%] opacity-0'
    : isTop && exiting === 'left'  ? '-translate-x-[110%] opacity-0'
    : '';

  return (
    <div
      className={`rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden transition-all duration-300 ${exitClass}`}
      style={baseStyle}
    >
      {/* Eyebrow */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-mono text-[var(--text3)]">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-[var(--rxs)] ${BADGE_STYLE[ex.badgeType]}`}>
          {ex.badge}
        </span>
      </div>

      {/* Name */}
      <h2 className="px-4 pb-3 text-xl font-bold text-[var(--text)] leading-tight">{ex.name}</h2>

      {/* Stats row */}
      <div className="flex border-t border-b border-[var(--border2)]">
        {[
          { label: 'Target',    val: ex.target,   sub: ex.targetWt, hi: false },
          { label: 'Last Time', val: ex.last,      sub: ex.lastWt,   hi: false },
          { label: 'Est. Today',val: `${result.sets}×${result.reps}`, sub: `${ex.est.isPlus ? '+' : ''}${result.weight}${unit}`, hi: true },
        ].map((col, ci) => (
          <div key={ci} className={`flex-1 text-center px-2 py-3 ${ci < 2 ? 'border-r border-[var(--border2)]' : ''} ${col.hi ? 'bg-[var(--lime-dim)]' : ''}`}>
            <p className="text-[9px] uppercase tracking-widest text-[var(--text3)] mb-1">{col.label}</p>
            <p className="text-base font-bold text-[var(--text)]">{col.val}</p>
            <p className={`text-[10px] mt-0.5 ${col.hi ? (ex.badgeType !== 'same' ? 'text-[var(--lime)]' : 'text-[var(--text3)]') : 'text-[var(--text3)]'}`}>
              {col.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Result row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border2)]">
        <div className="w-7 h-7 rounded-full bg-[var(--lime-dim)] border border-[rgba(201,241,61,0.2)] flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[var(--text3)] uppercase tracking-wider">Logging</p>
          <p className="text-sm font-bold text-[var(--text)]">
            {result.sets}×{result.reps} @ {ex.est.isPlus ? '+' : ''}{result.weight}{unit}
          </p>
        </div>
        <button
          onClick={onToggleEdit}
          className="text-xs font-semibold text-[var(--text2)] bg-[var(--s3)] border border-[var(--border)] px-2.5 py-1.5 rounded-[var(--rxs)] active:opacity-70 shrink-0"
        >
          {editOpen ? 'Close' : 'Edit'}
        </button>
      </div>

      {/* Edit panel */}
      {editOpen && (
        <div className="px-4 py-3 bg-[var(--s3)] border-b border-[var(--border2)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text3)] mb-3">Adjust Result</p>
          <div className="flex gap-2">
            <StepField label="Sets"   value={result.sets}   min={1} max={10}  onChange={v => onChangeResult('sets', v)} />
            <StepField label="Reps"   value={result.reps}   min={1} max={30}  onChange={v => onChangeResult('reps', v)} />
            <StepField label="Weight" value={result.weight} min={0} max={999} step={5} onChange={v => onChangeResult('weight', v)} />
          </div>
        </div>
      )}

      {/* Note chips */}
      <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-[var(--border2)]">
        {ex.chips.map(chip => (
          <button
            key={chip}
            onClick={() => onToggleChip(chip)}
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
              selectedChips.includes(chip)
                ? 'bg-[var(--lime-dim)] border-[rgba(201,241,61,0.3)] text-[var(--lime)]'
                : 'bg-[var(--s3)] border-[var(--border2)] text-[var(--text2)]'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-4 py-3">
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-[var(--rsm)] bg-[var(--s3)] border border-[var(--border)] text-[var(--text2)] text-xs font-semibold active:opacity-70"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polyline points="5 12 19 12"/><polyline points="13 6 19 12 13 18"/>
          </svg>
          Skip
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[var(--rsm)] bg-[var(--lime)] text-[var(--bg)] text-sm font-bold active:opacity-80 transition-opacity"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Confirm
        </button>
      </div>
    </div>
  );
}

// ─── Done screen ─────────────────────────────────────────────────────────────

function LogDoneScreen({ prCount, timeFormatted, exerciseCount }: {
  prCount: number; timeFormatted: string; exerciseCount: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-8 text-center">
      {/* Animated ring */}
      <div className="w-[72px] h-[72px] rounded-full bg-[var(--s2)] border border-[var(--border)] flex items-center justify-center mb-5"
        style={{ animation: 'popIn .45s cubic-bezier(.34,1.4,.64,1) both' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h2 className="text-[28px] font-[var(--ffs)] italic text-[var(--text)] leading-tight mb-2">
        Session logged.
      </h2>
      <p className="text-sm text-[var(--text2)] mb-8 leading-relaxed">
        {prCount > 0
          ? `You hit ${prCount} PR${prCount > 1 ? 's' : ''} today. Keep the momentum.`
          : 'Solid session. Consistency compounds.'}
      </p>

      {/* Stats */}
      <div className="w-full grid grid-cols-3 gap-2 mb-6">
        {[
          { num: exerciseCount, label: 'Exercises' },
          { num: prCount,       label: 'PRs' },
          { num: timeFormatted, label: 'Log time' },
        ].map((s, i) => (
          <div key={i} className="rounded-[var(--rsm)] bg-[var(--s2)] border border-[var(--border)] px-2 py-3 text-center">
            <p className="text-2xl font-bold text-[var(--text)] font-[var(--ffc)] leading-none mb-1">{s.num}</p>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text3)] font-semibold">{s.label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => window.location.href = '/athlete'}
        className="w-full py-3.5 rounded-[var(--rsm)] bg-[var(--text)] text-[var(--bg)] font-bold text-base active:opacity-80 transition-opacity"
      >
        Back to Home
      </button>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LogPage() {
  const exercises = LOG_EXERCISES;
  const timer = useElapsedTimer(true);

  const [current, setCurrent]           = useState(0);
  const [results, setResults]           = useState(() =>
    exercises.map(e => ({ sets: e.est.sets, reps: e.est.reps, weight: e.est.weight }))
  );
  const [editOpen, setEditOpen]         = useState<boolean[]>(exercises.map(() => false));
  const [chips, setChips]               = useState<string[][]>(exercises.map(() => []));
  const [exiting, setExiting]           = useState<'right' | 'left' | null>(null);
  const [prCount, setPRCount]           = useState(0);
  const [done, setDone]                 = useState(false);
  const exitingRef                      = useRef(false);

  function advance(direction: 'right' | 'left') {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(direction);
    setTimeout(() => {
      exitingRef.current = false;
      setExiting(null);
      const next = current + 1;
      if (next >= exercises.length) {
        timer.toggle(); // stop
        setDone(true);
      } else {
        setCurrent(next);
      }
    }, 300);
  }

  function handleConfirm() {
    if (exercises[current].badgeType !== 'same') {
      setPRCount(p => p + 1);
    }
    advance('right');
  }

  function handleSkip() {
    advance('left');
  }

  function updateResult(idx: number, field: 'sets' | 'reps' | 'weight', val: number) {
    setResults(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r));
  }

  function toggleChip(idx: number, chip: string) {
    setChips(prev => prev.map((arr, i) =>
      i === idx
        ? arr.includes(chip) ? arr.filter(c => c !== chip) : [...arr, chip]
        : arr
    ));
  }

  if (done) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 pt-4 pb-2 border-b border-[var(--border)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text3)]">Session Complete</p>
        </div>
        <LogDoneScreen
          prCount={prCount}
          timeFormatted={timer.formatted}
          exerciseCount={exercises.length}
        />
      </div>
    );
  }

  // Render stack: top card + 2 ghost cards behind
  const stackCards = [];
  for (let d = Math.min(2, exercises.length - 1 - current); d >= 0; d--) {
    const idx = current + d;
    if (idx >= exercises.length) continue;
    stackCards.push({ idx, depth: d });
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[var(--text3)]">Logging</p>
          <h1 className="text-base font-bold text-[var(--text)]">Session Results</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--s3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          {timer.formatted}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 py-3 shrink-0">
        {exercises.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${
              i < current  ? 'w-2 h-2 bg-[var(--lime)]'
              : i === current ? 'w-3 h-3 bg-[var(--lime)]'
              : 'w-2 h-2 bg-[var(--s4)]'
            }`}
          />
        ))}
      </div>

      {/* Card stack */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <div className="relative" style={{ minHeight: 420 }}>
          {stackCards.map(({ idx, depth }) => (
            <LogCard
              key={idx}
              ex={exercises[idx]}
              result={results[idx]}
              depth={depth}
              editOpen={editOpen[idx]}
              selectedChips={chips[idx]}
              onToggleEdit={() => setEditOpen(prev => prev.map((v, i) => i === idx ? !v : v))}
              onChangeResult={(field, val) => updateResult(idx, field, val)}
              onToggleChip={chip => toggleChip(idx, chip)}
              onSkip={handleSkip}
              onConfirm={handleConfirm}
              exiting={depth === 0 ? exiting : null}
              total={exercises.length}
              index={idx}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
