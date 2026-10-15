import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3, Minus, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react'
import { cx, useControllableState, useEscapeKey, useOutsidePointer, useStableId } from '../lib/utils'
import { Button, Input, InputField } from './Primitives'
import { Label, Spinner } from './Core'

export function FormField({
  label,
  description,
  message,
  required,
  children,
  className,
}: {
  label: ReactNode
  description?: ReactNode
  message?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
}) {
  const fieldId = useStableId('field')
  return <div className={cx('pango-form-field', className)}><Label htmlFor={fieldId}>{label}{required && <span aria-hidden="true"> *</span>}</Label>{description && <p className="pango-field-description" id={`${fieldId}-description`}>{description}</p>}<div>{children}</div>{message && <p className="pango-field-message" id={`${fieldId}-message`} role="alert">{message}</p>}</div>
}

export function FormLabel({ children, required = false, ...props }: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return <Label {...props}>{children}{required && <span aria-hidden="true"> *</span>}</Label>
}

export function FormDescription({ children }: { children: ReactNode }) {
  return <p className="pango-field-description">{children}</p>
}

export function FormMessage({ children }: { children?: ReactNode }) {
  return children ? <p className="pango-field-message" role="alert">{children}</p> : null
}

export function FormSection({ title, description, children, action }: { title: ReactNode; description?: ReactNode; children: ReactNode; action?: ReactNode }) {
  return <section className="pango-form-section"><div className="pango-form-section-heading"><div><h3>{title}</h3>{description && <p>{description}</p>}</div>{action}</div><div className="pango-form-section-body">{children}</div></section>
}

export function SearchField({
  value,
  defaultValue = '',
  onValueChange,
  onDebouncedChange,
  delay = 250,
  placeholder = 'Search',
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onDebouncedChange?: (value: string) => void
  delay?: number
}) {
  const [query, setQuery] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const timeoutRef = useRef<number | null>(null)
  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    setQuery(nextValue)
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => onDebouncedChange?.(nextValue), delay)
  }
  return <span className="pango-search-field"><Search size={16} /><Input value={query} placeholder={placeholder} type="search" onChange={update} {...props} />{query && <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); onDebouncedChange?.('') }}><X size={14} /></button>}</span>
}

export function NumberInput({
  value,
  defaultValue,
  onValueChange,
  locale,
  formatOptions,
  min,
  max,
  step = 1,
  label,
  id,
  className,
  disabled,
  hint,
  invalid = false,
  loading = false,
  'aria-describedby': ariaDescribedBy,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'> & {
  value?: number
  defaultValue?: number
  onValueChange?: (value: number | undefined) => void
  locale?: string
  formatOptions?: Intl.NumberFormatOptions
  min?: number
  max?: number
  step?: number
  label?: ReactNode
  hint?: ReactNode
  invalid?: boolean
  loading?: boolean
}) {
  const [amount, setAmount] = useControllableState<number | undefined>({ value, defaultValue, onChange: onValueChange })
  const [editing, setEditing] = useState(false)
  const [editingValue, setEditingValue] = useState('')
  const inputId = useStableId('number', id)
  const hintId = hint ? `${inputId}-hint` : undefined
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigitsForStep(step), ...formatOptions }), [formatOptions, locale, step])
  const displayValue = amount === undefined ? '' : numberFormatter.format(amount)
  const clamp = (nextValue: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, nextValue))
  useEffect(() => {
    if (!editing) setEditingValue(displayValue)
  }, [displayValue, editing])
  const update = (nextValue: string) => {
    setEditingValue(nextValue)
    if (!nextValue.trim()) return setAmount(undefined)
    const parsed = parseLocalizedNumber(nextValue, locale)
    if (parsed !== undefined) setAmount(clamp(parsed))
  }
  const nudge = (direction: -1 | 1) => {
    const nextValue = clamp((amount ?? 0) + (step * direction))
    setAmount(nextValue)
    setEditingValue(numberFormatter.format(nextValue))
  }
  return <label className={cx('pango-number-field', className)} htmlFor={inputId}>{label && <span className="field-label">{label}</span>}<span className="pango-number-input"><input id={inputId} className={cx('input', invalid && 'input-invalid')} type="text" inputMode="decimal" value={editing ? editingValue : displayValue} disabled={disabled || loading} aria-busy={loading || undefined} aria-describedby={[ariaDescribedBy, hintId].filter(Boolean).join(' ') || undefined} aria-invalid={invalid || undefined} onFocus={() => { setEditing(true); setEditingValue(amount === undefined ? '' : String(amount)) }} onBlur={() => { setEditing(false); setEditingValue(displayValue) }} onChange={(event) => update(event.target.value)} {...props} />{loading ? <span className="pango-number-loading"><Spinner label="Updating number" size="sm" /></span> : <span className="pango-number-controls"><button type="button" aria-label="Decrease value" disabled={disabled || amount === undefined || (min !== undefined && amount <= min)} onClick={() => nudge(-1)}><Minus size={12} /></button><button type="button" aria-label="Increase value" disabled={disabled || amount === undefined || (max !== undefined && amount >= max)} onClick={() => nudge(1)}><Plus size={12} /></button></span>}</span>{hint && <span id={hintId} className={cx('field-hint', invalid && 'field-hint-invalid')}>{hint}</span>}</label>
}

function fractionDigitsForStep(step: number) {
  const decimalPart = String(step).split('.')[1]
  return decimalPart?.length ?? 0
}

function parseLocalizedNumber(value: string, locale?: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.1)
  const group = parts.find((part) => part.type === 'group')?.value ?? ','
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const normalized = value.trim().replaceAll(group, '').replaceAll('\u00a0', '').replace(decimal, '.')
  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}

export type SelectOption = { value: string; label: ReactNode; disabled?: boolean; keywords?: string[] }

export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  emptyMessage = 'No options found.',
  label,
}: {
  options: readonly SelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  emptyMessage?: ReactNode
  label?: string
}) {
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? '', onChange: onValueChange })
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputId = useStableId('combobox')
  useOutsidePointer(open, [rootRef], () => setOpen(false))
  const filteredOptions = useMemo(() => options.filter((option) => `${String(option.label)} ${option.keywords?.join(' ') ?? ''}`.toLowerCase().includes(query.toLowerCase())), [options, query])
  const selectedOption = options.find((option) => option.value === selected)
  return (
    <div className="pango-combobox" ref={rootRef}>
      <label className="sr-only" htmlFor={inputId}>{label ?? placeholder}</label>
      <div className="pango-combobox-input">
        <Search size={15} />
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${inputId}-listbox`}
          aria-autocomplete="list"
          value={open ? query : selectedOption ? String(selectedOption.label) : ''}
          placeholder={placeholder}
          onFocus={() => { setOpen(true); setQuery('') }}
          onChange={(event) => { setQuery(event.target.value); setOpen(true) }}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false) }}
        />
        {selected && <button type="button" aria-label="Clear selection" onClick={() => setSelected('')}><X size={14} /></button>}
      </div>
      {open && (
        <ul className="pango-combobox-list" id={`${inputId}-listbox`} role="listbox">
          {filteredOptions.length === 0 && <li className="pango-combobox-empty">{emptyMessage}</li>}
          {filteredOptions.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === selected}>
              <button type="button" disabled={option.disabled} onClick={() => { setSelected(option.value); setOpen(false) }}>
                <span>{option.label}</span>
                {option.value === selected && <Check size={15} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function MultiSelect({
  options,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = 'Select options',
}: {
  options: readonly SelectOption[]
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
}) {
  const [selected, setSelected] = useControllableState({ value, defaultValue, onChange: onValueChange })
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useOutsidePointer(open, [rootRef], () => setOpen(false))
  return <div className="pango-multiselect" ref={rootRef}><button type="button" className="pango-multiselect-trigger" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((previous) => !previous)}>{selected.length ? <span className="pango-selected-tags">{selected.map((item) => { const option = options.find((candidate) => candidate.value === item); const remove = (event: React.SyntheticEvent) => { event.stopPropagation(); setSelected((previous) => previous.filter((candidate) => candidate !== item)) }; return <span className="pango-tag" key={item}>{option?.label}<span role="button" tabIndex={0} aria-label={`Remove ${String(option?.label)}`} onClick={remove} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); remove(event) } }}><X size={12} /></span></span> })}</span> : <span className="pango-placeholder">{placeholder}</span>}</button>{open && <div className="pango-multiselect-menu" role="listbox" aria-multiselectable="true">{options.map((option) => { const checked = selected.includes(option.value); return <button type="button" role="option" aria-selected={checked} disabled={option.disabled} key={option.value} onClick={() => setSelected((previous) => checked ? previous.filter((value) => value !== option.value) : [...previous, option.value])}><span className={cx('pango-multiselect-check', checked && 'is-checked')}><Check size={12} /></span>{option.label}</button> })}</div>}</div>
}

export type DateRangeValue = { start?: string; end?: string }

type DateFieldProps = {
  clearable?: boolean
  disabled?: boolean
  id?: string
  label?: ReactNode
  max?: string
  min?: string
  placeholder?: string
}

export function DatePicker({
  value,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  label = 'Date',
  placeholder = 'Pick a date',
  clearable = true,
  disabled = false,
  id,
}: DateFieldProps & {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? '', onChange: onValueChange })
  const selectedDate = parseISODate(selected)
  const [month, setMonth] = useState(() => startOfMonth(selectedDate ?? new Date()))
  const inputId = useStableId('date', id)
  const panelId = `${inputId}-calendar`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  const close = () => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()) }
  useOutsidePointer(open, [rootRef], close)
  useEscapeKey(open, close)

  useEffect(() => { if (selectedDate) setMonth(startOfMonth(selectedDate)) }, [selected])

  return <InputField className="pango-date-field" label={label} labelFor={inputId}><div className="pango-date-picker" ref={rootRef}><button ref={triggerRef} id={inputId} className="pango-date-picker-trigger" type="button" disabled={disabled} aria-expanded={open} aria-controls={panelId} aria-haspopup="dialog" aria-label={!label ? 'Choose date' : undefined} onClick={() => setOpen((current) => !current)}><CalendarDays size={16} aria-hidden="true" /><span>{selectedDate ? formatDate(selectedDate) : placeholder}</span></button>{clearable && selected && <button className="pango-date-picker-clear" type="button" aria-label="Clear date" disabled={disabled} onClick={() => setSelected('')}><X size={14} /></button>}{open && <div className="pango-date-picker-panel" id={panelId} role="dialog" aria-label="Choose a date"><CalendarGrid month={month} onMonthChange={setMonth} selected={selectedDate} min={min} max={max} onSelect={(date) => { setSelected(toISODate(date)); setMonth(startOfMonth(date)); close() }} /></div>}</div></InputField>
}

export function TimePicker({
  value,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  label = 'Time',
  placeholder = 'Pick a time',
  clearable = true,
  disabled = false,
  id,
  min,
  max,
  step = 15,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  label?: ReactNode
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  id?: string
  min?: string
  max?: string
  step?: number
}) {
  const minuteStep = normaliseMinuteStep(step)
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? '', onChange: onValueChange })
  const selectedTime = parseTime(selected)
  const [draftTime, setDraftTime] = useState(() => selectedTime ?? roundCurrentTime(minuteStep))
  const inputId = useStableId('time', id)
  const panelId = `${inputId}-picker`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  const minuteOptions = useMemo(() => Array.from({ length: Math.ceil(60 / minuteStep) }, (_, index) => Math.min(index * minuteStep, 59)), [minuteStep])
  const quickTime = useMemo(() => roundCurrentTime(minuteStep), [minuteStep, open])
  const quickTimeUnavailable = isTimeOutsideLimits(toTimeValue(quickTime), min, max)
  const close = () => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()) }
  const applyTime = (nextTime: TimeValue) => {
    const nextValue = toTimeValue(nextTime)
    if (isTimeOutsideLimits(nextValue, min, max)) return
    setSelected(nextValue)
    setDraftTime(nextTime)
    close()
  }

  useOutsidePointer(open, [rootRef], close)
  useEscapeKey(open, close)
  useEffect(() => { if (open) setDraftTime(selectedTime ?? roundCurrentTime(minuteStep)) }, [open, selected, minuteStep])

  return <InputField className="pango-time-field" label={label} labelFor={inputId}><div className="pango-time-picker" ref={rootRef}><button ref={triggerRef} id={inputId} className="pango-date-picker-trigger" type="button" disabled={disabled} aria-expanded={open} aria-controls={panelId} aria-haspopup="dialog" aria-label={!label ? 'Choose time' : undefined} onClick={() => setOpen((current) => !current)}><Clock3 size={16} aria-hidden="true" /><span>{selectedTime ? formatTime(selectedTime) : placeholder}</span></button>{clearable && selected && <button className="pango-date-picker-clear" type="button" aria-label="Clear time" disabled={disabled} onClick={() => setSelected('')}><X size={14} /></button>}{open && <div className="pango-time-picker-panel" id={panelId} role="dialog" aria-label="Choose a time"><div className="pango-time-picker-heading"><strong>Choose time</strong><button type="button" disabled={quickTimeUnavailable} onClick={() => applyTime(quickTime)}>Now</button></div><div className="pango-time-picker-columns"><div><span id={`${inputId}-hours`}>Hour</span><div className="pango-time-picker-options" role="listbox" aria-labelledby={`${inputId}-hours`}>{Array.from({ length: 24 }, (_, hour) => { const unavailable = minuteOptions.every((minute) => isTimeOutsideLimits(toTimeValue({ hour, minute }), min, max)); return <button type="button" key={hour} role="option" aria-selected={draftTime.hour === hour} className={cx(draftTime.hour === hour && 'is-selected')} disabled={unavailable} onClick={() => setDraftTime((current) => ({ ...current, hour }))}>{String(hour).padStart(2, '0')}</button> })}</div></div><div><span id={`${inputId}-minutes`}>Minute</span><div className="pango-time-picker-options" role="listbox" aria-labelledby={`${inputId}-minutes`}>{minuteOptions.map((minute) => { const time = { hour: draftTime.hour, minute }; const valueForOption = toTimeValue(time); const unavailable = isTimeOutsideLimits(valueForOption, min, max); return <button type="button" key={minute} role="option" aria-selected={draftTime.minute === minute} className={cx(draftTime.minute === minute && 'is-selected')} disabled={unavailable} onClick={() => applyTime(time)}>{String(minute).padStart(2, '0')}</button> })}</div></div></div></div>}</div></InputField>
}

export function DateRangePicker({
  value,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  min,
  max,
  label = 'Date range',
  placeholder = 'Select dates',
  clearable = true,
  disabled = false,
  id,
}: DateFieldProps & {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  onValueChange?: (value: DateRangeValue) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [range, setRange] = useControllableState<DateRangeValue>({ value, defaultValue: defaultValue ?? {}, onChange: onValueChange })
  const startDate = parseISODate(range.start)
  const endDate = parseISODate(range.end)
  const [month, setMonth] = useState(() => startOfMonth(startDate ?? endDate ?? new Date()))
  const inputId = useStableId('date-range', id)
  const panelId = `${inputId}-calendar`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useControllableState({ value: controlledOpen, defaultValue: defaultOpen, onChange: onOpenChange })
  const [hoveredDate, setHoveredDate] = useState<Date>()
  // Build this interval once per interaction; calendar cells only compare against its bounds.
  const previewRange = useMemo(() => normaliseDateRange(startDate, endDate ? undefined : hoveredDate), [endDate, hoveredDate, startDate])
  const close = () => { setOpen(false); setHoveredDate(undefined); window.requestAnimationFrame(() => triggerRef.current?.focus()) }
  useOutsidePointer(open, [rootRef], close)
  useEscapeKey(open, close)

  useEffect(() => { if (startDate ?? endDate) setMonth(startOfMonth(startDate ?? endDate!)) }, [range.end, range.start])

  const selectDate = (date: Date) => {
    const dateValue = toISODate(date)
    if (!range.start || range.end) {
      setRange({ start: dateValue })
      setHoveredDate(undefined)
      return
    }
    if (dateValue < range.start) setRange({ start: dateValue, end: range.start })
    else setRange({ start: range.start, end: dateValue })
    setMonth(startOfMonth(date))
    close()
  }

  const rangeLabel = startDate && endDate ? `${formatDate(startDate)} – ${formatDate(endDate)}` : startDate ? `${formatDate(startDate)} – End date` : placeholder
  return <InputField className="pango-date-field" label={label} labelFor={inputId}><div className="pango-date-picker pango-date-range-picker" ref={rootRef}><button ref={triggerRef} id={inputId} className="pango-date-picker-trigger" type="button" disabled={disabled} aria-expanded={open} aria-controls={panelId} aria-haspopup="dialog" aria-label={!label ? 'Choose date range' : undefined} onClick={() => setOpen((current) => !current)}><CalendarDays size={16} aria-hidden="true" /><span>{rangeLabel}</span></button>{clearable && range.start && <button className="pango-date-picker-clear" type="button" aria-label="Clear date range" disabled={disabled} onClick={() => { setRange({}); setHoveredDate(undefined) }}><X size={14} /></button>}{open && <div className="pango-date-picker-panel" id={panelId} role="dialog" aria-label="Choose a date range"><CalendarGrid month={month} onMonthChange={setMonth} range={{ start: startDate, end: endDate }} previewRange={previewRange} min={min} max={max} onDayHover={setHoveredDate} onDayLeave={() => setHoveredDate(undefined)} onSelect={selectDate} /></div>}</div></InputField>
}

export function Calendar({
  value,
  defaultValue,
  onValueChange,
  month: controlledMonth,
  onMonthChange,
  min,
  max,
  defaultView = 'days',
}: {
  value?: Date
  defaultValue?: Date
  onValueChange?: (date: Date) => void
  month?: Date
  onMonthChange?: (date: Date) => void
  min?: string
  max?: string
  defaultView?: CalendarView
}) {
  const [selected, setSelected] = useControllableState<Date | undefined>({ value, defaultValue, onChange: (nextDate) => { if (nextDate) onValueChange?.(nextDate) } })
  const [uncontrolledMonth, setUncontrolledMonth] = useState(controlledMonth ?? selected ?? new Date())
  const month = controlledMonth ?? uncontrolledMonth
  const updateMonth = (nextMonth: Date) => { if (!controlledMonth) setUncontrolledMonth(nextMonth); onMonthChange?.(nextMonth) }
  return <CalendarGrid month={month} onMonthChange={updateMonth} selected={selected} min={min} max={max} defaultView={defaultView} onSelect={setSelected} />
}

type CalendarView = 'days' | 'months' | 'years'

function CalendarGrid({
  month,
  onMonthChange,
  onSelect,
  selected,
  range,
  previewRange,
  min,
  max,
  onDayHover,
  onDayLeave,
  defaultView = 'days',
}: {
  month: Date
  onMonthChange: (month: Date) => void
  onSelect: (date: Date) => void
  selected?: Date
  range?: DateRangeValueForCalendar
  previewRange?: DateRangeValueForCalendar
  min?: string
  max?: string
  onDayHover?: (date: Date) => void
  onDayLeave?: () => void
  defaultView?: CalendarView
}) {
  const calendarId = useStableId('calendar')
  const [view, setView] = useState<CalendarView>(defaultView)
  const [yearRangeStart, setYearRangeStart] = useState(() => getYearRangeStart(month.getFullYear()))
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const days = Array.from({ length: offset + daysInMonth }, (_, index) => index < offset ? undefined : new Date(month.getFullYear(), month.getMonth(), index - offset + 1))
  const selectedRange = useMemo(() => normaliseDateRange(range?.start, range?.end), [range?.end, range?.start])
  const highlightedPreview = useMemo(() => normaliseDateRange(previewRange?.start, previewRange?.end), [previewRange?.end, previewRange?.start])
  const activeYear = month.getFullYear()
  const selectMonth = (monthIndex: number) => { onMonthChange(new Date(activeYear, monthIndex, 1)); setView('days') }
  const selectYear = (year: number) => { onMonthChange(new Date(year, month.getMonth(), 1)); setView('months') }
  const dayView = <><div className="pango-calendar-header"><button type="button" aria-label="Previous month" onClick={() => onMonthChange(new Date(activeYear, month.getMonth() - 1, 1))}><ChevronLeft size={16} /></button><button className="pango-calendar-period-trigger" id={calendarId} type="button" aria-label="Choose month and year" onClick={() => { setYearRangeStart(getYearRangeStart(activeYear)); setView('months') }}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</button><button type="button" aria-label="Next month" onClick={() => onMonthChange(new Date(activeYear, month.getMonth() + 1, 1))}><ChevronRight size={16} /></button></div><div className="pango-calendar-grid" role="grid" aria-labelledby={calendarId} onMouseLeave={onDayLeave}>{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span className="pango-calendar-day-name" key={`${day}-${index}`}>{day}</span>)}{days.map((day, index) => {
    if (!day) return <span key={`blank-${index}`} />
    const value = toISODate(day)
    const isRangeStart = sameDay(day, selectedRange?.start)
    const isRangeEnd = sameDay(day, selectedRange?.end)
    const isSelected = sameDay(day, selected) || isRangeStart || isRangeEnd
    const isInRange = isDateInsideRange(day, selectedRange)
    const isPreviewStart = sameDay(day, highlightedPreview?.start)
    const isPreviewEnd = sameDay(day, highlightedPreview?.end)
    const isInPreview = isDateInsideRange(day, highlightedPreview)
    const isDisabled = Boolean((min && value < min) || (max && value > max))
    return <button type="button" key={value} role="gridcell" disabled={isDisabled} aria-selected={isSelected} className={cx(sameDay(day, new Date()) && 'is-today', isSelected && 'is-selected', isInRange && 'is-in-range', isRangeStart && 'is-range-start', isRangeEnd && 'is-range-end', isInPreview && 'is-in-preview', (isPreviewStart || isPreviewEnd) && 'is-preview-endpoint')} onMouseEnter={() => { if (!isDisabled) onDayHover?.(day) }} onFocus={() => { if (!isDisabled) onDayHover?.(day) }} onClick={() => onSelect(day)}>{day.getDate()}</button>
  })}</div></>
  const monthView = <><div className="pango-calendar-header"><button type="button" aria-label="Previous year" onClick={() => onMonthChange(new Date(activeYear - 1, month.getMonth(), 1))}><ChevronLeft size={16} /></button><button className="pango-calendar-period-trigger" id={calendarId} type="button" aria-label="Choose year" onClick={() => { setYearRangeStart(getYearRangeStart(activeYear)); setView('years') }}>{activeYear}</button><button type="button" aria-label="Next year" onClick={() => onMonthChange(new Date(activeYear + 1, month.getMonth(), 1))}><ChevronRight size={16} /></button></div><div className="pango-calendar-period-grid" role="grid" aria-labelledby={calendarId}>{Array.from({ length: 12 }, (_, monthIndex) => { const unavailable = isMonthOutsideLimits(activeYear, monthIndex, min, max); return <button type="button" key={monthIndex} role="gridcell" aria-selected={month.getMonth() === monthIndex} disabled={unavailable} className={cx(month.getMonth() === monthIndex && 'is-selected')} onClick={() => selectMonth(monthIndex)}>{new Date(activeYear, monthIndex, 1).toLocaleDateString(undefined, { month: 'short' })}</button> })}</div></>
  const yearView = <><div className="pango-calendar-header"><button type="button" aria-label="Previous twelve years" onClick={() => setYearRangeStart((year) => year - 12)}><ChevronLeft size={16} /></button><strong id={calendarId}>{yearRangeStart}–{yearRangeStart + 11}</strong><button type="button" aria-label="Next twelve years" onClick={() => setYearRangeStart((year) => year + 12)}><ChevronRight size={16} /></button></div><div className="pango-calendar-period-grid pango-calendar-year-grid" role="grid" aria-labelledby={calendarId}>{Array.from({ length: 12 }, (_, index) => { const year = yearRangeStart + index; const unavailable = isYearOutsideLimits(year, min, max); return <button type="button" key={year} role="gridcell" aria-selected={activeYear === year} disabled={unavailable} className={cx(activeYear === year && 'is-selected')} onClick={() => selectYear(year)}>{year}</button> })}</div></>
  return <div className="pango-calendar">{view === 'days' ? dayView : view === 'months' ? monthView : yearView}</div>
}

type DateRangeValueForCalendar = { start?: Date; end?: Date }

type TimeValue = { hour: number; minute: number }

function normaliseDateRange(start?: Date, end?: Date): DateRangeValueForCalendar | undefined {
  if (!start) return undefined
  if (!end) return { start }
  return start <= end ? { start, end } : { start: end, end: start }
}

function isDateInsideRange(date: Date, range?: DateRangeValueForCalendar) {
  return Boolean(range?.start && range.end && date > range.start && date < range.end)
}

function getYearRangeStart(year: number) {
  return year - (year % 12)
}

function isMonthOutsideLimits(year: number, month: number, min?: string, max?: string) {
  const firstDate = toISODate(new Date(year, month, 1))
  const lastDate = toISODate(new Date(year, month + 1, 0))
  return Boolean((min && lastDate < min) || (max && firstDate > max))
}

function isYearOutsideLimits(year: number, min?: string, max?: string) {
  return Array.from({ length: 12 }, (_, month) => isMonthOutsideLimits(year, month, min, max)).every(Boolean)
}

function parseTime(value?: string): TimeValue | undefined {
  if (!value || !/^\d{2}:\d{2}$/.test(value)) return undefined
  const [hour, minute] = value.split(':').map(Number)
  return hour < 24 && minute < 60 ? { hour, minute } : undefined
}

function toTimeValue({ hour, minute }: TimeValue) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatTime({ hour, minute }: TimeValue) {
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date(2000, 0, 1, hour, minute))
}

function normaliseMinuteStep(step: number) {
  return Math.min(60, Math.max(1, Math.round(step)))
}

function roundCurrentTime(step: number): TimeValue {
  const now = new Date()
  const roundedMinutes = Math.round(now.getMinutes() / step) * step
  return { hour: (now.getHours() + Math.floor(roundedMinutes / 60)) % 24, minute: roundedMinutes % 60 }
}

function isTimeOutsideLimits(value: string, min?: string, max?: string) {
  return Boolean((min && value < min) || (max && value > max))
}

function parseISODate(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
}

function sameDay(a?: Date, b?: Date) {
  return Boolean(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate())
}

export function AutosaveStatus({ state, updatedAt }: { state: 'saved' | 'saving' | 'error' | 'dirty'; updatedAt?: ReactNode }) {
  const copy = state === 'saved' ? 'Saved' : state === 'saving' ? 'Saving…' : state === 'dirty' ? 'Unsaved changes' : 'Could not save'
  return <span className={cx('pango-autosave', `is-${state}`)}><span />{copy}{updatedAt && state === 'saved' && <small>{updatedAt}</small>}</span>
}

export function SubmitState({ loading, children, ...props }: React.ComponentProps<typeof Button> & { loading?: boolean }) {
  return <Button {...props} loading={loading}>{children}</Button>
}
