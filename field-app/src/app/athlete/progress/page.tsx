'use client';

import { useState } from 'react';
import { PROGRESS_PERIODS, MOBILITY_ITEMS, PR_LIFTS } from '@/lib/sampleData';
import type { ProgressPeriod } from '@/types/log';

// ─── SVG curve path helper ───────────────────────────────────────────────────

function curvePath(
  data: number[],
  W: number, H: number,
  px = 16, py = 10,
): { d: string; pts: [number, number][] } {
  const mn = Math.min(...data) * 0.97;
  const mx = Math.max(...data) * 1.015;
  const xStep = (W - px * 2) / (data.length - 1);
  const pts: [number, number][] = data.map((v, i) => [
    px + i * xStep,
    py + (1 - (v - mn) / (mx - mn)) * (H - py * 2),
  ]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return { d, pts };
}

function sparkPath(data: number[], W = 44, H = 18): string {
  const mn = Math.min(...data) * 0.95;
  const mx = Math.max(...data) * 1.02;
  const xStep = W / (data.length - 1);
  const pts: [number, number][] = data.map((v, i) => [
    i * xStep,
    (H - 2) - ((v - mn) / (mx - mn)) * (H - 4),
  ]);
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

// ─── Chart card ──────────────────────────────────────────────────────────────

const CHART_H = 100;
const CHART_W = 326; // ~390 - 32px padding * 2 - borders

interface ChartDataset {
  data: number[];
  color: string;
  areaColor: string;
  label: string;
}

function ChartCard({
  title,
  current,
  change,
  datasets,
  xLabels,
}: {
  title: string;
  current: string;
  change: string;
  datasets: ChartDataset[];
  xLabels: string[];
}) {
  return (
    <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden mb-2.5">
      <div className="flex items-start justify-between px-4 pt-4 pb-1">
        <h3 className="text-[17px] font-[var(--ffs)] italic text-[var(--text)] leading-tight">{title}</h3>
        <div className="text-right">
          <p className="text-[15px] font-mono text-[var(--text)] leading-none">{current}</p>
          <p className="text-[11px] font-semibold text-[var(--teal)] mt-0.5">{change}</p>
        </div>
      </div>

      {/* SVG chart */}
      <div className="px-0 pt-2">
        <svg
          viewBox={`0 0 ${CHART_W + 32} ${CHART_H}`}
          className="w-full block overflow-visible"
          style={{ height: CHART_H }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3].map(i => {
            const y = 10 + (i / 3) * (CHART_H - 20);
            return (
              <line key={i} x1={16} x2={CHART_W + 16} y1={y} y2={y}
                stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            );
          })}

          {datasets.map((ds, di) => {
            const { d, pts } = curvePath(ds.data, CHART_W + 32, CHART_H, 16, 10);
            const last  = pts[pts.length - 1];
            const first = pts[0];
            const areaD = `${d} L ${last[0]},${CHART_H - 10} L ${first[0]},${CHART_H - 10} Z`;
            return (
              <g key={di}>
                <path d={areaD} fill={ds.areaColor} />
                <path d={d} fill="none" stroke={ds.color} strokeWidth="2" strokeLinecap="round" />
                {pts.map(([x, y], pi) => {
                  const isLast = pi === pts.length - 1;
                  return (
                    <circle
                      key={pi}
                      cx={x} cy={y}
                      r={isLast ? 4 : 2.5}
                      fill={isLast ? ds.color : 'var(--bg)'}
                      stroke={ds.color}
                      strokeWidth={isLast ? 0 : 1.5}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* X labels */}
      <div className="flex justify-between px-4 pb-3 pt-1">
        {xLabels.map(l => (
          <span key={l} className="text-[9.5px] font-mono text-[var(--text3)]">{l}</span>
        ))}
      </div>

      {/* Legend */}
      {datasets.length > 1 && (
        <div className="flex gap-4 px-4 pb-3 pt-1 border-t border-[var(--border2)]">
          {datasets.map(ds => (
            <div key={ds.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: ds.color }} />
              <span className="text-[11px] text-[var(--text2)]">{ds.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PR streak bars ──────────────────────────────────────────────────────────

function PRStreakCard({ hits, streakSub }: { hits: boolean[]; streakSub: string }) {
  const slice = hits.slice(-12);
  return (
    <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] px-4 py-4 mb-2.5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-[16px] font-[var(--ffs)] italic text-[var(--text)]">PR Streak</h3>
        <span className="text-[10px] font-mono text-[var(--text3)]">{streakSub}</span>
      </div>
      <div className="flex items-end gap-1 h-10">
        {slice.map((hit, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[3px] transition-all"
            style={{
              height: hit ? `${60 + (i % 3) * 15}%` : '22%',
              background: hit ? 'var(--gold)' : 'var(--s4)',
            }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5">
        {slice.map((_, i) => (
          <span key={i} className="flex-1 text-center text-[8.5px] font-mono text-[var(--text3)]">
            W{slice.length - i}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Mobility grid ────────────────────────────────────────────────────────────

const MOB_COLOR: Record<string, string> = {
  teal: 'var(--teal)',
  gold: 'var(--gold)',
  rose: 'var(--rose)',
};

function MobilitySection() {
  return (
    <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden mb-2.5">
      <div className="px-4 pt-4 pb-3 border-b border-[var(--border2)]">
        <h3 className="text-[16px] font-[var(--ffs)] italic text-[var(--text)]">Mobility</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-4 px-4 py-4">
        {MOBILITY_ITEMS.map(item => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--text2)] font-medium">{item.label}</span>
              <span className="text-[10px] font-mono text-[var(--text3)]">{item.score}/100</span>
            </div>
            <div className="h-1 rounded-full bg-[var(--s4)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-[1s]"
                style={{ width: `${item.score}%`, background: MOB_COLOR[item.color] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Lifts table ──────────────────────────────────────────────────────────────

function LiftsTable() {
  return (
    <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden mb-2.5">
      <div className="flex items-baseline justify-between px-4 py-3 border-b border-[var(--border2)]">
        <h3 className="text-[16px] font-[var(--ffs)] italic text-[var(--text)]">Personal Records</h3>
        <span className="text-[10px] font-mono text-[var(--text3)] tracking-wider">1RM EST.</span>
      </div>
      {PR_LIFTS.map((lift, i) => {
        const sp = sparkPath(lift.data);
        const lastPt: [number, number] = [
          (lift.data.length - 1) * (44 / (lift.data.length - 1)),
          (18 - 2) - ((lift.data[lift.data.length - 1] - Math.min(...lift.data) * 0.95) /
            (Math.max(...lift.data) * 1.02 - Math.min(...lift.data) * 0.95)) * 14,
        ];
        return (
          <div
            key={lift.name}
            className="flex items-center gap-3 px-4 py-2.5 border-t border-[var(--border2)]"
          >
            <span className="text-[10px] font-mono text-[var(--text3)] w-5 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="flex-1 text-[13px] font-medium text-[var(--text)] truncate">{lift.name}</span>
            <span className="text-[13px] font-mono text-[var(--text)] w-16 text-right shrink-0">
              {lift.weight} <span className="text-[9.5px] text-[var(--text3)]">{lift.unit}</span>
            </span>
            <span className="text-[11px] font-semibold text-[var(--teal)] w-12 text-right shrink-0">
              ↑ {lift.change}
            </span>
            <svg viewBox="0 0 44 20" className="w-11 h-[18px] shrink-0 ml-2">
              <path d={sp} fill="none" stroke="var(--teal)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx={lastPt[0]} cy={lastPt[1]} r="2" fill="var(--teal)" />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hero stat cards ─────────────────────────────────────────────────────────

function HeroRow({ squatCurrent, squatChange, pressCurrent, pressChange }: {
  squatCurrent: string; squatChange: string;
  pressCurrent: string; pressChange: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 mb-2.5">
      {[
        { label: 'Top Squat', val: squatCurrent, chg: squatChange, accent: 'ph-gold', color: 'var(--gold)' },
        { label: 'Top Press', val: pressCurrent, chg: pressChange, accent: 'ph-teal', color: 'var(--teal)' },
      ].map(h => (
        <div
          key={h.label}
          className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] px-3.5 py-3.5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${h.color}, transparent)` }} />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text2)] mb-1.5">{h.label}</p>
          <p className="text-[30px] leading-none font-[var(--ffs)] italic mb-1" style={{ color: h.color }}>
            {h.val.split(' ')[0]}
          </p>
          <p className="text-[10px] font-mono text-[var(--text2)] mb-1">{h.val.split(' ')[1]}</p>
          <p className="text-[11px] font-semibold" style={{ color: h.color }}>{h.chg}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const PERIODS: { key: ProgressPeriod; label: string }[] = [
  { key: '4w', label: '4W' },
  { key: '3m', label: '3M' },
  { key: '6m', label: '6M' },
  { key: '1y', label: '1Y' },
];

export default function ProgressPage() {
  const [period, setPeriod] = useState<ProgressPeriod>('3m');
  const p = PROGRESS_PERIODS[period];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-end justify-between px-4 pt-4 pb-4 shrink-0">
        <h1 className="text-[28px] font-[var(--ffs)] text-[var(--text)] leading-none">
          Your <em className="italic text-[var(--gold)]">Progress</em>
        </h1>
        {/* Period toggle */}
        <div className="flex items-center bg-[var(--s2)] border border-[var(--border)] rounded-full p-0.5 gap-0.5">
          {PERIODS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`text-[10px] font-mono px-2.5 py-1.5 rounded-full transition-all ${
                period === key
                  ? 'bg-[var(--s3)] text-[var(--text)] border border-[var(--border)]'
                  : 'text-[var(--text2)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 flex flex-col">
        <HeroRow
          squatCurrent={p.squatCurrent}
          squatChange={p.squatChange}
          pressCurrent={p.pressCurrent}
          pressChange={p.pressChange}
        />

        <ChartCard
          title="Strength"
          current={p.squatCurrent}
          change={p.squatChange}
          xLabels={p.labels}
          datasets={[
            { data: p.squat, color: 'var(--gold)', areaColor: 'rgba(212,168,75,.07)',  label: 'Squat' },
            { data: p.dead,  color: 'var(--teal)', areaColor: 'rgba(78,201,176,.06)', label: 'Deadlift' },
          ]}
        />

        <ChartCard
          title="Press"
          current={p.pressCurrent}
          change={p.pressChange}
          xLabels={p.labels}
          datasets={[
            { data: p.bench, color: 'var(--gold)', areaColor: 'rgba(212,168,75,.07)',  label: 'Bench' },
            { data: p.ohp,   color: 'var(--rose)', areaColor: 'rgba(248,113,113,.06)', label: 'OHP' },
          ]}
        />

        <ChartCard
          title="Mobility Score"
          current={`${p.mob[p.mob.length - 1]}/100`}
          change={`↑ +${p.mob[p.mob.length - 1] - p.mob[0]}`}
          xLabels={p.labels}
          datasets={[
            { data: p.mob, color: 'var(--teal)', areaColor: 'rgba(78,201,176,.08)', label: 'Score' },
          ]}
        />

        <PRStreakCard hits={p.prHits} streakSub={p.streakSub} />

        <MobilitySection />

        <LiftsTable />
      </div>
    </div>
  );
}
