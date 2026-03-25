/**
 * Baixa imagens OG (1200×630) da API Pexels e grava em public/images/og/ylada/.
 * Requer PEXELS_API_KEY em .env.local
 *
 * Uso: pnpm og:pexels
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { readFile, writeFile } from 'fs/promises'

import sharp from 'sharp'

config({ path: resolve(process.cwd(), '.env.local') })

const OUT_DIR = resolve(process.cwd(), 'public/images/og/ylada')
const LISTA_PATH = resolve(OUT_DIR, 'og-imagens-lista.json')
const PEXELS_SEARCH = 'https://api.pexels.com/v1/search'

interface ListaRoot {
  arquivos: { arquivo: string; consulta_pexels: string }[]
}

async function loadLista(): Promise<ListaRoot> {
  const raw = await readFile(LISTA_PATH, 'utf-8')
  return JSON.parse(raw) as ListaRoot
}

interface PexelsPhoto {
  id: number
  src: { large2x?: string; large?: string; original?: string }
  photographer: string
  photographer_url: string
  url: string
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[]
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function searchOne(query: string, apiKey: string): Promise<PexelsPhoto | null> {
  const url = `${PEXELS_SEARCH}?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=large`
  const res = await fetch(url, { headers: { Authorization: apiKey } })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Pexels ${res.status}: ${t.slice(0, 200)}`)
  }
  const data = (await res.json()) as PexelsSearchResponse
  return data.photos?.[0] ?? null
}

async function downloadBuffer(imageUrl: string): Promise<Buffer> {
  const res = await fetch(imageUrl)
  if (!res.ok) throw new Error(`Download ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function main() {
  const apiKey = process.env.PEXELS_API_KEY?.trim()
  if (!apiKey) {
    console.error('Defina PEXELS_API_KEY no .env.local')
    process.exit(1)
  }

  const lista = await loadLista()
  const report: { arquivo: string; ok: boolean; photographer?: string; pexels_url?: string; erro?: string }[] = []

  for (let i = 0; i < lista.arquivos.length; i++) {
    const { arquivo, consulta_pexels } = lista.arquivos[i]
    const outPath = resolve(OUT_DIR, arquivo)
    try {
      const photo = await searchOne(consulta_pexels, apiKey)
      if (!photo) {
        report.push({ arquivo, ok: false, erro: 'nenhum resultado' })
        console.warn(`— ${arquivo}: sem resultados`)
        continue
      }
      const srcUrl = photo.src.large2x || photo.src.large || photo.src.original
      if (!srcUrl) {
        report.push({ arquivo, ok: false, erro: 'sem URL de imagem' })
        continue
      }
      const buf = await downloadBuffer(srcUrl)
      await sharp(buf)
        .resize(1200, 630, { fit: 'cover', position: 'attention' })
        .jpeg({ quality: 86, mozjpeg: true })
        .toFile(outPath)

      report.push({
        arquivo,
        ok: true,
        photographer: photo.photographer,
        pexels_url: photo.url,
      })
      console.log(`✓ ${arquivo} ← ${photo.photographer}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      report.push({ arquivo, ok: false, erro: msg })
      console.error(`✗ ${arquivo}: ${msg}`)
    }
    if (i < lista.arquivos.length - 1) await sleep(350)
  }

  const reportPath = resolve(OUT_DIR, 'og-pexels-ultima-execucao.json')
  await writeFile(reportPath, JSON.stringify({ gerado_em: new Date().toISOString(), itens: report }, null, 2), 'utf-8')
  console.log(`\nRelatório: ${reportPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
