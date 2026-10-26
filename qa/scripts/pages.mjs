/* Páginas a comparar: ruta del original y ruta de la versión Vue */
export const PAGES = [
  { id: 'home', orig: '/index.html', vue: '/' },
  { id: 'grapheneos', orig: '/grapheneos/index.html', vue: '/grapheneos' },
  { id: 'cripto', orig: '/cripto/index.html', vue: '/cripto' },
  { id: 'compra', orig: '/compra/index.html', vue: '/compra' },
  { id: 'pago-cripto', orig: '/compra/pago-cripto.html', vue: '/compra/pago-cripto' },
  { id: 'pago-tarjeta', orig: '/compra/pago-tarjeta.html', vue: '/compra/pago-tarjeta' }
]
export const WIDTHS = [1280, 768, 390, 360]
export const ORIG = process.env.ORIG_URL || 'http://localhost:4100'
export const VUE = process.env.VUE_URL || 'http://localhost:4200'
