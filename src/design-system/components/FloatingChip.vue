<script setup>
/* Chip flotante sobre los visuales del hero.
   variant: glass   (inicio: cristal con sombra)
            float   (Cripto: flota solo y el punto late)
            compact (GrapheneOS: medidas del lienzo escalado de 1280 px)
   tone:    signal | aurora | alert | ice
   La posición la da quien lo usa (style o clase). */
defineProps({
  variant: { type: String, default: 'glass' },
  tone: { type: String, default: 'signal' }
})
const DOT = { signal: 'sig', aurora: 'aur', alert: 'alt', ice: 'ice' }
</script>

<template><div class="chip" :class="'chip--' + variant"><i class="dot" :class="DOT[tone]"></i><span><slot /></span></div></template>

<style scoped>
.chip{position:absolute;display:flex;align-items:center;white-space:nowrap;border-radius:var(--radius-pill);font-family:var(--font-mono);font-weight:var(--zn-weight-medium);text-transform:uppercase}
.dot{border-radius:var(--radius-round)}

/* glass · inicio */
.chip--glass{gap:var(--zn-space-8);padding:var(--zn-space-9) var(--zn-space-14);background:var(--color-chip-bg);border:1px solid var(--color-line);backdrop-filter:blur(var(--zn-blur-10));-webkit-backdrop-filter:blur(var(--zn-blur-10));font-size:12px;line-height:16px;letter-spacing:.96px;box-shadow:var(--shadow-chip)}
.chip--glass .dot{width:8px;height:8px;background:rgb(var(--rgb));box-shadow:0 0 10px rgb(var(--rgb))}
.chip--glass .dot.sig{--rgb:var(--rgb-signal)}.chip--glass .dot.aur{--rgb:var(--rgb-aurora)}.chip--glass .dot.alt{--rgb:var(--rgb-alert)}.chip--glass .dot.ice{--rgb:var(--rgb-ice)}
.chip--glass>span{display:inline-block}

/* float · Cripto */
.chip--float{z-index:2;gap:var(--zn-space-8);padding:var(--zn-space-8) var(--zn-space-14);background:rgba(var(--rgb-ink),.86);border:1px solid rgba(var(--rgb-ice),.22);backdrop-filter:blur(var(--zn-blur-6));-webkit-backdrop-filter:blur(var(--zn-blur-6));font-size:12px;line-height:16px;letter-spacing:.72px;color:var(--color-mist);pointer-events:none;animation:floaty 6s var(--zn-ease-in-out) infinite}
.chip--float .dot{position:relative;width:7px;height:7px;flex:none}
.chip--float .dot::after{content:"";position:absolute;inset:-4px;border-radius:var(--radius-round);border:1px solid currentColor;opacity:.5;animation:dotp 2s var(--zn-ease-out) infinite}
.chip--float .dot.sig{background:var(--color-signal);color:var(--color-signal);box-shadow:0 0 8px var(--color-signal)}
.chip--float .dot.alt{background:var(--color-alert);color:var(--color-alert);box-shadow:0 0 8px var(--color-alert)}
.chip--float .dot.aur{background:var(--color-aurora);color:var(--color-aurora);box-shadow:0 0 8px var(--color-aurora)}
.chip--float .dot.ice{background:var(--color-ice);color:var(--color-ice)}
@keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@keyframes dotp{0%{transform:scale(.6);opacity:.8}100%{transform:scale(1.8);opacity:0}}

/* compact · GrapheneOS */
.chip--compact{gap:6.56px;padding:6.56px 11.48px;background:rgba(var(--rgb-ink),.88);border:.82px solid rgba(var(--rgb-ice),.22);backdrop-filter:blur(var(--zn-blur-4-9));-webkit-backdrop-filter:blur(var(--zn-blur-4-9));font-size:9.84px;line-height:13.12px;letter-spacing:.79px;color:var(--color-mist);pointer-events:none}
.chip--compact .dot{position:relative;width:5.74px;height:5.74px;flex:none}
.chip--compact .dot::after{content:"";position:absolute;inset:-4px;border-radius:var(--radius-round);border:1px solid currentColor;opacity:.4}
.chip--compact .dot.sig{background:var(--color-signal);color:var(--color-signal);box-shadow:0 0 8px var(--color-signal)}
.chip--compact .dot.ice{background:var(--color-ice);color:var(--color-ice)}
</style>
