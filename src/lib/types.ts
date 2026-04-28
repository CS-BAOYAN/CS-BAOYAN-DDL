export type Source = 'camp2026' | 'camp2025' | 'camp2024' | 'yutuimian2024';

export const SOURCES: { id: Source; label: string }[] = [
  { id: 'camp2026', label: '夏令营 2026' },
  { id: 'camp2025', label: '夏令营 2025' },
  { id: 'camp2024', label: '夏令营 2024' },
  { id: 'yutuimian2024', label: '预推免 2024' },
];

export interface School {
  name: string;
  institute: string;
  description: string;
  deadline: string;
  website: string;
  tags: string[];
  province?: string;
}

export const SCHOOL_TAGS = ['TOP2', '港三', '华五', 'C9', '985', '211', '双非', '四非', '研究院', '联培'] as const;
export type SchoolTag = (typeof SCHOOL_TAGS)[number];

export const STATUS_TAGS = ['已开营', '已结营'] as const;
export type StatusTag = (typeof STATUS_TAGS)[number];

export type ViewMode = 'list' | 'calendar';

export interface FilterState {
  source: Source;
  view: ViewMode;
  query: string;
  tags: SchoolTag[];
  status: StatusTag[];
  provinces: string[];
}

export type Urgency = 'expired' | 'critical' | 'soon' | 'near' | 'far' | 'unknown';

export interface DerivedSchool extends School {
  /** ms epoch; null if no deadline */
  deadlineMs: number | null;
  /** ms remaining; null if no deadline. Negative if expired. */
  remainingMs: number | null;
  urgency: Urgency;
}
