import type { ExperienceTag } from '@/types'
import { loadSnapshot } from './snapshot'

export async function getExperienceTags(): Promise<ExperienceTag[]> {
  return (await loadSnapshot()).tags
}
