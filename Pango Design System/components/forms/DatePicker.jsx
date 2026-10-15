import React from 'react';

/* Date and month fields. The native picker is the one control that can't be
   styled — it renders the browser's own chrome, its own blue and its own
   type — so the system has no <input type="date"> anywhere. This is the same
   42px control as Dropdown, opening a month grid with mono day figures.
   Values are ISO strings (YYYY-MM-DD / YYYY-MM) parsed without timezone
   drift. */

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const pad = n => String(n).padStart(2, '0');
const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
function parseISO(v) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) return null;
  const [y, m, d] = v.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return isNaN(date.getTime()) ? null : date;
}
const LONG_DATE = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
export const MONTHS_SHORT = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(new Date(2000, i, 1)));
/* Monday-first offset for the first of the month. */
const leadingBlanks = (y, m) => (new Date(y, m, 1).getDay() + 6) % 7;

function usePopover(anchorRef, open, onClose) {
  const popRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const onDown = e => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      if (anchorRef.current && anchorRef.current.contains(e.target)) return;
      onClose();
    };
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, onClose, anchorRef]);
  return popRef;
}

const panel = width => ({
  position: 'absolute', zIndex: 60, left: 0, top: 'calc(100% + 6px)', width,
  boxSizing: 'border-box', maxWidth: 'calc(100vw - 32px)', padding: 12,
  background: 'var(--surface-popover)', border: '1px solid var(--border-card)',
  borderRadius: 'var(--r-12)', boxShadow: 'var(--shadow-popover)',
  animation: 'popIn var(--dur-control) var(--ease-sheet) both'
});

function Trigger({ innerRef, open, disabled, height, filled, children, onClick, ariaLabel }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button ref={innerRef} type="button" disabled={disabled} onClick={onClick} aria-label={ariaLabel}
      aria-haspopup="dialog" aria-expanded={open}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height,
        padding: '0 12px', textAlign: 'left', borderRadius: 'var(--r-10)',
        background: 'var(--surface-card)',
        border: '1px solid ' + (open ? 'var(--border-focus)' : hover && !disabled ? 'var(--border-strong)' : 'var(--border-control)'),
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .45 : 1,
        transition: 'border-color var(--dur-control)' }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: filled ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: 'var(--fs-13-5)', fontWeight: filled ? 600 : 600,
        fontVariantNumeric: 'tabular-nums',
        color: filled ? 'var(--text-body)' : 'var(--text-placeholder)' }}>{children}</span>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
        strokeLinecap="round" style={{ flexShrink: 0, color: 'var(--text-muted)' }}>
        <rect x="3" y="5" width="18" height="16" rx="3" /><path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    </button>
  );
}

function NavButton({ label, dir, onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" aria-label={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28,
        flexShrink: 0, borderRadius: 'var(--r-8)', border: 'none', cursor: 'pointer',
        background: hover ? 'var(--surface-hover)' : 'transparent',
        color: hover ? 'var(--text-body)' : 'var(--text-secondary)', transition: 'background var(--dur-control)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'prev' ? 'm15 18-6-6 6-6' : 'm9 6 6 6-6 6'} />
      </svg>
    </button>
  );
}

function GridButton({ selected, today, disabled, mono, height, onClick, children, label }) {
  const [hover, setHover] = React.useState(false);
  const bg = selected ? 'var(--accent)' : today ? 'var(--surface-chip)' : hover && !disabled ? 'var(--surface-hover)' : 'transparent';
  const fg = selected ? 'var(--accent-fg)' : today || hover ? 'var(--text-body)' : 'var(--text-secondary)';
  return (
    <button type="button" disabled={disabled} aria-pressed={selected} aria-label={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height,
        borderRadius: 'var(--r-8)', border: 'none', background: bg, color: fg,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize: mono ? 'var(--fs-12-5)' : 'var(--fs-12-5)', fontVariantNumeric: 'tabular-nums',
        fontWeight: selected || today ? 700 : 600, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? .3 : 1, transition: 'background var(--dur-control)' }}>
      {children}
    </button>
  );
}

const quietAction = (hover, tone) => ({
  padding: '6px 9px', borderRadius: 'var(--r-8)', border: 'none', cursor: 'pointer',
  background: hover ? 'var(--surface-hover)' : 'transparent', color: tone,
  fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12-5)', fontWeight: 700,
  transition: 'background var(--dur-control)'
});

function QuietAction({ tone = 'var(--accent)', disabled, onClick, children, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...quietAction(hover, tone), opacity: disabled ? .45 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>{children}</button>
  );
}

export function DatePicker({
  value = '', onChange, max, min, placeholder = 'Pick a date', disabled = false,
  clearable = true, height = 42, ariaLabel, style
}) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const selected = parseISO(value);
  const [cursor, setCursor] = React.useState(() => selected || new Date());
  const popRef = usePopover(triggerRef, open, () => setOpen(false));

  const year = cursor.getFullYear(), month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayISO = toISO(new Date());
  const outOfRange = iso => (!!max && iso > max) || (!!min && iso < min);

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <Trigger innerRef={triggerRef} open={open} disabled={disabled} height={height}
        filled={!!selected} ariaLabel={ariaLabel}
        onClick={() => { if (selected) setCursor(selected); setOpen(o => !o); }}>
        {selected ? LONG_DATE.format(selected) : placeholder}
      </Trigger>

      {open && (
        <div ref={popRef} role="dialog" aria-label="Choose a date" style={panel(272)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <NavButton label="Previous month" dir="prev" onClick={() => setCursor(new Date(year, month - 1, 1))} />
            <div style={{ flex: 1, textAlign: 'center', font: 'var(--fw-bold) var(--fs-13-5)/1.2 var(--font-display)',
              letterSpacing: 'var(--ls-display-sm)', color: 'var(--text-body)' }}>{MONTH_YEAR.format(cursor)}</div>
            <NavButton label="Next month" dir="next" onClick={() => setCursor(new Date(year, month + 1, 1))} />
          </div>

          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
            {WEEKDAYS.map(d => (
              <div key={d} style={{ padding: '4px 0', textAlign: 'center', fontSize: 'var(--fs-11)',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: 'var(--ls-label)',
                color: 'var(--text-label)' }}>{d}</div>
            ))}
            {Array.from({ length: leadingBlanks(year, month) }, (_, i) => <span key={'b' + i} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
              return (
                <GridButton key={iso} mono height={32} selected={iso === value} today={iso === todayISO}
                  disabled={outOfRange(iso)} onClick={() => { onChange && onChange(iso); setOpen(false); }}>
                  {day}
                </GridButton>
              );
            })}
          </div>

          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-inset)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <QuietAction disabled={outOfRange(todayISO)} onClick={() => { onChange && onChange(todayISO); setOpen(false); }}>Today</QuietAction>
            {clearable && value && (
              <QuietAction tone="var(--text-secondary)" style={{ marginLeft: 'auto', fontWeight: 600 }}
                onClick={() => { onChange && onChange(''); setOpen(false); }}>Clear</QuietAction>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* The month-only sibling, for the places a product records a period rather
   than a day. Same control, a 12-month grid instead of a calendar. */
export function MonthPicker({
  value = '', onChange, placeholder = 'Pick a month', disabled = false,
  height = 42, ariaLabel, style
}) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);
  const popRef = usePopover(triggerRef, open, () => setOpen(false));
  const parsed = /^\d{4}-\d{2}$/.test(value)
    ? { year: Number(value.slice(0, 4)), month: Number(value.slice(5, 7)) - 1 } : null;
  const [yearCursor, setYearCursor] = React.useState(() => (parsed ? parsed.year : new Date().getFullYear()));

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <Trigger innerRef={triggerRef} open={open} disabled={disabled} height={height}
        filled={!!parsed} ariaLabel={ariaLabel}
        onClick={() => { if (parsed) setYearCursor(parsed.year); setOpen(o => !o); }}>
        {parsed ? `${MONTHS_SHORT[parsed.month]} ${parsed.year}` : placeholder}
      </Trigger>

      {open && (
        <div ref={popRef} role="dialog" aria-label="Choose a month" style={panel(244)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <NavButton label="Previous year" dir="prev" onClick={() => setYearCursor(y => y - 1)} />
            <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-13)',
              fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text-body)' }}>{yearCursor}</div>
            <NavButton label="Next year" dir="next" onClick={() => setYearCursor(y => y + 1)} />
          </div>
          <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
            {MONTHS_SHORT.map((label, i) => {
              const iso = `${yearCursor}-${pad(i + 1)}`;
              return <GridButton key={label} height={36} selected={iso === value}
                onClick={() => { onChange && onChange(iso); setOpen(false); }}>{label}</GridButton>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
