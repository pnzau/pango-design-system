import React from 'react';

/* Neutral chip (attributes, line items) and toned chip (categories, roles,
   teams, series). A toned chip fills with its tone at ~8%, so the same tone
   works on a white card and a dark one. */
export function Tag({ children, tone, size = 'md', style }) {
  const dims = size === 'sm'
    ? { fontSize: 'var(--fs-10-5)', padding: '4px 8px', radius: 'var(--r-5)' }
    : size === 'xs'
      ? { fontSize: 'var(--fs-10)', padding: '3px 8px', radius: 'var(--r-6)' }
      : { fontSize: 'var(--fs-11)', padding: '4px 9px', radius: 'var(--r-6)' };
  const fill = tone
    ? (tone.charAt(0) === '#' ? tone + '14' : `color-mix(in oklab, ${tone} 12%, transparent)`)
    : null;
  const look = tone
    ? { color: tone, background: fill }
    : { color: 'var(--text-secondary)', background: 'var(--surface-chip-soft)' };
  return (
    <span style={{ fontSize: dims.fontSize, fontWeight: tone ? 700 : 600, borderRadius: dims.radius,
      padding: dims.padding, whiteSpace: 'nowrap', ...look, ...style }}>{children}</span>
  );
}

/* Categorical colour. A product's taxonomy is its own — assign the tones it
   knows about here, and anything a user types is hashed onto the eight-hue
   palette so the same label always gets the same colour. The palette is
   tokens, so series colours re-map in dark mode. */
export const CATEGORY_TONE = {};
const PALETTE = ['var(--cat-1)','var(--cat-2)','var(--cat-3)','var(--cat-4)','var(--cat-5)','var(--cat-6)','var(--cat-7)','var(--cat-8)'];
export function categoryTone(cat) {
  if (CATEGORY_TONE[cat]) return CATEGORY_TONE[cat];
  let h = 0; for (let i = 0; i < String(cat).length; i++) h = (h * 31 + String(cat).charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

/* Capitalized holder so the helper is reachable from plain HTML. */
export const CategoryTone = categoryTone;
