<script setup>
/* Pago con tarjeta (Stripe). Prototipo: valida el formulario en el navegador
   (Luhn, vencimiento, CVV según la marca) y vuelve al checkout. Ningún pago se procesa
   y los datos de la tarjeta no se guardan en ningún lado. */
import { asset } from '@/design-system/asset'
import './checkout.css'
import { reactive, ref, computed } from 'vue'
import CheckoutHeader from '@/sections/compra/CheckoutHeader.vue'
import OrderSummary from '@/design-system/components/OrderSummary.vue'
import StickyBar from '@/design-system/components/StickyBar.vue'
import TextField from '@/design-system/components/TextField.vue'
import SelectField from '@/design-system/components/SelectField.vue'
import Toast from '@/design-system/components/Toast.vue'
import Footer from '@/design-system/components/Footer.vue'
import Icon from '@/design-system/components/Icon.vue'
import dict from '@/i18n/en/compra'
import { provideDict } from '@/design-system/composables/useLang'
import { usePageMeta } from '@/design-system/composables/usePageMeta'
import { usePayOrder } from '@/sections/compra/usePayOrder'
import { cardBrand, luhn, maskCard, maskExpiry, validExpiry } from '@/sections/compra/card'

const { t, fmt } = provideDict(dict)
usePageMeta(dict, { title: 'Pago con tarjeta · Zi0n', description: 'Paga tu licencia de Zi0n Cripto con tarjeta de crédito.' })
const pay = usePayOrder('card', t, fmt)

const f = reactive({ num: '', exp: '', cvv: '', name: '', country: '', zip: '' })
const bad = reactive({ num: false, exp: false, cvv: false, name: false, country: false, zip: false })
const refs = { num: ref(null), exp: ref(null), cvv: ref(null), name: ref(null), zip: ref(null) }
const country = ref(null)
const brand = computed(() => cardBrand(f.num.replace(/\D/g, '')))

function onNum() {
  const d = f.num.replace(/\D/g, '').slice(0, 19)
  f.num = maskCard(d)
  bad.num = false
  const b = cardBrand(d)
  if (d.length === (b === 'amex' ? 15 : 16) && luhn(d)) refs.exp.value.focus()
}
function onExp() { f.exp = maskExpiry(f.exp); bad.exp = false; if (f.exp.length === 5) refs.cvv.value.focus() }
function onCvv() { f.cvv = f.cvv.replace(/\D/g, ''); bad.cvv = false }

const hint = ref('')
const processing = ref(false)
function submit() {
  const d = f.num.replace(/\D/g, '')
  const order = []
  const mark = (k, isBad) => { if (isBad) { bad[k] = true; order.push(k) } }
  mark('num', !luhn(d))
  mark('exp', !validExpiry(f.exp))
  mark('cvv', f.cvv.length !== (cardBrand(d) === 'amex' ? 4 : 3))
  mark('name', f.name.trim().length < 3)
  mark('country', !f.country)
  mark('zip', f.zip.trim().length < 3)
  if (order.length) {
    hint.value = t('Revisa los campos marcados en rojo.')
    const k = order[0]
    if (k === 'country') country.value.$el.querySelector('select').focus(); else refs[k].value.focus()
    return
  }
  hint.value = ''
  processing.value = true
  setTimeout(pay.done, 1600)
}
const nextLabel = computed(() => (processing.value ? t('Procesando…') : fmt('Pagar {m}', { m: pay.total.value })))
const countries = computed(() => [{ value: '', label: t('Elegir…') }, ...['Colombia', 'México', 'España', 'Estados Unidos', 'Argentina', 'Chile', 'Perú', 'Otro'].map((c) => ({ value: c, label: t(c) }))])
</script>

<template>
<div class="pg-pago pg-checkout surface-checkout paypage">
<!-- Prototipo de diseño: no envía ni guarda datos. Ningún pago se procesa. -->
<CheckoutHeader safe="Pago procesado por Stripe" />

<main class="shell">
  <RouterLink class="backlink" to="/compra#paso-4"><span class="ico"><Icon name="arrow-left" /></span><span>{{ t('Volver al paso 4') }}</span></RouterLink>
  <div class="layout">
    <section class="panel">
      <div class="step" data-step="pay">
        <div class="paytop">
          <div>
            <p class="kicker">{{ t('Pago con tarjeta') }}</p>
            <h1 class="h2">{{ t('Datos de tu tarjeta') }}</h1>
            <p class="lead sm">{{ t('Aceptamos Visa, Mastercard y American Express.') }}</p>
          </div>
          <div class="cardviz" aria-hidden="true">
            <div class="cv-top"><span class="chipc"></span><img id="cvBrand" :src="brand ? asset('assets/compra/') + brand + '.png' : asset('assets/compra/visa.png')" width="60" height="20" alt="" :hidden="!brand"></div>
            <p class="cv-num" id="cvNum">{{ f.num || '•••• •••• •••• ••••' }}</p>
            <div class="cv-bot"><span id="cvName">{{ f.name.trim().toUpperCase() || t('NOMBRE APELLIDO') }}</span><span id="cvExp">{{ f.exp || t('MM/AA') }}</span></div>
          </div>
        </div>
        <p class="demo"><span class="ico"><Icon name="info-circle" /></span>{{ t('Prototipo: aquí no se procesa ningún pago.') }}</p>
        <form class="pane" id="paneCard" novalidate autocomplete="off" @submit.prevent="submit">
          <TextField id="ccNum" :ref="(c) => (refs.num.value = c)" v-model="f.num" size="lg" icon="credit-card" :label="t('Número de la tarjeta')" :state="bad.num ? 'bad' : ''" inputmode="numeric" autocomplete="off" placeholder="1234 5678 9012 3456" maxlength="23" @input="onNum">
            <template #suffix><img class="brand" id="ccBrand" :src="brand ? asset('assets/compra/') + brand + '.png' : undefined" alt="" :hidden="!brand"></template>
          </TextField>
          <div class="row2">
            <TextField id="ccExp" :ref="(c) => (refs.exp.value = c)" v-model="f.exp" size="lg" :label="t('Vencimiento')" :state="bad.exp ? 'bad' : ''" inputmode="numeric" autocomplete="off" :placeholder="t('MM/AA')" maxlength="5" @input="onExp" />
            <TextField id="ccCvv" :ref="(c) => (refs.cvv.value = c)" v-model="f.cvv" size="lg" :label="t('CVV')" :state="bad.cvv ? 'bad' : ''" inputmode="numeric" autocomplete="off" placeholder="•••" :maxlength="brand === 'amex' ? 4 : 3" @input="onCvv">
              <template #suffix><span class="ico tip" :title="t('Los 3 o 4 dígitos del reverso')"><Icon name="help-circle" /></span></template>
            </TextField>
          </div>
          <TextField id="ccName" :ref="(c) => (refs.name.value = c)" v-model="f.name" size="lg" :label="t('Nombre en la tarjeta')" :state="bad.name ? 'bad' : ''" autocomplete="off" :placeholder="t('Como aparece en la tarjeta')" @input="bad.name = false" />
          <div class="row2">
            <SelectField id="ccCountry" ref="country" v-model="f.country" size="lg" :label="t('País')" :options="countries" :state="bad.country ? 'bad' : ''" @input="bad.country = false" />
            <TextField id="ccZip" :ref="(c) => (refs.zip.value = c)" v-model="f.zip" size="lg" :label="t('Código postal')" :state="bad.zip ? 'bad' : ''" inputmode="numeric" autocomplete="off" placeholder="050001" @input="bad.zip = false" />
          </div>
          <button type="submit" hidden></button>
        </form>
      </div>
    </section>
    <OrderSummary pay :lines="pay.lines.value" :show-store="pay.showStore.value" :total="pay.total.value">
      <template #footer><p class="proc"><span class="ico"><Icon name="lock" /></span><span>{{ t('Pago procesado por Stripe') }}</span></p></template>
    </OrderSummary>
  </div>
</main>

<StickyBar back-to="/compra#paso-4" :hint="hint" :total="pay.total.value" :next-label="nextLabel" :next-disabled="processing ? true : null" @next="submit" />

<Toast />
<Footer variant="compact" copyright="© 2026 Zi0n Cripto. Todos los derechos reservados." :links="[{ label: 'Aviso legal', to: '#' }, { label: 'Términos y condiciones', to: '#' }, { label: 'Política de cookies', to: '#' }]" />
</div>
</template>

<style scoped>
.cardviz{position:relative;overflow:hidden;align-self:center;width:min(100%,340px);aspect-ratio:1.586;border-radius:18px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,var(--zn-cardviz-from),var(--zn-surface-checkout-deep) 60%,var(--zn-cardviz-to));border:1px solid rgba(var(--rgb-ice),.3);box-shadow:0 20px 50px -20px rgba(var(--rgb-aurora),.6)}
.cardviz::before{content:"";position:absolute;width:260px;height:260px;right:-90px;top:-120px;border-radius:50%;background:radial-gradient(closest-side,rgba(var(--rgb-signal),.35),transparent)}
.cv-top{position:relative;display:flex;justify-content:space-between;align-items:center}
.chipc{width:40px;height:30px;border-radius:6px;background:linear-gradient(135deg,var(--zn-chip-gold-from),var(--zn-chip-gold-to))}
.cv-top img{height:22px;width:auto;padding:3px 6px;border-radius:5px;background:var(--color-white)}
.cv-num{position:relative;font:500 20px/26px var(--font-mono);letter-spacing:2px;color:var(--color-mist)}
.cv-bot{position:relative;display:flex;justify-content:space-between;font:500 12px/16px var(--font-mono);letter-spacing:1px;color:var(--color-ice);text-transform:uppercase}
.paytop{display:flex;align-items:center;justify-content:space-between;gap:20px}
.paytop .cardviz{flex:none;width:200px;padding:12px 14px;border-radius:12px;margin:0;align-self:auto}
.paytop .cardviz::before{width:160px;height:160px;right:-60px;top:-80px}
.paytop .chipc{width:26px;height:20px;border-radius:4px}
.paytop .cv-top img{height:16px;padding:2px 4px;border-radius:3px}
.paytop .cv-num{font-size:13px;line-height:18px;letter-spacing:1px}
.paytop .cv-bot{font-size:9px;line-height:12px}
#paneCard :deep(.field label){font-size:15px}
#paneCard{gap:var(--zn-space-6);margin-top:var(--zn-space-6)}
@media (max-width:640px){
  .cv-num{font-size:17px;letter-spacing:1px}
  .cardviz{padding:16px}
  .paytop{flex-direction:column-reverse;align-items:flex-start}
  .paytop .cardviz{width:180px}
}
</style>
