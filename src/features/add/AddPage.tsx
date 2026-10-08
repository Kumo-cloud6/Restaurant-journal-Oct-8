import { useSearchParams } from 'react-router-dom'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/layout/PageHeader'
import { Tabs } from '@/components/ui/Tabs'
import { panelId, tabId } from '@/components/ui/tabIds'
import { LogMealForm } from './LogMealForm'
import { SaveSpotForm } from './SaveSpotForm'

type Mode = 'log' | 'save'

export function AddPage() {
  const [params, setParams] = useSearchParams()
  const mode: Mode = params.get('mode') === 'save' ? 'save' : 'log'

  const setMode = (next: Mode) => {
    const p = new URLSearchParams()
    p.set('mode', next)
    // Keep a prefilled place only for logging.
    const placeId = params.get('placeId')
    if (next === 'log' && placeId) p.set('placeId', placeId)
    setParams(p, { replace: true })
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        eyebrow="Add"
        title={mode === 'log' ? 'Log a meal' : 'Save a spot'}
        description={
          mode === 'log'
            ? 'Photo first, a few taps, done.'
            : 'Found something on TikTok or Instagram? Park it here.'
        }
      />
      <Tabs
        group="add"
        label="What would you like to add?"
        value={mode}
        onChange={setMode}
        tabs={[
          { id: 'log', label: 'Log a meal' },
          { id: 'save', label: 'Save a spot' },
        ]}
        className="mb-8 w-full"
      />
      <div role="tabpanel" id={panelId('add', mode)} aria-labelledby={tabId('add', mode)}>
        {mode === 'log' ? <LogMealForm /> : <SaveSpotForm />}
      </div>
    </PageContainer>
  )
}
