/**
 * DIAGNÓSTICO COMPLETO DOS TEMPLATES NUTRI
 * 
 * Este script analisa:
 * 1. Todos os templates em templates_nutrition (templates base)
 * 2. Os slugs de cada template
 * 3. Se existem user_templates correspondentes para o usuário demo
 * 4. As URLs geradas vs URLs esperadas
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function diagnosticoCompleto() {
  console.log('🔍 DIAGNÓSTICO COMPLETO DOS TEMPLATES NUTRI\n')
  console.log('='.repeat(80))
  console.log('')

  try {
    // 1. Buscar usuário demo
    console.log('1️⃣ Buscando usuário demo...')
    const { data: demoProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, user_slug, nome_completo')
      .eq('email', 'demo.nutri@ylada.com')
      .single()

    if (profileError || !demoProfile) {
      console.error('❌ Usuário demo não encontrado:', profileError)
      return
    }

    console.log('✅ Usuário demo encontrado:')
    console.log(`   - ID: ${demoProfile.user_id}`)
    console.log(`   - Email: ${demoProfile.email}`)
    console.log(`   - User Slug: ${demoProfile.user_slug || 'NÃO CONFIGURADO'}`)
    console.log(`   - Nome: ${demoProfile.nome_completo || 'N/A'}`)
    console.log('')

    // 2. Buscar todos os templates base (templates_nutrition)
    console.log('2️⃣ Buscando templates base (templates_nutrition)...')
    const { data: templatesBase, error: templatesError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, slug, type, profession, language, is_active')
      .eq('profession', 'nutri')
      .eq('language', 'pt')
      .eq('is_active', true)
      .order('type', { ascending: true })
      .order('name', { ascending: true })

    if (templatesError) {
      console.error('❌ Erro ao buscar templates base:', templatesError)
      return
    }

    console.log(`✅ ${templatesBase.length} templates base encontrados\n`)

    // 3. Buscar user_templates do usuário demo
    console.log('3️⃣ Buscando user_templates do usuário demo...')
    const { data: userTemplates, error: userTemplatesError } = await supabaseAdmin
      .from('user_templates')
      .select('id, title, slug, template_slug, template_id, status, profession')
      .eq('user_id', demoProfile.user_id)
      .eq('profession', 'nutri')
      .eq('status', 'active')

    if (userTemplatesError) {
      console.error('❌ Erro ao buscar user_templates:', userTemplatesError)
    } else {
      console.log(`✅ ${userTemplates.length} user_templates encontrados\n`)
    }

    // 4. Análise detalhada
    console.log('4️⃣ ANÁLISE DETALHADA POR TEMPLATE')
    console.log('='.repeat(80))
    console.log('')

    const relatorio = []

    for (const template of templatesBase) {
      const templateSlug = template.slug || template.id
      const urlGerada = `http://localhost:3000/pt/nutri/${demoProfile.user_slug || 'SEM-SLUG'}/${templateSlug}`
      
      // Buscar user_template correspondente
      const userTemplate = userTemplates?.find(
        ut => ut.template_slug === templateSlug || 
              ut.template_id === template.id ||
              ut.slug === templateSlug
      )

      const status = userTemplate ? '✅ TEM USER_TEMPLATE' : '❌ SEM USER_TEMPLATE'
      const userTemplateSlug = userTemplate?.slug || 'N/A'
      const urlEsperada = userTemplate 
        ? `http://localhost:3000/pt/nutri/${demoProfile.user_slug || 'SEM-SLUG'}/${userTemplateSlug}`
        : urlGerada

      relatorio.push({
        template: {
          id: template.id,
          name: template.name,
          slug: templateSlug,
          type: template.type
        },
        userTemplate: userTemplate ? {
          id: userTemplate.id,
          slug: userTemplateSlug,
          template_slug: userTemplate.template_slug,
          status: userTemplate.status
        } : null,
        urls: {
          gerada: urlGerada,
          esperada: urlEsperada,
          match: userTemplate ? (userTemplateSlug === templateSlug) : false
        },
        status
      })

      console.log(`📋 ${template.name}`)
      console.log(`   Tipo: ${template.type}`)
      console.log(`   Slug (base): ${templateSlug}`)
      console.log(`   Status: ${status}`)
      if (userTemplate) {
        console.log(`   Slug (user_template): ${userTemplateSlug}`)
        console.log(`   Template Slug: ${userTemplate.template_slug || 'N/A'}`)
      }
      console.log(`   URL Gerada: ${urlGerada}`)
      console.log(`   URL Esperada: ${urlEsperada}`)
      if (userTemplate && userTemplateSlug !== templateSlug) {
        console.log(`   ⚠️ ATENÇÃO: Slugs não coincidem!`)
      }
      console.log('')
    }

    // 5. Resumo
    console.log('5️⃣ RESUMO')
    console.log('='.repeat(80))
    console.log('')
    console.log(`Total de templates base: ${templatesBase.length}`)
    console.log(`Total de user_templates: ${userTemplates?.length || 0}`)
    console.log(`Templates com user_template: ${relatorio.filter(r => r.userTemplate).length}`)
    console.log(`Templates SEM user_template: ${relatorio.filter(r => !r.userTemplate).length}`)
    console.log(`Templates com slugs diferentes: ${relatorio.filter(r => r.userTemplate && !r.urls.match).length}`)
    console.log('')

    // 6. Templates problemáticos
    const problematicos = relatorio.filter(r => !r.userTemplate || !r.urls.match)
    if (problematicos.length > 0) {
      console.log('6️⃣ TEMPLATES PROBLEMÁTICOS (sem user_template ou slugs diferentes)')
      console.log('='.repeat(80))
      console.log('')
      problematicos.forEach((p, idx) => {
        console.log(`${idx + 1}. ${p.template.name}`)
        console.log(`   Slug base: ${p.template.slug}`)
        if (p.userTemplate) {
          console.log(`   Slug user_template: ${p.userTemplate.slug}`)
          console.log(`   ⚠️ Slugs não coincidem!`)
        } else {
          console.log(`   ❌ Não tem user_template correspondente`)
        }
        console.log('')
      })
    }

    // 7. Exportar relatório JSON
    console.log('7️⃣ Exportando relatório completo...')
    const fs = require('fs')
    const relatorioPath = './diagnostico-templates-nutri.json'
    fs.writeFileSync(relatorioPath, JSON.stringify(relatorio, null, 2))
    console.log(`✅ Relatório salvo em: ${relatorioPath}`)
    console.log('')

  } catch (error) {
    console.error('❌ Erro no diagnóstico:', error)
  }
}

diagnosticoCompleto()

