'use client';

import type { PrepBlock as PrepBlockType } from '@/types/workout';
import BlockCard from './BlockCard';

interface Props {
  block: PrepBlockType;
  prepDone: Record<string, boolean>;
  onToggle: (itemId: string) => void;
}

export default function PrepBlock({ block, prepDone, onToggle }: Props) {
  const doneCount = block.items.filter(item => prepDone[item.id]).length;
  const allDone = doneCount === block.items.length;

  return (
    <BlockCard block={block}>
      <div className="flex flex-col gap-2">
        {block.items.map((item) => {
          const done = !!prepDone[item.id];
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.id)}
              className={`w-full flex items-center gap-3 rounded-[var(--rsm)] px-3 py-3 border transition-colors text-left ${
                done
                  ? 'bg-[var(--green-dim)] border-[rgba(52,211,153,0.2)]'
                  : 'bg-[var(--s3)] border-[var(--border2)]'
              }`}
            >
              {/* Check circle */}
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                done ? 'bg-[var(--green)] border-[var(--green)]' : 'border-[var(--text3)]'
              }`}>
                {done && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="3" strokeLinecap="round" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${done ? 'text-[var(--text2)] line-through' : 'text-[var(--text)]'}`}>
                  {item.name}
                </p>
                <p className="text-[11px] text-[var(--text3)] mt-0.5">{item.detail}</p>
              </div>
              {item.rounds && (
                <span className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded-[var(--rxs)] ${
                  done ? 'text-[var(--green)] bg-[var(--green-dim)]' : 'text-[var(--text3)] bg-[var(--s4)]'
                }`}>
                  {done ? '✓ Done' : `${item.rounds} rounds`}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress footer */}
      <div className="mt-3 pt-3 border-t border-[var(--border2)] flex items-center gap-3">
        <div className="flex-1 h-1 rounded-full bg-[var(--s4)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--green)] transition-all"
            style={{ width: `${(doneCount / block.items.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-semibold text-[var(--text3)] shrink-0">
          {allDone ? '✓ Complete' : `${doneCount} / ${block.items.length}`}
        </span>
      </div>
    </BlockCard>
  );
}
