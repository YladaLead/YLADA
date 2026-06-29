import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'
import { findHandleConflict } from '@/lib/ylada-flow/handle-namespace'

// GET - Buscar perfil do usuário
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const checkSlug = searchParams.get('user_slug')

    // Se está verificando disponibilidade de slug
    if (checkSlug) {
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('user_slug', checkSlug)
        .single()

      return NextResponse.json({
        exists: !!existingProfile,
        isOwn: existingProfile?.user_id === user.id
      })
    }

    // Buscar perfil do usuário (tentar buscar campos que podem não existir)
    let profile: any = null
    try {
      console.log('🔍 GET /api/c/profile - Buscando perfil para user_id:', user.id)
      
      // Tentar buscar todos os campos primeiro
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, whatsapp, bio, filosofia, formacao_empresarial, user_slug, country_code')
        .eq('user_id', user.id)
        .single()

      console.log('📋 Resultado da busca:', {
        hasData: !!profileData,
        hasError: !!profileError,
        errorCode: profileError?.code,
        errorMessage: profileError?.message,
        data: profileData
      })

      if (!profileError) {
        profile = profileData
        console.log('✅ Perfil encontrado:', {
          nome_completo: profileData?.nome_completo,
          email: profileData?.email,
          whatsapp: profileData?.whatsapp,
          bio: profileData?.bio,
          user_slug: profileData?.user_slug,
          country_code: profileData?.country_code
        })
      } else if (profileError.code === 'PGRST116') {
        // Não encontrado - tudo bem, será criado
        console.log('⚠️ Perfil não encontrado (PGRST116)')
        profile = null
      } else if (profileError.message?.includes('column') || profileError.message?.includes('schema cache')) {
        // Campos não existem - tentar buscar apenas campos básicos
        console.warn('⚠️ Alguns campos não existem, buscando apenas campos básicos')
        try {
          const { data: basicProfile } = await supabaseAdmin
            .from('user_profiles')
            .select('nome_completo, email')
            .eq('user_id', user.id)
            .maybeSingle()
          profile = basicProfile || null
          console.log('✅ Perfil básico encontrado:', basicProfile)
        } catch (e) {
          console.warn('❌ Erro ao buscar perfil básico:', e)
          profile = null
        }
      } else {
        // Outro erro - logar mas continuar
        console.warn('❌ Erro ao buscar perfil completo:', profileError)
        profile = null
      }
    } catch (err: any) {
      // Se deu erro geral, tentar buscar apenas campos básicos
      console.error('❌ Erro geral ao buscar perfil:', err)
      try {
        const { data: basicProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo, email')
          .eq('user_id', user.id)
          .maybeSingle()
        profile = basicProfile || null
        console.log('✅ Perfil básico encontrado após erro:', basicProfile)
      } catch (e) {
        console.error('❌ Erro ao buscar perfil básico:', e)
        profile = null
      }
    }

    // Buscar email do auth.users
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)

    const responseData = {
      success: true,
      profile: {
        nome: profile?.nome_completo || authUser?.user?.user_metadata?.full_name || '',
        email: authUser?.user?.email || profile?.email || '',
        telefone: profile?.whatsapp || '', // telefone é mapeado de whatsapp
        whatsapp: profile?.whatsapp || '',
        countryCode: profile?.country_code || 'BR',
        bio: profile?.bio || '',
        filosofia: profile?.filosofia || '',
        formacao_empresarial: profile?.formacao_empresarial || '',
        userSlug: profile?.user_slug || ''
      }
    }

    console.log('📤 Retornando dados do perfil:', {
      nome: responseData.profile.nome,
      email: responseData.profile.email,
      whatsapp: responseData.profile.whatsapp,
      bio: responseData.profile.bio,
      userSlug: responseData.profile.userSlug,
      countryCode: responseData.profile.countryCode
    })

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('Erro técnico ao buscar perfil:', error)
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// PUT - Atualizar perfil do usuário
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      nome,
      email,
      telefone, // aceitar do frontend mas não usar no banco
      whatsapp,
      countryCode,
      bio,
      filosofia,
      formacao_empresarial,
      userSlug
    } = body

    // Log dos valores recebidos para debug
    console.log('📥 Valores recebidos do frontend:', {
      telefone: telefone ? `${telefone.substring(0, 5)}...` : 'vazio/undefined',
      whatsapp: whatsapp ? `${whatsapp.substring(0, 5)}...` : 'vazio/undefined',
      countryCode: countryCode || 'não fornecido',
      hasTelefone: telefone !== undefined && telefone !== null,
      hasWhatsapp: whatsapp !== undefined && whatsapp !== null,
      hasCountryCode: countryCode !== undefined && countryCode !== null
    })

    // Verificar se user_slug já existe para outro usuário
    if (userSlug) {
      // Lista de palavras reservadas que não podem ser usadas como user_slug
      const palavrasReservadas = ['portal', 'ferramenta', 'ferramentas', 'home', 'configuracao', 'configuracoes', 'perfil', 'admin', 'api', 'pt', 'c', 'coach', 'nutri', 'wellness', 'nutra']
      
      if (palavrasReservadas.includes(userSlug.toLowerCase())) {
        return NextResponse.json(
          { error: `"${userSlug}" é uma palavra reservada e não pode ser usada como nome de URL. Escolha outro nome.` },
          { status: 400 }
        )
      }
      
      const { data: existingSlug } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('user_slug', userSlug)
        .single()

      if (existingSlug && existingSlug.user_id !== user.id) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso por outro usuário. Escolha outro.' },
          { status: 409 }
        )
      }

      // Namespace único de handle: rejeita colisão com rede/membro também.
      const handleConflict = await findHandleConflict(supabaseAdmin, userSlug, user.id)
      if (handleConflict.taken) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso (por uma rede ou outro perfil). Escolha outro.' },
          { status: 409 }
        )
      }
    }

    // Buscar perfil atual para garantir que não está mudando de área e verificar user_slug
    const { data: currentProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, is_admin, is_support, user_slug')
      .eq('user_id', user.id)
      .maybeSingle()

    // VALIDAÇÃO: Não permitir mudança de perfil após criado
    // EXCEÇÃO: Admin e Suporte podem ter múltiplos perfis
    if (currentProfile && currentProfile.perfil && currentProfile.perfil !== 'coach') {
      if (!currentProfile.is_admin && !currentProfile.is_support) {
        return NextResponse.json(
          { 
            error: `Você não pode alterar seu perfil. Este email está cadastrado na área ${currentProfile.perfil}.`,
            technical: process.env.NODE_ENV === 'development' ? {
              currentPerfil: currentProfile.perfil,
              attemptedPerfil: 'coach',
              is_admin: currentProfile.is_admin,
              is_support: currentProfile.is_support
            } : undefined
          },
          { status: 403 }
        )
      }
    }

    // Verificar se é a primeira vez configurando user_slug (não tinha antes e agora tem)
    const isFirstTimeSettingSlug = (!currentProfile?.user_slug || currentProfile.user_slug === null) && userSlug && userSlug.trim() !== ''

    // Atualizar user_profiles (apenas campos que existem)
    const profileData: any = {
      nome_completo: nome,
      email: email || user.email, // Sincronizar email também
      perfil: 'coach', // Garantir que o perfil está definido
      profession: 'coach', // Sincronizar profession baseado no perfil
      updated_at: new Date().toISOString() // Forçar atualização do timestamp
    }

    // Adicionar campos opcionais apenas se fornecidos
    // Usar whatsapp (ou telefone como fallback) - apenas whatsapp existe no banco
    // IMPORTANTE: Sempre tentar salvar whatsapp se fornecido (mesmo que vazio, será null)
    // Verificar se whatsapp ou telefone foram fornecidos (mesmo que vazios)
    // Se o campo foi enviado no body, sempre processar (mesmo que seja string vazia)
    const whatsappValue = whatsapp !== undefined ? whatsapp : (telefone !== undefined ? telefone : null)
    
    if (whatsappValue !== null && whatsappValue !== undefined) {
      // Remover caracteres não numéricos
      const whatsappLimpo = whatsappValue.toString().replace(/\D/g, '')
      if (whatsappLimpo.length > 0) {
        profileData.whatsapp = whatsappLimpo
        console.log('📱 WhatsApp que será salvo:', whatsappLimpo)
      } else {
        // Se foi fornecido mas está vazio após limpeza, definir como null
        profileData.whatsapp = null
        console.log('📱 WhatsApp fornecido mas vazio após limpeza, definindo como null')
      }
    } else {
      // Se não foi fornecido explicitamente, não alterar o valor atual
      console.log('📱 WhatsApp não fornecido no body, mantendo valor atual')
    }
    
    // Adicionar campos que podem não existir ainda (o Supabase vai ignorar se não existirem)
    if (bio !== undefined) {
      profileData.bio = bio || null
    }
    
    if (filosofia !== undefined) {
      profileData.filosofia = filosofia || null
    }
    
    if (formacao_empresarial !== undefined) {
      profileData.formacao_empresarial = formacao_empresarial || null
    }
    
    // Sempre salvar userSlug se fornecido (mesmo que seja string vazia, será null)
    if (userSlug !== undefined && userSlug !== null) {
      profileData.user_slug = userSlug || null
      console.log('🔗 User slug que será salvo:', userSlug)
    } else {
      console.log('🔗 User slug não fornecido, mantendo valor atual')
    }
    
    // Sempre salvar countryCode se fornecido (mesmo que seja string vazia, será null)
    if (countryCode !== undefined && countryCode !== null) {
      profileData.country_code = countryCode || null
      console.log('🌍 Country code que será salvo:', countryCode)
    } else {
      console.log('🌍 Country code não fornecido, mantendo valor atual')
    }

    // Preparar dados completos para UPSERT
    const fullProfileData = {
      user_id: user.id,
      ...profileData
    }

    console.log('📝 Salvando perfil (UPSERT):', {
      userId: user.id,
      profileData: Object.keys(fullProfileData),
      dadosCompletos: {
        nome_completo: fullProfileData.nome_completo,
        email: fullProfileData.email,
        whatsapp: fullProfileData.whatsapp,
        country_code: fullProfileData.country_code,
        user_slug: fullProfileData.user_slug,
        bio: fullProfileData.bio ? `${fullProfileData.bio.substring(0, 50)}...` : null,
        filosofia: fullProfileData.filosofia ? `${fullProfileData.filosofia.substring(0, 50)}...` : null,
        formacao_empresarial: fullProfileData.formacao_empresarial ? `${fullProfileData.formacao_empresarial.substring(0, 50)}...` : null,
        perfil: fullProfileData.perfil,
        profession: fullProfileData.profession
      }
    })

    // Usar UPSERT para evitar duplicatas
    // Isso garante que se já existe um registro com esse user_id, ele será atualizado
    // Se não existe, será criado
    let result
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .upsert(fullProfileData, {
          onConflict: 'user_id', // Usar user_id como chave de conflito
          ignoreDuplicates: false // Atualizar se existir
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao fazer UPSERT do perfil completo:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })

        // Se der erro de coluna não encontrada ou schema cache, tentar UPSERT apenas campos básicos
        if (error.message?.includes('column') || error.message?.includes('schema cache') || error.code === '42703') {
          console.log('⚠️ Tentando UPSERT apenas com campos básicos...')
          const basicData: any = {
            user_id: user.id,
            nome_completo: nome,
            email: email || user.email, // Sincronizar email também
            perfil: 'coach',
            profession: 'coach', // Sincronizar profession
            updated_at: new Date().toISOString()
          }
          // Garantir que whatsapp seja salvo no salvamento básico também
          const whatsappValue = whatsapp || telefone
          if (whatsappValue !== undefined && whatsappValue !== null) {
            const whatsappLimpo = whatsappValue.toString().replace(/\D/g, '')
            if (whatsappLimpo.length > 0) {
              basicData.whatsapp = whatsappLimpo
              console.log('📱 WhatsApp (básico) que será salvo:', whatsappLimpo)
            } else {
              basicData.whatsapp = null
              console.log('📱 WhatsApp (básico) fornecido mas vazio, definindo como null')
            }
          }
          // Garantir que countryCode seja salvo no salvamento básico também
          if (countryCode !== undefined && countryCode !== null) {
            basicData.country_code = countryCode || null
            console.log('🌍 Country code (básico) que será salvo:', countryCode)
          }
          // Garantir que userSlug seja salvo no salvamento básico também
          if (userSlug !== undefined && userSlug !== null) {
            basicData.user_slug = userSlug || null
            console.log('🔗 User slug (básico) que será salvo:', userSlug)
          }
          // Garantir que bio, filosofia e formacao_empresarial sejam salvos no básico também
          if (bio !== undefined) {
            basicData.bio = bio || null
          }
          if (filosofia !== undefined) {
            basicData.filosofia = filosofia || null
          }
          if (formacao_empresarial !== undefined) {
            basicData.formacao_empresarial = formacao_empresarial || null
          }
          
          const { data: basicResult, error: basicError } = await supabaseAdmin
            .from('user_profiles')
            .upsert(basicData, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            })
            .select()
            .single()
          
          if (basicError) {
            console.error('❌ Erro ao fazer UPSERT do perfil básico:', basicError)
            throw basicError
          }
          console.log('✅ Perfil básico salvo com sucesso (UPSERT)')
          result = basicResult
        } else {
          throw error
        }
      } else {
        console.log('✅ Perfil salvo com sucesso (UPSERT completo):', {
          id: data?.id,
          user_id: data?.user_id,
          nome_completo: data?.nome_completo,
          email: data?.email,
          whatsapp: data?.whatsapp,
          perfil: data?.perfil,
          profession: data?.profession,
          updated_at: data?.updated_at
        })
        result = data
      }
    } catch (upsertError: any) {
      // Se UPSERT falhar por constraint, tentar UPDATE primeiro, depois INSERT
      console.warn('⚠️ UPSERT falhou, tentando UPDATE/INSERT manual...', upsertError)
      
      // Verificar se existe
      const { data: existingProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      if (existingProfile) {
        // Atualizar existente - garantir que whatsapp está incluído
        const updateData = {
          ...profileData,
          email: email || user.email, // Garantir que email está sincronizado
          profession: 'coach', // Garantir que profession está sincronizado
          updated_at: new Date().toISOString()
        }
        // Se whatsapp não está em profileData mas foi fornecido, adicionar
        const whatsappValueUpdate = whatsapp || telefone
        if (whatsappValueUpdate !== undefined && whatsappValueUpdate !== null) {
          const whatsappLimpo = whatsappValueUpdate.toString().replace(/\D/g, '')
          if (whatsappLimpo.length > 0) {
            updateData.whatsapp = whatsappLimpo
            console.log('📱 Adicionando whatsapp no UPDATE manual:', whatsappLimpo)
          } else {
            updateData.whatsapp = null
            console.log('📱 WhatsApp no UPDATE manual fornecido mas vazio, definindo como null')
          }
        }
        
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          console.error('❌ Erro ao atualizar perfil:', error)
          throw error
        }
        result = data
        console.log('✅ Perfil atualizado manualmente:', {
          id: data?.id,
          user_id: data?.user_id,
          nome_completo: data?.nome_completo,
          email: data?.email,
          whatsapp: data?.whatsapp,
          perfil: data?.perfil,
          profession: data?.profession,
          updated_at: data?.updated_at
        })
      } else {
        // Criar novo - garantir que whatsapp está incluído
        const insertData = {
          ...fullProfileData,
          email: email || user.email, // Garantir que email está sincronizado
          profession: 'coach', // Garantir que profession está sincronizado
          updated_at: new Date().toISOString()
        }
        // Se whatsapp não está em fullProfileData mas foi fornecido, adicionar
        const whatsappValueInsert = whatsapp || telefone
        if (whatsappValueInsert !== undefined && whatsappValueInsert !== null) {
          const whatsappLimpo = whatsappValueInsert.toString().replace(/\D/g, '')
          if (whatsappLimpo.length > 0) {
            insertData.whatsapp = whatsappLimpo
            console.log('📱 Adicionando whatsapp no INSERT manual:', whatsappLimpo)
          } else {
            insertData.whatsapp = null
            console.log('📱 WhatsApp no INSERT manual fornecido mas vazio, definindo como null')
          }
        }
        
        const { data, error } = await supabaseAdmin
          .from('user_profiles')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error('❌ Erro ao criar perfil:', error)
          throw error
        }
        result = data
        console.log('✅ Perfil criado manualmente:', {
          id: data?.id,
          user_id: data?.user_id,
          nome_completo: data?.nome_completo,
          email: data?.email,
          whatsapp: data?.whatsapp,
          perfil: data?.perfil,
          profession: data?.profession,
          updated_at: data?.updated_at
        })
      }
    }

    // Atualizar email no auth.users se diferente
    if (email) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email: email,
        user_metadata: {
          full_name: nome
        }
      })
    }

    // Verificar se realmente foi salvo antes de retornar
    if (!result) {
      console.error('❌ ERRO CRÍTICO: Perfil não foi salvo, mas não houve erro!')
      return NextResponse.json(
        { error: 'Erro ao salvar perfil. Tente novamente.' },
        { status: 500 }
      )
    }

    // Se é a primeira vez configurando user_slug, gerar slugs para todos os formulários
    if (isFirstTimeSettingSlug && userSlug) {
      try {
        console.log('🔄 Gerando slugs para todos os formulários do usuário...')
        
        // Buscar todos os formulários do usuário sem slug
        const { data: formsWithoutSlug } = await supabaseAdmin
          .from('custom_forms')
          .select('id, name, slug')
          .eq('user_id', user.id)
          .is('slug', null)
        
        if (formsWithoutSlug && formsWithoutSlug.length > 0) {
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
          
          // Gerar slug para cada formulário
          for (const form of formsWithoutSlug) {
            let candidateSlug = normalizeSlug(form.name)
            
            // Verificar se já existe para este usuário
            const { data: existing } = await supabaseAdmin
              .from('custom_forms')
              .select('id')
              .eq('user_id', user.id)
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
                  .eq('user_id', user.id)
                  .eq('slug', candidate)
                  .maybeSingle()
                
                if (!exists) {
                  candidateSlug = candidate
                  break
                }
              }
            }
            
            // Atualizar formulário com slug
            await supabaseAdmin
              .from('custom_forms')
              .update({ slug: candidateSlug })
              .eq('id', form.id)
            
            console.log(`✅ Slug gerado para formulário ${form.id}: ${candidateSlug}`)
          }
          
          console.log(`✅ ${formsWithoutSlug.length} formulários atualizados com slugs`)
        }
      } catch (error) {
        console.error('⚠️ Erro ao gerar slugs para formulários:', error)
        // Não falhar o salvamento do perfil se houver erro ao gerar slugs
      }
    }

    // Log final de confirmação
    console.log('✅✅✅ PERFIL SALVO COM SUCESSO - CONFIRMAÇÃO FINAL:', {
      user_id: result.user_id,
      email: result.email || 'não fornecido',
      nome_completo: result.nome_completo,
      whatsapp: result.whatsapp,
      updated_at: result.updated_at,
      perfil: result.perfil,
      user_slug: result.user_slug
    })

    return NextResponse.json({
      success: true,
      profile: result
    })
  } catch (error: any) {
    console.error('❌❌❌ ERRO CRÍTICO AO SALVAR PERFIL:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    
    // Se for erro de coluna não encontrada (código PostgreSQL 42703), dar mensagem específica
    if (error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('schema cache')) {
      return NextResponse.json(
        { 
          error: 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.',
          technical: error?.message // Incluir mensagem técnica para debug
        },
        { status: 500 }
      )
    }
    
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { 
        error: mensagemAmigavel,
        technical: error?.message // Incluir mensagem técnica para debug
      },
      { status: 500 }
    )
  }
}

