'use client';

import { useEffect } from 'react';
import type { ConditioningBlock as CondBlockType } from '@/types/workout';
import { useIntervalTimer } from '@/hooks/useIntervalTimer';
import BlockCard from './BlockCard';

interface Props {
  block: CondBlockType;
  emomRunning: boolean;
  emomSec: number;
  emomMinute: number;
  condRoundsDone: number;
  onToggleEmom: () => void;
  onTickEmom: () => void;
  onResetEmom: () => void;
  onSetCondRounds: (n: number) => void;
}

export default function ConditioningBlock({
  block,
  emomRunning,
  emomSec,
  emomMinute,
  condRoundsDone,
  onToggleEmom,
  onTickEmom,
  onResetEmom,
  onSetCondRounds,
}: Props) {
  // Interval timer (for 'interval' format)
  const ivl = useIntervalTimer({
    workSec:     block.interval?.work  ?? 30,
    restSec:     block.interval?.rest  ?? 15,
    totalRounds: block.roundsTotal     ?? 3,
  });

  // EMOM tick effect
  useEffect(() => {
    if (!emomRunning) return;
    const ref = setInterval(onTickEmom, 1000);
    return () => clearInterval(ref);
  }, [emomRunning, onTickEmom]);

  const fmtLabel = block.format === 'emom' ? 'EMOM'
    : block.format === 'interval' ? 'Interval'
    : 'For Rounds';

  return (
    <BlockCard block={block}>
      {/* Format banner */}
      <div className="flex items-center justify-between mb-4 px-3 py-2.5 rounded-[var(--rsm)] bg-[var(--s3)]">
        <span className="text-sm font-bold text-[var(--orange)]">{fmtLabel} · {block.title}</span>
        {block.format === 'emom' && block.duration && (
          <div className="text-right">
            <p className="text-xl font-bold text-[var(--text)] font-[var(--ffm)]">{block.duration}</p>
            <p className="text-[9px] uppercase tracking-wider text-[var(--text3)]">Minutes</p>
          </div>
        )}
        {block.format === 'interval' && block.interval && (
          <span className="text-xs font-mono text-[var(--text2)]">
            {block.interval.work}s / {block.interval.rest}s
          </span>
        )}
        {block.format === 'rounds' && block.roundsTotal && (
          <div className="text-right">
            <p className="text-xl font-bold text-[var(--text)] font-[var(--ffm)]">{block.roundsTotal}</p>
            <p className="text-[9px] uppercase tracking-wider text-[var(--text3)]">Rounds</p>
          </div>
        )}
      </div>

      {/* EMOM timer */}
      {block.format === 'emom' && block.duration && (
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text3)] text-center mb-1">
            Next minute in
          </p>
          <p className="text-[44px] font-bold text-center text-[var(--text)] font-[var(--ffm)] leading-none">
            {(() => {
              const secInMin = emomSec % 60;
              const left = 60 - secInMin;
              return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
            })()}
          </p>
          <p className="text-xs text-center text-[var(--text2)] mt-1">
            Minute {emomMinute} of {block.duration}
          </p>
          <div className="mt-2 h-1 rounded-full bg-[var(--s4)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--orange)] transition-all"
              style={{ width: `${((emomSec % 60) / 60) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Interval timer */}
      {block.format === 'interval' && block.interval && (
        <div className="mb-4">
          <div className="flex">
            <div className="flex-1 text-center py-3">
              <p className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${ivl.phase === 'work' ? 'text-[var(--lime)]' : 'text-[var(--text3)]'}`}>Work</p>
              <p className="text-[40px] font-bold font-[var(--ffm)] leading-none text-[var(--text)]">
                {ivl.phase === 'work' && ivl.running ? ivl.secondsLeft : block.interval.work}
              </p>
              <p className="text-[10px] text-[var(--text3)] mt-0.5">seconds</p>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div className="flex-1 text-center py-3">
              <p className={`text-[11px] uppercase tracking-wider font-semibold mb-1 ${ivl.phase === 'rest' ? 'text-[var(--orange)]' : 'text-[var(--text3)]'}`}>Rest</p>
              <p className="text-[40px] font-bold font-[var(--ffm)] leading-none text-[var(--text)]">
                {ivl.phase === 'rest' && ivl.running ? ivl.secondsLeft : block.interval.rest}
              </p>
              <p className="text-[10px] text-[var(--text3)] mt-0.5">seconds</p>
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-[var(--s4)] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${ivl.phase === 'work' ? 'bg-[var(--lime)]' : 'bg-[var(--orange)]'}`}
              style={{ width: `${ivl.progress * 100}%` }}
            />
          </div>
          <p className="text-center text-[11px] text-[var(--text3)] mt-1">
            Round {ivl.roundsDone + 1} of {block.roundsTotal ?? 3}
          </p>
        </div>
      )}

      {/* Exercise list */}
      <div className="flex flex-col gap-1.5 mb-4">
        {block.exercises.map((ex, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--rsm)] bg-[var(--s3)]">
            <span className="text-[10px] font-bold text-[var(--orange)] bg-[var(--orange-dim)] px-2 py-0.5 rounded-[var(--rxs)] shrink-0">
              {ex.marker}
            </span>
            <span className="flex-1 text-sm text-[var(--text)]">{ex.name}</span>
            <span className="text-xs font-mono text-[var(--text2)] shrink-0">{ex.val}</span>
          </div>
        ))}
      </div>

      {/* Timer controls */}
      <div className="flex gap-2">
        <button
          onClick={block.format === 'interval' ? ivl.toggle : onToggleEmom}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[var(--rsm)] bg-[var(--lime)] text-[var(--bg)] text-sm font-bold transition-opacity active:opacity-80"
        >
          {(block.format === 'interval' ? ivl.running : emomRunning) ? (
            <>
              <svg viewBox="0 0 24 24" fill="var(--bg)" className="w-3 h-3"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>
              Pause
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="var(--bg)" className="w-3 h-3"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Start
            </>
          )}
        </button>
        <button
          onClick={block.format === 'interval' ? ivl.reset : onResetEmom}
          className="w-10 flex items-center justify-center rounded-[var(--rsm)] bg-[var(--s4)] text-[var(--text2)] border border-[var(--border)] active:opacity-80"
          title="Reset"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-6"/>
          </svg>
        </button>
      </div>

      {/* Rounds tracker */}
      {block.format === 'rounds' && block.roundsTotal && (
        <div className="mt-4 pt-3 border-t border-[var(--border2)]">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text3)] mb-2">Rounds</p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: block.roundsTotal }, (_, i) => {
              const done = i < condRoundsDone;
              const cur  = i === condRoundsDone;
              return (
                <button
                  key={i}
                  onClick={() => onSetCondRounds(done ? i : i + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-bold border transition-colors ${
                    done ? 'bg-[var(--lime)] border-[var(--lime)] text-[var(--bg)]'
                    : cur ? 'border-[var(--orange)] text-[var(--orange)] bg-transparent'
                    : 'border-[var(--border)] text-[var(--text3)] bg-transparent'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </BlockCard>
  );
}
