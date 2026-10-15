import { Check, ChevronLeft, ChevronRight, Command, FileWarning, Filter, Pencil, Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { cx, useControllableState } from '../lib/utils'
import { EmptyState } from './Data'
import { SearchField } from './Forms'
import { Dialog } from './Overlays'
import { Badge, Button, IconButton, Input, StatusChip } from './Primitives'

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
  children?: ReactNode
}) {
  return <header className="pango-page-header"><div><div className="pango-page-heading">{eyebrow && <span className="pango-page-eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description && <p>{description}</p>}</div>{children && <div className="pango-page-header-content">{children}</div>}</div>{actions && <div className="pango-page-actions">{actions}</div>}</header>
}

export function FilterBar({
  query,
  onQueryChange,
  filters,
  onClear,
  actions,
}: {
  query: string
  onQueryChange: (query: string) => void
  filters?: readonly { label: ReactNode; onRemove?: () => void }[]
  onClear?: () => void
  actions?: ReactNode
}) {
  return <div className="pango-filter-bar"><SearchField value={query} onValueChange={onQueryChange} placeholder="Search" /><div className="pango-filter-tags">{filters?.map((filter, index) => <span className="pango-tag" key={index}>{filter.label}{filter.onRemove && <button type="button" aria-label={`Remove ${String(filter.label)}`} onClick={filter.onRemove}><X size={12} /></button>}</span>)}</div>{filters?.length && onClear ? <button type="button" className="pango-filter-clear" onClick={onClear}>Clear filters</button> : null}<div className="pango-filter-actions">{actions}</div></div>
}

export function DataToolbar({
  title,
  selectedCount = 0,
  onClearSelection,
  bulkActions,
  children,
}: {
  title?: ReactNode
  selectedCount?: number
  onClearSelection?: () => void
  bulkActions?: ReactNode
  children?: ReactNode
}) {
  if (selectedCount > 0) return <div className="pango-bulk-toolbar"><span><strong>{selectedCount}</strong> selected</span><div>{bulkActions}<IconButton label="Clear selection" size="sm" tone="soft" onClick={onClearSelection}><X size={15} /></IconButton></div></div>
  return <div className="pango-data-toolbar"><div>{title && <h2>{title}</h2>}</div><div>{children}</div></div>
}

export function SettingsPanel({
  title,
  description,
  children,
  badge,
}: {
  title: ReactNode
  description?: ReactNode
  children: ReactNode
  badge?: ReactNode
}) {
  return <section className="pango-settings-panel"><div><div className="pango-settings-title"><h3>{title}</h3>{badge}</div>{description && <p>{description}</p>}</div><div className="pango-settings-controls">{children}</div></section>
}

export function InlineEdit({
  value,
  onSave,
  label = 'Value',
  placeholder,
}: {
  value: string
  onSave: (value: string) => void | Promise<void>
  label?: string
  placeholder?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    try { await onSave(draft); setEditing(false) } finally { setSaving(false) }
  }
  if (!editing) return <div className="pango-inline-edit"><span>{value || '—'}</span><IconButton label={`Edit ${label}`} size="sm" tone="soft" onClick={() => { setDraft(value); setEditing(true) }}><Pencil size={14} /></IconButton></div>
  return <div className="pango-inline-edit is-editing"><Input value={draft} placeholder={placeholder} aria-label={label} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') void save(); if (event.key === 'Escape') setEditing(false) }} autoFocus /><Button size="sm" loading={saving} onClick={() => void save()}><Check size={14} />Save</Button><IconButton label="Cancel edit" size="sm" tone="soft" onClick={() => setEditing(false)}><X size={14} /></IconButton></div>
}

export function ListDetailLayout({
  list,
  detail,
  empty,
}: {
  list: ReactNode
  detail?: ReactNode
  empty?: ReactNode
}) {
  return <div className="pango-list-detail"><aside>{list}</aside><main>{detail ?? empty ?? <EmptyState title="Select an item" description="Choose an item from the list to see its details." />}</main></div>
}

export function CommandPalette({
  open,
  onOpenChange,
  commands,
  placeholder = 'Search commands',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  commands: readonly { id: string; label: ReactNode; hint?: ReactNode; keywords?: string[]; icon?: ReactNode; onSelect: () => void }[]
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const visibleCommands = commands.filter((command) => `${String(command.label)} ${command.keywords?.join(' ') ?? ''}`.toLowerCase().includes(normalizedQuery))
  return <Dialog open={open} onOpenChange={onOpenChange} title="Command menu" description="Search pages, actions, and shortcuts." className="pango-command-dialog"><div className="pango-command-input"><Search size={18} /><input autoFocus value={query} placeholder={placeholder} onChange={(event) => setQuery(event.target.value)} /></div><div className="pango-command-list" role="listbox">{visibleCommands.map((command) => <button key={command.id} type="button" role="option" onClick={() => { command.onSelect(); onOpenChange(false) }}>{command.icon && <span>{command.icon}</span>}<div><strong>{command.label}</strong>{command.hint && <small>{command.hint}</small>}</div><ChevronRight size={16} /></button>)}{visibleCommands.length === 0 && <div className="pango-command-empty">No commands match “{query}”.</div>}</div></Dialog>
}

export function ConfirmationWorkflow({
  title,
  description,
  confirmation,
  onBack,
  onConfirm,
  confirmLabel = 'Confirm',
}: {
  title: ReactNode
  description: ReactNode
  confirmation: ReactNode
  onBack?: () => void
  onConfirm: () => void | Promise<void>
  confirmLabel?: string
}) {
  const [submitting, setSubmitting] = useState(false)
  const [complete, setComplete] = useState(false)
  const submit = async () => { setSubmitting(true); try { await onConfirm(); setComplete(true) } finally { setSubmitting(false) } }
  if (complete) return <div className="pango-confirmation-complete"><span><Check size={18} /></span><h3>Complete</h3><p>{confirmation}</p></div>
  return <section className="pango-confirmation-workflow"><Badge tone="accent"><FileWarning size={12} /> Review action</Badge><h2>{title}</h2><p>{description}</p><div className="pango-confirmation-actions">{onBack && <Button variant="outline" onClick={onBack}><ChevronLeft size={15} />Back</Button>}<Button loading={submitting} onClick={() => void submit()}>{confirmLabel}<ChevronRight size={15} /></Button></div></section>
}

export function ResponsiveNavigation({
  items,
  current,
  onNavigate,
  title = 'Navigation',
}: {
  items: readonly { id: string; label: ReactNode; icon?: ReactNode; badge?: ReactNode }[]
  current: string
  onNavigate: (id: string) => void
  title?: ReactNode
}) {
  return <nav className="pango-responsive-nav" aria-label={String(title)}><span>{title}</span>{items.map((item) => <button type="button" className={cx(item.id === current && 'is-current')} key={item.id} onClick={() => onNavigate(item.id)}>{item.icon}{item.label}{item.badge && <Badge>{item.badge}</Badge>}</button>)}</nav>
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }: { title?: ReactNode; description: ReactNode; onRetry?: () => void }) {
  return <EmptyState icon={<FileWarning size={23} />} title={title} description={description} action={onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>} />
}

export function LoadingState({ label = 'Loading content' }: { label?: string }) {
  return <div className="pango-loading-state" role="status"><span /><p>{label}</p></div>
}

export function FilterTrigger({ active = false, onClick }: { active?: boolean; onClick: () => void }) {
  return <Button variant={active ? 'soft' : 'outline'} size="sm" icon={<Filter size={15} />} onClick={onClick}>Filters</Button>
}

export function CommandHint({ keys }: { keys: string }) {
  return <span className="pango-command-hint"><Command size={12} />{keys}</span>
}

export function SearchAndFilter({ value, onValueChange, onFiltersClick }: { value: string; onValueChange: (value: string) => void; onFiltersClick: () => void }) {
  return <div className="pango-search-and-filter"><SearchField value={value} onValueChange={onValueChange} /><Button size="sm" variant="outline" icon={<SlidersHorizontal size={15} />} onClick={onFiltersClick}>Filter</Button></div>
}
