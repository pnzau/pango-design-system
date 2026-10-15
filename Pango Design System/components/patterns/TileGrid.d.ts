/**
 * Rows of status-coloured tiles — the system's fastest read of "which of a
 * fixed inventory is fine and which is not". Units in a building, desks on a
 * floor, machines in a rack, beds in a ward, shifts in a week.
 *
 * `variant="dots"` is the compact summary-card rendering; `"cells"` the full
 * detail grid. Legacy `floors` / `units` / `onUnitClick` props and the
 * `UnitGrid` / `FloorRow` / `UnitCell` / `UnitDot` aliases still work.
 */
export type TileTone = 'success' | 'warning' | 'danger' | 'info' | 'slate' | 'neutral' | 'empty';
export interface Tile {
  /** Short identifier shown in the cell, e.g. "C2", "DESK-14". */
  label: string;
  /** One line of context — who or what occupies the slot. */
  caption?: string;
  /** A tone, or a key registered in `TILE_STATUS`. */
  status: string;
}
export interface TileRowData {
  /** Row label: a floor, a rack, a day. */
  label: string;
  tiles: Tile[];
}
export interface TileGridProps {
  rows?: TileRowData[];
  /** cells = full grid (default) · dots = compact summary row */
  variant?: 'cells' | 'dots';
  onTileClick?: (tile: Tile) => void;
  /** Run the rows' rise-in animation on mount. */
  animate?: boolean;
  padding?: number | string;
  /** Caption for a tile with no occupant. Default "Free". */
  emptyCaption?: string;
  style?: React.CSSProperties;
}
export declare function TileGrid(props: TileGridProps): JSX.Element;
export declare function TileRow(props: { label: string; tiles?: Tile[]; onTileClick?: (t: Tile) => void; animate?: boolean; index?: number; emptyCaption?: string; minCell?: number; style?: React.CSSProperties }): JSX.Element;
export declare function TileDots(props: { label: string; tiles?: Tile[]; animate?: boolean; index?: number; emptyCaption?: string; style?: React.CSSProperties }): JSX.Element;
export declare function TileCell(props: { label: string; caption?: string; emptyCaption?: string; status: string; onClick?: () => void; style?: React.CSSProperties }): JSX.Element;
export declare function TileDot(props: { status: string; size?: number; title?: string }): JSX.Element;
/** Legend for the product's own vocabulary. */
export declare function StatusLegend(props: { items?: { status: string; label: string }[]; compact?: boolean; style?: React.CSSProperties }): JSX.Element;
/** `{ fg, bg, line, dot }` per tone. */
export declare const TILE_TONES: Record<TileTone, { fg: string; bg: string; line: string; dot: string; dashed?: boolean }>;
/** Status key → tone. Extend with the product's vocabulary. */
export declare const TILE_STATUS: Record<string, TileTone>;
export declare const UnitGrid: typeof TileGrid;
export declare const UnitCell: typeof TileCell;
export declare const UnitDot: typeof TileDot;
export declare const FloorRow: typeof TileRow;
export declare const FloorDots: typeof TileDots;
