/**
 * Accent-filled checkbox, the clickable billable-item row built on it, and the automation switch.
 */
export interface CheckboxProps { checked?: boolean; onChange?: () => void; size?: number; style?: React.CSSProperties }
export interface CheckRowProps {
  checked?: boolean; onChange?: () => void;
  name: string;
  /** Small grey line under the name, e.g. "Metered · billed monthly". */
  basis?: string;
  /** Pre-formatted amount, right-aligned in mono. */
  amount?: string;
  style?: React.CSSProperties;
}
export interface SwitchProps { checked?: boolean; onChange?: () => void; style?: React.CSSProperties }
export declare function Checkbox(props: CheckboxProps): JSX.Element;
export declare function CheckRow(props: CheckRowProps): JSX.Element;
export declare function Switch(props: SwitchProps): JSX.Element;
