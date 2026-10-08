import type { IconName } from '@/components/ui/Icon'

export interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

export const navItems: NavItem[] = [
  { to: '/', label: 'Discover', icon: 'compass', end: true },
  { to: '/journal', label: 'Journal', icon: 'book' },
  { to: '/add', label: 'Add', icon: 'plus' },
  { to: '/circle', label: 'Circle', icon: 'users' },
  { to: '/profile', label: 'Profile', icon: 'user' },
]
