/** Counts, caps flags and photo pills. */
export interface BadgeProps {
  children?: React.ReactNode;
  /** count = slate mono nav count · countAccent = accent-tinted mono count · flag = 9.5px caps AI flag · live = accent-fill LIVE flag on dark · pill = 12px caps pill over photography · pillMono = mono count pill */
  variant?: 'count' | 'countAccent' | 'flag' | 'live' | 'pill' | 'pillMono';
  tone?: string;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
