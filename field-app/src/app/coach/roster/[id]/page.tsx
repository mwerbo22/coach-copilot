import Link from 'next/link';
import { ROSTER_ATHLETES } from '@/lib/sampleData';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AthleteDetailPage({ params }: Props) {
  const { id } = await params;
  const athlete = ROSTER_ATHLETES.find(a => a.id === id);
  if (!athlete) notFound();

  return (
    <div className="p-8">
      <Link href="/coach/roster" className="text-[11px] text-[var(--text3)] hover:text-[var(--text2)] mb-6 inline-flex items-center gap-1 transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-3 h-3"><polyline points="15 18 9 12 15 6"/></svg>
        Roster
      </Link>
      <div className="flex items-center gap-4 mt-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-[var(--s3)] flex items-center justify-center text-xl font-bold text-[var(--text2)]">
          {athlete.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{athlete.name}</h1>
          <p className="text-sm text-[var(--text2)]">{athlete.program}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Compliance', value: `${athlete.compliance}%` },
          { label: 'PRs',        value: athlete.prCount },
          { label: 'Trend',      value: athlete.trend === 'up' ? '↑ Up' : athlete.trend === 'down' ? '↓ Down' : '→ Flat' },
        ].map(stat => (
          <div key={stat.label} className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text3)] mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-[var(--text)] font-[var(--ffm)]">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
