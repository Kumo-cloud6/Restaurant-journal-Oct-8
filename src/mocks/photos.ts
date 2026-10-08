/**
 * Generated "photo" plates for mock data.
 *
 * We deliberately avoid external image hosts: each photo is a small illustrated SVG
 * (overhead bowl, plate, cup, steamer, or room) returned as a data URI. In the real app these
 * become Supabase Storage URLs — consumers only ever see a `string`.
 */

export type PlateKind = 'bowl' | 'plate' | 'cup' | 'steamer' | 'space'

interface Palette {
  bg: string
  bg2: string
  ceramic: string
  accent: string
  accent2: string
  leaf: string
  ink: string
}

const PALETTES: Palette[] = [
  {
    bg: '#e8c9a0',
    bg2: '#d9a874',
    ceramic: '#fbf4e8',
    accent: '#c64a24',
    accent2: '#e8a33d',
    leaf: '#5e6b3a',
    ink: '#2b2118',
  },
  {
    bg: '#c9d3a8',
    bg2: '#a9b887',
    ceramic: '#f7f1e3',
    accent: '#d9653b',
    accent2: '#f0c75e',
    leaf: '#47602a',
    ink: '#26301a',
  },
  {
    bg: '#e9bfae',
    bg2: '#d99a86',
    ceramic: '#fff6ee',
    accent: '#a63a19',
    accent2: '#f2b96b',
    leaf: '#6a7a3f',
    ink: '#3a1f17',
  },
  {
    bg: '#b8c7c4',
    bg2: '#93aaa6',
    ceramic: '#f8f3ea',
    accent: '#c9572e',
    accent2: '#ebc15e',
    leaf: '#3f5a3a',
    ink: '#1f2d2b',
  },
  {
    bg: '#d8b88c',
    bg2: '#b98f5f',
    ceramic: '#2f3a3a',
    accent: '#e5844f',
    accent2: '#f4dc9a',
    leaf: '#7f9a4c',
    ink: '#1c1410',
  },
  {
    bg: '#f0d9b5',
    bg2: '#e4bd86',
    ceramic: '#f0e9dc',
    accent: '#8c3b1f',
    accent2: '#d99a3a',
    leaf: '#55703a',
    ink: '#2b2118',
  },
]

function hash(seed: string): number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Tiny deterministic PRNG so the same seed always paints the same plate. */
function rng(seed: string): () => number {
  let s = hash(seed) || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 10000) / 10000
  }
}

const backdrop = (p: Palette, id: string) => `
  <defs>
    <radialGradient id="g${id}" cx="35%" cy="30%" r="90%">
      <stop offset="0" stop-color="${p.bg}"/><stop offset="1" stop-color="${p.bg2}"/>
    </radialGradient>
    <filter id="s${id}" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="14" flood-color="#2b2118" flood-opacity=".3"/>
    </filter>
  </defs>
  <rect width="800" height="800" fill="url(#g${id})"/>
  <g opacity=".18" stroke="${p.ink}" stroke-width="2">
    ${[120, 260, 400, 540, 680].map((y) => `<path d="M0 ${y}H800"/>`).join('')}
  </g>`

function bowl(p: Palette, r: () => number, id: string): string {
  const noodles = Array.from({ length: 9 }, (_, i) => {
    const a = i * 40 + r() * 20
    const rad = 70 + r() * 70
    return `<path d="M${400 + Math.cos(a) * rad * 0.2} ${400 + Math.sin(a) * rad * 0.2} q ${Math.cos(a + 1) * rad} ${Math.sin(a + 1) * rad} ${Math.cos(a + 2) * rad * 0.9} ${Math.sin(a + 2) * rad * 0.9}" fill="none" stroke="${p.accent2}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`
  }).join('')
  const scallions = Array.from({ length: 14 }, () => {
    const a = r() * 6.28
    const d = r() * 150
    return `<circle cx="${400 + Math.cos(a) * d}" cy="${400 + Math.sin(a) * d}" r="${5 + r() * 4}" fill="${p.leaf}"/>`
  }).join('')
  return `
  <ellipse cx="404" cy="420" rx="290" ry="280" fill="${p.ink}" opacity=".18"/>
  <circle cx="400" cy="400" r="290" fill="${p.ceramic}" filter="url(#s${id})"/>
  <circle cx="400" cy="400" r="250" fill="none" stroke="${p.accent}" stroke-width="6" opacity=".5"/>
  <circle cx="400" cy="400" r="215" fill="${p.accent}" opacity=".85"/>
  <circle cx="400" cy="400" r="195" fill="${p.accent2}" opacity=".35"/>
  ${noodles}
  <g transform="translate(470 330) rotate(${(r() * 40 - 20).toFixed(0)})">
    <ellipse rx="52" ry="40" fill="#fff8e8"/><ellipse rx="24" ry="20" fill="${p.accent2}"/>
  </g>
  <g transform="translate(320 470)"><rect x="-55" y="-26" width="110" height="52" rx="14" fill="${p.ink}" opacity=".75"/><rect x="-45" y="-16" width="90" height="32" rx="10" fill="#8a5a3a"/></g>
  ${scallions}
  <g stroke="${p.ink}" stroke-width="10" stroke-linecap="round" opacity=".85"><path d="M640 120 L470 520"/><path d="M690 150 L520 550"/></g>`
}

function plate(p: Palette, r: () => number, id: string): string {
  const items = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * 6.28 + r() * 0.4
    const d = 110 + r() * 40
    const x = 400 + Math.cos(a) * d
    const y = 400 + Math.sin(a) * d
    const fill = [p.accent, p.accent2, p.leaf][i % 3]
    return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${(r() * 360).toFixed(0)})">
      <rect x="-42" y="-26" width="84" height="52" rx="22" fill="${fill}"/>
      <path d="M-30 -6 q30 -16 60 0" stroke="${p.ceramic}" stroke-width="5" fill="none" opacity=".6"/></g>`
  }).join('')
  return `
  <ellipse cx="406" cy="424" rx="300" ry="290" fill="${p.ink}" opacity=".16"/>
  <circle cx="400" cy="400" r="300" fill="${p.ceramic}" filter="url(#s${id})"/>
  <circle cx="400" cy="400" r="230" fill="none" stroke="${p.ink}" stroke-width="3" opacity=".18"/>
  ${items}
  <circle cx="400" cy="400" r="46" fill="${p.accent}"/>
  <circle cx="400" cy="400" r="22" fill="${p.accent2}"/>
  <g fill="${p.leaf}">${Array.from({ length: 5 }, () => `<ellipse cx="${300 + r() * 200}" cy="${300 + r() * 200}" rx="14" ry="6" transform="rotate(${(r() * 180).toFixed(0)} 400 400)"/>`).join('')}</g>
  <g transform="translate(120 640) rotate(-25)" fill="${p.ink}" opacity=".8"><rect width="150" height="12" rx="6"/></g>`
}

function cup(p: Palette, r: () => number, id: string): string {
  const art = r() > 0.5
  return `
  <ellipse cx="410" cy="440" rx="300" ry="290" fill="${p.ink}" opacity=".14"/>
  <circle cx="400" cy="400" r="290" fill="${p.ceramic}" filter="url(#s${id})"/>
  <circle cx="400" cy="400" r="190" fill="${p.ink}" opacity=".12"/>
  <circle cx="400" cy="400" r="175" fill="${p.leaf}"/>
  <circle cx="400" cy="400" r="150" fill="${p.leaf}" opacity=".7"/>
  ${
    art
      ? `<path d="M400 300 C330 330 330 430 400 480 C470 430 470 330 400 300Z" fill="#f4ecd8" opacity=".92"/><path d="M400 320 V470" stroke="${p.leaf}" stroke-width="7"/>`
      : `<circle cx="400" cy="400" r="95" fill="#f4ecd8" opacity=".9"/><circle cx="400" cy="400" r="45" fill="${p.leaf}"/>`
  }
  <path d="M575 330 q80 0 80 70 q0 70 -80 70" fill="none" stroke="${p.ceramic}" stroke-width="30" stroke-linecap="round"/>
  <g transform="translate(150 190) rotate(-30)"><rect width="190" height="16" rx="8" fill="${p.ink}" opacity=".8"/><ellipse cx="0" cy="8" rx="26" ry="18" fill="${p.ink}" opacity=".8"/></g>
  <g transform="translate(580 600)"><circle r="62" fill="${p.accent2}"/><circle cx="-18" cy="-12" r="8" fill="${p.accent}"/><circle cx="20" cy="10" r="8" fill="${p.accent}"/><circle cx="-6" cy="26" r="7" fill="${p.accent}"/></g>`
}

function steamer(p: Palette, r: () => number, id: string): string {
  const pleat = (x: number, y: number, rot: number) => `
    <g transform="translate(${x} ${y}) rotate(${rot})">
      <path d="M-60 20 Q0 -70 60 20 Q0 40 -60 20Z" fill="${p.ceramic}"/>
      ${[-36, -18, 0, 18, 36].map((px) => `<path d="M${px} 14 q${px / 6} -26 ${px / 3} -30" stroke="${p.accent2}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}
    </g>`
  return `
  <ellipse cx="406" cy="424" rx="310" ry="300" fill="${p.ink}" opacity=".18"/>
  <circle cx="400" cy="400" r="310" fill="#c8985a" filter="url(#s${id})"/>
  <circle cx="400" cy="400" r="310" fill="none" stroke="#8d6736" stroke-width="14"/>
  <g stroke="#a8793f" stroke-width="5" opacity=".7">${Array.from({ length: 11 }, (_, i) => `<path d="M${130 + i * 54} 110 V690"/>`).join('')}</g>
  <circle cx="400" cy="400" r="250" fill="#e9d4a6" opacity=".55"/>
  ${pleat(310, 320, -12 + r() * 10)}${pleat(490, 330, 14 + r() * 10)}${pleat(330, 490, 8)}${pleat(480, 500, -10)}${pleat(400, 410, 90)}
  <g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".5"><path d="M280 120 q-20 -40 10 -80"/><path d="M420 90 q-20 -40 10 -70"/><path d="M540 130 q-20 -40 10 -70"/></g>
  <circle cx="650" cy="650" r="54" fill="${p.accent}"/><circle cx="650" cy="650" r="38" fill="${p.ink}" opacity=".55"/>`
}

function space(p: Palette, r: () => number, id: string): string {
  const lamps = [160, 330, 500, 650]
    .map(
      (x, i) =>
        `<g><path d="M${x} 0 V${130 + i * 16}" stroke="${p.ink}" stroke-width="4"/><path d="M${x - 44} ${190 + i * 16} a44 44 0 0 1 88 0Z" fill="${p.accent2}"/><ellipse cx="${x}" cy="${194 + i * 16}" rx="44" ry="8" fill="#fff6c8"/></g>`,
    )
    .join('')
  return `
  <defs>
    <linearGradient id="w${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.ceramic}"/><stop offset="1" stop-color="${p.bg}"/></linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#w${id})"/>
  <path d="M170 560 V300 a100 100 0 0 1 200 0 V560Z" fill="${p.bg2}" opacity=".9"/>
  <path d="M440 560 V300 a100 100 0 0 1 200 0 V560Z" fill="${p.bg2}" opacity=".9"/>
  <path d="M230 560 V320 M310 560 V320" stroke="${p.ceramic}" stroke-width="5" opacity=".6"/>
  <g fill="${p.leaf}" opacity=".9">${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${60 + i * 12}" cy="${420 + r() * 120}" rx="${40 + r() * 20}" ry="14" transform="rotate(${-60 + i * 18} 80 560)"/>`).join('')}</g>
  ${lamps}
  <rect y="560" width="800" height="240" fill="${p.accent}" opacity=".85"/>
  <rect y="560" width="800" height="14" fill="${p.ink}" opacity=".35"/>
  <g fill="${p.ink}"><rect x="140" y="610" width="220" height="16" rx="8"/><rect x="170" y="626" width="10" height="120"/><rect x="320" y="626" width="10" height="120"/>
  <rect x="470" y="640" width="260" height="16" rx="8"/><rect x="500" y="656" width="10" height="100"/><rect x="690" y="656" width="10" height="100"/></g>
  <circle cx="250" cy="594" r="24" fill="${p.ceramic}"/><circle cx="600" cy="624" r="24" fill="${p.accent2}"/>`
}

const painters = { bowl, plate, cup, steamer, space }

const cache = new Map<string, string>()

/** Returns a data-URI illustration. Same `seed` + `kind` always yields the same image. */
export function photo(kind: PlateKind, seed: string): string {
  const key = `${kind}:${seed}`
  const hit = cache.get(key)
  if (hit) return hit
  const p = PALETTES[hash(seed) % PALETTES.length]!
  const r = rng(seed)
  const id = String(hash(key) % 100000)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">${backdrop(p, id)}${painters[kind](p, r, id)}</svg>`
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  cache.set(key, uri)
  return uri
}
