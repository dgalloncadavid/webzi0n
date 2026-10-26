<script setup>
/* Cripto · preguntas frecuentes en dos columnas (una abierta a la vez entre ambas). */
import { computed } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Accordion from '@/design-system/components/Accordion.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const items = computed(() => [
  ['¿Qué dispositivos son compatibles?', 'Zi0n se instala sobre dispositivos Android, como Samsung o Pixel, y también sobre dispositivos con GrapheneOS para reforzar la seguridad.'],
  ['¿Funciona sobre GrapheneOS?', 'Sí. Zi0n se instala encima de GrapheneOS y le suma la capa oculta y los disparadores de borrado.'],
  ['¿Qué tan seguro es Zi0n Cripto?', 'Zi0n aísla tus wallets en una capa oculta y elimina el sistema si detecta un cable, un cambio de SIM, mucho tiempo sin señal, el temporizador o un PIN de pánico. Ningún sistema es infalible: Zi0n reduce lo que alguien puede sacar de tu celular si lo tiene en la mano.'],
  ['¿Cuál es la política de reembolsos?', 'Tienes 15 días de prueba para decidir y puedes cancelar sin compromiso. Para casos fuera de ese periodo, escríbele a soporte.'],
  ['¿Qué pasa con mi información? ¿Se almacena?', 'Tu información se queda en el dispositivo, dentro de la capa oculta. Si el sistema se borra, todo lo que había dentro se elimina con él.'],
  ['Si se borra el dispositivo, ¿puedo recuperar la información?', 'Lo que estaba en el dispositivo no se recupera. Tus criptos siguen en la blockchain: reinstalas Zi0n por QR y reimportas tus wallets con tus credenciales.'],
  ['Si quiero una app diferente del listado, ¿cómo la instalo?', 'Escríbele a soporte con el nombre de la app y la evaluamos para la tienda de Zi0n.'],
  ['¿Puedo instalar Zi0n en un iPhone?', 'No. Zi0n se instala sobre dispositivos Android, como Samsung o Pixel, y sobre GrapheneOS.'],
  ['¿Pierdo los accesos de mis apps al eliminar el sistema?', 'No pierdes tus fondos. Al reinstalar Zi0n por QR, reimportas tus credenciales y recuperas el acceso a tus apps.']
].map(([q, a]) => ({ q: t(q), a: t(a) })))
</script>

<template>
<section class="sec" id="faq" :aria-label="t('Preguntas frecuentes')">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Preguntas frecuentes')" :title="t('Seguridad y especificaciones')" />
    <Accordion :items="items" variant="line" :columns="[5, 4]" />
  </div>
</section>
</template>
