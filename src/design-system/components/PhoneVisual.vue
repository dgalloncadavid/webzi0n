<script setup>
/* Teléfono con resplandor que respira detrás.
   tone: aurora | signal (color del resplandor). width: ancho de la imagen en px. */
defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' },
  width: { type: [Number, String], required: true },
  height: { type: [Number, String], required: true },
  tone: { type: String, default: 'aurora' }
})
</script>

<template><div class="tvis" :class="'tvis--' + tone"><span class="tglow"></span><img :src="src" :width="width" :height="height" :alt="alt" loading="lazy" draggable="false"></div></template>

<style scoped>
.tvis{position:relative;display:flex;justify-content:center}
.tvis img{position:relative;width:var(--phone-w,330px);height:auto;filter:drop-shadow(0 30px 60px rgba(var(--rgb-black),.5))}
.tglow{position:absolute;width:520px;height:520px;border-radius:var(--radius-round);pointer-events:none;left:50%;top:50%;margin:-260px 0 0 -260px;animation:breathe 6s var(--zn-ease-in-out) infinite}
.tvis--aurora .tglow{background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.35),rgba(var(--rgb-aurora),0))}
.tvis--signal .tglow{background:radial-gradient(closest-side,rgba(var(--rgb-signal),.35),rgba(var(--rgb-signal),0))}
@keyframes breathe{0%,100%{transform:scale(.92);opacity:.8}50%{transform:scale(1.05);opacity:1}}
</style>
