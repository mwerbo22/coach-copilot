'use client';

import { useReducer, useCallback } from 'react';
import type { Workout, WorkoutState, WorkoutAction, StrengthBlock } from '@/types/workout';

function initState(workout: Workout): WorkoutState {
  const sets: Record<string, boolean[]> = {};
  workout.blocks.forEach(block => {
    if (block.type === 'strength') {
      (block as StrengthBlock).exercises.forEach(ex => {
        sets[ex.id] = new Array(ex.sets).fill(false);
      });
    }
  });
  return {
    prepDone: {},
    sets,
    condRoundsDone: 0,
    emomRunning: false,
    emomSec: 0,
    emomMinute: 1,
  };
}

function reducer(state: WorkoutState, action: WorkoutAction): WorkoutState {
  switch (action.type) {
    case 'TOGGLE_PREP_ITEM':
      return {
        ...state,
        prepDone: {
          ...state.prepDone,
          [action.itemId]: !state.prepDone[action.itemId],
        },
      };

    case 'TOGGLE_SET': {
      const prev = state.sets[action.exerciseId];
      const next = prev.map((v, i) => i === action.setIndex ? !v : v);
      return { ...state, sets: { ...state.sets, [action.exerciseId]: next } };
    }

    case 'SET_COND_ROUNDS':
      return { ...state, condRoundsDone: action.rounds };

    case 'TOGGLE_EMOM':
      return { ...state, emomRunning: !state.emomRunning };

    case 'EMOM_TICK': {
      const next = state.emomSec + 1;
      const minute = Math.floor(next / 60) + 1;
      return { ...state, emomSec: next, emomMinute: minute };
    }

    case 'RESET_EMOM':
      return { ...state, emomRunning: false, emomSec: 0, emomMinute: 1 };

    default:
      return state;
  }
}

export function useWorkoutState(workout: Workout) {
  const [state, dispatch] = useReducer(reducer, workout, initState);

  const togglePrepItem  = useCallback((itemId: string) => dispatch({ type: 'TOGGLE_PREP_ITEM', itemId }), []);
  const toggleSet       = useCallback((exerciseId: string, setIndex: number) => dispatch({ type: 'TOGGLE_SET', exerciseId, setIndex }), []);
  const setCondRounds   = useCallback((rounds: number) => dispatch({ type: 'SET_COND_ROUNDS', rounds }), []);
  const toggleEmom      = useCallback(() => dispatch({ type: 'TOGGLE_EMOM' }), []);
  const tickEmom        = useCallback(() => dispatch({ type: 'EMOM_TICK' }), []);
  const resetEmom       = useCallback(() => dispatch({ type: 'RESET_EMOM' }), []);

  // Derived: overall progress %
  const prepBlock   = workout.blocks.find(b => b.type === 'prep');
  const strBlock    = workout.blocks.find(b => b.type === 'strength');
  const condBlock   = workout.blocks.find(b => b.type === 'conditioning');

  const prepTotal   = prepBlock ? (prepBlock as any).items.length : 0;
  const prepDoneN   = Object.values(state.prepDone).filter(Boolean).length;

  const setsTotal   = strBlock ? (strBlock as any).exercises.reduce((sum: number, ex: any) => sum + ex.sets, 0) : 0;
  const setsDoneN   = Object.values(state.sets).flat().filter(Boolean).length;

  const condTotal   = condBlock
    ? (condBlock as any).format === 'rounds'
      ? (condBlock as any).roundsTotal ?? 0
      : (condBlock as any).duration ?? 0
    : 0;

  const totalSteps  = prepTotal + setsTotal + condTotal;
  const doneSteps   = prepDoneN + setsDoneN + state.condRoundsDone;
  const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  return {
    state,
    progressPct,
    togglePrepItem,
    toggleSet,
    setCondRounds,
    toggleEmom,
    tickEmom,
    resetEmom,
  };
}
