import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar formulários do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const formType = searchParams.get('form_type')
    const isActive = searchParams.get('is_active')
    const isTemplate = searchParams.get('is_template')

    const authenticatedUserId = user.id

    // Debug: log do user_id autenticado
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Formulários Coach API - User ID autenticado:', authenticatedUserId)
    }

    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários
    // Nota: slug e short_code podem não existir em instalações antigas
    let query = supabaseAdmin
      .from('custom_forms')
      .select('id, user_id, name, description, form_type, structure, is_active, is_template, created_at, updated_at', { count: 'exact' })

    // Se is_template=true, buscar templates de todos os usuários
    // Caso contrário, buscar apenas formulários do usuário autenticado (não templates)
    if (isTemplate === 'true') {
      // Buscar apenas templates (is_template=true)
      query = query.eq('is_template', true)
    } else {
      // Buscar apenas formulários do usuário autenticado que NÃO são templates
      query = query
        .eq('user_id', authenticatedUserId)
        .eq('is_template', false) // Garantir que não pegue templates
    }

    query = query.order('created_at', { ascending: false })

    if (formType) {
      query = query.eq('form_type', formType)
    }

    // NÃO filtrar por is_active por padrão - mostrar todos os formulários
    // Só filtrar se explicitamente solicitado
    if (isActive !== null && isActive !== undefined) {
      query = query.eq('is_active', isActive === 'true')
    }

    console.log('🔍 Query final antes de executar:', {
      isTemplate,
      authenticatedUserId,
      formType,
      isActive,
      willFilterByActive: isActive !== null && isActive !== undefined
    })

    const { data: forms, error, count } = await query

    console.log('🔍 Query de formulários executada:', {
      isTemplate,
      authenticatedUserId,
      formType,
      isActive,
      formsEncontrados: forms?.length || 0,
      count,
      error: error?.message,
      forms: forms?.slice(0, 3).map((f: any) => ({
        id: f.id,
        name: f.name,
        user_id: f.user_id,
        is_template: f.is_template
      }))
    })
    
    // Se não encontrou formulários, verificar se é problema de user_id
    if ((!forms || forms.length === 0) && !isTemplate) {
      console.warn('⚠️ Nenhum formulário encontrado para o usuário:', authenticatedUserId)
      console.warn('💡 Verificando se há formulários no banco para este usuário...')
      
      // Verificação adicional - buscar TODOS os formulários (sem filtro de user_id)
      const { data: allForms, error: allError } = await supabaseAdmin
        .from('custom_forms')
        .select('id, name, user_id, is_template, is_active')
        .limit(10)
      
      console.log('🔍 Verificação - TODOS os formulários no banco (amostra):', {
        totalEncontrado: allForms?.length || 0,
        error: allError?.message,
        exemplos: allForms?.map((f: any) => ({
          id: f.id,
          name: f.name,
          user_id: f.user_id,
          is_template: f.is_template,
          is_active: f.is_active,
          matchesAuthUser: f.user_id === authenticatedUserId
        }))
      })
      
      // Verificação específica para o usuário autenticado
      const { data: userForms, error: userError } = await supabaseAdmin
        .from('custom_forms')
        .select('id, name, user_id, is_template, is_active')
        .eq('user_id', authenticatedUserId)
        .limit(10)
      
      console.log('🔍 Verificação - Formulários do usuário autenticado:', {
        encontrados: userForms?.length || 0,
        error: userError?.message,
        exemplos: userForms
      })
    }

    if (error) {
      console.error('❌ Erro ao buscar formulários:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar formulários', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Adicionar short_code e slug se as colunas existirem (busca separada para compatibilidade)
    let formsWithExtra = forms || []
    
    console.log('📊 Formulários encontrados antes de processar:', {
      total: formsWithExtra.length,
      forms: formsWithExtra.map((f: any) => ({
        id: f.id,
        name: f.name,
        user_id: f.user_id,
        is_template: f.is_template
      }))
    })
    let userSlugFromProfile: string | null = null
    
    // Buscar user_slug do perfil primeiro (fora do bloco de forms para estar sempre disponível)
    if (authenticatedUserId) {
      try {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', authenticatedUserId)
          .maybeSingle()
        
        userSlugFromProfile = profile?.user_slug || null
        
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 User slug do perfil:', {
            authenticatedUserId,
            userSlug: userSlugFromProfile,
            hasUserSlug: !!userSlugFromProfile
          })
        }
      } catch (err) {
        console.warn('⚠️ Erro ao buscar user_slug:', err)
      }
    }
    
    if (formsWithExtra.length > 0) {
      try {
        const formIds = formsWithExtra.map((f: any) => f.id)
        
        // Tentar buscar short_code e slug - se as colunas não existirem, vai dar erro
        let formsWithExtraData: any[] = []
        let extraError: any = null
        
        try {
          const result = await supabaseAdmin
            .from('custom_forms')
            .select('id, short_code, slug, user_id, is_template')
            .in('id', formIds)
          
          formsWithExtraData = result.data || []
          extraError = result.error
          
          console.log('📊 Dados de slug/short_code buscados:', {
            total: formsWithExtraData.length,
            comSlug: formsWithExtraData.filter((f: any) => f.slug).length,
            comShortCode: formsWithExtraData.filter((f: any) => f.short_code).length,
            exemplos: formsWithExtraData.slice(0, 3).map((f: any) => ({
              id: f.id,
              slug: f.slug,
              short_code: f.short_code,
              is_template: f.is_template
            }))
          })
        } catch (selectError: any) {
          console.warn('⚠️ Erro ao buscar short_code/slug (colunas podem não existir):', selectError.message)
          extraError = selectError
        }
        
        if (!extraError && formsWithExtraData && formsWithExtraData.length > 0) {
          const shortCodeMap = new Map(formsWithExtraData.map((f: any) => [f.id, f.short_code || null]))
          const slugMap = new Map(formsWithExtraData.map((f: any) => [f.id, f.slug || null]))
          
          // Gerar slug para formulários que não têm
          const normalizeSlug = (value: string) => {
            return value
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '') // Remove acentos
              .replace(/[^a-z0-9-]/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '') || 'formulario'
          }
          
          // Gerar slugs para formulários que não têm (independente de ter user_slug)
          // Mas só usar user_slug+slug nos links se user_slug estiver configurado
          const formsToUpdate: Array<{ id: string, slug: string }> = []
          formsWithExtra = await Promise.all(formsWithExtra.map(async (form: any) => {
            let slug = slugMap.get(form.id) || null
            const shortCode = shortCodeMap.get(form.id) || null
            
            // Se não tem slug, gerar um baseado no nome (sempre gerar, mesmo sem user_slug)
            if (!slug && form.name) {
              let candidateSlug = normalizeSlug(form.name)
              
              // Verificar se já existe para este usuário
              const { data: existing } = await supabaseAdmin
                .from('custom_forms')
                .select('id')
                .eq('user_id', form.user_id)
                .eq('slug', candidateSlug)
                .neq('id', form.id)
                .maybeSingle()
              
              // Se já existe, adicionar número
              if (existing) {
                for (let attempt = 2; attempt <= 50; attempt++) {
                  const candidate = `${candidateSlug}-${attempt}`
                  const { data: exists } = await supabaseAdmin
                    .from('custom_forms')
                    .select('id')
                    .eq('user_id', form.user_id)
                    .eq('slug', candidate)
                    .maybeSingle()
                  
                  if (!exists) {
                    candidateSlug = candidate
                    break
                  }
                }
              }
              
              slug = candidateSlug
              formsToUpdate.push({ id: form.id, slug: candidateSlug })
              
              console.log('✨ Slug gerado para formulário:', {
                formId: form.id,
                formName: form.name,
                generatedSlug: candidateSlug,
                hasUserSlug: !!userSlugFromProfile
              })
            }
            
            return {
              ...form,
              short_code: shortCode,
              slug: slug
            }
          }))
          
          // Atualizar formulários sem slug em lote
          if (formsToUpdate.length > 0) {
            console.log(`🔄 Atualizando ${formsToUpdate.length} formulários com slugs gerados...`)
            for (const { id, slug } of formsToUpdate) {
              const { data: updatedData, error: updateError } = await supabaseAdmin
                .from('custom_forms')
                .update({ slug })
                .eq('id', id)
                .select('id, slug')
                .single()
              
              if (updateError) {
                console.error(`❌ Erro ao atualizar slug do formulário ${id}:`, updateError)
              } else {
                console.log(`✅ Slug atualizado para formulário ${id}: ${slug}`)
                // Atualizar o slug no formsWithExtra para garantir que está sincronizado
                const formIndex = formsWithExtra.findIndex((f: any) => f.id === id)
                if (formIndex !== -1) {
                  formsWithExtra[formIndex].slug = slug
                }
              }
            }
          }
          
          // Log sobre user_slug
          if (!userSlugFromProfile) {
            console.warn('⚠️ User slug não encontrado - links usarão /f/{id} até configurar user_slug')
          } else {
            console.log('✅ User slug encontrado - links usarão formato /pt/c/{user_slug}/formulario/{slug}')
          }
        }
      } catch (err: any) {
        // Se as colunas não existirem, apenas ignora e continua sem short_code e slug
        console.warn('⚠️ Colunas short_code/slug não encontradas (normal se migração não foi executada):', err?.message || err)
        console.warn('💡 Execute a migração: migrations/007-garantir-slug-short-code-custom-forms.sql')
        // Adiciona short_code e slug como null para todos os formulários
        formsWithExtra = formsWithExtra.map((form: any) => ({
          ...form,
          short_code: null,
          slug: null
        }))
      }
    }

    // Debug: log dos resultados
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Formulários Coach encontrados:', {
        total: count,
        forms: formsWithExtra?.map((f: any) => ({ 
          id: f.id, 
          name: f.name, 
          user_id: f.user_id, 
          slug: f.slug,
          short_code: f.short_code,
          hasShortCode: !!f.short_code, 
          hasSlug: !!f.slug 
        })),
        authenticatedUserId
      })
    }

    // Garantir que todos os formulários tenham slug e short_code (mesmo que null)
    // IMPORTANTE: Buscar slugs do banco novamente para garantir que temos os mais recentes
    if (formsWithExtra.length > 0) {
      try {
        const formIds = formsWithExtra.map((f: any) => f.id)
        const { data: latestSlugs, error: slugError } = await supabaseAdmin
          .from('custom_forms')
          .select('id, slug, short_code')
          .in('id', formIds)
        
        if (!slugError && latestSlugs) {
          // Criar mapa dos slugs mais recentes
          const latestSlugMap = new Map(latestSlugs.map((f: any) => [f.id, { slug: f.slug || null, short_code: f.short_code || null }]))
          
          // Atualizar formsWithExtra com os slugs mais recentes do banco
          formsWithExtra = formsWithExtra.map((form: any) => {
            const latest = latestSlugMap.get(form.id)
            return {
              ...form,
              slug: latest?.slug || form.slug || null,
              short_code: latest?.short_code || form.short_code || null
            }
          })
        }
      } catch (err) {
        console.warn('⚠️ Erro ao buscar slugs atualizados:', err)
      }
    }
    
    const formsFinal = (formsWithExtra || []).map((form: any) => {
      // Garantir que slug e short_code estejam presentes e não sejam undefined
      const finalForm = {
        ...form,
        slug: form.slug || null,
        short_code: form.short_code || null
      }
      return finalForm
    })

    console.log('📤 Retornando formulários:', {
      total: formsFinal.length,
      comSlug: formsFinal.filter((f: any) => f.slug && f.slug !== null).length,
      semSlug: formsFinal.filter((f: any) => !f.slug || f.slug === null).length,
      comShortCode: formsFinal.filter((f: any) => f.short_code).length,
      userSlugConfigurado: !!userSlugFromProfile,
      exemplos: formsFinal.slice(0, 5).map((f: any) => ({
        id: f.id,
        name: f.name,
        slug: f.slug,
        short_code: f.short_code,
        hasSlug: !!f.slug
      }))
    })

    return NextResponse.json({
      success: true,
      data: {
        forms: formsFinal,
        total: count || 0
      },
      // Debug info apenas em desenvolvimento
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          authenticatedUserId,
          formsFound: formsFinal?.length || 0,
          userSlugConfigured: !!userSlugFromProfile
        }
      })
    })

  } catch (error: any) {
    console.error('Erro ao listar formulários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar novo formulário
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const authenticatedUserId = user.id
    const body = await request.json()
    const {
      name,
      description,
      form_type = 'questionario',
      structure,
      is_active = true,
      is_template = false,
      generate_short_url = false,
      custom_short_code = null
    } = body

    // Validações
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome do formulário é obrigatório' },
        { status: 400 }
      )
    }

    if (!structure || !Array.isArray(structure.fields)) {
      return NextResponse.json(
        { error: 'Estrutura do formulário é obrigatória e deve conter um array de campos' },
        { status: 400 }
      )
    }

    // Validar tipos de formulário
    const validTypes = ['questionario', 'anamnese', 'avaliacao', 'consentimento', 'outro']
    if (!validTypes.includes(form_type)) {
      return NextResponse.json(
        { error: `Tipo de formulário inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Gerar slug automaticamente baseado no nome
    const normalizeSlug = (value: string) => {
      return value
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '') || 'formulario'
    }

    let finalSlug = normalizeSlug(name)
    
    // Verificar se slug já existe para este usuário
    const slugExists = async (candidate: string) => {
      const { data } = await supabaseAdmin
        .from('custom_forms')
        .select('id')
        .eq('slug', candidate)
        .eq('user_id', authenticatedUserId)
        .maybeSingle()

      return !!data
    }

    // Ajustar slug se necessário (adicionar número se já existir)
    let slugAdjusted = false
    if (await slugExists(finalSlug)) {
      for (let attempt = 2; attempt <= 50; attempt++) {
        const candidate = `${finalSlug}-${attempt}`
        if (!(await slugExists(candidate))) {
          finalSlug = candidate
          slugAdjusted = true
          break
        }
      }

      if (!slugAdjusted) {
        return NextResponse.json(
          { error: 'Não foi possível gerar um link único automaticamente. Escolha outro nome e tente novamente.' },
          { status: 409 }
        )
      }
    }

    // Gerar código curto se solicitado
    let shortCode = null
    if (generate_short_url) {
      if (custom_short_code) {
        const customCode = custom_short_code.toLowerCase().trim()
        
        // Validar formato
        if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
          return NextResponse.json(
            { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
            { status: 400 }
          )
        }

        // Verificar disponibilidade (em todas as tabelas que usam short_code)
        const [toolCheck, quizCheck, portalCheck, formCheck] = await Promise.all([
          supabaseAdmin.from('coach_user_templates').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('custom_forms').select('id').eq('short_code', customCode).limit(1)
        ])

        if ((toolCheck.data && toolCheck.data.length > 0) ||
            (quizCheck.data && quizCheck.data.length > 0) ||
            (portalCheck.data && portalCheck.data.length > 0) ||
            (formCheck.data && formCheck.data.length > 0)) {
          return NextResponse.json(
            { error: 'Este código personalizado já está em uso' },
            { status: 409 }
          )
        }

        shortCode = customCode
      } else {
        // Gerar código aleatório
        const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
        if (!codeError && codeData) {
          shortCode = codeData
        } else {
          console.error('Erro ao gerar código curto:', codeError)
        }
      }
    }

    // Preparar dados
    const formData: any = {
      user_id: authenticatedUserId,
      name: name.trim(),
      description: description || null,
      form_type: form_type,
      structure: structure,
      is_active: is_active,
      is_template: is_template,
      slug: finalSlug // Adicionar slug gerado automaticamente
    }

    // Adicionar short_code se foi gerado
    if (shortCode) {
      formData.short_code = shortCode
    }

    // Inserir formulário
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários (incluindo short_code e slug se existirem)
    const { data: newForm, error } = await supabaseAdmin
      .from('custom_forms')
      .insert(formData)
      .select('id, user_id, name, description, form_type, structure, is_active, is_template, short_code, slug, created_at, updated_at')
      .single()

    if (error) {
      console.error('Erro ao criar formulário:', error)
      return NextResponse.json(
        { error: 'Erro ao criar formulário', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form: newForm }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

