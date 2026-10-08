import { db } from '@/mocks/db'
import { ApiError } from './errors'
import { buildSummary } from './internal'
import type { ParsedLink } from './models'
import { simulate } from './mockRuntime'

function hostOf(raw: string): URL | null {
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }
}

const hash = (s: string) =>
  [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0, 7)

const CAPTIONS = [
  'obsessed with this spot 😍 you need to try the signature dish',
  'hidden gem alert — the line was worth it',
  'POV: the best thing you’ll eat in Boston this month',
]

/**
 * MOCK link parsing. A real implementation would call a server function that resolves the
 * post's caption/location. Here: known demo links map to their place, any other TikTok/Instagram
 * URL deterministically maps to one of the not-yet-visited places.
 */
export async function parseSocialLink(rawUrl: string): Promise<ParsedLink> {
  return simulate(() => {
    const url = hostOf(rawUrl.trim())
    const host = url?.hostname.replace(/^www\./, '') ?? ''
    const platform = host.endsWith('tiktok.com')
      ? 'tiktok'
      : host.endsWith('instagram.com')
        ? 'instagram'
        : null
    if (!url || !platform) {
      throw new ApiError(
        'invalid_input',
        'That doesn’t look like a TikTok or Instagram link.',
      )
    }
    const normalized = url.toString()
    const known = db.places.find(
      (p) => p.source_url && normalized.startsWith(p.source_url),
    )
    const candidates = db.places.filter((p) => p.social_buzz > 0)
    const place = known ?? candidates[hash(normalized) % candidates.length]!
    const creator =
      platform === 'tiktok'
        ? (url.pathname.split('/')[1]?.replace('@', '') ?? 'foodie')
        : `eats_${(hash(normalized) % 900) + 100}`
    return {
      platform,
      url: normalized,
      creator: creator || 'foodie',
      caption: CAPTIONS[hash(normalized) % CAPTIONS.length]!,
      place,
      summary: buildSummary(place),
    }
  }, 900)
}
