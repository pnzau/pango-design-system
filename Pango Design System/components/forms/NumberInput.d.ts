/**
 * Separator-formatted numeric field: shows `1,250.50`, holds `"1250.50"`, and
 * keeps the caret where the reader put it. Use it for any figure a person
 * types — amounts, quantities, meter readings, distances.
 */
export interface NumberInputProps {
  /** Unformatted digits, e.g. "1250.5". */
  value?: string;
  onChange?: (raw: string) => void;
  /** Static text before the figure — a currency code, a symbol. */
  prefix?: React.ReactNode;
  /** Static text after the figure — a unit, "/mo", "kWh". */
  suffix?: React.ReactNode;
  /** Figures are mono by default; set false for an inline field in prose. */
  mono?: boolean;
  align?: 'left' | 'right' | 'center';
  height?: number;
  disabled?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}
export declare function NumberInput(props: NumberInputProps): JSX.Element;
/** Thousand separators on the whole part, decimals untouched. */
export declare function groupDigits(raw: string): string;
/** Strip to digits and at most one decimal point. */
export declare function toRawNumber(text: string): string;

/** Capitalized holder, reachable from plain HTML. */
export declare const NumberFormat: { groupDigits: typeof groupDigits; toRawNumber: typeof toRawNumber };
