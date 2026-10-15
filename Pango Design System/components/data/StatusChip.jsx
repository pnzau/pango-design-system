import React from 'react';

/* A status is one of six tones — never a saturated block, always a pale fill
   with a darker text tone. Tones are domain-neutral so any product can name
   its own states: pass `tone` + a label, or use `status` for one of the
   preset vocabularies below. All colours are tokens, so chips are correct in
   both themes. */
export const TONES = {
  success: { fg: 'var(--success-fg)', bg: 'var(--success-bg)', line: 'var(--success-line)' },
  warning: { fg: 'var(--warning-fg)', bg: 'var(--warning-bg)', line: 'var(--warning-line)' },
  danger:  { fg: 'var(--danger-fg)',  bg: 'var(--danger-bg)',  line: 'var(--danger-line)' },
  info:    { fg: 'var(--info-fg)',    bg: 'var(--info-bg)',    line: 'var(--info-line)' },
  slate:   { fg: 'var(--slate-fg)',   bg: 'var(--slate-bg)',   line: 'var(--slate-line)' },
  neutral: { fg: 'var(--neutral-fg)', bg: 'var(--neutral-bg)', line: 'var(--neutral-line)' },
  accent:  { fg: 'var(--accent)',     bg: 'var(--accent-tint)', line: 'var(--accent-line)' }
};

/* Common states across the products this system serves, each mapped to a
   tone. Extend the map in the product; don't invent a seventh tone. */
export const STATUS = {
  /* lifecycle */
  draft:       { tone: 'neutral', label: 'Draft' },
  scheduled:   { tone: 'slate',   label: 'Scheduled' },
  sent:        { tone: 'slate',   label: 'Sent' },
  published:   { tone: 'success', label: 'Published' },
  archived:    { tone: 'neutral', label: 'Archived' },
  /* work */
  todo:        { tone: 'neutral', label: 'To do' },
  in_progress: { tone: 'warning', label: 'In progress' },
  blocked:     { tone: 'danger',  label: 'Blocked' },
  done:        { tone: 'success', label: 'Completed' },
  /* money & approval */
  paid:        { tone: 'success', label: 'Paid' },
  partial:     { tone: 'info',    label: 'Partially paid' },
  unconfirmed: { tone: 'warning', label: 'Unconfirmed' },
  overdue:     { tone: 'danger',  label: 'Overdue' },
  approved:    { tone: 'success', label: 'Approved' },
  pending:     { tone: 'warning', label: 'Pending' },
  rejected:    { tone: 'danger',  label: 'Rejected' },
  /* availability */
  active:      { tone: 'success', label: 'Active' },
  inactive:    { tone: 'neutral', label: 'Inactive' },
  empty:       { tone: 'neutral', label: 'Empty' }
};

export function StatusChip({ status, tone, label, children, outline, dot, style }) {
  const preset = status ? (STATUS[status] || STATUS.draft) : null;
  const t = TONES[tone || (preset && preset.tone) || 'neutral'] || TONES.neutral;
  const text = children != null ? children : (label || (preset && preset.label) || status || '');
  return (
    <span style={{ display: dot ? 'inline-flex' : undefined, alignItems: 'center', gap: 6,
      fontSize: 'var(--fs-11)', fontWeight: 700, color: t.fg, background: t.bg,
      border: outline ? '1px solid ' + t.line : undefined,
      borderRadius: 'var(--r-7)', padding: 'var(--pad-badge)', whiteSpace: 'nowrap', ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: t.fg, flexShrink: 0 }} />}
      {text}
    </span>
  );
}
