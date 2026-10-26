/* QA completo: levanta el original y el build de Vue, captura, compara y arma el reporte.
   Requisitos: npm run build antes, y el sitio original en ORIGINAL_DIR (por defecto ../zion).
   Uso: npm run qa */
import { spawn, execFileSync } from 'node:child_process'
import path from 'node:path'

const ORIGINAL_DIR = path.resolve(process.env.ORIGINAL_DIR || '../zion')
const procs = [
  spawn('node', ['qa/scripts/serve-original.mjs'], { env: { ...process.env, ORIGINAL_DIR, PORT: '4100' }, stdio: 'ignore' }),
  spawn('npx', ['vite', 'preview', '--port', '4200', '--strictPort'], { stdio: 'ignore' })
]
await new Promise((r) => setTimeout(r, 2500))
const run = (args) => execFileSync('node', args, { stdio: 'inherit' })
try {
  run(['qa/scripts/capture.mjs', '--report'])
  run(['qa/scripts/capture.mjs', '--en', '--report'])
  run(['qa/scripts/flow.mjs', '1280', '768', '390', '360', '--report'])
  run(['qa/scripts/functional.mjs'])
  run(['qa/scripts/report.mjs'])
} finally {
  procs.forEach((p) => p.kill())
}
