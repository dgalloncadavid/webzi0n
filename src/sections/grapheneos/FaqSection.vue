<script setup>
/* GrapheneOS · preguntas frecuentes con barra superior que se llena. */
import { computed } from 'vue'
import Accordion from '@/design-system/components/Accordion.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const items = computed(() => [
  ['¿Se puede borrar por error?', 'No. Antes de cualquier borrado, el teléfono suena, vibra y te pide tu PIN.'],
  ['¿Zi0n reemplaza a GrapheneOS?', 'No. Se instala encima de tu GrapheneOS.'],
  ['¿Qué se limpia cada 15 minutos?', 'Cachés, archivos temporales, fotos y archivos enviados, historial de conversaciones y registros del sistema.'],
  ['¿Puedo probarlo?', 'Sí, hay 15 días de prueba.']
].map(([q, a]) => ({ q: t(q), a: t(a) })))
</script>

<template>
<section class="sec s07" id="faq" :aria-label="t('Preguntas frecuentes')">
  <div class="frame" style="height:594px">
    <h2 v-reveal class="h2 abs rv" style="left:80px;top:118px;width:380px">{{ t('Lo que casi todos preguntan') }}</h2>
    <Accordion class="faq-pos" :items="items" variant="bar" style="left:520px;top:96px" />
  </div>
</section>
</template>

<style scoped>
.faq-pos{position:absolute;width:680px}
@media (max-width:1023px){
  .s07 .h2{margin-bottom:20px}
}
</style>
