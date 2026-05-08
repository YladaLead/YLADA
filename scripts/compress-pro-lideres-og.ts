/**
 * Comprime de uma vez as PNG em `public/images/og/pro-lideres/`
 * (card 1200×630, PNG otimizado — melhor para prévia WhatsApp).
 *
 * Uso:
 *   npx tsx scripts/compress-pro-lideres-og.ts
 *   npx tsx scripts/compress-pro-lideres-og.ts --dry-run
 *   npx tsx scripts/compress-pro-lideres-og.ts --force   # grava mesmo se não ficar menor
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DIR = path.join(process.cwd(), 'public/images/og/pro-lideres')
const W = 1200
const H = 630

async function main() {
  const dry = process.argv.includes('--dry-run')
  const force = process.argv.includes('--force')
  const names = (await readdir(DIR)).filter((f) => f.toLowerCase().endsWith('.png'))
  let totalBefore = 0
  let totalAfterOnDisk = 0
  let updated = 0
  let skipped = 0

  for (const name of names) {
    const filePath = path.join(DIR, name)
    const beforeBuf = await readFile(filePath)
    const beforeSize = beforeBuf.length
    totalBefore += beforeSize

    const outBuf = await sharp(beforeBuf)
      .rotate()
      .resize(W, H, { fit: 'cover', position: 'attention' })
      // effort 10 é muito lento em lote; 7 costuma ser bom equilíbrio tempo/tamanho
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 7 })
      .toBuffer()

    const afterSize = outBuf.length
    const pct = beforeSize ? Math.round((1 - afterSize / beforeSize) * 100) : 0

    if (!force && afterSize >= beforeSize) {
      console.log(`${name}: mantém (${(beforeSize / 1024).toFixed(0)} KB → ${(afterSize / 1024).toFixed(0)} KB, sem ganho)`)
      skipped++
      totalAfterOnDisk += beforeSize
      continue
    }

    if (dry) {
      console.log(
        `${name}: ${(beforeSize / 1024).toFixed(0)} KB → ${(afterSize / 1024).toFixed(0)} KB (${pct}% menor) [dry-run]`
      )
      updated++
      totalAfterOnDisk += afterSize
      continue
    }

    await writeFile(filePath, outBuf)
    console.log(`${name}: ${(beforeSize / 1024).toFixed(0)} KB → ${(afterSize / 1024).toFixed(0)} KB (${pct}% menor)`)
    updated++
    totalAfterOnDisk += afterSize
  }

  const saved = totalBefore - totalAfterOnDisk
  console.log(
    `\nResumo: ${updated} ficheiro(s) ${dry ? 'simulados' : 'gravados'}, ${skipped} sem alteração (usa --force para gravar na mesma).`
  )
  console.log(
    `Total: ${(totalBefore / 1024).toFixed(0)} KB → ${(totalAfterOnDisk / 1024).toFixed(0)} KB (~${(saved / 1024).toFixed(0)} KB a menos no disco após otimização)`
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
