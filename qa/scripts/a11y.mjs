/* Accesibilidad (WCAG 2.2 AA) de /ds y de todas las páginas públicas.
   1. axe-core en 1280 y 390 px, en español e inglés: landings con el FAQ abierto y cerrado,
      cada paso del checkout (con avisos, modal y errores) y las dos páginas de pago.
   2. Foco: recorre cada página con Tab y exige un indicador visible con 3:1 contra su fondo.
   3. /ds: cada texto de cada componente, en el panel oscuro y en el claro (también con el
      puntero encima), debe llegar a 4.5:1; el deshabilitado, a 3:1.
   3b. Contraste que axe no puede decidir (texto sobre degradado o imagen): se captura la caja
      del texto dos veces, con texto y sin él; los píxeles que cambian son los glifos y el fondo
      real es lo que queda detrás de cada uno. Se toma el percentil 5 (el peor, descartando el
      antialias). Mínimo 4.5:1, o 3:1 para texto grande.
   4. Teclado: el Accordion abre y cierra con Enter y Espacio y mantiene aria-expanded; el orden
      de tabulación de /ds y del checkout sigue el orden del documento, sin saltos ni paradas ocultas.
   Requisito: npm run build antes. Uso: npm run a11y
   Resultado: qa/a11y/index.html y qa/a11y/results.json. Sale con código 1 si algo falla. */
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import { over, contrast, toHex } from '../../src/design-system/a11y/contrast.js'

const PORT = process.env.A11Y_PORT || '4300'
const BASE = `http://localhost:${PORT}`
const OUT = path.resolve('qa/a11y')
const WIDTHS = [1280, 390]
const LANGS = ['es', 'en']
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
const NAV = { waitUntil: 'networkidle' }

/* la misma librería de contraste que usa /ds, inyectada en cada página */
const LIB = fs.readFileSync('src/design-system/a11y/contrast.js', 'utf8').replace(/^export (const|function)/gm, '$1')
const BROWSER = fs.readFileSync(path.resolve('qa/scripts/a11y-browser.js'), 'utf8')
const INJECT = `window.__zc=(()=>{${LIB};return {parseColor,colorsIn,over,contrast,toHex,backgroundsBehind,opacityOf,textContrast}})();${BROWSER}`

/* ---------- estados a revisar ---------- */
const label = (v) => `label:has(input[value="${v}"])`
const next = (p) => p.click('#bNext', { force: true })
const settle = (p, ms = 350) => p.waitForTimeout(ms)
async function closeFaq(p) {
  const b = await p.$('.faq .fi.open .fq')
  if (b) { await b.click(); await settle(p, 650) }
}
const LANDINGS = [['inicio', '/'], ['grapheneos', '/grapheneos'], ['cripto', '/cripto']]
const SEQS = [
  ...LANDINGS.map(([id, url]) => [
    [`${id} · FAQ abierto`, (p) => p.goto(BASE + url, NAV)],
    [`${id} · FAQ cerrado`, closeFaq]
  ]),
  [
    ['compra · paso 1', (p) => p.goto(BASE + '/compra?tipo=prueba', NAV)],
    ['compra · paso 1 con aviso', next],
    ['compra · paso 2', async (p) => { await p.click('label.ack'); await next(p) }],
    ['compra · modal de tiendas', (p) => p.click(`${label('web3')} .seeall`)],
    ['compra · paso 3', async (p) => { await p.click('#mPick'); await p.waitForTimeout(2300); await next(p) }],
    ['compra · paso 3 con sugerencia de correo', async (p) => { await p.fill('#email', 'ana@gmial.com'); await p.dispatchEvent('#email', 'input'); await p.$eval('#email', (e) => e.blur()) }],
    ['compra · paso 4', async (p) => { await p.click('.sug'); await next(p) }],
    ['compra · listo', next]
  ],
  [
    ['compra · paso 4 (renovación)', async (p) => { await p.goto(BASE + '/compra?tipo=renovacion&plan=180', NAV); await p.click('label.ack'); await next(p); await p.fill('#email', 'ana@correo.com'); await p.dispatchEvent('#email', 'input'); await next(p) }],
    ['pago con stablecoins', async (p) => { await p.click(label('crypto')); await next(p); await p.waitForURL(/cripto/); await p.waitForLoadState('networkidle') }],
    ['pago con stablecoins · verificando', async (p) => { await next(p); await p.waitForTimeout(500) }]
  ],
  [
    ['pago con tarjeta', (p) => p.goto(BASE + '/compra/pago-tarjeta', NAV)],
    ['pago con tarjeta · errores', next]
  ],
  [['/ds', (p) => p.goto(BASE + '/ds', NAV)]]
]
/* recorridos con Tab (el indicador de foco no depende del idioma) */
/* estados que cambian solos (verificando redirige a los 2 s): solo axe, sin medir píxeles ni foco */
const TRANSIENT = new Set(['pago con stablecoins · verificando'])
const EXCEPTIONS = JSON.parse(fs.readFileSync(path.resolve('qa/a11y/exceptions.json'), 'utf8')).items
const FOCUS_PAGES = new Set(['inicio · FAQ abierto', 'grapheneos · FAQ abierto', 'cripto · FAQ abierto', 'compra · paso 1', 'compra · paso 2', 'compra · modal de tiendas', 'compra · paso 3', 'compra · paso 4', 'compra · listo', 'pago con stablecoins', 'pago con tarjeta · errores', '/ds'])
const TAB_ORDER = new Set(['compra · paso 1', 'compra · paso 2', 'compra · paso 3', 'compra · paso 4', 'pago con stablecoins', 'pago con tarjeta', '/ds'])

/* ---------- servidor ---------- */
const server = spawn('npx', ['vite', 'preview', '--port', PORT, '--strictPort'], { stdio: 'ignore' })
for (let i = 0; i < 60; i++) {
  try { if ((await fetch(BASE + '/')).ok) break } catch {}
  await new Promise((r) => setTimeout(r, 250))
}

const browser = await chromium.launch()
const R = { axe: [], sampled: [], focus: [], dsText: [], keyboard: [], tabOrder: [] }

async function newPage(width, lang) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  await ctx.addInitScript(`try{localStorage.setItem('zion-lang','${lang}')}catch(e){}`)
  await ctx.addInitScript(INJECT)
  const page = await ctx.newPage()
  return { ctx, page }
}
async function revealAll(p) {
  await p.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)) }
    window.scrollTo(0, 0)
  })
  await p.mouse.move(1, 1)
  await settle(p, 300)
}

const frames = (p) => p.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

/* contraste medido contra los píxeles del fondo */
async function sample(p, sel) {
  const box = await p.evaluate(([s, g]) => window.__zcText.hide(s, true, g), [sel, EXCEPTIONS.map((e) => e.selector)])
  if (!box || box.w < 1 || box.h < 1 || box.fg.a < 0.1) { await p.evaluate(() => window.__zcText.unhide()); return null }
  const clip = { x: box.x, y: box.y, width: box.w, height: box.h }
  await frames(p)
  const shown = PNG.sync.read(await p.screenshot({ clip, animations: 'disabled' }))
  await p.evaluate(() => window.__zcText.hideNow())
  await frames(p)
  const hidden = PNG.sync.read(await p.screenshot({ clip, animations: 'disabled' }))
  await p.evaluate(() => window.__zcText.unhide())
  const rs = []
  for (let i = 0; i < hidden.data.length; i += 4) {
    const d = Math.abs(shown.data[i] - hidden.data[i]) + Math.abs(shown.data[i + 1] - hidden.data[i + 1]) + Math.abs(shown.data[i + 2] - hidden.data[i + 2])
    if (d < 24) continue
    const bg = { r: hidden.data[i], g: hidden.data[i + 1], b: hidden.data[i + 2], a: 1 }
    rs.push(contrast(over(box.fg, bg), bg))
  }
  /* sin glifos detectables (texto SVG, texto con relleno de degradado): no se puede medir así */
  if (rs.length < 12) return null
  rs.sort((a, b) => a - b)
  const ratio = rs[Math.floor(rs.length * 0.05)]
  const min = box.large ? 3 : 4.5
  return { text: box.text, within: box.within, ratio: +ratio.toFixed(2), min, pass: ratio >= min, fg: toHex(box.fg) }
}

/* 1 · axe */
async function runAxe(p, state, width, lang) {
  const res = await new AxeBuilder({ page: p }).withTags(TAGS).analyze()
  const undecided = (res.incomplete.find((v) => v.id === 'color-contrast') || { nodes: [] }).nodes.filter((n) => n.target.length === 1).map((n) => n.target[0])
  if (lang === 'es' && !TRANSIENT.has(state)) {
    const out = []
    for (const sel of undecided) { const r = await sample(p, sel); if (r) out.push({ sel, ...r }) }
    await p.evaluate(() => window.scrollTo(0, 0))
    const known = (x) => EXCEPTIONS.find((e) => state.startsWith(e.page) && x.within.includes(e.selector))
    R.sampled.push({ state, width, checked: out.length, fails: out.filter((x) => !x.pass && !known(x)), known: out.filter((x) => !x.pass && known(x)).map((x) => ({ ...x, reason: known(x).reason })) })
  }
  R.axe.push({
    state, width, lang,
    violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), summary: (n.failureSummary || '').split('\n').slice(1, 2).join(' ').trim() })) })),
    incompleteContrast: (res.incomplete.find((v) => v.id === 'color-contrast') || { nodes: [] }).nodes.length
  })
}

/* 2 · foco con Tab */
async function focusWalk(p, state, width, checkOrder) {
  /* el recorrido arranca desde el inicio del documento, no desde el último botón pulsado */
  await p.evaluate(() => {
    document.activeElement && document.activeElement.blur()
    const start = document.createElement('span')
    start.tabIndex = -1
    document.body.prepend(start)
    start.focus()
    window.scrollTo(0, 0)
    window.__zcFocus.baseline()
  })
  const stops = []
  const tab = async () => { await p.keyboard.press('Tab'); await frames(p) }
  for (let i = 0; i < 900; i++) {
    await tab()
    let r = await p.evaluate(() => window.__zcFocus.check())
    if (!r) break
    if (r.iframe) {
      /* la vista previa de /ds contiene páginas completas, que se revisan por separado: se salta su contenido */
      for (let k = 0; k < 600 && r && r.iframe && r.id === stops.at(-1)?.id; k++) { await tab(); r = await p.evaluate(() => window.__zcFocus.check()) }
      if (r && r.iframe && r.id !== stops.at(-1)?.id) { stops.push(r); continue }
      if (!r) break
    }
    if (stops.some((s) => s.id === r.id)) break
    stops.push(r)
  }
  const fails = stops.filter((s) => !s.iframe && !s.pass)
  R.focus.push({ state, width, stops: stops.length, fails })
  if (checkOrder) {
    const order = await p.evaluate((ids) => window.__zcFocus.order(ids), stops.map((s) => s.id))
    R.tabOrder.push({ state, width, stops: stops.length, ...order })
  }
}

/* 3 · texto de /ds en los dos temas */
async function dsText(p, width) {
  const base = await p.evaluate(() => window.__zcText.scan('.spec .pane', ''))
  let hovered = []
  if (width === 1280) {
    const n = await p.evaluate(() => window.__zcText.targets('.spec .pane'))
    for (let i = 0; i < n; i++) {
      const box = await p.evaluate((k) => window.__zcText.prepare(k), i)
      if (!box) continue
      await p.mouse.move(box.x, box.y)
      await settle(p, 60)
      hovered = hovered.concat(await p.evaluate((k) => window.__zcText.scan('[data-zc-hover="' + k + '"]', 'hover'), i))
    }
    await p.mouse.move(1, 1)
  }
  /* sobre un degradado se mide contra los píxeles reales detrás del texto, no contra la peor parada */
  for (const t of base.concat(hovered)) {
    if (t.pass || !t.gradient) continue
    if (t.state === 'hover') { await p.evaluate((s) => document.querySelector(s).closest('a,button,label,li,.fq').scrollIntoView({ block: 'center' }), t.sel); const b = await p.evaluate((s) => { const r = document.querySelector(s).closest('a,button,label,li,.fq').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 } }, t.sel); await p.mouse.move(b.x, b.y); await settle(p, 60) }
    const m = await sample(p, t.sel)
    if (m) { t.sampled = m.ratio; t.ratio = m.ratio; t.pass = m.ratio >= t.min }
    await p.mouse.move(1, 1)
  }
  const all = base.concat(hovered)
  R.dsText.push({ width, checked: all.length, fails: all.filter((t) => !t.pass), disabled: all.filter((t) => t.disabled) })
}

/* 4 · teclado del Accordion */
async function accordionKeys(p, where, sel) {
  const steps = []
  const btns = p.locator(sel)
  const state = () => p.evaluate((s) => [...document.querySelectorAll(s)].map((b) => ({ exp: b.getAttribute('aria-expanded'), open: b.closest('.fi').classList.contains('open') })), sel)
  const expect = async (key, want) => {
    const st = await state()
    const ok = st.every((x, k) => x.exp === String(k === want) && x.open === (k === want))
    steps.push({ key, ok, expanded: st.map((x) => x.exp).join(' ') })
  }
  await btns.nth(1).focus()
  await p.keyboard.press('Enter'); await settle(p, 120); await expect('Enter abre la 2', 1)
  await p.keyboard.press('Space'); await settle(p, 120); await expect('Espacio cierra la 2', -1)
  await p.keyboard.press('Space'); await settle(p, 120); await expect('Espacio abre la 2', 1)
  await p.keyboard.press('Shift+Tab'); await p.keyboard.press('Enter'); await settle(p, 120); await expect('Enter en la 1 abre la 1 y cierra la 2', 0)
  await p.keyboard.press('Enter'); await settle(p, 120); await expect('Enter cierra la 1', -1)
  R.keyboard.push({ where, ok: steps.every((s) => s.ok), steps })
}

try {
  for (const width of WIDTHS) {
    for (const lang of LANGS) {
      for (const seq of SEQS) {
        const { ctx, page } = await newPage(width, lang)
        for (const [state, act] of seq) {
          await act(page)
          await settle(page)
          await revealAll(page)
          await runAxe(page, state, width, lang)
          if (lang === 'es' && FOCUS_PAGES.has(state)) await focusWalk(page, state, width, TAB_ORDER.has(state))
          if (lang === 'es' && state === '/ds') await dsText(page, width)
          process.stdout.write('.')
        }
        await ctx.close()
      }
    }
    const { ctx, page } = await newPage(width, 'es')
    await page.goto(BASE + '/ds', NAV)
    await accordionKeys(page, `/ds · ${width}px`, '#ds-faq .pane.dark .fq')
    await page.goto(BASE + '/', NAV)
    await revealAll(page)
    await accordionKeys(page, `inicio · ${width}px`, '#faq .fq')
    await page.goto(BASE + '/grapheneos', NAV)
    await revealAll(page)
    await accordionKeys(page, `grapheneos · ${width}px`, '.faq--bar .fq')
    await ctx.close()
  }
} finally {
  await browser.close()
  server.kill()
}

/* ---------- reporte ---------- */
const axeFails = R.axe.filter((a) => a.violations.length)
const focusFails = R.focus.reduce((n, f) => n + f.fails.length, 0)
const textFails = R.dsText.reduce((n, t) => n + t.fails.length, 0)
const keyFails = R.keyboard.filter((k) => !k.ok).length
const orderFails = R.tabOrder.filter((o) => !o.ok).length
const summary = {
  fecha: new Date().toISOString(),
  axe: { corridas: R.axe.length, conViolaciones: axeFails.length, violaciones: R.axe.reduce((n, a) => n + a.violations.length, 0), contrasteIncompleto: R.axe.reduce((n, a) => n + a.incompleteContrast, 0) },
  muestreo: { textos: R.sampled.reduce((n, s) => n + s.checked, 0), fallas: R.sampled.reduce((n, s) => n + s.fails.length, 0) },
  foco: { recorridos: R.focus.length, paradas: R.focus.reduce((n, f) => n + f.stops, 0), fallas: focusFails },
  textoDs: { revisados: R.dsText.reduce((n, t) => n + t.checked, 0), fallas: textFails },
  teclado: { pruebas: R.keyboard.length, fallas: keyFails },
  ordenTab: { recorridos: R.tabOrder.length, fallas: orderFails }
}
fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ summary, ...R }, null, 1))
fs.writeFileSync(path.join(OUT, 'index.html'), (await import('./a11y-report.mjs')).render(summary, R))
console.log('\n' + JSON.stringify(summary, null, 1))
const sampleFails = R.sampled.reduce((n, s) => n + s.fails.length, 0)
const failed = axeFails.length + sampleFails + focusFails + textFails + keyFails + orderFails
console.log(failed ? `\nFALLA: ${failed} problemas. Detalle en qa/a11y/index.html` : '\nOK: sin violaciones. Reporte en qa/a11y/index.html')
process.exit(failed ? 1 : 0)
