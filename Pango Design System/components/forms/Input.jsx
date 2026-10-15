import React from 'react';

/* Inputs: 1px control border, 10–11px radius. The auth screen fills them
   with the inset surface and swaps to the card surface with a focus border;
   in-app fields keep the card surface throughout. */
export function Input({ value, onChange, placeholder, type = 'text', tone = 'app', mono, disabled, style }) {
  const [focus, setFocus] = React.useState(false);
  const auth = tone === 'auth';
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ width: '100%', border: '1px solid var(--border-control)',
        background: auth ? 'var(--surface-inset)' : 'var(--surface-card)',
        borderRadius: auth ? 'var(--r-11)' : 'var(--r-10)',
        padding: auth ? '13px 14px' : '10px 12px',
        fontSize: auth ? 'var(--fs-14)' : 'var(--fs-13)',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        color: 'var(--text-body)', outline: 'none',
        ...(focus ? { border: '1px solid var(--border-focus)', background: 'var(--surface-card)' } : null),
        ...style }} />
  );
}

export function TextArea({ value, onChange, placeholder, mono, minHeight = 70, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{ width: '100%', minHeight, border: '1px solid var(--border-control)', borderRadius: mono ? 'var(--r-11)' : 'var(--r-10)',
        padding: mono ? '12px 14px' : '11px 12px', fontSize: 'var(--fs-13)',
        fontFamily: mono ? 'var(--font-mono)' : 'inherit', lineHeight: 'var(--lh-body)',
        resize: 'vertical', outline: 'none', color: 'var(--text-body)',
        ...(focus ? { border: '1px solid var(--border-focus)' } : null), ...style }} />
  );
}

/* Native select with the app's own chevron drawn as a background image. */
export function Select({ value, onChange, options = [], children, size = 'md', style }) {
  const lg = size === 'lg';
  return (
    <select value={value} onChange={onChange}
      style={{ appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        border: '1px solid var(--border-control)',
        background: "var(--surface-card) url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a7a7a' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>\") no-repeat right 11px center",
        backgroundSize: '12px', borderRadius: 'var(--r-9)', padding: '0 32px 0 12px',
        height: lg ? 'var(--control-h-lg)' : 'var(--control-h)',
        fontWeight: 700, fontSize: lg ? 'var(--fs-14)' : 'var(--fs-12-5)',
        color: 'var(--text-body)', cursor: 'pointer', minWidth: 150, ...style }}>
      {children || options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function SearchField({ placeholder = 'Search…', value, onChange, width = 230, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-control)',
      background: 'var(--surface-card)', borderRadius: 'var(--r-10)', padding: 'var(--pad-control)',
      height: 'var(--control-h)', gap: 9, color: 'var(--text-placeholder)', width, ...style }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
      <input placeholder={placeholder} value={value} onChange={onChange}
        style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 'var(--fs-13)', width: '100%', color: 'var(--text-body)' }} />
    </div>
  );
}
