'use client';

import type { StrengthBlock as StrengthBlockType, Trend } from '@/types/workout';
import BlockCard from './BlockCard';

interface Props {
  block: StrengthBlockType;
  sets: Record<string, boolean[]>;
  onToggleSet: (exerciseId: string, setIndex: number) => void;
}

function TrendBadge({ trend }: { trend: Trend }) {
  if (trend === 'pr')   return <span className="text-[10px] font-bold text-[var(--gold)]">★ PR</span>;
  if (trend === 'up')   return <span className="text-[10px] font-bold text-[var(--lime)]">↑ +wt</span>;
  return <span className="text-[10px] text-[var(--text3)]">→ Match</span>;
}

export default function StrengthBlock({ block, sets, onToggleSet }: Props) {
  return (
    <BlockCard block={block}>
      <div className="flex flex-col gap-3">
        {block.exercises.map((ex) => {
          const exSets   = sets[ex.id] ?? [];
          const doneN    = exSets.filter(Boolean).length;
          const complete = doneN === ex.sets;
          const active   = doneN > 0 && !complete;

          return (
            <div
              key={ex.id}
              className={`rounded-[var(--rsm)] border transition-colors ${
                complete ? 'bg-[var(--blue-dim)] border-[rgba(96,165,250,0.2)]'
                : active  ? 'bg-[var(--s3)] border-[var(--blue)]'
                : 'bg-[var(--s3)] border-[var(--border2)]'
              }`}
            >
              {/* Header row */}
              <div className="flex items-center gap-3 px-3 pt-3 pb-2">
                {/* Letter badge */}
                <div className={`w-7 h-7 rounded-[var(--rxs)] flex items-center justify-center text-xs font-bold shrink-0 ${
                  complete ? 'bg-[var(--lime-dim)] text-[var(--lime)]' : 'bg-[var(--s4)] text-[var(--text2)]'
                }`}>
                  {ex.ltr}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{ex.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className="text-[10px] font-bold text-[var(--blue)] bg-[var(--blue-dim)] px-1.5 py-0.5 rounded-[var(--rxs)]">
                      {ex.sets} sets
                    </span>
                    <span className="text-[10px] font-bold text-[var(--blue)] bg-[var(--blue-dim)] px-1.5 py-0.5 rounded-[var(--rxs)]">
                      {ex.reps} reps
                    </span>
                    <span className="text-[10px] text-[var(--text2)] bg-[var(--s4)] px-1.5 py-0.5 rounded-[var(--rxs)]">
                      {ex.wt}
                    </span>
                  </div>
                </div>
                {/* Ring */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold border shrink-0 transition-colors ${
                  complete
                    ? 'bg-[var(--lime)] border-[var(--lime)] text-[var(--bg)]'
                    : 'border-[var(--text3)] text-[var(--text2)]'
                }`}>
                  {complete ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" className="w-3.5 h-3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : `${doneN}/${ex.sets}`}
                </div>
              </div>

              {/* History strip */}
              <div className="flex border-t border-[var(--border2)]">
                {[
                  { label: 'Target', val: `${ex.sets}×${ex.reps}`, sub: ex.wt, accent: false },
                  { label: 'Last',   val: ex.last,  sub: ex.lastWt, accent: false },
                  { label: 'Best',   val: ex.best,  sub: ex.bestWt, accent: ex.trend !== 'same' },
                ].map((col, ci) => (
                  <div key={ci} className={`flex-1 px-2 py-2 text-center ${ci < 2 ? 'border-r border-[var(--border2)]' : ''}`}>
                    <p className="text-[9px] uppercase tracking-wider text-[var(--text3)] mb-0.5">{col.label}</p>
                    <p className="text-xs font-bold text-[var(--text)]">{col.val}</p>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <p className="text-[10px] text-[var(--text3)]">{col.sub}</p>
                      {col.accent && <TrendBadge trend={ex.trend} />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Set bubbles */}
              <div className="flex gap-2 px-3 pb-3 pt-2">
                {exSets.map((logged, si) => {
                  const isNext = !logged && si === doneN;
                  return (
                    <button
                      key={si}
                      onClick={() => onToggleSet(ex.id, si)}
                      className={`flex-1 py-2 rounded-[var(--rxs)] text-xs font-bold transition-colors border ${
                        logged  ? 'bg-[var(--lime)] border-[var(--lime)] text-[var(--bg)]'
                        : isNext ? 'bg-[var(--s4)] border-[var(--blue)] text-[var(--blue)]'
                        : 'bg-[var(--s4)] border-[var(--border2)] text-[var(--text3)]'
                      }`}
                    >
                      Set {si + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </BlockCard>
  );
}
