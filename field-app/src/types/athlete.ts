export interface PREntry {
  lift: string;
  value: string;    // e.g. "315 lbs"
  date: string;
}

export interface ProgressDataPoint {
  label: string;    // e.g. "W1", "Jan 6"
  value: number;
}

export interface Athlete {
  id: string;
  name: string;
  program: string;
  compliance: number;   // 0–100
  trend: 'up' | 'down' | 'flat';
  prs: PREntry[];
  progressData: ProgressDataPoint[];
}
