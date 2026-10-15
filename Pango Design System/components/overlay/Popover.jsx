import React from 'react';

/* Popover primitive behind Dropdown and DatePicker: a floating card anchored
   to its trigger, closing on outside click, Escape or scroll of an ancestor.
   Flips above the trigger when the viewport runs out below. Rendered inline
   (not portalled) so it inherits the theme scope it sits in. */
export function useAnchoredPopover(anchorRef, open, onClose) {
  const popRef = React.useRef(null);
  const [placement, setPlacement] = React.useState('below');
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
    const a = anchorRef.current, p = popRef.current;
    if (a && p) {
      const r = a.getBoundingClientRect();
      setPlacement(r.bottom + p.offsetHeight + 8 > window.innerHeight && r.top > p.offsetHeight ? 'above' : 'below');
    }
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, onClose, anchorRef]);
  return { popRef, placement };
}

export function AnchoredPopover({
 anchorRef, open, onClose, role, matchAnchorWidth, minWidth, width, padding = 6, style, children, ...rest }) {
  const { popRef, placement } = useAnchoredPopover(anchorRef, open, onClose);
  if (!open) return null;
  return (
    <div ref={popRef} role={role} {...rest}
      style={{ position: 'absolute', zIndex: 60, left: 0,
        ...(placement === 'above' ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }),
        width: width || (matchAnchorWidth ? '100%' : undefined), minWidth,
        maxWidth: 'calc(100vw - 32px)', boxSizing: 'border-box',
        background: 'var(--surface-popover)', border: '1px solid var(--border-card)',
        borderRadius: 'var(--r-12)', boxShadow: 'var(--shadow-popover)', padding,
        animation: 'popIn var(--dur-control) var(--ease-sheet) both', ...style }}>
      {children}
    </div>
  );
}

/* Alias under the directory's component name. */
export const Popover = AnchoredPopover;
