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

createApp(App).use(router).directive('reveal', vReveal).mount('#app')
