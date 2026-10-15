/**
 * The Pango logo lockup: dark rounded tile with three bars, plus optional wordmark and tagline.
 */
export interface PangoMarkProps {
  /** 44px lg / 38px md (default) / 34px sm — the three sizes the app ships */
  size?: 'lg' | 'md' | 'sm';
  /** dark = #0e0e0e tile, black = pure #000 (auth screen), glass = translucent over photography, onDark = dark tile with white wordmark */
  tone?: 'dark' | 'black' | 'glass' | 'onDark';
  /** Colour of the top bar. Defaults to the accent token. */
  accent?: string;
  /** Show the "Pango" wordmark next to the tile. Default true. */
  wordmark?: boolean;
  /** Show the "RENTALS, HANDLED" tagline under the wordmark. Default false. */
  tagline?: boolean;
  style?: React.CSSProperties;
}
export declare function PangoMark(props: PangoMarkProps): JSX.Element;
