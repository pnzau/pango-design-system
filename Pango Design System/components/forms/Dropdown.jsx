import React from 'react';

/* The system's select. There is no native <select> in a Pango product: a
   control is a 40/42px field on the control border that swaps its border to
   the focus ink when open, and the menu is a floating card on the popover
   shadow. Every colour is a token, so the control is correct in dark mode.

   Variants, all one component:
   · plain        — value + placeholder
   · swatched     — options carry a `color`, echoed on the trigger
   · clearable    — an ✕ on the trigger returns the field to no selection
   · creatable    — `onCreate` turns the footer into a name (+ colour) panel
   · footer link  — `footerLabel` pins one action under the options */

const Chevron = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, color: 'var(--text-muted)', transition: 'transform var(--dur-control)', transform: open ? 'rotate(180deg)' : 'none' }}><path d="m6 9 6 6 6-6" /></svg>
);
const Tick = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: 'var(--accent)' }}><path d="m5 13 4 4L19 7" /></svg>
);
const Cross = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
);

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

const panelStyle = extra => ({
  position: 'absolute', zIndex: 60, left: 0, top: 'calc(100% + 6px)',
  boxSizing: 'border-box', maxWidth: 'calc(100vw - 32px)',
  background: 'var(--surface-popover)', border: '1px solid var(--border-card)',
  borderRadius: 'var(--r-12)', boxShadow: 'var(--shadow-popover)',
  animation: 'popIn var(--dur-control) var(--ease-sheet) both', ...extra
});

const Swatch = ({ color, size = 9 }) => (
  <span style={{ width: size, height: size, borderRadius: 4, background: color, flexShrink: 0 }} />
);

export function Dropdown({
  value, options = [], onSelect, placeholder = 'Select…',
  footerLabel, onFooter, onCreate, createLabel = 'Add new', colorPalette,
  clearable = false, disabled = false, height = 42, menuMinWidth, ariaLabel, style
}) {
  const [open, setOpen] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [draftColor, setDraftColor] = React.useState(undefined);
  const [error, setError] = React.useState('');
  const triggerRef = React.useRef(null);

  const close = () => { setOpen(false); setCreating(false); setDraft(''); setDraftColor(undefined); setError(''); };
  const popRef = usePopover(triggerRef, open, close);
  const current = options.find(o => o.value === value);
  const showClear = clearable && !disabled && !!value;

  const submit = async () => {
    const name = draft.trim();
    if (!name) return;
    setError('');
    const err = onCreate && await onCreate(name, draftColor);
    if (typeof err === 'string' && err) { setError(err); return; }
    onSelect && onSelect(name);
    close();
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      <button ref={triggerRef} type="button" disabled={disabled} aria-label={ariaLabel}
        aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height,
          padding: '0 12px', borderRadius: 'var(--r-10)', background: 'var(--surface-card)',
          border: '1px solid ' + (open ? 'var(--border-focus)' : hover && !disabled ? 'var(--border-strong)' : 'var(--border-control)'),
          font: 'var(--fw-semibold) var(--fs-13-5)/1 var(--font-body)', color: 'var(--text-body)',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .45 : 1,
          transition: 'border-color var(--dur-control)' }}>
        {current && current.color && <Swatch color={current.color} />}
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: current ? 'var(--text-body)' : 'var(--text-placeholder)' }}>
          {current ? current.label : placeholder}
        </span>
        {showClear && <span style={{ width: 20, flexShrink: 0 }} aria-hidden="true" />}
        <Chevron open={open} />
      </button>

      {showClear && (
        <button type="button" aria-label="Clear selection" onClick={() => { onSelect && onSelect(''); close(); }}
          style={{ position: 'absolute', right: 36, top: '50%', transform: 'translateY(-50%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20,
            border: 'none', background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--text-muted)' }}>
          <Cross />
        </button>
      )}

      {open && (
        <div ref={popRef} role="listbox" style={panelStyle(creating
          ? { padding: 8, width: '100%', minWidth: menuMinWidth }
          : { padding: 6, width: '100%', minWidth: menuMinWidth, maxHeight: 256, overflowY: 'auto' })}>
          {creating ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input autoFocus value={draft} placeholder={createLabel} aria-label={createLabel}
                onChange={e => { setDraft(e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
                style={{ height: 40, width: '100%', boxSizing: 'border-box', padding: '0 12px',
                  borderRadius: 'var(--r-10)', border: '1px solid var(--border-focus)',
                  background: 'var(--surface-card)', color: 'var(--text-body)',
                  fontSize: 'var(--fs-13-5)', fontFamily: 'var(--font-body)', outline: 'none' }} />
              {colorPalette && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 2px' }}>
                  {colorPalette.map(c => {
                    const picked = (draftColor || colorPalette[0]) === c;
                    return <button key={c} type="button" aria-label={'Colour ' + c} aria-pressed={picked}
                      onClick={() => setDraftColor(c)}
                      style={{ width: 24, height: 24, borderRadius: 7, background: c, cursor: 'pointer',
                        border: 'none', outline: picked ? '2px solid var(--border-focus)' : 'none', outlineOffset: 2 }} />;
                  })}
                </div>
              )}
              {error && <div style={{ padding: '0 2px', fontSize: 'var(--fs-12)', fontWeight: 600, color: 'var(--error-text)' }}>{error}</div>}
              <div style={{ display: 'flex', gap: 6 }}>
                <button type="button" onClick={submit} disabled={!draft.trim()}
                  style={{ flex: 1, height: 36, borderRadius: 9, border: 'none', background: 'var(--accent)',
                    color: 'var(--accent-fg)', font: 'var(--fw-bold) var(--fs-13)/1 var(--font-body)',
                    cursor: draft.trim() ? 'pointer' : 'not-allowed', opacity: draft.trim() ? 1 : .45 }}>Add</button>
                <button type="button" onClick={() => { setCreating(false); setDraft(''); setError(''); }}
                  style={{ height: 36, padding: '0 12px', borderRadius: 9, background: 'var(--surface-card)',
                    border: '1px solid var(--border-strong)', color: 'var(--text-secondary)',
                    font: 'var(--fw-semibold) var(--fs-13)/1 var(--font-body)', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              {options.map(o => <Option key={o.value} option={o} selected={o.value === value}
                onPick={() => { onSelect && onSelect(o.value); close(); }} />)}
              {(onCreate || footerLabel) && <div style={{ margin: '4px', borderTop: '1px solid var(--border-inset)' }} />}
              {onCreate && <FooterAction onClick={() => { setCreating(true); setDraftColor(colorPalette && colorPalette[0]); }} label={createLabel} plus />}
              {footerLabel && <FooterAction onClick={() => { onFooter && onFooter(); close(); }} label={footerLabel} />}
            </React.Fragment>
          )}
        </div>
      )}
    </div>
  );
}

function Option({ option, selected, onPick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" role="option" aria-selected={selected} onClick={onPick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
        padding: '10px 11px', borderRadius: 'var(--r-8)', border: 'none', cursor: 'pointer',
        background: selected ? 'var(--surface-chip)' : hover ? 'var(--surface-hover)' : 'transparent',
        color: selected || hover ? 'var(--text-body)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)', fontSize: 'var(--fs-13-5)', fontWeight: selected ? 700 : 600,
        transition: 'background var(--dur-control)' }}>
      {option.color && <Swatch color={option.color} />}
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{option.label}</span>
      {selected && <Tick />}
    </button>
  );
}

function FooterAction({ onClick, label, plus }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left',
        padding: '10px 11px', borderRadius: 'var(--r-8)', border: 'none', cursor: 'pointer',
        background: hover ? 'var(--surface-hover)' : 'transparent', color: 'var(--accent)',
        font: 'var(--fw-bold) var(--fs-13-5)/1.2 var(--font-body)', transition: 'background var(--dur-control)' }}>
      {plus && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>}
      {label}
    </button>
  );
}
