// ─── Log screen ────────────────────────────────────────────────────────────

export type BadgeType = 'up' | 'pr' | 'same';

export interface LogResult {
  sets: number;
  reps: number;
  weight: number;
  isPlus: boolean;  // e.g. +25 lbs bodyweight add
}

export interface LogExercise {
  id: string;
  name: string;
  target: string;     // e.g. "4×5"
  targetWt: string;   // e.g. "@185lbs"
  last: string;       // e.g. "4×5"
  lastWt: string;     // e.g. "@180lbs"
  est: LogResult;
  badge: string;
  badgeType: BadgeType;
  chips: string[];    // quick-feel labels
}

// ─── Progress screen ────────────────────────────────────────────────────────

export type ProgressPeriod = '4w' | '3m' | '6m' | '1y';

export interface ProgressPeriodData {
  labels: string[];
  squat: number[];
  dead:  number[];
  bench: number[];
  ohp:   number[];
  mob:   number[];
  squatCurrent: string;
  squatChange:  string;
  pressCurrent: string;
  pressChange:  string;
  streakSub:    string;
  prHits:       boolean[];
}

export type MobilityColor = 'teal' | 'gold' | 'rose';

export interface MobilityItem {
  label: string;
  score: number;  // 0-100
  color: MobilityColor;
}

export interface PRLift {
  name:   string;
  weight: string;
  unit:   string;
  change: string;
  data:   number[];
}
