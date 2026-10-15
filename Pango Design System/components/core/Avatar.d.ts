/** Initials avatar — dark circle for people, tinted rounded square for list rows. */
export interface AvatarProps {
  initials: string;
  /** 30–42 in the app; 34 default. */
  size?: number;
  shape?: 'circle' | 'square';
  background?: string;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
/** "Grace Wambui" → "GW" */
export declare function initialsOf(name: string): string;

/** Same function, reachable from plain HTML. */
export declare const Initials: typeof initialsOf;
