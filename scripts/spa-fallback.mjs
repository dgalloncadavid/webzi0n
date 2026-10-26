/* Copia dist/index.html a dist/404.html: GitHub Pages sirve 404.html para cualquier
   ruta desconocida, así /grapheneos o /compra/pago-cripto abren la app al recargar. */
import fs from 'node:fs'
fs.copyFileSync('dist/index.html', 'dist/404.html')
console.log('dist/404.html listo')
