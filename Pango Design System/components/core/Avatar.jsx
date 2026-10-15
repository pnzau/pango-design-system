import React from 'react';

/* Two forms: a dark circle for people, and a tinted rounded square
   for list rows (grey by default, or a category tone). */
export function Avatar({ initials, size = 34, shape = 'circle', background = 'var(--ink)', color = 'var(--text-on-dark)', style }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0,
      borderRadius: shape === 'circle' ? 'var(--r-round)' : (size >= 40 ? 'var(--r-11)' : 'var(--r-10)'),
      background, color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: Math.round(size * 0.38 * 10) / 10, ...style }}>
      {initials}
    </div>
  );
}

export function initialsOf(name) {
  return String(name).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/* Capitalized holder so the helper is reachable from plain HTML. */
export const Initials = initialsOf;
