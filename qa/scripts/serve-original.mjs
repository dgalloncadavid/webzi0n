/* Servidor estático mínimo para el sitio original (solo lectura).
   Uso: ORIGINAL_DIR=../zion PORT=4100 node qa/scripts/serve-original.mjs */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(process.env.ORIGINAL_DIR || '../zion')
const port = +(process.env.PORT || 4100)
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (p.endsWith('/')) p += 'index.html'
  const file = path.join(root, p)
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('404') }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
}).listen(port, () => console.log('original en http://localhost:' + port))
