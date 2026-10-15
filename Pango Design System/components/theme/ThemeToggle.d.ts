/**
 * Theme control and helpers. The system ships light and dark; a product opts
 * in by setting `data-theme="light" | "dark"` on `<html>`. No component takes
 * a dark prop — components are dark-correct because they read tokens.
 */
export interface ThemeToggleProps {
  /** segmented = light/dark/auto row (default) · switch = one 40px icon button. */
  variant?: 'segmented' | 'switch';
  /** Which choices the segmented control offers, in order. */
  options?: Array<'light' | 'dark' | 'system'>;
  showLabels?: boolean;
  style?: React.CSSProperties;
}
export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
/** Resolve 'system', write `data-theme` on `<html>`, persist the choice. */
export declare function applyTheme(choice: 'light' | 'dark' | 'system'): 'light' | 'dark';
/** The stored choice, or 'system' when nothing is stored. */
export declare function getStoredTheme(): 'light' | 'dark' | 'system';
/** What the OS currently prefers. */
export declare function systemTheme(): 'light' | 'dark';
/** Hook for a custom control: `{ theme, choice, setChoice }`. */
export declare function useTheme(): {
  theme: 'light' | 'dark';
  choice: 'light' | 'dark' | 'system';
  setChoice: (choice: 'light' | 'dark' | 'system') => void;
};

/** Capitalized holder, reachable from plain HTML: `Theme.apply('dark')`. */
export declare const Theme: { apply: typeof applyTheme; stored: typeof getStoredTheme; system: typeof systemTheme };
