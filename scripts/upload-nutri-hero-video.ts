/**
 * Script para fazer upload do vídeo nutri-hero.mp4 para Supabase Storage
 * 
 * Uso:
 *   npx tsx scripts/upload-nutri-hero-video.ts
 * 
 * Requisitos:
 *   - Arquivo deve existir em: public/videos/nutri-hero.mp4
 *   - Variáveis de ambiente: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Carregar variáveis de ambiente do .env.local
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅' : '❌')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function uploadVideo() {
  const videoPath = join(process.cwd(), 'public/videos/nutri-hero.mp4')
  const posterPath = join(process.cwd(), 'public/videos/nutri-hero-poster.jpg')
  const bucketName = 'landing-pages-assets'

  try {
    console.log('📦 Iniciando upload do vídeo nutri-hero...')
    console.log('   Bucket:', bucketName)
    console.log('   Arquivo:', videoPath)

    // Verificar se o arquivo existe
    const videoBuffer = readFileSync(videoPath)
    const videoSizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2)
    console.log(`   Tamanho: ${videoSizeMB} MB`)

    // Fazer upload do vídeo
    const videoFileName = 'nutri-hero.mp4'
    const { data: videoData, error: videoError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(videoFileName, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true, // Permitir sobrescrever se já existir
        cacheControl: '3600' // Cache de 1 hora
      })

    if (videoError) {
      console.error('❌ Erro ao fazer upload do vídeo:', videoError)
      throw videoError
    }

    console.log('✅ Vídeo enviado com sucesso!')
    console.log('   Path:', videoData.path)

    // Obter URL pública do vídeo
    const { data: videoUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(videoFileName)

    console.log('   URL pública:', videoUrlData.publicUrl)

    // Fazer upload do poster (se existir)
    try {
      const posterBuffer = readFileSync(posterPath)
      const posterFileName = 'nutri-hero-poster.jpg'
      
      const { data: posterData, error: posterError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(posterFileName, posterBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
          cacheControl: '3600'
        })

      if (posterError) {
        console.warn('⚠️  Aviso: Erro ao fazer upload do poster:', posterError.message)
      } else {
        const { data: posterUrlData } = supabaseAdmin.storage
          .from(bucketName)
          .getPublicUrl(posterFileName)
        
        console.log('✅ Poster enviado com sucesso!')
        console.log('   URL pública:', posterUrlData.publicUrl)
      }
    } catch (posterErr: any) {
      console.warn('⚠️  Aviso: Não foi possível fazer upload do poster:', posterErr.message)
    }

    console.log('\n📋 Resumo:')
    console.log('   Vídeo URL:', videoUrlData.publicUrl)
    console.log('\n💡 Próximos passos:')
    console.log('   1. O código da página já está configurado para usar esta URL')
    console.log('   2. Teste o vídeo na página de vendas /pt/nutri')
    console.log('   3. (Opcional) Remova o arquivo local após confirmar que funciona')

  } catch (error: any) {
    console.error('❌ Erro fatal:', error.message)
    process.exit(1)
  }
}

// Executar
uploadVideo()

