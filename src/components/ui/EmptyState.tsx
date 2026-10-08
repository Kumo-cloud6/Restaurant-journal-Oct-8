import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

export function EmptyState({
  icon = 'sparkle',
  title,
  children,
  action,
}: {
  icon?: IconName
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-6 py-14 text-center">
      <span className="mb-5 grid size-16 place-items-center rounded-full bg-miso-soft text-miso">
        <Icon name={icon} size={30} />
      </span>
      <h2 className="text-2xl">{title}</h2>
      {children && <p className="mt-2 text-soy">{children}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
