/**
 * Compõe o logo YLADA no canto inferior direito de um JPEG OG (1200×630).
 * Usado em `default.jpg` e chamado por `fetch-og-ylada-pexels.ts`.
 *
 * Aplicar só no default existente: pnpm og:logo-default
 */
import { resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'
import sharp from 'sharp'

const OG_W = 1200
const OG_H = 630
const LOGO_PATH = resolve(
  process.cwd(),
  'public/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'
)

const LOGO_MAX_WIDTH = 280
const MARGIN = 40

export async function compositeYladaLogoOnOgBuffer(jpegBuffer: Buffer): Promise<Buffer> {
  const logoBuf = await sharp(LOGO_PATH).resize({ width: LOGO_MAX_WIDTH, withoutEnlargement: true }).toBuffer()
  const { width: lw = 200, height: lh = 64 } = await sharp(logoBuf).metadata()
  const left = OG_W - (lw ?? 200) - MARGIN
  const top = OG_H - (lh ?? 64) - MARGIN
  return sharp(jpegBuffer)
    .composite([{ input: logoBuf, left: Math.max(0, left), top: Math.max(0, top) }])
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer()
}

async function main() {
  const rel = process.argv[2] || 'public/images/og/ylada/default.jpg'
  const imagePath = resolve(process.cwd(), rel)
  const raw = await readFile(imagePath)
  const meta = await sharp(raw).metadata()
  if (meta.width !== OG_W || meta.height !== OG_H) {
    console.warn(`Aviso: esperado ${OG_W}×${OG_H}, obtido ${meta.width}×${meta.height} — composição usa canto fixo.`)
  }
  const out = await compositeYladaLogoOnOgBuffer(raw)
  await writeFile(imagePath, out)
  console.log(`✓ Logo aplicado: ${imagePath}`)
}

const isMain = process.argv[1]?.includes('og-ylada-composite-logo')
if (isMain) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
