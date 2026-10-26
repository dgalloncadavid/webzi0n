/* Recorta una franja vertical de una imagen: node slice.mjs in.png y alto out.png */
import fs from 'node:fs'
import { PNG } from 'pngjs'
const [src, y0, h, out] = process.argv.slice(2)
const img = PNG.sync.read(fs.readFileSync(src))
const H = Math.min(+h, img.height - +y0)
const o = new PNG({ width: img.width, height: H })
PNG.bitblt(img, o, 0, +y0, img.width, H, 0, 0)
fs.writeFileSync(out, PNG.sync.write(o))
