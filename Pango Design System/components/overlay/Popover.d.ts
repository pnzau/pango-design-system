/**
 * Floating card anchored to a trigger — the layer under Dropdown and DatePicker.
 * Closes on outside click and Escape, flips above the trigger near the
 * viewport edge, and inherits the theme scope it renders inside.
 * The parent must be `position: relative`.
 */
export interface AnchoredPopoverProps {
  /** Ref to the trigger element the panel is anchored to. */
  anchorRef: React.RefObject<HTMLElement>;
  open?: boolean;
  onClose: () => void;
  role?: string;
  /** Match the trigger's width — the default for select menus. */
  matchAnchorWidth?: boolean;
  minWidth?: number;
  width?: number | string;
  padding?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function AnchoredPopover(props: AnchoredPopoverProps): JSX.Element | null;
/** Same component under the directory's name. */
export declare const Popover: typeof AnchoredPopover;
/** The behaviour on its own, for a panel that needs its own markup. */
export declare function useAnchoredPopover(
  anchorRef: React.RefObject<HTMLElement>,
  open: boolean,
  onClose: () => void,
): { popRef: React.RefObject<HTMLDivElement>; placement: 'above' | 'below' };
