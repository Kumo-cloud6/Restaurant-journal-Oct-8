import type { ExperienceTag } from '@/types'
import { db } from '@/mocks/db'
import { simulate } from './mockRuntime'

export async function getExperienceTags(): Promise<ExperienceTag[]> {
  return simulate(() => [...db.experienceTags], 150)
}
