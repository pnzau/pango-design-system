/** The app's inline 24x24 stroke-SVG icon set, by name. */
export type PangoIconName = 'properties' | 'invoice' | 'repairs' | 'vacancies' | 'verify' | 'sparkle' | 'managers' | 'logout' | 'menu' | 'search' | 'chevronDown' | 'chevronLeft' | 'chevronRight' | 'pin' | 'wrench' | 'clock' | 'check' | 'download' | 'phone' | 'edit' | 'whatsapp' | 'instagram';
export interface IconProps {
  name: PangoIconName;
  /** 13–22px in the app; 18 in the sidebar. Default 18. */
  size?: number;
  /** 1.7 nav · 1.8–2 inline · 2.2–2.4 chevrons and ticks. Default 1.7. */
  strokeWidth?: number;
  /** Defaults to currentColor. */
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
export declare const iconNames: PangoIconName[];

/** Same list, reachable from plain HTML. */
export declare const IconNames: string[];
