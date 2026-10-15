import React from 'react';

/* The universal Pango container: white, one hairline #ececea border,
   16px radius, no resting shadow. Interactive cards lift 2px with a
   deep, soft shadow and a darker border. */
export function Card({ children, padding = 'var(--pad-card)', radius = 'var(--r-card)', interactive, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => interactive && setHover(true)} onMouseLeave={() => interactive && setHover(false)}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-card)', borderRadius: radius,
        padding, transition: interactive ? 'var(--dur-card)' : undefined, cursor: interactive ? 'pointer' : undefined,
        ...(hover ? { border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-card-hover)', transform: 'var(--lift-card)' } : null),
        ...style }}>
      {children}
    </div>
  );
}

/* Nested panel inside a card: #fafafa on #f0f0ee, 12px radius. */
export function InsetPanel({ children, padding = 14, radius = 'var(--r-12)', style }) {
  return (
    <div style={{ background: 'var(--surface-inset)', border: '1px solid var(--border-inset)', borderRadius: radius, padding, ...style }}>
      {children}
    </div>
  );
}

/* The dark gradient panel used for AI briefs and totals. */
export function DarkPanel({ children, padding = '18px 22px', radius = 'var(--r-16)', flat, style }) {
  return (
    <div style={{ background: flat ? 'var(--surface-dark)' : 'var(--surface-dark-gradient)', color: 'var(--text-on-dark)',
      borderRadius: radius, padding, ...style }}>
      {children}
    </div>
  );
}
