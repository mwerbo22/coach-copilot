'use client';

interface Props {
  title: string;
  formatted: string;
  running: boolean;
  onToggle: () => void;
}

export default function WorkoutHeader({ title, formatted, running, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
      <div>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text3)]">Today</p>
        <h2 className="text-base font-bold text-[var(--text)]">{title}</h2>
      </div>
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--s3)] border border-[var(--border)] text-xs font-mono text-[var(--text2)]"
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{
            background: running ? 'var(--lime)' : 'var(--text3)',
            animation: running ? 'pulse 1.5s ease-in-out infinite' : 'none',
          }}
        />
        {formatted}
      </button>
    </div>
  );
}
