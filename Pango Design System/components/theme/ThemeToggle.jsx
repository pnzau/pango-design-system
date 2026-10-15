import React from 'react';

/* Theme plumbing. The system ships two themes; a product opts in by setting
   data-theme on <html>. These helpers are the whole contract — read the
   stored choice, fall back to the OS, write it back.

   There is no per-component dark prop anywhere: a component is dark-correct
   because it reads tokens, and a component that hardcodes a hex is the only
   thing that breaks. */

const KEY = 'ds-theme';

export function getStoredTheme() {
  try { return window.localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
}

export function systemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Resolve 'system' and write the attribute the tokens key off. */
export function applyTheme(choice) {
  const resolved = choice === 'system' ? systemTheme() : choice;
  document.documentElement.setAttribute('data-theme', resolved);
  try { window.localStorage.setItem(KEY, choice); } catch (e) { /* private mode */ }
  return resolved;
}

/** State + effect pair for a toggle anywhere in the tree. */
export function useTheme() {
  const [choice, setChoice] = React.useState(getStoredTheme);
  const resolved = choice === 'system' ? (typeof window === 'undefined' ? 'light' : systemTheme()) : choice;
  React.useEffect(() => { applyTheme(choice); }, [choice]);
  React.useEffect(() => {
    if (choice !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [choice]);
  return { theme: resolved, choice, setChoice };
}

const Sun = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4.2" /><path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2 5.4 18.6" />
  </svg>
);
const Moon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" />
  </svg>
);
const Auto = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2.5" y="4" width="19" height="13" rx="2.5" /><path d="M8 20.5h8" />
  </svg>
);
const GLYPH = { light: Sun, dark: Moon, system: Auto };
const LABEL = { light: 'Light', dark: 'Dark', system: 'Auto' };

/* Segmented three-state control — light / dark / follow the OS. Sits in a
   settings row or a sidebar footer. `variant="switch"` is the two-state
   version for a header. */
export function ThemeToggle({ variant = 'segmented', options = ['light', 'dark', 'system'], showLabels = true, style }) {
  const { choice, setChoice } = useTheme();
  if (variant === 'switch') {
    const next = choice === 'dark' ? 'light' : 'dark';
    const G = GLYPH[choice === 'dark' ? 'dark' : 'light'];
    return (
      <button type="button" onClick={() => setChoice(next)} aria-label={'Switch to ' + next + ' theme'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 'var(--control-h)',
          height: 'var(--control-h)', borderRadius: 'var(--r-10)', cursor: 'pointer',
          background: 'var(--surface-card)', border: '1px solid var(--border-control)',
          color: 'var(--text-secondary)', transition: 'background var(--dur-control)', ...style }}>
        <G />
      </button>
    );
  }
  return (
    <div role="radiogroup" aria-label="Theme"
      style={{ display: 'inline-flex', gap: 3, padding: 3, borderRadius: 'var(--r-11)',
        background: 'var(--surface-chip)', ...style }}>
      {options.map(opt => {
        const active = choice === opt;
        const G = GLYPH[opt];
        return (
          <button key={opt} type="button" role="radio" aria-checked={active} onClick={() => setChoice(opt)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: showLabels ? '7px 11px' : 7,
              borderRadius: 'var(--r-9)', border: 'none', cursor: 'pointer',
              background: active ? 'var(--surface-card)' : 'transparent',
              boxShadow: active ? 'var(--shadow-thumb)' : 'none',
              color: active ? 'var(--text-body)' : 'var(--text-muted)',
              font: 'var(--fw-bold) var(--fs-12-5)/1 var(--font-body)',
              transition: 'background var(--dur-control)' }}>
            <G />{showLabels && LABEL[opt]}
          </button>
        );
      })}
    </div>
  );
}

/* Capitalized holder so the helpers are reachable from plain HTML. */
export const Theme = { apply: applyTheme, stored: getStoredTheme, system: systemTheme };
