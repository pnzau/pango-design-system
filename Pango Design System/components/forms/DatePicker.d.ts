/**
 * Date and month fields. The system has no `<input type="date">` anywhere —
 * the native picker can't be styled, so this is the same 42px control as
 * Dropdown opening a month grid with mono day figures. Values are ISO
 * strings, parsed without timezone drift.
 */
export interface DatePickerProps {
  /** `YYYY-MM-DD`, or '' for no date. */
  value?: string;
  onChange?: (value: string) => void;
  /** Latest selectable date, `YYYY-MM-DD`. Later days render disabled. */
  max?: string;
  /** Earliest selectable date, `YYYY-MM-DD`. */
  min?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Offer "Clear" in the footer. Turn off where an empty date is invalid. */
  clearable?: boolean;
  height?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export interface MonthPickerProps {
  /** `YYYY-MM`, or '' for no month. */
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;
export declare function MonthPicker(props: MonthPickerProps): JSX.Element;
/** Locale-short month names, for labels outside the picker. */
export declare const MONTHS_SHORT: string[];
