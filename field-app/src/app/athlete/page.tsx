import Link from 'next/link';
import { TODAY_WORKOUT } from '@/lib/sampleData';

const WEEK_DAYS = [
  { label: 'M', status: 'done' },
  { label: 'T', status: 'done' },
  { label: 'W', status: 'today' },
  { label: 'T', status: 'rest' },
  { label: 'F', status: 'pending' },
  { label: 'S', status: 'pending' },
  { label: 'S', status: 'rest' },
];

const RECENT_SESSIONS = [
  { label: 'Mon Mar 17', title: 'Lower Pull',   tag: 'strength', prs: 2 },
  { label: 'Tue Mar 18', title: 'Upper Push',   tag: 'strength', prs: 0 },
  { label: 'Thu Mar 20', title: 'Full Body',    tag: 'strength', prs: 1 },
  { label: 'Sat Mar 22', title: 'Lower Hypertrophy', tag: 'hypertrophy', prs: 0 },
];

const TAG_COLORS: Record<string, string> = {
  strength:    'text-[var(--blue)]   bg-[var(--blue-dim)]',
  hypertrophy: 'text-[var(--purple)] bg-[var(--purple-dim)]',
  conditioning:'text-[var(--orange)] bg-[var(--orange-dim)]',
};

export default function AthletePage() {
  const today = new Date();
  const greeting = today.getHours() < 12 ? 'Morning' : today.getHours() < 17 ? 'Afternoon' : 'Evening';

  return (
    <div className="flex flex-col gap-6 px-4 pt-2 pb-6">

      {/* ── Greeting ── */}
      <div className="pt-2">
        <p className="text-[var(--text2)] text-sm">Good {greeting}</p>
        <h1 className="text-2xl font-bold text-[var(--text)] leading-tight mt-0.5">
          Ready to train?
        </h1>
      </div>

      {/* ── Today's workout card ── */}
      <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-1">Today</p>
          <h2 className="text-lg font-bold text-[var(--text)]">{TODAY_WORKOUT.title}</h2>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text2)]">
            <span>{TODAY_WORKOUT.blocks.length} blocks</span>
            <span className="w-1 h-1 rounded-full bg-[var(--text3)]" />
            <span>
              {TODAY_WORKOUT.blocks.find(b => b.type === 'strength')
                ? `${(TODAY_WORKOUT.blocks.find(b => b.type === 'strength') as any).exercises.length} exercises`
                : ''}
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--text3)]" />
            <span>~60 min</span>
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[var(--border2)] flex gap-2">
          {TODAY_WORKOUT.blocks.map((b) => (
            <span
              key={b.id}
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-[var(--rxs)] ${
                b.type === 'prep'         ? 'text-[var(--green)]  bg-[var(--green-dim)]'
                : b.type === 'strength'  ? 'text-[var(--blue)]   bg-[var(--blue-dim)]'
                : 'text-[var(--orange)] bg-[var(--orange-dim)]'
              }`}
            >
              {b.type}
            </span>
          ))}
        </div>
        <Link
          href="/athlete/workout"
          className="block mx-4 mb-4 mt-1 rounded-[var(--rsm)] bg-[var(--lime)] text-[var(--bg)] font-bold text-sm text-center py-3 active:opacity-80 transition-opacity"
        >
          Start Session
        </Link>
      </div>

      {/* ── Week strip ── */}
      <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] px-4 py-3">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-3">This Week</p>
        <div className="flex justify-between">
          {WEEK_DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-[var(--text3)] font-semibold">{d.label}</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                d.status === 'done'    ? 'bg-[var(--lime-dim)] border border-[var(--lime)] text-[var(--lime)]'
                : d.status === 'today' ? 'bg-[var(--lime)] text-[var(--bg)]'
                : d.status === 'rest'  ? 'bg-[var(--s3)] text-[var(--text3)]'
                : 'bg-[var(--s3)] text-[var(--text3)]'
              }`}>
                {d.status === 'done' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-3.5 h-3.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
                {d.status === 'today' && <span className="text-[10px] font-bold">GO</span>}
                {d.status === 'rest'  && <span className="text-[9px] font-bold">R</span>}
                {d.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)]" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent sessions ── */}
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-3">Recent Sessions</p>
        <div className="flex flex-col gap-2">
          {RECENT_SESSIONS.map((s, i) => (
            <div key={i} className="flex items-center gap-3 rounded-[var(--rsm)] bg-[var(--s2)] border border-[var(--border)] px-3 py-3">
              <div className="w-8 h-8 rounded-[var(--rxs)] bg-[var(--s3)] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4">
                  <path d="M6.5 6.5h11M6.5 17.5h11M3 10h3M18 10h3M3 14h3M18 14h3"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{s.title}</p>
                <p className="text-[10px] text-[var(--text3)]">{s.label}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.prs > 0 && (
                  <span className="text-[10px] font-bold text-[var(--gold)] bg-[var(--gold-dim)] px-1.5 py-0.5 rounded-[var(--rxs)]">
                    {s.prs} PR{s.prs > 1 ? 's' : ''}
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-[var(--rxs)] ${TAG_COLORS[s.tag] ?? ''}`}>
                  {s.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
