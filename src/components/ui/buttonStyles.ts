import { cn } from '@/lib/cn'
import type { IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'matcha'
type Size = 'md' | 'lg'

const base =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary: 'bg-persimmon text-cream shadow-sm hover:bg-persimmon-deep',
  matcha: 'bg-matcha text-cream shadow-sm hover:bg-matcha-deep',
  secondary: 'border border-ink/25 bg-cream text-ink hover:border-ink/50 hover:bg-white',
  ghost: 'text-ink hover:bg-ink/5',
}

const sizes: Record<Size, string> = {
  md: 'px-5 text-[0.9375rem]',
  lg: 'min-h-12 px-7 text-base',
}

export interface ButtonStyleProps {
  variant?: Variant
  size?: Size
  icon?: IconName
  fullWidth?: boolean
}

export const buttonClass = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
}: ButtonStyleProps) => cn(base, variants[variant], sizes[size], fullWidth && 'w-full')
