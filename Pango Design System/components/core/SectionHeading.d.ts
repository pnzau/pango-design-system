/** Display-font section title with a hairline rule and optional trailing controls. */
export interface SectionHeadingProps { children?: React.ReactNode; trailing?: React.ReactNode; size?: string; style?: React.CSSProperties }
/** 11px bold uppercase grey eyebrow used above form fields and small lists. */
export interface EyebrowLabelProps { children?: React.ReactNode; style?: React.CSSProperties }
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
export declare function EyebrowLabel(props: EyebrowLabelProps): JSX.Element;
