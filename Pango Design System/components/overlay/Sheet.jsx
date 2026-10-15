import React from 'react';

/* One component, two behaviours: a centred modal on desktop, a bottom
   sheet on mobile that slides up on a soft ease with a grab handle.
   The scrim is ink at 45% with a 3px blur. */
export function Sheet({ open, onClose, children, width = 460, mobile, title, style }) {
  if (!open) return null;
  return (
    <div onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'var(--overlay-scrim)',
        backdropFilter: 'var(--blur-scrim)', display: 'flex',
        alignItems: mobile ? 'flex-end' : 'center', justifyContent: 'center',
        padding: mobile ? 0 : 24 }}>
      <div onClick={e => e.stopPropagation()}
        style={mobile
          ? { width: '100%', maxWidth: width, maxHeight: '88vh', overflowY: 'auto', background: 'var(--surface-card)',
              borderRadius: 'var(--r-sheet)', boxShadow: 'var(--shadow-sheet)',
              animation: 'sheetUp var(--dur-sheet) var(--ease-sheet) both', ...style }
          : { width, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', background: 'var(--surface-card)',
              borderRadius: 'var(--r-18)', boxShadow: 'var(--shadow-modal)', ...style }}>
        {mobile ? <div style={{ width: 36, height: 4, borderRadius: 3, background: 'var(--grey-500)', margin: '8px auto 14px' }}></div> : null}
        {title ? (
          <div style={{ padding: mobile ? '0 20px 14px' : '22px 24px 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-17)', letterSpacing: 'var(--ls-display-sm)' }}>{title}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
