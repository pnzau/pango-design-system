import React from 'react';

/* A text field that shows 1,250.50 while holding "1250.50". Typing mid-number
   would otherwise throw the caret to the end every time a separator is
   inserted, so the caret is restored by counting the characters the reader
   actually typed. Use it for any figure a person types — amounts, quantities,
   readings, distances — and keep the stored value unformatted. */

/** Adds thousand separators to the whole part, leaving any decimals alone. */
export function groupDigits(raw) {
  if (!raw) return '';
  const [whole, ...decimals] = String(raw).split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decimals.length ? `${grouped}.${decimals.join('')}` : grouped;
}

/** Digits and at most one decimal point — the value the app stores. */
export function toRawNumber(text) {
  const [whole, ...decimals] = String(text).replace(/[^0-9.]/g, '').split('.');
  return decimals.length ? `${whole}.${decimals.join('')}` : whole;
}

/* Whether the text the reader is part-way through typing still represents the
   value the parent holds. A parent that stores a number turns "1250." back
   into "1250", which would delete the point the moment it was typed. */
function stillMatches(draft, value) {
  if (draft === value) return true;
  const typed = Number(draft), held = Number(value);
  return isFinite(typed) && isFinite(held) && typed === held;
}

/* Where the caret sits once the separators have been re-inserted. */
function caretAfterGrouping(display, typedChars) {
  let seen = 0;
  for (let i = 0; i < display.length; i += 1) {
    if (seen === typedChars) return i;
    if (display[i] !== ',') seen += 1;
  }
  return display.length;
}

export function NumberInput({ value = '', onChange, prefix, suffix, mono = true, align, height = 42, disabled, placeholder, style, ...rest }) {
  const inputRef = React.useRef(null);
  const caretRef = React.useRef(null);
  const [draft, setDraft] = React.useState(null);
  const [focus, setFocus] = React.useState(false);
  const raw = draft !== null && stillMatches(draft, value) ? draft : value;
  const display = groupDigits(raw);

  React.useLayoutEffect(() => {
    const caret = caretRef.current;
    caretRef.current = null;
    if (caret !== null && inputRef.current) inputRef.current.setSelectionRange(caret, caret);
  }, [display]);

  const affix = { fontFamily: 'var(--font-body)', fontSize: 'var(--fs-12-5)', fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', height,
      boxSizing: 'border-box', padding: '0 12px', borderRadius: 'var(--r-10)',
      background: 'var(--surface-card)', opacity: disabled ? .45 : 1,
      border: '1px solid ' + (focus ? 'var(--border-focus)' : 'var(--border-control)'),
      transition: 'border-color var(--dur-control)', ...style }}>
      {prefix && <span style={affix}>{prefix}</span>}
      <input {...rest} ref={inputRef} type="text" inputMode="decimal" value={display}
        disabled={disabled} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        onChange={e => {
          const typed = e.target.value;
          const caret = e.target.selectionStart == null ? typed.length : e.target.selectionStart;
          const typedChars = typed.slice(0, caret).replace(/[^0-9.]/g, '').length;
          const next = toRawNumber(typed);
          caretRef.current = caretAfterGrouping(groupDigits(next), typedChars);
          setDraft(next);
          onChange && onChange(next);
        }}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
          color: 'var(--text-body)', textAlign: align,
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
          fontSize: 'var(--fs-13-5)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }} />
      {suffix && <span style={affix}>{suffix}</span>}
    </div>
  );
}

/* Capitalized holder so the helpers are reachable from plain HTML. */
export const NumberFormat = { groupDigits, toRawNumber };
