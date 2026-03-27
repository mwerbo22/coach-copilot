import { ROSTER_ATHLETES } from '@/lib/sampleData';

const avgCompliance = Math.round(
  ROSTER_ATHLETES.reduce((s, a) => s + a.compliance, 0) / ROSTER_ATHLETES.length
);

export default function CoachDashboard() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="mb-8">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-1">Overview</p>
        <h1 className="text-3xl font-bold text-[var(--text)]">Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Athletes',    value: ROSTER_ATHLETES.length, unit: '' },
          { label: 'Avg Compliance', value: avgCompliance,        unit: '%' },
          { label: 'Active PRs',  value: ROSTER_ATHLETES.reduce((s, a) => s + a.prCount, 0), unit: '' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text3)] mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-[var(--text)] font-[var(--ffm)]">
              {stat.value}<span className="text-xl text-[var(--text2)]">{stat.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Compliance list */}
      <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-bold text-[var(--text)]">Athlete Compliance</h2>
        </div>
        <div className="divide-y divide-[var(--border2)]">
          {ROSTER_ATHLETES.map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3">
              <div className="w-8 h-8 rounded-full bg-[var(--s3)] flex items-center justify-center text-xs font-bold text-[var(--text2)] shrink-0">
                {a.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{a.name}</p>
                <p className="text-[11px] text-[var(--text3)]">{a.program}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 h-1.5 rounded-full bg-[var(--s4)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${a.compliance}%`,
                      background: a.compliance >= 80 ? 'var(--lime)' : a.compliance >= 60 ? 'var(--orange)' : 'var(--rose)',
                    }}
                  />
                </div>
                <span className="text-xs font-bold font-[var(--ffm)] text-[var(--text2)] w-8 text-right">
                  {a.compliance}%
                </span>
                <span className={`text-xs ${a.trend === 'up' ? 'text-[var(--lime)]' : a.trend === 'down' ? 'text-[var(--rose)]' : 'text-[var(--text3)]'}`}>
                  {a.trend === 'up' ? '↑' : a.trend === 'down' ? '↓' : '→'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
