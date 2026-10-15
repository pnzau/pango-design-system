/**
 * Sticky, blurred page header with display title, subtitle, inline controls and one CTA.
 */
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** Inline controls — selects, <SearchField />. */
  children?: React.ReactNode;
  /** The single primary <Button />. */
  cta?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function PageHeader(props: PageHeaderProps): JSX.Element;
