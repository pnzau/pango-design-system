/**
 * Monospaced, thousands-grouped figure. The currency belongs to the product:
 * call `setCurrency` once at boot, or pass `currency` on one figure.
 */
export interface MoneyProps {
  /** Raw number, formatted with the app's currency setting. */
  amount?: number;
  /** Pre-formatted string, used instead of amount. */
  value?: string;
  /** Currency code or symbol for this figure only. '' for a bare number. */
  currency?: string;
  /** Fraction digits for this figure only. Default 0. */
  decimals?: number;
  size?: string;
  weight?: number;
  color?: string;
  align?: 'left' | 'right';
  style?: React.CSSProperties;
}
export declare function Money(props: MoneyProps): JSX.Element;
export interface CurrencyOptions {
  locale?: string;
  decimals?: number;
  /** Where the code sits relative to the figure. Default 'before'. */
  position?: 'before' | 'after';
}
/** Set the app-wide currency once at boot. */
export declare function setCurrency(currency: string, opts?: CurrencyOptions): void;
/** Format a number with the app setting, or per-call overrides. */
export declare function formatMoney(n: number, opts?: CurrencyOptions & { currency?: string }): string;
/** Thin rounded progress bar — works on light cards and dark panels. */
export interface ProgressBarProps { value?: number; tone?: string; track?: string; height?: number; style?: React.CSSProperties }
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;

/** Capitalized holder for the helpers, reachable from plain HTML:
 *  `MoneyFormat.setCurrency('EUR')`, `MoneyFormat.formatMoney(n)`. */
export declare const MoneyFormat: { setCurrency: typeof setCurrency; formatMoney: typeof formatMoney };
