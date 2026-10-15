import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { cx, useControllableState, useStableId } from '../lib/utils'

export type TabItem = { id: string; label: ReactNode; content: ReactNode; disabled?: boolean; badge?: ReactNode }

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  label = 'Tabs',
  className,
}: {
  items: readonly TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label?: string
  className?: string
}) {
  const [activeValue, setActiveValue] = useControllableState({ value, defaultValue: defaultValue ?? items[0]?.id ?? '', onChange: onValueChange })
  const instanceId = useStableId('tabs')
  const activeIndex = Math.max(items.findIndex((item) => item.id === activeValue), 0)

  const moveFocus = (direction: 1 | -1) => {
    let nextIndex = activeIndex
    for (let attempts = 0; attempts < items.length; attempts += 1) {
      nextIndex = (nextIndex + direction + items.length) % items.length
      if (!items[nextIndex]?.disabled) { setActiveValue(items[nextIndex].id); return }
    }
  }

  return (
    <div className={cx('pango-tabs', className)}>
      <div className="pango-tab-list" role="tablist" aria-label={label} onKeyDown={(event) => { if (event.key === 'ArrowRight') { event.preventDefault(); moveFocus(1) } if (event.key === 'ArrowLeft') { event.preventDefault(); moveFocus(-1) } }}>
        {items.map((item) => {
          const active = item.id === activeValue
          return <button key={item.id} type="button" role="tab" id={`${instanceId}-tab-${item.id}`} aria-selected={active} aria-controls={`${instanceId}-panel-${item.id}`} disabled={item.disabled} className={cx('pango-tab', active && 'is-active')} tabIndex={active ? 0 : -1} onClick={() => setActiveValue(item.id)}>{item.label}{item.badge && <span className="pango-tab-badge">{item.badge}</span>}</button>
        })}
      </div>
      {items.map((item) => item.id === activeValue && <div key={item.id} role="tabpanel" id={`${instanceId}-panel-${item.id}`} aria-labelledby={`${instanceId}-tab-${item.id}`} className="pango-tab-panel">{item.content}</div>)}
    </div>
  )
}

export type AccordionItem = { id: string; title: ReactNode; content: ReactNode; disabled?: boolean }

export function Accordion({
  items,
  type = 'single',
  defaultValue = [],
  value,
  onValueChange,
}: {
  items: readonly AccordionItem[]
  type?: 'single' | 'multiple'
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
}) {
  const [openItems, setOpenItems] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const instanceId = useStableId('accordion')
  const toggle = (id: string) => {
    setOpenItems((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : type === 'single' ? [id] : [...previous, id])
  }
  return <div className="pango-accordion">{items.map((item) => {
    const isOpen = openItems.includes(item.id)
    return <div className={cx('pango-accordion-item', isOpen && 'is-open')} key={item.id}><h3><button type="button" id={`${instanceId}-trigger-${item.id}`} aria-expanded={isOpen} aria-controls={`${instanceId}-content-${item.id}`} disabled={item.disabled} onClick={() => toggle(item.id)}>{item.title}<ChevronRight size={17} /></button></h3>{isOpen && <div id={`${instanceId}-content-${item.id}`} role="region" aria-labelledby={`${instanceId}-trigger-${item.id}`} className="pango-accordion-content">{item.content}</div>}</div>
  })}</div>
}

export function Breadcrumb({ items }: { items: readonly { label: ReactNode; href?: string; onClick?: () => void }[] }) {
  return <nav aria-label="Breadcrumb"><ol className="pango-breadcrumb">{items.map((item, index) => <li key={index}>{index > 0 && <ChevronRight size={14} aria-hidden="true" />}{index === items.length - 1 ? <span aria-current="page">{item.label}</span> : item.href ? <a href={item.href}>{item.label}</a> : <button type="button" onClick={item.onClick}>{item.label}</button>}</li>)}</ol></nav>
}

export function Pagination({ page, pageCount, onPageChange, siblingCount = 1 }: { page: number; pageCount: number; onPageChange: (page: number) => void; siblingCount?: number }) {
  const visiblePages = pageRange(page, pageCount, siblingCount)
  return <nav className="pango-pagination" aria-label="Pagination"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={16} /></button>{visiblePages.map((item, index) => item === 'ellipsis' ? <span key={`ellipsis-${index}`}><MoreHorizontal size={15} /></span> : <button key={item} type="button" aria-current={item === page ? 'page' : undefined} className={item === page ? 'is-current' : ''} onClick={() => onPageChange(item)}>{item}</button>)}<button type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight size={16} /></button></nav>
}

function pageRange(page: number, pageCount: number, siblingCount: number): Array<number | 'ellipsis'> {
  const visible: Array<number | 'ellipsis'> = []
  const first = 1
  const last = Math.max(pageCount, 1)
  const start = Math.max(2, page - siblingCount)
  const end = Math.min(last - 1, page + siblingCount)
  visible.push(first)
  if (start > 2) visible.push('ellipsis')
  for (let current = start; current <= end; current += 1) visible.push(current)
  if (end < last - 1) visible.push('ellipsis')
  if (last > 1) visible.push(last)
  return visible
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
