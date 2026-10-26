<script setup>
/* Checkout · pasos 1 a 4 y pantalla final.
   Prototipo: no envía ni guarda datos fuera de esta pestaña; ningún pago se procesa. */
import { asset } from '@/design-system/asset'
import './checkout.css'
import { reactive, ref, computed, provide, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CheckoutHeader from '@/sections/compra/CheckoutHeader.vue'
import StepLicense from '@/sections/compra/StepLicense.vue'
import StepStore from '@/sections/compra/StepStore.vue'
import StepPlan from '@/sections/compra/StepPlan.vue'
import StepPay from '@/sections/compra/StepPay.vue'
import StepDone from '@/sections/compra/StepDone.vue'
import StoreModal from '@/sections/compra/StoreModal.vue'
import OrderSummary from '@/design-system/components/OrderSummary.vue'
import StickyBar from '@/design-system/components/StickyBar.vue'
import Toast from '@/design-system/components/Toast.vue'
import Footer from '@/design-system/components/Footer.vue'
import Icon from '@/design-system/components/Icon.vue'
import dict from '@/i18n/en/compra'
import { provideDict, lang } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { useToast } from '@/design-system/composables/useToast'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'
import { TIPOS, PRICES, STORE_NAMES, skipStore, saveOrder, loadOrder, money, summaryLines } from '@/sections/compra/order'

const { t, fmt } = provideDict(dict)
usePageMeta(dict, { title: 'Comprar Zi0n Cripto', description: 'Configura y compra tu licencia de Zi0n Cripto en cuatro pasos.' })
const route = useRoute()
const router = useRouter()
const toast = useToast()

/* ---------- pedido ---------- */
const S = reactive(loadOrder() || { tipo: null, tienda: null, plan: null, email: '', metodo: null })
S.ack = !!S.ack
const cur = ref(1)
let maxStep = 1
const flow = () => (skipStore(S) ? [1, 3, 4] : [1, 2, 3, 4])
function after(n) { const f = flow(); const i = f.indexOf(n); return i < 0 ? f[1] : f[i + 1] || 5 }
const save = () => saveOrder({ ...S })
watch(S, save, { deep: true })

/* ---------- correo con sugerencia de errores de tipeo ---------- */
const DOM = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'proton.me', 'protonmail.com']
function lev(a, b) {
  const m = []
  for (let i = 0; i <= a.length; i++) m[i] = [i]
  for (let j = 0; j <= b.length; j++) m[0][j] = j
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return m[a.length][b.length]
}
const okMail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
/* help: default | sug (¿Quisiste decir…?) | bad (correo inválido) */
const email = reactive({ value: S.email || '', state: '', help: 'default', sug: '' })
function checkMail(final) {
  const v = email.value.trim()
  S.email = okMail(v) ? v : ''
  email.state = S.email ? 'good' : (final && v.length > 0 ? 'bad' : '')
  email.help = 'default'
  const at = v.split('@')
  if (at.length === 2 && at[1].length > 2 && DOM.indexOf(at[1].toLowerCase()) < 0) {
    let best = null
    DOM.forEach((d) => { const k = lev(at[1].toLowerCase(), d); if (k <= 2 && (!best || k < best.k)) best = { d, k } })
    if (best) { email.help = 'sug'; email.sug = at[0] + '@' + best.d }
  }
  if (final && v && !S.email) email.help = 'bad'
}
function useSuggestion() { email.value = email.sug; checkMail(true) }

/* ---------- validación y barra fija ---------- */
function missing(n) {
  if (n === 1) { if (!S.tipo) return 'Elige el tipo de licencia.'; if (!S.ack) return 'Confirma que leíste la nota sobre el QR.' }
  if (n === 2 && !S.tienda && !skipStore(S)) return 'Elige una tienda de apps.'
  if (n === 3) { if (S.tipo !== 'prueba' && !S.plan) return 'Elige la duración de tu plan.'; if (!S.email) return 'Escribe el correo donde recibirás el QR.' }
  if (n === 4 && S.tipo !== 'prueba' && !S.metodo) return 'Elige cómo quieres pagar.'
  return ''
}
/* el aviso se traduce al mostrarse y no cambia con el idioma, como en el original */
const hint = ref('')
const setHint = (m) => { hint.value = m ? t(m) : '' }
watch(() => missing(cur.value), (m) => { if (!m) setHint('') })
const opening = ref(false)
const nextLabel = computed(() => {
  if (opening.value) return t('Abriendo…')
  if (cur.value < 4) return t('Continuar')
  if (S.tipo === 'prueba') return t('Empezar mi prueba')
  if (S.metodo === 'crypto') return t('Continuar a Cryptomus')
  if (S.metodo === 'card') return t('Continuar a Stripe')
  return t('Ir a pagar')
})
const nextDisabled = computed(() => opening.value || !!missing(cur.value))
const lines = computed(() => summaryLines(S, t, fmt))
const totalText = computed(() => money(S, t))

/* ---------- pasos ---------- */
const STEP_LABELS = ['Licencia', 'Apps', 'Plan', 'Pago']
const stepper = computed(() => {
  const f = flow()
  return STEP_LABELS.map((label, k) => {
    const go = k + 1
    const i = f.indexOf(go)
    return { go, label, num: i >= 0 ? i + 1 : go, hidden: i < 0, cur: go === cur.value, ok: go < cur.value || cur.value === 5 }
  })
})
const fill = computed(() => {
  const f = flow(), n = f.length
  const pos = cur.value === 5 ? n : f.indexOf(cur.value)
  return (cur.value === 5 ? 100 : Math.min(100, (pos + 0.5) / n * 100)) + '%'
})
const kick = (k) => { const f = flow(); const i = f.indexOf(k); return i >= 0 ? fmt('Paso {i} de {n}', { i: i + 1, n: f.length }) : t('Paso ' + k + ' de 4') }

const panel = ref(null)
const shell = ref(null)
const backIn = ref(false)
function show(n, dir) {
  cur.value = n
  maxStep = Math.max(maxStep, n)
  backIn.value = dir < 0
  nextTick(() => {
    const st = panel.value.querySelector('[data-step="' + n + '"]')
    if (st) { st.style.animation = 'none'; void st.offsetWidth; st.style.animation = '' }
    const h = panel.value.querySelector('[data-step="' + n + '"] h1,[data-step="' + n + '"] h2')
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }) }
    const top = shell.value.getBoundingClientRect().top + scrollY - 80
    if (scrollY > top) scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  })
}

/* El historial usa el #hash del paso (#paso-1 ... #paso-4, #listo) igual que el original.
   pending marca las navegaciones propias; el resto llega de los botones atrás y adelante. */
let pending = null
let ready = false
const hashStep = (h) => (h === '#listo' ? 5 : +((h.match(/#paso-(\d)/) || [])[1] || 1))
function go(n) { pending = n; router.push({ query: route.query, hash: '#paso-' + n }) }
watch(() => route.hash, (h) => {
  if (!ready || route.name !== 'compra') return
  const n = hashStep(h)
  if (pending !== null) { const p = pending; pending = null; if (p === n && cur.value !== n) show(n, n > cur.value ? 1 : -1); return }
  if (cur.value === 5 && n < 5) { pending = 5; router.push({ query: route.query, hash: '#listo' }); return }
  show(Math.min(n, maxStep), n > cur.value ? 1 : -1)
})
function stepClick(k) { if (k < cur.value && cur.value < 5) go(k) }

const checkout = reactive({ S, email, cur, ackEl: null, kick, next, checkMail, useSuggestion, openStore: (id) => modal.value.open(id), resend: () => toast.show(fmt('Reenviamos el correo a {e}', { e: S.email })) })
provide('checkout', checkout)

function next() {
  const m = missing(cur.value)
  if (m) {
    setHint(m)
    if (cur.value === 1 && S.tipo && !S.ack && checkout.ackEl) { const a = checkout.ackEl; a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake') }
    if (cur.value === 3 && !S.email) checkMail(true)
    return
  }
  if (cur.value < 4) { go(after(cur.value)); return }
  if (S.tipo === 'prueba') { finish(); return }
  save()
  opening.value = true
  setTimeout(() => router.push(S.metodo === 'crypto' ? '/compra/pago-cripto' : '/compra/pago-tarjeta'), 250)
}
function back() { if (cur.value > 1) history.back() }
function finish() { S.done = true; save(); pending = 5; router.push({ query: route.query, hash: '#listo' }); show(5, 1) }

/* ---------- modal de tienda ---------- */
const modal = ref(null)
function pickStore(id) {
  S.tienda = id
  toast.show(fmt('Elegiste {s}', { s: t(STORE_NAMES[id]) }))
}
watch(lang, () => checkMail(false))

/* ---------- arranque: ?tipo= y ?plan= preseleccionan, ?done=1 abre la pantalla final ---------- */
const pre = route.query.tipo
if (typeof pre === 'string' && TIPOS[pre] && !S.tipo) S.tipo = pre
const pp = route.query.plan
if (typeof pp === 'string' && PRICES[pp] && !S.plan) S.plan = pp

onMounted(async () => {
  const done = route.query.done === '1' && S.email
  const hs = +((route.hash.match(/#paso-(\d)/) || [])[1] || 0)
  const f = flow()
  if (done) {
    maxStep = 5
    await router.replace({ query: route.query, hash: '#listo' })
    S.done = true
    show(5, 1)
  } else if (hs > 1 && f.indexOf(hs) > 0 && f.filter((k) => k < hs).every((k) => !missing(k))) {
    maxStep = hs
    await router.replace({ query: route.query, hash: '#paso-1' })
    for (const k of f.filter((k) => k > 1 && k <= hs)) await router.push({ query: route.query, hash: '#paso-' + k })
    show(hs, 1)
  } else {
    await router.replace({ query: route.query, hash: '#paso-1' })
    show(1, 1)
  }
  ready = true
})
onBeforeUnmount(() => { ready = false })
</script>

<template>
<div class="pg-compra pg-checkout surface-checkout" :class="{ 'done-mode': cur === 5 }">
<!-- Prototipo de diseño: no envía ni guarda datos. Ningún pago se procesa. -->
<CheckoutHeader :steps="stepper" :fill="fill" @step="stepClick" />

<main ref="shell" class="shell">

  <div class="layout">
    <!-- ============ FORMULARIO ============ -->
    <section ref="panel" class="panel" aria-live="polite">
      <StepLicense :hidden="cur !== 1" :class="{ 'back-in': backIn }" />
      <StepStore :hidden="cur !== 2" :class="{ 'back-in': backIn }" />
      <StepPlan :hidden="cur !== 3" :class="{ 'back-in': backIn }" />
      <StepPay :hidden="cur !== 4" :class="{ 'back-in': backIn }" />
      <StepDone :hidden="cur !== 5" :class="{ 'back-in': backIn }" />
    </section>

    <!-- ============ RESUMEN ============ -->
    <OrderSummary :lines="lines" :show-store="!skipStore(S)" :total="totalText">
      <template #media><div class="phones"><img :src="asset('assets/compra/phones.png')" width="432" height="190" :alt="t('Pantallas de Zi0n: apps, instalación y perfil')"></div></template>
      <template #footer>
        <ul class="incl">
          <li><span class="ico"><Icon name="qrcode" /></span>{{ t('QR de instalación en tu correo') }}</li>
          <li><span class="ico"><Icon name="headset" /></span>{{ t('Soporte técnico 24/7') }}</li>
          <li><span class="ico"><Icon name="shield-lock" /></span>{{ t('Capa oculta y borrado de emergencia') }}</li>
        </ul>
      </template>
    </OrderSummary>
  </div>
</main>

<!-- modal tienda -->
<StoreModal ref="modal" @pick="pickStore" />

<StickyBar :hidden="cur === 5" :show-back="cur !== 1" :hint="hint" :total="totalText" :next-label="nextLabel" :next-disabled="nextDisabled" next-icon @back="back" @next="next" />

<Toast />

<Footer variant="compact" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." :links="[{ label: 'Aviso legal', to: '#' }, { label: 'Términos y condiciones', to: '#' }, { label: 'Política de cookies', to: '#' }]" />
</div>
</template>

<style scoped>
.phones{position:relative;margin:0 -24px;padding:20px 24px 0;background:radial-gradient(closest-side at 50% 90%,rgba(var(--rgb-signal),.25),transparent);border-bottom:1px solid var(--color-line);overflow:hidden}
.phones img{width:100%;height:auto;animation:rise .9s var(--ease) both}
@keyframes rise{from{transform:translateY(30px);opacity:0}to{transform:none;opacity:1}}
.incl{display:flex;flex-direction:column;gap:var(--zn-space-10)}
.incl li{display:flex;gap:var(--zn-space-10);align-items:center;font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--color-ice)}
.incl .ico{width:18px;height:18px;color:var(--color-signal)}
@media (max-width:980px){
  .phones{display:none}
}
</style>
