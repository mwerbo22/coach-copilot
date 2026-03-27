// ─── Types ───────────────────────────────────────────────────────────────────

export type BlockType = 'prep' | 'strength' | 'conditioning' | 'other';
export type DetailType = 'emom' | 'amrap' | 'rounds' | 'interval' | '';

export interface ParsedExercise {
  id: number;
  name: string;
  detail: string;
  detailType: DetailType;
}

export interface BlockMeta {
  label: string;
  type: 'emom' | 'amrap' | 'rounds' | 'interval';
}

export interface ParsedBlock {
  id: number;
  name: string;
  type: BlockType;
  exercises: ParsedExercise[];
  meta: BlockMeta[];
}

// ─── Counters (module-level so IDs stay unique across calls) ─────────────────

let bidSeq = 0;
let eidSeq = 0;

export function resetParseCounters() {
  bidSeq = 0;
  eidSeq = 0;
}

// ─── Parser ──────────────────────────────────────────────────────────────────

export function parseWorkout(text: string): ParsedBlock[] {
  if (!text?.trim()) return [];

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks: ParsedBlock[] = [];
  let cur: ParsedBlock | null = null;

  // Block keyword patterns
  const bkw: Record<BlockType, RegExp> = {
    prep:         /^\/\/\s*(prep|warm.?up|activation)/i,
    strength:     /^\/\/\s*(strength|lift|main|primary)/i,
    conditioning: /^\/\/\s*(conditioning|cond|metcon|cardio)/i,
    other:        /^\/\/\s*/i,  // fallback — matched last
  };

  // Timing/format patterns
  const trx = {
    emom:     /emom\s*(\d+)\s*min/i,
    amrap:    /amrap\s*(\d+)\s*min/i,
    // "30s on 20s off", "30 seconds on / 20 seconds off", "30 sec on 20 sec rest", etc.
    interval: /(\d+)\s*(?:s|sec(?:onds?)?)?\s*(?:on|work)[^\d]*(\d+)\s*(?:s|sec(?:onds?)?)?\s*(?:off|rest)/i,
    rounds:   /(\d+)\s*rounds?/i,
  };

  // Exercise detail patterns
  const srRx       = /(\d+)[x×](\d+(?:-\d+)?)/i;          // sets×reps: 4x15, 3×10-12
  const repsOnlyRx = /(?<!\d)\s+[x×]\s*(\d+(?:-\d+)?)\b/i; // reps-only: " x15" not preceded by digit
  const weightRx   = /(\d+(?:\.\d+)?)\s*(kg|lbs?)\b/i;    // weight: 24kg, 20lbs
  const pctRx      = /@(\d+)%/;
  const tmpRx      = /(\d{4})\s*tempo/i;

  function extractMeta(line: string): BlockMeta[] {
    const metas: BlockMeta[] = [];
    const em = line.match(trx.emom);
    if (em) metas.push({ label: `EMOM ${em[1]}min`, type: 'emom' });
    const am = line.match(trx.amrap);
    if (am) metas.push({ label: `AMRAP ${am[1]}min`, type: 'amrap' });
    if (!em && !am) {
      const iv = line.match(trx.interval);
      if (iv) metas.push({ label: `${iv[1]}s on / ${iv[2]}s off`, type: 'interval' });
      const ro = line.match(trx.rounds);
      if (ro && !iv) metas.push({ label: `${ro[1]} rounds`, type: 'rounds' });
    }
    return metas;
  }

  for (const line of lines) {
    // Detect block header
    let bt: BlockType | null = null;
    for (const [t, r] of Object.entries(bkw)) {
      if (t === 'other') continue; // handle below
      if (r.test(line)) { bt = t as BlockType; break; }
    }
    if (!bt && /^\/\/\s*/i.test(line)) bt = 'other';

    if (bt) {
      const name = line.replace(/^\/\/\s*/, '').trim();
      cur = { id: ++bidSeq, name, type: bt, exercises: [], meta: extractMeta(line) };
      blocks.push(cur);
      continue;
    }

    // No current block yet — auto-create a general one
    if (!cur) {
      cur = { id: ++bidSeq, name: 'General', type: 'other', exercises: [], meta: [] };
      blocks.push(cur);
    }

    // Lines that are purely format metadata (no exercise name)
    const isMeta = Object.values(trx).some(r => r.test(line));
    const cleanCheck = line.replace(/^[-•–]\s*/,'').replace(/^(odd:|even:)/i,'').trim();
    const hasMeaningfulText = cleanCheck
      .replace(trx.emom, '')
      .replace(trx.amrap, '')
      .replace(trx.interval, '')
      .replace(trx.rounds, '')
      .replace(/\d+/g, '')
      .replace(/[^a-zA-Z]/g, '')
      .length > 2;

    if (isMeta && !hasMeaningfulText) {
      cur.meta.push(...extractMeta(line));
      continue;
    }

    // Parse as exercise line
    let name = line
      .replace(/^[-•–]\s*/, '')
      .replace(/^(odd:|even:)/i, '')
      .replace(/^[A-Z]\d?\.\s*/i, '')
      .trim();

    if (name.length < 2) continue;

    let detail = '';
    let detailType: DetailType = '';

    const em = name.match(trx.emom);
    const am = name.match(trx.amrap);
    if (em) {
      detail = `EMOM ${em[1]}min`;
      detailType = 'emom';
    } else if (am) {
      detail = `AMRAP ${am[1]}min`;
      detailType = 'amrap';
    } else {
      const detailParts: string[] = [];

      // Sets×reps (e.g. 4x15, 3×10-12)
      const sr = name.match(srRx);
      if (sr) {
        detailParts.push(`${sr[1]}×${sr[2]}`);
        name = name.replace(sr[0], '').trim();
      } else {
        // Reps-only: " x15" when not preceded by a digit (avoids matching "90/90 x 5")
        const ro = name.match(repsOnlyRx);
        if (ro) {
          detailParts.push(`×${ro[1]}`);
          name = name.replace(ro[0], '').trim();
        }
      }

      // Weight (e.g. 24kg, 20lbs) — prepended so it reads "24kg ×15"
      const wt = name.match(weightRx);
      if (wt) {
        detailParts.unshift(`${wt[1]}${wt[2]}`);
        name = name.replace(wt[0], '').trim();
      }

      // Percentage (e.g. @80%)
      const pct = name.match(pctRx);
      if (pct) { detailParts.push(`@${pct[1]}%`); name = name.replace(pct[0], '').trim(); }

      // Tempo (e.g. 3011 tempo)
      const tmp = name.match(tmpRx);
      if (tmp) { detailParts.push(tmp[1]); name = name.replace(tmp[0], '').trim(); }

      detail = detailParts.join(' ');
    }

    name = name.replace(/\s{2,}/g, ' ').replace(/\s*[-–@,]\s*$/, '').trim();
    if (name.length >= 2) {
      cur.exercises.push({ id: ++eidSeq, name, detail: detail.trim(), detailType });
    }
  }

  return blocks.filter(b => b.exercises.length > 0 || b.meta.length > 0);
}

// ─── Stats helper ─────────────────────────────────────────────────────────────

export function blockStats(allBlocks: ParsedBlock[]) {
  let exercises = 0;
  let sets = 0;
  const blocks = allBlocks.length;
  for (const block of allBlocks) {
    exercises += block.exercises.length;
    for (const ex of block.exercises) {
      const m = ex.detail.match(/(\d+)×/);
      if (m) sets += parseInt(m[1]);
    }
  }
  return { exercises, sets: sets || 0, blocks };
}
