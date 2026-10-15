import React from 'react';

/* Three badge jobs in the app: a mono count in the nav, a tiny caps
   flag (AI / LIVE) and a pill on photography. */
export function Badge({ children, variant = 'count', tone = 'var(--accent)', style }) {
  const looks = {
    count: { background: 'var(--slate-bg)', color: 'var(--slate)', fontSize: 'var(--fs-11)', fontWeight: 700, borderRadius: 'var(--r-7)', padding: '2px 7px', fontFamily: 'var(--font-mono)' },
    countAccent: { background: tone + '14', color: tone, fontSize: 'var(--fs-11)', fontWeight: 700, borderRadius: 'var(--r-7)', padding: '2px 7px', fontFamily: 'var(--font-mono)' },
    flag: { background: tone, color: '#fff', fontSize: 'var(--fs-9-5)', fontWeight: 800, borderRadius: 'var(--r-6)', padding: '2px 6px', letterSpacing: 'var(--ls-caps-badge)' },
    live: { background: tone, color: 'var(--ink)', fontSize: 'var(--fs-9-5)', fontWeight: 800, borderRadius: 'var(--r-5)', padding: '2px 6px', letterSpacing: '.4px' },
    pill: { background: tone, color: '#fff', fontSize: 'var(--fs-12)', fontWeight: 800, borderRadius: 'var(--r-pill)', padding: '7px 14px', letterSpacing: 'var(--ls-label)' },
    pillMono: { background: tone, color: '#fff', fontSize: 'var(--fs-11)', fontWeight: 700, borderRadius: 'var(--r-pill)', padding: '3px 9px', fontFamily: 'var(--font-mono)' }
  }[variant] || {};
  return <span style={{ whiteSpace: 'nowrap', ...looks, ...style }}>{children}</span>;
}
