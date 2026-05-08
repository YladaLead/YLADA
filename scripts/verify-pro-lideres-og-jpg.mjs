#!/usr/bin/env node
/**
 * Verifica todos os `*.jpg` em `public/images/og/pro-lideres/` (não recursivo):
 * dimensões 1200×630 e tamanho em KB.
 *
 *   npm run og:verify-pro-lideres-og
 */
import { readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'public/images/og/pro-lideres')
const W = 1200
const H = 630
const MIN_KB = 25
const MAX_KB = 600

async function main() {
  const names = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith('.jpg'))
  const badDim = []
  const badSize = []
  for (const name of names) {
    const p = path.join(DIR, name)
    const meta = await sharp(p).metadata()
    if (meta.width !== W || meta.height !== H) badDim.push({ name, w: meta.width, h: meta.height })
    const kb = (await stat(p)).size / 1024
    if (kb < MIN_KB) badSize.push({ name, kb: kb.toFixed(1), note: 'muito pequeno' })
    if (kb > MAX_KB) badSize.push({ name, kb: kb.toFixed(1), note: 'muito grande' })
  }
  console.log(`Verificados ${names.length} JPG em`, DIR)
  if (badDim.length) {
    console.error('Dimensão incorreta (esperado 1200×630):', badDim)
    process.exit(1)
  }
  if (badSize.length) {
    console.warn('Aviso tamanho (alvo típico ~40–250 KB):', badSize)
  }
  console.log('Dimensões: todas 1200×630 OK.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
