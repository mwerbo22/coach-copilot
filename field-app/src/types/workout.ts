// ─── Prep block ────────────────────────────────────────────────────────────

export interface PrepItem {
  id: string;
  name: string;
  detail: string;
  rounds?: number;
}

export interface PrepBlock {
  id: string;
  type: 'prep';
  label: string;
  eyebrow: string;
  items: PrepItem[];
}

// ─── Strength block ────────────────────────────────────────────────────────

export type Trend = 'up' | 'pr' | 'same';

export interface StrengthExercise {
  id: string;
  ltr: string;          // e.g. "A", "B1"
  name: string;
  sets: number;
  reps: string;         // can be "5" or "8–10"
  wt: string;           // e.g. "185 lbs" or "@80%"
  last: string;         // e.g. "4×5"
  lastWt: string;       // e.g. "@180"
  best: string;
  bestWt: string;
  trend: Trend;
}

export interface StrengthBlock {
  id: string;
  type: 'strength';
  label: string;
  eyebrow: string;
  exercises: StrengthExercise[];
}

// ─── Conditioning block ────────────────────────────────────────────────────

export type CondFormat = 'emom' | 'interval' | 'rounds';

export interface CondExercise {
  marker: string;   // e.g. "ODD", "EVEN", "–"
  name: string;
  val: string;      // e.g. "15 reps", "10 / side"
}

export interface IntervalConfig {
  work: number;   // seconds
  rest: number;   // seconds
}

export interface ConditioningBlock {
  id: string;
  type: 'conditioning';
  label: string;
  eyebrow: string;
  format: CondFormat;
  title: string;
  duration?: number;          // minutes — used by emom
  interval?: IntervalConfig;  // used by interval
  roundsTotal?: number;       // used by rounds
  exercises: CondExercise[];
}

// ─── Union & Workout ────────────────────────────────────────────────────────

export type WorkoutBlock = PrepBlock | StrengthBlock | ConditioningBlock;

export interface Workout {
  id: string;
  title: string;
  date: string;           // ISO date string
  blocks: WorkoutBlock[];
}

// ─── Runtime state ─────────────────────────────────────────────────────────

export interface WorkoutState {
  prepDone: Record<string, boolean>;      // prepItem.id -> checked
  sets: Record<string, boolean[]>;        // exercise.id -> per-set logged
  condRoundsDone: number;
  emomRunning: boolean;
  emomSec: number;
  emomMinute: number;
}

export type WorkoutAction =
  | { type: 'TOGGLE_PREP_ITEM'; itemId: string }
  | { type: 'TOGGLE_SET'; exerciseId: string; setIndex: number }
  | { type: 'SET_COND_ROUNDS'; rounds: number }
  | { type: 'TOGGLE_EMOM' }
  | { type: 'EMOM_TICK' }
  | { type: 'RESET_EMOM' };
