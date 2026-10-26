/* Genera src/styles/tokens.css desde src/design-system/tokens.json.
   Uso: npm run tokens */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const T = JSON.parse(fs.readFileSync(path.join(root, 'src/design-system/tokens.json'), 'utf8'));
const P = T.primitive;

/* referencias {color.ink} {rgb.ink} {radius.8} {ease.brand} {duration.200} */
function ref(v) {
  return String(v).replace(/\{(\w+)\.([\w-]+)\}/g, (m, kind, name) => {
    if (kind === 'color') return `var(--zn-${name})`;
    if (kind === 'rgb') return `var(--zn-${name}-rgb)`;
    if (kind === 'radius') return `var(--zn-radius-${name})`;
    if (kind === 'ease') return `var(--zn-ease-${name})`;
    if (kind === 'duration') return `var(--zn-dur-${name})`;
    throw new Error('Referencia desconocida: ' + m);
  });
}

const out = [];
out.push('/* ==========================================================');
out.push('   Zi0n · tokens de diseño');
out.push('   ARCHIVO GENERADO por scripts/build-tokens.mjs desde');
out.push('   src/design-system/tokens.json. No editar a mano.');
out.push('   ========================================================== */');
out.push('');
out.push('/* ---------- primitivos ---------- */');
out.push(':root{');
for (const [name, c] of Object.entries(P.color)) {
  if (c.value) out.push(`  --zn-${name}:${c.value};`);
  if (c.rgb) out.push(`  --zn-${name}-rgb:${c.rgb};`);
}
out.push(`  --zn-font-mono:${P.font.family.mono};`);
out.push(`  --zn-font-sans:${P.font.family.sans};`);
for (const [k, v] of Object.entries(P.font.weight)) out.push(`  --zn-weight-${k}:${v};`);
for (const s of P.space) out.push(`  --zn-space-${s}:${s}px;`);
for (const [k, v] of Object.entries(P.radius)) out.push(`  --zn-radius-${k}:${v};`);
for (const [k, v] of Object.entries(P.blur)) out.push(`  --zn-blur-${k}:${v};`);
for (const [k, v] of Object.entries(P.ease)) out.push(`  --zn-ease-${k}:${v};`);
for (const [k, v] of Object.entries(P.duration)) out.push(`  --zn-dur-${k}:${v};`);
for (const [k, v] of Object.entries(P.breakpoint)) out.push(`  --zn-bp-${k}:${v.value}; /* solo referencia: las media queries usan el valor literal */`);
out.push('}');
out.push('');

const S = T.semantic;
out.push('/* ---------- semánticos ---------- */');
out.push(':root{');
/* colores de marca como alias semánticos, con su tripleta RGB para componer alfas */
for (const name of ['ink', 'navy', 'ice', 'mist', 'muted', 'signal', 'aurora', 'alert', 'amber', 'white']) {
  out.push(`  --color-${name}:var(--zn-${name});`);
  out.push(`  --rgb-${name}:var(--zn-${name}-rgb);`);
}
for (const [k, v] of Object.entries(S.color)) out.push(`  --color-${k}:${ref(v)};`);
out.push('  --font-mono:var(--zn-font-mono);');
out.push('  --font-sans:var(--zn-font-sans);');
for (const [k, v] of Object.entries(S.radius)) out.push(`  --radius-${k}:${ref(v)};`);
for (const [k, v] of Object.entries(S.shadow)) out.push(`  --shadow-${k}:${ref(v)};`);
for (const [k, v] of Object.entries(S.motion)) out.push(`  --${k === 'ease' ? 'ease' : 'dur-' + k}:${ref(v)};`);
for (const [k, v] of Object.entries(S.layout)) out.push(`  --layout-${k}:${v};`);
out.push('}');
out.push('');

/* ---------- temas de color: dark y light ----------
   :root es dark. Un contenedor claro (.light o [data-theme="light"]) redeclara los --ui-*
   y el color de los roles tipográficos; una isla oscura dentro de él los repone. */
const TH = T.theme;
const uiDecls = (set) => Object.entries(set).map(([k, v]) => `--ui-${k}:${ref(v)}`);
const roleDecls = Object.entries(TH.roles).map(([role, key]) => `--type-${role}-color:var(--ui-${key})`);
out.push('/* ---------- temas de color (ver tokens.json > theme) ---------- */');
out.push(`:root,[data-theme="dark"]{${uiDecls(TH.dark).join(';')}}`);
out.push(`.light,[data-theme="light"]{${uiDecls(TH.light).concat(roleDecls).join(';')}}`);
out.push(`.light [data-theme="dark"],[data-theme="light"] [data-theme="dark"]{${roleDecls.join(';')}}`);
out.push('');

/* ---------- superficies ---------- */
const ROLE_PROPS = ['weight', 'size', 'line', 'track', 'family', 'color'];
function typeDecls(type) {
  const d = [];
  for (const [role, arr] of Object.entries(type || {})) {
    arr.forEach((v, i) => {
      if (v === null || v === undefined) return;
      const prop = ROLE_PROPS[i];
      let val = v;
      if (prop === 'family') val = `var(--font-${v})`;
      if (prop === 'color') val = v === 'inherit' ? 'currentColor' : `var(--color-${v})`;
      d.push(`--type-${role}-${prop}:${val}`);
    });
  }
  return d;
}
function block(sel, obj) {
  const d = [];
  if (obj.pad) d.push(`--pad:${obj.pad}`);
  if (obj.sy) d.push(`--sy:${obj.sy}`);
  d.push(...typeDecls(obj.type));
  return d.length ? `${sel}{${d.join(';')}}` : '';
}
const ORDER = [
  ['base', null],
  ['max-1180', '(max-width:1180px)'],
  ['max-1023', '(max-width:1023px)'],
  ['range-600-1023', '(min-width:600px) and (max-width:1023px)'],
  ['max-640', '(max-width:640px)'],
  ['max-380', '(max-width:380px)']
];
const surfaces = Object.entries(T.surface).filter(([k]) => !k.startsWith('$'));
out.push('/* ---------- superficies (una por página; ver tokens.json > surface) ---------- */');
for (const [key, mq] of ORDER) {
  const rules = surfaces.map(([name, s]) => (s[key] ? block(`.surface-${name}`, s[key]) : '')).filter(Boolean);
  if (!rules.length) continue;
  if (mq) out.push(`@media ${mq}{`);
  for (const r of rules) out.push((mq ? '  ' : '') + r);
  if (mq) out.push('}');
}
out.push('');
fs.writeFileSync(path.join(root, 'src/styles/tokens.css'), out.join('\n'));
console.log('tokens.css generado');
