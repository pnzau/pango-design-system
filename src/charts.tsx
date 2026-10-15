import { Chart } from '@tanstack/charts/react'
import type { ChartProps } from '@tanstack/charts/react'
import type { ReactNode } from 'react'
import { cx } from './lib/utils'

export function PangoChart<TDatum>({
  title,
  description,
  summary,
  className,
  ...props
}: ChartProps<TDatum> & {
  title: ReactNode
  description?: ReactNode
  summary?: ReactNode
  className?: string
}) {
  return <figure className={cx('pango-chart', className)}><figcaption><strong>{title}</strong>{description && <span>{description}</span>}</figcaption><Chart {...props} className="pango-chart-canvas" />{summary && <div className="pango-chart-summary">{summary}</div>}</figure>
}

export function Sparkline({
  values,
  label,
  width = 120,
  height = 34,
}: {
  values: readonly number[]
  label: string
  width?: number
  height?: number
}) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = Math.max(max - min, 1)
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * width},${height - ((value - min) / range) * height}`).join(' ')
  return <svg className="pango-sparkline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}><polyline fill="none" points={points} /></svg>
}

export function ChartLegend({ items }: { items: readonly { label: ReactNode; color: string; value?: ReactNode }[] }) {
  return <ul className="pango-chart-legend">{items.map((item, index) => <li key={index}><span style={{ background: item.color }} /><span>{item.label}</span>{item.value && <strong>{item.value}</strong>}</li>)}</ul>
}
