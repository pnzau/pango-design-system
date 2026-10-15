/**
 * Pango's containers: the white hairline Card, the grey InsetPanel nested inside it, and the dark gradient DarkPanel.
 */
export interface CardProps {
  children?: React.ReactNode;
  /** Default var(--pad-card) = 20px. Stat cards use '18px 20px', detail panels 22px. */
  padding?: string | number;
  radius?: string | number;
  /** Adds the hover lift: -2px, deep soft shadow, darker border. */
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export interface InsetPanelProps { children?: React.ReactNode; padding?: string | number; radius?: string | number; style?: React.CSSProperties }
export interface DarkPanelProps {
  children?: React.ReactNode; padding?: string | number; radius?: string | number;
  /** Use the flat #0e0e0e fill instead of the 120deg gradient. */
  flat?: boolean;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
export declare function InsetPanel(props: InsetPanelProps): JSX.Element;
export declare function DarkPanel(props: DarkPanelProps): JSX.Element;
