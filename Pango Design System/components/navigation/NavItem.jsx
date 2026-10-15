import React from 'react';

/* Sidebar row: icon, label, optional trailing badge. Active state is a
   grey chip fill with ink text — never an accent bar or accent fill. */
export function NavItem({ icon, children, active, badge, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px',
        borderRadius: 'var(--r-10)', border: 'none', cursor: 'pointer', width: '100%',
        textAlign: 'left', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 'var(--fs-13-5)',
        transition: 'var(--dur-control)',
        background: active ? 'var(--surface-chip)' : (hover ? 'var(--surface-hover)' : 'transparent'),
        color: active ? 'var(--text-body)' : 'var(--text-secondary)', ...style }}>
      {icon}{children}{badge}
    </button>
  );
}

/* Grey-track segmented control with a white shadowed thumb. */
export function SegmentedControl({ options = [], value, onChange, radius = 'var(--r-11)', style }) {
  return (
    <div style={{ display: 'flex', background: 'var(--surface-chip)', borderRadius: radius, padding: 4, gap: 4, ...style }}>
      {options.map(o => {
        const active = o.value === value;
        return (
          <button key={o.value} onClick={() => onChange && onChange(o.value)}
            style={{ flex: 1, border: 'none', borderRadius: 'var(--r-8)', padding: 8, fontWeight: 700,
              fontSize: 'var(--fs-12-5)', cursor: 'pointer', transition: 'var(--dur-control)',
              fontFamily: 'var(--font-body)', whiteSpace: 'nowrap',
              background: active ? 'var(--surface-card)' : 'transparent',
              color: active ? 'var(--text-body)' : 'var(--text-faint)',
              boxShadow: active ? 'var(--shadow-thumb)' : 'none' }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
