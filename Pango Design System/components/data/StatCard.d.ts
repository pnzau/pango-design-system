/**
 * Portfolio KPI tile: small grey label, big display figure, coloured trend line.
 */
export interface StatCardProps {
  label: string;
  value: string | number;
  /** Second line, e.g. "9 occupied" or "▲ collected on time". */
  trend?: string;
  /** Green for healthy, grey for neutral, red for overdue. Default grey. */
  trendColor?: string;
  valueColor?: string;
  sub?: string;
  style?: React.CSSProperties;
}
export declare function StatCard(props: StatCardProps): JSX.Element;
