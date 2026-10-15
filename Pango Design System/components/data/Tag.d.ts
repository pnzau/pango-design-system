/** Neutral or tone-tinted chip: attributes, categories, roles, chart series. */
export interface TagProps {
  children?: React.ReactNode;
  /** A tone — hex or a `var(--cat-N)` token. Fill becomes that tone at ~8%. */
  tone?: string;
  /** xs = 10px micro tag · sm = 10.5px item pill · md = 11px chip (default) */
  size?: 'xs' | 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
/** Product-specific overrides: assign `CATEGORY_TONE['Plumbing'] = 'var(--cat-1)'`. */
export declare const CATEGORY_TONE: Record<string, string>;
/** Stable tone for any label — an override if set, otherwise hashed onto `--cat-1…8`. */
export declare function categoryTone(cat: string): string;

/** Same function, reachable from plain HTML. */
export declare const CategoryTone: typeof categoryTone;
