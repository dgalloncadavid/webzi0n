<script setup>
/* /ds · muestra de un componente: descripción, uso y el mismo contenido
   sobre fondo oscuro (data-theme="dark") y sobre fondo claro (data-theme="light", sección .light).
   fixed: superficies propias del componente ('dark', 'light' o ambas). Sin fixed, el
   componente se adapta al tema del contenedor. */
import { computed } from 'vue'
import { useT } from '@/design-system/composables/useLang'

const props = defineProps({
  id: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  code: { type: String, default: '' },
  surface: { type: String, default: 'landing' },
  /** tamaño mínimo del área de muestra */
  minHeight: { type: String, default: '' },
  /** superficie fija: ['dark'], ['light'] o ['dark', 'light'] */
  fixed: { type: Array, default: () => [] },
  /** el componente no tiene colores propios (solo imagen) */
  neutral: { type: Boolean, default: false },
  /** aclaración corta junto a la etiqueta */
  note: { type: String, default: '' }
})
const { t } = useT()
const tags = computed(() => {
  if (props.neutral) return [{ cls: 'neutral', label: t('Solo imagen: no depende del tema') }]
  if (!props.fixed.length) return [{ cls: 'adapts', label: t('Se adapta al tema') }]
  return props.fixed.map((k) => ({ cls: 'fixed', label: t(k === 'dark' ? 'Superficie fija: oscura' : 'Superficie fija: clara') }))
})
</script>

<template>
<section class="spec" :id="id">
  <header class="spec-h">
    <h3>{{ title }}</h3>
    <p class="kinds"><span v-for="k in tags" :key="k.label" class="kind" :class="k.cls">{{ k.label }}</span><span v-if="note" class="knote">{{ note }}</span></p>
    <p v-if="text">{{ text }}</p>
    <pre v-if="code"><code>{{ code }}</code></pre>
  </header>
  <div class="panes">
    <div class="pane dark" data-theme="dark" :class="'surface-' + surface" :style="minHeight ? { minHeight } : null"><span class="ptag">{{ t('Fondo oscuro') }}</span><div class="stage"><slot /></div></div>
    <div class="pane" :class="'surface-' + surface" :style="minHeight ? { minHeight } : null"><div class="light lpane" data-theme="light"><span class="ptag">{{ t('Fondo claro') }}</span><div class="stage"><slot /></div></div></div>
  </div>
</section>
</template>

<style scoped>
.spec{padding:var(--zn-space-40) 0;border-top:1px solid var(--color-line)}
.spec-h{display:flex;flex-direction:column;gap:var(--zn-space-8);margin-bottom:var(--zn-space-20);max-width:760px}
.spec-h h3{font:var(--zn-weight-extrabold) 22px/30px var(--font-mono);letter-spacing:-.4px;color:var(--color-mist)}
.spec-h p{font:var(--zn-weight-regular) 15px/22px var(--font-sans);color:var(--color-ice)}
.kinds{display:flex;flex-wrap:wrap;align-items:center;gap:var(--zn-space-8)}
.kind{padding:var(--zn-space-3) var(--zn-space-10);border-radius:var(--radius-pill);font:var(--zn-weight-medium) 11px/16px var(--font-mono);letter-spacing:.6px;text-transform:uppercase;border:1px solid var(--color-line-strong);color:var(--color-ice)}
.kind.fixed{border-color:rgba(var(--rgb-aurora),.6);background:rgba(var(--rgb-aurora),.12);color:var(--color-mist)}
.kind.adapts{border-color:rgba(var(--rgb-signal),.5);background:rgba(var(--rgb-signal),.1);color:var(--color-mist)}
.spec-h .knote{font-size:13px;line-height:18px;color:var(--color-ice)}
pre{margin:0;padding:var(--zn-space-12) var(--zn-space-14);border-radius:var(--zn-radius-12);background:rgba(var(--rgb-white),.04);border:1px solid var(--color-line);white-space:pre-wrap;overflow-wrap:anywhere;font:var(--zn-weight-medium) 12px/18px var(--font-mono);color:var(--color-ice)}
.panes{display:grid;grid-template-columns:1fr;gap:var(--zn-space-16)}
.pane{position:relative;border-radius:var(--zn-radius-20);border:1px solid var(--color-line);overflow:hidden}
.pane.dark{background:var(--ui-bg);padding:var(--zn-space-44) var(--zn-space-24) var(--zn-space-24)}
.lpane{min-height:100%;padding:var(--zn-space-44) var(--zn-space-24) var(--zn-space-24)}
.ptag{position:absolute;left:16px;top:14px;font:var(--zn-weight-medium) 11px/14px var(--font-mono);letter-spacing:.8px;text-transform:uppercase;color:var(--ui-muted)}
.stage{position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--zn-space-16)}
</style>
