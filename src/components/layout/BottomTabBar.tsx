import { NavLink } from 'react-router-dom'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { navItems } from './navItems'

/** Mobile navigation (< md). The Add tab is raised as the primary action. */
export function BottomTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-1">
        {navItems.map((item) => (
          <li key={item.to} className="flex justify-center">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 min-w-14 flex-col items-center justify-center gap-0.5 text-[0.6875rem] font-medium transition',
                  item.icon === 'plus'
                    ? '-mt-5 text-ink'
                    : isActive
                      ? 'text-persimmon-deep'
                      : 'text-soy hover:text-ink',
                )
              }
            >
              {({ isActive }) =>
                item.icon === 'plus' ? (
                  <>
                    <span
                      className={cn(
                        'grid size-14 place-items-center rounded-full bg-persimmon text-cream shadow-[var(--shadow-float)] ring-4 ring-paper transition',
                        isActive && 'bg-persimmon-deep',
                      )}
                    >
                      <Icon name="plus" size={28} />
                    </span>
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  <>
                    <Icon name={item.icon} size={24} filled={false} />
                    <span className={cn(isActive && 'font-semibold')}>{item.label}</span>
                  </>
                )
              }
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
