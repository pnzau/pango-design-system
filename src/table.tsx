import {
  columnFilteringFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import type { ColumnDef, PaginationState, ReactTable, RowData, RowSelectionState, SortingState } from '@tanstack/react-table'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, Columns3, Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from './lib/utils'
import { EmptyState } from './components/Data'
import { DropdownMenu } from './components/Overlays'
import { Button, IconButton } from './components/Primitives'
import { Checkbox, Spinner } from './components/Core'

export function BasicTable({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <div className="pango-basic-table-wrap"><table className={cx('pango-basic-table', className)} {...props}>{children}</table></div>
}

export function BasicTableCaption({ children }: { children: ReactNode }) { return <caption className="sr-only">{children}</caption> }
export function BasicTableHead({ children }: { children: ReactNode }) { return <thead>{children}</thead> }
export function BasicTableBody({ children }: { children: ReactNode }) { return <tbody>{children}</tbody> }
export function BasicTableFooter({ children }: { children: ReactNode }) { return <tfoot>{children}</tfoot> }
export function BasicTableRow({ children, className }: { children: ReactNode; className?: string }) { return <tr className={className}>{children}</tr> }
export function BasicTableHeader({ children, scope = 'col', className }: { children: ReactNode; scope?: 'col' | 'row'; className?: string }) { return <th className={className} scope={scope}>{children}</th> }
export function BasicTableCell({ children, className, colSpan }: { children: ReactNode; className?: string; colSpan?: number }) { return <td className={className} colSpan={colSpan}>{children}</td> }

const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  rowSelectionFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  columnPinningFeature,
  columnSizingFeature,
  columnResizingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

type DataTableFeatures = typeof dataTableFeatures

export type DataTableColumn<TData extends RowData> = ColumnDef<DataTableFeatures, TData>
export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>

export function DataTable<TData extends RowData>({
  data,
  columns,
  caption,
  getRowId,
  getSubRows,
  renderExpanded,
  pageSize = 10,
  enableSelection = false,
  searchable = true,
  showColumnControls = true,
  loading = false,
  empty,
  defaultGlobalFilter = '',
  defaultRowSelection = {},
  defaultSorting = [],
  onTableReady,
  className,
}: {
  data: TData[]
  columns: DataTableColumn<TData>[]
  caption: string
  getRowId?: (row: TData, index: number, parent?: { id: string }) => string
  getSubRows?: (row: TData, index: number) => TData[] | undefined
  renderExpanded?: (row: TData) => ReactNode
  pageSize?: number
  enableSelection?: boolean
  searchable?: boolean
  showColumnControls?: boolean
  loading?: boolean
  empty?: ReactNode
  defaultGlobalFilter?: string
  defaultRowSelection?: RowSelectionState
  defaultSorting?: SortingState
  onTableReady?: (table: DataTableInstance<TData>) => void
  className?: string
}) {
  const [globalFilter, setGlobalFilter] = useState(defaultGlobalFilter)
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize })
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(defaultRowSelection)

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
    getRowId,
    getSubRows,
    state: { globalFilter, sorting, pagination, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
  })

  useEffect(() => { onTableReady?.(table) }, [onTableReady, table])

  const rows = table.getRowModel().rows
  const totalColumns = table.getVisibleLeafColumns().length + (enableSelection ? 1 : 0)
  const pageCount = table.getPageCount()
  const allRowsSelected = table.getIsAllPageRowsSelected()
  const someRowsSelected = table.getIsSomePageRowsSelected()
  const searchQuery = globalFilter.trim()
  const hasSearchQuery = searchQuery.length > 0
  const matchingRowCount = table.getFilteredRowModel().rows.length
  const hasSourceRows = data.length > 0
  const canInteractWithRows = loading || hasSourceRows
  const showFooter = !loading && hasSourceRows

  function updateSearch(value: string) {
    table.setGlobalFilter(value)
    table.setPageIndex(0)
  }

  function clearSearch() {
    updateSearch('')
  }

  return <section className={cx('pango-data-table', className)}>
    {canInteractWithRows && <div className="pango-data-table-toolbar">
      {searchable && <label className="pango-data-table-search"><Search size={15} /><span className="sr-only">Search table</span><input value={globalFilter} onChange={(event) => updateSearch(event.target.value)} placeholder="Search" /></label>}
      <div className="pango-data-table-toolbar-actions">
        {showColumnControls && <DropdownMenu label="Columns" trigger={<IconButton label="Toggle columns" size="sm" tone="soft"><Columns3 size={16} /></IconButton>} items={table.getAllLeafColumns().map((column) => ({ label: typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id, onSelect: () => column.toggleVisibility(), disabled: !column.getCanHide() }))} />}
      </div>
    </div>}
    <div className="pango-basic-table-wrap">
      <table className="pango-basic-table pango-data-table-grid">
        <caption className="sr-only">{caption}</caption>
        <thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{enableSelection && <th className="pango-table-selection-cell" scope="col"><Checkbox aria-label="Select all rows" checked={allRowsSelected} indeterminate={someRowsSelected && !allRowsSelected} onChange={() => table.toggleAllPageRowsSelected()} /></th>}{group.headers.map((header) => <th key={header.id} colSpan={header.colSpan} scope="col" style={{ width: header.getSize() }}>
          {header.isPlaceholder ? null : <div className={cx('pango-table-header-cell', header.column.getCanSort() && 'is-sortable')}><button type="button" disabled={!header.column.getCanSort()} onClick={header.column.getToggleSortingHandler()}>{<table.FlexRender header={header} />}{header.column.getCanSort() && <SortIcon direction={header.column.getIsSorted()} />}</button>{header.column.getCanResize() && <span role="separator" aria-orientation="vertical" className="pango-table-resize" onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()} />}</div>}
        </th>)}</tr>)}</thead>
        <tbody>{loading ? <tr className="pango-data-table-loading-row"><td colSpan={totalColumns}><div className="pango-table-loading"><Spinner size="sm" /> Loading rows</div></td></tr> : rows.length === 0 ? <tr className="pango-data-table-empty-row"><td className="pango-data-table-empty-cell" colSpan={totalColumns}><div role="status">{empty ?? (hasSearchQuery ? <EmptyState className="pango-data-table-empty-state" icon={<SearchX size={23} />} title={`No results for “${searchQuery}”`} description="Try a different name, owner, or status—or clear the search to see every record." action={<Button variant="outline" size="sm" onClick={clearSearch}>Clear search</Button>} /> : <EmptyState className="pango-data-table-empty-state" title="Nothing here yet" description="Rows will appear here when records become available." />)}</div></td></tr> : rows.map((row) => <TableRows key={row.id} row={row} table={table} totalColumns={totalColumns} enableSelection={enableSelection} renderExpanded={renderExpanded} />)}</tbody>
      </table>
    </div>
    {showFooter && <div className="pango-data-table-footer"><span>{hasSearchQuery ? `${matchingRowCount} of ${data.length} rows` : `${table.getRowCount()} total rows`}</span><div className="pango-table-pagination"><button type="button" aria-label="Previous page" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft size={16} /></button><span>Page {pagination.pageIndex + 1} of {pageCount || 1}</span><button type="button" aria-label="Next page" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight size={16} /></button></div></div>}
  </section>
}

function TableRows<TData extends RowData>({
  row,
  table,
  totalColumns,
  enableSelection,
  renderExpanded,
}: {
  row: ReturnType<DataTableInstance<TData>['getRowModel']>['rows'][number]
  table: DataTableInstance<TData>
  totalColumns: number
  enableSelection: boolean
  renderExpanded?: (row: TData) => ReactNode
}) {
  return <>
    <tr data-state={row.getIsSelected() ? 'selected' : undefined}>
      {enableSelection && <td className="pango-table-selection-cell"><Checkbox aria-label={`Select row ${row.id}`} checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={() => row.toggleSelected()} /></td>}
      {row.getVisibleCells().map((cell) => <td key={cell.id} style={{ width: cell.column.getSize() }}><table.FlexRender cell={cell} /></td>)}
    </tr>
    {renderExpanded && row.getIsExpanded() && <tr className="pango-table-expanded"><td colSpan={totalColumns}>{renderExpanded(row.original)}</td></tr>}
  </>
}

function SortIcon({ direction }: { direction: false | 'asc' | 'desc' }) {
  if (direction === 'asc') return <ChevronUp size={14} />
  if (direction === 'desc') return <ChevronDown size={14} />
  return <ChevronsUpDown size={14} />
}

DataTable.displayName = 'DataTable'
