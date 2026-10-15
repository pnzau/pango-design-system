/**
 * Pale status chip in one of six domain-neutral tones. Pass `tone` with your
 * own label, or `status` for one of the preset vocabularies (lifecycle, work,
 * money/approval, availability). Never a saturated fill.
 */
export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'slate' | 'neutral' | 'accent';
export interface StatusChipProps {
  /** Preset state key — `draft`, `in_progress`, `paid`, `approved`, `active`… */
  status?: string;
  /** Tone directly, when the product names its own states. Wins over `status`. */
  tone?: StatusTone;
  /** Override the preset label. `children` wins over both. */
  label?: string;
  children?: React.ReactNode;
  /** Add the tone's pale border — for chips sitting on a card of the same fill. */
  outline?: boolean;
  /** Prefix a 6px dot, for dense tables where colour alone is too quiet. */
  dot?: boolean;
  style?: React.CSSProperties;
}
export declare function StatusChip(props: StatusChipProps): JSX.Element;
/** `{ fg, bg, line }` token triples per tone. */
export declare const TONES: Record<StatusTone, { fg: string; bg: string; line: string }>;
/** Preset state keys → `{ tone, label }`. Extend in the product. */
export declare const STATUS: Record<string, { tone: StatusTone; label: string }>;
