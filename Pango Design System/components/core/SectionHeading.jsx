import React from 'react';

/* Section title with a hairline rule filling the gap to trailing content. */
export function SectionHeading({ children, trailing, size = 'var(--fs-16)', style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, ...style }}>
      <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size }}>{children}</h2>
      <div style={{ height: 1, flex: 1, background: 'var(--border-card)' }}></div>
      {trailing}
    </div>
  );
}

/* 11px/700 uppercase eyebrow above form fields and small lists. */
export function EyebrowLabel({ children, style }) {
  return (
    <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'var(--fs-11)', lineHeight: 1.2, color: 'var(--text-label)', letterSpacing: 'var(--ls-label)', ...style }}>{children}</div>
  );
}
