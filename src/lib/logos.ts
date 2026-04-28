import logoMap from '$data/logos.json';

const overrides: Record<string, string> = {
  香港科技大学: '/university_logos/香港科技大学.jpg',
  香港中文大学: '/university_logos/香港中文大学.jpg',
  '香港中文大学（深圳）': '/university_logos/香港中文大学.jpg',
  上海创智学院: '/university_logos/上海创智学院.jpg',
};

export function getLogoUrl(name: string): string | null {
  if (overrides[name]) return overrides[name];
  const map = logoMap as Record<string, string>;
  if (map[name]) return map[name];
  // soft fallback: strip the trailing parenthesised qualifier and retry
  const stripped = name.replace(/[（(].*?[）)]$/, '');
  if (stripped !== name && map[stripped]) return map[stripped];
  return null;
}

/** Best-effort initials for a school whose logo we can't resolve. */
export function getInitials(name: string): string {
  // strip parenthesised qualifier
  const cleaned = name.replace(/[（(].*?[）)]$/, '').trim();
  if (/^[一-龥]/.test(cleaned)) {
    return cleaned.slice(0, 2);
  }
  // English: take initials of words
  return cleaned
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
}

/** Deterministic colour for a string (used for tag chips that aren't the well-known tiers). */
export function hashColor(text: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  const hue = Math.abs(h) % 360;
  return {
    bg: `hsl(${hue} 60% 18% / 0.9)`,
    fg: `hsl(${hue} 70% 80%)`,
  };
}
