import type { Workout } from '@/types/workout';
import type { RosterAthlete, ProgramWeek } from '@/types/coach';
import type { LogExercise, ProgressPeriodData } from '@/types/log';

// ─── Today's workout ────────────────────────────────────────────────────────

export const TODAY_WORKOUT: Workout = {
  id: 'w-2026-03-23',
  title: 'Upper Push · Week 3',
  date: '2026-03-23',
  blocks: [
    {
      id: 'prep',
      type: 'prep',
      label: 'Prep & Mobility',
      eyebrow: 'Section 01',
      items: [
        { id: 'p1', name: 'Hip 90/90 Stretch',  detail: '2 rounds · 45s / side', rounds: 2 },
        { id: 'p2', name: 'Band Pull-Aparts',    detail: '2 × 15 reps',           rounds: 2 },
        { id: 'p3', name: 'Scapular Push-Ups',   detail: '2 × 12 reps · controlled', rounds: 2 },
        { id: 'p4', name: 'Dead Bugs',           detail: '2 × 10 reps · 3s lower', rounds: 2 },
      ],
    },
    {
      id: 'strength',
      type: 'strength',
      label: 'Strength',
      eyebrow: 'Section 02',
      exercises: [
        { id: 's1', ltr: 'A', name: 'Barbell Bench Press', sets: 4, reps: '5',    wt: '185 lbs', last: '4×5',  lastWt: '@180', best: '4×5', bestWt: '@185', trend: 'up' },
        { id: 's2', ltr: 'B', name: 'Weighted Pull-Up',    sets: 4, reps: '5',    wt: '+25 lbs', last: '4×4',  lastWt: '@+25', best: '4×5', bestWt: '@+25', trend: 'pr' },
        { id: 's3', ltr: 'C', name: 'Incline DB Press',    sets: 3, reps: '8–10', wt: '65 lbs',  last: '3×9',  lastWt: '@65',  best: '3×10',bestWt: '@65',  trend: 'same' },
        { id: 's4', ltr: 'D', name: 'Cable Seated Row',    sets: 3, reps: '12',   wt: '120 lbs', last: '3×12', lastWt: '@115', best: '3×12',bestWt: '@120', trend: 'up' },
        { id: 's5', ltr: 'E', name: 'Overhead Press',      sets: 3, reps: '6–8',  wt: '115 lbs', last: '3×7',  lastWt: '@115', best: '3×8', bestWt: '@115', trend: 'same' },
      ],
    },
    {
      id: 'cond',
      type: 'conditioning',
      label: 'Conditioning',
      eyebrow: 'Section 03',
      format: 'emom',
      title: 'Upper Finisher',
      duration: 10,
      exercises: [
        { marker: 'ODD',  name: 'Push-Ups',     val: '15 reps' },
        { marker: 'EVEN', name: 'Dumbbell Row', val: '10 / side' },
      ],
    },
  ],
};

// ─── Log exercises ──────────────────────────────────────────────────────────

export const LOG_EXERCISES: LogExercise[] = [
  { id: 'l1', name: 'Barbell Bench Press', target: '4×5', targetWt: '@185lbs', last: '4×5', lastWt: '@180lbs', est: { sets: 4, reps: 5, weight: 185, isPlus: false }, badge: '↑ +5 lbs', badgeType: 'up',   chips: ['Felt strong', 'Tough', 'Good form'] },
  { id: 'l2', name: 'Weighted Pull-Up',    target: '4×5', targetWt: '@+25lbs', last: '4×4', lastWt: '@+25lbs', est: { sets: 4, reps: 5, weight: 25,  isPlus: true  }, badge: '★ PR target', badgeType: 'pr',   chips: ['Felt strong', 'Grind', 'Tough'] },
  { id: 'l3', name: 'Incline DB Press',    target: '3×10',targetWt: '@65lbs',  last: '3×9', lastWt: '@65lbs',  est: { sets: 3, reps: 10,weight: 65,  isPlus: false }, badge: '→ Same',      badgeType: 'same', chips: ['Felt strong', 'Tough', 'Left tight'] },
  { id: 'l4', name: 'Cable Seated Row',    target: '3×12',targetWt: '@120lbs', last: '3×12',lastWt: '@115lbs', est: { sets: 3, reps: 12,weight: 120, isPlus: false }, badge: '↑ +5 lbs',   badgeType: 'up',   chips: ['Easy', 'Good form', 'Tough'] },
  { id: 'l5', name: 'Overhead Press',      target: '3×8', targetWt: '@115lbs', last: '3×7', lastWt: '@115lbs', est: { sets: 3, reps: 8, weight: 115, isPlus: false }, badge: '→ Same',      badgeType: 'same', chips: ['Tough', 'Shoulder tight', 'Good form'] },
];

// ─── Progress data ──────────────────────────────────────────────────────────

export const PROGRESS_PERIODS: Record<string, ProgressPeriodData> = {
  '4w': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    squat:  [265, 270, 275, 280],
    dead:   [305, 310, 315, 315],
    bench:  [175, 180, 185, 185],
    ohp:    [105, 105, 110, 110],
    mob:    [68, 69, 71, 74],
    squatCurrent: '280 lbs', squatChange: '↑ +15',
    pressCurrent: '185 lbs', pressChange: '↑ +10',
    streakSub: '3 of 4 weeks',
    prHits: [true, true, false, true],
  },
  '3m': {
    labels: ['Jan', 'Feb', 'Mar'],
    squat:  [280, 295, 310, 315],
    dead:   [295, 305, 310, 315],
    bench:  [185, 190, 200, 205],
    ohp:    [110, 115, 118, 120],
    mob:    [65, 68, 71, 74],
    squatCurrent: '315 lbs', squatChange: '↑ +35',
    pressCurrent: '205 lbs', pressChange: '↑ +20',
    streakSub: '8 of 12 weeks',
    prHits: Array.from({ length: 12 }, (_, i) => i % 3 !== 2),
  },
  '6m': {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    squat:  [250, 260, 270, 285, 300, 315],
    dead:   [275, 285, 295, 305, 310, 315],
    bench:  [170, 175, 185, 190, 200, 205],
    ohp:    [100, 105, 108, 112, 115, 120],
    mob:    [60, 62, 65, 68, 71, 74],
    squatCurrent: '315 lbs', squatChange: '↑ +65',
    pressCurrent: '205 lbs', pressChange: '↑ +35',
    streakSub: '14 of 24 weeks',
    prHits: Array.from({ length: 24 }, (_, i) => i % 3 !== 2),
  },
  '1y': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    squat:  [230, 255, 285, 315],
    dead:   [250, 275, 300, 315],
    bench:  [165, 180, 195, 205],
    ohp:    [90, 100, 110, 120],
    mob:    [55, 62, 68, 74],
    squatCurrent: '315 lbs', squatChange: '↑ +85',
    pressCurrent: '205 lbs', pressChange: '↑ +40',
    streakSub: '28 of 52 weeks',
    prHits: Array.from({ length: 24 }, (_, i) => Math.sin(i) > 0),
  },
};

export const MOBILITY_ITEMS = [
  { label: 'Hip Flexion',  score: 82, color: 'teal' as const },
  { label: 'Shoulder',     score: 70, color: 'gold' as const },
  { label: 'Ankle',        score: 55, color: 'rose' as const },
  { label: 'T-Spine',      score: 78, color: 'teal' as const },
  { label: 'Hip Ext.',     score: 65, color: 'gold' as const },
  { label: 'Wrist',        score: 80, color: 'teal' as const },
];

export const PR_LIFTS = [
  { name: 'Back Squat',  weight: '315', unit: 'lbs', change: '+35', data: [250, 265, 280, 295, 310, 315] },
  { name: 'Deadlift',    weight: '385', unit: 'lbs', change: '+40', data: [295, 315, 340, 360, 375, 385] },
  { name: 'Bench Press', weight: '225', unit: 'lbs', change: '+20', data: [175, 185, 195, 205, 218, 225] },
  { name: 'Pull-Up',     weight: '+55', unit: 'lbs', change: '+10', data: [25, 30, 35, 40, 45, 55] },
  { name: 'OHP',         weight: '135', unit: 'lbs', change: '+15', data: [100, 108, 115, 120, 128, 135] },
];

// ─── Roster athletes ────────────────────────────────────────────────────────

export const ROSTER_ATHLETES: RosterAthlete[] = [
  { id: 'a1', name: 'Alex Johnson',  program: 'Strength Block A', compliance: 92, trend: 'up',   prCount: 3, lastSession: '2026-03-22', tags: ['strength'] },
  { id: 'a2', name: 'Sam Rivera',    program: 'Hypertrophy Vol.2', compliance: 78, trend: 'flat', prCount: 1, lastSession: '2026-03-21', tags: ['hypertrophy'] },
  { id: 'a3', name: 'Jordan Lee',    program: 'Strength Block A', compliance: 85, trend: 'up',   prCount: 2, lastSession: '2026-03-22', tags: ['strength'] },
  { id: 'a4', name: 'Casey Kim',     program: 'Peaking Phase',    compliance: 61, trend: 'down', prCount: 0, lastSession: '2026-03-19', tags: ['peaking'] },
  { id: 'a5', name: 'Morgan Davis',  program: 'Off-Season Base',  compliance: 95, trend: 'up',   prCount: 5, lastSession: '2026-03-22', tags: ['base'] },
  { id: 'a6', name: 'Taylor Brooks', program: 'Hypertrophy Vol.2', compliance: 72, trend: 'flat', prCount: 0, lastSession: '2026-03-20', tags: ['hypertrophy'] },
];

// ─── Program weeks ──────────────────────────────────────────────────────────

export const PROGRAM_WEEKS: ProgramWeek[] = [
  {
    id: 1, label: 'Accumulation',
    days: [
      { id: 1, title: 'Day 1', subtitle: 'Upper Push', content: '// PREP\nFoam Roll - Quads, Lats, T-Spine\nHip 90/90 x 5 reps per side\nBand Pull-Aparts 2x15\n\n// STRENGTH\nA1. Back Squat 4x5 @80%\nA2. Tempo RDL 4x8 3011 tempo\nB1. Front Foot Elevated Split Squat 3x10/leg\nB2. Hip Thrust 3x12 @70%\n\n// CONDITIONING\nEMOM 12min\n- Odd: 5 Power Cleans @135lbs\n- Even: 10 Box Jumps 24"' },
      { id: 2, title: 'Day 2', subtitle: 'Lower Pull', content: '// PREP\nThoracic Spine Rotations 2x8/side\nDead Bugs 2x10\n\n// STRENGTH\nA1. Deadlift 5x3 @85%\nA2. Weighted Pull-Up 5x5\nB1. Barbell Row 4x8 @70%\n\n// CONDITIONING\n3 Rounds, 2min rest\n- 400m Run\n- 15 KB Swings @53lbs\n- 10 Push-Ups' },
      { id: 3, title: 'Day 3', subtitle: 'Full Body', content: '' },
      { id: 4, title: 'Day 4', subtitle: 'Recovery',  content: '' },
    ],
  },
  { id: 2, label: 'Intensification', days: [{ id: 1, title: 'Day 1', subtitle: 'Upper Push', content: '' }, { id: 2, title: 'Day 2', subtitle: 'Lower Pull', content: '' }, { id: 3, title: 'Day 3', subtitle: 'Full Body', content: '' }] },
  { id: 3, label: 'Realization',     days: [{ id: 1, title: 'Day 1', subtitle: 'Test Day A', content: '' }, { id: 2, title: 'Day 2', subtitle: 'Test Day B', content: '' }] },
  { id: 4, label: 'Deload',          days: [{ id: 1, title: 'Day 1', subtitle: 'Light Upper', content: '' }, { id: 2, title: 'Day 2', subtitle: 'Light Lower', content: '' }] },
  { id: 5, label: 'Block B',         days: [{ id: 1, title: 'Day 1', subtitle: 'Upper Push', content: '' }, { id: 2, title: 'Day 2', subtitle: 'Lower Pull', content: '' }] },
  { id: 6, label: 'Peaking',         days: [{ id: 1, title: 'Day 1', subtitle: 'Comp Prep', content: '' }] },
];
