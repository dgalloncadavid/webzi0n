/* Reporte HTML de qa/scripts/a11y.mjs (qa/a11y/index.html). */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const badge = (ok, yes = 'OK', no = 'Falla') => `<span class="b ${ok ? 'ok' : 'ko'}">${ok ? yes : no}</span>`

export function render(S, R) {
  const axeRows = R.axe.map((a) => `<tr><td>${esc(a.state)}</td><td>${a.width}</td><td>${a.lang.toUpperCase()}</td><td>${badge(!a.violations.length, '0', a.violations.length)}</td><td>${a.incompleteContrast}</td><td>${a.violations.map((v) => `<details><summary>${esc(v.id)} (${v.nodes.length})</summary><ul>${v.nodes.map((n) => `<li><code>${esc(n.target)}</code> ${esc(n.summary)}</li>`).join('')}</ul></details>`).join('')}</td></tr>`).join('')
  const sampleRows = R.sampled.map((m) => `<tr><td>${esc(m.state)}</td><td>${m.width}</td><td>${m.checked}</td><td>${badge(!m.fails.length, '0', m.fails.length)}</td><td>${m.fails.map((x) => `<div><code>${esc(x.sel)}</code> "${esc(x.text)}" ${x.ratio}:1 (mínimo ${x.min}:1)</div>`).join('')}</td></tr>`).join('')
  const knownRows = R.sampled.flatMap((m) => m.known.map((x) => `<tr><td>${esc(m.state)}</td><td>${m.width}</td><td>"${esc(x.text)}"</td><td>${x.ratio}:1 (mínimo ${x.min}:1)</td><td>${esc(x.reason)}</td></tr>`)).join('')
  const focusRows = R.focus.map((f) => `<tr><td>${esc(f.state)}</td><td>${f.width}</td><td>${f.stops}</td><td>${badge(!f.fails.length, '0', f.fails.length)}</td><td>${f.fails.map((x) => `<div><code>${esc(x.what)}</code> ${esc(x.reason)} ${x.ratio ? x.ratio + ':1' : ''}</div>`).join('')}</td></tr>`).join('')
  const textRows = R.dsText.map((t) => `<tr><td>${t.width}</td><td>${t.checked}</td><td>${badge(!t.fails.length, '0', t.fails.length)}</td><td>${t.disabled.length}</td><td>${t.fails.map((x) => `<div>${esc(x.spec)} · ${x.theme}${x.state ? ' · ' + x.state : ''}: "${esc(x.text)}" ${x.ratio}:1 (${x.fg} sobre ${x.bg})</div>`).join('')}</td></tr>`).join('')
  const keyRows = R.keyboard.map((k) => `<tr><td>${esc(k.where)}</td><td>${badge(k.ok)}</td><td>${k.steps.map((s) => `<div>${s.ok ? '✓' : '✗'} ${esc(s.key)} <code>aria-expanded: ${esc(s.expanded)}</code></div>`).join('')}</td></tr>`).join('')
  const orderRows = R.tabOrder.map((o) => `<tr><td>${esc(o.state)}</td><td>${o.width}</td><td>${o.stops}</td><td>${badge(o.ok)}</td><td>${['positive', 'backwards', 'hidden', 'missed'].filter((k) => o[k].length).map((k) => `<div>${k}: ${o[k].map(esc).join(', ')}</div>`).join('') || 'orden del documento, sin tabindex positivo ni paradas ocultas'}</td></tr>`).join('')
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Accesibilidad · Zi0n</title>
<style>
:root{--bg:#0A0F2C;--card:#121A48;--text:#F3F6FB;--soft:#B7D3E7;--muted:#8E97BF;--line:rgba(183,211,231,.16);--ok:#4DF0A4;--ko:#FF5C6C}
body{margin:0;background:var(--bg);color:var(--text);font:14px/1.5 Inter,system-ui,sans-serif}
main{max-width:1200px;margin:0 auto;padding:32px 16px 64px}
h1{font:800 28px/1.2 'JetBrains Mono',monospace;margin:0 0 6px}h2{font:800 18px/1.3 'JetBrains Mono',monospace;margin:36px 0 10px}
p{color:var(--soft);margin:0 0 8px}code{font:12px/1.4 'JetBrains Mono',monospace;color:var(--soft)}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px;margin:20px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:14px}.card b{display:block;font-size:22px}.card span{color:var(--muted);font-size:12px}
.wrap{overflow-x:auto}table{width:100%;border-collapse:collapse}th{text-align:left;color:var(--muted);font:500 11px/1.4 'JetBrains Mono',monospace;text-transform:uppercase;padding:8px}td{padding:8px;border-top:1px solid var(--line);vertical-align:top}
.b{display:inline-block;padding:1px 9px;border-radius:99px;font-weight:600;font-size:12px}.ok{background:rgba(77,240,164,.16);color:var(--ok)}.ko{background:rgba(255,92,108,.16);color:var(--ko)}
details summary{cursor:pointer}ul{margin:4px 0;padding-left:18px}
</style></head><body><main>
<h1>Accesibilidad · WCAG 2.2 AA</h1>
<p>Generado por <code>npm run a11y</code> el ${esc(S.fecha)}. axe-core con las etiquetas wcag2a, wcag2aa, wcag21a, wcag21aa y wcag22aa, más pruebas propias de foco, texto de /ds, teclado y orden de tabulación.</p>
<div class="cards">
<div class="card"><b>${S.axe.violaciones}</b><span>violaciones de axe en ${S.axe.corridas} corridas</span></div>
<div class="card"><b>${S.foco.fallas}</b><span>fallas de foco en ${S.foco.paradas} paradas de Tab</span></div>
<div class="card"><b>${S.textoDs.fallas}</b><span>textos de /ds bajo el mínimo (de ${S.textoDs.revisados})</span></div>
<div class="card"><b>${S.teclado.fallas}</b><span>fallas de teclado del Accordion (de ${S.teclado.pruebas})</span></div>
<div class="card"><b>${S.ordenTab.fallas}</b><span>fallas de orden de tabulación (de ${S.ordenTab.recorridos})</span></div>
<div class="card"><b>${S.muestreo.fallas}</b><span>fallas al medir por píxeles los ${S.muestreo.textos} textos que axe no puede decidir (sobre imagen o degradado)</span></div>
</div>
<h2>axe por estado, ancho e idioma</h2><div class="wrap"><table><thead><tr><th>Estado</th><th>Ancho</th><th>Idioma</th><th>Violaciones</th><th>Contraste sin decidir</th><th>Detalle</th></tr></thead><tbody>${axeRows}</tbody></table></div>
<h2>Contraste medido por píxeles (texto sobre degradado o imagen)</h2><p>axe deja estos casos como "sin decidir". Se oculta el texto, se captura su caja y se compara su color con los píxeles reales del fondo (percentil 5). Mínimo 4.5:1; texto grande 3:1. Solo en español: los colores no cambian con el idioma.</p><div class="wrap"><table><thead><tr><th>Estado</th><th>Ancho</th><th>Textos medidos</th><th>Fallas</th><th>Detalle</th></tr></thead><tbody>${sampleRows}</tbody></table></div>
<h2>Excepciones conocidas del sitio público</h2><p>Textos del diseño original que no llegan al mínimo y que no se corrigen porque cambiaría cómo se ve el sitio público. Están en <code>qa/a11y/exceptions.json</code> y en NOTES.md; no cuentan como falla, pero quedan a la vista.</p><div class="wrap"><table><thead><tr><th>Estado</th><th>Ancho</th><th>Texto</th><th>Ratio</th><th>Motivo</th></tr></thead><tbody>${knownRows || '<tr><td colspan="5">Ninguna</td></tr>'}</tbody></table></div>
<h2>Indicador de foco (Tab por toda la página, 3:1 contra su fondo)</h2><div class="wrap"><table><thead><tr><th>Página</th><th>Ancho</th><th>Paradas</th><th>Fallas</th><th>Detalle</th></tr></thead><tbody>${focusRows}</tbody></table></div>
<h2>Texto de cada componente de /ds en fondo oscuro y claro (4.5:1; deshabilitado 3:1)</h2><p>En 1280 px también se pasa el puntero por cada enlace, botón, etiqueta e ítem y se vuelve a medir.</p><div class="wrap"><table><thead><tr><th>Ancho</th><th>Textos medidos</th><th>Bajo el mínimo</th><th>Deshabilitados</th><th>Detalle</th></tr></thead><tbody>${textRows}</tbody></table></div>
<h2>Teclado del Accordion</h2><div class="wrap"><table><thead><tr><th>Dónde</th><th>Resultado</th><th>Pasos</th></tr></thead><tbody>${keyRows}</tbody></table></div>
<h2>Orden de tabulación</h2><div class="wrap"><table><thead><tr><th>Página</th><th>Ancho</th><th>Paradas</th><th>Resultado</th><th>Detalle</th></tr></thead><tbody>${orderRows}</tbody></table></div>
</main></body></html>`
}
