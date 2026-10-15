import React from 'react';

/* Rounded-square checkbox that fills with the accent and shows a
   thick round-capped tick. Used as a whole clickable row in the
   tenant payment-verification flow. */
export function Checkbox({ checked, onChange, size = 21, style }) {
  return (
    <span onClick={onChange}
      style={{ width: size, height: size, borderRadius: 'var(--r-6)', flexShrink: 0, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--dur-control)',
        background: checked ? 'var(--accent)' : 'var(--surface-card)',
        border: checked ? '1px solid var(--accent)' : '1px solid var(--border-strong)', ...style }}>
      {checked ? (
        <svg width={size * 0.57} height={size * 0.57} viewBox="0 0 24 24" fill="none" stroke="var(--accent-fg)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>
      ) : null}
    </span>
  );
}

/* The whole-row form of the checkbox: box, name + basis, amount. */
export function CheckRow({ checked, onChange, name, basis, amount, style }) {
  return (
    <div onClick={onChange}
      style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer',
        padding: '11px 13px', borderRadius: 'var(--r-11)',
        background: checked ? 'var(--surface-inset)' : 'var(--surface-card)',
        border: checked ? '1px solid var(--border-control)' : '1px solid var(--border-inset)', ...style }}>
      <Checkbox checked={checked} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 'var(--fs-13-5)' }}>{name}</div>
        {basis ? <div style={{ fontSize: 'var(--fs-11)', color: 'var(--text-faint)' }}>{basis}</div> : null}
      </div>
      {amount ? <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 'var(--fs-13-5)' }}>{amount}</span> : null}
    </div>
  );
}

/* Track-and-knob switch for automation toggles. */
export function Switch({ checked, onChange, style }) {
  return (
    <div onClick={onChange}
      style={{ width: 44, height: 25, borderRadius: 'var(--r-pill)', cursor: 'pointer', flexShrink: 0,
        transition: 'var(--dur-toggle)', position: 'relative',
        background: checked ? 'var(--accent)' : 'var(--border-strong)', ...style }}>
      <div style={{ position: 'absolute', top: 3, left: checked ? 22 : 3, width: 19, height: 19,
        borderRadius: 'var(--r-round)', background: 'var(--surface-card)', transition: 'var(--dur-toggle)', boxShadow: 'var(--shadow-knob)' }}></div>
    </div>
  );
}
