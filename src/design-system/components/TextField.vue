<script setup>
/* Campo de texto del checkout.
   size: md (54 px) | lg (60 px, formulario de tarjeta)
   state: '' | 'good' | 'bad'
   Slots: suffix (dentro de la caja, después del input) y help (debajo).
   Se adapta al tema. */
import { ref } from 'vue'
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '' },
  size: { type: String, default: 'md' },
  state: { type: String, default: '' }
})
const model = defineModel({ type: String, default: '' })
const input = ref(null)
defineExpose({ focus: () => input.value.focus(), el: input })
</script>

<template><div class="field"><label :for="id">{{ label }}</label><div class="inp" :class="[{ lg: size === 'lg' }, state]"><span v-if="icon" class="ico"><Icon :name="icon" /></span><input :id="id" ref="input" v-bind="$attrs" v-model="model"><slot name="suffix" /></div><slot name="help" /></div></template>

<style scoped>
.field{display:flex;flex-direction:column;gap:var(--zn-space-8);margin-top:var(--zn-space-8);min-width:0}
.field label{font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--ui-text)}
.inp{position:relative;display:flex;align-items:center;gap:var(--zn-space-10);height:54px;padding:0 var(--zn-space-16);border-radius:var(--radius-field);border:1px solid var(--ui-border);background:var(--ui-field);transition:border-color var(--dur-fast),box-shadow var(--dur-fast);min-width:0}
.inp:focus-within{border-color:var(--ui-focus);box-shadow:var(--ui-focus-shadow)}
.inp.bad{border-color:var(--ui-accent-alert);box-shadow:var(--shadow-danger-ring)}
/* con teclado, un campo con error o válido también muestra el foco (main.js marca html.kbd) */
.kbd .inp.bad:focus-within,.kbd .inp.good:focus-within{border-color:var(--ui-focus)}
.inp.good{border-color:var(--ui-good-border)}
.inp>:deep(.ico){width:18px;height:18px;color:var(--ui-muted)}
.inp input{flex:1;min-width:0;width:100%;height:100%;border:0;background:none;outline:0;font:var(--zn-weight-regular) 16px/24px var(--font-sans);color:var(--ui-text)}
.inp input::placeholder{color:var(--ui-placeholder)}
.inp :deep(.brand){width:40px;height:auto;max-height:24px;object-fit:contain;padding:3px 5px;border-radius:var(--zn-radius-5);background:var(--color-white)}
.inp :deep(.tip){cursor:help}
.inp.lg{height:60px;border-radius:var(--zn-radius-14)}
.inp.lg input{font-size:18px}
@media (max-width:640px){
  .inp.lg{height:56px}
}
</style>
