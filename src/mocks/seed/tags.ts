import type { ExperienceTag } from '@/types'

const t = (slug: string, label: string): ExperienceTag => ({
  id: `t-${slug}`,
  created_at: '2026-01-01T00:00:00Z',
  slug,
  label,
})

export const experienceTags: ExperienceTag[] = [
  t('beautiful-space', 'Beautiful space'),
  t('great-plating', 'Great plating'),
  t('thoughtful-service', 'Thoughtful service'),
  t('cozy-for-groups', 'Cozy for groups'),
  t('good-cafe-after', 'Good cafe after'),
  t('authentic', 'Authentic'),
  t('creative-menu', 'Creative menu'),
  t('hidden-gem', 'Hidden gem'),
]
