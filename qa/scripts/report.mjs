/* Arma qa/report/index.html a partir de los resultados de capture, flow y functional.
   Las imágenes con diferencias se exportan también como JPEG para verlas en el reporte. */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const TMP = path.resolve('qa/.tmp')
const OUT = path.resolve('qa/report')
const IMG = path.join(OUT, 'img')
fs.mkdirSync(IMG, { recursive: true })
const read = (f) => (fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [])
const es = read(path.join(TMP, 'results.json'))
const en = read(path.join(TMP, 'results-en.json'))
const flows = read(path.join(TMP, 'flow/results.json'))
const fn = fs.existsSync(path.join(TMP, 'functional.json')) ? read(path.join(TMP, 'functional.json')) : {}

/* mapas de diferencias a JPEG (solo donde hubo píxeles distintos) */
const browser = await chromium.launch()
async function toJpg(png, jpg) {
  if (!fs.existsSync(png)) return false
  const page = await browser.newPage({ viewport: { width: 400, height: 300 } })
  const b64 = fs.readFileSync(png).toString('base64')
  await page.setContent(`<body style="margin:0"><img id="i" src="data:image/png;base64,${b64}"></body>`)
  const box = await page.$eval('#i', (i) => ({ w: i.naturalWidth, h: i.naturalHeight }))
  await page.setViewportSize({ width: box.w, height: Math.min(box.h, 16000) })
  await page.screenshot({ path: jpg, type: 'jpeg', quality: 55, fullPage: true })
  await page.close()
  return true
}
for (const r of [...es, ...en]) {
  const tag = `${r.page}-${r.width}${en.includes(r) ? '-en' : ''}`
  r.tag = tag
  r.diffImg = r.pixels > 0 && (await toJpg(path.join(TMP, tag + '-diff.png'), path.join(IMG, tag + '-diff.jpg'))) ? `img/${tag}-diff.jpg` : null
}
await browser.close()

const pct = (v) => (v === 0 ? '0 %' : v.toLocaleString('es', { maximumFractionDigits: 3 }) + ' %')
const cls = (v) => (v === 0 ? 'ok' : v < 0.01 ? 'aa' : 'warn')
const maxEs = Math.max(...es.map((r) => r.pct))
const maxEn = Math.max(...en.map((r) => r.pct))
const maxFlow = Math.max(...flows.map((r) => r.pct))
const fnNames = Object.keys(fn)
const fnOk = fnNames.filter((k) => fn[k].igual).length
const errs = [...es, ...en].reduce((n, r) => n + (r.errorsVue || []).length, 0)
const overflow = [...es, ...en].filter((r) => r.overflowVue > 0).length

function pageRows(list, label) {
  return list.map((r) => `
    <section class="pair" id="${r.tag}">
      <header><h3>${r.page} · ${r.width} px ${label}</h3><span class="pill ${cls(r.pct)}">${pct(r.pct)}</span><small>${r.sizeA.join('×')} / ${r.sizeB.join('×')} · desborde ${r.overflowVue}px · errores de consola ${(r.errorsVue || []).length}</small></header>
      <div class="cols ${r.diffImg ? 'three' : ''}">
        <figure><figcaption>Original</figcaption><img loading="lazy" src="img/${r.tag}-orig.jpg" alt="Original ${r.page} ${r.width}"></figure>
        <figure><figcaption>Vue</figcaption><img loading="lazy" src="img/${r.tag}-vue.jpg" alt="Vue ${r.page} ${r.width}"></figure>
        ${r.diffImg ? `<figure><figcaption>Diferencias (rojo)</figcaption><img loading="lazy" src="${r.diffImg}" alt="Diferencias"></figure>` : ''}
      </div>
    </section>`).join('')
}
const flowRows = flows.filter((r) => r.width === 1280 || r.width === 390).map((r) => `
    <tr><td>${r.scenario}</td><td>${r.width}</td><td>${r.step}</td><td><span class="pill ${cls(r.pct)}">${pct(r.pct)}</span></td><td><code>${r.url.vue}</code></td>
    <td><a href="img/flow-${r.scenario}-${r.width}-${r.step}-orig.jpg">original</a> · <a href="img/flow-${r.scenario}-${r.width}-${r.step}-vue.jpg">vue</a></td></tr>`).join('')
const flowAll = flows.length

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zi0n · reporte de QA</title>
<style>
:root{--ink:#0A0F2C;--navy:#172258;--ice:#B7D3E7;--mist:#F3F6FB;--muted:#8E97BF;--signal:#4DF0A4;--alert:#FF5C6C;--amber:#FFC46B;--line:rgba(183,211,231,.16)}
*{box-sizing:border-box}body{margin:0;background:var(--ink);color:var(--mist);font:15px/1.5 Inter,system-ui,sans-serif}
main{max-width:1600px;margin:0 auto;padding:40px 24px 80px}
h1,h2,h3{font-family:'JetBrains Mono',ui-monospace,monospace;margin:0}
h1{font-size:32px}h2{font-size:22px;margin:48px 0 16px}h3{font-size:15px}
p{color:var(--ice);max-width:900px}code{font:12px ui-monospace,monospace;color:var(--ice)}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:24px 0}
.kpi{border:1px solid var(--line);border-radius:16px;padding:16px;background:rgba(255,255,255,.03)}
.kpi b{display:block;font:800 26px/1.2 'JetBrains Mono',monospace;color:var(--signal)}.kpi span{color:var(--muted);font-size:13px}
.pill{display:inline-block;padding:2px 10px;border-radius:999px;font:600 12px/18px ui-monospace,monospace}
.pill.ok{background:rgba(77,240,164,.16);color:var(--signal)}.pill.aa{background:rgba(255,196,107,.14);color:var(--amber)}.pill.warn{background:rgba(255,92,108,.16);color:var(--alert)}
table{width:100%;border-collapse:collapse;font-size:13px}td,th{padding:6px 8px;border-top:1px solid var(--line);text-align:left;vertical-align:top}th{color:var(--muted);font-weight:500}
a{color:var(--signal)}
.pair{border-top:1px solid var(--line);padding:24px 0}
.pair header{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px}.pair small{color:var(--muted)}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.cols.three{grid-template-columns:1fr 1fr 1fr}
figure{margin:0}figcaption{font:500 12px ui-monospace,monospace;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px}
figure img{width:100%;height:auto;border:1px solid var(--line);border-radius:8px;display:block;background:#000}
nav.toc{display:flex;flex-wrap:wrap;gap:8px}nav.toc a{font-size:12px}
.fn td:nth-child(2){font-weight:600}
@media (max-width:800px){.cols,.cols.three{grid-template-columns:1fr}}
</style></head><body><main>
<h1>Zi0n · reporte de QA</h1>
<p>Comparación del sitio estático original con la versión Vue. Capturas de página completa en Chromium (Playwright) a 1280, 768, 390 y 360 px, con <code>prefers-reduced-motion: reduce</code> para que las animaciones en bucle no metan ruido; la página se recorre entera antes de capturar para disparar los revelados. La diferencia se mide con pixelmatch (umbral 0,1) sobre la captura completa.</p>
<p>Generado: ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC.</p>
<div class="kpis">
  <div class="kpi"><b>${pct(maxEs)}</b><span>máxima diferencia, 24 capturas en español</span></div>
  <div class="kpi"><b>${pct(maxEn)}</b><span>máxima diferencia, 24 capturas en inglés</span></div>
  <div class="kpi"><b>${pct(maxFlow)}</b><span>máxima diferencia en ${flowAll} estados del flujo de compra</span></div>
  <div class="kpi"><b>${fnOk}/${fnNames.length}</b><span>pruebas de comportamiento con resultado idéntico al original</span></div>
  <div class="kpi"><b>${errs}</b><span>errores de consola en la versión Vue</span></div>
  <div class="kpi"><b>${overflow}</b><span>capturas con desborde horizontal</span></div>
</div>
<p>Las diferencias menores a 0,01 % (ámbar) son antialiasing de bordes con <code>backdrop-filter</code> y de texto: no cambian ningún elemento.</p>

<h2>Pruebas de comportamiento</h2>
<table class="fn"><thead><tr><th>Prueba</th><th>Resultado</th><th>Qué verifica</th></tr></thead><tbody>
${[
  ['idioma', 'Cambio ES/EN en las 6 páginas: título, h1, meta description, html[lang], aria-pressed y localStorage zion-lang'],
  ['persistencia', 'El idioma se conserva entre páginas y ?lang= lo fuerza'],
  ['navegacion', 'Enlaces entre páginas, logo, tarjetas de ruta, atajo a compra, "Aún tengo dudas" con ancla #faq y botón atrás'],
  ['menu', 'Menú móvil: abre, bloquea el scroll, Escape cierra, un enlace cierra y lleva al ancla (3 landings)'],
  ['desborde', 'Sin scroll horizontal en 1280, 1024, 768, 390, 360 y 320 px (6 páginas)'],
  ['comparador', 'Comparador de capas con teclado: flechas, Inicio y Fin, aria-valuenow y recorte'],
  ['faq', 'Una pregunta abierta a la vez (3 landings, incluido el FAQ de dos columnas)'],
  ['checkout', 'Enlace profundo sin datos, ?done=1 sin correo, tienda en restauración, avisos, correo inválido, atrás y adelante entre pasos, resumen, stepper, sessionStorage, URL sin datos personales, Luhn, máscara Amex, vencimiento y foco en el primer error']
].map(([k, d]) => `<tr><td><code>${k}</code></td><td>${fn[k] ? (fn[k].igual ? '<span class="pill ok">igual</span>' : '<span class="pill warn">distinto</span>') : '-'}</td><td>${d}</td></tr>`).join('')}
</tbody></table>

<h2>Flujo de compra (1280 y 390 px)</h2>
<p>Prueba gratis con tienda y sugerencia de correo; activación con plan preseleccionado desde el inicio hasta pagar con tarjeta; renovación pagando con stablecoins. Las mismas acciones en ambos sitios.</p>
<table><thead><tr><th>Escenario</th><th>Ancho</th><th>Estado</th><th>Diferencia</th><th>URL (Vue)</th><th>Capturas</th></tr></thead><tbody>${flowRows}</tbody></table>

<h2>Páginas en español</h2>
<nav class="toc">${es.map((r) => `<a href="#${r.tag}">${r.tag}</a>`).join('')}</nav>
${pageRows(es, '')}
<h2>Páginas en inglés (?lang=en)</h2>
<nav class="toc">${en.map((r) => `<a href="#${r.tag}">${r.tag}</a>`).join('')}</nav>
${pageRows(en, '· EN')}
</main></body></html>`
fs.writeFileSync(path.join(OUT, 'index.html'), html)
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ es, en, flows, functional: Object.fromEntries(fnNames.map((k) => [k, fn[k].igual])) }, null, 2))
console.log('reporte en qa/report/index.html')
