/**
 * Converte PNGs existentes em `pro-estetica-corporal` / `pro-estetica-capilar` para JPEG 1200×630
 * (qualidade 80, mozjpeg) e remove o PNG. Use após mudar `ylada-link-og-image-bank.ts` para `.jpg`.
 *
 * Uso: pnpm og:reencode-pro-estetica-jpeg
 */
import { readdir, readFile, unlink, writeFile } from 'fs/promises'
import { join, resolve } from 'path'

import sharp from 'sharp'

const ROOT = resolve(process.cwd(), 'public/images/og')
const DIRS = ['pro-estetica-corporal', 'pro-estetica-capilar'] as const
const OG_W = 1200
const OG_H = 630

async function main() {
  let converted = 0
  let skipped = 0
  for (const dir of DIRS) {
    const abs = join(ROOT, dir)
    let names: string[]
    try {
      names = await readdir(abs)
    } catch {
      console.warn(`Pasta em falta: ${abs}`)
      continue
    }
    for (const name of names) {
      if (!name.endsWith('.png')) continue
      if (name.startsWith('.')) continue
      const pngPath = join(abs, name)
      const jpgName = name.replace(/\.png$/i, '.jpg')
      const jpgPath = join(abs, jpgName)
      try {
        const raw = await readFile(pngPath)
        const jpegBuf = await sharp(raw)
          .resize(OG_W, OG_H, { fit: 'cover', position: 'attention' })
          .jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: '4:2:0' })
          .toBuffer()
        await writeFile(jpgPath, jpegBuf)
        await unlink(pngPath)
        converted++
        console.log(`✓ ${dir}/${jpgName}`)
      } catch (e) {
        skipped++
        console.warn(`✗ ${dir}/${name}:`, e instanceof Error ? e.message : e)
      }
    }
  }
  console.log(`\nConvertidos: ${converted}, falhas: ${skipped}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
