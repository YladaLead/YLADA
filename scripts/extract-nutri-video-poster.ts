/**
 * Script para extrair um frame do vídeo nutri-hero.mp4 como poster
 * 
 * Uso:
 *   npx tsx scripts/extract-nutri-video-poster.ts
 * 
 * Requisitos:
 *   - ffmpeg instalado (brew install ffmpeg no Mac)
 *   - Arquivo deve existir em: public/videos/nutri-hero.mp4
 */

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'

const videoPath = join(process.cwd(), 'public/videos/nutri-hero.mp4')
const posterPath = join(process.cwd(), 'public/videos/nutri-hero-poster.jpg')
const timestamp = '00:00:20' // Segundo 20 do vídeo

async function extractPoster() {
  try {
    console.log('📸 Extraindo frame do vídeo como poster...')
    console.log('   Vídeo:', videoPath)
    console.log('   Timestamp:', timestamp)
    console.log('   Destino:', posterPath)

    // Verificar se o vídeo existe
    if (!existsSync(videoPath)) {
      console.error('❌ Erro: Vídeo não encontrado em:', videoPath)
      process.exit(1)
    }

    // Verificar se ffmpeg está instalado
    try {
      execSync('which ffmpeg', { stdio: 'ignore' })
    } catch {
      console.error('❌ Erro: ffmpeg não está instalado')
      console.error('   Instale com: brew install ffmpeg (Mac) ou apt-get install ffmpeg (Linux)')
      process.exit(1)
    }

    // Extrair frame usando ffmpeg
    const command = `ffmpeg -i "${videoPath}" -ss ${timestamp} -vframes 1 -q:v 2 "${posterPath}" -y`
    
    console.log('   Executando:', command)
    execSync(command, { stdio: 'inherit' })

    console.log('✅ Poster extraído com sucesso!')
    console.log('   Arquivo:', posterPath)
    console.log('\n💡 O poster será usado automaticamente na página de vendas')

  } catch (error: any) {
    console.error('❌ Erro ao extrair poster:', error.message)
    process.exit(1)
  }
}

// Executar
extractPoster()

