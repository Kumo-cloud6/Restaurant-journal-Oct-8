import { useEffect, type ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  useEffect(() => {
    document.title = `${title} · Restaurant Journal`
  }, [title])

  return (
    <header className="mb-6 flex items-end justify-between gap-4 md:mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="label-caps mb-2 text-persimmon-deep">{eyebrow}</p>}
        <h1 className="text-[2.25rem] leading-[1.05] font-medium md:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-prose text-soy">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
