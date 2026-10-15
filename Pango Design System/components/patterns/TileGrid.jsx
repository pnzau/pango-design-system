import React from 'react';

/* The system's signature device: a set of slots drawn as rows of
   status-coloured tiles. It started as a building of rented units, but the
   shape is general — a floor of desks, a rack of machines, a ward of beds, a
   week of shifts, a yard of containers. Anything with a fixed inventory whose
   fastest read is "which of these are fine and which are not".

   Three renderings of the same data: a legend, a compact dot row (summary
   card) and a full cell grid (detail view). */

export const TILE_TONES = {
  success: { fg: 'var(--success-fg)', bg: 'var(--success-bg)', line: 'var(--success-line)', dot: 'var(--success)' },
  warning: { fg: 'var(--warning-fg)', bg: 'var(--warning-bg)', line: 'var(--warning-line)', dot: 'var(--warning)' },
  danger:  { fg: 'var(--danger-fg)',  bg: 'var(--danger-bg)',  line: 'var(--danger-line)',  dot: 'var(--danger)' },
  info:    { fg: 'var(--info-fg)',    bg: 'var(--info-bg)',    line: 'var(--info-line)',    dot: 'var(--info)' },
  slate:   { fg: 'var(--slate-fg)',   bg: 'var(--slate-bg)',   line: 'var(--slate-line)',   dot: 'var(--slate)' },
  neutral: { fg: 'var(--neutral-fg)', bg: 'var(--neutral-bg)', line: 'var(--neutral-line)', dot: 'var(--neutral)' },
  /* the absent state: a dashed outline, never a grey fill */
  empty:   { fg: 'var(--empty-fg)',   bg: 'var(--empty-bg)',   line: 'var(--empty-line)',   dot: 'var(--empty)', dashed: true }
};

/* Product vocabularies map onto the tones. Extend in the product. */
export const TILE_STATUS = {
  success: 'success', warning: 'warning', danger: 'danger', info: 'info',
  slate: 'slate', neutral: 'neutral', empty: 'empty',
  ok: 'success', due: 'warning', late: 'danger', free: 'empty',
  paid: 'success', soon: 'warning', overdue: 'danger', vacant: 'empty'
};

const toneOf = status => TILE_TONES[TILE_STATUS[status] || status] || TILE_TONES.empty;

/* 15px rounded dot; the empty state is a dashed outline with no fill. */
export function TileDot({ status, size = 15, title }) {
  const t = toneOf(status);
  return (
    <span title={title} style={{ width: size, height: size, borderRadius: size > 12 ? 5 : 4,
      background: t.dashed ? 'transparent' : t.dot,
      border: t.dashed ? '1.5px dashed var(--border-dashed)' : 'none',
      boxSizing: 'border-box', display: 'inline-block' }}></span>
  );
}

/* Legend. Pass the product's own vocabulary — the statuses and what they
   mean here — as `items`. */
export function StatusLegend({ items = [{ status: 'success', label: 'OK' }, { status: 'warning', label: 'Due' }, { status: 'danger', label: 'Late' }, { status: 'empty', label: 'Free' }], compact, style }) {
  return (
    <div style={{ display: 'flex', gap: compact ? 12 : 14, flexWrap: 'wrap', ...style }}>
      {items.map(it => (
        <div key={it.status + it.label} style={{ display: 'flex', alignItems: 'center', gap: compact ? 5 : 6,
          fontSize: compact ? 'var(--fs-11)' : 'var(--fs-11-5)', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <TileDot status={it.status} size={11} />{it.label}
        </div>
      ))}
    </div>
  );
}

/* Full cell: a code, a status dot and one line of context. Mono throughout —
   these are identifiers, not prose. */
export function TileCell({ label, caption, emptyCaption = 'Free', status, onClick, style }) {
  const t = toneOf(status);
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', flexDirection: 'column', gap: 7, justifyContent: 'space-between',
        minHeight: 58, padding: '9px 11px', borderRadius: 'var(--r-9)', fontFamily: 'var(--font-mono)',
        cursor: onClick ? 'pointer' : 'default', background: t.bg, border: '1px solid ' + t.line, color: t.fg,
        filter: hover && onClick ? 'var(--hover-darken)' : undefined, ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 'var(--fs-12)' }}>{label}</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.dot, flexShrink: 0 }}></span>
      </div>
      <div style={{ fontSize: 'var(--fs-10)', opacity: .8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {caption || emptyCaption}
      </div>
    </div>
  );
}

const tilesOf = row => row.tiles || row.units || [];
const keyOf = (t, i) => String(t.label != null ? t.label : t.id != null ? t.id : i);
const labelOf = t => (t.label != null ? t.label : t.id);
const captionOf = t => (t.caption != null ? t.caption : t.tenant);

/* Compact row for a summary card: a short label and a line of dots. */
export function TileDots({ label, tiles, units, animate, index = 0, emptyCaption = 'Free', style }) {
  const list = tiles || units || [];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, transformOrigin: 'bottom',
      animation: animate ? `floorRise var(--dur-floor) var(--ease-sheet) ${index * 0.05}s both` : undefined, ...style }}>
      <span style={{ fontSize: 'var(--fs-9-5)', fontWeight: 700, color: 'var(--text-faint)',
        fontFamily: 'var(--font-mono)', width: 34, flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {list.map((t, i) => <TileDot key={keyOf(t, i)} status={t.status}
          title={labelOf(t) + ' · ' + (captionOf(t) || emptyCaption)} />)}
      </div>
    </div>
  );
}

/* Full row for the detail view: right-aligned label + cell grid. */
export function TileRow({ label, tiles, units, onTileClick, animate, index = 0, emptyCaption = 'Free', minCell = 86, style }) {
  const list = tiles || units || [];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, transformOrigin: 'bottom',
      animation: animate ? `floorRise var(--dur-floor) var(--ease-sheet) ${index * 0.05}s both` : undefined, ...style }}>
      <div style={{ width: 46, flexShrink: 0, textAlign: 'right', paddingRight: 4 }}>
        <div style={{ fontSize: 'var(--fs-10)', fontWeight: 700, color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>{label}</div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(auto-fit,minmax(${minCell}px,1fr))`, gap: 8 }}>
        {list.map((t, i) => <TileCell key={keyOf(t, i)} label={labelOf(t)} status={t.status}
          caption={captionOf(t)} emptyCaption={emptyCaption}
          onClick={onTileClick ? () => onTileClick(t) : undefined} />)}
      </div>
    </div>
  );
}

/* The whole inventory: an inset panel of rows, first row at the top. */
export function TileGrid({ rows, floors, variant = 'cells', onTileClick, onUnitClick, animate, padding, emptyCaption, style }) {
  const list = rows || floors || [];
  const dots = variant === 'dots';
  const pick = onTileClick || onUnitClick;
  return (
    <div style={{ background: 'var(--surface-inset)', border: '1px solid var(--border-inset)',
      borderRadius: dots ? 'var(--r-12)' : 'var(--r-13)', padding: padding != null ? padding : (dots ? 14 : 16),
      display: 'flex', flexDirection: 'column', gap: dots ? 6 : 10, ...style }}>
      {list.map((row, i) => dots
        ? <TileDots key={row.label} label={row.label} tiles={tilesOf(row)} animate={animate} index={i} emptyCaption={emptyCaption} />
        : <TileRow key={row.label} label={row.label} tiles={tilesOf(row)} onTileClick={pick} animate={animate} index={i} emptyCaption={emptyCaption} />)}
    </div>
  );
}

/* Aliases kept for the rental product this pattern came from. */
export const UnitGrid = TileGrid;
export const UnitCell = TileCell;
export const UnitDot = TileDot;
export const FloorRow = TileRow;
export const FloorDots = TileDots;
