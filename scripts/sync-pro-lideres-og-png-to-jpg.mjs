#!/usr/bin/env node
/**
 * Converte cada `*.png` em `public/images/og/pro-lideres/` (exceto `_sources/`)
 * para `{mesmo-stem}.jpg` 1200×630 — o `og:image` dos presets usa só `.jpg`.
 *
 *   npm run og:sync-pro-lideres-png-to-jpg
 */
import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'public/images/og/pro-lideres')
const W = 1200
const H = 630

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
      .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(outPath)
    console.log(`${name} → ${stem}.jpg`)
    n++
  }
  console.log(`\nOK: ${n} ficheiro(s) em`, DIR)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
