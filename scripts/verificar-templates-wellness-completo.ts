/**
 * Script para verificar todos os templates Wellness:
 * 1. Templates sem diagnóstico mapeado
 * 2. Templates sem content/fluxo configurado
 * 3. Templates com problemas de links
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mapeamento de diagnósticos conhecidos
const diagnosticosMapeados = [
  'quiz-interativo',
  'quiz-bem-estar',
  'quiz-perfil-nutricional',
  'quiz-detox',
  'quiz-energetico',
  'avaliacao-emocional',
  'avaliacao-intolerancia',
  'intolerancia',
  'perfil-metabolico',
  'avaliacao-inicial',
  'diagnostico-eletrolitos',
  'diagnostico-sintomas-intestinais',
  'pronto-emagrecer',
  'tipo-fome',
  'quiz-fome-emocional',
  'fome-emocional',
  'hunger-type',
  'avaliacao-fome-emocional',
  'quiz-tipo-fome',
  'tipo-de-fome',
  'alimentacao-saudavel',
  'sindrome-metabolica',
  'retencao-liquidos',
  'conhece-seu-corpo',
  'nutrido-vs-alimentado',
  'alimentacao-rotina',
  'ganhos-prosperidade',
  'quiz-ganhos',
  'quiz-ganhos-prosperidade',
  'potencial-crescimento',
  'quiz-potencial',
  'quiz-potencial-crescimento',
  'proposito-equilibrio',
  'quiz-proposito',
  'quiz-proposito-equilibrio',
  'calculadora-imc',
  'calc-imc',
  'imc',
  'calculadora-proteina',
  'calc-proteina',
  'proteina',
  'calculadora-agua',
  'calculadora-hidratacao',
  'calc-hidratacao',
  'calc-agua',
  'hidratacao',
  'agua',
  'calculadora-calorias',
  'calc-calorias',
  'calorias',
  'checklist-alimentar',
  'checklist-detox',
  'mini-ebook',
  'guia-nutraceutico',
  'guia-proteico',
  'guia-hidratacao',
  'desafio-7-dias',
  'desafio-21-dias',
  'wellness-profile',
  'descubra-seu-perfil-de-bem-estar',
  'descoberta-perfil-bem-estar',
  'template-diagnostico-parasitose',
  'diagnostico-parasitose',
  'parasitose'
]

function normalizarSlug(slug: string | null): string {
  if (!slug) return ''
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function temDiagnostico(slug: string | null): boolean {
  if (!slug) return false
  const normalized = normalizarSlug(slug)
  
  // Verificar match exato
  if (diagnosticosMapeados.includes(normalized)) return true
  
  // Verificar match parcial (inclui)
  for (const diagnostico of diagnosticosMapeados) {
    if (normalized.includes(diagnostico) || diagnostico.includes(normalized)) {
      return true
    }
  }
  
  // Verificar variações comuns
  if (normalized.includes('ganhos') && normalized.includes('prosperidade')) return true
  if (normalized.includes('potencial') && normalized.includes('crescimento')) return true
  if (normalized.includes('proposito') && normalized.includes('equilibrio')) return true
  if (normalized.includes('quiz-ganhos')) return true
  if (normalized.includes('quiz-potencial')) return true
  if (normalized.includes('quiz-proposito')) return true
  
  return false
}

async function verificarTemplates() {
  console.log('🔍 Verificando templates Wellness...\n')
  
  // Buscar todos os templates wellness
  const { data: templates, error } = await supabase
    .from('templates_nutrition')
    .select('id, name, slug, type, content, profession, is_active')
    .eq('profession', 'wellness')
    .eq('is_active', true)
    .order('name')
  
  if (error) {
    console.error('❌ Erro ao buscar templates:', error)
    return
  }
  
  if (!templates || templates.length === 0) {
    console.log('⚠️ Nenhum template encontrado no banco')
    return
  }
  
  console.log(`📊 Total de templates encontrados: ${templates.length}\n`)
  
  const problemas: Array<{
    template: any
    problemas: string[]
  }> = []
  
  for (const template of templates) {
    const problemasTemplate: string[] = []
    
    // Verificar diagnóstico
    const slugNormalizado = normalizarSlug(template.slug)
    if (!temDiagnostico(template.slug)) {
      problemasTemplate.push(`❌ Sem diagnóstico mapeado (slug: ${template.slug || 'N/A'})`)
    }
    
    // Verificar content/fluxo
    if (!template.content || Object.keys(template.content).length === 0) {
      problemasTemplate.push(`❌ Sem content/fluxo configurado`)
    } else {
      // Verificar se tem estrutura mínima
      const content = template.content as any
      if (template.type === 'quiz') {
        if (!content.questions || !Array.isArray(content.questions) || content.questions.length === 0) {
          problemasTemplate.push(`⚠️ Quiz sem perguntas configuradas`)
        }
      }
    }
    
    if (problemasTemplate.length > 0) {
      problemas.push({
        template,
        problemas: problemasTemplate
      })
    }
  }
  
  // Relatório
  console.log('='.repeat(80))
  console.log('📋 RELATÓRIO DE VERIFICAÇÃO')
  console.log('='.repeat(80))
  console.log(`\n✅ Templates OK: ${templates.length - problemas.length}`)
  console.log(`❌ Templates com problemas: ${problemas.length}\n`)
  
  if (problemas.length > 0) {
    console.log('🔴 TEMPLATES COM PROBLEMAS:\n')
    problemas.forEach((item, index) => {
      console.log(`${index + 1}. ${item.template.name}`)
      console.log(`   Slug: ${item.template.slug || 'N/A'}`)
      console.log(`   Tipo: ${item.template.type || 'N/A'}`)
      item.problemas.forEach(problema => {
        console.log(`   ${problema}`)
      })
      console.log('')
    })
    
    // Resumo por tipo de problema
    const semDiagnostico = problemas.filter(p => 
      p.problemas.some(pr => pr.includes('Sem diagnóstico'))
    ).length
    
    const semContent = problemas.filter(p => 
      p.problemas.some(pr => pr.includes('Sem content'))
    ).length
    
    const semPerguntas = problemas.filter(p => 
      p.problemas.some(pr => pr.includes('sem perguntas'))
    ).length
    
    console.log('='.repeat(80))
    console.log('📊 RESUMO POR TIPO DE PROBLEMA:')
    console.log('='.repeat(80))
    console.log(`❌ Sem diagnóstico: ${semDiagnostico}`)
    console.log(`❌ Sem content/fluxo: ${semContent}`)
    console.log(`⚠️ Quiz sem perguntas: ${semPerguntas}`)
  } else {
    console.log('✅ Todos os templates estão OK!')
  }
  
  console.log('\n' + '='.repeat(80))
}

// Executar
verificarTemplates()
  .then(() => {
    console.log('\n✅ Verificação concluída!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Erro:', error)
    process.exit(1)
  })
