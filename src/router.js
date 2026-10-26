import { createRouter, createWebHistory } from 'vue-router'
import { setLang } from './design-system/composables/useLang'

/* surface: tipo de página. Define en <html data-surface> el scroll suave
   y el manejo del desborde horizontal, igual que cada CSS original. */
const routes = [
  { path: '/', name: 'home', component: () => import('./pages/Home.vue'), meta: { surface: 'landing' } },
  { path: '/grapheneos', name: 'grapheneos', component: () => import('./pages/GrapheneOS.vue'), meta: { surface: 'graphene' } },
  { path: '/cripto', name: 'cripto', component: () => import('./pages/Cripto.vue'), meta: { surface: 'landing' } },
  { path: '/compra', name: 'compra', component: () => import('./pages/Compra.vue'), meta: { surface: 'checkout' } },
  { path: '/compra/pago-cripto', name: 'pago-cripto', component: () => import('./pages/PagoCripto.vue'), meta: { surface: 'checkout' } },
  { path: '/compra/pago-tarjeta', name: 'pago-tarjeta', component: () => import('./pages/PagoTarjeta.vue'), meta: { surface: 'checkout' } },
  { path: '/ds', name: 'ds', component: () => import('./pages/DesignSystem.vue'), meta: { surface: 'ds' } },

  /* URLs del sitio estático original: llevan a la ruta nueva conservando ?query y #hash */
  ...[
    ['/index.html', '/'],
    ['/grapheneos/index.html', '/grapheneos'],
    ['/cripto/index.html', '/cripto'],
    ['/compra/index.html', '/compra'],
    ['/compra/pago-cripto.html', '/compra/pago-cripto'],
    ['/compra/pago-tarjeta.html', '/compra/pago-tarjeta']
  ].map(([from, path]) => ({ path: from, redirect: (to) => ({ path, query: to.query, hash: to.hash }) })),

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, saved) {
    /* cambios de #hash dentro de la misma página: el navegador ya hizo el scroll del ancla
       y el checkout maneja sus propios pasos */
    if (from.matched.length && to.path === from.path) return false
    if (saved) return { ...saved, behavior: 'instant' }
    if (to.hash) {
      /* la página se monta y luego se salta al ancla, como en una carga normal */
      return new Promise((resolve) => setTimeout(() => resolve({ el: to.hash, behavior: 'instant' }), 60))
    }
    return { top: 0, behavior: 'instant' }
  }
})

router.beforeEach((to) => {
  const q = to.query.lang
  if (q === 'es' || q === 'en') setLang(q)
})

router.afterEach((to) => {
  document.documentElement.dataset.surface = to.meta.surface || ''
})

export default router
