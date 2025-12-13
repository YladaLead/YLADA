/**
 * Script para fazer upload apenas do poster wellness-hero-poster.png para Supabase Storage
 * 
 * Uso:
 *   npx tsx scripts/upload-wellness-poster.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'
import { config } from 'dotenv'

// Carregar variáveis de ambiente
config({ path: join(process.cwd(), '.env.local') })
config({ path: join(process.cwd(), '.env') })

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

async function uploadPoster() {
  const posterPath = join(process.cwd(), 'public/videos/wellness-hero-poster.png')
  const bucketName = 'landing-pages-assets'
  const posterFileName = 'wellness-hero-poster.png'

  try {
    console.log('📦 Iniciando upload do poster wellness-hero...')
    console.log('   Bucket:', bucketName)
    console.log('   Arquivo:', posterPath)

    // Verificar se o arquivo existe
    const posterBuffer = readFileSync(posterPath)
    const posterSizeMB = (posterBuffer.length / 1024 / 1024).toFixed(2)
    console.log(`   Tamanho: ${posterSizeMB} MB`)

    // Fazer upload do poster
    const { data: posterData, error: posterError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(posterFileName, posterBuffer, {
        contentType: 'image/png',
        upsert: true, // Permitir sobrescrever se já existir
        cacheControl: '3600' // Cache de 1 hora
      })

    if (posterError) {
      console.error('❌ Erro ao fazer upload do poster:', posterError)
      throw posterError
    }

    console.log('✅ Poster enviado com sucesso!')
    console.log('   Path:', posterData.path)

    // Obter URL pública do poster
    const { data: posterUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(posterFileName)

    console.log('   URL pública:', posterUrlData.publicUrl)

    // Testar se a URL está acessível
    console.log('\n🔍 Testando acesso à URL...')
    try {
      const response = await fetch(posterUrlData.publicUrl, { method: 'HEAD' })
      if (response.ok) {
        console.log('✅ URL está acessível!')
        console.log('   Status:', response.status)
        console.log('   Content-Type:', response.headers.get('content-type'))
      } else {
        console.warn('⚠️  URL retornou status:', response.status)
      }
    } catch (fetchError: any) {
      console.warn('⚠️  Não foi possível testar a URL:', fetchError.message)
    }

    console.log('\n📋 Resumo:')
    console.log('   Poster URL:', posterUrlData.publicUrl)
    console.log('\n💡 Próximos passos:')
    console.log('   1. O código já está configurado para usar esta URL')
    console.log('   2. Faça deploy para aplicar as mudanças')
    console.log('   3. Teste a página /pt/wellness')

  } catch (error: any) {
    console.error('❌ Erro fatal:', error.message)
    process.exit(1)
  }
}

// Executar
uploadPoster()
