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

## Accesibilidad y temas de color

- **Dos temas semánticos (`tokens.json > theme`: dark y light) con tokens `--ui-*`:** cada componente lee solo esos tokens; los valores dark son exactamente los que ya usaba el sitio, por eso el sitio oscuro no cambia.
- **Tokens nuevos `--ui-*` en vez de volver dinámicos los `--color-*`:** los `--color-*` siguen siendo constantes globales que usan las secciones de las páginas; cambiarlos por tema habría alterado secciones que no son del sistema.
- **Atributo `data-theme="dark|light"` y no `data-surface`:** `data-surface` ya lo usa el router en `<html>` para el tipo de página (landing, graphene, checkout).
- **`.light` equivale a `[data-theme="light"]`:** las secciones claras del inicio ya usaban esa clase; así toman el tema claro sin tocar su marcado.
- **El tema redeclara el color de los roles tipográficos (`.h2`, `.body`, `.eyebrow`…) y una isla oscura dentro de un contenedor claro los repone:** las variables CSS se resuelven donde se declaran, así que cada contenedor tiene que volver a declararlas para que su contenido cambie.
- **Las reglas `.surface-landing .light .h2 { color }` pasan a ser tokens:** con reglas de selector, un título dentro de una tarjeta oscura en una sección clara quedaba navy sobre navy (el error de la RouteCard en /ds).
- **Superficie fija (`data-theme` en la raíz): RouteCard, PlanCard (clara; la destacada, oscura), Card (dark y light), StepCard card, CalloutCard, StickyBar, Toast, Navbar, FloatingChip, LayerCompare y Footer graphene:** tienen fondo propio, así que sus colores no pueden depender del contenedor.
- **Se adaptan al tema: Accordion, SectionHeader, Badge, Button ghost y text, LangSwitch, TextField, SelectField, RadioCard, PaymentMethod, OrderSummary, ToolItem, StepCard compact y Footer:** no tienen fondo propio o su fondo es translúcido.
- **El anillo de foco de una superficie fija enfocable (RouteCard, manija del comparador) hereda el color de foco del contenedor (`--ui-focus: inherit`):** el contorno se dibuja por fuera, sobre el fondo del contenedor; signal sobre claro da 1.35:1.
- **Foco en claro con aurora AA (`#354FFF`, 5.22:1 sobre mist):** signal no llega a 3:1 sobre fondos claros; aurora es el acento secundario de la marca.
- **Tonos AA oscurecidos por luminosidad (HSL) dentro de su familia, hasta el primer valor que pasa:** es el cambio mínimo que conserva tono y saturación. Los valores y ratios están en las notas de cada primitivo en `tokens.json`.
- **`light-eyebrow` pasa de `#6E77A8` a `#616BA0` y el texto atenuado claro lo usa también:** el original da 4.31:1 sobre blanco; el nuevo da 5.10:1 y la diferencia queda bajo el umbral del QA.
- **Signal y amber AA calculados para el peor caso (tag sobre su tinte dentro de una opción elegida):** los tintes se suman y un tono justo en 4.5:1 sobre blanco bajaba a 4.35:1.
- **`--tone` en las clases de tono (`.c-sig`, `.c-aur`…):** el ícono de ToolItem y RadioCard usa el acento apto para el tema; `--rgb` sigue alimentando los tintes decorativos.
- **Logo del pie por tokens (`--ui-logo-white`, `--ui-logo-color`) con el `logo-color.svg` que ya existía:** el logo blanco desaparece sobre claro; el de color tiene la palabra en navy. Se carga con `loading="lazy"` para que las páginas oscuras no lo descarguen.
- **"¿Tu caso es otro?" se extrae a `CalloutCard`:** era una tarjeta tinta dentro de la sección clara con un botón ghost adentro; como componente con superficie fija se documenta y se prueba en /ds. El CSS se movió sin cambios.
- **Carruseles móviles (`.brow` del inicio y `.grid4` de Cripto) como región enfocable solo bajo 640 px:** axe exige que una región con scroll sea alcanzable con teclado; en escritorio no hay scroll y sería una parada inútil.
- **El código de las muestras de /ds hace salto de línea en vez de scroll:** evita 25 paradas de Tab extra solo para desplazar texto.
- **Tabla de contraste de /ds calculada en el navegador con los tokens vigentes:** no puede quedar desactualizada respecto a `tokens.json`; las muestras se dibujan en SVG para que la tabla misma no sea texto evaluado.
- **Una sola librería de contraste (`src/design-system/a11y/contrast.js`) para /ds y para las pruebas:** las pruebas inyectan el mismo archivo, así el número de la tabla y el de la prueba coinciden.
- **`npm run a11y` combina axe con pruebas propias (foco, texto de /ds, teclado, orden de Tab):** axe no mide el contraste del anillo de foco ni decide el texto sobre degradados.
- **La prueba de texto de /ds exige 4.5:1 a todo texto, también al grande:** es lo que pide el encargo; el texto grande de los componentes ya supera 4.5:1. Deshabilitado: 3:1.
- **Pares oscuros bajo 3:1 que se conservan (borde de campo 1.99:1, aro del radio 2.04:1, divisor 1.41:1, aro del ícono del FAQ 2.11:1) y placeholder oscuro (3.29:1):** son valores del sitio público y subirlos cambia el checkout y las landings mucho más allá de 0.004%; están marcados en la tabla de /ds y en NOTES.md.
- **Los textos públicos que no llegan a AA se corrigen aunque el inicio pase de 0.004% (queda en 0.005% a 0.011%):** son tres textos cortos ("USD", el eyebrow aurora de la tarjeta de ruta y la flecha del flujo de abogados) y el encargo pide ajustar el tono de todo par que no llegue a AA; se eligió el tono mínimo de cada familia. NOTES.md dice cómo revertirlos si se prefiere la paridad exacta.
- **Eyebrow aurora de la tarjeta de ruta con `aurora-on-tint` (`#97A4FF`):** sobre su propio degradado aurora quedaba entre 3.52:1 y 4.2:1 según la posición; axe no lo detecta (texto sobre degradado). El tono aclarado llega a 4.54:1 en el peor punto y su diferencia con aurora queda bajo el umbral del QA.
- **Modalidad teclado (`html.kbd`) para el foco de un campo con error:** el borde de error tapaba al de foco. `:focus-visible` siempre aplica a los inputs, así que cambiarlo habría alterado la pantalla de errores del pago (el sitio enfoca el primer campo tras un clic); con `html.kbd` el foco se ve solo al llegar con Tab.
- **Medición por píxeles para el contraste que axe deja sin decidir:** se oculta el texto, se captura su caja y se compara con los píxeles reales del fondo (percentil 5, para descartar bordes de antialias). Es la única forma de verificar texto sobre degradados e imágenes sin revisarlo a mano.
- **Las pruebas esperan dos cuadros después de cada Tab:** con movimiento reducido todas las transiciones duran 0.01 ms y el estilo leído en el mismo cuadro es el inicial (contorno de 3 px color texto); no es lo que ve la persona.
- **El recorrido de Tab empieza desde un punto fijo al inicio del documento:** después de pulsar un botón, el siguiente Tab sigue desde ese botón y el recorrido no vería el encabezado.
- **Botón de muestra "Foco" de /ds fuera del orden de Tab (`tabindex="-1"`):** tiene el contorno puesto siempre para ilustrar el estado; enfocarlo no cambiaría nada.
- **`aurora-on-glow` (`#A6B2FF`) para el número de la tarjeta aurora y `.62` en los textos atenuados de la comparativa:** son los ajustes mínimos de tono que los llevan a AA; el segundo no se distingue a simple vista.
- **Excepciones conocidas en `qa/a11y/exceptions.json`, con motivo, en vez de esconderlas o forzar el diseño:** dos casos del sitio público (números sobre círculos alert, blanco sobre el panel degradado) solo se corrigen cambiando colores de fondo que se ven; la prueba los reporta aparte para que la decisión quede a la vista.
- **El estado "verificando" del pago solo pasa por axe:** redirige a los 2 segundos y una medición por píxeles o un recorrido de Tab quedarían a medias.

