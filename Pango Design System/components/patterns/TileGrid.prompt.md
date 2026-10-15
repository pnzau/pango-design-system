```jsx
const rows = [
  { label: 'FL 3', tiles: [{ label: 'C1', caption: 'Achieng A.', status: 'success' },
                            { label: 'C2', status: 'empty' }] },
  { label: 'FL 2', tiles: [{ label: 'B1', caption: 'Otieno M.', status: 'danger' }] }
];

{/* detail view */}
<TileGrid rows={rows} onTileClick={openTile} emptyCaption="Vacant" animate />

{/* summary card — same data, one line per row */}
<TileGrid rows={rows} variant="dots" />

<StatusLegend compact items={[
  { status: 'success', label: 'Paid' },
  { status: 'warning', label: 'Due soon' },
  { status: 'danger',  label: 'Overdue' },
  { status: 'empty',   label: 'Vacant' }
]} />
```

Statuses are tones (`success` `warning` `danger` `info` `slate` `neutral` `empty`), so
the product supplies the vocabulary: register your own keys in `TILE_STATUS` and name
them in the legend. Use this only for a **fixed inventory** — units, desks, racks, beds,
shifts. A list of records is a table.
