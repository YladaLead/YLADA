#!/usr/bin/env node
/**
 * Converte cada `*.png` em `public/images/og/pro-lideres/` (exceto `_sources/`)
 * para `{mesmo-stem}.jpg` 1200×630 — o `og:image` dos presets usa só `.jpg`.
 *
 *   npm run og:sync-pro-lideres-png-to-jpg
 */
import { readdir } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'public/images/og/pro-lideres')
const W = 1200
const H = 630

const jpegOpts = { quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' }

async function assertOgSize(outPath, label) {
  const meta = await sharp(outPath).metadata()
  if (meta.width !== W || meta.height !== H) {
    throw new Error(`${label} saiu ${meta.width}×${meta.height} (esperado ${W}×${H})`)
  }
}

async function main() {
  const names = await readdir(DIR)
  let n = 0
  for (const name of names) {
    if (!name.toLowerCase().endsWith('.png')) continue
    const inPath = path.join(DIR, name)
    const stem = name.slice(0, -'.png'.length)
    const outPath = path.join(DIR, `${stem}.jpg`)
    await sharp(inPath)
      .rotate()
      .resize(W, H, { fit: 'cover', position: 'attention' })
      .jpeg(jpegOpts)
      .toFile(outPath)
    await assertOgSize(outPath, `${stem}.jpg`)
    console.log(`${name} → ${stem}.jpg`)
    n++
  }

  // JPG sem PNG correspondente (ex.: só existia .jpg do Automator): forçar 1200×630
  let fixed = 0
  for (const name of names) {
    if (!name.toLowerCase().endsWith('.jpg')) continue
    const stem = name.slice(0, -'.jpg'.length)
    if (names.includes(`${stem}.png`)) continue
    const jpgPath = path.join(DIR, name)
    const meta = await sharp(jpgPath).metadata()
    if (meta.width === W && meta.height === H) continue
    const buf = await sharp(jpgPath)
      .rotate()
      .resize(W, H, { fit: 'cover', position: 'attention' })
      .jpeg(jpegOpts)
      .toBuffer()
    await writeFile(jpgPath, buf)
    await assertOgSize(jpgPath, name)
    console.log(`${name}: normalizado → ${W}×${H}`)
    fixed++
  }

  console.log(`\nOK: ${n} PNG→JPG + ${fixed} JPG só (redimensionados) em`, DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
