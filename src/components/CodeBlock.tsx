import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../lib/utils'

export function CodeBlock({
  code,
  className,
  copyLabel = 'Copy code',
  description,
  label,
  language = 'tsx',
  title,
}: {
  code: string
  className?: string
  copyLabel?: string
  description?: ReactNode
  label?: ReactNode
  language?: string
  title?: ReactNode
}) {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const copyCode = async () => {
    if (!navigator.clipboard) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), 1800)
  }

  return <section className={cx('pango-code-block', className)}>
    <header className="pango-code-block-header">
      <span className="pango-code-block-label">{label ?? 'Code example'}</span>
      <div><code>{language}</code><button type="button" aria-label={copied ? 'Code copied' : copyLabel} onClick={() => void copyCode()}>{copied ? <Check size={14} /> : <Copy size={14} />}</button></div>
    </header>
    {title && <h3>{title}</h3>}
    <pre><code>{code}</code></pre>
    {description && <p>{description}</p>}
    <span className="sr-only" aria-live="polite">{copied ? 'Code copied' : ''}</span>
  </section>
}
