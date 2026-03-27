'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type Phase = 'work' | 'rest' | 'idle';

interface Options {
  workSec: number;
  restSec: number;
  totalRounds: number;
}

export function useIntervalTimer({ workSec, restSec, totalRounds }: Options) {
  const [running, setRunning]     = useState(false);
  const [phase, setPhase]         = useState<Phase>('idle');
  const [secondsLeft, setSeconds] = useState(workSec);
  const [roundsDone, setRounds]   = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick
  useEffect(() => {
    if (!running) return;

    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev > 1) return prev - 1;

        // Phase flip
        setPhase(p => {
          if (p === 'work') {
            setSeconds(restSec);
            return 'rest';
          } else {
            // rest ended → new round
            setRounds(r => {
              const next = r + 1;
              if (next >= totalRounds) {
                setRunning(false);
              }
              return next;
            });
            setSeconds(workSec);
            return 'work';
          }
        });

        return prev; // will be overwritten by setSeconds above
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, workSec, restSec, totalRounds]);

  const start  = useCallback(() => { setPhase('work'); setSeconds(workSec); setRunning(true); }, [workSec]);
  const toggle = useCallback(() => {
    setRunning(r => {
      if (!r && phase === 'idle') { setPhase('work'); setSeconds(workSec); }
      return !r;
    });
  }, [phase, workSec]);
  const reset  = useCallback(() => {
    setRunning(false);
    setPhase('idle');
    setSeconds(workSec);
    setRounds(0);
  }, [workSec]);

  const progress = phase === 'work'
    ? 1 - (secondsLeft / workSec)
    : 1 - (secondsLeft / restSec);

  return {
    running,
    phase,
    secondsLeft,
    roundsDone,
    progress,
    isComplete: roundsDone >= totalRounds,
    toggle,
    start,
    reset,
  };
}
