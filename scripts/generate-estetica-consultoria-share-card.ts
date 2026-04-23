/**
 * Gera cartão quadrado para partilha (WhatsApp / redes).
 * Uso: npx tsx scripts/generate-estetica-consultoria-share-card.ts
 * Textos em português do Brasil (PT-BR).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const W = 1080
const H = 1080

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function main() {
  const root = path.resolve(__dirname, '..')
  const logoPath = path.join(root, 'public/images/og/ylada/logo_ylada_azul_horizontal.png')
  const outPath = path.join(root, 'public/marketing/ylada-estetica-corporal-share-card.png')

  const logoResized = await sharp(logoPath).resize({ width: 460 }).png().toBuffer()
  const lm = await sharp(logoResized).metadata()
  const logoW = lm.width ?? 460
  const logoH = lm.height ?? 120
  const logoLeft = Math.round((W - logoW) / 2)
  const logoTop = 72

  const bgSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#eff6ff"/>
      <stop offset="55%" style="stop-color:#f8fafc"/>
      <stop offset="100%" style="stop-color:#ffffff"/>
    </linearGradient>
    <linearGradient id="wave" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#bfdbfe;stop-opacity:0.45"/>
      <stop offset="100%" style="stop-color:#dbeafe;stop-opacity:0.2"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <path d="M0,520 Q360,440 720,560 T1080,480 L1080,1080 L0,1080 Z" fill="url(#wave)"/>
  <path d="M0,380 Q320,300 640,400 T1080,340 L1080,0 L0,0 Z" fill="#dbeafe" opacity="0.22"/>
  <ellipse cx="880" cy="200" rx="220" ry="140" fill="#e0f2fe" opacity="0.35"/>
</svg>`

  const base = await sharp(Buffer.from(bgSvg)).png().toBuffer()

  const subtitle = 'Sobre a sua atividade'
  const line1 = 'Questionário confidencial'
  const line2 = 'para o seu plano de'
  const line3 = 'acompanhamento'
  /** Convite curto (PT-BR). Altere aqui se quiser outro tom. */
  const cta1 = 'Quando puder, acesse o link — são poucos minutos.'
  const cta2 = 'É confidencial e nos ajuda a montar o melhor acompanhamento para você.'

  const textSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${W / 2}" y="${logoTop + logoH + 88}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="34" font-weight="500" fill="#64748b">${escapeXml(subtitle)}</text>
  <text x="${W / 2}" y="${logoTop + logoH + 168}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="46" font-weight="700" fill="#0f172a">${escapeXml(line1)}</text>
  <text x="${W / 2}" y="${logoTop + logoH + 232}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="46" font-weight="700" fill="#0f172a">${escapeXml(line2)}</text>
  <text x="${W / 2}" y="${logoTop + logoH + 296}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="46" font-weight="700" fill="#0f172a">${escapeXml(line3)}</text>
  <text x="${W / 2}" y="${logoTop + logoH + 378}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="600" fill="#1d4ed8">${escapeXml(cta1)}</text>
  <text x="${W / 2}" y="${logoTop + logoH + 422}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="28" font-weight="600" fill="#1d4ed8">${escapeXml(cta2)}</text>
  <text x="${W / 2}" y="${H - 72}" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="22" font-weight="500" fill="#94a3b8">Estética · Consultoria</text>
</svg>`

  const textBuf = await sharp(Buffer.from(textSvg)).png().toBuffer()

  await sharp(base)
    .composite([
      { input: logoResized, left: logoLeft, top: logoTop },
      { input: textBuf, left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  console.log('OK →', outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
