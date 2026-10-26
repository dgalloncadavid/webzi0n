<script setup>
/* Lista desplegable del checkout. options: [{ value, label, disabled? }] */
import Icon from './Icon.vue'

defineOptions({ inheritAttrs: false })
defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  options: { type: Array, required: true },
  size: { type: String, default: 'md' },
  state: { type: String, default: '' }
})
const model = defineModel({ type: String, default: '' })
</script>

<template><div class="field"><label :for="id">{{ label }}</label><div class="inp sel" :class="[{ lg: size === 'lg' }, state]"><select :id="id" v-bind="$attrs" v-model="model"><option v-for="o in options" :key="o.value" :value="o.value" :disabled="o.disabled">{{ o.label }}</option></select><span class="ico"><Icon name="chevron-down" /></span></div></div></template>

<style scoped>
.field{display:flex;flex-direction:column;gap:var(--zn-space-8);margin-top:var(--zn-space-8);min-width:0}
.field label{font:var(--zn-weight-medium) 14px/20px var(--font-sans);color:var(--color-mist)}
.inp{position:relative;display:flex;align-items:center;gap:var(--zn-space-10);height:54px;padding:0 var(--zn-space-16);border-radius:var(--radius-field);border:1px solid var(--color-line-strong);background:rgba(var(--rgb-ink),.6);transition:border-color var(--dur-fast),box-shadow var(--dur-fast);min-width:0}
.inp:focus-within{border-color:var(--color-signal);box-shadow:var(--shadow-focus-ring)}
.inp.bad{border-color:var(--color-alert);box-shadow:var(--shadow-danger-ring)}
.inp>.ico{width:18px;height:18px;color:var(--color-muted)}
.inp select{flex:1;min-width:0;height:100%;border:0;background:none;outline:0;font:var(--zn-weight-regular) 16px/24px var(--font-sans);color:var(--color-mist)}
.inp.sel select{appearance:none;-webkit-appearance:none;cursor:pointer;padding-right:24px}
.inp.sel select option{background:var(--zn-surface-checkout);color:var(--color-mist)}
.inp.sel>.ico{position:absolute;right:14px;pointer-events:none}
.inp.lg{height:60px;border-radius:var(--zn-radius-14)}
.inp.lg select{font-size:18px}
@media (max-width:640px){
  .inp.lg{height:56px}
}
</style>
