<script setup>
/* Encabezado de sección: eyebrow en píldora, título y bajada.
   align: center | left. Se adapta al tema: en un contenedor claro toma los colores claros. */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, default: '' },
  lead: { type: String, default: '' },
  align: { type: String, default: 'center' },
  titleTag: { type: String, default: 'h2' },
  titleId: { type: String, default: undefined }
})
</script>

<template><div class="shead" :class="{ left: align === 'left' }"><span v-if="eyebrow" class="eyebrow-b">{{ eyebrow }}</span><component :is="titleTag" v-if="title" class="h2" :id="titleId">{{ title }}</component><p v-if="lead" class="body-lg">{{ lead }}</p><slot /></div></template>

<style scoped>
.shead{display:flex;flex-direction:column;align-items:center;gap:var(--zn-space-16);max-width:840px;margin:0 auto var(--zn-space-48);text-align:center}
.shead.left{align-items:flex-start;text-align:left;margin-left:0;max-width:680px}
.eyebrow-b{display:inline-flex;align-self:center;padding:var(--zn-space-4) var(--zn-space-12);border-radius:var(--radius-pill);background:var(--ui-raised);border:1px solid var(--ui-line);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--ui-text-2)}
.shead.left .eyebrow-b{align-self:flex-start}
@media (max-width:640px){
  .shead{margin-bottom:var(--zn-space-32);gap:var(--zn-space-12)}
}
</style>
