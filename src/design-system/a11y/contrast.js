/* Contraste WCAG 2.2: lectura de colores CSS, composición de alfas y razón de contraste.
   Lo usan la tabla de /ds (sección Accesibilidad) y las pruebas de qa/scripts/a11y.mjs,
   que inyectan este mismo archivo en el navegador. Sin dependencias. */

/** '#0A0F2C' | '#fff' | 'rgb(1, 2, 3)' | 'rgba(1,2,3,.5)' | 'rgb(1 2 3 / 50%)' | 'transparent' → { r, g, b, a } */
export function parseColor(str) {
  if (!str) return null
  const s = String(str).trim().toLowerCase()
  if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }
  let m = s.match(/^#([0-9a-f]{3,8})$/)
  if (m) {
    let h = m[1]
    if (h.length <= 4) h = h.split('').map((c) => c + c).join('')
    const n = (i) => parseInt(h.slice(i, i + 2), 16)
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 }
  }
  m = s.match(/^rgba?\(([^)]+)\)$/)
  if (!m) return null
  const parts = m[1].split(/[\s,/]+/).filter(Boolean)
  const num = (v, max) => (v.endsWith('%') ? (parseFloat(v) / 100) * max : parseFloat(v))
  return { r: num(parts[0], 255), g: num(parts[1], 255), b: num(parts[2], 255), a: parts[3] === undefined ? 1 : num(parts[3], 1) }
}

/** Todos los colores que aparecen en un valor CSS (por ejemplo las paradas de un degradado). */
export function colorsIn(str) {
  return (String(str).match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\btransparent\b/g) || []).map(parseColor).filter(Boolean)
}

/** fg (con alfa) sobre un fondo opaco. */
export function over(fg, bg) {
  const a = fg.a
  return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 }
}

export function luminance({ r, g, b }) {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** Razón de contraste entre dos colores opacos (1 a 21). */
export function contrast(a, b) {
  const x = luminance(a)
  const y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}

export const toHex = ({ r, g, b }) => '#' + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('').toUpperCase()

/** Mínimo WCAG 2.2 AA. kind: 'text' | 'large' | 'ui' (íconos, bordes, foco) */
export const MIN = { text: 4.5, large: 3, ui: 3 }

/** Texto grande: 24 px o más, o 18,66 px o más en negrita (700+). */
export function isLarge(px, weight) {
  return px >= 24 || (px >= 18.66 && weight >= 700)
}

/* ---------- solo navegador ---------- */

/** Fondos posibles detrás de un elemento: compone los fondos de sus ancestros (color y
    paradas de degradado) hasta llegar a uno opaco. Devuelve todos los candidatos opacos;
    el contraste se mide contra el peor. */
export function backgroundsBehind(el) {
  const layers = []
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
    const cs = getComputedStyle(n)
    const color = parseColor(cs.backgroundColor)
    const stops = cs.backgroundImage && cs.backgroundImage !== 'none' && /gradient/.test(cs.backgroundImage) ? colorsIn(cs.backgroundImage) : []
    if ((color && color.a > 0) || stops.length) layers.push({ color, stops })
    if (color && color.a >= 1 && stops.every((s) => s.a >= 1)) break
  }
  let cands = [{ r: 255, g: 255, b: 255, a: 1 }]
  for (let i = layers.length - 1; i >= 0; i--) {
    const { color, stops } = layers[i]
    if (color && color.a > 0) cands = cands.map((c) => over(color, c))
    if (stops.length) cands = cands.flatMap((c) => stops.map((s) => over(s, c)))
  }
  const seen = new Set()
  return cands.filter((c) => { const k = toHex(c); if (seen.has(k)) return false; seen.add(k); return true })
}

/** Opacidad acumulada de un elemento y sus ancestros. */
export function opacityOf(el) {
  let o = 1
  for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity)
  return o
}

/** Peor contraste del color de texto de el contra los fondos posibles. */
export function textContrast(el) {
  const fg = parseColor(getComputedStyle(el).color)
  const op = opacityOf(el)
  const bgs = backgroundsBehind(el)
  let worst = Infinity
  let worstBg = null
  for (const bg of bgs) {
    const c = over({ ...fg, a: fg.a * op }, bg)
    const r = contrast(c, bg)
    if (r < worst) { worst = r; worstBg = bg }
  }
  return { ratio: worst, fg: toHex(over({ ...fg, a: fg.a * op }, worstBg)), bg: toHex(worstBg), n: bgs.length }
}
