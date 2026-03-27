import type { WorkoutBlock } from '@/types/workout';

type BlockStatus = 'done' | 'active' | 'next' | 'later';

const ACCENT: Record<string, string> = {
  prep:         'var(--green)',
  strength:     'var(--blue)',
  conditioning: 'var(--orange)',
};

interface Props {
  blocks: WorkoutBlock[];
  getStatus: (blockId: string) => BlockStatus;
  progressPct: number;
  currentLabel: string;
  nextLabel: string | null;
}

export default function SessionRail({ blocks, getStatus, progressPct, currentLabel, nextLabel }: Props) {
  return (
    <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--s1)]">
      {/* Block rail */}
      <div className="flex gap-1.5 mb-2.5">
        {blocks.map((block) => {
          const status = getStatus(block.id);
          const accent = ACCENT[block.type] ?? 'var(--text3)';
          return (
            <div
              key={block.id}
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--s4)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: status === 'done' ? '100%' : status === 'active' ? '40%' : '0%',
                  background: status === 'done' ? accent : status === 'active' ? accent : 'transparent',
                  opacity: status === 'active' ? 0.7 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* Labels row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--text3)] uppercase tracking-wider">Now:</span>
          <span className="text-[11px] font-semibold text-[var(--text)]">{currentLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {nextLabel && (
            <>
              <span className="text-[10px] text-[var(--text3)] uppercase tracking-wider">Next:</span>
              <span className="text-[11px] text-[var(--text2)]">{nextLabel}</span>
            </>
          )}
          <span className="text-[10px] font-bold text-[var(--lime)] font-[var(--ffm)] ml-2">{progressPct}%</span>
        </div>
      </div>
    </div>
  );
}
