/**
 * The app's only overlay: centred modal on desktop, slide-up bottom sheet on mobile.
 */
export interface SheetProps {
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
  /** Max width in px — the app uses 420, 440, 460 and 840. Default 460. */
  width?: number;
  /** Render as a bottom sheet (matchMedia '(max-width: 860px)' in the app). */
  mobile?: boolean;
  title?: string;
  style?: React.CSSProperties;
}
export declare function Sheet(props: SheetProps): JSX.Element;
