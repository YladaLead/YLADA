/**
 * Script para listar PDFs no Supabase Storage
 * 
 * Execute: npx tsx scripts/listar-pdfs-storage-wellness.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuração - Ajuste com suas credenciais
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listarPDFs() {
  console.log('🔍 Buscando PDFs no bucket wellness-biblioteca...\n')

  try {
    // Listar arquivos na pasta pdfs/scripts/
    const { data: scripts, error: errorScripts } = await supabase.storage
      .from('wellness-biblioteca')
      .list('pdfs/scripts', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (errorScripts) {
      console.error('❌ Erro ao listar scripts:', errorScripts)
    } else {
      console.log('📄 PDFs em pdfs/scripts/:')
      console.log('─'.repeat(60))
      if (scripts && scripts.length > 0) {
        scripts.forEach((file, index) => {
          if (file.name.endsWith('.pdf')) {
            const url = supabase.storage
              .from('wellness-biblioteca')
              .getPublicUrl(`pdfs/scripts/${file.name}`)
            console.log(`${index + 1}. ${file.name}`)
            console.log(`   URL: ${url.data.publicUrl}`)
            console.log(`   Tamanho: ${(file.metadata?.size || 0) / 1024} KB`)
            console.log('')
          }
        })
      } else {
        console.log('   Nenhum PDF encontrado nesta pasta\n')
      }
    }

    // Listar arquivos na pasta pdfs/aulas/
    const { data: aulas, error: errorAulas } = await supabase.storage
      .from('wellness-biblioteca')
      .list('pdfs/aulas', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (errorAulas) {
      console.error('❌ Erro ao listar aulas:', errorAulas)
    } else {
      console.log('📚 PDFs em pdfs/aulas/:')
      console.log('─'.repeat(60))
      if (aulas && aulas.length > 0) {
        aulas.forEach((file, index) => {
          if (file.name.endsWith('.pdf')) {
            const url = supabase.storage
              .from('wellness-biblioteca')
              .getPublicUrl(`pdfs/aulas/${file.name}`)
            console.log(`${index + 1}. ${file.name}`)
            console.log(`   URL: ${url.data.publicUrl}`)
            console.log(`   Tamanho: ${(file.metadata?.size || 0) / 1024} KB`)
            console.log('')
          }
        })
      } else {
        console.log('   Nenhum PDF encontrado nesta pasta\n')
      }
    }

    // Listar arquivos na raiz do bucket (caso estejam lá)
    const { data: raiz, error: errorRaiz } = await supabase.storage
      .from('wellness-biblioteca')
      .list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (errorRaiz) {
      console.error('❌ Erro ao listar raiz:', errorRaiz)
    } else {
      const pdfsRaiz = raiz?.filter(f => f.name.endsWith('.pdf')) || []
      if (pdfsRaiz.length > 0) {
        console.log('📁 PDFs na raiz do bucket:')
        console.log('─'.repeat(60))
        pdfsRaiz.forEach((file, index) => {
          const url = supabase.storage
            .from('wellness-biblioteca')
            .getPublicUrl(file.name)
          console.log(`${index + 1}. ${file.name}`)
          console.log(`   URL: ${url.data.publicUrl}`)
          console.log(`   Tamanho: ${(file.metadata?.size || 0) / 1024} KB`)
          console.log('')
        })
      }
    }

    console.log('\n✅ Listagem concluída!')
    console.log('\n💡 Use essas URLs para atualizar os registros no banco de dados.')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

listarPDFs()



















