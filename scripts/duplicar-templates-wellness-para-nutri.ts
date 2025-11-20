import path from 'path'
import { config as loadEnv } from 'dotenv'

loadEnv({ path: path.resolve(process.cwd(), '.env.local'), override: true })
loadEnv({ path: path.resolve(process.cwd(), '.env'), override: false })

type TemplateRecord = {
  id: string
  name: string
  slug: string | null
  type: string
  language: string
  specialization: string | null
  objective: string | null
  title: string | null
  description: string | null
  content: any
  cta_text: string | null
  whatsapp_message: string | null
  is_active: boolean
  usage_count: number | null
}

async function main() {
  const { supabaseAdmin } = await import('@/lib/supabase')
  const { normalizeTemplateSlug } = await import('@/lib/template-slug-map')

  if (!supabaseAdmin) {
    throw new Error('Supabase Admin não configurado (verifique SUPABASE_SERVICE_ROLE_KEY)')
  }

  console.log('🔁 Iniciando duplicação de templates Wellness → Nutri...')

  const { data: wellnessTemplates, error: wellnessError } = await supabaseAdmin
    .from('templates_nutrition')
    .select(
      'id, name, slug, type, language, specialization, objective, title, description, content, cta_text, whatsapp_message, is_active, usage_count'
    )
    .eq('profession', 'wellness')
    .eq('language', 'pt')
    .eq('is_active', true)

  if (wellnessError) {
    throw wellnessError
  }

  if (!wellnessTemplates?.length) {
    console.warn('⚠️ Nenhum template Wellness encontrado para copiar.')
    return
  }

  const { data: nutriTemplates, error: nutriError } = await supabaseAdmin
    .from('templates_nutrition')
    .select('id, slug')
    .eq('profession', 'nutri')
    .eq('language', 'pt')

  if (nutriError) {
    throw nutriError
  }

  const existingNutriByCanonical = new Map<
    string,
    { id: string; slug: string | null }
  >()
  const existingSlugs = new Set(
    (nutriTemplates || []).map(t => String(t.slug || '').toLowerCase()).filter(Boolean)
  )
  const wellnessSlugs = new Set(
    wellnessTemplates.map(t => String(t.slug || '').toLowerCase()).filter(Boolean)
  )

  for (const record of nutriTemplates || []) {
    const canonical = normalizeTemplateSlug(record.slug || '')
    if (canonical) {
      existingNutriByCanonical.set(canonical, { id: record.id as string, slug: record.slug })
    }
  }

  const toInsert: TemplateRecord[] = []
  const toUpdate: Array<{ template: TemplateRecord; nutriId: string }> = []

  for (const template of wellnessTemplates as TemplateRecord[]) {
    if (!template.slug) {
      console.warn(`⚠️ Template sem slug ignorado: ${template.name} (${template.id})`)
      continue
    }

    const canonical = normalizeTemplateSlug(template.slug)
    if (!canonical) {
      console.warn(`⚠️ Não foi possível normalizar slug para ${template.slug}, ignorando.`)
      continue
    }

    const existing = existingNutriByCanonical.get(canonical)
    if (existing) {
      toUpdate.push({ template, nutriId: existing.id })
    } else {
      toInsert.push(template)
    }
  }

  console.log(`📦 Templates Wellness encontrados: ${wellnessTemplates.length}`)
  console.log(`🆕 Templates novos para Nutri: ${toInsert.length}`)
  console.log(`♻️ Templates existentes que serão atualizados: ${toUpdate.length}`)

  if (toInsert.length) {
    const insertPayload = toInsert.map(template => {
      const canonical = normalizeTemplateSlug(template.slug || template.name || '') || template.slug || undefined
      let desiredSlug = canonical ? `${canonical}-nutri` : template.slug || undefined

      if (!desiredSlug) {
        desiredSlug = `${template.id}-nutri`
      }

      let finalSlug = desiredSlug
      let suffix = 1
      while (
        !finalSlug ||
        existingSlugs.has(finalSlug.toLowerCase()) ||
        wellnessSlugs.has(finalSlug.toLowerCase())
      ) {
        finalSlug = `${desiredSlug}-${suffix++}`
      }

      existingSlugs.add(finalSlug.toLowerCase())

      return {
        name: template.name,
        slug: finalSlug,
        type: template.type,
        language: template.language,
        specialization: template.specialization,
        objective: template.objective,
        title: template.title,
        description: template.description,
        content: template.content,
        cta_text: template.cta_text,
        whatsapp_message: template.whatsapp_message,
        is_active: true,
        usage_count: template.usage_count ?? 0,
        profession: 'nutri'
      }
    })

    const { error: insertError } = await supabaseAdmin
      .from('templates_nutrition')
      .insert(insertPayload)

    if (insertError) {
      throw insertError
    }

    console.log(`✅ Inseridos ${toInsert.length} templates novos para Nutri.`)
  }

  if (toUpdate.length) {
    for (const { template, nutriId } of toUpdate) {
      const { error: updateError } = await supabaseAdmin
        .from('templates_nutrition')
        .update({
          name: template.name,
          type: template.type,
          specialization: template.specialization,
          objective: template.objective,
          title: template.title,
          description: template.description,
          content: template.content,
          cta_text: template.cta_text,
          whatsapp_message: template.whatsapp_message,
          is_active: true,
          usage_count: template.usage_count ?? 0,
          updated_at: new Date().toISOString()
        })
        .match({ id: nutriId })

      if (updateError) {
        console.error(`❌ Erro ao atualizar template ${template.slug}:`, updateError.message)
        throw updateError
      }
    }

    console.log(`🔄 Atualizados ${toUpdate.length} templates Nutri existentes para o novo padrão.`)
  }

  console.log('🎉 Concluído! Templates Nutri agora estão sincronizados com a base Wellness.')
}

main().catch(error => {
  console.error('❌ Falha ao duplicar templates:', error)
  process.exit(1)
})

