/* Estilos globales primero: los componentes y secciones se cargan después
   y pueden especializar estas reglas, como en el CSS original. */
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout-landing.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initLang } from './design-system/composables/useLang'
import { vReveal } from './design-system/directives/reveal'

initLang()

/* Modalidad teclado: html.kbd mientras se navega con Tab, se quita con el puntero.
   Permite mostrar el foco donde :focus-visible no distingue (un campo con error que el sitio
   enfoca solo tras un clic debe verse igual que antes; con teclado, debe mostrar el foco). */
const root = document.documentElement
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') root.classList.add('kbd') }, true)
document.addEventListener('pointerdown', () => root.classList.remove('kbd'), true)

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
