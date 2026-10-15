/** Square icon-only button — 32px inside cards, 38px in the mobile top bar. */
export interface IconButtonProps {
  children?: React.ReactNode;
  /** 32 (default) or 38. */
  size?: number;
  /** quiet = white with control border · plain = transparent, used inside the month stepper. */
  variant?: 'quiet' | 'plain';
  title?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
