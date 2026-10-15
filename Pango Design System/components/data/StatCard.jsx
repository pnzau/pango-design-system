import React from 'react';

/* Label / display figure / trend line. Trend colour carries the meaning:
   green when healthy, grey when neutral, red when overdue. */
export function StatCard({ label, value, trend, trendColor = 'var(--grey-850)', valueColor, sub, style }) {
  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid var(--border-card)', borderRadius: 'var(--r-14)', padding: 'var(--pad-cell)', ...style }}>
      <div style={{ fontSize: 'var(--fs-12)', fontWeight: 600, color: 'var(--text-faint)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-27)', marginTop: 7, letterSpacing: 'var(--ls-display-md)', color: valueColor }}>{value}</div>
      {trend ? <div style={{ fontSize: 'var(--fs-11-5)', fontWeight: 600, marginTop: 5, color: trendColor }}>{trend}</div> : null}
      {sub ? <div style={{ fontSize: 'var(--fs-12)', color: 'var(--text-faint)', marginTop: 4 }}>{sub}</div> : null}
    </div>
  );
}
