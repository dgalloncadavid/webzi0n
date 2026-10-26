<script setup>
/* Inicio · preguntas frecuentes: columna fija a la izquierda y acordeón. */
import { computed } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Button from '@/design-system/components/Button.vue'
import Accordion from '@/design-system/components/Accordion.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const items = computed(() => [
  ['¿En qué celulares funciona?', 'En celulares Samsung compatibles con eSIM. Si usas un Pixel con GrapheneOS, tenemos una versión pensada para ti.'],
  ['¿Necesito cambiar de teléfono?', 'No. Zi0n se instala en tu Samsung con un código QR y tu capa visible sigue funcionando como siempre.'],
  ['¿Qué pasa si se activa el borrado?', 'Se elimina lo que guardas en Zi0n. Después puedes restaurar tu licencia y volver a instalarlo en minutos.'],
  ['¿Cómo pago?', 'Con stablecoins (USDT o USDC) o con tarjeta de crédito. Al terminar recibes tu QR de activación.']
].map(([q, a]) => ({ q: t(q), a: t(a) })))
</script>

<template>
<section class="sec" id="faq" aria-labelledby="f-t">
  <div class="wrap faqw">
    <div v-reveal class="fleft rv">
      <SectionHeader align="left" :eyebrow="t('Preguntas frecuentes')" :title="t('Lo que más nos preguntan')" title-id="f-t" :lead="t('Si te queda una duda, escríbenos y te respondemos en el día.')" />
      <Button to="#" size="md" variant="ghost">{{ t('Hablar con un asesor') }}</Button>
    </div>
    <Accordion :items="items" variant="line" reveal button-type="button" />
  </div>
</section>
</template>

<style scoped>
.faqw{display:grid;grid-template-columns:360px minmax(0,1fr);gap:var(--zn-space-64);align-items:start}
.fleft{display:flex;flex-direction:column;gap:var(--zn-space-24);align-items:flex-start;position:sticky;top:110px}
.fleft .shead{margin:0}
.faqw .faq{grid-template-columns:1fr;gap:0}
@media (max-width:1023px){
  .faqw{grid-template-columns:1fr;gap:var(--zn-space-32)}
  .fleft{position:static}
}
</style>
