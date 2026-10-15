import { AlertCircle, CheckCircle2, CircleHelp, Info, PackageOpen, TrendingDown, TrendingUp, X } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/utils'
import { Button } from './Primitives'

export function Alert({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'danger' ? AlertCircle : tone === 'warning' ? CircleHelp : Info
  return <div className={cx('pango-alert', `pango-alert-${tone}`, className)} role={tone === 'danger' ? 'alert' : 'status'}><Icon size={17} /><div>{title && <strong>{title}</strong>}<div>{children}</div></div></div>
}

export function Callout({
  title,
  children,
  action,
  tone = 'accent',
}: {
  title: ReactNode
  children: ReactNode
  action?: ReactNode
  tone?: 'accent' | 'info' | 'warning'
}) {
  return <aside className={cx('pango-callout', `pango-callout-${tone}`)}><div><span className="pango-callout-kicker">{tone === 'accent' ? 'Note' : tone}</span><h3>{title}</h3><p>{children}</p></div>{action && <div className="pango-callout-action">{action}</div>}</aside>
}

export function EmptyState({
  icon = <PackageOpen size={23} />,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: ReactNode
  description: ReactNode
  action?: ReactNode
  className?: string
}) {
  return <div className={cx('pango-empty-state', className)}><div className="pango-empty-icon">{icon}</div><h3>{title}</h3><p>{description}</p>{action && <div>{action}</div>}</div>
}

export function Progress({ value, max = 100, label, showValue = false }: { value: number; max?: number; label?: ReactNode; showValue?: boolean }) {
  const normalizedValue = Math.min(Math.max(value, 0), max)
  const percentage = (normalizedValue / max) * 100
  return <div className="pango-progress-wrap">{(label || showValue) && <div className="pango-progress-label"><span>{label}</span>{showValue && <span>{Math.round(percentage)}%</span>}</div>}<div className="pango-progress" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={normalizedValue}><span style={{ width: `${percentage}%` }} /></div></div>
}

export function Stepper({
  steps,
  current,
  onStepChange,
}: {
  steps: readonly { label: ReactNode; description?: ReactNode }[]
  current: number
  onStepChange?: (step: number) => void
}) {
  return <ol className="pango-stepper">{steps.map((step, index) => {
    const state = index < current ? 'complete' : index === current ? 'current' : 'upcoming'
    return <li className={cx(`is-${state}`)} key={index}><button type="button" disabled={!onStepChange || index > current} onClick={() => onStepChange?.(index)} aria-current={state === 'current' ? 'step' : undefined}><span>{state === 'complete' ? '✓' : index + 1}</span><div><strong>{step.label}</strong>{step.description && <small>{step.description}</small>}</div></button></li>
  })}</ol>
}

export function StatCard({
  label,
  value,
  change,
  detail,
  action,
}: {
  label: ReactNode
  value: ReactNode
  change?: { value: ReactNode; direction?: 'up' | 'down' | 'neutral' }
  detail?: ReactNode
  action?: ReactNode
}) {
  const TrendIcon = change?.direction === 'down' ? TrendingDown : TrendingUp
  return <article className="pango-stat-card"><div className="pango-stat-top"><span>{label}</span>{action}</div><strong>{value}</strong>{change && <span className={cx('pango-stat-change', `is-${change.direction ?? 'neutral'}`)}>{change.direction !== 'neutral' && <TrendIcon size={12} />}{change.value}</span>}{detail && <p>{detail}</p>}</article>
}

export function Tag({ children, onRemove, className }: { children: ReactNode; onRemove?: () => void; className?: string }) {
  return <span className={cx('pango-tag', className)}>{children}{onRemove && <button type="button" aria-label={`Remove ${String(children)}`} onClick={onRemove}><X size={12} /></button>}</span>
}

export function Money({ value, currency = 'USD', locale = 'en-US', className, ...props }: { value: number; currency?: string; locale?: string } & HTMLAttributes<HTMLSpanElement>) {
  const formatted = new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
  return <span className={cx('pango-money', className)} {...props}>{formatted}</span>
}

export function ActionEmptyState({ onCreate, noun = 'item' }: { onCreate: () => void; noun?: string }) {
  return <EmptyState title={`No ${noun}s yet`} description={`Create the first ${noun} to get this view moving.`} action={<Button onClick={onCreate}>Create {noun}</Button>} />
}
