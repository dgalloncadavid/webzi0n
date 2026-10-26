# Notas de la migración

Hallazgos del sitio original que se **conservaron tal cual** (la regla era no corregir nada), detalles que dependen de la diferencia entre una SPA y páginas sueltas, y el único cambio deliberado. Cada punto dice dónde está y qué se ve.

## Comportamientos del original que parecen errores (se mantienen)

1. **GrapheneOS: la meta description no se traduce.** El original busca la versión en inglés con la clave `texto + '__meta'`, pero el diccionario tiene esa clave con otro texto inicial ("Se instala…" en lugar de "Zi0n se instala…"). En inglés la descripción queda en español. Se replica con `translateDescription: false` en `src/pages/GrapheneOS.vue`.
2. **GrapheneOS: el pie dice "© 2026 Zi0n Cripto".** Igual en ambos idiomas.
3. **Pago con stablecoins: el botón "Ya envié el pago" no se traduce.** Su texto está excluido de la traducción automática y el script nunca lo pasa por `tr()`. En inglés sigue en español hasta que se pulsa ("Verifying…" sí se traduce).
4. **Checkout: el aviso de la barra no cambia de idioma.** Se traduce en el momento en que aparece; si luego se cambia el idioma, queda en el anterior.
5. **Pago con stablecoins: el ícono de la red siempre es Polygon**, aunque se elija Ethereum o Tron.
6. **Páginas de pago sin pedido completo:** si se entra directo, se arma un pedido de demostración (renovación, 180 días, `hola@correo.com`). Un pedido de prueba sin plan pasa a tener plan 180 pero sigue como prueba, así que el total queda en "Gratis".
7. **GrapheneOS: los puntos del PIN y las 5 pulsaciones se animan aunque el sistema pida movimiento reducido** (sus intervalos no consultan la preferencia). El resto de animaciones sí la respeta.
8. **Elevación al pasar el puntero que nunca se ve.** En inicio (`.pcard`, `.plan`, `.route`) y en Cripto (`.card`, `.zcard`, `.achip`), la regla del revelado (`.js .rv.in { transform: none }`) tiene más prioridad que el `:hover`, así que esas tarjetas no suben. La tarjeta destacada de Cripto (`.zcard`) tampoco queda desplazada 10 px como dice su CSS. Se reproduce la misma prioridad.
9. **Reglas que nunca aplican por la cascada** (sin efecto visible, se conservan):
   - GrapheneOS: `--pad: 40px` entre 600 y 1023 px queda anulado por una regla posterior; el margen real es `max(20px, safe-area)`.
   - GrapheneOS: `.s07 .h2 { margin-bottom: 20px }` pierde contra `.sec > .frame > .h2`.
   - GrapheneOS: `.hv .chip:nth-of-type(2)` apunta a un `div` que no es chip.
   - Cripto: `.chip:nth-of-type(2)` no coincide con ningún chip; solo el primero recibe el retraso de animación (vía `nth-of-type(3)`).
   - Cripto: `.stats { padding-top: 8px }` y `.dist { padding-top: 24px }` pierden contra `.sec + .sec`.
   - Inicio: el `.h1` de 40/48 px bajo 1024 px queda tapado por las reglas del hero.
10. **Enlaces sin destino:** "Hablar con un asesor" del FAQ del inicio y los enlaces legales apuntan a `#`. En GrapheneOS y Cripto, "Blog" lleva a `#faq` y "Aplicaciones" a otra sección.
11. **El selector de idioma del checkout no marca el atributo `lang`** en sus botones (las landings sí).
12. **País en el pago con tarjeta:** las opciones no tienen `value`; en el original su valor cambia al traducir el texto. En Vue el valor queda en español y solo cambia la etiqueta. No se ve ni afecta la validación.

## Código y recursos sin uso en el original (no se portaron)

- Imagen `compra/assets/walletconnect.png`: se copió a `public/assets/` pero nada la usa. (`logo-color.svg` sí se usa ahora: es el logo del pie en tema claro.)
- CSS muerto: `.btn-wc`, `.wc`, `.hint` (checkout); `.phone05`, `.lockic`, `.ptitle`, `.dot05`, `.key`, `#bPlug` (GrapheneOS); `.trial`, `.checks`, `.card`, `.grid3`, `.grid4` en la hoja del inicio; variables `--ink2`, `--surf`, `--surf2`.

## Valores casi iguales que se mantienen separados

Están documentados en `src/design-system/tokens.json`:

- `navy-hover` `#1F2D70` (inicio) y `navy-hover-graphene` `#1E2C6E`.
- `device` `#0E1640` y `device-graphene` `#0F1640` (una unidad de rojo de diferencia).
- `glass` 6 % (landings) y `glass-checkout` 5 %.
- Borde del botón ghost: 32 % en landings (`line-ghost`) y 28 % en el checkout (`line-strong`).
- Fondo de la barra superior: tinta al 88 % en landings y al 86 % en el checkout.
- Escala tipográfica: el `.h2` vale 36 px en inicio y Cripto, 28 px en GrapheneOS y 30 px en el checkout. Por eso cada página aplica una "superficie" con su escala.

## Diferencias propias de pasar a una SPA

- **Hover tras navegar:** al cambiar de página sin recargar, el elemento que queda bajo el puntero muestra su `:hover` de inmediato; en el original la página nueva espera a que el puntero se mueva. El reporte de QA mueve el puntero fuera antes de capturar.
- **Animaciones con tiempo:** el barrido inicial del comparador, las pestañas que avanzan solas y las escenas en bucle dependen del momento exacto. Con movimiento reducido las capturas coinciden; con animaciones activas pueden estar en otra fase.
- **Scroll entre páginas:** al ir a otra página el scroll vuelve arriba al instante y, si la URL trae ancla (`/#faq`), salta a ella como en una carga normal.

## Único cambio deliberado

- **Sugerencia de correo ("¿Quisiste decir…?")**: el original arma ese texto con `innerHTML` e inserta lo que escribió la persona sin escapar. En Vue el texto se escapa. Para cualquier correo real el resultado es idéntico; solo deja de interpretar HTML escrito en el campo.

## Agregado al sistema de diseño

- `Badge`: su texto usa `--ui-text`, que vale navy en el tema claro. Generaliza la regla que el original tenía solo para los planes (`.light .plan .badge`); en el sitio nada cambia.

## Accesibilidad: lo que cambió en el sitio público

Todo lo demás del sitio público queda igual (el QA lo confirma). Estos son los únicos cambios visibles, todos para llegar a WCAG 2.2 AA:

1. **Eyebrow sobre las tarjetas claras del inicio** (perfiles y planes): `#6E77A8` (4.31:1 sobre blanco) pasa a `#616BA0` (5.10:1). La diferencia queda bajo el umbral del QA.
2. **"USD" en las tarjetas de plan claras del inicio:** `muted #8E97BF` (2.87:1 sobre blanco) pasa a `#616BA0` (5.10:1). El tono mínimo que llega a 4.5:1 (`#6874A9`) cambia prácticamente los mismos píxeles, así que no hay un ajuste más chico.
3. **Carruseles de perfiles (inicio) y escenarios (Cripto) en celulares:** bajo 640 px son una región con nombre y `tabindex="0"`, para poder desplazarlos con el teclado. Solo se ve un contorno al enfocarlos.
4. **Anillo de foco en las secciones claras:** pasa de signal (1.35:1 sobre claro) a aurora AA. Solo se ve al navegar con teclado.
5. **Eyebrow "Para usuarios de GrapheneOS" de la tarjeta de ruta (inicio):** aurora `#7B8CFF` sobre su degradado da 3.78:1 medido con los píxeles reales (axe no lo detecta); pasa a `#97A4FF` (4.54:1 en el peor punto). El tono mínimo, `#8D9CFF`, queda justo en el límite (4.47:1 a 4.54:1).
6. **Campos con error o válidos del checkout y del pago:** al llegar con Tab el borde pasa al color de foco (antes no cambiaba nada, o solo aparecía un aro de 1.49:1). Con clic se ven igual que antes.
7. **Número "01" de la tarjeta aurora (GrapheneOS, capa oculta):** aurora sobre su brillo daba 3.16:1; pasa a `#A6B2FF` (4.68:1).
8. **Textos atenuados de "GrapheneOS solo" en la comparativa:** `rgba(ice,.6)` pasa a `.62`; en celulares daba 4.49:1 sobre el brillo. La diferencia no se distingue.
9. **Flecha "→" del flujo de abogados (inicio):** muted (2.87:1 sobre blanco) pasa al texto atenuado AA.

## Accesibilidad: textos públicos bajo el mínimo que se conservan

Medidos con los píxeles reales del fondo (axe no puede decidirlos). Corregirlos exige cambiar el diseño, así que se dejan y figuran en `qa/a11y/exceptions.json`; `npm run a11y` los muestra aparte:

- **GrapheneOS, 5 pulsaciones de volumen:** números mist sobre círculos alert, 2.77:1 (texto grande: mínimo 3:1; en celulares el texto es de 18 px y el mínimo es 4.5:1). Se resuelve con números en tinta o un rojo más oscuro.
- **GrapheneOS, comparativa "Con Zi0n encima":** texto blanco sobre el panel en degradado signal y aurora, de 3.57:1 a 4.47:1 según la fila. El blanco ya es el máximo; se resuelve oscureciendo el panel.

**Efecto en el QA visual:** los puntos 2, 5 y 9 son los únicos que el QA registra. Llevan el inicio de 0.001% a 0.004% a entre 0.005% y 0.011% según el ancho (unos 450 px en una página de 4 millones). Todo lo demás (GrapheneOS, Cripto, checkout, pagos y los 136 estados del flujo de compra) sigue en 0% a 0.004%. Para volver exactamente al original, se revierten esos tres colores:
- `src/design-system/components/PlanCard.vue`: `.price .cur` con `color:var(--color-muted)`.
- `src/design-system/components/RouteCard.vue`: quitar `.route.c-aur{--acc:...}`.
- `src/sections/home/AudienceSection.vue`: `.mflow .ar` con `color:var(--color-muted)`.

## Accesibilidad: valores oscuros bajo el mínimo que se conservan

Subirlos a 3:1 (o 4.5:1) cambiaría el checkout y las landings mucho más allá del 0.004% permitido, así que se dejan como están y se marcan en la tabla de `/ds`:

- Borde de los campos del checkout: `rgba(ice,.28)`, 1.99:1 contra el campo.
- Aro de los radios (tiendas, planes, método de pago): 2.04:1.
- Divisores (FAQ, pie): `rgba(ice,.16)`, 1.41:1. En el FAQ el estado lo lleva el ícono +/−, que sí pasa (10.8:1).
- Aro del ícono del FAQ: 2.11:1 (el ícono adentro pasa).
- Placeholder de los campos: `rgba(ice,.45)`, 3.29:1. axe no evalúa placeholders.

En el tema claro todos estos pares pasan (3.03:1 a 5.10:1).
