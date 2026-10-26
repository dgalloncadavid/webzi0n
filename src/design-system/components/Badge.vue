<script setup>
/* Badge.
   variant: outline (inicio: borde y fondo tenues del tono, punto con brillo)
            strong  (Cripto: borde del tono y punto que parpadea)
            tag     (checkout: etiqueta compacta, sin punto)
   tone:    signal | aurora | alert | amber
   size:    md | sm */
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'outline' },
  tone: { type: String, default: 'signal' },
  size: { type: String, default: 'md' },
  dot: { type: Boolean, default: true }
})

const TONE = { signal: 'sig', aurora: 'aur', alert: 'alt', amber: 'amb' }
const classes = computed(() => {
  if (props.variant === 'strong') return ['badge-e']
  if (props.variant === 'tag') return ['tag', props.tone === 'amber' ? 'ts' : 'tg']
  return ['badge', 'b-' + TONE[props.tone], props.size === 'sm' && 'sm']
})
</script>

<template><span :class="classes"><i v-if="dot && variant === 'outline'" class="dot"></i><i v-else-if="dot && variant === 'strong'"></i><slot /></span></template>

<style scoped>
/* outline */
.badge{display:inline-flex;align-items:center;gap:var(--zn-space-8);align-self:flex-start;padding:var(--zn-space-5) var(--zn-space-12);border-radius:var(--radius-pill);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;border:1px solid rgba(var(--rgb),.5);background:rgba(var(--rgb),.1);color:var(--color-mist)}
.badge .dot{width:6px;height:6px;border-radius:var(--radius-round);background:rgb(var(--rgb));box-shadow:0 0 8px rgb(var(--rgb))}
.badge.sm{padding:var(--zn-space-3) var(--zn-space-10);font-size:11px;letter-spacing:.6px}
.light .badge{color:var(--color-navy)} /* en secciones claras (planes del inicio) */
.b-sig{--rgb:var(--rgb-signal)}.b-aur{--rgb:var(--rgb-aurora)}.b-alt{--rgb:var(--rgb-alert)}.b-amb{--rgb:var(--rgb-amber)}

/* strong */
.badge-e{display:inline-flex;align-items:center;gap:var(--zn-space-8);padding:var(--zn-space-4) var(--zn-space-12);border-radius:var(--radius-pill);background:rgba(var(--rgb-alert),.16);border:1px solid var(--color-alert);font:var(--zn-weight-medium) 12px/16px var(--font-mono);letter-spacing:.96px;text-transform:uppercase;color:var(--color-mist);white-space:nowrap}
.badge-e i{width:6px;height:6px;border-radius:var(--radius-round);background:var(--color-alert);box-shadow:0 0 6px var(--color-alert);animation:blink var(--zn-dur-1600) var(--zn-ease-in-out) infinite}
@keyframes blink{50%{opacity:.35}}

/* tag */
.tag{display:inline-flex;align-items:center;padding:var(--zn-space-3) var(--zn-space-10);border-radius:var(--radius-pill);font:var(--zn-weight-medium) 11px/16px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;white-space:nowrap}
.tg{background:rgba(var(--rgb-signal),.16);color:var(--color-signal);border:1px solid rgba(var(--rgb-signal),.45)}
.ts{background:rgba(var(--rgb-amber),.14);color:var(--color-amber);border:1px solid rgba(var(--rgb-amber),.4)}
</style>
