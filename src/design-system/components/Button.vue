<script setup>
/* Botón o enlace con forma de botón.
   variant: primary | ghost | navy | secondary | text
   size:    sm | md | lg | xl  (xl es la densidad del checkout: 52 px de alto y radio 12) */
import { computed, toRef } from 'vue'
import { useLinkTo } from '../composables/useLinkTo'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  /** Ruta interna ('/compra?tipo=prueba'), ancla ('#planes') o URL. Sin `to` se dibuja un <button>. */
  to: { type: [String, Object], default: null },
  /** Se dibuja como <span> (por ejemplo dentro de una tarjeta que ya es enlace) */
  inert: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
  /** aria-disabled ('true' | 'false'). El botón sigue recibiendo clics, como en el original */
  disabled: { type: Boolean, default: null }
})

const link = useLinkTo(toRef(props, 'to'))
const tag = computed(() => (props.inert ? 'span' : props.to != null ? 'a' : 'button'))
const classes = computed(() => ['btn', props.size && 'btn-' + props.size, 'btn-' + props.variant])
</script>

<template>
  <component
    :is="tag"
    :class="classes"
    :href="tag === 'a' ? link.href.value : undefined"
    :type="tag === 'button' ? type : undefined"
    :aria-disabled="disabled === null ? undefined : String(disabled)"
    @click="tag === 'a' && link.onClick($event)"
  ><slot /></component>
</template>

<style scoped>
.btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--zn-space-8);border-radius:var(--radius-button);font-family:var(--font-sans);font-weight:var(--zn-weight-semibold);white-space:nowrap;transition:transform var(--dur-base) var(--ease),box-shadow var(--dur-base),background var(--dur-base),border-color var(--dur-base)}
.btn-lg{padding:var(--zn-space-16) var(--zn-space-32);font-size:16px;line-height:24px}
.btn-sm{padding:var(--zn-space-12) var(--zn-space-24);font-size:14px;line-height:20px}
.btn-md{padding:var(--zn-space-12) var(--zn-space-24);font-size:15px;line-height:22px}
.btn-primary{background:var(--color-signal);color:var(--color-ink)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:var(--shadow-button-primary-hover)}
.btn-ghost{border:1px solid var(--color-line-ghost);color:var(--color-mist)}
.btn-ghost:hover{transform:translateY(-2px);border-color:var(--color-ice);background:rgba(var(--rgb-white),.04)}
.btn-navy{background:var(--color-navy);color:var(--color-mist)}
.btn-navy:hover{transform:translateY(-2px);background:var(--zn-navy-hover);box-shadow:var(--shadow-button-navy-hover)}
.btn-secondary{background:var(--color-navy);color:var(--color-mist)}
.btn-secondary:hover{transform:translateY(-2px);background:var(--zn-navy-hover-graphene)}

/* densidad del checkout */
.btn-xl{min-height:52px;padding:var(--zn-space-14) var(--zn-space-26);border-radius:var(--radius-button-checkout);font:var(--zn-weight-semibold) 16px/24px var(--font-sans);transition:transform var(--dur-fast) var(--ease),box-shadow var(--dur-base),background var(--dur-base),border-color var(--dur-base),opacity var(--dur-base)}
.btn-xl :deep(.ico){width:18px;height:18px}
.btn-xl.btn-primary:hover{transform:translateY(-1px);box-shadow:var(--shadow-button-primary-hover-checkout)}
.btn-primary[aria-disabled="true"]{background:rgba(var(--rgb-ice),.14);color:rgba(var(--rgb-mist),.45);box-shadow:none;transform:none}
.btn-xl.btn-ghost{border-color:var(--color-line-strong)}
.btn-xl.btn-ghost:hover{transform:none}
.btn-text{padding:var(--zn-space-14) var(--zn-space-12);color:var(--color-ice);text-decoration:underline;text-underline-offset:4px;font-weight:var(--zn-weight-medium)}
.btn-text:hover{color:var(--color-mist)}
</style>
