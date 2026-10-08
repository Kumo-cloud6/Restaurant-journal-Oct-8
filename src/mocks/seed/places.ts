import type { Place } from '@/types'
import { photo, type PlateKind } from '../photos'

interface PlaceSeed {
  slug: string
  name: string
  /** Free-text specialty, e.g. "Lanzhou noodles". */
  cuisine: string
  kind: Place['kind']
  address: string
  neighborhood: string
  lat: number
  lng: number
  price: Place['price_level']
  description: string
  hero: PlateKind
  buzz: number
  sourceUrl?: string
}

const seeds: PlaceSeed[] = [
  {
    slug: 'mulan-noodle-bar',
    name: 'Mulan Noodle Bar',
    cuisine: 'Lanzhou noodles',
    kind: 'restaurant',
    address: '14 Tyler St, Boston, MA 02111',
    neighborhood: 'Chinatown',
    lat: 42.3512,
    lng: -71.0618,
    price: 2,
    description:
      'A narrow room where noodles are pulled to order at the window. The beef broth is clear, aromatic and takes a full day.',
    hero: 'bowl',
    buzz: 480000,
    sourceUrl: 'https://www.tiktok.com/@bostonnoodles/video/7391',
  },
  {
    slug: 'kohi-kissa',
    name: 'Kōhī Kissa',
    cuisine: 'Japanese kissaten',
    kind: 'cafe',
    address: '212 Shawmut Ave, Boston, MA 02118',
    neighborhood: 'South End',
    lat: 42.3441,
    lng: -71.0702,
    price: 2,
    description:
      'A hushed, wood-panelled coffee house in the Showa tradition: siphon coffee, thick-cut toast and a proper napolitan.',
    hero: 'cup',
    buzz: 120000,
  },
  {
    slug: 'lantern-and-lotus',
    name: 'Lantern & Lotus',
    cuisine: 'Cantonese dim sum',
    kind: 'restaurant',
    address: '70 Beach St, Boston, MA 02111',
    neighborhood: 'Chinatown',
    lat: 42.3504,
    lng: -71.0613,
    price: 2,
    description:
      'Weekend carts, round tables and a long banquet room made for big groups. Go early; the har gow sells out.',
    hero: 'steamer',
    buzz: 90000,
  },
  {
    slug: 'tao-tea-house',
    name: 'Tāo Tea House',
    cuisine: 'Taiwanese tea & small plates',
    kind: 'cafe',
    address: '9 Holyoke Ct, Cambridge, MA 02138',
    neighborhood: 'Harvard Square',
    lat: 42.3732,
    lng: -71.1189,
    price: 2,
    description:
      'Gongfu tea service on low tables, scallion pancakes and braised pork rice. Staff will walk you through every pour.',
    hero: 'cup',
    buzz: 15000,
  },
  {
    slug: 'seoul-hearth',
    name: 'Seoul Hearth',
    cuisine: 'Korean home cooking',
    kind: 'restaurant',
    address: '1120 Commonwealth Ave, Allston, MA 02134',
    neighborhood: 'Allston',
    lat: 42.3512,
    lng: -71.1316,
    price: 2,
    description:
      'Bubbling stews, a dozen banchan that change weekly, and a grandmother-approved kimchi jjigae.',
    hero: 'plate',
    buzz: 60000,
  },
  {
    slug: 'banh-and-brew',
    name: 'Bánh & Brew',
    cuisine: 'Vietnamese cafe',
    kind: 'cafe',
    address: '88 Brookline Ave, Boston, MA 02215',
    neighborhood: 'Fenway',
    lat: 42.3452,
    lng: -71.1006,
    price: 1,
    description:
      'Crackly baguettes, cà phê sữa đá made with chicory-forward robusta, and a sunny corner for laptops.',
    hero: 'space',
    buzz: 30000,
  },
  {
    slug: 'matcha-month-club',
    name: 'Matcha Month Club',
    cuisine: 'Matcha bar',
    kind: 'cafe',
    address: '301 Newbury St, Boston, MA 02115',
    neighborhood: 'Back Bay',
    lat: 42.3488,
    lng: -71.0865,
    price: 2,
    description:
      'Ceremonial-grade matcha in pastel cups, with a monthly rotating flight. Currently all over the feed.',
    hero: 'cup',
    buzz: 2100000,
    sourceUrl: 'https://www.instagram.com/reel/Cx9matcha/',
  },
  {
    slug: 'silk-road-szechuan',
    name: 'Silk Road Szechuan',
    cuisine: 'Sichuan',
    kind: 'restaurant',
    address: '45 Union Sq, Somerville, MA 02143',
    neighborhood: 'Union Square',
    lat: 42.3794,
    lng: -71.0953,
    price: 2,
    description:
      'Mala numbing heat, dry-fried green beans and a viral "volcano" fish pot. The line is real.',
    hero: 'plate',
    buzz: 870000,
    sourceUrl: 'https://www.tiktok.com/@somervillesnacks/video/6522',
  },
  {
    slug: 'saigon-alley',
    name: 'Saigon Alley',
    cuisine: 'Vietnamese',
    kind: 'restaurant',
    address: '1501 Dorchester Ave, Dorchester, MA 02122',
    neighborhood: 'Fields Corner',
    lat: 42.3009,
    lng: -71.0616,
    price: 1,
    description:
      'A family-run counter with a handwritten menu. Nobody in the app has logged it yet. Be the first from your circle.',
    hero: 'bowl',
    buzz: 0,
  },
  {
    slug: 'ume-counter',
    name: 'Ume Counter',
    cuisine: 'Japanese small plates',
    kind: 'restaurant',
    address: '620 Massachusetts Ave, Cambridge, MA 02139',
    neighborhood: 'Central Square',
    lat: 42.3651,
    lng: -71.1039,
    price: 3,
    description:
      'Twelve seats around an open kitchen. A quiet, meticulous chef’s-choice progression of seasonal small plates.',
    hero: 'plate',
    buzz: 8000,
  },
  {
    slug: 'baan-lamai',
    name: 'Baan Lamai',
    cuisine: 'Northern Thai',
    kind: 'restaurant',
    address: '727 Centre St, Jamaica Plain, MA 02130',
    neighborhood: 'Jamaica Plain',
    lat: 42.3098,
    lng: -71.1137,
    price: 2,
    description:
      'Khao soi with crispy noodles, sai ua sausage and herbs piled high. Trending for its lemongrass-heavy cocktails.',
    hero: 'bowl',
    buzz: 340000,
    sourceUrl: 'https://www.instagram.com/p/Cz8thai/',
  },
  {
    slug: 'sesame-and-sage',
    name: 'Sesame & Sage',
    cuisine: 'Healthy Korean-Japanese bowls',
    kind: 'restaurant',
    address: '1342 Beacon St, Brookline, MA 02446',
    neighborhood: 'Coolidge Corner',
    lat: 42.3417,
    lng: -71.1213,
    price: 2,
    description:
      'Grain bowls with fermented vegetables, perilla oil and soft tofu. Light, bright and surprisingly filling.',
    hero: 'plate',
    buzz: 22000,
  },
  {
    slug: 'dragonfly-bakery',
    name: 'Dragonfly Bakery',
    cuisine: 'Hong Kong bakery cafe',
    kind: 'cafe',
    address: '33 Harrison Ave, Boston, MA 02111',
    neighborhood: 'Chinatown',
    lat: 42.3489,
    lng: -71.0621,
    price: 1,
    description:
      'Pineapple buns still warm from the oven, milk tea strained through silk and a cheerful, cramped dining room.',
    hero: 'space',
    buzz: 56000,
  },
  {
    slug: 'yuzu-yuzu',
    name: 'Yuzu Yuzu',
    cuisine: 'Japanese cafe',
    kind: 'cafe',
    address: '2 Seaport Blvd, Boston, MA 02210',
    neighborhood: 'Seaport',
    lat: 42.3519,
    lng: -71.0449,
    price: 2,
    description:
      'Citrus-forward drinks, souffle pancakes and a sleek glass dining room. Just opened and already queued.',
    hero: 'cup',
    buzz: 650000,
    sourceUrl: 'https://www.tiktok.com/@seaportbites/video/9014',
  },
]

const FAMILY: Record<string, string> = {
  'mulan-noodle-bar': 'Chinese',
  'kohi-kissa': 'Japanese',
  'lantern-and-lotus': 'Chinese',
  'tao-tea-house': 'Taiwanese',
  'seoul-hearth': 'Korean',
  'banh-and-brew': 'Vietnamese',
  'matcha-month-club': 'Japanese',
  'silk-road-szechuan': 'Chinese',
  'saigon-alley': 'Vietnamese',
  'ume-counter': 'Japanese',
  'baan-lamai': 'Thai',
  'sesame-and-sage': 'Korean',
  'dragonfly-bakery': 'Chinese',
  'yuzu-yuzu': 'Japanese',
}

export const places: Place[] = seeds.map((s, i) => ({
  id: `p-${s.slug}`,
  created_at: new Date(Date.UTC(2026, 0, 5 + i * 9, 14)).toISOString(),
  name: s.name,
  cuisine: FAMILY[s.slug] ?? 'Asian',
  specialty: s.cuisine,
  kind: s.kind,
  address: s.address,
  neighborhood: s.neighborhood,
  lat: s.lat,
  lng: s.lng,
  price_level: s.price,
  cover_photo_url: photo(s.hero, s.slug),
  photo_urls: [
    photo(s.hero, s.slug),
    photo(s.hero === 'space' ? 'plate' : 'space', `${s.slug}-b`),
    photo(s.hero === 'bowl' ? 'steamer' : 'bowl', `${s.slug}-c`),
  ],
  description: s.description,
  source: s.sourceUrl ? 'social' : 'user',
  source_url: s.sourceUrl ?? null,
  social_buzz: s.buzz,
}))
