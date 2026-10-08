import { Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AddPage } from '@/features/add/AddPage'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { WelcomePage } from '@/features/auth/WelcomePage'
import { CirclePage } from '@/features/circle/CirclePage'
import { JournalPage } from '@/features/journal/JournalPage'
import { DiscoverPage } from '@/features/places/DiscoverPage'
import { PlaceDetailPage } from '@/features/places/PlaceDetailPage'
import { ProfilePage } from '@/features/profile/ProfilePage'
import { NotFoundPage } from './NotFoundPage'
import { Providers } from './providers'

export function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route index element={<DiscoverPage />} />
            <Route path="places/:placeId" element={<PlaceDetailPage />} />
            <Route path="add" element={<AddPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="circle" element={<CirclePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Providers>
  )
}
