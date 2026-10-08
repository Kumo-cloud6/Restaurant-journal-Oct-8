import { NavLink } from 'react-router-dom'
import { buttonClass } from '@/components/ui/buttonStyles'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { navItems } from './navItems'
import { Wordmark } from './Wordmark'

/** Navigation rail for tablet / desktop (>= md). */
export function SideNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-line bg-cream/70 px-4 py-8 backdrop-blur md:flex lg:w-64 lg:px-6">
      <Wordmark className="mb-10 rounded-lg px-2" />
      <nav aria-label="Primary" className="flex-1">
        <ul className="space-y-1">
          {navItems
            .filter((i) => i.icon !== 'plus')
            .map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-11 items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition',
                      isActive
                        ? 'bg-ink text-cream'
                        : 'text-soy hover:bg-ink/5 hover:text-ink',
                    )
                  }
                >
                  <Icon name={item.icon} size={22} />
                  {item.label}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>
      <NavLink to="/add" className={buttonClass({ size: 'lg', fullWidth: true })}>
        <Icon name="plus" size={20} />
        Add to journal
      </NavLink>
    </aside>
  )
}
