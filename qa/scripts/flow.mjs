/* Recorre el flujo de compra en el original y en la versión Vue con las mismas acciones,
   captura cada estado y compara píxel a píxel. También junta errores de consola.
   Uso: node qa/scripts/flow.mjs [ancho...] */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import { ORIG, VUE } from './pages.mjs'

const report = process.argv.includes('--report')
const IMG = path.resolve('qa/report/img')
if (report) fs.mkdirSync(IMG, { recursive: true })
const widths = process.argv.slice(2).map(Number).filter(Boolean)
const WIDTHS = widths.length ? widths : [1280, 390]
const OUT = path.resolve('qa/.tmp/flow')
fs.mkdirSync(OUT, { recursive: true })

const SITES = {
  orig: { base: ORIG, compra: '/compra/index.html', home: '/index.html' },
  vue: { base: VUE, compra: '/compra', home: '/' }
}
const label = (v) => `label:has(input[value="${v}"])`

/* cada escenario: lista de [nombre, acción]; tras cada acción se captura */
const SCENARIOS = {
  prueba: (s) => [
    ['1-inicio', async (p) => p.goto(s.base + s.compra + '?tipo=prueba', { waitUntil: 'networkidle' })],
    ['2-sin-ack', async (p) => p.click('#bNext', { force: true })],
    ['3-ack', async (p) => p.click('label.ack')],
    ['4-tiendas', async (p) => p.click('#bNext', { force: true })],
    ['5-modal', async (p) => p.click(`${label('web3')} .seeall`)],
    ['6-elegida', async (p) => { await p.click('#mPick'); await p.waitForTimeout(2300) }],
    ['7-plan-prueba', async (p) => p.click('#bNext', { force: true })],
    ['8-correo-typo', async (p) => { await p.fill('#email', 'ana@gmial.com'); await p.dispatchEvent('#email', 'input') }],
    ['9-correo-blur', async (p) => p.$eval('#email', (e) => e.blur())],
    ['10-sugerencia', async (p) => p.click('.sug')],
    ['11-confirma', async (p) => p.click('#bNext', { force: true })],
    ['12-listo', async (p) => p.click('#bNext', { force: true })],
    ['13-listo-en', async (p) => { await p.click('.lang button:nth-child(2)'); await p.waitForTimeout(900) }]
  ],
  tarjeta: (s) => [
    ['1-home', async (p) => p.goto(s.base + s.home, { waitUntil: 'networkidle' })],
    ['2-plan90', async (p) => { await p.click('a[href*="plan=90"]'); await p.waitForLoadState('networkidle'); await p.waitForTimeout(400) }],
    ['3-ack', async (p) => p.click('label.ack')],
    ['4-paso3', async (p) => p.click('#bNext', { force: true })],
    ['5-correo', async (p) => { await p.fill('#email', 'ana@correo.com'); await p.dispatchEvent('#email', 'input') }],
    ['6-paso4', async (p) => p.click('#bNext', { force: true })],
    ['7-tarjeta', async (p) => p.click(label('card'))],
    ['8-pago', async (p) => { await p.click('#bNext', { force: true }); await p.waitForURL(/tarjeta/); await p.waitForLoadState('networkidle'); await p.waitForTimeout(400) }],
    ['9-errores', async (p) => p.click('#bNext', { force: true })],
    ['10-datos', async (p) => {
      await p.fill('#ccNum', ''); await p.type('#ccNum', '4242424242424242')
      await p.type('#ccExp', '1230'); await p.type('#ccCvv', '123'); await p.type('#ccName', 'Ana Prueba')
      await p.selectOption('#ccCountry', { index: 1 }); await p.dispatchEvent('#ccCountry', 'input'); await p.type('#ccZip', '050001')
    }],
    ['11-listo', async (p) => { await p.click('#bNext', { force: true }); await p.waitForURL(/done=1/, { timeout: 5000 }); await p.waitForLoadState('networkidle'); await p.waitForTimeout(600) }]
  ],
  cripto: (s) => [
    ['1-renovacion', async (p) => p.goto(s.base + s.compra + '?tipo=renovacion&plan=180', { waitUntil: 'networkidle' })],
    ['2-paso3', async (p) => { await p.click('label.ack'); await p.click('#bNext', { force: true }) }],
    ['3-paso4', async (p) => { await p.fill('#email', 'ana@correo.com'); await p.dispatchEvent('#email', 'input'); await p.click('#bNext', { force: true }) }],
    ['4-cripto', async (p) => p.click(label('crypto'))],
    ['5-pago', async (p) => { await p.click('#bNext', { force: true }); await p.waitForURL(/cripto/); await p.waitForLoadState('networkidle'); await p.waitForTimeout(400) }],
    ['6-usdc', async (p) => p.click('#asset button[data-v="USDC"]')],
    ['7-ethereum', async (p) => { await p.selectOption('#net', 'Ethereum'); await p.dispatchEvent('#net', 'change') }],
    ['8-verificando', async (p) => { await p.click('#bNext', { force: true }); await p.waitForTimeout(500) }],
    ['9-listo', async (p) => { await p.waitForURL(/done=1/, { timeout: 6000 }); await p.waitForLoadState('networkidle'); await p.waitForTimeout(600) }],
    ['10-atras', async (p) => { await p.goBack(); await p.waitForTimeout(600) }]
  ]
}

function diff(a, b, out) {
  const A = PNG.sync.read(fs.readFileSync(a)), B = PNG.sync.read(fs.readFileSync(b))
  const w = Math.max(A.width, B.width), h = Math.max(A.height, B.height)
  const pad = (img) => { const p = new PNG({ width: w, height: h }); PNG.bitblt(img, p, 0, 0, img.width, img.height, 0, 0); return p }
  const D = new PNG({ width: w, height: h })
  const n = pixelmatch(pad(A).data, pad(B).data, D.data, w, h, { threshold: 0.1 })
  fs.writeFileSync(out, PNG.sync.write(D))
  return { pct: +(100 * n / (w * h)).toFixed(3), sizeA: A.width + 'x' + A.height, sizeB: B.width + 'x' + B.height }
}

const browser = await chromium.launch()
const results = []
for (const w of WIDTHS) {
  for (const [name, build] of Object.entries(SCENARIOS)) {
    const urls = {}
    const errors = {}
    for (const site of ['orig', 'vue']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      errors[site] = []
      page.on('pageerror', (e) => errors[site].push(String(e)))
      page.on('console', (m) => { if (m.type() === 'error') errors[site].push(m.text()) })
      for (const [step, act] of build(SITES[site])) {
        await act(page)
        await page.mouse.move(1, 1)
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(350)
        await page.screenshot({ path: path.join(OUT, `${name}-${w}-${step}-${site}.png`), fullPage: true, animations: 'disabled' })
        if (report && (w === 1280 || w === 390)) await page.screenshot({ path: path.join(IMG, `flow-${name}-${w}-${step}-${site}.jpg`), type: 'jpeg', quality: 50, fullPage: true, animations: 'disabled' })
        urls[step] = urls[step] || {}
        urls[step][site] = page.url().replace(SITES[site].base, '')
      }
      await ctx.close()
    }
    for (const [step] of build(SITES.orig)) {
      const b = path.join(OUT, `${name}-${w}-${step}`)
      const d = diff(b + '-orig.png', b + '-vue.png', b + '-diff.png')
      results.push({ scenario: name, width: w, step, ...d, url: urls[step] })
      console.log(`${name}-${w}-${step}`.padEnd(30), String(d.pct).padStart(7) + '%', d.sizeA, d.sizeB, urls[step].orig, '|', urls[step].vue)
    }
    if (errors.vue.length || errors.orig.length) console.log('  errores', JSON.stringify(errors))
  }
}
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2))
await browser.close()
