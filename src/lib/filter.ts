import type { DerivedSchool, FilterState, School } from './types';
import { parseDeadline, urgency } from './time';
import { resolveProvince } from '$data/provinces';

export function deriveSchool(s: School, nowMs: number): DerivedSchool {
  const deadlineMs = parseDeadline(s.deadline);
  const remainingMs = deadlineMs === null ? null : deadlineMs - nowMs;
  return {
    ...s,
    deadlineMs,
    remainingMs,
    urgency: urgency(remainingMs),
  };
}

interface ApplyOpts {
  query: string;
  tags: readonly string[];
  status: readonly string[]; // 已开营 / 已结营
  provinces: readonly string[];
}

/** Pure: filter + sort. Caller passes already-derived rows. */
export function applyFilters(
  rows: readonly DerivedSchool[],
  { query, tags, status, provinces }: ApplyOpts,
): DerivedSchool[] {
  const q = query.trim().toLowerCase();
  const tagSet = new Set(tags);
  const statusSet = new Set(status);
  const provSet = new Set(provinces);

  const out = rows.filter((r) => {
    // school-tier tags: OR across selected
    if (tagSet.size > 0) {
      const hit = r.tags.some((t) => tagSet.has(t));
      if (!hit) return false;
    }
    // status tags: AND
    if (statusSet.size > 0) {
      for (const st of statusSet) {
        if (!r.tags.includes(st)) return false;
      }
    }
    // search across name + institute (case-insensitive)
    if (q) {
      const hay = `${r.name} ${r.institute}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    // province
    if (provSet.size > 0) {
      const p = resolveProvince(r.name, r.province);
      if (!p || !provSet.has(p)) return false;
    }
    return true;
  });

  // sort: not-yet-due first by ascending remaining; then expired by most-recent; then unknown last
  out.sort((a, b) => {
    const aBucket = a.remainingMs === null ? 2 : a.remainingMs < 0 ? 1 : 0;
    const bBucket = b.remainingMs === null ? 2 : b.remainingMs < 0 ? 1 : 0;
    if (aBucket !== bBucket) return aBucket - bBucket;
    if (aBucket === 0) return (a.remainingMs as number) - (b.remainingMs as number);
    if (aBucket === 1) return (b.remainingMs as number) - (a.remainingMs as number);
    return a.name.localeCompare(b.name, 'zh-CN');
  });

  return out;
}

export const matchesFilter = (state: FilterState) => ({
  query: state.query,
  tags: state.tags,
  status: state.status,
  provinces: state.provinces,
});
