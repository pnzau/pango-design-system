import React from 'react';

/* Square icon-only control: 32px inside cards, 38px in the mobile top bar. */
export function IconButton({ children, size = 32, title, onClick, variant = 'quiet', style }) {
  const [hover, setHover] = React.useState(false);
  const radius = size >= 38 ? 'var(--r-10)' : 'var(--r-9)';
  const looks = variant === 'plain'
    ? { border: 'none', background: 'transparent', color: 'var(--text-secondary)' }
    : { border: '1px solid var(--border-control)', background: 'var(--surface-card)', color: 'var(--text-muted)' };
  return (
    <button title={title} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: size, height: size, borderRadius: radius, cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--dur-control)',
        ...looks,
        ...(hover ? { background: variant === 'plain' ? 'var(--surface-chip)' : 'var(--surface-hover)', color: 'var(--text-body)' } : null),
        ...style }}>
      {children}
    </button>
  );
}
