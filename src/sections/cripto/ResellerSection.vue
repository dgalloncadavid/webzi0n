<script setup>
/* Cripto · banda para distribuidores. */
import Button from '@/design-system/components/Button.vue'
import { useT } from '@/design-system/composables/useLang'
const { t } = useT()
</script>

<template>
<section class="sec dist" :aria-label="t('Distribuidores')">
  <div class="wrap">
    <div v-reveal class="dband rv">
      <div><h2 class="h4">{{ t('¿Quieres distribuir Zi0n?') }}</h2><p class="small">{{ t('Tiendas de tecnología móvil y proveedores de TI pueden revender Zi0n a sus clientes.') }}</p></div>
      <Button to="#prueba" size="sm" variant="primary">{{ t('Solicitar demostración') }}</Button>
    </div>
  </div>
</section>
</template>

<style scoped>
.dist{padding-top:24px}
.dband{display:flex;align-items:center;justify-content:space-between;gap:var(--zn-space-24);padding:var(--zn-space-28) var(--zn-space-32);border-radius:var(--zn-radius-20);border:1px solid var(--color-line);background:linear-gradient(90deg,rgba(var(--rgb-aurora),.14),rgba(var(--rgb-white),.03))}
.dband .small{margin-top:var(--zn-space-4)}
@media (max-width:640px){
  .dband{flex-direction:column;align-items:flex-start;padding:var(--zn-space-24) var(--zn-space-20)}
  .dband .btn{width:100%}
}
</style>
