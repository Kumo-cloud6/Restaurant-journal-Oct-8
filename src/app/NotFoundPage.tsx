import { PageContainer } from '@/components/layout/PageContainer'
import { ButtonLink } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

export function NotFoundPage() {
  return (
    <PageContainer width="narrow">
      <EmptyState
        icon="compass"
        title="This page wandered off"
        action={
          <ButtonLink to="/" icon="compass">
            Back to Discover
          </ButtonLink>
        }
      >
        We couldn’t find what you were looking for.
      </EmptyState>
    </PageContainer>
  )
}
