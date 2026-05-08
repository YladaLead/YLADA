#!/usr/bin/env node
/**
 * Gera `og-default-saude.jpg` e `og-default-recrutamento.jpg` (1200×630) a partir de
 * `public/images/og/pro-lideres/_sources/*.source.png` — ajustes de cor para fundo mais
 * cinzento (negócio) e mais verde/vivo (saúde).
 *
 *   npm run og:build-pro-lideres-defaults
 */
import { existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'public/images/og/pro-lideres')
const srcDir = join(outDir, '_sources')
const srcRec = join(srcDir, 'og-default-recrutamento.source.png')
const srcSaude = join(srcDir, 'og-default-saude.source.png')
const W = 1200
const H = 630

async function main() {
  if (!existsSync(srcRec) || !existsSync(srcSaude)) {
    console.error('Missing sources. Expected:\n ', srcRec, '\n ', srcSaude)
    process.exit(1)
  }
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  // Negócio / recrutamento: menos saturação + ligeiro brilho → ambiente mais “cinza corporativo”
  await sharp(srcRec)
    .rotate()
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .modulate({ saturation: 0.36, brightness: 1.09 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(join(outDir, 'og-default-recrutamento.jpg'))

  // Saúde: realça canal verde e saturação para leitura “mais verde / fresca” em OG pequena
  await sharp(srcSaude)
    .rotate()
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .recomb([
      [0.96, 0.03, 0.03],
      [0.05, 1.1, 0.04],
      [0.03, 0.06, 0.94],
    ])
    .modulate({ saturation: 1.2, brightness: 1.03 })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(join(outDir, 'og-default-saude.jpg'))

  console.log('OK: og-default-recrutamento.jpg + og-default-saude.jpg →', outDir)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
