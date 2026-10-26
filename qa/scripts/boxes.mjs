/* Compara cajas (getBoundingClientRect) y estilos calculados de selectores en ambos sitios.
   Uso: node qa/scripts/boxes.mjs <pagina> <ancho> <selector> [selector...] */
import { chromium } from 'playwright'
import { PAGES, ORIG, VUE } from './pages.mjs'
const [id, w, ...sels] = process.argv.slice(2)
const p = PAGES.find((x) => x.id === id)
const browser = await chromium.launch()
for (const [name, url] of [['orig', ORIG + p.orig], ['vue', VUE + p.vue]]) {
  const page = await browser.newPage({ viewport: { width: +w, height: 900 }, reducedMotion: 'reduce' })
  await page.goto(url, { waitUntil: 'networkidle' })
  const r = await page.evaluate((sels) => sels.map((s) => {
    const e = document.querySelector(s); if (!e) return s + ' : (no existe)'
    const b = e.getBoundingClientRect(), c = getComputedStyle(e)
    return `${s} : ${b.x.toFixed(1)},${b.y.toFixed(1)} ${b.width.toFixed(1)}x${b.height.toFixed(1)} | pad ${c.padding} | disp ${c.display} | font ${c.fontSize}/${c.lineHeight} | zoom ${c.zoom}`
  }), sels)
  console.log('--', name); r.forEach((x) => console.log(x))
  await page.close()
}
await browser.close()
