/**
 * Script para testar se a URL do vídeo está acessível
 * 
 * Uso: npx tsx scripts/test-video-url.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const BUCKET_NAME = 'landing-pages-assets'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl || 'NÃO DEFINIDO')
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'DEFINIDO' : 'NÃO DEFINIDO')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testVideoUrl() {
  const fileName = 'wellness-hero.mp4'
  
  console.log('🧪 Testando URL do vídeo...')
  console.log('   Bucket:', BUCKET_NAME)
  console.log('   Arquivo:', fileName)
  console.log('   Supabase URL:', supabaseUrl)
  
  // Obter URL pública
  const { data: urlData, error: urlError } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName)
  
  if (urlError) {
    console.error('❌ Erro ao obter URL pública:', urlError)
    return
  }
  
  const publicUrl = urlData.publicUrl
  console.log('\n✅ URL pública gerada:')
  console.log('   ', publicUrl)
  
  // Testar se o arquivo existe e está acessível
  console.log('\n🔍 Testando acesso ao arquivo...')
  
  try {
    const response = await fetch(publicUrl, { method: 'HEAD' })
    
    console.log('   Status:', response.status, response.statusText)
    console.log('   Content-Type:', response.headers.get('content-type'))
    console.log('   Content-Length:', response.headers.get('content-length'), 'bytes')
    console.log('   Access-Control-Allow-Origin:', response.headers.get('access-control-allow-origin'))
    
    if (response.ok) {
      const sizeMB = (parseInt(response.headers.get('content-length') || '0') / 1024 / 1024).toFixed(2)
      console.log('\n✅ Arquivo está acessível!')
      console.log(`   Tamanho: ${sizeMB} MB`)
      console.log('\n💡 Teste a URL no navegador:')
      console.log('   ', publicUrl)
    } else {
      console.error('\n❌ Arquivo não está acessível!')
      console.error('   Status:', response.status)
      console.error('   Verifique se o bucket está público')
    }
  } catch (error: any) {
    console.error('\n❌ Erro ao testar acesso:', error.message)
    console.error('   Verifique sua conexão com a internet')
  }
  
  // Verificar se o arquivo existe no bucket
  console.log('\n🔍 Verificando se arquivo existe no bucket...')
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list()
  
  if (listError) {
    console.error('❌ Erro ao listar arquivos:', listError)
    return
  }
  
  const fileExists = files?.some(f => f.name === fileName)
  if (fileExists) {
    console.log('✅ Arquivo encontrado no bucket')
    const file = files?.find(f => f.name === fileName)
    if (file) {
      console.log('   Nome:', file.name)
      console.log('   Tamanho:', (file.metadata?.size || 0 / 1024 / 1024).toFixed(2), 'MB')
      console.log('   Tipo:', file.metadata?.mimetype)
    }
  } else {
    console.error('❌ Arquivo NÃO encontrado no bucket!')
    console.log('   Arquivos no bucket:', files?.map(f => f.name).join(', ') || 'nenhum')
  }
}

testVideoUrl()

