# Decisiones técnicas

Una línea por decisión con su porqué.

## Stack

- **JavaScript, no TypeScript:** es un sitio de marketing con lógica pequeña portada del JS vanilla original; JS mantiene el port línea a línea y las props quedan documentadas con validación de Vue y comentarios.
- **Vite 8 + Vue 3.5 (Composition API, `<script setup>`):** lo pedido; sin otras dependencias de ejecución.
- **Vue Router 5:** es la versión actual y su API es compatible con la 4; se usa solo el router clásico, sin rutas por archivo.
- **Historial HTML5 (`createWebHistory`) con `BASE_URL`:** las URLs quedan iguales a las pedidas (`/grapheneos`, `/compra/pago-cripto`) y el sitio puede vivir en una subcarpeta con `BASE_PATH`.
- **Redirecciones de las URLs viejas (`/cripto/index.html`, `/compra/pago-tarjeta.html`…):** los enlaces que ya circulan siguen funcionando y conservan `?query` y `#hash`.
- **Páginas con carga diferida (`import()` por ruta):** cada página baja solo su JS y CSS.
- **Respaldo SPA para hosting estático (`404.html`, `_redirects`, `vercel.json`):** recargar en `/grapheneos` debe abrir la app en GitHub Pages, Netlify o Vercel.

## Idioma

- **Composable propio (`useLang`) en vez de vue-i18n:** los diccionarios originales usan el texto en español como clave y contienen `{`, `@` y `|`, que vue-i18n interpreta como sintaxis; además el original deja en español todo texto sin traducción, y eso se replica 1 a 1.
- **Un diccionario por página (`src/i18n/en/*.js`), extraído por script de los archivos originales:** la misma frase puede traducirse distinto según la página, y extraerlo evita errores de transcripción.
- **No hay `es.js`:** el español es el texto fuente y la clave; el diccionario vacío equivale a "español".
- **`localStorage 'zion-lang'` y `?lang=`:** mismas claves y misma prioridad que el original (`?lang` gana sobre lo guardado).

## Sistema de diseño

- **`tokens.json` como fuente y `tokens.css` generado (`npm run tokens`):** una sola verdad que leen el CSS y la página `/ds`.
- **Primitivos `--zn-*` y semánticos (`--color-*`, `--radius-*`, `--shadow-*`, `--ease`, `--dur-*`):** separa "qué valor existe" de "para qué se usa".
- **Tripletas RGB (`--rgb-signal: 77,240,164`):** el original compone decenas de alfas sobre 9 colores; con la tripleta cada alfa sigue saliendo de un token.
- **"Superficies" tipográficas por página (`.surface-landing`, `.surface-home`, `.surface-graphene`, `.surface-checkout`):** las cuatro hojas usan los mismos nombres de clase (`.h2`) con tamaños distintos; la superficie asigna los valores sin renombrar nada.
- **Valores casi iguales no se unifican:** solo se fusionan los idénticos; los demás quedan como tokens separados y listados en NOTES.md.
- **Breakpoints con valor literal en las media queries:** las variables CSS no funcionan dentro de `@media` y no se quiso sumar plugins de PostCSS; los valores están documentados como tokens de referencia.
- **Componentes con `variant` que nombra la diferencia real entre páginas (Navbar `home|cripto|graphene`, Badge `outline|strong|tag`…):** el mismo componente cubre las tres landings sin mezclar CSS de páginas.
- **Estilos `scoped` en componentes y secciones:** aíslan clases que se repiten con significados distintos (`.step`, `.shead`, `.chip`) y renombran los `@keyframes` homónimos.
- **CSS de página importado antes que las secciones (`home.css`, `grapheneos.css`, `checkout.css`):** reproduce el orden de cascada original, de lo genérico a lo específico.
- **`html.js .rv` para el revelado:** iguala la prioridad que `.js .rv` tenía en el original frente a las reglas de una clase, que con `scoped` ganan un atributo.
- **`:global()` evitado:** en CSS `scoped` de Vue convierte el selector entero en global; se usan clases reactivas.
- **Íconos como registro local (`icons/paths.js`) con los trazos exactos extraídos del HTML original:** `@tabler/icons-vue` cambió los trazos de varios íconos entre versiones y eso habría alterado píxeles.
- **Fuentes con el mismo enlace a Google Fonts:** render idéntico al original; `@fontsource` sirve los mismos archivos pero cambia el orden de carga.
- **Imágenes copiadas sin recomprimir en `public/assets/<página>/`:** GrapheneOS y Cripto tienen archivos con el mismo nombre y distinto contenido; solo el logo (idéntico en las 4 carpetas) se dejó una vez.
- **Ayudante `asset()` para rutas públicas:** respeta la base del despliegue sin cambiar el resultado en la raíz.
- **Compilador de plantillas con `whitespace: 'preserve'`:** los espacios entre etiquetas se comportan como en el HTML original, donde un espacio en contexto en línea cambia el resultado.

## Comportamiento

- **Revelado como directiva global `v-reveal` con umbral por página (`setRevealOptions`):** cada página original usaba su umbral (.15, .18, .2); el hook `updated` repone `.in` si Vue reescribe las clases.
- **Composables (`useInView`, `useMagnetic`, `useSpotlight`, `useCountUp`, `useMenu`, `useToast`, `useMediaQuery`):** cada interacción del JS vanilla queda como una pieza reutilizable con limpieza al desmontar.
- **`prefers-reduced-motion` leído una vez al cargar:** igual que el original, que lo guardaba en una constante.
- **Lienzo de 1280 px de GrapheneOS con `zoom`:** se conserva el mecanismo original (variables `--z`, `--vw`, `--hs`… en la raíz de la página) porque toda su maqueta está posicionada en absoluto sobre ese lienzo.
- **Animaciones que dependen de reiniciar clases (escenarios de GrapheneOS, onda de emergencia, sacudida del aviso):** se manejan sobre el elemento con `classList` y reflow forzado, como el original; Vue no toca esas clases porque son estáticas.
- **Pasos del checkout con `#paso-N` y `#listo` a través del router:** el router es dueño de `history.state`; una bandera distingue las navegaciones propias de los botones atrás y adelante, y se replican las reglas del original (no salir de la pantalla final, no saltar a un paso sin completar los anteriores).
- **Estado del pedido en `sessionStorage 'zionOrder'` con el mismo esquema:** el flujo entre páginas funciona igual y los datos no salen de la pestaña; los datos de la tarjeta nunca se guardan.
- **Sugerencia de correo renderizada con plantilla (texto escapado):** el original usaba `innerHTML` con lo que escribe la persona; es el único cambio deliberado (ver NOTES.md).

## Calidad

- **QA con Playwright + pixelmatch contra el original servido en local:** la paridad se mide, no se estima; también se comparan los estados del flujo de compra y 8 baterías de comportamiento.
- **Capturas con `prefers-reduced-motion`:** las animaciones en bucle no dependen del instante de captura; se hizo además una pasada con animaciones activas para revisar el movimiento.
- **Reporte versionado en `qa/report/` con JPEG:** se puede abrir sin instalar nada y pesa una fracción de los PNG de trabajo, que quedan fuera de git.
- **`/ds` con `noindex` y sin enlaces desde el sitio:** es una herramienta interna.
