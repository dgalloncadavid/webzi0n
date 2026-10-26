/* Captura de página completa del original y de la versión Vue, y diferencia píxel a píxel.
   Uso: node qa/scripts/capture.mjs [pagina] [ancho] [--motion]
   Por defecto emula prefers-reduced-motion para que las animaciones no metan ruido. */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { PAGES, WIDTHS, ORIG, VUE } from './pages.mjs'

const args = process.argv.slice(2)
const motion = args.includes('--motion')
const en = args.includes('--en')
const report = args.includes('--report')
const IMG = path.resolve('qa/report/img')
if (report) fs.mkdirSync(IMG, { recursive: true })
const onlyPage = args.find((a) => !a.startsWith('--') && isNaN(+a))
const onlyW = args.find((a) => !isNaN(+a))
const OUT = path.resolve('qa/.tmp')
fs.mkdirSync(OUT, { recursive: true })

async function shot(browser, url, width, file, jpg) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, reducedMotion: motion ? 'no-preference' : 'reduce' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  /* recorre la página para disparar revelados y carga diferida */
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight
    for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(motion ? 2500 : 600)
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' })
  if (jpg) await page.screenshot({ path: jpg, type: 'jpeg', quality: 55, fullPage: true, animations: 'disabled' })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  await ctx.close()
  return { errors, overflow }
}

function diff(a, b, out) {
  const A = PNG.sync.read(fs.readFileSync(a))
  const B = PNG.sync.read(fs.readFileSync(b))
  const w = Math.max(A.width, B.width)
  const h = Math.max(A.height, B.height)
  const pad = (img) => { const p = new PNG({ width: w, height: h }); p.data.fill(0); PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0); return p }
  const PA = pad(A), PB = pad(B)
  const D = new PNG({ width: w, height: h })
  const n = pixelmatch(PA.data, PB.data, D.data, w, h, { threshold: 0.1 })
  fs.writeFileSync(out, PNG.sync.write(D))
  return { pixels: n, pct: +(100 * n / (w * h)).toFixed(3), sizeA: [A.width, A.height], sizeB: [B.width, B.height] }
}

const browser = await chromium.launch()
const results = []
for (const p of PAGES) {
  if (onlyPage && p.id !== onlyPage) continue
  for (const w of WIDTHS) {
    if (onlyW && w !== +onlyW) continue
    const tag = `${p.id}-${w}${motion ? '-motion' : ''}${en ? '-en' : ''}`
    const fa = path.join(OUT, tag + '-orig.png')
    const fb = path.join(OUT, tag + '-vue.png')
    const q = en ? '?lang=en' : ''
    const ra = await shot(browser, ORIG + p.orig + q, w, fa, report && path.join(IMG, tag + '-orig.jpg'))
    const rb = await shot(browser, VUE + p.vue + q, w, fb, report && path.join(IMG, tag + '-vue.jpg'))
    const d = diff(fa, fb, path.join(OUT, tag + '-diff.png'))
    const r = { page: p.id, width: w, ...d, overflowOrig: ra.overflow, overflowVue: rb.overflow, errorsOrig: ra.errors, errorsVue: rb.errors }
    results.push(r)
    console.log(tag.padEnd(24), 'diff', String(d.pct).padStart(7) + '%', 'size', d.sizeA.join('x'), 'vs', d.sizeB.join('x'), rb.errors.length ? 'ERR ' + rb.errors.join(' | ') : '')
  }
}
fs.writeFileSync(path.join(OUT, `results${motion ? '-motion' : ''}${en ? '-en' : ''}.json`), JSON.stringify(results, null, 2))
await browser.close()
