import { Check, CircleAlert, LoaderCircle, Minus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type {
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react'
import { cx, useControllableState, useStableId } from '../lib/utils'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx('pango-label', className)} {...props} />
}

export function Textarea({
  className,
  invalid = false,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return <textarea className={cx('pango-textarea', invalid && 'is-invalid', className)} aria-invalid={invalid || undefined} {...props} />
}

export function Checkbox({
  label,
  description,
  className,
  id,
  indeterminate = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: ReactNode; description?: ReactNode; indeterminate?: boolean }) {
  const inputId = useStableId('checkbox', id)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { if (inputRef.current) inputRef.current.indeterminate = indeterminate }, [indeterminate])
  const input = <input ref={inputRef} id={inputId} className={cx('pango-checkbox-input', className)} type="checkbox" aria-checked={indeterminate ? 'mixed' : undefined} {...props} />
  if (!label) return <Label className="pango-check-control pango-check-control-standalone" htmlFor={inputId}>{input}<span className="pango-check-indicator"><Check className="pango-check-icon" size={13} strokeWidth={3} /><Minus className="pango-check-minus" size={13} strokeWidth={3} /></span></Label>
  return (
    <Label className="pango-check-control" htmlFor={inputId}>
      {input}
      <span className="pango-check-indicator"><Check className="pango-check-icon" size={12} strokeWidth={3} /><Minus className="pango-check-minus" size={12} strokeWidth={3} /></span>
      <span className="pango-check-copy"><span>{label}</span>{description && <small>{description}</small>}</span>
    </Label>
  )
}

export type RadioOption<T extends string> = { value: T; label: ReactNode; description?: ReactNode; disabled?: boolean }

export function RadioGroup<T extends string>({
  options,
  value,
  defaultValue,
  onValueChange,
  name,
  className,
  label,
}: {
  options: readonly RadioOption<T>[]
  value?: T
  defaultValue?: T
  onValueChange?: (value: T) => void
  name: string
  className?: string
  label?: ReactNode
}) {
  const [selected, setSelected] = useControllableState<T>({ value, defaultValue: defaultValue ?? options[0]?.value, onChange: onValueChange })
  return (
    <fieldset className={cx('pango-radio-group', className)}>
      {label && <legend>{label}</legend>}
      {options.map((option) => {
        const optionId = `${name}-${option.value}`
        return (
          <Label className="pango-radio-control" htmlFor={optionId} key={option.value}>
            <input
              id={optionId}
              name={name}
              type="radio"
              value={option.value}
              checked={selected === option.value}
              disabled={option.disabled}
              onChange={() => setSelected(option.value)}
            />
            <span className="pango-radio-indicator" aria-hidden="true" />
            <span className="pango-check-copy"><span>{option.label}</span>{option.description && <small>{option.description}</small>}</span>
          </Label>
        )
      })}
    </fieldset>
  )
}

export function CheckboxCard({
  checked,
  defaultChecked = false,
  description,
  disabled = false,
  label,
  onCheckedChange,
  value,
}: {
  checked?: boolean
  defaultChecked?: boolean
  description?: ReactNode
  disabled?: boolean
  label: ReactNode
  onCheckedChange?: (checked: boolean) => void
  value?: ReactNode
}) {
  const [isChecked, setIsChecked] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange })
  const id = useStableId('checkbox-card')
  return <Label className={cx('pango-choice-card', isChecked && 'is-selected', disabled && 'is-disabled')} htmlFor={id}><input id={id} type="checkbox" checked={isChecked} disabled={disabled} onChange={(event) => setIsChecked(event.target.checked)} /><span className="pango-choice-card-indicator"><Check size={13} strokeWidth={3} /></span><span className="pango-choice-card-copy"><strong>{label}</strong>{description && <small>{description}</small>}</span>{value && <span className="pango-choice-card-value">{value}</span>}</Label>
}

export function RadioCard({
  checked,
  description,
  disabled = false,
  label,
  name,
  onCheckedChange,
  value,
}: {
  checked: boolean
  description?: ReactNode
  disabled?: boolean
  label: ReactNode
  name: string
  onCheckedChange?: (checked: boolean) => void
  value: string
}) {
  const id = useStableId('radio-card')
  return <Label className={cx('pango-choice-card', checked && 'is-selected', disabled && 'is-disabled')} htmlFor={id}><input id={id} type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={(event) => onCheckedChange?.(event.target.checked)} /><span className="pango-choice-card-indicator" /><span className="pango-choice-card-copy"><strong>{label}</strong>{description && <small>{description}</small>}</span></Label>
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  label,
  description,
  id,
  className,
}: {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  label?: ReactNode
  description?: ReactNode
  id?: string
  className?: string
}) {
  const switchId = useStableId('switch', id)
  const [isChecked, setIsChecked] = useControllableState({ value: checked, defaultValue: defaultChecked, onChange: onCheckedChange })
  const control = (
    <button
      id={switchId}
      className={cx('pango-switch', isChecked && 'is-checked', className)}
      type="button"
      role="switch"
      aria-checked={isChecked}
      disabled={disabled}
      onClick={() => setIsChecked((previous) => !previous)}
    >
      <span />
    </button>
  )
  if (!label) return control
  return <div className="pango-switch-row"><Label htmlFor={switchId} className="pango-check-copy"><span>{label}</span>{description && <small>{description}</small>}</Label>{control}</div>
}

export function Separator({ orientation = 'horizontal', className, ...props }: HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }) {
  return <div className={cx('pango-separator', `pango-separator-${orientation}`, className)} role="separator" aria-orientation={orientation} {...props} />
}

export function Skeleton({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return <span className={cx('pango-skeleton', className)} aria-label={label} role="status" />
}

export function Spinner({ label = 'Loading', size = 'md' }: { label?: string; size?: 'sm' | 'md' | 'lg' }) {
  return <span className={cx('pango-spinner', `pango-spinner-${size}`)} role="status" aria-label={label}><LoaderCircle /></span>
}

export function Tooltip({
  content,
  children,
  delay = 300,
}: {
  content: ReactNode
  children: ReactNode
  delay?: number
}) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<number | null>(null)
  const tooltipId = useStableId('tooltip')
  const clearTimer = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = null
  }
  const showAfterDelay = () => {
    clearTimer()
    timerRef.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    clearTimer()
    setOpen(false)
  }
  useEffect(() => clearTimer, [])

  return (
    <span className="pango-tooltip-trigger" onMouseEnter={showAfterDelay} onMouseLeave={hide} onFocus={() => { clearTimer(); setOpen(true) }} onBlur={hide} aria-describedby={open ? tooltipId : undefined}>
      {children}
      {open && <span className="pango-tooltip" id={tooltipId} role="tooltip">{content}</span>}
    </span>
  )
}

export function Card({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cx('pango-card', className)} {...props}>{children}</section>
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('pango-card-header', className)} {...props}>{children}</div>
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cx('pango-card-title', className)} {...props}>{children}</h3>
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cx('pango-card-description', className)} {...props}>{children}</p>
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('pango-card-content', className)} {...props}>{children}</div>
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('pango-card-footer', className)} {...props}>{children}</div>
}

export function ValidationMessage({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <p className="pango-validation-message" role="alert"><CircleAlert size={14} /> {children}</p>
}
