/* Recorta la misma zona de original, vue y diff y la pone lado a lado (zoom 2x) */
import fs from 'node:fs'
import { PNG } from 'pngjs'
const [base, x, y, w, h, out] = process.argv.slice(2)
const parts = ['orig', 'vue', 'diff'].map((k) => PNG.sync.read(fs.readFileSync(`${base}-${k}.png`)))
const Z = 2, W = +w, H = +h
const o = new PNG({ width: W * Z * 3 + 20, height: H * Z })
o.data.fill(255)
parts.forEach((img, k) => {
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const sx = +x + i, sy = +y + j
    if (sx >= img.width || sy >= img.height) continue
    const si = (sy * img.width + sx) * 4
    for (let a = 0; a < Z; a++) for (let b = 0; b < Z; b++) {
      const di = ((j * Z + b) * o.width + (k * (W * Z + 10) + i * Z + a)) * 4
      o.data[di] = img.data[si]; o.data[di + 1] = img.data[si + 1]; o.data[di + 2] = img.data[si + 2]; o.data[di + 3] = 255
    }
  }
})
fs.writeFileSync(out, PNG.sync.write(o))
