<script setup>
/* Ícono de Tabler con los mismos trazos del sitio original (ver icons/paths.js). */
import paths from '../icons/paths.js'

defineProps({
  /** Nombre del ícono en icons/paths.js, por ejemplo 'check' o 'arrow-right' */
  name: { type: String, required: true }
})
</script>

<template><svg class="ic" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path v-for="(d, i) in paths[name]" :key="i" :d="d" /></svg></template>
