'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PROGRAM_WEEKS } from '@/lib/sampleData';
import { parseWorkout, blockStats, resetParseCounters } from '@/lib/parseWorkout';
import type { ParsedBlock, ParsedExercise, BlockType } from '@/lib/parseWorkout';
import type { ProgramWeek } from '@/types/coach';

// ─── Types ───────────────────────────────────────────────────────────────────

type ParsedMap = Record<string, ParsedBlock[]>; // `${weekId}-${dayId}` → blocks

interface DragState {
  dayKey: string;
  blockId: number;
  exId: number;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function guessPills(content: string) {
  if (!content?.trim()) return [{ label: 'empty', cls: 'text-[var(--text3)] bg-[var(--s4)]' }];
  const pills = [];
  if (/\/\/\s*prep/i.test(content))            pills.push({ label: 'prep',  cls: 'text-[var(--teal)]   bg-[var(--teal-dim)]'   });
  if (/\/\/\s*strength/i.test(content))        pills.push({ label: 'str',   cls: 'text-[var(--blue)]   bg-[var(--blue-dim)]'   });
  if (/\/\/\s*cond|emom|amrap/i.test(content)) pills.push({ label: 'cond',  cls: 'text-[var(--orange)] bg-[var(--orange-dim)]' });
  return pills.length ? pills : [{ label: 'mixed', cls: 'text-[var(--text2)] bg-[var(--s4)]' }];
}

const BLOCK_ACCENT: Record<BlockType, string> = {
  prep:         'var(--teal)',
  strength:     'var(--blue)',
  conditioning: 'var(--orange)',
  other:        'var(--text3)',
};

const BLOCK_ICON: Record<BlockType, string> = {
  prep: '◈', strength: '◆', conditioning: '◉', other: '◇',
};

const DETAIL_STYLE: Record<string, string> = {
  emom:     'text-[var(--purple)] border-[rgba(183,138,255,.2)] bg-[var(--purple-dim)]',
  amrap:    'text-[var(--orange)] border-[rgba(255,153,64,.2)]  bg-[var(--orange-dim)]',
  rounds:   'text-[var(--teal)]   border-[rgba(61,217,193,.2)]  bg-[var(--teal-dim)]',
  interval: 'text-[var(--lime)]   border-[rgba(201,241,61,.2)]  bg-[var(--lime-dim)]',
  '':       'text-[var(--text2)]  border-[var(--border)]         bg-[var(--s3)]',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Single exercise row in the parsed panel */
function ExRow({
  ex, dayKey, blockId, allBlocks,
  onMove, onDragStart, onDragOver, onDrop, draggingOver,
}: {
  ex: ParsedExercise;
  dayKey: string;
  blockId: number;
  allBlocks: ParsedBlock[];
  onMove: (dayKey: string, fromBlockId: number, exId: number, toBlockId: number) => void;
  onDragStart: (state: DragState) => void;
  onDragOver: (dayKey: string, blockId: number, exId: number) => void;
  onDrop: (dayKey: string, blockId: number, exId: number) => void;
  draggingOver: boolean;
}) {
  const [ddOpen, setDdOpen] = useState(false);
  const others = allBlocks.filter(b => b.id !== blockId);

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1.5 border-b border-[rgba(46,46,54,.5)] group cursor-grab relative transition-colors last:border-b-0 ${draggingOver ? 'bg-[var(--lime-dim)] outline-dashed outline-1 outline-[rgba(201,241,61,.3)]' : 'hover:bg-[var(--s4)]'}`}
      draggable
      onDragStart={() => onDragStart({ dayKey, blockId, exId: ex.id })}
      onDragOver={e => { e.preventDefault(); onDragOver(dayKey, blockId, ex.id); }}
      onDrop={e => { e.preventDefault(); onDrop(dayKey, blockId, ex.id); }}
    >
      <span className="text-[9.5px] text-[var(--text3)] opacity-0 group-hover:opacity-100 transition-opacity select-none w-3 shrink-0 tracking-[-1px]">⠿</span>
      <span className="flex-1 text-[11px] text-[var(--text)] leading-snug min-w-0">{ex.name}</span>
      {ex.detail && (
        <span className={`font-mono text-[9.5px] px-1.5 py-0.5 rounded-[3px] border shrink-0 ${DETAIL_STYLE[ex.detailType] ?? DETAIL_STYLE['']}`}>
          {ex.detail}
        </span>
      )}
      {others.length > 0 && (
        <button
          onClick={e => { e.stopPropagation(); setDdOpen(o => !o); }}
          className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text3)] hover:text-[var(--text2)] text-[11px] flex items-center justify-center"
          title="Move to block"
        >⇄</button>
      )}
      {ddOpen && (
        <div className="absolute right-1 top-full mt-0.5 bg-[var(--s2)] border border-[var(--border-lt)] rounded-[var(--rsm)] shadow-[0_8px_24px_rgba(0,0,0,.4)] z-[300] min-w-[140px] overflow-hidden animate-[ddFade_.12s_ease]">
          <div className="px-2.5 py-1.5 font-mono text-[9px] tracking-widest uppercase text-[var(--text3)] border-b border-[var(--border)]">Move to block</div>
          {others.map(b => (
            <button
              key={b.id}
              onClick={() => { onMove(dayKey, blockId, ex.id, b.id); setDdOpen(false); }}
              className="w-full flex items-center gap-2 px-2.5 py-2 text-[11px] text-[var(--text2)] hover:bg-[var(--s3)] hover:text-[var(--text)] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: BLOCK_ACCENT[b.type] }} />
              {b.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Parsed block card in right panel */
function ParsedBlockCard({
  block, dayKey, allBlocks, onRename, onDelete, onMove,
  onDragStart, onDragOver, onDrop, onDropZone, dragOver,
}: {
  block: ParsedBlock;
  dayKey: string;
  allBlocks: ParsedBlock[];
  onRename: (dayKey: string, blockId: number, name: string) => void;
  onDelete: (dayKey: string, blockId: number) => void;
  onMove: (dayKey: string, fromBlockId: number, exId: number, toBlockId: number) => void;
  onDragStart: (state: DragState) => void;
  onDragOver: (dayKey: string, blockId: number, exId: number) => void;
  onDrop: (dayKey: string, blockId: number, exId: number) => void;
  onDropZone: (dayKey: string, blockId: number) => void;
  dragOver: { blockId: number; exId: number } | null;
}) {
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const accent = BLOCK_ACCENT[block.type];

  return (
    <div className="rounded-[var(--rsm)] bg-[var(--s2)] border border-[var(--border)] mb-2 relative overflow-hidden hover:border-[var(--border-lt)] transition-colors">
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: accent }} />

      {/* Block header */}
      <div className="flex items-center gap-1.5 pl-4 pr-2.5 py-2 border-b border-[var(--border)] group">
        <span className="text-[9.5px] shrink-0" style={{ color: accent }}>{BLOCK_ICON[block.type]}</span>
        <input
          value={block.name}
          onChange={e => onRename(dayKey, block.id, e.target.value)}
          onClick={e => e.stopPropagation()}
          className="flex-1 min-w-0 font-mono text-[9.5px] font-medium tracking-widest uppercase bg-transparent border-none outline-none text-[var(--text2)] hover:bg-[var(--s3)] focus:bg-[var(--s3)] focus:text-[var(--lime)] rounded-[3px] px-1 py-0.5 transition-colors cursor-text"
        />
        <span className="font-mono text-[9px] text-[var(--text3)] shrink-0">{block.exercises.length} ex</span>
        <button
          onClick={() => onDelete(dayKey, block.id)}
          className="w-4 h-4 flex items-center justify-center text-[10px] text-[var(--text3)] opacity-0 group-hover:opacity-100 hover:bg-[var(--rose-dim)] hover:text-[var(--rose)] rounded-[3px] transition-all shrink-0"
        >✕</button>
      </div>

      {/* Meta chips */}
      {block.meta.length > 0 && (
        <div className="flex gap-1 px-2.5 py-1.5 flex-wrap border-b border-[rgba(46,46,54,.5)]">
          {block.meta.map((m, i) => (
            <span key={i} className={`font-mono text-[9px] px-1.5 py-0.5 rounded-[3px] border ${DETAIL_STYLE[m.type] ?? DETAIL_STYLE['']}`}>
              {m.label}
            </span>
          ))}
        </div>
      )}

      {/* Exercise rows */}
      {block.exercises.map(ex => (
        <ExRow
          key={ex.id}
          ex={ex}
          dayKey={dayKey}
          blockId={block.id}
          allBlocks={allBlocks}
          onMove={onMove}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          draggingOver={dragOver?.blockId === block.id && dragOver?.exId === ex.id}
        />
      ))}

      {/* Drop zone */}
      <div
        className={`min-h-[7px] transition-all ${dropZoneActive ? 'min-h-[28px] bg-[var(--lime-dim)] border-t border-dashed border-[rgba(201,241,61,.3)] flex items-center justify-center font-mono text-[9px] text-[var(--lime)] tracking-wider' : ''}`}
        onDragOver={e => { e.preventDefault(); setDropZoneActive(true); }}
        onDragLeave={() => setDropZoneActive(false)}
        onDrop={e => { e.preventDefault(); setDropZoneActive(false); onDropZone(dayKey, block.id); }}
      >
        {dropZoneActive && 'Drop here'}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgramsPage() {
  const [weeks, setWeeks] = useState<ProgramWeek[]>(() =>
    PROGRAM_WEEKS.map(w => ({ ...w, days: w.days.map(d => ({ ...d })) }))
  );
  const [activeWeekId, setActiveWeekId] = useState(1);
  const [openDays, setOpenDays] = useState<Set<string>>(new Set(['1-1', '1-2']));
  const [parsed, setParsed] = useState<ParsedMap>({});

  // Drag state
  const dragRef = useRef<DragState | null>(null);
  const [dragOver, setDragOver] = useState<{ dayKey: string; blockId: number; exId: number } | null>(null);

  // Parse debounce timer
  const parseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-parse whenever weeks content changes
  useEffect(() => {
    if (parseTimer.current) clearTimeout(parseTimer.current);
    parseTimer.current = setTimeout(() => {
      resetParseCounters();
      const next: ParsedMap = {};
      for (const week of weeks) {
        for (const day of week.days) {
          const key = `${week.id}-${day.id}`;
          next[key] = parseWorkout(day.content);
        }
      }
      setParsed(next);
    }, 280);
    return () => { if (parseTimer.current) clearTimeout(parseTimer.current); };
  }, [weeks]);

  // ── Content update ───────────────────────────────────────────────────────

  const updateContent = useCallback((weekId: number, dayId: number, content: string) => {
    setWeeks(prev => prev.map(w =>
      w.id !== weekId ? w : {
        ...w,
        days: w.days.map(d => d.id !== dayId ? d : { ...d, content }),
      }
    ));
  }, []);

  // ── Week/day management ──────────────────────────────────────────────────

  const addWeek = useCallback(() => {
    setWeeks(prev => {
      const id = prev.length + 1;
      return [...prev, { id, label: `Week ${id}`, days: [{ id: 1, title: 'Day 1', subtitle: 'Upper', content: '' }, { id: 2, title: 'Day 2', subtitle: 'Lower', content: '' }] }];
    });
    setWeeks(prev => { setActiveWeekId(prev.length); return prev; });
  }, []);

  const addDay = useCallback((weekId: number) => {
    setWeeks(prev => prev.map(w => {
      if (w.id !== weekId) return w;
      const nid = w.days.length + 1;
      setOpenDays(s => new Set([...s, `${weekId}-${nid}`]));
      return { ...w, days: [...w.days, { id: nid, title: `Day ${nid}`, subtitle: 'New Day', content: '' }] };
    }));
  }, []);

  const toggleDay = useCallback((key: string) => {
    setOpenDays(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }, []);

  // ── Parsed block management ───────────────────────────────────────────────

  const renameBlock = useCallback((dayKey: string, blockId: number, name: string) => {
    setParsed(prev => {
      const blocks = prev[dayKey];
      if (!blocks) return prev;
      return { ...prev, [dayKey]: blocks.map(b => b.id === blockId ? { ...b, name } : b) };
    });
  }, []);

  const deleteBlock = useCallback((dayKey: string, blockId: number) => {
    setParsed(prev => {
      const blocks = prev[dayKey];
      if (!blocks) return prev;
      return { ...prev, [dayKey]: blocks.filter(b => b.id !== blockId) };
    });
  }, []);

  const moveExercise = useCallback((dayKey: string, fromBlockId: number, exId: number, toBlockId: number) => {
    setParsed(prev => {
      const blocks = prev[dayKey];
      if (!blocks) return prev;
      const from = blocks.find(b => b.id === fromBlockId);
      const to   = blocks.find(b => b.id === toBlockId);
      if (!from || !to) return prev;
      const idx = from.exercises.findIndex(e => e.id === exId);
      if (idx === -1) return prev;
      const [ex] = from.exercises.splice(idx, 1);
      to.exercises.push(ex);
      return { ...prev, [dayKey]: blocks.map(b => ({ ...b })) };
    });
  }, []);

  // ── Drag-and-drop ────────────────────────────────────────────────────────

  const handleDragStart = useCallback((state: DragState) => { dragRef.current = state; }, []);
  const handleDragOver  = useCallback((dayKey: string, blockId: number, exId: number) => {
    setDragOver({ dayKey, blockId, exId });
  }, []);

  const handleDrop = useCallback((toDayKey: string, toBlockId: number, toExId: number) => {
    setDragOver(null);
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;

    setParsed(prev => {
      const fromBlocks = prev[drag.dayKey];
      const toBlocks   = toDayKey === drag.dayKey ? fromBlocks : prev[toDayKey];
      if (!fromBlocks || !toBlocks) return prev;

      const fromBlock = fromBlocks.find(b => b.id === drag.blockId);
      const toBlock   = toBlocks.find(b => b.id === toBlockId);
      if (!fromBlock || !toBlock) return prev;

      const fi = fromBlock.exercises.findIndex(e => e.id === drag.exId);
      const ti = toBlock.exercises.findIndex(e => e.id === toExId);
      if (fi === -1 || ti === -1) return prev;

      const [moved] = fromBlock.exercises.splice(fi, 1);
      toBlock.exercises.splice(ti, 0, moved);

      return { ...prev, [drag.dayKey]: [...fromBlocks], [toDayKey]: [...toBlocks] };
    });
  }, []);

  const handleDropZone = useCallback((toDayKey: string, toBlockId: number) => {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDragOver(null);
    moveExercise(drag.dayKey, drag.blockId, drag.exId, toBlockId);
  }, [moveExercise]);

  // ── Computed stats ────────────────────────────────────────────────────────

  const activeWeek = weeks.find(w => w.id === activeWeekId) ?? weeks[0];

  const activeWeekParsed = activeWeek.days.map(d => {
    const key = `${activeWeek.id}-${d.id}`;
    return { day: d, key, blocks: parsed[key] ?? [] };
  }).filter(({ blocks }) => blocks.length > 0);

  const allActiveBlocks = activeWeekParsed.flatMap(({ blocks }) => blocks);
  const stats = blockStats(allActiveBlocks);

  // Insert block header into textarea
  function insertBlockHeader(weekId: number, dayId: number, header: string) {
    const key = `${weekId}-${dayId}`;
    const area = document.getElementById(`ced-${key}`) as HTMLTextAreaElement | null;
    if (!area) return;
    const { selectionStart, selectionEnd, value } = area;
    const insert = `\n${header}\n`;
    const next = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
    updateContent(weekId, dayId, next);
    setTimeout(() => {
      area.focus();
      const pos = selectionStart + insert.length;
      area.setSelectionRange(pos, pos);
    }, 0);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">

      {/* ── Week sidebar ─────────────────────────────────────── */}
      <div className="w-[200px] shrink-0 flex flex-col border-r border-[var(--border)] bg-[var(--s1)] overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)] shrink-0">
          <p className="font-mono text-[9.5px] tracking-[.14em] uppercase text-[var(--text3)]">Program Weeks</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {weeks.map(w => (
            <button
              key={w.id}
              onClick={() => setActiveWeekId(w.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-[var(--rsm)] text-left mb-0.5 transition-colors ${
                w.id === activeWeekId
                  ? 'bg-[var(--lime-dim)] text-[var(--lime)]'
                  : 'text-[var(--text2)] hover:bg-[var(--s3)] hover:text-[var(--text)]'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${w.id === activeWeekId ? 'bg-[var(--lime)]' : 'bg-[var(--text3)]'}`} />
              <span className="font-mono text-[10px] font-bold shrink-0">W{w.id}</span>
              <span className="text-[12px] truncate">{w.label}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-3 border-t border-[var(--border)] shrink-0">
          <button
            onClick={addWeek}
            className="w-full py-2 text-[11px] text-[var(--text3)] bg-transparent border border-dashed border-[var(--border)] rounded-[var(--rsm)] hover:border-[var(--lime)] hover:text-[var(--lime)] hover:bg-[var(--lime-dim)] transition-all"
          >
            + Add Week
          </button>
        </div>
      </div>

      {/* ── Main editor area ─────────────────────────────────── */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-6">
          {/* Week header */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-[var(--text)]">
              Week {activeWeek.id}
              <span className="ml-3 text-xs font-semibold text-[var(--text3)] bg-[var(--s3)] px-2 py-0.5 rounded-[var(--rsm)] font-mono tracking-wider">
                {activeWeek.label.toUpperCase()}
              </span>
            </h2>
            <p className="text-sm text-[var(--text2)] mt-1">
              {activeWeek.days.length} training days · W{activeWeek.id} of {weeks.length}
            </p>
          </div>

          {/* Day cards */}
          <div className="flex flex-col gap-3">
            {activeWeek.days.map(day => {
              const key = `${activeWeek.id}-${day.id}`;
              const isOpen = openDays.has(key);
              const pills = guessPills(day.content);
              return (
                <div
                  key={day.id}
                  className={`rounded-[var(--r)] border overflow-hidden transition-colors ${isOpen ? 'border-[var(--border)]' : 'border-[var(--border2)]'} bg-[var(--s2)]`}
                >
                  {/* Card header */}
                  <button
                    onClick={() => toggleDay(key)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left"
                  >
                    <svg
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"
                      className={`w-3.5 h-3.5 text-[var(--text3)] transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`}
                    >
                      <polyline points="9 6 15 12 9 18"/>
                    </svg>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-semibold text-[var(--text)]">{day.title}</p>
                      <p className="text-[11px] text-[var(--text3)]">{day.subtitle}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      {pills.map((p, i) => (
                        <span key={i} className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-[var(--rxs)] font-mono ${p.cls}`}>
                          {p.label}
                        </span>
                      ))}
                    </div>
                  </button>

                  {/* Editor body */}
                  {isOpen && (
                    <div className="border-t border-[var(--border2)]">
                      {/* Toolbar */}
                      <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--border2)] bg-[var(--s3)]">
                        <button
                          onMouseDown={e => { e.preventDefault(); document.execCommand('bold'); }}
                          className="px-2 py-1 text-xs font-bold text-[var(--text2)] hover:bg-[var(--s4)] rounded-[3px] transition-colors"
                        >B</button>
                        <button
                          onMouseDown={e => { e.preventDefault(); document.execCommand('italic'); }}
                          className="px-2 py-1 text-xs italic text-[var(--text2)] hover:bg-[var(--s4)] rounded-[3px] transition-colors"
                        >I</button>
                        <div className="w-px h-4 bg-[var(--border)] mx-1" />
                        {[
                          { label: 'BLK',  text: '// Block',        cls: 'text-[var(--text2)] bg-[var(--s4)] hover:bg-[var(--s3)] hover:text-[var(--text)]' },
                          { label: 'PREP', text: '// PREP',         cls: 'text-[var(--teal)] bg-[var(--teal-dim)] hover:bg-[rgba(61,217,193,.2)]' },
                          { label: 'STR',  text: '// STRENGTH',     cls: 'text-[var(--blue)] bg-[var(--blue-dim)] hover:bg-[rgba(79,163,255,.2)]' },
                          { label: 'COND', text: '// CONDITIONING', cls: 'text-[var(--orange)] bg-[var(--orange-dim)] hover:bg-[rgba(255,153,64,.2)]' },
                        ].map(btn => (
                          <button
                            key={btn.label}
                            onMouseDown={e => { e.preventDefault(); insertBlockHeader(activeWeek.id, day.id, btn.text); }}
                            className={`font-mono text-[9.5px] px-1.5 py-0.5 rounded-[4px] border-none transition-colors ${btn.cls}`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                      {/* Textarea */}
                      <textarea
                        id={`ced-${key}`}
                        value={day.content}
                        onChange={e => updateContent(activeWeek.id, day.id, e.target.value)}
                        rows={10}
                        placeholder="Type workout... Use // Block for a circuit, // STRENGTH, // CONDITIONING. Format line: 3 rounds · 30s on 20s off. Exercise: Kettlebell Swings 24kg x15"
                        className="w-full bg-transparent text-[12px] text-[var(--text)] placeholder:text-[var(--text3)] font-mono resize-none focus:outline-none leading-[1.75] px-4 py-3 caret-[var(--lime)]"
                        spellCheck={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}

            {/* + Add Day */}
            <button
              onClick={() => addDay(activeWeek.id)}
              className="w-full py-2.5 text-sm text-[var(--text3)] bg-transparent border border-dashed border-[var(--border)] rounded-[var(--r)] hover:border-[var(--lime)] hover:text-[var(--lime)] hover:bg-[var(--lime-dim)] transition-all"
            >
              + Add Day
            </button>
          </div>
        </div>
      </div>

      {/* ── Parsed structure panel ───────────────────────────── */}
      <div className="w-[290px] shrink-0 flex flex-col border-l border-[var(--border)] bg-[var(--s1)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-3.5 py-3 border-b border-[var(--border)] shrink-0">
          <span className="font-mono text-[11.5px] font-bold tracking-[.05em] uppercase text-[var(--text2)]">
            Parsed Structure
          </span>
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] ml-auto shrink-0"
            style={{ boxShadow: '0 0 6px var(--lime-glow)', animation: 'pulse 2s ease-in-out infinite' }}
          />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-2.5">
          {activeWeekParsed.length === 0 ? (
            <div className="text-center py-10 px-5">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" className="w-8 h-8 mx-auto mb-3 opacity-30">
                <path d="M4 6h16M4 12h10M4 18h6"/>
              </svg>
              <p className="font-mono text-[11px] text-[var(--text3)] leading-relaxed">
                Start typing to see<br/>live structure parsing
              </p>
            </div>
          ) : (
            activeWeekParsed.map(({ day, key, blocks }) => (
              <div key={key} className="mb-4">
                {/* Day section label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold tracking-[.08em] uppercase text-[var(--text2)]">
                    {day.title} · {day.subtitle}
                  </span>
                  <div className="flex-1 h-px bg-[var(--border)]" />
                </div>
                {blocks.map(block => (
                  <ParsedBlockCard
                    key={block.id}
                    block={block}
                    dayKey={key}
                    allBlocks={blocks}
                    onRename={renameBlock}
                    onDelete={deleteBlock}
                    onMove={moveExercise}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDropZone={handleDropZone}
                    dragOver={dragOver?.dayKey === key ? { blockId: dragOver.blockId, exId: dragOver.exId } : null}
                  />
                ))}
              </div>
            ))
          )}
        </div>

        {/* Stats footer */}
        <div className="border-t border-[var(--border)] grid grid-cols-3 gap-2 p-2 shrink-0">
          {[
            { num: stats.exercises, label: 'Exercises' },
            { num: stats.sets || '–', label: 'Sets' },
            { num: stats.blocks, label: 'Blocks' },
          ].map(s => (
            <div key={s.label} className="text-center py-2 bg-[var(--s2)] rounded-[var(--rsm)] border border-[var(--border)]">
              <p className="font-mono text-base font-bold text-[var(--text)] leading-none mb-1">{s.num}</p>
              <p className="font-mono text-[8px] tracking-[.08em] uppercase text-[var(--text3)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
