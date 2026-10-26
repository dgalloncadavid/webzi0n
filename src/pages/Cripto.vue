<script setup>
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import HeroSection from '@/sections/cripto/HeroSection.vue'
import StatsSection from '@/sections/cripto/StatsSection.vue'
import RiskSection from '@/sections/cripto/RiskSection.vue'
import DilemmaSection from '@/sections/cripto/DilemmaSection.vue'
import StepsSection from '@/sections/cripto/StepsSection.vue'
import RecoverySection from '@/sections/cripto/RecoverySection.vue'
import FeaturesSection from '@/sections/cripto/FeaturesSection.vue'
import AppsSection from '@/sections/cripto/AppsSection.vue'
import TrialSection from '@/sections/cripto/TrialSection.vue'
import FaqSection from '@/sections/cripto/FaqSection.vue'
import ResellerSection from '@/sections/cripto/ResellerSection.vue'
import dict from '@/i18n/en/cripto'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { setRevealOptions } from '@/design-system/directives/reveal'

provideDict(dict)
usePageMeta(dict, {
  title: 'Zi0n Cripto',
  description: 'Opera con tus wallets de siempre dentro de una capa oculta que se borra si alguien intenta forzarla.'
})
setRevealOptions({ threshold: 0.18, rootMargin: '0px 0px -6% 0px' })

const links = [
  { label: '¿Qué es?', to: '#riesgo' },
  { label: '¿Qué incluye?', to: '#funciones' },
  { label: 'Aplicaciones', to: '#apps' },
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
<div class="pg-cripto surface-landing">
<Navbar variant="cripto" :links="links" />

<main>
<HeroSection />
<StatsSection />
<RiskSection />
<DilemmaSection />
<StepsSection />
<RecoverySection />
<FeaturesSection />
<AppsSection />
<TrialSection />
<FaqSection />
<ResellerSection />
</main>

<Footer variant="cripto" :links="legal" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." />
</div>
</template>
