import type { Visit, VisitCompanion, VisitTag } from '@/types'
import { photo, type PlateKind } from '../photos'

interface VisitSeed {
  user: string
  place: string
  date: string
  kind: PlateKind
  dishes: string[]
  tags: string[]
  with: string[]
  note: string
}

const M = 'u-molly'
const P = 'u-priya'
const J = 'u-jen'
const MA = 'u-marcus'
const H = 'u-hana'

const seeds: VisitSeed[] = [
  // Mulan Noodle Bar
  {
    user: M,
    place: 'mulan-noodle-bar',
    date: '2026-10-04',
    kind: 'bowl',
    dishes: ['Beef noodle soup', 'Cucumber salad'],
    tags: ['authentic', 'hidden-gem'],
    with: [P],
    note: 'Watched them pull the noodles at the window. Broth is clean and deep. Worth the wait.',
  },
  {
    user: P,
    place: 'mulan-noodle-bar',
    date: '2026-09-21',
    kind: 'bowl',
    dishes: ['Spicy beef noodles'],
    tags: ['authentic'],
    with: [],
    note: 'Ask for the thin noodles. Chili oil is the real deal.',
  },
  {
    user: J,
    place: 'mulan-noodle-bar',
    date: '2026-08-30',
    kind: 'plate',
    dishes: ['Lamb skewers', 'Pulled noodles'],
    tags: ['authentic', 'great-plating'],
    with: [MA],
    note: 'Tiny room, big flavour. Cash is easier.',
  },
  {
    user: MA,
    place: 'mulan-noodle-bar',
    date: '2026-08-30',
    kind: 'bowl',
    dishes: ['Beef noodle soup'],
    tags: ['authentic'],
    with: [J],
    note: 'Better than the hype — broth was proper.',
  },
  // Kōhī Kissa
  {
    user: H,
    place: 'kohi-kissa',
    date: '2026-10-02',
    kind: 'cup',
    dishes: ['Siphon coffee', 'Thick toast'],
    tags: ['beautiful-space', 'thoughtful-service'],
    with: [],
    note: 'Sat at the counter for two hours. Staff remembered my order from last month.',
  },
  {
    user: H,
    place: 'kohi-kissa',
    date: '2026-09-11',
    kind: 'plate',
    dishes: ['Napolitan', 'Egg sando'],
    tags: ['authentic', 'creative-menu'],
    with: [P],
    note: 'The napolitan is the real thing — ketchup and all.',
  },
  {
    user: M,
    place: 'kohi-kissa',
    date: '2026-09-27',
    kind: 'cup',
    dishes: ['Hot siphon blend', 'Purin'],
    tags: ['beautiful-space', 'good-cafe-after'],
    with: [H],
    note: 'Perfect dessert stop after dinner in the South End.',
  },
  {
    user: P,
    place: 'kohi-kissa',
    date: '2026-07-19',
    kind: 'cup',
    dishes: ['Iced coffee float'],
    tags: ['beautiful-space'],
    with: [],
    note: 'Quiet and gorgeous. Phones away kind of place.',
  },
  // Lantern & Lotus
  {
    user: M,
    place: 'lantern-and-lotus',
    date: '2026-09-14',
    kind: 'steamer',
    dishes: ['Har gow', 'Siu mai', 'Egg tarts'],
    tags: ['cozy-for-groups', 'authentic'],
    with: [J, MA, H],
    note: 'Family-style Sunday with eight of us. The carts keep coming.',
  },
  {
    user: J,
    place: 'lantern-and-lotus',
    date: '2026-09-14',
    kind: 'plate',
    dishes: ['Cheung fun', 'Turnip cake'],
    tags: ['cozy-for-groups', 'great-plating'],
    with: [M],
    note: 'Arrive before 11 — the line gets silly.',
  },
  {
    user: MA,
    place: 'lantern-and-lotus',
    date: '2026-07-26',
    kind: 'steamer',
    dishes: ['Xiao long bao', 'Sticky rice'],
    tags: ['cozy-for-groups'],
    with: [],
    note: 'Huge round tables, so it works for a birthday.',
  },
  {
    user: H,
    place: 'lantern-and-lotus',
    date: '2026-06-28',
    kind: 'steamer',
    dishes: ['Har gow'],
    tags: ['authentic', 'cozy-for-groups'],
    with: [],
    note: 'Classic, loud, joyful.',
  },
  {
    user: P,
    place: 'lantern-and-lotus',
    date: '2026-05-31',
    kind: 'plate',
    dishes: ['Chive dumplings', 'Congee'],
    tags: ['authentic'],
    with: [],
    note: 'Get the congee for the table.',
  },
  // Tāo Tea House
  {
    user: P,
    place: 'tao-tea-house',
    date: '2026-09-06',
    kind: 'cup',
    dishes: ['Oolong flight', 'Scallion pancake'],
    tags: ['thoughtful-service', 'beautiful-space', 'hidden-gem'],
    with: [],
    note: 'They guide you through each steep. A slow, lovely hour.',
  },
  {
    user: M,
    place: 'tao-tea-house',
    date: '2026-08-16',
    kind: 'cup',
    dishes: ['Alishan oolong', 'Braised pork rice'],
    tags: ['thoughtful-service', 'good-cafe-after'],
    with: [P],
    note: 'Cozy for two, a bit tight for groups. Pork rice is perfect.',
  },
  // Seoul Hearth
  {
    user: MA,
    place: 'seoul-hearth',
    date: '2026-10-01',
    kind: 'plate',
    dishes: ['Kimchi jjigae', 'Japchae'],
    tags: ['authentic', 'cozy-for-groups'],
    with: [J],
    note: 'Banchan changes weekly. This week’s pickled radish was unreal.',
  },
  {
    user: MA,
    place: 'seoul-hearth',
    date: '2026-08-08',
    kind: 'bowl',
    dishes: ['Sundubu', 'Pajeon'],
    tags: ['authentic', 'hidden-gem'],
    with: [],
    note: 'Order the stew “medium” unless you like pain.',
  },
  {
    user: J,
    place: 'seoul-hearth',
    date: '2026-08-22',
    kind: 'plate',
    dishes: ['Bibimbap', 'Galbi'],
    tags: ['cozy-for-groups'],
    with: [MA],
    note: 'Generous portions. Great for a group dinner.',
  },
  {
    user: M,
    place: 'seoul-hearth',
    date: '2026-07-05',
    kind: 'plate',
    dishes: ['Doenjang jjigae', 'Rice'],
    tags: ['authentic', 'thoughtful-service'],
    with: [MA, J],
    note: 'Felt like eating at someone’s home.',
  },
  // Bánh & Brew
  {
    user: H,
    place: 'banh-and-brew',
    date: '2026-09-18',
    kind: 'cup',
    dishes: ['Cà phê sữa đá', 'Bánh mì'],
    tags: ['good-cafe-after', 'beautiful-space'],
    with: [],
    note: 'Best sunny corner in Fenway. Strong coffee.',
  },
  {
    user: J,
    place: 'banh-and-brew',
    date: '2026-08-12',
    kind: 'plate',
    dishes: ['Bánh mì thịt nướng'],
    tags: ['creative-menu'],
    with: [],
    note: 'Baguette crackles. Pickles on point.',
  },
  {
    user: M,
    place: 'banh-and-brew',
    date: '2026-06-22',
    kind: 'cup',
    dishes: ['Coconut cà phê', 'Pandan waffle'],
    tags: ['good-cafe-after', 'creative-menu'],
    with: [J],
    note: 'Perfect pre-game stop.',
  },
  // Ume Counter — only Molly has been
  {
    user: M,
    place: 'ume-counter',
    date: '2026-09-02',
    kind: 'plate',
    dishes: ['Seasonal omakase', 'Hojicha cake'],
    tags: ['great-plating', 'thoughtful-service', 'creative-menu', 'hidden-gem'],
    with: [],
    note: 'Quiet, meticulous, no phones at the counter. Every plate was a tiny composition.',
  },
  // Sesame & Sage
  {
    user: J,
    place: 'sesame-and-sage',
    date: '2026-09-25',
    kind: 'plate',
    dishes: ['Perilla grain bowl', 'Soft tofu soup'],
    tags: ['great-plating', 'creative-menu'],
    with: [],
    note: 'Clean flavours and the prettiest bowls. Healthy but not boring.',
  },
  // Dragonfly Bakery
  {
    user: MA,
    place: 'dragonfly-bakery',
    date: '2026-09-29',
    kind: 'plate',
    dishes: ['Pineapple bun', 'Milk tea'],
    tags: ['authentic', 'good-cafe-after'],
    with: [],
    note: 'Buns were still hot. Milk tea is silky.',
  },
  {
    user: H,
    place: 'dragonfly-bakery',
    date: '2026-08-04',
    kind: 'space',
    dishes: ['Egg tart', 'Yuenyeung'],
    tags: ['good-cafe-after', 'hidden-gem'],
    with: [M],
    note: 'Cramped, cheerful, cheap.',
  },
  {
    user: M,
    place: 'dragonfly-bakery',
    date: '2026-08-04',
    kind: 'plate',
    dishes: ['Polo bun', 'Coconut tart'],
    tags: ['good-cafe-after', 'authentic'],
    with: [H],
    note: 'The after-dim-sum stop. Take a box home.',
  },
]

export const visits: Visit[] = seeds.map((s, i) => ({
  id: `v-${String(i + 1).padStart(3, '0')}`,
  created_at: `${s.date}T19:00:00Z`,
  user_id: s.user,
  place_id: `p-${s.place}`,
  visited_on: s.date,
  photo_urls: [photo(s.kind, `${s.place}-${i}`)],
  dishes: s.dishes,
  note: s.note,
}))

export const visitTags: VisitTag[] = seeds.flatMap((s, i) =>
  s.tags.map((tag) => ({ visit_id: visits[i]!.id, tag_id: `t-${tag}` })),
)

export const visitCompanions: VisitCompanion[] = seeds.flatMap((s, i) =>
  s.with.map((user_id) => ({ visit_id: visits[i]!.id, user_id })),
)
