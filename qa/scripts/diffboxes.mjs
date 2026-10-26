/* Lista las zonas con diferencias de una imagen de diff (pixeles rojos de pixelmatch) */
import fs from 'node:fs'
import { PNG } from 'pngjs'
const img = PNG.sync.read(fs.readFileSync(process.argv[2]))
const rows = new Map()
for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
  const i = (y * img.width + x) * 4
  if (img.data[i] > 200 && img.data[i + 1] < 80 && img.data[i + 2] < 80) {
    const band = Math.floor(y / 40)
    const b = rows.get(band) || { y0: y, y1: y, x0: x, x1: x, n: 0 }
    b.y1 = y; b.x0 = Math.min(b.x0, x); b.x1 = Math.max(b.x1, x); b.n++
    rows.set(band, b)
  }
}
for (const b of rows.values()) console.log(`y ${b.y0}-${b.y1} x ${b.x0}-${b.x1} px ${b.n}`)
