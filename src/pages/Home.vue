<script setup>
import './home.css'
import Navbar from '@/design-system/components/Navbar.vue'
import Footer from '@/design-system/components/Footer.vue'
import HeroSection from '@/sections/home/HeroSection.vue'
import HowSection from '@/sections/home/HowSection.vue'
import AudienceSection from '@/sections/home/AudienceSection.vue'
import ToolsSection from '@/sections/home/ToolsSection.vue'
import RoutesSection from '@/sections/home/RoutesSection.vue'
import PlansSection from '@/sections/home/PlansSection.vue'
import FaqSection from '@/sections/home/FaqSection.vue'
import CtaSection from '@/sections/home/CtaSection.vue'
import dict from '@/i18n/en/home'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { setRevealOptions } from '@/design-system/directives/reveal'

provideDict(dict)
usePageMeta(dict, {
  title: 'Zi0n · Privacidad en tu Samsung',
  description: 'Zi0n agrega a tu Samsung una capa oculta que solo tú abres, con avisos y borrado automático si alguien intenta forzar tu teléfono.'
})
setRevealOptions({ threshold: 0.15, rootMargin: '0px 0px -6% 0px' })

const links = [
  { label: 'Cómo funciona', to: '#como' },
  { label: 'Para quién', to: '#para-quien' },
  { label: 'Herramientas', to: '#herramientas' },
  { label: 'Planes', to: '#planes' }
]
const extraLinks = [
  { label: 'GrapheneOS', to: '/grapheneos' },
  { label: 'Cripto', to: '/cripto' }
]
const columns = [
  { title: 'Zi0n', links: [{ label: 'Zi0n para GrapheneOS', to: '/grapheneos' }, { label: 'Zi0n Cripto', to: '/cripto' }, { label: 'Comprar', to: '/compra' }] },
  { title: 'Legal', links: [{ label: 'Aviso legal', to: '#' }, { label: 'Términos y condiciones', to: '#' }, { label: 'Política de cookies', to: '#' }, { label: 'Canal de YouTube', to: '#' }] }
]
</script>

<template>
<div class="pg-home surface-landing surface-home">
<Navbar variant="home" home-to="#top" :links="links" :extra-links="extraLinks" />

<main>
<HeroSection />
<HowSection />
<AudienceSection />
<ToolsSection />
<RoutesSection />
<PlansSection />
<FaqSection />
<CtaSection />
</main>

<Footer variant="home" :columns="columns" copyright="© 2026 Zi0n. Todos los derechos reservados." />
</div>
</template>
