/* Checkout · el pedido y sus reglas (prototipo: nada sale del navegador).
   El pedido vive en sessionStorage 'zionOrder', solo en esta pestaña. */
import { asset } from '@/design-system/asset'

export const PRICES = { '90': 150, '180': 269, '360': 500 }
export const TIPOS = { prueba: '15 días de prueba', activacion: 'Activación', renovacion: 'Renovación', restauracion: 'Restauración' }
export const STORE_NAMES = { exchange: 'Tienda Exchange', web3: 'Tienda Web3', comunicaciones: 'Tienda Comunicaciones', encriptada: 'Tienda Encriptada' }

/* activación y renovación no eligen tienda: ya la tienen instalada */
export const skipStore = (o) => o.tipo === 'activacion' || o.tipo === 'renovacion'

export function saveOrder(o) {
  try { sessionStorage.setItem('zionOrder', JSON.stringify(o)) } catch (e) { /* sin almacenamiento */ }
}
export function loadOrder() {
  try { return JSON.parse(sessionStorage.getItem('zionOrder') || 'null') } catch (e) { return null }
}

export const total = (o) => (o.tipo === 'prueba' ? 0 : o.plan ? PRICES[o.plan] : null)
export function money(o, t) {
  const v = total(o)
  return v === null ? '-' : v === 0 ? t('Gratis') : '$' + v + ' USD'
}

/* líneas del resumen ya traducidas */
export function summaryLines(o, t, fmt) {
  return {
    tipo: o.tipo ? t(TIPOS[o.tipo]) : '-',
    tienda: o.tienda ? t(STORE_NAMES[o.tienda]) : '-',
    plan: o.tipo === 'prueba' ? t('15 días') : o.plan ? fmt('{d} días', { d: o.plan }) : '-',
    mail: o.email || '-'
  }
}

/* Tienda Exchange: lista del Figma. Web3, Comunicaciones y Encriptada: listas provisionales por confirmar. */
const EXCHANGE = ['CoinGecko', 'CoinMarketCap', 'Ledger', 'Trezor', 'Uniswap', 'MaxWallet', 'Trust', 'Monero', 'Exodus', 'Rabbit Wallet', 'Metamask', 'Tron link', 'Phantom', 'DuckDuck Go', 'Calculadora', 'Encriptados', 'Xe', 'DeepL', 'Proton mail', 'Proton Drive', 'Proton Auth', 'Authy', 'Signal', 'Molly', 'Threema', 'Silentphone', 'Telegram', 'Whatsapp', 'ccoins']
export const STORES = [
  { id: 'exchange', desc: 'Aplicaciones centralizadas de instalación segura.', apps: EXCHANGE },
  { id: 'web3', desc: 'Aplicaciones descentralizadas del universo Web3.', apps: ['Metamask', 'Phantom', 'Uniswap', 'Trust', 'Exodus', 'Rabbit Wallet', 'Tron link', 'MaxWallet', 'Ledger', 'Trezor', 'CoinGecko', 'Monero', 'DuckDuck Go', 'Calculadora', 'Proton mail', 'Signal'] },
  { id: 'comunicaciones', desc: 'Enfocada en aplicaciones de mensajería.', apps: ['Signal', 'Molly', 'Threema', 'Silentphone', 'Telegram', 'Whatsapp', 'Proton mail', 'Proton Drive', 'DeepL', 'DuckDuck Go', 'Calculadora', 'Encriptados'] },
  { id: 'encriptada', desc: 'Aplicaciones con la mayor cobertura criptográfica.', apps: ['Encriptados', 'Signal', 'Molly', 'Threema', 'Silentphone', 'Proton mail', 'Proton Drive', 'Proton Auth', 'Authy', 'Calculadora'] }
]
export const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const appIcon = (n) => asset('assets/compra/apps/') + slug(n) + '.png'
