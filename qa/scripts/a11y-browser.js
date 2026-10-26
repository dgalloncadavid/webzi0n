/* Ayudantes que qa/scripts/a11y.mjs inyecta en cada página (junto con window.__zc,
   la librería de contraste de src/design-system/a11y/contrast.js). Script clásico, sin módulos. */

/* ---------- foco ---------- */
window.__zcFocus = (() => {
  const TABBABLE = 'a[href],button,input,select,textarea,[tabindex],iframe,summary'
  const base = new WeakMap()
  const byId = new Map()
  let n = 0
  const id = (el) => { if (!el.__zcid) { el.__zcid = ++n; byId.set(n, el) } return el.__zcid }
  const snap = (el) => {
    const cs = getComputedStyle(el)
    return { os: cs.outlineStyle, ow: parseFloat(cs.outlineWidth) || 0, oc: cs.outlineColor, oo: parseFloat(cs.outlineOffset) || 0, bc: cs.borderTopColor, bw: parseFloat(cs.borderTopWidth) || 0, bs: cs.boxShadow }
  }
  /* el indicador puede estar en el elemento, en un ancestro cercano (campo con :focus-within)
     o en la etiqueta que envuelve un radio oculto */
  const chainOf = (el) => {
    const c = [el]
    for (let p = el.parentElement, k = 0; p && k < 3; p = p.parentElement, k++) c.push(p)
    const l = el.closest('label')
    if (l && !c.includes(l)) c.push(l)
    return c
  }
  const describe = (el) => {
    const txt = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('value') || '').replace(/\s+/g, ' ').trim().slice(0, 50)
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') + (txt ? ' "' + txt + '"' : '')
  }
  const visibleBox = (el) => (el.matches('input[type=radio],input[type=checkbox]') && el.closest('label')) || el
  const isVisible = (el) => {
    const v = visibleBox(el)
    const r = v.getBoundingClientRect()
    return r.width > 0 && r.height > 0 && getComputedStyle(v).visibility !== 'hidden' && window.__zc.opacityOf(v) > 0.1
  }
  function baseline() {
    document.querySelectorAll(TABBABLE).forEach((el) => chainOf(el).forEach((nd) => { if (!base.has(nd)) base.set(nd, snap(nd)) }))
  }
  function check() {
    const el = document.activeElement
    if (!el || el === document.body || el === document.documentElement) return null
    if (el.tagName === 'IFRAME') return { id: id(el), iframe: true, what: describe(el), pass: true }
    /* prioridad: contorno, luego cambio de borde, luego sombra visible, en toda la cadena */
    const chain = chainOf(el).map((nd) => ({ nd, c: snap(nd), b: base.get(nd) }))
    let ind = null
    for (const { nd, c, b } of chain) {
      if (c.os !== 'none' && c.ow >= 1 && (!b || b.os === 'none' || b.oc !== c.oc || b.ow !== c.ow)) { ind = { type: 'outline', node: nd, color: c.oc, inside: c.oo < 0 }; break }
    }
    if (!ind) for (const { nd, c, b } of chain) {
      if (b && c.bw > 0 && c.bc !== b.bc) { ind = { type: 'border', node: nd, color: c.bc }; break }
    }
    if (!ind) for (const { nd, c, b } of chain) {
      const col = window.__zc.parseColor((c.bs.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/i) || ['transparent'])[0])
      if (b && c.bs !== b.bs && c.bs !== 'none' && col && col.a > 0) { ind = { type: 'shadow', node: nd, color: c.bs.match(/rgba?\([^)]*\)|#[0-9a-f]{3,8}/i)[0] }; break }
    }
    const visible = isVisible(el)
    if (!ind) return { id: id(el), what: describe(el), visible, pass: false, reason: 'sin indicador de foco' }
    const fg = window.__zc.parseColor(ind.color)
    /* contorno por fuera: se mide contra el fondo del contenedor; borde: contra los dos lados */
    let bgs = window.__zc.backgroundsBehind(ind.type === 'outline' && ind.inside ? ind.node : ind.node.parentElement)
    if (ind.type === 'border') bgs = bgs.concat(window.__zc.backgroundsBehind(ind.node))
    let ratio = Infinity
    let bgHex = ''
    for (const bg of bgs) {
      const r = window.__zc.contrast(window.__zc.over(fg, bg), bg)
      if (r < ratio) { ratio = r; bgHex = window.__zc.toHex(bg) }
    }
    const pass = visible && ratio >= 3
    return { id: id(el), what: describe(el), type: ind.type, color: window.__zc.toHex(fg), bg: bgHex, ratio: +ratio.toFixed(2), visible, pass, reason: !visible ? 'foco en elemento invisible' : ratio < 3 ? 'indicador por debajo de 3:1' : '' }
  }
  /* orden de tabulación: sin tabindex positivo, en el orden del documento, sin paradas ocultas
     y sin elementos visibles que el teclado no alcance */
  function order(ids) {
    const seq = ids.map((i) => byId.get(i)).filter((e) => e && e.tagName !== 'IFRAME')
    const positive = [...document.querySelectorAll('[tabindex]')].filter((e) => e.tabIndex > 0).map(describe)
    const backwards = []
    for (let k = 1; k < seq.length; k++) {
      if (seq[k - 1].compareDocumentPosition(seq[k]) & Node.DOCUMENT_POSITION_PRECEDING) backwards.push(describe(seq[k - 1]) + ' → ' + describe(seq[k]))
    }
    const hidden = seq.filter((e) => !isVisible(e)).map(describe)
    const reached = new Set(seq)
    const groups = new Set(seq.filter((e) => e.type === 'radio').map((e) => e.name))
    const missed = [...document.querySelectorAll(TABBABLE)].filter((e) => {
      if (e.tagName === 'IFRAME' || e.tabIndex < 0 || e.disabled || reached.has(e) || !isVisible(e)) return false
      if (e.type === 'radio' && groups.has(e.name)) return false
      return !e.closest('[inert]')
    }).map(describe)
    return { ok: !positive.length && !backwards.length && !hidden.length && !missed.length, positive, backwards, hidden, missed }
  }
  return { baseline, check, order }
})()

/* ---------- texto de /ds ---------- */
window.__zcText = (() => {
  /* recortado por un ancestro con overflow hidden (respuestas cerradas del FAQ, por ejemplo) */
  const clipped = (el) => {
    const r = el.getBoundingClientRect()
    let L = r.left, T = r.top, Rt = r.right, B = r.bottom
    for (let nd = el.parentElement; nd && nd !== document.documentElement; nd = nd.parentElement) {
      const cs = getComputedStyle(nd)
      const hx = /hidden|clip/.test(cs.overflowX)
      const hy = /hidden|clip/.test(cs.overflowY)
      if (!hx && !hy) continue
      const q = nd.getBoundingClientRect()
      if (hx) { L = Math.max(L, q.left); Rt = Math.min(Rt, q.right) }
      if (hy) { T = Math.max(T, q.top); B = Math.min(B, q.bottom) }
    }
    return Rt - L < 1 || B - T < 1
  }
  function scan(sel, state) {
    const out = []
    document.querySelectorAll(sel).forEach((root) => {
      const pane = root.closest('.pane')
      const theme = pane && pane.classList.contains('dark') ? 'oscuro' : 'claro'
      const spec = (root.closest('.spec') || {}).id || ''
      for (const el of [root, ...root.querySelectorAll('*')]) {
        if (el.closest('svg,iframe,select,option')) continue
        if (![...el.childNodes].some((nd) => nd.nodeType === 3 && nd.textContent.trim())) continue
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden') continue
        const r = el.getBoundingClientRect()
        if (!r.width || !r.height || window.__zc.opacityOf(el) < 0.1 || clipped(el)) continue
        const disabled = !!el.closest('[aria-disabled="true"],:disabled')
        const t = window.__zc.textContrast(el)
        const min = disabled ? 3 : 4.5
        if (!el.id) el.id = 'zc-t' + (++tid)
        out.push({ sel: '#' + CSS.escape(el.id), spec, theme, state, text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60), ratio: +t.ratio.toFixed(2), fg: t.fg, bg: t.bg, gradient: t.n > 1, min, disabled, pass: t.ratio >= min })
      }
    })
    return out
  }
  let list = []
  let tid = 0
  function targets(sel) {
    list = [...document.querySelectorAll(sel)].flatMap((p) => [...p.querySelectorAll('a,button,label,li,.fq')])
    return list.length
  }
  function prepare(k) {
    document.querySelectorAll('[data-zc-hover]').forEach((e) => e.removeAttribute('data-zc-hover'))
    const el = list[k]
    if (!el) return null
    el.setAttribute('data-zc-hover', k)
    el.scrollIntoView({ block: 'center' })
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden' || clipped(el)) return null
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
  }
  /* medición por píxeles: oculta el color del texto para leer el fondo real detrás de cada glifo */
  function hide(sel, later, groups = []) {
    const el = document.querySelector(sel)
    if (!el) return null
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden' || window.__zc.opacityOf(el) < 0.1 || el.closest('[aria-disabled="true"],:disabled')) return null
    el.scrollIntoView({ block: 'center' })
    const r = el.getBoundingClientRect()
    if (r.width < 1 || r.height < 1 || clipped(el)) return null
    const fg = window.__zc.parseColor(cs.color)
    fg.a *= window.__zc.opacityOf(el)
    if (!document.getElementById('zc-hide')) {
      const st = document.createElement('style')
      st.id = 'zc-hide'
      /* solo el color del propio texto: los hijos con color propio y los íconos no cambian, así que no cuentan como glifos */
      st.textContent = '[data-zc-hide]{color:transparent!important;text-shadow:none!important;caret-color:transparent!important}'
      document.head.appendChild(st)
    }
    el.setAttribute(later ? 'data-zc-target' : 'data-zc-hide', '')
    const px = parseFloat(cs.fontSize)
    const w = parseInt(cs.fontWeight, 10)
    return { within: groups.filter((g) => el.closest(g)), x: Math.max(0, r.left), y: Math.max(0, r.top), w: Math.min(r.width, innerWidth - Math.max(0, r.left)), h: Math.min(r.height, innerHeight - Math.max(0, r.top)), fg, large: px >= 24 || (px >= 18.66 && w >= 700), text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) }
  }
  function hideNow() { document.querySelectorAll('[data-zc-target]').forEach((e) => e.setAttribute('data-zc-hide', '')) }
  function unhide() { document.querySelectorAll('[data-zc-hide],[data-zc-target]').forEach((e) => { e.removeAttribute('data-zc-hide'); e.removeAttribute('data-zc-target') }) }
  return { scan, targets, prepare, hide, hideNow, unhide }
})()
