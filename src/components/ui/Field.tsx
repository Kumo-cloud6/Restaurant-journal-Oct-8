import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-2xl border border-ink/20 bg-cream px-4 text-base text-ink placeholder:text-soy/60 transition focus-visible:border-persimmon focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-persimmon/25'

interface FieldProps {
  label: string
  hint?: string
  error?: string | null
  optional?: boolean
}

function Wrapper({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold"
      >
        {label}
        {optional && <span className="text-xs font-normal text-soy">optional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-soy">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-sm font-medium text-persimmon-deep"
        >
          {error}
        </p>
      )}
    </div>
  )
}

const describedBy = (id: string, hint?: string, error?: string | null) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined

export function Input({
  label,
  hint,
  error,
  optional,
  className,
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Wrapper id={id} {...{ label, hint, error, optional }}>
      <input
        id={id}
        className={cn(control, 'min-h-12', error && 'border-persimmon-deep', className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Wrapper>
  )
}

export function Textarea({
  label,
  hint,
  error,
  optional,
  className,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Wrapper id={id} {...{ label, hint, error, optional }}>
      <textarea
        id={id}
        className={cn(
          control,
          'min-h-24 py-3',
          error && 'border-persimmon-deep',
          className,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        {...rest}
      />
    </Wrapper>
  )
}
