import Link from 'next/link';
import { ROSTER_ATHLETES } from '@/lib/sampleData';

export default function RosterPage() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-1">Manage</p>
          <h1 className="text-3xl font-bold text-[var(--text)]">Roster</h1>
        </div>
        <span className="text-sm text-[var(--text2)]">{ROSTER_ATHLETES.length} athletes</span>
      </div>

      <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1.5fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--s3)]">
          {['Athlete', 'Program', 'Compliance', 'PRs', 'Trend'].map(h => (
            <span key={h} className="text-[10px] uppercase tracking-widest text-[var(--text3)] font-semibold">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-[var(--border2)]">
          {ROSTER_ATHLETES.map((a) => (
            <Link
              key={a.id}
              href={`/coach/roster/${a.id}`}
              className="grid grid-cols-[1fr_1.5fr_auto_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-[var(--s3)] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-[var(--s4)] flex items-center justify-center text-xs font-bold text-[var(--text2)] shrink-0">
                  {a.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="text-sm font-semibold text-[var(--text)] truncate">{a.name}</span>
              </div>
              <span className="text-sm text-[var(--text2)] truncate">{a.program}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 rounded-full bg-[var(--s4)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${a.compliance}%`,
                      background: a.compliance >= 80 ? 'var(--lime)' : a.compliance >= 60 ? 'var(--orange)' : 'var(--rose)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold font-[var(--ffm)] text-[var(--text2)] w-8">{a.compliance}%</span>
              </div>
              <span className="text-sm font-semibold text-[var(--gold)] text-center">{a.prCount}</span>
              <span className={`text-sm font-bold text-center ${a.trend === 'up' ? 'text-[var(--lime)]' : a.trend === 'down' ? 'text-[var(--rose)]' : 'text-[var(--text3)]'}`}>
                {a.trend === 'up' ? '↑' : a.trend === 'down' ? '↓' : '→'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
