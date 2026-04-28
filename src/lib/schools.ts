import raw from '$data/schools.json';
import type { School, Source } from './types';

export const schoolsBySource = raw as Record<Source, School[]>;

export function getSchools(src: Source): School[] {
  return schoolsBySource[src] ?? [];
}

export function sourceCounts(): Record<Source, number> {
  return {
    camp2026: schoolsBySource.camp2026?.length ?? 0,
    camp2025: schoolsBySource.camp2025?.length ?? 0,
    camp2024: schoolsBySource.camp2024?.length ?? 0,
    yutuimian2024: schoolsBySource.yutuimian2024?.length ?? 0,
  };
}
