import React from 'react';

/* Pango buttons. Primary is a solid accent fill that brightens on hover;
   secondary is white with a #d6d6d4 outline; quiet uses the lighter
   #e6e6e4 control border; ghost is the on-dark translucent variant. */
const SIZES = {
  sm:   { height: null, padding: '8px 13px', fontSize: 'var(--fs-12)',   radius: 'var(--r-8)' },
  md:   { height: 40,   padding: '0 18px',   fontSize: 'var(--fs-13-5)', radius: 'var(--r-10)' },
  lg:   { height: null, padding: '14px',     fontSize: 'var(--fs-14-5)', radius: 'var(--r-11)' },
  wide: { height: null, padding: '13px',     fontSize: 'var(--fs-13-5)', radius: 'var(--r-11)' }
};

export function Button({ variant = 'primary', size = 'md', children, icon, iconRight, block, disabled, onClick, style, title, type = 'button' }) {
  const s = SIZES[size] || SIZES.md;
  const [hover, setHover] = React.useState(false);
  const looks = {
    primary: { background: 'var(--accent)', color: 'var(--accent-fg)', border: 'none' },
    secondary: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
    quiet: { background: 'var(--surface-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-control)' },
    ghost: { background: 'rgba(255,255,255,.08)', color: 'var(--text-on-dark)', border: '1px solid var(--glass-line)' },
    dark: { background: 'var(--ink)', color: 'var(--text-on-dark)', border: 'none' }
  }[variant] || {};
  const hoverLook = {
    primary: { filter: 'var(--hover-brighten)' },
    secondary: { background: 'var(--surface-hover)' },
    quiet: { background: 'var(--surface-hover)', color: 'var(--text-body)' },
    ghost: { background: 'var(--glass-fill-strong)' },
    dark: { filter: 'brightness(1.35)' }
  }[variant] || {};
  return (
    <button type={type} title={title} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        height: s.height || undefined, padding: s.padding, borderRadius: s.radius,
        fontFamily: 'var(--font-body)', fontWeight: 700, lineHeight: 1, fontSize: s.fontSize,
        cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        transition: 'var(--dur-control)', width: block ? '100%' : undefined,
        opacity: disabled ? .45 : 1,
        ...looks, ...(hover && !disabled ? hoverLook : null), ...style
      }}>
      {icon}{children}{iconRight}
    </button>
  );
}
