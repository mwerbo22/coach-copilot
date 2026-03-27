import type { WorkoutBlock } from '@/types/workout';

const BLOCK_ACCENT: Record<string, string> = {
  prep:         'var(--green)',
  strength:     'var(--blue)',
  conditioning: 'var(--orange)',
};

interface Props {
  block: WorkoutBlock;
  children: React.ReactNode;
}

export default function BlockCard({ block, children }: Props) {
  const accent = BLOCK_ACCENT[block.type] ?? 'var(--lime)';
  return (
    <div className="rounded-[var(--r)] bg-[var(--s2)] border border-[var(--border)] overflow-hidden">
      {/* accent stripe */}
      <div className="h-[3px]" style={{ background: accent }} />
      <div className="px-4 pt-4 pb-5">
        {/* eyebrow + label */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)] mb-0.5">
              {block.eyebrow}
            </p>
            <h3 className="text-base font-bold text-[var(--text)]">{block.label}</h3>
          </div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-[var(--rxs)]"
            style={{ color: accent, background: `${accent}1a` }}
          >
            {block.type}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
