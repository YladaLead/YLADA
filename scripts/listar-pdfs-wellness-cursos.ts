/**
 * Script para listar PDFs no bucket wellness-cursos-pdfs
 * 
 * Execute: npx tsx scripts/listar-pdfs-wellness-cursos.ts
 */

import { createClient } from '@supabase/supabase-js'

// Configuração
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fubynpjagxxqbyfjsile.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseKey) {
  console.error('❌ Configure SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function listarPDFs() {
  console.log('🔍 Buscando PDFs no bucket wellness-cursos-pdfs...\n')

  try {
    // Listar arquivos na pasta pdf/
    const { data: pdfs, error } = await supabase.storage
      .from('wellness-cursos-pdfs')
      .list('pdf', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('❌ Erro ao listar PDFs:', error)
      return
    }

    if (!pdfs || pdfs.length === 0) {
      console.log('📭 Nenhum PDF encontrado na pasta pdf/\n')
      return
    }

    console.log(`📄 Encontrados ${pdfs.length} arquivos na pasta pdf/:\n`)
    console.log('─'.repeat(80))

    // Filtrar apenas PDFs
    const arquivosPDF = pdfs.filter(f => 
      f.name.toLowerCase().endsWith('.pdf') || 
      f.metadata?.mimetype === 'application/pdf'
    )

    if (arquivosPDF.length === 0) {
      console.log('⚠️  Nenhum arquivo PDF encontrado\n')
      return
    }

    arquivosPDF.forEach((file, index) => {
      const url = supabase.storage
        .from('wellness-cursos-pdfs')
        .getPublicUrl(`pdf/${file.name}`)
      
      const tamanhoKB = file.metadata?.size 
        ? (file.metadata.size / 1024).toFixed(2) 
        : 'N/A'
      
      const dataCriacao = file.created_at 
        ? new Date(file.created_at).toLocaleDateString('pt-BR')
        : 'N/A'

      console.log(`${index + 1}. ${file.name}`)
      console.log(`   📁 Caminho: pdf/${file.name}`)
      console.log(`   🔗 URL: ${url.data.publicUrl}`)
      console.log(`   📊 Tamanho: ${tamanhoKB} KB`)
      console.log(`   📅 Criado: ${dataCriacao}`)
      console.log('')
    })

    console.log('─'.repeat(80))
    console.log(`\n✅ Total: ${arquivosPDF.length} PDF(s) encontrado(s)`)
    console.log('\n💡 Use essas URLs para atualizar os registros no banco de dados.')
    console.log('💡 Ou mova os PDFs para wellness-biblioteca/pdfs/scripts/')

  } catch (error: any) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

listarPDFs()

