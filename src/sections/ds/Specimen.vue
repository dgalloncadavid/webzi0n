<script setup>
/* /ds · muestra de un componente: descripción, uso y el mismo contenido
   sobre fondo oscuro y sobre fondo claro (sección .light). */
import { useT } from '@/design-system/composables/useLang'

defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  code: { type: String, default: '' },
  surface: { type: String, default: 'landing' },
  /** tamaño mínimo del área de muestra */
  minHeight: { type: String, default: '' },
  /** el componente se diseñó para fondo oscuro; en el claro se avisa */
  darkOnly: { type: Boolean, default: false }
})
const { t } = useT()
</script>

<template>
<section class="spec" :id="id">
  <header class="spec-h">
    <h3>{{ title }}</h3>
    <p v-if="text">{{ text }}</p>
    <pre v-if="code"><code>{{ code }}</code></pre>
  </header>
  <div class="panes">
    <div class="pane dark" :class="'surface-' + surface" :style="minHeight ? { minHeight } : null"><span class="ptag">{{ t('Fondo oscuro') }}</span><div class="stage"><slot /></div></div>
    <div class="pane" :class="'surface-' + surface" :style="minHeight ? { minHeight } : null"><div class="light lpane"><span class="ptag">{{ t('Fondo claro') }}</span><p v-if="darkOnly" class="dnote">{{ t('Pensado para fondo oscuro: sobre claro pierde contraste. Así se ve sin ajustes.') }}</p><div class="stage"><slot /></div></div></div>
  </div>
</section>
</template>

<style scoped>
.spec{padding:var(--zn-space-40) 0;border-top:1px solid var(--color-line)}
.spec-h{display:flex;flex-direction:column;gap:var(--zn-space-8);margin-bottom:var(--zn-space-20);max-width:760px}
.spec-h h3{font:var(--zn-weight-extrabold) 22px/30px var(--font-mono);letter-spacing:-.4px;color:var(--color-mist)}
.spec-h p{font:var(--zn-weight-regular) 15px/22px var(--font-sans);color:var(--color-ice)}
pre{margin:0;padding:var(--zn-space-12) var(--zn-space-14);border-radius:var(--zn-radius-12);background:rgba(var(--rgb-white),.04);border:1px solid var(--color-line);overflow-x:auto;font:var(--zn-weight-medium) 12px/18px var(--font-mono);color:var(--color-ice)}
.panes{display:grid;grid-template-columns:1fr;gap:var(--zn-space-16)}
.pane{position:relative;border-radius:var(--zn-radius-20);border:1px solid var(--color-line);overflow:hidden}
.pane.dark{background:var(--color-ink);padding:var(--zn-space-44) var(--zn-space-24) var(--zn-space-24)}
.lpane{min-height:100%;padding:var(--zn-space-44) var(--zn-space-24) var(--zn-space-24)}
.ptag{position:absolute;left:16px;top:14px;font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.8px;text-transform:uppercase;color:var(--color-muted)}
.dnote{margin:-18px 0 16px;font:var(--zn-weight-medium) 12px/16px var(--font-sans);color:var(--color-light-text)}
.stage{position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--zn-space-16)}
</style>
