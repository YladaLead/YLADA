/**
 * Script para verificar templates de 3 em 3:
 * 1. Tem fluxo?
 * 2. Tem diagnóstico?
 * 3. Link funciona?
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
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Diagnosticos mapeados (do DynamicTemplatePreview.tsx)
const diagnosticosMapeados = [
  'quiz-ganhos', 'ganhos-prosperidade', 'quiz-ganhos-prosperidade', 'ganhos e prosperidade',
  'quiz-potencial', 'potencial-crescimento', 'quiz-potencial-crescimento', 'potencial e crescimento',
  'quiz-proposito', 'proposito-equilibrio', 'quiz-proposito-equilibrio', 'proposito e equilibrio',
  'quiz-bem-estar', 'bem-estar',
  'quiz-interativo',
  'quiz-detox',
  'quiz-energetico',
  'calc-hidratacao', 'calculadora-agua', 'agua', 'hidratacao',
  'calc-imc', 'calculadora-imc', 'imc',
  'calc-proteina', 'calculadora-proteina', 'proteina',
  'calc-calorias', 'calculadora-calorias', 'calorias'
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
  
  for (const diagnostico of diagnosticosMapeados) {
    const diagnosticoNormalizado = normalizarSlug(diagnostico)
    
    if (slugNormalizado === diagnosticoNormalizado) return true
    if (slugNormalizado.includes(diagnosticoNormalizado) || 
        diagnosticoNormalizado.includes(slugNormalizado)) return true
    
    const palavrasSlug = slugNormalizado.split('-')
    const palavrasDiagnostico = diagnosticoNormalizado.split('-')
    const palavrasComuns = palavrasSlug.filter(p => palavrasDiagnostico.includes(p))
    if (palavrasComuns.length >= 2) return true
  }
  
  return false
}

function temFluxo(content: any): boolean {
  if (!content) return false
  
  // Para quizzes: verificar se tem questions
  if (content.questions && Array.isArray(content.questions) && content.questions.length > 0) {
    return true
  }
  
  // Para calculadoras: verificar se tem fields
  if (content.fields && Array.isArray(content.fields) && content.fields.length > 0) {
    return true
  }
  
  // Para outros tipos: verificar se tem estrutura válida
  if (Object.keys(content).length > 0) {
    return true
  }
  
  return false
}

async function testarLink(userSlug: string, toolSlug: string): Promise<boolean> {
  try {
    const url = `http://localhost:3000/api/wellness/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
    const response = await fetch(url)
    return response.ok
  } catch (error) {
    return false
  }
}

async function verificarTemplates3em3() {
  console.log('🔍 Verificando templates de 3 em 3...\n')
  
  // Buscar todos os templates wellness
  const { data: templates, error: templatesError } = await supabase
    .from('templates_nutrition')
    .select('id, name, slug, type, content, is_active')
    .eq('is_active', true)
    .order('name', { ascending: true })
  
  if (templatesError) {
    console.error('❌ Erro ao buscar templates:', templatesError)
    return
  }
  
  console.log(`📊 Total de templates: ${templates?.length || 0}\n`)
  console.log('=' .repeat(80))
  console.log('VERIFICAÇÃO DE 3 EM 3 TEMPLATES\n')
  console.log('=' .repeat(80))
  
  // Agrupar em grupos de 3
  const grupos = []
  for (let i = 0; i < (templates?.length || 0); i += 3) {
    grupos.push(templates?.slice(i, i + 3) || [])
  }
  
  // User slug de teste (pode ser ajustado)
  const userSlugTeste = 'andre'
  
  for (let grupoIndex = 0; grupoIndex < grupos.length; grupoIndex++) {
    const grupo = grupos[grupoIndex]
    
    console.log(`\n📦 GRUPO ${grupoIndex + 1} (Templates ${grupoIndex * 3 + 1} a ${grupoIndex * 3 + grupo.length}):\n`)
    
    for (const template of grupo) {
      const slug = template.slug || ''
      const nome = template.name || ''
      const temDiagnosticoMapeado = temDiagnostico(slug) || temDiagnostico(nome.toLowerCase())
      const temFluxoConfigurado = temFluxo(template.content)
      const linkFunciona = await testarLink(userSlugTeste, slug)
      
      console.log(`  📋 ${nome}`)
      console.log(`     Slug: ${slug || 'N/A'}`)
      console.log(`     Tipo: ${template.type || 'N/A'}`)
      console.log(`     ✅ Fluxo: ${temFluxoConfigurado ? 'SIM' : '❌ NÃO'}`)
      console.log(`     ✅ Diagnóstico: ${temDiagnosticoMapeado ? 'SIM' : '❌ NÃO'}`)
      console.log(`     ✅ Link funciona: ${linkFunciona ? 'SIM' : '❌ NÃO'}`)
      
      // Status geral
      const todosOk = temFluxoConfigurado && temDiagnosticoMapeado && linkFunciona
      if (!todosOk) {
        console.log(`     ⚠️  STATUS: INCOMPLETO`)
        if (!temFluxoConfigurado) console.log(`        - Falta: Fluxo/Content`)
        if (!temDiagnosticoMapeado) console.log(`        - Falta: Diagnóstico mapeado`)
        if (!linkFunciona) console.log(`        - Falta: Link funcionando`)
      } else {
        console.log(`     ✅ STATUS: OK`)
      }
      console.log()
    }
    
    // Pausa entre grupos (opcional)
    if (grupoIndex < grupos.length - 1) {
      console.log('─'.repeat(80))
    }
  }
  
  // Resumo final
  console.log('\n' + '='.repeat(80))
  console.log('📊 RESUMO FINAL:\n')
  
  let comFluxo = 0
  let comDiagnostico = 0
  let comLinkFuncionando = 0
  let completos = 0
  
  for (const template of templates || []) {
    const slug = template.slug || ''
    const nome = template.name || ''
    const temDiagnosticoMapeado = temDiagnostico(slug) || temDiagnostico(nome.toLowerCase())
    const temFluxoConfigurado = temFluxo(template.content)
    const linkFunciona = await testarLink(userSlugTeste, slug)
    
    if (temFluxoConfigurado) comFluxo++
    if (temDiagnosticoMapeado) comDiagnostico++
    if (linkFunciona) comLinkFuncionando++
    if (temFluxoConfigurado && temDiagnosticoMapeado && linkFunciona) completos++
  }
  
  console.log(`   Total de templates: ${templates?.length || 0}`)
  console.log(`   ✅ Com fluxo: ${comFluxo}`)
  console.log(`   ✅ Com diagnóstico: ${comDiagnostico}`)
  console.log(`   ✅ Com link funcionando: ${comLinkFuncionando}`)
  console.log(`   ✅ Completos (tudo OK): ${completos}`)
  console.log(`   ❌ Incompletos: ${(templates?.length || 0) - completos}`)
  console.log()
}

verificarTemplates3em3().catch(console.error)
