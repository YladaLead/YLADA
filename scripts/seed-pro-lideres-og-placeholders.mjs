#!/usr/bin/env node
/**
 * Placebo Pro Líderes OG: gera `og-placeholder-ylada.jpg` e cada `{stem}.jpg` a partir do logo YLADA.
 * Defaults saúde/recrutamento: `npm run og:build-pro-lideres-defaults` (artes em `_sources/`).
 * em `public/images/og/pro-lideres/` (alinhado a `proLideresOgImageRelativeFile` no código).
 *
 * Uso:
 *   node scripts/seed-pro-lideres-og-placeholders.mjs
 *   node scripts/seed-pro-lideres-og-placeholders.mjs --force   # sobrescreve JPGs existentes (cuidado: apaga artes já colocadas)
 */
import { existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = join(__dirname, '../public/images/og/pro-lideres')
const sourceLogo = join(__dirname, '../public/images/og/ylada/logo_ylada_azul_horizontal.png')
const placeholderName = 'og-placeholder-ylada.jpg'

const force = process.argv.includes('--force')

function stem(fluxoId) {
  const s = fluxoId
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return s || 'sebo'
}

const OVERRIDE = { agua: 'calc-hidratacao' }

const FLUXO_IDS = [
  'agua',
  'calc-hidratacao',
  'calc-calorias',
  'calc-proteina',
  'calc-imc',
  'energia-matinal',
  'energia-tarde',
  'troca-cafe',
  'anti-cansaco',
  'rotina-puxada',
  'foco-concentracao',
  'motoristas',
  'metabolismo-lento',
  'avaliacao-perfil-metabolico',
  'barriga-pesada',
  'retencao-inchaço',
  'desconforto-pos-refeicao',
  'inchaço-manha',
  'ansiedade-doce',
  'mente-cansada',
  'falta-disposicao-treinar',
  'trabalho-noturno',
  'rotina-estressante',
  'maes-ocupadas',
  'fim-tarde-sem-energia',
  'sedentarismo',
  'energia-foco',
  'pre-treino',
  'rotina-produtiva',
  'constancia',
  'consumo-cafeina',
  'custo-energia',
  'quiz-recrut-ganhos-prosperidade',
  'quiz-recrut-potencial-crescimento',
  'quiz-recrut-proposito-equilibrio',
  'renda-extra-imediata',
  'maes-trabalhar-casa',
  'perderam-emprego-transicao',
  'transformar-consumo-renda',
  'jovens-empreendedores',
  'ja-consome-bem-estar',
  'trabalhar-apenas-links',
  'ja-usa-energia-acelera',
  'cansadas-trabalho-atual',
  'ja-tentaram-outros-negocios',
  'querem-trabalhar-digital',
  'ja-empreendem',
  'querem-emagrecer-renda',
  'boas-venda-comercial',
]

if (!existsSync(sourceLogo)) {
  console.error('Missing source logo:', sourceLogo)
  process.exit(1)
}

if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

async function writeJpegIfNeeded(dest) {
  if (!force && existsSync(dest)) return false
  await sharp(sourceLogo)
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(dest)
  return true
}

let n = 0
if (await writeJpegIfNeeded(join(dir, placeholderName))) n++

for (const id of FLUXO_IDS) {
  const s = OVERRIDE[id] ?? stem(id)
  const dest = join(dir, `${s}.jpg`)
  if (await writeJpegIfNeeded(dest)) n++
}

console.log(
  `pro-lideres OG: ${n} JPG placebo(s) ${force ? '(force overwrite) ' : ''}from logo. Dir: ${dir}`
)
