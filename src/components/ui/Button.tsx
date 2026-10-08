import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { cn } from '@/lib/cn'
import { buttonClass, type ButtonStyleProps } from './buttonStyles'
import { Icon } from './Icon'

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps & { loading?: boolean }
>(function Button(
  { variant, size, icon, fullWidth, loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(buttonClass({ variant, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        icon && <Icon name={icon} size={20} />
      )}
      {children}
    </button>
  )
})

export function ButtonLink({
  variant,
  size,
  icon,
  fullWidth,
  className,
  children,
  ...rest
}: LinkProps & ButtonStyleProps) {
  return (
    <Link className={cn(buttonClass({ variant, size, fullWidth }), className)} {...rest}>
      {icon && <Icon name={icon} size={20} />}
      {children}
    </Link>
  )
}
