import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, InputHTMLAttributes, ReactNode } from 'react'
import type { CountryCode } from 'libphonenumber-js'
import { cx, useControllableState, useStableId } from '../lib/utils'
import { InputField } from './Primitives'

type PhoneModule = typeof import('libphonenumber-js/min')

let phoneModulePromise: Promise<PhoneModule> | undefined

function loadPhoneModule() {
  return (phoneModulePromise ??= import('libphonenumber-js/min'))
}

export type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange'> & {
  value?: string
  defaultValue?: string
  defaultCountry?: CountryCode
  onValueChange?: (value: string) => void
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  helperText?: ReactNode
  invalid?: boolean
}

/**
 * A phone input that keeps its formatting and phone metadata out of the
 * default form entry point. The value callback emits E.164 when valid and an
 * empty string while the number is incomplete or invalid.
 */
export function PhoneInput({
  value,
  defaultValue,
  defaultCountry,
  onValueChange,
  label,
  description,
  error,
  helperText,
  invalid = false,
  id,
  className,
  autoComplete,
  disabled,
  onBlur,
  onFocus,
  ...props
}: PhoneInputProps) {
  const [canonicalValue, setCanonicalValue] = useControllableState({ value, defaultValue: defaultValue ?? '', onChange: onValueChange })
  const [displayValue, setDisplayValue] = useState(value ?? defaultValue ?? '')
  const [loading, setLoading] = useState(false)
  const inputId = useStableId('phone', id)
  const focusedRef = useRef(false)
  const requestRef = useRef(0)

  useEffect(() => {
    if (!focusedRef.current) setDisplayValue(canonicalValue)
  }, [canonicalValue])

  const format = (rawValue: string, commitValue: boolean) => {
    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setLoading(true)
    void loadPhoneModule().then(({ AsYouType }) => {
      if (requestId !== requestRef.current) return
      const formatter = new AsYouType(defaultCountry)
      const formattedValue = formatter.input(rawValue)
      setDisplayValue(formattedValue)
      if (commitValue) setCanonicalValue(formatter.isValid() ? formatter.getNumberValue() ?? '' : '')
    }).catch(() => {
      if (requestId === requestRef.current) setDisplayValue(rawValue)
    }).finally(() => {
      if (requestId === requestRef.current) setLoading(false)
    })
  }

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    focusedRef.current = true
    format(event.currentTarget.value, false)
    onFocus?.(event)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    focusedRef.current = false
    onBlur?.(event)
  }

  return <InputField className="pango-phone-field" label={label} labelFor={inputId} description={description} error={error} helperText={helperText}>
    <input
      {...props}
      id={inputId}
      className={cx('input', invalid && 'input-invalid', className)}
      type="tel"
      inputMode="tel"
      autoComplete={autoComplete ?? 'tel'}
      value={displayValue}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-busy={loading || undefined}
      onChange={(event) => {
        setDisplayValue(event.target.value)
        format(event.target.value, true)
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  </InputField>
}

