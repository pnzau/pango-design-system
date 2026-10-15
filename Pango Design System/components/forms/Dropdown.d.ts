/**
 * The system's select — no native `<select>` anywhere. One component covers
 * five variants: plain, swatched (options carry a `color`), clearable,
 * creatable (`onCreate` opens a name + colour panel in the footer) and a
 * pinned footer action. Reads only tokens, so it is correct in dark mode.
 */
export interface DropdownOption {
  value: string;
  label: string;
  /** Optional 9px swatch, echoed on the trigger when selected. */
  color?: string;
}
export interface DropdownProps {
  value?: string;
  options?: DropdownOption[];
  onSelect?: (value: string) => void;
  placeholder?: string;
  /** A pinned action under the options, e.g. "Manage categories". */
  footerLabel?: string;
  onFooter?: () => void;
  /**
   * Turns the footer into a create panel. Return an error string to keep the
   * panel open with the message shown; return nothing to select the new value.
   */
  onCreate?: (name: string, color?: string) => Promise<string | null | void> | string | null | void;
  createLabel?: string;
  /** Swatch row shown in the create panel. Pass the palette the resource uses. */
  colorPalette?: string[];
  /** Show an ✕ on the trigger that returns the field to no selection. */
  clearable?: boolean;
  disabled?: boolean;
  /** 42 in sheets and forms (default) · 40 in a page header. */
  height?: number;
  menuMinWidth?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
}
export declare function Dropdown(props: DropdownProps): JSX.Element;
