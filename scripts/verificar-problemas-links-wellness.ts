/**
 * Script para verificar problemas na página de links wellness:
 * 1. Duplicatas (itens aparecendo dobrados)
 * 2. Templates sem diagnóstico no preview
 * 3. Links que não funcionam
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Carregar variáveis de ambiente
config({ path: resolve(__dirname, '../.env.local') })
config({ path: resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Diagnosticos mapeados (do DynamicTemplatePreview.tsx)
const diagnosticosMapeados = [
  'quiz-ganhos',
  'ganhos-prosperidade',
  'quiz-ganhos-e-prosperidade',
  'ganhos e prosperidade',
  'quiz-potencial',
  'potencial-crescimento',
  'quiz-potencial-e-crescimento',
  'potencial e crescimento',
  'quiz-proposito',
  'proposito-equilibrio',
  'quiz-proposito-e-equilibrio',
  'proposito e equilibrio',
  'quiz-bem-estar',
  'bem-estar',
  'quiz-interativo',
  'quiz-detox',
  'quiz-energetico',
  'calc-hidratacao',
  'calculadora-agua',
  'agua',
  'hidratacao',
  'calc-imc',
  'calculadora-imc',
  'imc',
  'calc-proteina',
  'calculadora-proteina',
  'proteina',
  'calc-calorias',
  'calculadora-calorias',
  'calorias'
]

function normalizarSlug(slug: string): string {
  return slug
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function temDiagnostico(slug: string): boolean {
  const slugNormalizado = normalizarSlug(slug)
  
  // Verificar se algum diagnóstico mapeado corresponde
  for (const diagnostico of diagnosticosMapeados) {
    const diagnosticoNormalizado = normalizarSlug(diagnostico)
    
    // Match exato
    if (slugNormalizado === diagnosticoNormalizado) return true
    
    // Match parcial (um contém o outro)
    if (slugNormalizado.includes(diagnosticoNormalizado) || 
        diagnosticoNormalizado.includes(slugNormalizado)) return true
    
    // Match por palavras-chave
    const palavrasSlug = slugNormalizado.split('-')
    const palavrasDiagnostico = diagnosticoNormalizado.split('-')
    
    // Se pelo menos 2 palavras coincidem
    const palavrasComuns = palavrasSlug.filter(p => palavrasDiagnostico.includes(p))
    if (palavrasComuns.length >= 2) return true
  }
  
  return false
}

async function verificarProblemas() {
  console.log('🔍 Verificando problemas na página de links wellness...\n')
  
  // 1. Buscar todos os templates wellness
  const { data: templates, error: templatesError } = await supabase
    .from('templates_nutrition')
    .select('id, name, slug, type, content, is_active, profession, language')
    .eq('is_active', true)
    .order('name', { ascending: true })
  
  if (templatesError) {
    console.error('❌ Erro ao buscar templates:', templatesError)
    return
  }
  
  console.log(`📊 Total de templates encontrados: ${templates?.length || 0}\n`)
  
  // 2. Verificar duplicatas (mesmo nome ou slug similar)
  console.log('🔍 1. VERIFICANDO DUPLICATAS...\n')
  const duplicatas: Record<string, any[]> = {}
  
  templates?.forEach(template => {
    const nome = (template.name || '').toLowerCase().trim()
    const slug = (template.slug || '').toLowerCase().trim()
    
    // Agrupar por nome similar
    const chave = nome || slug
    
    if (!duplicatas[chave]) {
      duplicatas[chave] = []
    }
    duplicatas[chave].push(template)
  })
  
  const duplicatasEncontradas = Object.entries(duplicatas).filter(([_, templates]) => templates.length > 1)
  
  if (duplicatasEncontradas.length > 0) {
    console.log(`⚠️  ${duplicatasEncontradas.length} duplicatas encontradas:\n`)
    duplicatasEncontradas.forEach(([nome, templates]) => {
      console.log(`   📋 "${nome}":`)
      templates.forEach(t => {
        console.log(`      - ID: ${t.id}, Slug: ${t.slug || 'N/A'}, Type: ${t.type}`)
      })
      console.log()
    })
  } else {
    console.log('✅ Nenhuma duplicata encontrada\n')
  }
  
  // 3. Verificar templates sem diagnóstico
  console.log('🔍 2. VERIFICANDO TEMPLATES SEM DIAGNÓSTICO...\n')
  const semDiagnostico: any[] = []
  
  templates?.forEach(template => {
    const slug = template.slug || ''
    const nome = (template.name || '').toLowerCase()
    
    // Apenas quizzes precisam de diagnóstico
    if (template.type === 'quiz') {
      if (!temDiagnostico(slug) && !temDiagnostico(nome)) {
        semDiagnostico.push(template)
      }
    }
  })
  
  if (semDiagnostico.length > 0) {
    console.log(`⚠️  ${semDiagnostico.length} templates sem diagnóstico:\n`)
    semDiagnostico.forEach(t => {
      console.log(`   - "${t.name}" (Slug: ${t.slug || 'N/A'})`)
    })
    console.log()
  } else {
    console.log('✅ Todos os quizzes têm diagnóstico mapeado\n')
  }
  
  // 4. Verificar templates sem content
  console.log('🔍 3. VERIFICANDO TEMPLATES SEM CONTENT...\n')
  const semContent: any[] = []
  
  templates?.forEach(template => {
    if (!template.content || Object.keys(template.content || {}).length === 0) {
      semContent.push(template)
    } else if (template.type === 'quiz') {
      // Para quizzes, verificar se tem questions
      const content = template.content as any
      if (!content.questions || !Array.isArray(content.questions) || content.questions.length === 0) {
        semContent.push(template)
      }
    }
  })
  
  if (semContent.length > 0) {
    console.log(`⚠️  ${semContent.length} templates sem content válido:\n`)
    semContent.forEach(t => {
      console.log(`   - "${t.name}" (Slug: ${t.slug || 'N/A'}, Type: ${t.type})`)
    })
    console.log()
  } else {
    console.log('✅ Todos os templates têm content válido\n')
  }
  
  // 5. Verificar slugs únicos
  console.log('🔍 4. VERIFICANDO SLUGS ÚNICOS...\n')
  const slugs: Record<string, any[]> = {}
  
  templates?.forEach(template => {
    const slug = (template.slug || '').toLowerCase().trim()
    if (slug) {
      if (!slugs[slug]) {
        slugs[slug] = []
      }
      slugs[slug].push(template)
    }
  })
  
  const slugsDuplicados = Object.entries(slugs).filter(([_, templates]) => templates.length > 1)
  
  if (slugsDuplicados.length > 0) {
    console.log(`⚠️  ${slugsDuplicados.length} slugs duplicados:\n`)
    slugsDuplicados.forEach(([slug, templates]) => {
      console.log(`   📋 Slug: "${slug}":`)
      templates.forEach(t => {
        console.log(`      - "${t.name}" (ID: ${t.id})`)
      })
      console.log()
    })
  } else {
    console.log('✅ Todos os slugs são únicos\n')
  }
  
  // Resumo final
  console.log('\n📊 RESUMO:\n')
  console.log(`   Total de templates: ${templates?.length || 0}`)
  console.log(`   Duplicatas por nome: ${duplicatasEncontradas.length}`)
  console.log(`   Slugs duplicados: ${slugsDuplicados.length}`)
  console.log(`   Sem diagnóstico: ${semDiagnostico.length}`)
  console.log(`   Sem content: ${semContent.length}`)
  console.log()
  
  if (duplicatasEncontradas.length > 0 || slugsDuplicados.length > 0 || semDiagnostico.length > 0 || semContent.length > 0) {
    console.log('❌ Problemas encontrados que precisam ser corrigidos!')
  } else {
    console.log('✅ Nenhum problema encontrado!')
  }
}

verificarProblemas().catch(console.error)
