<script setup>
import './grapheneos.css'
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import HeroSection from '@/sections/grapheneos/HeroSection.vue'
import ErrorsSection from '@/sections/grapheneos/ErrorsSection.vue'
import LayerSection from '@/sections/grapheneos/LayerSection.vue'
import PinSection from '@/sections/grapheneos/PinSection.vue'
import TriggersSection from '@/sections/grapheneos/TriggersSection.vue'
import CompareSection from '@/sections/grapheneos/CompareSection.vue'
import FaqSection from '@/sections/grapheneos/FaqSection.vue'
import CtaSection from '@/sections/grapheneos/CtaSection.vue'
import dict from '@/i18n/en/grapheneos'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { setRevealOptions } from '@/design-system/directives/reveal'

provideDict(dict)
/* el original busca la descripción en inglés con una clave que no existe: queda en español (ver NOTES.md) */
usePageMeta(dict, {
  title: 'Zi0n para GrapheneOS',
  description: 'Zi0n se instala sobre tu GrapheneOS, borra lo que olvidas y te avisa antes de borrar todo.',
  translateDescription: false
})
setRevealOptions({ threshold: 0.2, rootMargin: '0px 0px -6% 0px' })

/* escala del lienzo de 1280 px: en escritorio se aplica zoom; bajo 1024 px el layout es fluido */
const vars = reactive({})
const MQ = window.matchMedia('(max-width:1023px)')
function fit() {
  const w = document.documentElement.clientWidth || window.innerWidth
  const m = MQ.matches
  const z = m ? 1 : Math.min(1, w / 1280)
  const vw = w / z
  const hs = Math.min(1, (w - 40) / 541.2)
  const os = Math.min(1, (w - 40) / 560)
  vars['--z'] = z.toFixed(4)
  vars['--vw'] = vw.toFixed(1) + 'px'
  vars['--gut'] = Math.max(0, (vw - 1280) / 2).toFixed(1) + 'px'
  vars['--mw'] = String(w)
  vars['--hs'] = hs.toFixed(4)
  vars['--hinv'] = Math.min(1.6, 1 / hs).toFixed(4)
  vars['--os'] = os.toFixed(4)
}
fit()
onMounted(() => { fit(); window.addEventListener('resize', fit) })
onBeforeUnmount(() => window.removeEventListener('resize', fit))

const links = [
  { label: '¿Qué es?', to: '#errores' },
  { label: '¿Qué incluye?', to: '#capa' },
  { label: 'Aplicaciones', to: '#disparadores' },
  { label: 'Blog', to: '#faq' }
]
const legal = [
  { label: 'Aviso legal', to: '#' },
  { label: 'Términos y condiciones', to: '#' },
  { label: 'Política de cookies', to: '#' },
  { label: 'Canal de YouTube', to: '#' }
]
</script>

<template>
<div class="pg-graphene surface-graphene" :style="vars">
<Navbar variant="graphene" :links="links" />

<main>
<HeroSection />
<ErrorsSection />
<LayerSection />
<PinSection />
<TriggersSection />
<CompareSection />
<FaqSection />
<CtaSection />
</main>

<Footer variant="graphene" :links="legal" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." />
</div>
</template>
