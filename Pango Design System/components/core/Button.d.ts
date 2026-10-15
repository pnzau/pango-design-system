/**
 * Pango's button. Solid accent primary, outlined secondary/quiet, translucent ghost for dark panels.
 */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'quiet' | 'ghost' | 'dark';
  /** sm = 8px/13px inline action · md = 40px header default · lg = 14px auth submit · wide = 13px full-width sheet submit */
  size?: 'sm' | 'md' | 'lg' | 'wide';
  children?: React.ReactNode;
  /** Leading element, normally <Icon />. */
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  /** Stretch to 100% width — the sheet-submit pattern. */
  block?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  title?: string;
  type?: 'button' | 'submit';
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
