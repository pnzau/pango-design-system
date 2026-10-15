import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from './lib/utils'

export function VirtualList<T>({
  items,
  renderItem,
  estimateSize = () => 44,
  getItemKey = (_, index) => index,
  height = 400,
  overscan = 5,
  className,
}: {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  estimateSize?: (index: number) => number
  getItemKey?: (item: T, index: number) => string | number
  height?: number | string
  overscan?: number
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize,
    getItemKey: (index) => getItemKey(items[index], index),
    overscan,
  })
  return <div ref={scrollRef} className={cx('pango-virtual-scroll', className)} style={{ height }}><div className="pango-virtual-canvas" style={{ height: virtualizer.getTotalSize() }}>{virtualizer.getVirtualItems().map((virtualItem) => <div key={virtualItem.key} data-index={virtualItem.index} ref={virtualizer.measureElement} className="pango-virtual-item" style={{ transform: `translateY(${virtualItem.start}px)` }}>{renderItem(items[virtualItem.index], virtualItem.index)}</div>)}</div></div>
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columns = 3,
  estimateRowHeight = () => 160,
  getItemKey = (_, index) => index,
  height = 480,
  gap = 12,
  className,
}: {
  items: readonly T[]
  renderItem: (item: T, index: number) => ReactNode
  columns?: number
  estimateRowHeight?: (rowIndex: number) => number
  getItemKey?: (item: T, index: number) => string | number
  height?: number | string
  gap?: number
  className?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const rowCount = Math.ceil(items.length / columns)
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: estimateRowHeight,
    overscan: 3,
  })
  return <div ref={scrollRef} className={cx('pango-virtual-scroll', className)} style={{ height }}><div className="pango-virtual-canvas" style={{ height: virtualizer.getTotalSize() }}>{virtualizer.getVirtualItems().map((virtualRow) => { const startIndex = virtualRow.index * columns; const rowItems = items.slice(startIndex, startIndex + columns); return <div key={virtualRow.key} data-index={virtualRow.index} ref={virtualizer.measureElement} className="pango-virtual-grid-row" style={{ transform: `translateY(${virtualRow.start}px)`, gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}>{rowItems.map((item, index) => <div key={getItemKey(item, startIndex + index)}>{renderItem(item, startIndex + index)}</div>)}</div> })}</div></div>
}

export type VirtualTableColumn<T> = { id: string; header: ReactNode; render: (item: T, index: number) => ReactNode; width?: string | number }

export function VirtualizedDataTable<T>({
  items,
  columns,
  getItemKey = (_, index) => index,
  estimateRowHeight = () => 48,
  height = 480,
  className,
}: {
  items: readonly T[]
  columns: readonly VirtualTableColumn<T>[]
  getItemKey?: (item: T, index: number) => string | number
  estimateRowHeight?: (index: number) => number
  height?: number | string
  className?: string
}) {
  const template = useMemo(() => columns.map((column) => typeof column.width === 'number' ? `${column.width}px` : column.width ?? 'minmax(0, 1fr)').join(' '), [columns])
  return <div className={cx('pango-virtual-table', className)} role="table"><div role="row" className="pango-virtual-table-header" style={{ gridTemplateColumns: template }}>{columns.map((column) => <div role="columnheader" key={column.id}>{column.header}</div>)}</div><VirtualList items={items} getItemKey={getItemKey} estimateSize={estimateRowHeight} height={height} renderItem={(item, index) => <div role="row" className="pango-virtual-table-row" style={{ gridTemplateColumns: template }}>{columns.map((column) => <div role="cell" key={column.id}>{column.render(item, index)}</div>)}</div>} /></div>
}

export type VirtualizerStyle = CSSProperties
