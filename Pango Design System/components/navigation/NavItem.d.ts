/**
 * Sidebar navigation row and the grey-track segmented control.
 */
export interface NavItemProps {
  /** Normally <Icon size={18} />. */
  icon?: React.ReactNode;
  children?: React.ReactNode;
  active?: boolean;
  /** Trailing <Badge />; give it marginLeft:'auto'. */
  badge?: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export interface SegmentedControlProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  radius?: string;
  style?: React.CSSProperties;
}
export declare function NavItem(props: NavItemProps): JSX.Element;
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
