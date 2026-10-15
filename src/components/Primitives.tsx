import { Children, isValidElement, useEffect, useMemo, useRef, useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { Check, ChevronDown, LoaderCircle } from 'lucide-react'
import { cx, useControllableState, useEscapeKey, useOutsidePointer, useStableId } from '../lib/utils'

export type ControlSize = 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'outline' | 'soft' | 'ghost'
  size?: ControlSize
  icon?: ReactNode
  iconAfter?: ReactNode
  loading?: boolean
}

export function Button({
  children,
  variant = 'solid',
  size = 'md',
  icon,
  iconAfter,
  loading = false,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <LoaderCircle className="spin" size={15} aria-hidden="true" /> : icon}
      {children && <span>{children}</span>}
      {iconAfter}
    </button>
  )
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> & {
  label: string
  size?: ControlSize
  tone?: 'default' | 'soft'
  children: ReactNode
}

export function IconButton({ label, size = 'md', tone = 'default', className = '', children, ...props }: IconButtonProps) {
  return (
    <button
      className={`icon-button icon-button-${size} icon-button-${tone} ${className}`}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'blue' | 'violet' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function StatusChip({
  children,
  tone = 'neutral',
  dot = true,
}: {
  children: ReactNode
  tone?: 'success' | 'warning' | 'danger' | 'info' | 'slate' | 'neutral'
  dot?: boolean
}) {
  return (
    <span className={`status-chip status-${tone}`}>
      {dot && <span className="status-dot" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function Avatar({ name, initials, tone = 'green', size = 'md' }: { name?: string; initials?: string; tone?: string; size?: 'sm' | 'md' | 'lg' }) {
  const label = name ?? initials ?? 'User'
  const visibleInitials = initials ?? name?.split(' ').map((part) => part[0]).join('').slice(0, 2) ?? 'U'
  return (
    <span className={`avatar avatar-${size} avatar-${tone}`} aria-label={label} title={label}>
      {visibleInitials.toUpperCase()}
    </span>
  )
}

export function InputField({
  action,
  children,
  className,
  description,
  error,
  helperText,
  label,
  labelFor,
}: {
  action?: ReactNode
  children: ReactNode
  className?: string
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  label?: ReactNode
  labelFor?: string
}) {
  return <div className={cx('pango-input-field', className)}>
    {(label || action) && <div className="pango-input-field-heading">{label && (labelFor ? <label className="field-label" htmlFor={labelFor}>{label}</label> : <span className="field-label">{label}</span>)}{action && <span className="pango-input-field-action">{action}</span>}</div>}
    {description && <p className="pango-input-field-description">{description}</p>}
    {children}
    {error ? <p className="field-hint field-hint-invalid" role="alert">{error}</p> : helperText && <p className="field-hint">{helperText}</p>}
  </div>
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  action?: ReactNode
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  label?: ReactNode
  hint?: ReactNode
  invalid?: boolean
}

export function Input({ action, description, error, helperText, label, hint, invalid = false, id, className = '', ...props }: InputProps) {
  const inputId = id ?? (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined)
  const errorMessage = error ?? (invalid ? hint : undefined)
  const helper = invalid ? helperText : helperText ?? hint
  const control = <input id={inputId} className={cx('input', invalid && 'input-invalid', className)} aria-invalid={invalid || undefined} {...props} />
  if (!label && !description && !errorMessage && !helper && !action) return control
  return <InputField action={action} description={description} error={errorMessage} helperText={helper} label={label} labelFor={inputId}>{control}</InputField>
}

export type SelectMenuOption = { value: string; label: ReactNode; disabled?: boolean }

type SelectProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'defaultValue' | 'onChange' | 'value'> & {
  action?: ReactNode
  children?: ReactNode
  defaultValue?: string
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  label?: ReactNode
  onValueChange?: (value: string) => void
  options?: readonly SelectMenuOption[]
  placeholder?: ReactNode
  value?: string
}

export function Select({
  action,
  children,
  className,
  defaultValue,
  description,
  disabled = false,
  error,
  helperText,
  id,
  label,
  onKeyDown,
  onValueChange,
  options,
  placeholder = 'Select an option',
  value,
  ...props
}: SelectProps) {
  const selectId = useStableId('select', id)
  const optionList = useMemo(() => options ?? optionsFromChildren(children), [children, options])
  const [selected, setSelected] = useControllableState({ value, defaultValue: defaultValue ?? '', onChange: onValueChange })
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => selectableIndex(optionList, optionList.findIndex((option) => option.value === (value ?? defaultValue))))
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const selectedOption = optionList.find((option) => option.value === selected)
  const activeOption = optionList[activeIndex]

  const close = (restoreFocus = false) => {
    setOpen(false)
    if (restoreFocus) window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  useOutsidePointer(open, [rootRef], () => setOpen(false))
  useEscapeKey(open, () => close(true))

  useEffect(() => {
    if (open) setActiveIndex(selectableIndex(optionList, optionList.findIndex((option) => option.value === selected)))
  }, [open, optionList, selected])

  useEffect(() => {
    if (!open || activeIndex < 0) return
    listRef.current?.querySelector<HTMLElement>(`[data-select-option="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, open, selectId])

  const selectOption = (index: number) => {
    const option = optionList[index]
    if (!option || option.disabled) return
    setSelected(option.value)
    close(true)
  }

  const moveActive = (direction: 1 | -1) => {
    const nextIndex = nextSelectableIndex(optionList, activeIndex, direction)
    if (nextIndex >= 0) setActiveIndex(nextIndex)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) setOpen(true)
      moveActive(event.key === 'ArrowDown' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      const ordered = optionList.map((_, index) => index).filter((index) => !optionList[index]?.disabled)
      setActiveIndex(event.key === 'Home' ? ordered[0] ?? -1 : ordered.at(-1) ?? -1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) selectOption(activeIndex)
      else setOpen(true)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close(true)
    }
    onKeyDown?.(event)
  }

  return <InputField action={action} description={description} error={error} helperText={helperText} label={label} labelFor={selectId}>
    <div className="pango-select" ref={rootRef}>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        className={cx('pango-select-trigger', className)}
        aria-activedescendant={open && activeOption ? `${selectId}-option-${activeIndex}` : undefined}
        aria-controls={`${selectId}-listbox`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={Boolean(error) || undefined}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <span>{selectedOption?.label ?? placeholder}</span><ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && <div ref={listRef} id={`${selectId}-listbox`} className="pango-select-menu" role="listbox" aria-label={label ? undefined : 'Select an option'}>
        {optionList.map((option, index) => <button id={`${selectId}-option-${index}`} key={option.value} type="button" role="option" data-select-option={index} aria-selected={option.value === selected} className={cx(index === activeIndex && 'is-active')} disabled={option.disabled} onMouseEnter={() => setActiveIndex(index)} onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption(index)}><span>{option.label}</span>{option.value === selected && <Check size={15} aria-hidden="true" />}</button>)}
      </div>}
    </div>
  </InputField>
}

function optionsFromChildren(children: ReactNode): SelectMenuOption[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement<{ children?: ReactNode; disabled?: boolean; value?: string | number }>(child) || child.type !== 'option') return []
    return [{ value: String(child.props.value ?? child.props.children), label: child.props.children, disabled: child.props.disabled }]
  })
}

function selectableIndex(options: readonly SelectMenuOption[], preferredIndex: number) {
  if (preferredIndex >= 0 && !options[preferredIndex]?.disabled) return preferredIndex
  return options.findIndex((option) => !option.disabled)
}

function nextSelectableIndex(options: readonly SelectMenuOption[], currentIndex: number, direction: 1 | -1) {
  const enabledIndexes = options.map((option, index) => option.disabled ? -1 : index).filter((index) => index >= 0)
  if (!enabledIndexes.length) return -1
  const currentPosition = enabledIndexes.indexOf(currentIndex)
  return enabledIndexes[(currentPosition + direction + enabledIndexes.length) % enabledIndexes.length] ?? -1
}

export function CheckRow({ label, detail, checked, onChange }: { label: string; detail?: string; checked?: boolean; onChange?: (checked: boolean) => void }) {
  return (
    <label className="check-row">
      <input type="checkbox" checked={checked} onChange={(event) => onChange?.(event.target.checked)} />
      <span className="check-box" aria-hidden="true"><Check size={13} strokeWidth={3} /></span>
      <span className="check-copy">
        <span className="check-label">{label}</span>
        {detail && <span className="check-detail">{detail}</span>}
      </span>
    </label>
  )
}

export function Divider() {
  return <div className="divider" role="presentation" />
}

export function Surface({ children, className = '', as: Element = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <Element className={`surface ${className}`}>{children}</Element>
}
