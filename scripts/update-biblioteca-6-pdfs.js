const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://uqhptblvuehvygpwutds.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxaHB0Ymx2dWVodnlncHd1dGRzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTI5NTA1OSwiZXhwIjoyMDQ0ODcxMDU5fQ.AUHeSh1S69bgpX8SnuGvBUx3Ry8RG5wBOKlzfv_Q_HM'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateBiblioteca() {
  console.log('🔄 Atualizando biblioteca...')
  
  try {
    // 1. Deletar todos os registros atuais
    console.log('1️⃣ Removendo registros antigos...')
    const { error: deleteError } = await supabase
      .from('library_files')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    if (deleteError) {
      console.error('Erro ao deletar:', deleteError)
      throw deleteError
    }
    
    console.log('✅ Registros antigos removidos')
    
    // 2. Inserir os 6 novos PDFs
    console.log('2️⃣ Inserindo novos PDFs...')
    
    const pdfs = [
      {
        title: 'Manual Técnico da Plataforma',
        description: 'Guia prático para usar o sistema com clareza e segurança. Use sempre que tiver dúvida sobre onde clicar ou como usar uma área.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-01-manual-tecnico-plataforma',
        is_active: true,
        order_index: 1
      },
      {
        title: 'Checklist Oficial do Dia 1',
        description: 'Comece do jeito certo. O Dia 1 define o ritmo da sua jornada. Este checklist garante que você execute corretamente.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-02-checklist-dia-1',
        is_active: true,
        order_index: 2
      },
      {
        title: 'Checklist de Consolidação — Primeira Semana',
        description: 'O que você construiu até aqui. Consolidação vem antes de aceleração. Use este material ao finalizar o Dia 7.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-03-checklist-dia-7',
        is_active: true,
        order_index: 3
      },
      {
        title: 'Rotina Mínima da Nutri-Empresária',
        description: 'Menos confusão. Mais constância. Transforme estratégia em rotina simples, sustentável e executável.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-04-rotina-minima',
        is_active: true,
        order_index: 4
      },
      {
        title: 'Scripts Essenciais YLADA',
        description: 'Fale com clareza, sem pressão. Scripts são pontos de partida para ganhar segurança nas conversas profissionais.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-05-scripts-essenciais',
        is_active: true,
        order_index: 5
      },
      {
        title: 'Guia Prático de Gestão GSAL',
        description: 'Organize seu crescimento com clareza. GSAL é um modelo simples de gestão: Gerar, Servir, Acompanhar, Lucrar.',
        category: 'Materiais Essenciais',
        file_type: 'pdf',
        file_url: '/pt/nutri/metodo/biblioteca/pdf-06-guia-gsal',
        is_active: true,
        order_index: 6
      }
    ]
    
    const { data, error: insertError } = await supabase
      .from('library_files')
      .insert(pdfs)
      .select()
    
    if (insertError) {
      console.error('Erro ao inserir:', insertError)
      throw insertError
    }
    
    console.log('✅ Novos PDFs inseridos com sucesso!')
    console.log(`📚 Total: ${data.length} PDFs`)
    
    // 3. Listar os PDFs inseridos
    console.log('\n📄 PDFs disponíveis:')
    data.forEach((pdf, index) => {
      console.log(`   ${index + 1}. ${pdf.title}`)
    })
    
    console.log('\n✨ Biblioteca atualizada com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

updateBiblioteca()
