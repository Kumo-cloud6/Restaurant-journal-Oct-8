import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomTabBar } from './BottomTabBar'
import { SideNav } from './SideNav'

export function AppShell() {
  const { pathname } = useLocation()

  // Reset scroll on navigation and move focus to the page so screen readers announce the change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SideNav />
      <main
        id="main"
        tabIndex={-1}
        className="pb-28 outline-none md:pb-0 md:pl-56 lg:pl-64"
      >
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  )
}
