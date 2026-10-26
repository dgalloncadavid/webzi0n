<script setup>
/* Inicio · cómo te protege: tres pilares con ilustraciones que solo corren en pantalla. */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SectionHeader from '@/design-system/components/SectionHeader.vue'
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'
import { useInView } from '@/design-system/composables/useInView'
import { prefersReducedMotion } from '@/design-system/composables/useMedia'

const { t } = useT()
const p1 = ref(null)
const p2 = ref(null)
const p3 = ref(null)
const run1 = useInView(p1, { threshold: 0.35 })
const run2 = useInView(p2, { threshold: 0.35 })
const run3 = useInView(p3, { threshold: 0.35 })

/* cuenta regresiva del borrado: 10 s en el 60 % del ciclo de 6 s */
const wipeT = ref('00:10')
let raf = 0
onMounted(() => {
  if (prefersReducedMotion()) return
  let t0 = 0
  const tick = (now) => {
    raf = requestAnimationFrame(tick)
    if (!run3.value) { t0 = 0; return }
    if (!t0) t0 = now
    const p = ((now - t0) % 6000) / 6000
    const v = Math.max(0, Math.ceil(10 * (1 - p / 0.6)))
    const s = '00:' + (v < 10 ? '0' : '') + v
    if (wipeT.value !== s) wipeT.value = s
  }
  tick(performance.now())
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
<section class="sec" id="como" aria-labelledby="como-t">
  <div class="wrap">
    <SectionHeader v-reveal class="rv" :eyebrow="t('Cómo te protege')" :title="t('Tres cosas que hace Zi0n por ti')" title-id="como-t" :lead="t('No tienes que ser experto. Zi0n trabaja en segundo plano mientras usas tu celular como siempre.')" />
    <div class="pillars">
      <article ref="p1" v-reveal class="pil c-aur rv" :class="{ run: run1 }">
        <div class="ptop"><span class="pnum">01</span><span class="pico ico"><Icon name="stack-2" /></span></div>
        <div class="pill-ill ill-layers" aria-hidden="true">
          <div class="ly back"><span class="lbl">{{ t('Capa oculta') }}</span><i></i><i></i><i></i></div>
          <div class="ly front"><span class="lbl">{{ t('Capa visible') }}</span><b></b><b></b><b></b><b></b><b></b><b></b><b></b><b></b></div>
        </div>
        <h3 class="h4">{{ t('Dos capas en un mismo teléfono') }}</h3>
        <p class="body">{{ t('Una capa visible con apps comunes y una capa oculta para lo que importa. Quien desbloquea el teléfono solo ve la primera.') }}</p>
      </article>
      <article ref="p2" v-reveal class="pil c-alt rv" :class="{ run: run2 }" style="--d:.1s">
        <div class="ptop"><span class="pnum">02</span><span class="pico ico"><Icon name="bell-ringing" /></span></div>
        <div class="pill-ill ill-alert" aria-hidden="true">
          <span class="wave"></span><span class="wave w2"></span>
          <div class="mini-ph"><span class="pin"><i></i><i></i><i></i><i></i></span><span class="mtxt">{{ t('Ingresa tu PIN') }}</span></div>
          <span class="plug ico"><Icon name="plug-connected" /></span>
        </div>
        <h3 class="h4">{{ t('Te avisa antes de borrar') }}</h3>
        <p class="body">{{ t('Ante un cable, un cambio de SIM o mucho tiempo sin señal, suena, vibra y te pide tu PIN en pantalla.') }}</p>
      </article>
      <article ref="p3" v-reveal class="pil c-sig rv" :class="{ run: run3 }" style="--d:.2s">
        <div class="ptop"><span class="pnum">03</span><span class="pico ico"><Icon name="trash" /></span></div>
        <div class="pill-ill ill-wipe" aria-hidden="true">
          <div class="files"><span></span><span></span><span></span><span></span></div>
          <div class="wbar"><i></i></div>
          <span class="wtime" id="wipeT">{{ wipeT }}</span>
        </div>
        <h3 class="h4">{{ t('Se borra cuando hace falta') }}</h3>
        <p class="body">{{ t('Si nadie ingresa el PIN, el sistema se elimina. En una emergencia bastan 5 pulsaciones del botón de volumen.') }}</p>
      </article>
    </div>
  </div>
</section>
</template>

<style scoped>
.pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}
.pil{display:flex;flex-direction:column;gap:var(--zn-space-16);padding:var(--zn-space-8) var(--zn-space-32)}
.pil:first-child{padding-left:0}
.pil:last-child{padding-right:0}
.pil+.pil{border-left:1px solid var(--color-line)}
.ptop{display:flex;align-items:center;justify-content:space-between}
.pnum{font:var(--zn-weight-extrabold) 40px/48px var(--font-mono);letter-spacing:-1px;color:rgb(var(--rgb))}
.pico{width:52px;height:52px;padding:13px;border-radius:var(--radius-round);background:rgba(var(--rgb),.14);color:rgb(var(--rgb))}
.pill-ill{position:relative;height:132px;border-radius:var(--zn-radius-16);border:1px solid var(--color-line);background:linear-gradient(160deg,rgba(var(--rgb),.1),rgba(var(--rgb-white),.02));overflow:hidden;margin:var(--zn-space-4) 0 var(--zn-space-8)}
/* 01 capas */
.ill-layers .ly{position:absolute;left:50%;width:150px;height:86px;margin-left:-75px;top:24px;border-radius:var(--zn-radius-12);border:1px solid var(--color-line);transition:transform 1s var(--ease)}
.ill-layers .lbl{position:absolute;left:10px;top:8px;font:var(--zn-weight-medium) 9px/12px var(--font-mono);letter-spacing:.8px;text-transform:uppercase;color:var(--color-ice)}
.ill-layers .back{background:linear-gradient(140deg,rgba(var(--rgb-aurora),.5),rgba(var(--rgb-navy),.9));box-shadow:0 0 30px rgba(var(--rgb-aurora),.3);animation:lyb 6s var(--ease) infinite}
.ill-layers .back i{position:absolute;left:10px;height:6px;border-radius:3px;background:rgba(var(--rgb-mist),.55)}
.ill-layers .back i:nth-of-type(1){top:32px;width:90px}.ill-layers .back i:nth-of-type(2){top:46px;width:70px}.ill-layers .back i:nth-of-type(3){top:60px;width:100px}
.ill-layers .front{background:var(--zn-layer-front);display:grid;grid-template-columns:repeat(4,18px);gap:8px 14px;align-content:end;justify-content:center;padding-bottom:12px;animation:lyf 6s var(--ease) infinite}
.ill-layers .front b{width:18px;height:18px;border-radius:5px;background:rgba(var(--rgb-ice),.22)}
.ill-layers .front b:nth-child(3){background:rgba(var(--rgb-signal),.45)}.ill-layers .front b:nth-child(6){background:rgba(var(--rgb-alert),.4)}
@keyframes lyf{0%,18%,82%,100%{transform:translate(0,0)}36%,64%{transform:translate(-48px,14px) rotate(-4deg)}}
@keyframes lyb{0%,18%,82%,100%{transform:translate(0,0) scale(.96);opacity:.7}36%,64%{transform:translate(44px,-10px) rotate(3deg) scale(1);opacity:1}}
/* 02 aviso */
.ill-alert .mini-ph{position:absolute;left:50%;top:16px;width:64px;height:104px;margin-left:-32px;border-radius:12px;border:2px solid rgba(var(--rgb-ice),.4);background:var(--zn-device);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;animation:phflash 5s var(--zn-ease-in-out) infinite}
.ill-alert .mini-ph::after{content:"";position:absolute;bottom:-2px;left:50%;width:14px;height:4px;margin-left:-7px;border-radius:2px 2px 0 0;background:rgba(var(--rgb-ice),.5)}
.pin{display:flex;gap:4px}.pin i{width:6px;height:6px;border-radius:50%;border:1px solid var(--color-ice)}
.ill-alert .pin i{animation:pindot 5s steps(1) infinite}
.ill-alert .pin i:nth-child(2){animation-delay:.15s}.ill-alert .pin i:nth-child(3){animation-delay:.3s}.ill-alert .pin i:nth-child(4){animation-delay:.45s}
.mtxt{font:var(--zn-weight-medium) 6px/8px var(--font-mono);text-transform:uppercase;letter-spacing:.4px;color:var(--color-ice);opacity:0;animation:mtxt 5s steps(1) infinite}
.plug{position:absolute;left:50%;bottom:-30px;width:28px;height:28px;margin-left:-14px;color:var(--color-alert);transform:rotate(45deg);animation:plug 5s var(--ease) infinite}
.wave{position:absolute;left:50%;top:68px;width:80px;height:80px;margin:-40px 0 0 -40px;border-radius:50%;border:1px solid rgba(var(--rgb-alert),.6);opacity:0;animation:wave 5s var(--zn-ease-out) infinite}
.wave.w2{animation-delay:.4s}
@keyframes plug{0%,8%{transform:translateY(30px) rotate(45deg)}26%,70%{transform:translateY(-6px) rotate(45deg)}88%,100%{transform:translateY(30px) rotate(45deg)}}
@keyframes phflash{0%,26%,72%,100%{border-color:rgba(183,211,231,.4);box-shadow:none}30%,68%{border-color:rgba(255,92,108,.9);box-shadow:0 0 24px rgba(255,92,108,.35)}}
@keyframes wave{0%,28%{opacity:0;transform:scale(.6)}32%{opacity:.8}60%,100%{opacity:0;transform:scale(2.2)}}
@keyframes mtxt{0%,28%{opacity:0}30%,70%{opacity:1}72%,100%{opacity:0}}
@keyframes pindot{0%,40%{background:transparent}44%,70%{background:var(--color-mist)}72%,100%{background:transparent}}
/* 03 borrado */
.ill-wipe{display:flex;flex-direction:column;justify-content:center;gap:14px;padding:0 28px}
.files{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.files span{height:34px;border-radius:8px;background:rgba(var(--rgb-ice),.16);border:1px solid var(--color-line);position:relative;overflow:hidden}
.files span::after{content:"";position:absolute;inset:0;background:var(--color-ink);transform:scaleX(0);transform-origin:left;animation:wipe 6s var(--ease) infinite}
.files span:nth-child(2)::after{animation-delay:.25s}.files span:nth-child(3)::after{animation-delay:.5s}.files span:nth-child(4)::after{animation-delay:.75s}
.wbar{height:6px;border-radius:3px;background:rgba(var(--rgb-ice),.12);overflow:hidden}
.wbar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--color-signal),var(--zn-warning),var(--color-alert));transform-origin:left;animation:countdown 6s linear infinite}
.wtime{position:absolute;right:16px;top:12px;font:var(--zn-weight-medium) 12px/16px var(--font-mono);color:var(--color-ice)}
@keyframes countdown{0%{transform:scaleX(1)}60%,100%{transform:scaleX(0)}}
@keyframes wipe{0%,60%{transform:scaleX(0)}72%,92%{transform:scaleX(1)}100%{transform:scaleX(0)}}
.pill-ill *{animation-play-state:paused}
.pil.run .pill-ill *{animation-play-state:running}

@media (max-width:1023px){
  .pillars{grid-template-columns:1fr}
  .pil,.pil:first-child,.pil:last-child{padding:var(--zn-space-28) 0}
  .pil:first-child{padding-top:0}
  .pil+.pil{border-left:0;border-top:1px solid var(--color-line)}
  .pill-ill{max-width:420px}
}
@media (max-width:640px){
  .pnum{font-size:32px;line-height:40px}
  .pill-ill{height:120px}
}
</style>
