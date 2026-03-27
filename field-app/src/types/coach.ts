// ─── Roster ────────────────────────────────────────────────────────────────

export interface RosterAthlete {
  id: string;
  name: string;
  program: string;
  compliance: number;   // 0–100
  trend: 'up' | 'down' | 'flat';
  prCount: number;
  lastSession?: string; // ISO date string
  tags: string[];
}

// ─── Program builder (CoaHOS) ──────────────────────────────────────────────

export interface ProgramDay {
  id: number;
  title: string;
  subtitle: string;
  content: string;      // raw freeform workout text
}

export interface ProgramWeek {
  id: number;
  label: string;        // e.g. "Accumulation"
  days: ProgramDay[];
}

export interface ParsedExercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  pct?: number;
  tempo?: string;
  raw: string;
}

export interface ParsedBlock {
  type: 'prep' | 'strength' | 'conditioning' | 'other';
  format?: 'emom' | 'amrap' | 'rounds';
  formatDetail?: string;   // e.g. "12min", "3 rounds"
  exercises: ParsedExercise[];
}

export type BlockPillType = 'prep' | 'strength' | 'conditioning' | 'rest' | 'mixed';
