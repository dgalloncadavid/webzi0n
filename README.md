# Zi0n · sitio en Vue

Sitio de Zi0n (inicio, GrapheneOS, Cripto y flujo de compra) migrado del HTML estático original a una sola aplicación **Vite + Vue 3**, con un sistema de diseño propio (tokens y componentes) y un catálogo en `/ds`.

El flujo de compra es un **prototipo**: no procesa pagos, no envía datos a ningún servidor y no pone datos personales en la URL. El pedido vive solo en `sessionStorage` de la pestaña.

## Requisitos

- Node.js 20.19 o superior (o 22.12+)
- npm

## Instalar y correr

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
```

## Construir

```bash
npm run build      # genera dist/ (incluye dist/404.html para GitHub Pages)
npm run preview    # sirve dist/ en local para revisarlo
```

Otros comandos:

```bash
npm run tokens     # regenera src/styles/tokens.css desde src/design-system/tokens.json
npm run qa         # compara contra el sitio original (ver "Control de calidad")
```

## Desplegar

Es un sitio estático: se publica la carpeta `dist/`. Como usa rutas limpias (`/grapheneos`), el hosting debe responder `index.html` para cualquier ruta que no sea un archivo. Ya vienen preparados:

| Hosting | Qué hacer |
| --- | --- |
| **Netlify** | Comando `npm run build`, carpeta `dist`. `public/_redirects` ya incluye la regla. |
| **Vercel** | Framework "Vite". `vercel.json` ya incluye la reescritura. |
| **GitHub Pages con dominio propio o página de usuario** (`usuario.github.io`) | Publicar `dist/`. `404.html` se genera en el build. |
| **GitHub Pages de proyecto** (`usuario.github.io/repo/`) | Construir con la subcarpeta: `BASE_PATH=/repo/ npm run build` y publicar `dist/`. |
| **Cualquier servidor** (Nginx, Apache, S3 + CloudFront) | Servir `dist/` con respaldo a `/index.html` para rutas desconocidas. |

Ejemplo de workflow para GitHub Pages de proyecto (`.github/workflows/pages.yml`, no incluido):

```yaml
name: pages
on: { push: { branches: [main] } }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: github-pages
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: BASE_PATH=/${{ github.event.repository.name }}/ npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - uses: actions/deploy-pages@v4
```

## Rutas

| Ruta | Página | Origen en el sitio estático |
| --- | --- | --- |
| `/` | Inicio | `index.html` |
| `/grapheneos` | Zi0n para GrapheneOS | `grapheneos/index.html` |
| `/cripto` | Zi0n Cripto | `cripto/index.html` |
| `/compra` | Checkout (pasos `#paso-1` a `#paso-4` y `#listo`) | `compra/index.html` |
| `/compra/pago-cripto` | Pago con stablecoins | `compra/pago-cripto.html` |
| `/compra/pago-tarjeta` | Pago con tarjeta | `compra/pago-tarjeta.html` |
| `/ds` | Sistema de diseño (interno, `noindex`, sin enlaces) | nuevo |

Parámetros que se respetan igual que antes:

- `?lang=es|en` fuerza el idioma (se guarda en `localStorage` con la clave `zion-lang`).
- `/compra?tipo=prueba|activacion|renovacion|restauracion` preselecciona la licencia; `&plan=90|180|360` el plan.
- `/compra?done=1` abre la pantalla final si hay pedido con correo en la pestaña.
- Las URLs viejas (`/cripto/index.html`, `/compra/pago-tarjeta.html`, etc.) redirigen a las nuevas conservando `?` y `#`.

## Estructura

```
src/
  main.js, App.vue, router.js
  styles/
    tokens.css            tokens generados (primitivos, semánticos y superficies por página)
    base.css              reset, roles tipográficos, tonos, íconos, revelado, movimiento reducido
    layout-landing.css    contenedor, secciones y secciones claras de inicio y Cripto
  design-system/
    tokens.json           fuente de los tokens
    components/           Button, Badge, FloatingChip, LangSwitch, Navbar, Footer, SectionHeader,
                          Card, Accordion, PlanCard, RouteCard, ToolItem, PhoneVisual, LayerCompare,
                          StepCard, Toast, TextField, SelectField, RadioCard, PaymentMethod,
                          OrderSummary, StickyBar, Icon
    composables/          useLang, usePageMeta, useInView, useMagnetic, useSpotlight, useCountUp,
                          useMenu, useToast, useMedia, useLinkTo
    directives/reveal.js  v-reveal (aparición al hacer scroll)
    icons/paths.js        66 íconos de Tabler con los trazos exactos del original
    asset.js              rutas a public/ respetando la base del despliegue
  pages/                  Home, GrapheneOS, Cripto, Compra, PagoCripto, PagoTarjeta, DesignSystem
                          (+ home.css, grapheneos.css, checkout.css: reglas de página)
  sections/
    home/ grapheneos/ cripto/   secciones de cada landing (ilustraciones propias incluidas)
    compra/                     pasos, modal de tiendas, encabezado, reglas del pedido (order.js, card.js)
    ds/                         piezas de la página /ds
  i18n/en/                diccionarios ES → EN por página (el español es el texto fuente)
public/assets/            imágenes originales sin recomprimir, por página
scripts/                  build-tokens.mjs, spa-fallback.mjs
qa/                       scripts de comparación y reporte (qa/report/index.html)
```

## Tokens y sistema de diseño

- **Tokens:** `src/design-system/tokens.json` es la fuente; `npm run tokens` genera `src/styles/tokens.css`. Hay primitivos (`--zn-ink`, `--zn-space-24`, `--zn-radius-24`…), semánticos (`--color-line`, `--shadow-card-hover`, `--ease`…) y una **superficie** por página (`.surface-landing`, `.surface-home`, `.surface-graphene`, `.surface-checkout`) que fija la escala tipográfica de `.h1`, `.h2`, `.body`, etc. en cada breakpoint.
- **Catálogo:** abre `/ds` (por ejemplo `http://localhost:5173/ds`). Muestra la paleta con nombre y valor, la escala tipográfica por superficie y ancho, espaciados, radios, sombras, desenfoques, movimiento, breakpoints, íconos y cada componente con sus variantes y estados sobre fondo oscuro y claro, con selector ES/EN.
- Las razones de cada elección están en `DECISIONS.md`; los comportamientos del original que se conservaron aunque parezcan errores, en `NOTES.md`.

## Control de calidad

`npm run qa` levanta el sitio original y el build de Vue, captura las 6 páginas en 1280, 768, 390 y 360 px (en español y en inglés), recorre tres flujos de compra completos, corre 8 baterías de comportamiento contra ambos sitios y arma `qa/report/index.html` con las capturas lado a lado.

Necesita el sitio original en `../zion` (o la ruta en `ORIGINAL_DIR`) y un build previo:

```bash
npm run build
ORIGINAL_DIR=/ruta/al/sitio/original npm run qa
```
