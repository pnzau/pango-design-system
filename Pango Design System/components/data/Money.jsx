import React from 'react';

/* Figures are always mono, always grouped in thousands, and the currency is
   the product's, not the system's. Set it once per app:

     setCurrency('EUR', { locale: 'de-DE' })    // 12.500 €
     setCurrency('KES')                          // KES 12,500

   `formatMoney` follows that setting; `Money` renders it. Pass `currency`
   on a single figure when a screen shows two. */
let DEFAULTS = { currency: '', locale: 'en-US', decimals: 0, position: 'before' };

export function setCurrency(currency, opts) {
  DEFAULTS = { ...DEFAULTS, currency, ...(opts || {}) };
  return DEFAULTS;
}

export function formatMoney(n, opts) {
  const o = { ...DEFAULTS, ...(opts || {}) };
  const figure = Number(n).toLocaleString(o.locale, {
    minimumFractionDigits: o.decimals, maximumFractionDigits: o.decimals
  });
  if (!o.currency) return figure;
  return o.position === 'after' ? figure + ' ' + o.currency : o.currency + ' ' + figure;
}

export function Money({ amount, value, currency, decimals, size = 'var(--fs-14)', weight = 700, color, align, style }) {
  const opts = {};
  if (currency != null) opts.currency = currency;
  if (decimals != null) opts.decimals = decimals;
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: weight, fontSize: size, color,
      fontVariantNumeric: 'tabular-nums', textAlign: align, display: align ? 'block' : undefined, ...style }}>
      {value != null ? value : formatMoney(amount, opts)}
    </span>
  );
}

/* Thin progress bar. The default track reads on both a light card and a dark
   panel; pass `track` for a panel that needs more contrast. */
export function ProgressBar({ value = 0, tone = 'var(--accent)', track = 'var(--glass-fill)', height = 8, style }) {
  return (
    <div style={{ height, background: track, borderRadius: 5, overflow: 'hidden', ...style }}>
      <div style={{ width: Math.max(0, Math.min(100, value)) + '%', height: '100%', background: tone, borderRadius: 5, transition: 'var(--dur-toggle)' }}></div>
    </div>
  );
}

/* Only capitalized exports reach window.<Namespace>, so the formatter helpers
   are also published under one capitalized holder for use from plain HTML. */
export const MoneyFormat = { setCurrency, formatMoney };
