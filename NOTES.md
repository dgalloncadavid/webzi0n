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

- Imágenes `grapheneos/assets/logo-color.svg` y `compra/assets/walletconnect.png`: se copiaron a `public/assets/` pero nada las usa.
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

## Agregado al sistema de diseño (sin efecto en el sitio)

- `Badge`: la regla `.light .badge { color: navy }` generaliza la que el original tenía solo para los planes (`.light .plan .badge`). En el sitio solo hay badges sobre fondo claro dentro de los planes, así que nada cambia; sirve para mostrarlos en el catálogo `/ds`.
