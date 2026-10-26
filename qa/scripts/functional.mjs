/* Pruebas de comportamiento: se ejecutan con las mismas acciones en el original y en la
   versión Vue y se comparan los resultados. Uso: node qa/scripts/functional.mjs */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { PAGES, ORIG, VUE } from './pages.mjs'

const SITES = {
  orig: { base: ORIG, url: (id) => PAGES.find((p) => p.id === id).orig },
  vue: { base: VUE, url: (id) => PAGES.find((p) => p.id === id).vue }
}
const norm = (u) => (u.replace(ORIG, '').replace(VUE, '').replace('/index.html', '/').replace('.html', '').replace(/(.)\/(?=$|#|\?)/, '$1'))

const TESTS = {
  /* cambio de idioma en cada página: título, h1, html[lang] y localStorage */
  async idioma(page, s) {
    const out = {}
    for (const p of PAGES) {
      await page.goto(s.base + s.url(p.id), { waitUntil: 'networkidle' })
      await page.evaluate(() => localStorage.removeItem('zion-lang'))
      await page.reload({ waitUntil: 'networkidle' })
      const before = await page.evaluate(() => ({ title: document.title, lang: document.documentElement.lang, h: (document.querySelector('h1') || {}).textContent }))
      await page.click('.lang button:nth-child(2) >> visible=true')
      await page.waitForTimeout(300)
      const after = await page.evaluate(() => ({ title: document.title, lang: document.documentElement.lang, h: (document.querySelector('h1') || {}).textContent, desc: document.querySelector('meta[name=description]').content, stored: localStorage.getItem('zion-lang'), pressed: [...document.querySelectorAll('.lang button')].map((b) => b.getAttribute('aria-pressed')).join(',') }))
      await page.click('.lang button:nth-child(1) >> visible=true')
      out[p.id] = { before, after }
    }
    return out
  },
  /* el idioma elegido se mantiene al ir a otra página y ?lang= lo fuerza */
  async persistencia(page, s) {
    await page.goto(s.base + s.url('home') + '?lang=en', { waitUntil: 'networkidle' })
    const a = await page.evaluate(() => [document.documentElement.lang, localStorage.getItem('zion-lang')])
    await page.goto(s.base + s.url('cripto'), { waitUntil: 'networkidle' })
    const b = await page.evaluate(() => [document.documentElement.lang, document.title])
    await page.goto(s.base + s.url('compra') + '?lang=es', { waitUntil: 'networkidle' })
    const c = await page.evaluate(() => [document.documentElement.lang, document.title])
    return { a, b, c }
  },
  /* navegación entre páginas con los enlaces del sitio */
  async navegacion(page, s) {
    const trail = []
    await page.goto(s.base + s.url('home'), { waitUntil: 'networkidle' })
    await page.click('.links a[href*="grapheneos"]'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()))
    await page.click('header .logo'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()))
    await page.click('a.route[href*="cripto"]'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()))
    await page.click('header .logo'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()))
    await page.click('.shortcut a'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()))
    await page.click('#bDoubt'); await page.waitForLoadState('networkidle'); await page.waitForTimeout(300); trail.push(norm(page.url()))
    const faqTop = await page.evaluate(() => Math.round(document.getElementById('faq').getBoundingClientRect().top))
    await page.goBack(); await page.waitForLoadState('networkidle'); await page.waitForTimeout(500); trail.push(norm(page.url()).replace(/#.*/, ''))
    return { trail, faqTop }
  },
  /* menú móvil: abre, Escape cierra, un enlace cierra y lleva al ancla */
  async menu(page, s) {
    const out = {}
    await page.setViewportSize({ width: 390, height: 800 })
    for (const id of ['home', 'grapheneos', 'cripto']) {
      await page.goto(s.base + s.url(id), { waitUntil: 'networkidle' })
      const st = () => page.evaluate(() => ({ open: document.documentElement.classList.contains('menu-open'), exp: document.getElementById('burger').getAttribute('aria-expanded'), label: document.getElementById('burger').getAttribute('aria-label'), vis: getComputedStyle(document.getElementById('mmenu')).visibility, bodyOverflow: getComputedStyle(document.body).overflow }))
      await page.click('#burger'); await page.waitForTimeout(400); const opened = await st()
      await page.keyboard.press('Escape'); await page.waitForTimeout(400); const esc = await st()
      await page.click('#burger'); await page.waitForTimeout(400)
      await page.click('#mmenu .mlinks a:nth-child(2)'); await page.waitForTimeout(1200)
      const link = { ...(await st()), url: norm(page.url()), scrolled: await page.evaluate(() => scrollY > 200) }
      out[id] = { opened, esc, link }
    }
    return out
  },
  /* sin scroll horizontal en ningún ancho */
  async desborde(page, s) {
    const out = {}
    for (const w of [1280, 1024, 768, 390, 360, 320]) {
      await page.setViewportSize({ width: w, height: 800 })
      for (const p of PAGES) {
        await page.goto(s.base + s.url(p.id), { waitUntil: 'networkidle' })
        out[p.id + '@' + w] = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      }
    }
    return out
  },
  /* comparador de capas: teclado y valores aria */
  async comparador(page, s) {
    const out = {}
    for (const id of ['grapheneos', 'cripto']) {
      await page.goto(s.base + s.url(id), { waitUntil: 'networkidle' })
      await page.focus('#handle')
      const v = []
      for (const k of ['ArrowRight', 'ArrowRight', 'ArrowLeft', 'Home', 'End']) { await page.keyboard.press(k); v.push(await page.getAttribute('#handle', 'aria-valuenow')) }
      out[id] = { v, clip: await page.$eval('#vis', (e) => e.style.clipPath) }
    }
    return out
  },
  /* FAQ: una abierta a la vez */
  async faq(page, s) {
    const out = {}
    for (const id of ['home', 'grapheneos', 'cripto']) {
      await page.goto(s.base + s.url(id), { waitUntil: 'networkidle' })
      const state = () => page.$$eval('#faqList .fi', (els) => els.map((e) => (e.classList.contains('open') ? 1 : 0)).join(''))
      const a = await state()
      await page.click('#faqList .fi:nth-of-type(2) .fq, #faqList .fcol:first-child .fi:nth-child(2) .fq'); await page.waitForTimeout(200)
      const b = await state()
      await page.click('#faqList .fi.open .fq'); await page.waitForTimeout(200)
      out[id] = [a, b, await state()]
    }
    return out
  },
  /* checkout: reglas del flujo */
  async checkout(page, s) {
    const c = s.url('compra')
    const r = {}
    const cur = () => page.evaluate(() => [location.hash, document.querySelector('.kick:not([hidden])') && [...document.querySelectorAll('[data-step]')].filter((e) => !e.hidden).map((e) => e.dataset.step).join(',')])
    await page.goto(s.base + c + '#paso-3', { waitUntil: 'networkidle' }); r.deepLinkSinDatos = await cur()
    await page.goto(s.base + c + '?done=1', { waitUntil: 'networkidle' }); r.doneSinCorreo = await cur()
    await page.goto(s.base + c + '?tipo=restauracion', { waitUntil: 'networkidle' })
    await page.click('label.ack'); await page.click('#bNext', { force: true }); await page.waitForTimeout(200)
    r.restauracionVaATienda = await cur()
    await page.click('#bNext', { force: true }); r.hintTienda = await page.textContent('#bHint')
    await page.click('label:has(input[value="encriptada"])'); await page.click('#bNext', { force: true }); await page.waitForTimeout(200)
    await page.fill('#email', 'malo@'); await page.$eval('#email', (e) => e.blur())
    r.correoMalo = await page.evaluate(() => [document.getElementById('emailHelp').textContent, document.getElementById('emailHelp').className, document.getElementById('email').parentNode.className])
    await page.click('label:has(input[value="360"])'); await page.fill('#email', 'ana@correo.com'); await page.dispatchEvent('#email', 'input')
    await page.goBack(); await page.waitForTimeout(300); r.atras = await cur()
    await page.goForward(); await page.waitForTimeout(300); r.adelante = await cur()
    r.resumen = await page.evaluate(() => ['sTipo', 'sTienda', 'sPlan', 'sMail', 'sTotal'].map((i) => document.getElementById(i).textContent))
    r.stepper = await page.$$eval('.sp', (e) => e.map((x) => (x.hidden ? 'h' : '') + x.querySelector('b').textContent + (x.classList.contains('cur') ? '*' : '') + (x.classList.contains('ok') ? 'ok' : '')).join(' '))
    await page.click('.sp.ok'); await page.waitForTimeout(300); r.clicStepper = await cur()
    r.pedido = await page.evaluate(() => JSON.parse(sessionStorage.getItem('zionOrder')))
    r.urlSinCorreo = !page.url().includes('correo')
    /* tarjeta: Luhn y máscaras */
    await page.goto(s.base + s.url('pago-tarjeta'), { waitUntil: 'networkidle' })
    await page.type('#ccNum', '378282246310005'); r.amex = await page.evaluate(() => [document.getElementById('ccNum').value, document.getElementById('ccCvv').maxLength, document.activeElement.id])
    await page.fill('#ccNum', ''); await page.type('#ccNum', '4242424242424241'); await page.type('#ccExp', '9'); r.mesUnDigito = await page.inputValue('#ccExp')
    await page.click('#bNext', { force: true }); r.malos = await page.$$eval('.inp.bad input, .inp.bad select', (e) => e.map((x) => x.id).join(','))
    r.foco = await page.evaluate(() => document.activeElement.id)
    r.datosTarjetaGuardados = await page.evaluate(() => JSON.stringify(sessionStorage).includes('4242'))
    return r
  }
}

const browser = await chromium.launch()
const report = {}
for (const [name, fn] of Object.entries(TESTS)) {
  report[name] = {}
  for (const site of ['orig', 'vue']) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(String(e)))
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
    try { report[name][site] = await fn(page, SITES[site]) } catch (e) { report[name][site] = 'FALLO: ' + e.message.split('\n')[0] }
    if (errors.length) report[name][site + 'Errores'] = errors
    await ctx.close()
  }
  const same = JSON.stringify(report[name].orig) === JSON.stringify(report[name].vue)
  report[name].igual = same
  console.log(name.padEnd(14), same ? 'IGUAL' : 'DISTINTO', report[name].vueErrores ? 'errores vue: ' + report[name].vueErrores.length : '', report[name].origErrores ? 'errores orig: ' + report[name].origErrores.length : '')
}
fs.mkdirSync('qa/.tmp', { recursive: true })
fs.writeFileSync(path.resolve('qa/.tmp/functional.json'), JSON.stringify(report, null, 2))
await browser.close()
