import type { FilterState, Source, ViewMode } from './types';
import { SOURCES } from './types';

const DEFAULT: FilterState = {
  source: 'camp2026',
  view: 'list',
  query: '',
  tags: [],
  status: [],
  provinces: [],
};

const VALID_SOURCES = new Set(SOURCES.map((s) => s.id));
const VALID_VIEWS = new Set<ViewMode>(['list', 'calendar']);

function readFromUrl(): FilterState {
  if (typeof window === 'undefined') return { ...DEFAULT };
  const p = new URLSearchParams(window.location.search);
  const src = p.get('src') as Source | null;
  const v = p.get('view') as ViewMode | null;
  return {
    source: src && VALID_SOURCES.has(src) ? src : DEFAULT.source,
    view: v && VALID_VIEWS.has(v) ? v : DEFAULT.view,
    query: p.get('q') ?? '',
    tags: parseList(p.get('tags')) as FilterState['tags'],
    status: parseList(p.get('status')) as FilterState['status'],
    provinces: parseList(p.get('prov')),
  };
}

function parseList(v: string | null): string[] {
  if (!v) return [];
  return v.split(',').map((s) => s.trim()).filter(Boolean);
}

function writeToUrl(s: FilterState) {
  if (typeof window === 'undefined') return;
  const p = new URLSearchParams();
  if (s.source !== DEFAULT.source) p.set('src', s.source);
  if (s.view !== DEFAULT.view) p.set('view', s.view);
  if (s.query) p.set('q', s.query);
  if (s.tags.length) p.set('tags', s.tags.join(','));
  if (s.status.length) p.set('status', s.status.join(','));
  if (s.provinces.length) p.set('prov', s.provinces.join(','));
  const qs = p.toString();
  const url = qs ? `?${qs}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export const filters: FilterState = $state(readFromUrl());

let initialised = false;
export function initFilterSync() {
  if (initialised) return;
  initialised = true;

  $effect.root(() => {
    $effect(() => {
      writeToUrl({
        source: filters.source,
        view: filters.view,
        query: filters.query,
        tags: filters.tags,
        status: filters.status,
        provinces: filters.provinces,
      });
    });
  });

  window.addEventListener('popstate', () => {
    const next = readFromUrl();
    filters.source = next.source;
    filters.view = next.view;
    filters.query = next.query;
    filters.tags = next.tags;
    filters.status = next.status;
    filters.provinces = next.provinces;
  });
}

export function clearAllFilters() {
  filters.query = '';
  filters.tags = [];
  filters.status = [];
  filters.provinces = [];
}

export function toggle<T extends string>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}
