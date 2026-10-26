<script setup>
/* Aviso flotante inferior. Se controla con useToast(). */
import { useToast } from '../composables/useToast'
const { message, visible } = useToast()
</script>

<template><div class="toast" :class="{ on: visible }" id="toast" role="status">{{ message }}</div></template>

<style scoped>
.toast{position:fixed;left:50%;bottom:calc(24px + env(safe-area-inset-bottom));transform:translate(-50%,20px);padding:var(--zn-space-10) var(--zn-space-16);border-radius:var(--zn-radius-12);background:var(--color-signal);color:var(--color-ink);font:var(--zn-weight-semibold) 14px/20px var(--font-sans);opacity:0;pointer-events:none;transition:var(--dur-medium) var(--ease);z-index:60}
.toast.on{opacity:1;transform:translate(-50%,0)}
</style>
