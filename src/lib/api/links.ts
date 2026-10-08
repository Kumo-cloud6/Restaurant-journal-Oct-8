import { ApiError } from './errors'
import { buildSummary } from './internal'
import type { ParsedLink } from './models'
import { loadSnapshot } from './snapshot'

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
 * STILL MOCKED: real social-link scraping is out of scope. Known links in the `places` table
 * (source_url) resolve to their place; any other TikTok/Instagram URL deterministically maps to
 * one of the places with online buzz. Replace with an Edge Function that resolves the post.
 */
export async function parseSocialLink(rawUrl: string): Promise<ParsedLink> {
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

  const s = await loadSnapshot()
  const normalized = url.toString()
  const candidates = s.places.filter((p) => p.social_buzz > 0)
  const place =
    s.places.find((p) => p.source_url && normalized.startsWith(p.source_url)) ??
    candidates[hash(normalized) % Math.max(candidates.length, 1)] ??
    s.places[0]
  if (!place) throw new ApiError('not_found', 'There are no places to match yet.')

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
    summary: buildSummary(s, place),
  }
}
