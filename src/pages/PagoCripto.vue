<script setup>
/* Pago con stablecoins (Cryptomus). Prototipo: muestra la dirección y el monto,
   simula la verificación y vuelve al checkout. Ningún pago se procesa. */
import { asset } from '@/design-system/asset'
import './checkout.css'
import { reactive, ref, computed, watch } from 'vue'
import CheckoutHeader from '@/sections/compra/CheckoutHeader.vue'
import OrderSummary from '@/design-system/components/OrderSummary.vue'
import StickyBar from '@/design-system/components/StickyBar.vue'
import SelectField from '@/design-system/components/SelectField.vue'
import Toast from '@/design-system/components/Toast.vue'
import Footer from '@/design-system/components/Footer.vue'
import Icon from '@/design-system/components/Icon.vue'
import dict from '@/i18n/en/compra'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { useToast } from '@/design-system/composables/useToast'
import { usePayOrder } from '@/sections/compra/usePayOrder'
import { total } from '@/sections/compra/order'

const { t, fmt } = provideDict(dict)
usePageMeta(dict, { title: 'Pago con stablecoins · Zi0n', description: 'Paga tu licencia de Zi0n Cripto con USDT o USDC.' })
const toast = useToast()
const pay = usePayOrder('crypto', t, fmt)
const O = pay.O

/* moneda y red: USDC no circula por Tron */
const S = reactive({ asset: O.asset || 'USDT', net: O.net || 'Polygon' })
const nets = computed(() => [
  { value: 'Polygon', label: 'Polygon' },
  { value: 'Ethereum', label: 'Ethereum' },
  { value: 'Tron', label: 'Tron (TRC-20)', disabled: S.asset === 'USDC' }
])
const amount = computed(() => total(O) || 0)
const addr = computed(() => (S.net === 'Tron' ? 'TQ7x9mZ4bP2vYk1cD8sWfN3rLhE6aJuG5t' : '0xce3b152cc8bC455c4f0f45E9C542465e5565914b'))
watch(S, () => {
  if (S.asset === 'USDC' && S.net === 'Tron') S.net = 'Polygon'
  O.asset = S.asset; O.net = S.net; pay.save()
}, { immediate: true })

/* copiar al portapapeles */
const did = ref('')
function copy(key, text) {
  const ok = () => { did.value = key; toast.show(t('Copiado')); setTimeout(() => { if (did.value === key) did.value = '' }, 1400) }
  if (navigator.clipboard) navigator.clipboard.writeText(text).then(ok, ok); else ok()
}

/* "Ya envié el pago": verificación simulada */
const status = ref('')
const paid = ref(false)
function confirm() {
  if (paid.value) return
  paid.value = true
  status.value = 'checking'
  setTimeout(() => { status.value = 'ok'; setTimeout(pay.done, 900) }, 2200)
}
const statusText = computed(() => t(status.value === 'ok' ? 'Pago recibido' : status.value === 'checking' ? 'Verificando el pago en la red…' : 'Esperando tu pago'))
</script>

<template>
<div class="pg-pago pg-checkout surface-checkout paypage">
<!-- Prototipo de diseño: no envía ni guarda datos. Ningún pago se procesa. -->
<CheckoutHeader safe="Pago procesado por Cryptomus" />

<main class="shell">
  <RouterLink class="backlink" to="/compra#paso-4"><span class="ico"><Icon name="arrow-left" /></span><span>{{ t('Volver al paso 4') }}</span></RouterLink>
  <div class="layout">
    <section class="panel">
      <div class="step" data-step="pay">
        <p class="kicker">{{ t('Pago con stablecoins') }}</p>
        <h1 class="h2">{{ t('Envía tu pago') }}</h1>
        <p class="demo"><span class="ico"><Icon name="info-circle" /></span>{{ t('Prototipo: aquí no se procesa ningún pago.') }}</p>
          <div class="pane" id="paneCrypto">
            <div class="row2">
              <div class="field"><span class="flabel">{{ t('Moneda') }}</span>
                <div class="seg" id="asset" role="radiogroup" :aria-label="t('Moneda')">
                  <button v-for="a in ['USDT', 'USDC']" :key="a" type="button" :class="{ on: S.asset === a }" :data-v="a" @click="S.asset = a"><img :src="asset('assets/compra/') + a.toLowerCase() + '.png'" width="18" height="18" alt="">{{ a }}</button>
                </div>
              </div>
              <SelectField id="net" v-model="S.net" :label="t('Red')" :options="nets" />
            </div>
            <div class="qrbox">
              <div class="qrhead">
                <p>{{ t('Envía') }} <b class="amt" id="cAmt">${{ amount }}</b> <span class="pill"><img id="cAssetIco" :src="asset('assets/compra/') + S.asset.toLowerCase() + '.png'" width="16" height="16" alt=""><span id="cAsset">{{ S.asset }}</span></span> {{ t('vía') }} <span class="pill"><img :src="asset('assets/compra/polygon.png')" width="16" height="16" alt=""><span id="cNet">{{ S.net }}</span></span></p>
              </div>
              <div class="qrmain">
                <div class="qr"><img :src="asset('assets/compra/qr-demo.png')" width="200" height="200" :alt="t('Código QR con la dirección de pago')"><i class="scan"></i></div>
                <div class="qrdata">
                  <div class="copyrow"><span class="flabel">{{ t('Dirección de la wallet') }}</span><div class="cv"><code id="addr">{{ addr }}</code><button type="button" class="copy" :class="{ did: did === 'addr' }" :aria-label="t('Copiar dirección')" @click="copy('addr', addr)"><span class="ico"><Icon name="copy" /></span></button></div></div>
                  <div class="copyrow"><span class="flabel">{{ t('Monto exacto') }}</span><div class="cv"><code id="amtc">{{ amount }} {{ S.asset }}</code><button type="button" class="copy" :class="{ did: did === 'amtc' }" :aria-label="t('Copiar monto')" @click="copy('amtc', amount + ' ' + S.asset)"><span class="ico"><Icon name="copy" /></span></button></div></div>
                </div>
              </div>
              <p class="warn"><span class="ico"><Icon name="alert-triangle" /></span><span id="warnT">{{ fmt('Envía solo {a} por la red {n}. Si usas otra red, el pago no llega.', { a: S.asset, n: S.net }) }}</span></p>
              <div class="status" :class="status" id="status"><i class="sdot"></i><span id="statusT">{{ statusText }}</span></div>
            </div>
          </div>
      </div>
    </section>
    <OrderSummary pay :lines="pay.lines.value" :show-store="pay.showStore.value" :total="pay.total.value">
      <template #footer><p class="proc"><span class="ico"><Icon name="lock" /></span><span>{{ t('Pago procesado por Cryptomus') }}</span></p></template>
    </OrderSummary>
  </div>
</main>

<StickyBar back-to="/compra#paso-4" :total="pay.total.value" :next-label="paid ? t('Verificando…') : 'Ya envié el pago'" :next-disabled="paid ? true : null" @next="confirm" />

<Toast />
<Footer variant="compact" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." :links="[{ label: 'Aviso legal', to: '#' }, { label: 'Términos y condiciones', to: '#' }, { label: 'Política de cookies', to: '#' }]" />
</div>
</template>

<style scoped>
.field{display:flex;flex-direction:column;gap:var(--zn-space-8);margin-top:var(--zn-space-8);min-width:0}
.flabel{font:500 14px/20px var(--font-sans);color:var(--color-mist)}
.seg{display:flex;padding:4px;border-radius:12px;border:1px solid var(--color-line-strong);background:rgba(var(--rgb-ink),.6);height:54px}
.seg button{flex:1;display:flex;align-items:center;justify-content:center;gap:8px;border-radius:9px;font:600 15px/20px var(--font-sans);color:var(--color-ice);transition:.2s}
.seg button img{border-radius:50%}
.seg button.on{background:rgba(var(--rgb-signal),.14);color:var(--color-mist);box-shadow:0 0 0 1px rgba(var(--rgb-signal),.55) inset}
.qrbox{display:flex;flex-direction:column;gap:16px;padding:20px;border-radius:20px;background:rgba(var(--rgb-ink),.55);border:1px solid var(--color-line)}
.qrhead p{font:400 16px/26px var(--font-sans);color:var(--color-ice);display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.amt{font:800 24px/30px var(--font-mono);color:var(--color-mist)}
.pill{display:inline-flex;align-items:center;gap:6px;padding:3px 10px 3px 4px;border-radius:999px;background:rgba(var(--rgb-white),.08);font:600 14px/20px var(--font-sans);color:var(--color-mist)}
.pill img{border-radius:50%}
.qrmain{display:grid;grid-template-columns:180px 1fr;gap:20px;align-items:center}
.qr{position:relative;width:180px;height:180px;padding:10px;border-radius:16px;background:#fff;overflow:hidden}
.qr img{width:100%;height:100%;image-rendering:pixelated}
.qr .scan{position:absolute;left:8px;right:8px;top:8px;height:2px;background:var(--color-signal);box-shadow:0 0 12px 2px rgba(var(--rgb-signal),.8);animation:qscan 2.6s ease-in-out infinite}
@keyframes qscan{0%,100%{transform:translateY(0)}50%{transform:translateY(160px)}}
.qrdata{display:flex;flex-direction:column;gap:14px;min-width:0}
.copyrow{display:flex;flex-direction:column;gap:6px}
.copyrow .flabel{font-size:12px;line-height:16px;color:var(--color-muted);font-family:var(--font-mono);text-transform:uppercase;letter-spacing:.6px}
.cv{display:flex;align-items:center;gap:10px;padding:10px 10px 10px 14px;border-radius:12px;background:rgba(var(--rgb-white),.05);border:1px solid var(--color-line)}
.cv code{flex:1;min-width:0;font:500 13px/20px var(--font-mono);color:var(--color-mist);overflow-wrap:anywhere}
.copy{width:36px;height:36px;border-radius:10px;display:grid;place-items:center;color:var(--color-aurora);background:rgba(var(--rgb-aurora),.12);transition:.2s;flex:none}
.copy .ico{width:18px;height:18px}
.copy:hover{background:rgba(var(--rgb-aurora),.24);color:var(--color-mist)}
.copy.did{background:var(--color-signal);color:var(--color-ink)}
.warn{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:rgba(var(--rgb-amber),.09);border:1px solid rgba(var(--rgb-amber),.3);font:400 14px/20px var(--font-sans);color:var(--color-mist)}
.warn .ico{width:18px;height:18px;color:var(--color-amber);margin-top:1px}
.status{display:flex;align-items:center;gap:10px;font:500 13px/18px var(--font-mono);letter-spacing:.4px;text-transform:uppercase;color:var(--color-ice)}
.sdot{position:relative;width:10px;height:10px;border-radius:50%;background:var(--color-amber)}
.sdot::after{content:"";position:absolute;inset:-5px;border-radius:50%;border:1.5px solid var(--color-amber);animation:ping 1.6s ease-out infinite}
@keyframes ping{0%{transform:scale(.5);opacity:.9}100%{transform:scale(1.6);opacity:0}}
.status.checking .sdot{background:var(--color-aurora)}.status.checking .sdot::after{border-color:var(--color-aurora)}
.status.ok{color:var(--color-signal)}.status.ok .sdot{background:var(--color-signal)}.status.ok .sdot::after{border-color:var(--color-signal)}
@media (max-width:640px){
  .qrmain{grid-template-columns:1fr;justify-items:center}
  .qrdata{width:100%}
  #paneCrypto .row2{grid-template-columns:1fr}
}
</style>
