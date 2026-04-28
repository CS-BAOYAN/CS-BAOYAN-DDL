import type { Urgency } from './types';

export function parseDeadline(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isFinite(t) ? t : null;
}

export function urgency(remainingMs: number | null): Urgency {
  if (remainingMs === null) return 'unknown';
  if (remainingMs < 0) return 'expired';
  const h = remainingMs / 3_600_000;
  if (h < 24) return 'critical';
  if (h < 24 * 7) return 'soon';
  if (h < 24 * 30) return 'near';
  return 'far';
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function splitCountdown(ms: number): CountdownParts {
  const m = Math.max(0, ms);
  const days = Math.floor(m / 86_400_000);
  const hours = Math.floor((m % 86_400_000) / 3_600_000);
  const minutes = Math.floor((m % 3_600_000) / 60_000);
  const seconds = Math.floor((m % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

/** "3天 04:21:09" / "00:00:42" / "已结束" */
export function formatCountdown(remainingMs: number | null): string {
  if (remainingMs === null) return 'N/A';
  if (remainingMs < 0) return '已结束';
  const { days, hours, minutes, seconds } = splitCountdown(remainingMs);
  const pad = (n: number) => String(n).padStart(2, '0');
  if (days > 0) return `${days}天 ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Shorter, scan-friendly: "3d 4h" / "12h 30m" / "42s" */
export function formatRemainingShort(remainingMs: number | null): string {
  if (remainingMs === null) return '—';
  if (remainingMs < 0) return '已结束';
  const { days, hours, minutes, seconds } = splitCountdown(remainingMs);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

/** Map remaining time onto a 0–1 progress against a chosen window. */
export function progressAgainst(remainingMs: number | null, windowDays = 90): number {
  if (remainingMs === null) return 0;
  if (remainingMs < 0) return 1;
  const windowMs = windowDays * 86_400_000;
  return Math.max(0, Math.min(1, 1 - remainingMs / windowMs));
}

const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

export function formatDate(ms: number | null): string {
  if (ms === null) return '未公布';
  const d = new Date(ms);
  return `${d.getFullYear()} 年 ${MONTHS[d.getMonth()]} ${d.getDate()} 日`;
}

export function formatDateShort(ms: number | null): string {
  if (ms === null) return '—';
  const d = new Date(ms);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function formatDateTime(ms: number | null): string {
  if (ms === null) return '—';
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** YYYY-MM-DD in local time */
export function dateKey(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}
