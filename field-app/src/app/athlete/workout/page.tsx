'use client';

import { useMemo } from 'react';
import { TODAY_WORKOUT } from '@/lib/sampleData';
import { useElapsedTimer } from '@/hooks/useElapsedTimer';
import { useWorkoutState } from '@/hooks/useWorkoutState';
import WorkoutHeader from '@/components/athlete/workout/WorkoutHeader';
import SessionRail from '@/components/athlete/workout/SessionRail';
import PrepBlock from '@/components/athlete/workout/blocks/PrepBlock';
import StrengthBlock from '@/components/athlete/workout/blocks/StrengthBlock';
import ConditioningBlock from '@/components/athlete/workout/blocks/ConditioningBlock';
import WorkoutCTA from '@/components/athlete/workout/WorkoutCTA';
import type { PrepBlock as PrepBlockType, StrengthBlock as StrengthBlockType, ConditioningBlock as CondBlockType } from '@/types/workout';

type BlockStatus = 'done' | 'active' | 'next' | 'later';

export default function WorkoutPage() {
  const workout = TODAY_WORKOUT;
  const timer = useElapsedTimer(true);
  const {
    state,
    progressPct,
    togglePrepItem,
    toggleSet,
    setCondRounds,
    toggleEmom,
    tickEmom,
    resetEmom,
  } = useWorkoutState(workout);

  // Derive block status
  function getStatus(blockId: string): BlockStatus {
    const block = workout.blocks.find(b => b.id === blockId);
    if (!block) return 'later';

    if (block.type === 'prep') {
      const items = (block as PrepBlockType).items;
      const doneCount = items.filter(i => state.prepDone[i.id]).length;
      if (doneCount === items.length) return 'done';
      if (doneCount > 0) return 'active';
      return 'active';
    }

    if (block.type === 'strength') {
      const exs = (block as StrengthBlockType).exercises;
      const totalSets = exs.reduce((s, e) => s + e.sets, 0);
      const doneSets  = Object.values(state.sets).flat().filter(Boolean).length;
      if (doneSets === totalSets) return 'done';
      if (doneSets > 0) return 'active';
      const prepBlock = workout.blocks.find(b => b.type === 'prep');
      if (prepBlock) {
        const status = getStatus(prepBlock.id);
        return status === 'done' ? 'next' : 'later';
      }
      return 'next';
    }

    if (block.type === 'conditioning') {
      const condBlock = block as CondBlockType;
      if (condBlock.format === 'emom' && state.emomSec > 0) return 'active';
      if (condBlock.format === 'rounds' && state.condRoundsDone > 0) return 'active';
      const strBlock = workout.blocks.find(b => b.type === 'strength');
      if (strBlock && getStatus(strBlock.id) === 'done') return 'next';
      return 'later';
    }

    return 'later';
  }

  // CTA logic
  const { ctaHint, ctaLabel, ctaDisabled } = useMemo(() => {
    const activeBlock = workout.blocks.find(b => getStatus(b.id) === 'active' || getStatus(b.id) === 'next');
    if (!activeBlock) return { ctaHint: 'All blocks complete!', ctaLabel: 'Finish & Log', ctaDisabled: false };

    if (activeBlock.type === 'prep') {
      const items = (activeBlock as PrepBlockType).items;
      const doneCount = items.filter(i => state.prepDone[i.id]).length;
      return {
        ctaHint: `${doneCount} of ${items.length} prep items checked`,
        ctaLabel: doneCount === items.length ? 'Move to Strength →' : 'Complete Prep First',
        ctaDisabled: doneCount < items.length,
      };
    }
    if (activeBlock.type === 'strength') {
      const exs = (activeBlock as StrengthBlockType).exercises;
      const totalSets = exs.reduce((s, e) => s + e.sets, 0);
      const doneSets = Object.values(state.sets).flat().filter(Boolean).length;
      return {
        ctaHint: `${doneSets} of ${totalSets} sets logged`,
        ctaLabel: doneSets === totalSets ? 'Move to Conditioning →' : 'Log Your Sets',
        ctaDisabled: doneSets < totalSets,
      };
    }
    return { ctaHint: 'Start your conditioning block', ctaLabel: 'Finish & Log', ctaDisabled: false };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, workout.blocks]);

  // Current/next labels for rail
  const activeIdx  = workout.blocks.findIndex(b => getStatus(b.id) === 'active');
  const currentLabel = workout.blocks[activeIdx]?.label ?? workout.blocks[workout.blocks.length - 1]?.label ?? '';
  const nextLabel    = workout.blocks[activeIdx + 1]?.label ?? null;

  return (
    <div className="flex flex-col h-full">
      <WorkoutHeader
        title={workout.title}
        formatted={timer.formatted}
        running={timer.running}
        onToggle={timer.toggle}
      />

      <SessionRail
        blocks={workout.blocks}
        getStatus={getStatus}
        progressPct={progressPct}
        currentLabel={currentLabel}
        nextLabel={nextLabel}
      />

      {/* Scrollable blocks */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {workout.blocks.map((block) => {
          if (block.type === 'prep') {
            return (
              <PrepBlock
                key={block.id}
                block={block as PrepBlockType}
                prepDone={state.prepDone}
                onToggle={togglePrepItem}
              />
            );
          }
          if (block.type === 'strength') {
            return (
              <StrengthBlock
                key={block.id}
                block={block as StrengthBlockType}
                sets={state.sets}
                onToggleSet={toggleSet}
              />
            );
          }
          if (block.type === 'conditioning') {
            return (
              <ConditioningBlock
                key={block.id}
                block={block as CondBlockType}
                emomRunning={state.emomRunning}
                emomSec={state.emomSec}
                emomMinute={state.emomMinute}
                condRoundsDone={state.condRoundsDone}
                onToggleEmom={toggleEmom}
                onTickEmom={tickEmom}
                onResetEmom={resetEmom}
                onSetCondRounds={setCondRounds}
              />
            );
          }
          return null;
        })}
      </div>

      <WorkoutCTA
        hint={ctaHint}
        label={ctaLabel}
        disabled={ctaDisabled}
        onAction={() => {/* navigate to log */}}
      />
    </div>
  );
}
