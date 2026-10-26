<script setup>
/* /ds · catálogo del sistema de diseño: tokens (leídos de tokens.json) y todos los
   componentes con sus variantes y estados, sobre fondo oscuro y claro. No se enlaza
   desde el sitio público y se marca noindex. */
import { asset } from '@/design-system/asset'
import { ref, computed, onMounted } from 'vue'
import tokens from '@/design-system/tokens.json'
import iconPaths from '@/design-system/icons/paths.js'
import Specimen from '@/sections/ds/Specimen.vue'
import Icon from '@/design-system/components/Icon.vue'
import Button from '@/design-system/components/Button.vue'
import Badge from '@/design-system/components/Badge.vue'
import FloatingChip from '@/design-system/components/FloatingChip.vue'
import LangSwitch from '@/design-system/components/LangSwitch.vue'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Card from '@/design-system/components/Card.vue'
import Accordion from '@/design-system/components/Accordion.vue'
import PlanCard from '@/design-system/components/PlanCard.vue'
import RouteCard from '@/design-system/components/RouteCard.vue'
import ToolItem from '@/design-system/components/ToolItem.vue'
import PhoneVisual from '@/design-system/components/PhoneVisual.vue'
import LayerCompare from '@/design-system/components/LayerCompare.vue'
import StepCard from '@/design-system/components/StepCard.vue'
import Toast from '@/design-system/components/Toast.vue'
import TextField from '@/design-system/components/TextField.vue'
import SelectField from '@/design-system/components/SelectField.vue'
import RadioCard from '@/design-system/components/RadioCard.vue'
import PaymentMethod from '@/design-system/components/PaymentMethod.vue'
import OrderSummary from '@/design-system/components/OrderSummary.vue'
import StickyBar from '@/design-system/components/StickyBar.vue'
import home from '@/i18n/en/home'
import cripto from '@/i18n/en/cripto'
import grapheneos from '@/i18n/en/grapheneos'
import compra from '@/i18n/en/compra'
import ds from '@/i18n/en/ds'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { useToast } from '@/design-system/composables/useToast'
import { setRevealOptions } from '@/design-system/directives/reveal'

const dict = { ...home, ...cripto, ...grapheneos, ...compra, ...ds }
const { t, fmt } = provideDict(dict)
usePageMeta(dict, { title: 'Sistema de diseño · Zi0n', description: 'Catálogo interno de tokens y componentes de Zi0n. No está enlazado desde el sitio público.', noindex: true })
setRevealOptions({ threshold: 0.15, rootMargin: '0px 0px -6% 0px' })
const toast = useToast()

/* ---------- color ---------- */
const P = tokens.primitive
const BRAND = ['ink', 'navy', 'ice', 'mist', 'muted', 'signal', 'aurora', 'alert', 'amber']
const LIGHT = ['light-text', 'light-eyebrow', 'light-line', 'light-border', 'light-chip', 'light-note', 'light-dot', 'gift', 'warning', 'danger-deep']
const allColors = Object.entries(P.color).filter(([, c]) => c.value || c.rgb)
const colorGroups = [
  { title: 'Colores de marca', items: allColors.filter(([n]) => BRAND.includes(n)) },
  { title: 'Superficies y apoyo', items: allColors.filter(([n]) => !BRAND.includes(n) && !LIGHT.includes(n)) },
  { title: 'Secciones claras', items: allColors.filter(([n]) => LIGHT.includes(n)) }
]
const swatch = (name, c) => (c.value ? `var(--zn-${name})` : `rgb(${c.rgb})`)
const semantic = Object.keys(tokens.semantic.color)
const shadows = Object.keys(tokens.semantic.shadow)
const resolved = ref({})
onMounted(() => {
  const cs = getComputedStyle(document.documentElement)
  const r = {}
  semantic.forEach((k) => { r['--color-' + k] = cs.getPropertyValue('--color-' + k).trim() })
  shadows.forEach((k) => { r['--shadow-' + k] = cs.getPropertyValue('--shadow-' + k).trim() })
  resolved.value = r
})

/* ---------- tipografía: valor efectivo de cada rol en anchos de referencia ---------- */
const WIDTHS = [1280, 1100, 800, 390, 360]
const MQ = { base: () => true, 'max-1180': (w) => w <= 1180, 'max-1023': (w) => w <= 1023, 'range-600-1023': (w) => w >= 600 && w <= 1023, 'max-640': (w) => w <= 640, 'max-380': (w) => w <= 380 }
function scale(keys) {
  const roles = {}
  for (const w of WIDTHS) {
    for (const bp of Object.keys(MQ)) {
      if (!MQ[bp](w)) continue
      for (const k of keys) {
        const type = (tokens.surface[k][bp] || {}).type || {}
        for (const [role, arr] of Object.entries(type)) {
          roles[role] = roles[role] || {}
          const cur = { ...(roles[role][w] || {}) }
          ;['weight', 'size', 'line', 'track'].forEach((p, i) => { if (arr[i] != null) cur[p] = arr[i] })
          roles[role][w] = cur
        }
      }
    }
  }
  return roles
}
const SURFACES = [
  { key: 'landing', cls: 'surface-landing', label: 'Cripto', keys: ['landing'] },
  { key: 'home', cls: 'surface-landing surface-home', label: 'Inicio (h1)', keys: ['landing', 'home'], only: ['h1'] },
  { key: 'graphene', cls: 'surface-graphene', label: 'GrapheneOS', keys: ['graphene'] },
  { key: 'checkout', cls: 'surface-checkout', label: 'Compra y pago', keys: ['checkout'] }
]
const typeTables = SURFACES.map((s) => {
  const r = scale(s.keys)
  const roles = Object.keys(r).filter((k) => !s.only || s.only.includes(k))
  return { ...s, rows: roles.map((role) => ({ role, cls: { display: 'h-display', 'lead-sm': 'lead sm' }[role] || role, at: r[role] })) }
})

/* ---------- espaciado, radios, desenfoque, movimiento ---------- */
const radii = Object.entries(P.radius)
const blurs = Object.entries(P.blur)
const durations = Object.entries(P.duration)
const breakpoints = Object.entries(P.breakpoint)
const icons = Object.keys(iconPaths)

/* ---------- datos de ejemplo ---------- */
const faqItems = computed(() => [
  ['¿En qué celulares funciona?', 'En celulares Samsung compatibles con eSIM. Si usas un Pixel con GrapheneOS, tenemos una versión pensada para ti.'],
  ['¿Necesito cambiar de teléfono?', 'No. Zi0n se instala en tu Samsung con un código QR y tu capa visible sigue funcionando como siempre.'],
  ['¿Cómo pago?', 'Con stablecoins (USDT o USDC) o con tarjeta de crédito. Al terminar recibes tu QR de activación.']
].map(([q, a]) => ({ q: t(q), a: t(a) })))
const faqBar = computed(() => [
  ['¿Se puede borrar por error?', 'No. Antes de cualquier borrado, el teléfono suena, vibra y te pide tu PIN.'],
  ['¿Puedo probarlo?', 'Sí, hay 15 días de prueba.']
].map(([q, a]) => ({ q: t(q), a: t(a) })))
const tipo = ref('prueba')
const plan = ref('180')
const store = ref('exchange')
const metodo = ref('crypto')
const net = ref('Polygon')
const mail = ref('ana@correo.com')
const mailBad = ref('ana@')
const summaryLines = computed(() => ({ tipo: t('Renovación'), tienda: t('Tienda Exchange'), plan: t('180 días'), mail: 'ana@correo.com' }))
const navLinks = [{ label: 'Cómo funciona', to: '#ds-nav' }, { label: 'Para quién', to: '#ds-nav' }, { label: 'Herramientas', to: '#ds-nav' }, { label: 'Planes', to: '#ds-nav' }]
const legal = [{ label: 'Aviso legal', to: '#' }, { label: 'Términos y condiciones', to: '#' }, { label: 'Política de cookies', to: '#' }]
const storeIcons = (list) => list.map((a) => asset('assets/compra/apps/') + a + '.png')

const nav = [
  { title: 'Fundamentos', items: [['color', 'Color'], ['tipografia', 'Tipografía'], ['espaciado', 'Espaciado'], ['radios', 'Radios'], ['sombras', 'Sombras y desenfoque'], ['movimiento', 'Movimiento'], ['breakpoints', 'Breakpoints'], ['iconos', 'Íconos']] },
  { title: 'Componentes', items: [['ds-button', 'Botones'], ['ds-badge', 'Badges'], ['ds-chip', 'Chips flotantes'], ['ds-lang', 'Selector de idioma'], ['ds-nav', 'Barra de navegación'], ['ds-footer', 'Pie de página'], ['ds-shead', 'Encabezado de sección'], ['ds-card', 'Tarjetas'], ['ds-faq', 'Preguntas frecuentes'], ['ds-plan', 'Tarjetas de plan'], ['ds-route', 'Tarjetas de ruta'], ['ds-tool', 'Herramientas'], ['ds-phone', 'Visual de teléfono'], ['ds-compare', 'Comparador de capas'], ['ds-step', 'Pasos'], ['ds-toast', 'Aviso (toast)'], ['ds-field', 'Campos del checkout'], ['ds-radio', 'Opciones (radio card)'], ['ds-method', 'Método de pago'], ['ds-summary', 'Resumen del pedido'], ['ds-bar', 'Barra fija inferior']] }
]
</script>

<template>
<div class="pg-ds surface-landing">
<header class="ds-top">
  <div class="ds-top-in">
    <RouterLink to="/" class="ds-logo"><img :src="asset('assets/logo-white.svg')" width="138" height="32" alt="Zi0n"></RouterLink>
    <span class="ds-name">{{ t('Sistema de diseño') }}</span>
    <LangSwitch />
  </div>
</header>

<div class="ds-shell">
  <aside class="ds-side">
    <nav v-for="g in nav" :key="g.title"><p class="eyebrow">{{ t(g.title) }}</p><a v-for="[id, label] in g.items" :key="id" :href="'#' + id">{{ t(label) }}</a></nav>
  </aside>

  <main class="ds-main">
    <section class="ds-intro">
      <span class="ds-pill">tokens · componentes · v1</span>
      <h1 class="h1">{{ t('Sistema de diseño') }}</h1>
      <p class="body-lg">{{ t('Catálogo interno de tokens y componentes de Zi0n. No está enlazado desde el sitio público.') }}</p>
      <p class="small">{{ t('Los valores salen de las cuatro hojas de estilo originales. tokens.json es la fuente; tokens.css se genera con npm run tokens.') }}</p>
    </section>

    <!-- ================= COLOR ================= -->
    <section id="color" class="ds-block">
      <h2 class="h2">{{ t('Color') }}</h2>
      <div v-for="g in colorGroups" :key="g.title" class="ds-sub">
        <h3 class="h5">{{ t(g.title) }}</h3>
        <div class="swatches">
          <div v-for="[name, c] in g.items" :key="name" class="sw">
            <span class="sw-c" :style="{ background: swatch(name, c) }"></span>
            <b>{{ name }}</b>
            <code>{{ c.value ? '--zn-' + name : '--zn-' + name + '-rgb' }}</code>
            <code>{{ c.value || 'rgb(' + c.rgb + ')' }}</code>
            <small v-if="c.note">{{ c.note }}</small>
          </div>
        </div>
      </div>
      <div class="ds-sub">
        <h3 class="h5">{{ t('Roles de color') }}</h3>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>{{ t('Nombre') }}</th><th></th><th>{{ t('Valor') }}</th></tr></thead>
          <tbody><tr v-for="k in semantic" :key="k"><td><code>--color-{{ k }}</code></td><td><span class="dot-sw" :style="{ background: 'var(--color-' + k + ')' }"></span></td><td><code>{{ resolved['--color-' + k] }}</code></td></tr></tbody>
        </table></div>
      </div>
    </section>

    <!-- ================= TIPOGRAFÍA ================= -->
    <section id="tipografia" class="ds-block">
      <h2 class="h2">{{ t('Tipografía') }}</h2>
      <p class="body">{{ t('Cada página aplica una superficie que define su escala tipográfica. Los nombres de rol vienen del Style Guide de cada Figma.') }}</p>
      <p class="small">JetBrains Mono 500 · 800 / Inter 400 · 500 · 600</p>
      <div v-for="s in typeTables" :key="s.key" class="ds-sub">
        <h3 class="h5">{{ t('Superficie') }} <code>.surface-{{ s.key }}</code> · {{ s.label }}</h3>
        <div class="tbl-wrap"><table class="tbl type">
          <thead><tr><th>{{ t('Rol') }}</th><th>{{ t('Muestra') }}</th><th v-for="w in WIDTHS" :key="w">{{ w === 1280 ? t('Escritorio') : w + ' px' }}</th></tr></thead>
          <tbody><tr v-for="r in s.rows" :key="r.role"><td><code>.{{ r.cls.replace(' ', '.') }}</code></td><td :class="s.cls"><span :class="r.cls">{{ t('Privacidad que se borra a tiempo') }}</span></td><td v-for="w in WIDTHS" :key="w"><code>{{ r.at[w].size }} / {{ r.at[w].line }}</code></td></tr></tbody>
        </table></div>
      </div>
    </section>

    <!-- ================= ESPACIADO ================= -->
    <section id="espaciado" class="ds-block">
      <h2 class="h2">{{ t('Espaciado') }}</h2>
      <p class="body">{{ t('Escala en px usada por los componentes. No hay valores inventados: cada paso aparece en el CSS original.') }}</p>
      <div class="spaces"><div v-for="s in P.space.filter((x) => x > 0)" :key="s" class="sp-row"><code>--zn-space-{{ s }}</code><span class="sp-bar" :style="{ width: s + 'px' }"></span><small>{{ s }}px</small></div></div>
    </section>

    <!-- ================= RADIOS ================= -->
    <section id="radios" class="ds-block">
      <h2 class="h2">{{ t('Radios') }}</h2>
      <div class="radii"><div v-for="[k, v] in radii" :key="k" class="rd-i"><span :style="{ borderRadius: v }"></span><code>--zn-radius-{{ k }}</code><small>{{ v }}</small></div></div>
    </section>

    <!-- ================= SOMBRAS ================= -->
    <section id="sombras" class="ds-block">
      <h2 class="h2">{{ t('Sombras y desenfoque') }}</h2>
      <div class="shadows"><div v-for="k in shadows" :key="k" class="sh-i"><span :style="{ boxShadow: 'var(--shadow-' + k + ')' }"></span><code>--shadow-{{ k }}</code><small>{{ resolved['--shadow-' + k] }}</small></div></div>
      <div class="blurs"><div v-for="[k, v] in blurs" :key="k" class="bl-i"><span class="bl-under"></span><span class="bl-glass" :style="{ backdropFilter: 'blur(' + v + ')', webkitBackdropFilter: 'blur(' + v + ')' }"></span><code>--zn-blur-{{ k }}</code><small>{{ v }}</small></div></div>
    </section>

    <!-- ================= MOVIMIENTO ================= -->
    <section id="movimiento" class="ds-block">
      <h2 class="h2">{{ t('Movimiento') }}</h2>
      <h3 class="h5">{{ t('Curva de la marca') }} <code>--ease: cubic-bezier(.2,.7,.2,1)</code></h3>
      <p class="small">{{ t('Pasa el puntero para ver la curva') }}</p>
      <div class="ease-demo"><span class="ease-ball"></span></div>
      <h3 class="h5">{{ t('Duraciones') }}</h3>
      <div class="durs"><code v-for="[k, v] in durations" :key="k">--zn-dur-{{ k }} · {{ v }}</code></div>
    </section>

    <!-- ================= BREAKPOINTS ================= -->
    <section id="breakpoints" class="ds-block">
      <h2 class="h2">{{ t('Breakpoints') }}</h2>
      <div class="tbl-wrap"><table class="tbl"><tbody><tr v-for="[k, b] in breakpoints" :key="k"><td><code>--zn-bp-{{ k }}</code></td><td><code>{{ b.value }}</code></td><td>{{ b.note }}</td></tr></tbody></table></div>
    </section>

    <!-- ================= ÍCONOS ================= -->
    <section id="iconos" class="ds-block">
      <h2 class="h2">{{ t('Íconos') }}</h2>
      <p class="small">Tabler Icons · &lt;Icon name="…" /&gt;</p>
      <div class="icons"><div v-for="n in icons" :key="n" class="ic-i"><span class="ico"><Icon :name="n" /></span><small>{{ n }}</small></div></div>
    </section>

    <!-- ================= COMPONENTES ================= -->
    <h2 class="h2 ds-comp-t">{{ t('Componentes') }}</h2>

    <Specimen id="ds-button" dark-only :title="t('Botones')" :text="t('Variantes primary, ghost, navy, secondary y text; tamaños sm, md, lg y xl (densidad del checkout).') + ' ' + t('Hover: pasa el puntero sobre cada ejemplo.')" code='<Button to="/compra?tipo=prueba" variant="primary" size="lg">Probar 15 días</Button>'>
      <div class="col">
        <div class="row"><Button variant="primary" size="sm">Primary sm</Button><Button variant="primary" size="md">Primary md</Button><Button variant="primary" size="lg">Primary lg</Button></div>
        <div class="row"><Button variant="ghost" size="sm">Ghost sm</Button><Button variant="ghost" size="md">Ghost md</Button><Button variant="ghost" size="lg">Ghost lg</Button></div>
        <div class="row"><Button variant="navy" size="md">Navy md</Button><Button variant="secondary" size="lg">Secondary lg</Button></div>
        <div class="row surface-checkout"><Button variant="primary" size="xl">Primary xl <span class="ico"><Icon name="arrow-right" /></span></Button><Button variant="ghost" size="xl"><span class="ico"><Icon name="arrow-left" /></span>Ghost xl</Button><Button variant="text" size="xl">Text xl</Button></div>
        <p class="ds-label">{{ t('Estados') }}</p>
        <div class="row surface-checkout"><Button variant="primary" size="xl">{{ t('Normal') }}</Button><Button variant="primary" size="xl" class="ds-focus">{{ t('Foco') }}</Button><Button variant="primary" size="xl" :disabled="true">{{ t('Desactivado') }}</Button></div>
      </div>
    </Specimen>

    <Specimen id="ds-badge" dark-only :title="t('Badges')" code='<Badge variant="outline" tone="aurora" size="sm">Ahorras 10%</Badge>'>
      <div class="col">
        <div class="row"><Badge tone="signal">signal</Badge><Badge tone="aurora">aurora</Badge><Badge tone="alert">alert</Badge><Badge tone="amber">amber</Badge></div>
        <div class="row"><Badge tone="signal" size="sm">signal sm</Badge><Badge tone="aurora" size="sm">aurora sm</Badge><Badge tone="alert" size="sm">alert sm</Badge></div>
        <div class="row"><Badge variant="strong" tone="alert">{{ t('Se borra') }}</Badge><Badge variant="tag" tone="signal">{{ t('Gratis') }}</Badge><Badge variant="tag" tone="amber">{{ t('Ahorras 17%') }}</Badge></div>
      </div>
    </Specimen>

    <Specimen id="ds-chip" :title="t('Chips flotantes')" code='<FloatingChip variant="glass" tone="alert">Cable detectado · pide PIN</FloatingChip>'>
      <div class="col chips-demo">
        <div class="row"><FloatingChip tone="signal">{{ t('App señuelo · activa') }}</FloatingChip><FloatingChip tone="alert">{{ t('Cable detectado · pide PIN') }}</FloatingChip><FloatingChip tone="aurora">{{ t('VPN dinámico · on') }}</FloatingChip><FloatingChip tone="ice">glass · ice</FloatingChip></div>
        <div class="row"><FloatingChip variant="float" tone="signal">{{ t('Capa oculta · activa') }}</FloatingChip><FloatingChip variant="float" tone="alert">{{ t('Cable detectado · PIN requerido') }}</FloatingChip><FloatingChip variant="float" tone="aurora">float · aurora</FloatingChip></div>
        <div class="row"><FloatingChip variant="compact" tone="ice">{{ t('Capa visible') }}</FloatingChip><FloatingChip variant="compact" tone="signal">{{ t('Capa oculta') }}</FloatingChip></div>
      </div>
    </Specimen>

    <Specimen id="ds-lang" dark-only :title="t('Selector de idioma')" code='<LangSwitch />  <LangSwitch variant="compact" :mark-lang="false" />'>
      <LangSwitch /><LangSwitch variant="compact" :mark-lang="false" />
    </Specimen>

    <Specimen id="ds-nav" :title="t('Barra de navegación')" :text="t('Menú móvil: toca el botón de menú dentro de la vista previa.')" code='<Navbar variant="home" home-to="#top" :links="links" :extra-links="extraLinks" />'>
      <div class="col nav-demo">
        <p class="ds-label">home</p><Navbar variant="home" home-to="#ds-nav" :links="navLinks" :extra-links="[{ label: 'GrapheneOS', to: '/grapheneos' }, { label: 'Cripto', to: '/cripto' }]" />
        <p class="ds-label">cripto</p><Navbar variant="cripto" :links="navLinks" />
      </div>
    </Specimen>
    <div class="previews">
      <figure v-for="p in ['/', '/grapheneos', '/cripto']" :key="p"><iframe :src="$router.resolve(p).href" width="390" height="640" loading="lazy" :title="p"></iframe><figcaption><code>{{ p }}</code> · 390 px</figcaption></figure>
    </div>

    <Specimen id="ds-footer" dark-only :title="t('Pie de página')" code='<Footer variant="home" :columns="columns" copyright="© 2026 Zi0n. Todos los derechos reservados." />'>
      <div class="col foot-demo">
        <p class="ds-label">home</p><Footer variant="home" :columns="[{ title: 'Zi0n', links: [{ label: 'Zi0n Cripto', to: '/cripto' }, { label: 'Comprar', to: '/compra' }] }, { title: 'Legal', links: legal }]" copyright="© 2026 Zi0n. Todos los derechos reservados." />
        <p class="ds-label">cripto</p><Footer variant="cripto" :links="legal" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." />
        <p class="ds-label">compact</p><div class="surface-checkout"><Footer variant="compact" :links="legal" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." /></div>
      </div>
    </Specimen>

    <Specimen id="ds-shead" :title="t('Encabezado de sección')" code='<SectionHeader eyebrow="Planes" title="Un precio claro" lead="…" align="left" />'>
      <div class="col">
        <SectionHeader :eyebrow="t('Planes')" :title="t('Un precio claro, sin letra pequeña')" :lead="t('Prueba gratis y elige luego cuánto tiempo quieres a Zi0n en tu teléfono.')" />
        <SectionHeader align="left" :eyebrow="t('Para quién')" :title="t('Pensado para quien no puede perder su información')" :lead="t('Tu trabajo depende de la confianza de otros. Zi0n cuida esa confianza en el mismo celular que ya usas.')" />
      </div>
    </Specimen>

    <Specimen id="ds-card" :title="t('Tarjetas')" code='<Card variant="dark">…</Card>  <Card variant="light">…</Card>'>
      <Card class="demo-card"><h3 class="h5">{{ t('Hardware wallet') }}</h3><p class="small">{{ t('Excelente para guardar en frío. Pero no sale contigo a la calle ni sirve para operar a diario.') }}</p></Card>
      <Card variant="light" class="demo-card"><h3 class="h5">{{ t('Datos financieros de terceros') }}</h3><p class="small">{{ t('Balances, accesos a portales y archivos de clientes, fuera de la vista de quien revise tu teléfono.') }}</p></Card>
    </Specimen>

    <Specimen id="ds-faq" dark-only :title="t('Preguntas frecuentes')" code='<Accordion :items="[{ q, a }]" variant="line" :columns="[5, 4]" />'>
      <div class="col"><Accordion :items="faqItems" variant="line" :columns="[2, 1]" list-id="dsFaq1" /></div>
    </Specimen>
    <Specimen id="ds-faq-bar" dark-only :title="t('Preguntas frecuentes') + ' · bar'" surface="graphene" code='<Accordion :items="items" variant="bar" />'>
      <div class="col faq-bar-demo"><Accordion :items="faqBar" variant="bar" list-id="dsFaq2" /></div>
    </Specimen>

    <Specimen id="ds-plan" :title="t('Tarjetas de plan')" code='<PlanCard name="Anual" price="$500" currency="USD" period="360 días" highlight … />'>
      <div class="grid4">
        <PlanCard :name="t('Prueba')" price="$0" :period="t('15 días')" :note="t('Para probar todo antes de pagar')" gift :cta-label="t('Empezar prueba')" cta-to="/compra?tipo=prueba" />
        <PlanCard :name="t('Trimestral')" price="$150" currency="USD" :period="t('90 días')" :note="t('$50 por mes')" :cta-label="t('Elegir 90 días')" cta-to="/compra?tipo=activacion&plan=90" />
        <PlanCard :name="t('Semestral')" price="$269" currency="USD" :period="t('180 días')" :note="t('$44,8 por mes')" :badge="{ label: t('Ahorras 10%'), tone: 'aurora' }" :cta-label="t('Elegir 180 días')" cta-to="/compra?tipo=activacion&plan=180" />
        <PlanCard :name="t('Anual')" price="$500" currency="USD" :period="t('360 días')" :note="t('$41,7 por mes')" :badge="{ label: t('Ahorras 17%'), tone: 'signal' }" highlight :cta-label="t('Elegir 360 días')" cta-to="/compra?tipo=activacion&plan=360" />
      </div>
    </Specimen>

    <Specimen id="ds-route" :title="t('Tarjetas de ruta')" code='<RouteCard to="/cripto" tone="signal" :tags :eyebrow :title :text :items :cta-label />'>
      <div class="grid2">
        <RouteCard to="/grapheneos" tone="aurora" :tags="['Pixel', 'GrapheneOS']" :eyebrow="t('Para usuarios de GrapheneOS')" :title="t('Tu GrapheneOS, con red de seguridad')" :text="t('Si ya confías en GrapheneOS en tu Pixel, Zi0n suma avisos, borrado automático y una capa oculta encima de lo que tienes.')" :items="[t('Se instala sobre tu sistema actual'), t('Capa oculta para tus apps más sensibles')]" :cta-label="t('Ver Zi0n para GrapheneOS')" />
        <RouteCard to="/cripto" tone="signal" :tags="['Wallets', 'Web3']" :eyebrow="t('Para quien maneja cripto')" :title="t('Tus wallets en una capa que nadie ve')" :text="t('Guarda wallets y exchanges en la capa oculta. Si alguien revisa tu teléfono, solo verá apps comunes.')" :items="[t('Pagas con USDT o USDC')]" :cta-label="t('Ver Zi0n Cripto')" />
      </div>
    </Specimen>

    <Specimen id="ds-tool" :title="t('Herramientas')" code='<ToolItem icon="plug-connected" title="Cable conectado" text="…" :active="true" />'>
      <ul class="tools-demo c-alt"><ToolItem icon="plug-connected" :title="t('Cable conectado')" :text="t('Pide tu PIN si alguien conecta un cable')" /><ToolItem icon="password" :title="t('PIN de pánico') + ' · ' + t('activo')" :text="t('Un PIN que borra al ingresarlo')" active /></ul>
      <ul class="tools-demo c-aur"><ToolItem icon="square-circle" :title="t('App señuelo')" :text="t('Una fachada creíble para quien revise')" /><ToolItem icon="screenshot" :title="t('Bloqueo de capturas')" :text="t('Nadie toma pantallazos de tu capa')" active /></ul>
      <ul class="tools-demo c-sig"><ToolItem icon="world" :title="t('VPN dinámico')" :text="t('Cambia tu salida de red')" /><ToolItem icon="apps" :title="t('Tienda de Zi0n')" :text="t('Apps revisadas para la capa oculta')" active /></ul>
    </Specimen>

    <Specimen id="ds-phone" :title="t('Visual de teléfono')" code='<PhoneVisual :src="asset(`assets/home/phone-apps.png`)" width="525" height="1087" tone="aurora" />'>
      <div class="phone-demo"><PhoneVisual :src="asset('assets/home/phone-apps.png')" width="525" height="1087" tone="aurora" /><PhoneVisual :src="asset('assets/home/phone-zion.png')" width="556" height="1149" tone="signal" /></div>
    </Specimen>

    <Specimen id="ds-compare" :title="t('Comparador de capas')" :text="t('Arrastra la línea o usa las flechas del teclado.')" code='<LayerCompare variant="cripto" :base="{ src, alt }" :visible="{ src, alt }">chips…</LayerCompare>'>
      <div class="cmp-cripto"><LayerCompare variant="cripto" :aria-label="t('Comparador: lo que ve otra persona y tu capa oculta')" :handle-label="t('Deslizar para comparar las dos capas')" :base="{ src: asset('assets/cripto/phone-oculta.png'), width: 600, height: 596, alt: '' }" :visible="{ src: asset('assets/cripto/phone-visible.png'), width: 600, height: 596, alt: '' }" /></div>
      <div class="cmp-graphene surface-graphene"><LayerCompare variant="graphene" :aria-label="t('Comparador: capa visible y capa oculta del teléfono')" :handle-label="t('Deslizar para ver la capa oculta')" :base="{ src: asset('assets/grapheneos/phone-oculta.png'), alt: '' }" :visible="{ src: asset('assets/grapheneos/phone-visible.png'), alt: '' }" /></div>
    </Specimen>

    <Specimen id="ds-step" dark-only :title="t('Pasos')" code='<StepCard :number="1" icon="qrcode" tone="aurora" title="…" text="…" />  <StepCard variant="compact" … />'>
      <div class="grid3">
        <StepCard :number="1" icon="qrcode" tone="aurora" :title="t('Instalas por QR')" :text="t('Activa tu entorno seguro en minutos.')" />
        <StepCard :number="3" icon="refresh" tone="signal" :title="t('Operas como siempre')" :text="t('Mismas apps, mismo flujo, en tiempo real.')" />
        <StepCard :number="4" icon="trash" tone="alert" :title="t('Si algo sale mal, se borra')" :text="t('El sistema se elimina antes de dar acceso.')" />
      </div>
      <ol class="col next-demo"><StepCard variant="compact" :number="1" :title="t('Abre el correo de Zi0n')" :text="t('Si no lo ves en unos minutos, revisa la carpeta de spam.')" /><StepCard variant="compact" :number="2" :title="t('Escanea el QR')" :text="t('Hazlo desde el celular que vas a proteger.')" /></ol>
    </Specimen>

    <Specimen id="ds-toast" :title="t('Aviso (toast)')" code="const toast = useToast(); toast.show('Copiado')">
      <Button variant="ghost" size="md" @click="toast.show(t('Esto es un aviso de ejemplo'))">{{ t('Mostrar aviso') }}</Button>
    </Specimen>

    <Specimen id="ds-field" dark-only :title="t('Campos del checkout')" surface="checkout" code='<TextField id="email" v-model="email" label="Correo" icon="mail" state="good" />'>
      <div class="col form-demo">
        <TextField id="dsMail" v-model="mail" :label="t('¿A qué correo te enviamos el QR?') + ' · ' + t('válido')" icon="mail" state="good" placeholder="hola@correo.com"><template #help><p class="fhelp">{{ t('Revisa que esté bien escrito: ahí llega tu código de instalación.') }}</p></template></TextField>
        <TextField id="dsMailBad" v-model="mailBad" :label="t('Correo') + ' · ' + t('con error')" icon="mail" state="bad"><template #help><p class="fhelp bad">{{ t('Ese correo no parece válido. Revisa que tenga @ y un dominio.') }}</p></template></TextField>
        <div class="row2-demo">
          <TextField id="dsCard" size="lg" icon="credit-card" :label="t('Número de la tarjeta')" placeholder="1234 5678 9012 3456" />
          <SelectField id="dsNet" v-model="net" :label="t('Red')" :options="[{ value: 'Polygon', label: 'Polygon' }, { value: 'Ethereum', label: 'Ethereum' }, { value: 'Tron', label: 'Tron (TRC-20)' }]" />
        </div>
      </div>
    </Specimen>

    <Specimen id="ds-radio" dark-only :title="t('Opciones (radio card)')" surface="checkout" code='<RadioCard v-model="tipo" variant="option" name="tipo" value="prueba" icon="gift" … />'>
      <div class="col form-demo">
        <RadioCard v-model="tipo" variant="option" name="dsTipo" value="prueba" icon="gift" tone="signal" :title="t('15 días de prueba')" :text="t('Quiero probar Zi0n sin compromiso.')" :tag="{ label: t('Gratis'), tone: 'signal' }" />
        <RadioCard v-model="tipo" variant="option" name="dsTipo" value="restauracion" icon="restore" tone="alert" :title="t('Restauración')" :text="t('Mi dispositivo se borró y necesito restaurarlo.')" />
        <div class="plans-demo">
          <RadioCard v-model="plan" variant="plan" name="dsPlan" value="90" :title="t('90 días')" price="$150" currency="USD" :text="t('$1,67 al día')" />
          <RadioCard v-model="plan" variant="plan" name="dsPlan" value="180" :title="t('180 días')" price="$269" currency="USD" :text="t('$1,49 al día')" :tag="{ label: t('Ahorras 10%'), tone: 'amber' }" />
        </div>
        <div class="plans-demo">
          <RadioCard v-model="store" variant="store" name="dsStore" value="exchange" :title="t('Tienda Exchange')" :text="t('Aplicaciones centralizadas de instalación segura.')" :apps="storeIcons(['coingecko', 'coinmarketcap', 'ledger', 'trezor', 'uniswap'])" :more="24" :action-label="fmt('Ver las {n} apps', { n: 29 })" />
          <RadioCard v-model="store" variant="store" name="dsStore" value="web3" :title="t('Tienda Web3')" :text="t('Aplicaciones descentralizadas del universo Web3.')" :apps="storeIcons(['metamask', 'phantom', 'uniswap', 'trust', 'exodus'])" :more="11" :action-label="fmt('Ver las {n} apps', { n: 16 })" />
        </div>
      </div>
    </Specimen>

    <Specimen id="ds-method" dark-only :title="t('Método de pago')" surface="checkout" code='<PaymentMethod v-model="metodo" value="card" cards :logos="[…]" />'>
      <div class="col form-demo">
        <PaymentMethod v-model="metodo" name="dsMetodo" value="crypto" :title="t('Stablecoins')" :text="t('USDT o USDC · procesado por Cryptomus')" :logos="[{ src: asset('assets/compra/usdt.png'), width: 24, height: 24, alt: 'USDT' }, { src: asset('assets/compra/usdc.png'), width: 24, height: 24, alt: 'USDC' }]" />
        <PaymentMethod v-model="metodo" name="dsMetodo" value="card" cards :title="t('Tarjeta de crédito')" :text="t('Visa, Mastercard o Amex · procesado por Stripe')" :logos="[{ src: asset('assets/compra/visa.png'), width: 46, height: 15, alt: 'Visa' }, { src: asset('assets/compra/mastercard.png'), width: 26, height: 16, alt: 'Mastercard' }, { src: asset('assets/compra/amex.png'), width: 22, height: 22, alt: 'American Express' }]" />
      </div>
    </Specimen>

    <Specimen id="ds-summary" :title="t('Resumen del pedido')" surface="checkout" code='<OrderSummary :lines="{ tipo, tienda, plan, mail }" total="$269 USD" />'>
      <div class="summary-demo"><OrderSummary pay :lines="summaryLines" total="$269 USD"><template #footer><p class="proc-demo"><span class="ico"><Icon name="lock" /></span>{{ t('Pago procesado por Stripe') }}</p></template></OrderSummary></div>
    </Specimen>

    <Specimen id="ds-bar" :title="t('Barra fija inferior')" surface="checkout" code='<StickyBar :show-back="true" hint="…" total="$269 USD" next-label="Continuar" next-icon />'>
      <div class="bar-demo"><StickyBar :hint="t('Elige una tienda de apps.')" total="$269 USD" :next-label="t('Continuar')" :next-disabled="true" next-icon /></div>
    </Specimen>
  </main>
</div>
<Toast />
</div>
</template>

<style scoped>
.pg-ds{min-height:100vh;background:var(--color-ink)}
.ds-top{position:sticky;top:0;z-index:30;background:var(--color-nav-bg);backdrop-filter:blur(var(--zn-blur-12));-webkit-backdrop-filter:blur(var(--zn-blur-12));border-bottom:1px solid var(--color-line)}
.ds-top-in{display:flex;align-items:center;gap:var(--zn-space-16);max-width:1440px;margin:0 auto;padding:var(--zn-space-14) var(--zn-space-24)}
.ds-logo img{height:26px;width:auto}
.ds-name{flex:1;font:var(--zn-weight-medium) 13px/18px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--color-signal)}
.ds-shell{display:grid;grid-template-columns:240px minmax(0,1fr);gap:var(--zn-space-40);max-width:1440px;margin:0 auto;padding:0 var(--zn-space-24)}
.ds-side{position:sticky;top:70px;align-self:start;max-height:calc(100vh - 70px);overflow-y:auto;padding:var(--zn-space-32) 0}
.ds-side nav{display:flex;flex-direction:column;gap:var(--zn-space-6);margin-bottom:var(--zn-space-24)}
.ds-side .eyebrow{color:var(--color-muted);margin-bottom:var(--zn-space-4)}
.ds-side a{font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--color-ice)}
.ds-side a:hover{color:var(--color-signal)}
.ds-main{min-width:0;padding-bottom:var(--zn-space-96)}
.ds-intro{display:flex;flex-direction:column;gap:var(--zn-space-16);padding:var(--zn-space-56) 0 var(--zn-space-40);max-width:760px}
.ds-pill{display:inline-flex;align-self:flex-start;padding:var(--zn-space-4) var(--zn-space-12);border-radius:var(--radius-pill);background:var(--color-glass);border:1px solid var(--color-line);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--color-ice)}
.ds-block{padding:var(--zn-space-48) 0;border-top:1px solid var(--color-line);display:flex;flex-direction:column;gap:var(--zn-space-16)}
.ds-sub{display:flex;flex-direction:column;gap:var(--zn-space-12);margin-top:var(--zn-space-16)}
.ds-comp-t{padding-top:var(--zn-space-48);border-top:1px solid var(--color-line)}
code{font:var(--zn-weight-medium) 12px/18px var(--font-mono);color:var(--color-ice)}
small{font:var(--zn-weight-regular) 12px/16px var(--font-sans);color:var(--color-muted)}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:var(--zn-space-12)}
.sw{display:flex;flex-direction:column;gap:var(--zn-space-4);padding:var(--zn-space-10);border-radius:var(--zn-radius-16);border:1px solid var(--color-line);background:rgba(var(--rgb-white),.02);min-width:0}
.sw code{overflow-wrap:anywhere}
.sw-c{height:64px;border-radius:var(--zn-radius-10);border:1px solid var(--color-line);margin-bottom:var(--zn-space-6)}
.sw b{font:var(--zn-weight-semibold) 14px/20px var(--font-sans);color:var(--color-mist)}
.tbl-wrap{overflow-x:auto}
.tbl{width:100%;border-collapse:collapse;font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--color-ice)}
.tbl th{text-align:left;font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;color:var(--color-muted);padding:var(--zn-space-8)}
.tbl td{padding:var(--zn-space-8);border-top:1px solid var(--color-line);vertical-align:middle}
.tbl.type td:nth-child(2){min-width:320px}
.dot-sw{display:inline-block;width:28px;height:28px;border-radius:var(--zn-radius-8);border:1px solid var(--color-line)}
.spaces{display:flex;flex-direction:column;gap:var(--zn-space-6)}
.sp-row{display:grid;grid-template-columns:150px 1fr 50px;align-items:center;gap:var(--zn-space-12)}
.sp-bar{height:12px;border-radius:3px;background:linear-gradient(90deg,var(--color-aurora),var(--color-signal))}
.radii,.shadows,.blurs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--zn-space-16)}
.rd-i,.sh-i,.bl-i{position:relative;display:flex;flex-direction:column;gap:var(--zn-space-6);min-width:0}
.rd-i span{width:72px;height:72px;border:1.5px solid var(--color-signal);background:rgba(var(--rgb-signal),.08)}
.sh-i span{width:100%;height:72px;border-radius:var(--zn-radius-16);background:var(--zn-surface-checkout);border:1px solid var(--color-line);margin-bottom:var(--zn-space-12)}
.sh-i small{overflow-wrap:anywhere}
.bl-under{position:absolute;left:10px;top:10px;width:50px;height:50px;border-radius:50%;background:var(--color-signal)}
.bl-glass{position:relative;width:100%;height:72px;border-radius:var(--zn-radius-16);border:1px solid var(--color-line);background:rgba(var(--rgb-ink),.4)}
.ease-demo{position:relative;height:56px;border-radius:var(--zn-radius-16);border:1px solid var(--color-line);background:rgba(var(--rgb-white),.02)}
.ease-ball{position:absolute;left:12px;top:12px;width:32px;height:32px;border-radius:50%;background:var(--color-signal);box-shadow:0 0 18px rgba(var(--rgb-signal),.6);transition:left var(--zn-dur-1200) var(--ease)}
.ease-demo:hover .ease-ball{left:calc(100% - 44px)}
.durs{display:flex;flex-wrap:wrap;gap:var(--zn-space-8)}
.durs code{padding:var(--zn-space-4) var(--zn-space-10);border-radius:var(--radius-pill);border:1px solid var(--color-line)}
.icons{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:var(--zn-space-10)}
.ic-i{display:flex;flex-direction:column;align-items:center;gap:var(--zn-space-8);padding:var(--zn-space-14) var(--zn-space-6);border-radius:var(--zn-radius-12);border:1px solid var(--color-line);text-align:center}
.ic-i .ico{width:24px;height:24px;color:var(--color-mist)}
.col{display:flex;flex-direction:column;gap:var(--zn-space-16);width:100%;min-width:0}
.row{display:flex;flex-wrap:wrap;align-items:center;gap:var(--zn-space-12)}
.ds-label{font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.8px;text-transform:uppercase;color:var(--color-muted)}
.ds-focus{outline:2px solid var(--color-signal);outline-offset:3px}
.chips-demo .chip{position:relative;left:auto;top:auto}
.nav-demo .nav{position:relative;min-width:1180px}
.foot-demo .footer,.foot-demo .foot{min-width:1100px}
.nav-demo .mmenu{display:none!important}
.nav-demo,.foot-demo{overflow-x:auto}
.previews{display:flex;gap:var(--zn-space-16);overflow-x:auto;padding:var(--zn-space-8) 0 var(--zn-space-24)}
.previews figure{margin:0;display:flex;flex-direction:column;gap:var(--zn-space-8);flex:none}
.previews iframe{border:1px solid var(--color-line);border-radius:var(--zn-radius-20);background:var(--color-ink)}
.demo-card{width:min(100%,340px)}
.faq-bar-demo .faq{width:min(100%,680px)}
.faq-bar-demo :deep(.fbar){width:100%}
.faq-bar-demo :deep(.fa p){width:auto}
.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--zn-space-20);width:100%}
.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--zn-space-20);width:100%}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--zn-space-20);width:100%}
.tools-demo{display:grid;gap:var(--zn-space-10);width:min(100%,300px)}
.phone-demo{display:flex;flex-wrap:wrap;gap:var(--zn-space-24);overflow:hidden;--phone-w:200px}
.cmp-cripto{position:relative;width:calc(568px * .55);height:calc(620px * .55);--hs:.55}
.cmp-graphene{zoom:.55}
.next-demo,.form-demo{max-width:560px}
.row2-demo,.plans-demo{display:grid;grid-template-columns:1fr 1fr;gap:var(--zn-space-12)}
.fhelp{font:var(--zn-weight-regular) 13px/18px var(--font-sans);color:var(--color-muted)}
.fhelp.bad{color:var(--color-alert)}
.summary-demo{width:min(100%,380px)}
.proc-demo{display:flex;align-items:center;gap:var(--zn-space-8);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.4px;text-transform:uppercase;color:var(--color-muted)}
.proc-demo .ico{width:16px;height:16px;color:var(--color-signal)}
.bar-demo{width:100%;--pad:20px}
.bar-demo .bar{position:relative;animation:none}
@media (max-width:1023px){
  .ds-shell{grid-template-columns:1fr}
  .ds-side{display:none}
  .grid4{grid-template-columns:repeat(2,minmax(0,1fr))}
  .grid3,.grid2{grid-template-columns:1fr}
}
@media (max-width:640px){
  .grid4,.row2-demo,.plans-demo{grid-template-columns:1fr}
  .sp-row{grid-template-columns:120px 1fr 44px}
}
</style>
