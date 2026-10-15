import React from 'react';

/* Sticky page header: translucent app-background veil with an 8px blur,
   display title, grey subtitle, then any controls and one primary CTA. */
export function PageHeader({ title, subtitle, children, cta, style }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--header-veil)',
      backdropFilter: 'var(--blur-header)', borderBottom: '1px solid var(--border-card)',
      padding: 'var(--pad-header)', display: 'flex', alignItems: 'center', gap: 20, ...style }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-23)', letterSpacing: 'var(--ls-display-md)' }}>{title}</h1>
        {subtitle ? <p style={{ margin: '3px 0 0', color: 'var(--text-muted)', fontSize: 'var(--fs-13)' }}>{subtitle}</p> : null}
      </div>
      {children}
      {cta}
    </header>
  );
}
