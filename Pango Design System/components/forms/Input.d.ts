/**
 * Text input, textarea, native select with Pango's chevron, and the header search field.
 */
export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  /** app = white field (default) · auth = grey-filled 11px-radius field on the sign-in screen */
  tone?: 'app' | 'auth';
  /** Set the value in JetBrains Mono — used for refs and pasted payment messages. */
  mono?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export interface TextAreaProps { value?: string; onChange?: (e: any) => void; placeholder?: string; mono?: boolean; minHeight?: number; style?: React.CSSProperties }
export interface SelectProps {
  value?: string;
  onChange?: (e: any) => void;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
  /** md = 40px header select (default) · lg = 42px sheet select */
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
}
export interface SearchFieldProps { placeholder?: string; value?: string; onChange?: (e: any) => void; width?: number | string; style?: React.CSSProperties }
export declare function Input(props: InputProps): JSX.Element;
export declare function TextArea(props: TextAreaProps): JSX.Element;
export declare function Select(props: SelectProps): JSX.Element;
export declare function SearchField(props: SearchFieldProps): JSX.Element;
