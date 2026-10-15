import { useEffect, useId, useRef, useState } from 'react'
import type { Dispatch, RefObject, SetStateAction } from 'react'

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ')
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}): [T, Dispatch<SetStateAction<T>>] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const resolvedValue = isControlled ? value : uncontrolledValue

  const setValue: Dispatch<SetStateAction<T>> = (next) => {
    const nextValue = typeof next === 'function' ? (next as (previous: T) => T)(resolvedValue) : next
    if (!isControlled) setUncontrolledValue(nextValue)
    onChange?.(nextValue)
  }

  return [resolvedValue, setValue]
}

export function useStableId(prefix: string, providedId?: string) {
  const generatedId = useId()
  return providedId ?? `${prefix}-${generatedId.replace(/:/g, '')}`
}

export function useOutsidePointer(
  open: boolean,
  refs: Array<RefObject<HTMLElement | null>>,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (refs.some((ref) => ref.current?.contains(target))) return
      onDismiss()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [onDismiss, open, refs])
}

export function useEscapeKey(open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onDismiss, open])
}

export function usePrevious<T>(value: T) {
  const ref = useRef<T | undefined>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
