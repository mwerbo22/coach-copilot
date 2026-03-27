'use client';

import Link from 'next/link';

interface Props {
  hint: string;
  label: string;
  disabled?: boolean;
  onAction: () => void;
}

export default function WorkoutCTA({ hint, label, disabled, onAction }: Props) {
  return (
    <div className="shrink-0 px-4 py-4 border-t border-[var(--border)] bg-[var(--s1)]">
      {hint && (
        <p className="text-[11px] text-[var(--text3)] text-center mb-2">{hint}</p>
      )}
      <button
        onClick={onAction}
        disabled={disabled}
        className="w-full py-3.5 rounded-[var(--rsm)] bg-[var(--lime)] text-[var(--bg)] font-bold text-sm disabled:opacity-30 active:opacity-80 transition-opacity"
      >
        {label}
      </button>
      <div className="mt-2 text-center">
        <Link href="/athlete/log" className="text-[11px] text-[var(--text3)] underline underline-offset-2">
          Skip to Log
        </Link>
      </div>
    </div>
  );
}
