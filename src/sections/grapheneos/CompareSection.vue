<script setup>
/* GrapheneOS · comparativa: GrapheneOS solo frente a GrapheneOS con Zi0n.
   Las filas entran escalonadas cuando la tabla aparece. */
import Icon from '@/design-system/components/Icon.vue'
import { useT } from '@/design-system/composables/useLang'

const { t } = useT()
const rows = [
  ['Lo que olvidas borrar', 'Se queda guardado', 'Se limpia cada 15 minutos'],
  ['Alguien conecta un cable', 'Lo configuras tú', 'Suena, vibra y pide tu PIN'],
  ['Cambian tu SIM', 'Lo gestionas tú', 'Alerta y PIN antes de borrar'],
  ['Apps que instalas', 'De cualquier fuente', 'Solo de la tienda de Zi0n'],
  ['Emergencia', 'PIN de coacción', '5 pulsaciones de volumen, sin código']
]
</script>

<template>
<section class="sec s06" id="comparativa" :aria-label="t('Comparativa')">
  <div class="frame" style="height:884px">
    <h2 v-reveal class="h2 abs rv" style="left:80px;top:96px;width:900px">{{ t('GrapheneOS solo, y con Zi0n encima') }}</h2>
    <div v-reveal class="split rv" style="left:80px;top:188px">
      <div class="zside"></div>
      <span class="gtop"></span><span class="gbot"></span>
      <span class="sdiv"></span>
      <p class="h3 sh l" style="left:47px;top:43px">{{ t('GrapheneOS solo') }}</p>
      <p class="h3 sh r" style="left:607px;top:43px">{{ t('Con Zi0n encima') }}</p>

      <div v-for="(r, k) in rows" :key="k" class="row" :style="'top:' + (119 + k * 92) + 'px;--i:' + k"><i class="hl"></i><p class="eyebrow lbl">{{ t(r[0]) }}</p><span class="xi"><Icon name="x" /></span><p class="body-lg lv">{{ t(r[1]) }}</p><span class="ck"><span class="ico"><Icon name="check" /></span></span><p class="semi rv2">{{ t(r[2]) }}</p></div>
    </div>
  </div>
</section>
</template>

<style scoped>
.ck .ic{stroke-width:2}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.9}50%{transform:scale(1.08);opacity:1}}
.split{position:absolute;width:1120px;height:600px;border-radius:40px;border:1px solid rgba(var(--rgb-ice),.18);background:#0f1535;overflow:hidden}
.zside{position:absolute;left:559px;top:-1px;width:560px;height:600px;background:linear-gradient(148.26deg,rgba(var(--rgb-signal),.5) 13.4%,rgba(var(--rgb-aurora),.42) 86.6%)}
.gtop{position:absolute;left:589px;top:-231px;width:640px;height:640px;border-radius:50%;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.45),rgba(var(--rgb-signal),0));animation:breathe 8s ease-in-out infinite}
.gbot{position:absolute;left:439px;top:259px;width:760px;height:600px;border-radius:50%;background:radial-gradient(closest-side,rgba(var(--rgb-aurora),.6),rgba(var(--rgb-aurora),.2) 55%,rgba(var(--rgb-aurora),0));animation:breathe 9s ease-in-out -4s infinite}
.sdiv{position:absolute;left:558px;top:-1px;width:2px;height:600px;background:linear-gradient(180deg,rgba(var(--rgb-signal),0),#4df0a4 50%,rgba(var(--rgb-signal),0));box-shadow:0 0 16px rgba(var(--rgb-signal),.9)}
.sh{position:absolute;white-space:nowrap}
.sh.l{color:rgba(var(--rgb-ice),.8)}.sh.r{color:#fff}
.row{position:absolute;left:0;width:1120px;height:92px;opacity:1}
.hl{position:absolute;left:-1px;top:0;width:1120px;height:1px;background:rgba(var(--rgb-white),.1)}
.row .lbl{position:absolute;left:47px;top:14px;color:rgba(var(--rgb-ice),.7);white-space:nowrap}
.xi{position:absolute;left:47px;top:40px;width:22px;height:22px;color:rgba(var(--rgb-ice),.5)}
.row .lv{position:absolute;left:81px;top:40px;color:rgba(var(--rgb-ice),.62);white-space:nowrap} /* AA: era .6 (4.49:1 sobre el brillo en celulares) */
.ck{position:absolute;left:607px;top:36px;width:30px;height:30px;border-radius:50%;background:var(--color-signal);box-shadow:0 0 14px rgba(var(--rgb-signal),.8);display:grid;place-items:center;color:var(--color-ink)}
.ck .ico{width:18px;height:18px}
.row .rv2{position:absolute;left:653px;top:40px;width:440px}
.js .row .lbl,.js .row .xi,.js .row .lv,.js .row .rv2,.js .row .ck{opacity:0;transform:translateX(-14px);transition:opacity .6s var(--ease) calc(.3s + var(--i)*.12s),transform .6s var(--ease) calc(.3s + var(--i)*.12s)}
.js .row .rv2,.js .row .ck{transform:translateX(14px)}
.js .row .ck{transform:scale(.4)}
.js .split.in .row .lbl,.js .split.in .row .xi,.js .split.in .row .lv,.js .split.in .row .rv2,.js .split.in .row .ck{opacity:1;transform:none}
.row::after{content:"";position:absolute;inset:1px 0 0 0;background:linear-gradient(90deg,transparent,rgba(var(--rgb-white),.04),transparent);opacity:0;transition:opacity .3s;pointer-events:none}
.row:hover::after{opacity:1}

@media (max-width:1023px){
  .split{height:auto;display:grid;grid-template-columns:1fr 1fr;gap:0 12px;padding:22px 20px 6px;border-radius:28px;background:linear-gradient(160deg,rgba(var(--rgb-signal),.16),#0f1535 40%,rgba(var(--rgb-aurora),.16))}
  .zside,.gtop,.gbot,.sdiv{display:none}
  .sh{position:static;white-space:normal;font-size:13px;line-height:18px;font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.6px;padding-bottom:14px}
  .sh.r{color:var(--color-signal)}
  .row{position:relative;top:auto!important;left:auto;width:auto;height:auto;grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:10px 12px;padding:16px 0 18px}
  .hl{width:100%;left:0}
  .row .lbl{position:static;grid-column:1/-1;white-space:normal}
  .row .xi,.row .ck{display:none}
  .row .lv{position:static;white-space:normal;font-size:14px;line-height:20px;padding-left:22px;background:no-repeat left 3px/14px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23B7D3E7' stroke-opacity='.6' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M18 6 6 18M6 6l12 12'/%3E%3C/svg%3E")}
  .row .rv2{position:static;width:auto;font-size:14px;line-height:20px;padding-left:22px;background:no-repeat left 3px/14px url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%234DF0A4' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m5 12 5 5L20 7'/%3E%3C/svg%3E")}
}
</style>
