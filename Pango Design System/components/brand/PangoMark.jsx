import React from 'react';

/* The Pango mark: a dark rounded tile holding three stacked bars —
   accent, white 85%, white 55% — read as floors of a building.
   Sizes are the three the app actually ships (44 / 38 / 34). */
const TILE = {
  lg: { box: 44, radius: 13, pad: '11px 9px', bar: 3.5, gap: 3.5, word: 24, sub: 11 },
  md: { box: 38, radius: 11, pad: '9px 8px', bar: 3, gap: 3, word: 20, sub: 10.5 },
  sm: { box: 34, radius: 10, pad: '8px 7px', bar: 2.5, gap: 3, word: 18, sub: 10 }
};

export function PangoMark({ size = 'md', tone = 'dark', accent = 'var(--accent)', wordmark = true, tagline = false, style }) {
  const t = TILE[size] || TILE.md;
  const tileBg = tone === 'glass' ? 'rgba(255,255,255,.15)' : tone === 'black' ? 'var(--black)' : 'var(--ink)';
  const wordColor = tone === 'onDark' || tone === 'glass' ? 'var(--text-on-dark)' : 'var(--text-body)';
  const bar = (bg, opacity) => ({ height: t.bar + 'px', borderRadius: 'var(--r-2)', background: bg, opacity });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size === 'lg' ? 13 : 11, ...style }}>
      <div style={{ width: t.box, height: t.box, borderRadius: t.radius, background: tone === 'glass' ? tileBg : tileBg, backdropFilter: tone === 'glass' ? 'var(--blur-glass)' : undefined, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: t.gap, padding: t.pad, flexShrink: 0 }}>
        <div style={bar(accent)}></div>
        <div style={bar('#fff', .85)}></div>
        <div style={bar('#fff', .55)}></div>
      </div>
      {wordmark ? (
        <div style={{ lineHeight: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: t.word, letterSpacing: 'var(--ls-display-md)', color: wordColor }}>Pango</div>
          {tagline ? <div style={{ fontSize: t.sub, color: 'var(--grey-850)', fontWeight: 600, letterSpacing: 'var(--ls-label)', marginTop: size === 'lg' ? 4 : 3 }}>RENTALS, HANDLED</div> : null}
        </div>
      ) : null}
    </div>
  );
}
