import { Keyboard } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatForDisplay, HotkeysProvider, useHotkey } from '@tanstack/react-hotkeys'
import { Dialog } from './components/Overlays'
import { cx } from './lib/utils'

export { HotkeysProvider, useHotkey }

export function useProductHotkey(hotkey: string, callback: () => void, enabled = true) {
  useHotkey(hotkey as Parameters<typeof useHotkey>[0], callback, { enabled })
}

export function ShortcutHint({ hotkey, className }: { hotkey: string; className?: string }) {
  const display = formatForDisplay(hotkey)
  const parts = Array.isArray(display) ? display : display.split('')
  return <kbd className={cx('pango-shortcut-hint', className)} aria-label={hotkey}>{parts.map((part, index) => <span key={`${part}-${index}`}>{part}</span>)}</kbd>
}

export type ShortcutDefinition = { keys: string; label: ReactNode; group?: string }

export function ShortcutHelpDialog({
  open,
  onOpenChange,
  shortcuts,
  title = 'Keyboard shortcuts',
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: readonly ShortcutDefinition[]
  title?: string
}) {
  const groups = shortcuts.reduce<Record<string, ShortcutDefinition[]>>((all, shortcut) => {
    const group = shortcut.group ?? 'General'
    all[group] ??= []
    all[group].push(shortcut)
    return all
  }, {})
  return <Dialog open={open} onOpenChange={onOpenChange} title={title} description="Shortcuts follow the operating system’s Command or Control convention." className="pango-shortcuts-dialog"><div className="pango-shortcuts-intro"><Keyboard size={16} />Press these keys anywhere a shortcut applies.</div>{Object.entries(groups).map(([group, groupShortcuts]) => <section className="pango-shortcuts-group" key={group}><h3>{group}</h3>{groupShortcuts.map((shortcut) => <div key={shortcut.keys}><span>{shortcut.label}</span><ShortcutHint hotkey={shortcut.keys} /></div>)}</section>)}</Dialog>
}
