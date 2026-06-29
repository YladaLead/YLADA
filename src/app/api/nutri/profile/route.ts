import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'
import { generateAvailableUserSlug } from '@/lib/user-slug-generator'
import { findHandleConflict } from '@/lib/ylada-flow/handle-namespace'

// GET - Buscar perfil do usuário
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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
      console.log('🔍 GET /api/nutri/profile - Buscando perfil para user_id:', user.id)
      
      // Tentar buscar todos os campos primeiro (incluindo campos de branding)
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, whatsapp, bio, user_slug, country_code, logo_url, brand_color, brand_name, professional_credential')
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
        userSlug: profile?.user_slug || '',
        // Campos de branding
        logoUrl: profile?.logo_url || '',
        brandColor: profile?.brand_color || '',
        brandName: profile?.brand_name || '',
        professionalCredential: profile?.professional_credential || ''
      }
    }

    // Primeira vez: se não tem user_slug mas tem nome, gerar e salvar automaticamente (padrão = já deixar slug salvo)
    if (!responseData.profile.userSlug?.trim() && responseData.profile.nome?.trim()) {
      try {
        const slugGerado = await generateAvailableUserSlug(responseData.profile.nome.trim())
        if (slugGerado) {
          await supabaseAdmin
            .from('user_profiles')
            .update({ user_slug: slugGerado, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
          responseData.profile.userSlug = slugGerado
          console.log('✅ GET /api/nutri/profile: user_slug gerado e salvo automaticamente:', slugGerado)
        }
      } catch (e) {
        console.warn('⚠️ Falha ao gerar/salvar user_slug automaticamente:', e)
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
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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
      userSlug,
      // Campos de branding
      logoUrl,
      brandColor,
      brandName,
      professionalCredential
    } = body

    // Log dos valores recebidos para debug
    console.log('📥 Valores recebidos do frontend (Nutri):', {
      telefone: telefone ? `${telefone.substring(0, 5)}...` : 'vazio/undefined',
      whatsapp: whatsapp ? `${whatsapp.substring(0, 5)}...` : 'vazio/undefined',
      countryCode: countryCode || 'não fornecido',
      userSlug: userSlug || 'não fornecido',
      hasTelefone: telefone !== undefined && telefone !== null,
      hasWhatsapp: whatsapp !== undefined && whatsapp !== null,
      hasCountryCode: countryCode !== undefined && countryCode !== null,
      hasUserSlug: userSlug !== undefined && userSlug !== null
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

    // Buscar perfil atual para garantir que não está mudando de área
    const { data: currentProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, is_admin, is_support')
      .eq('user_id', user.id)
      .maybeSingle()

    // VALIDAÇÃO: Não permitir mudança de perfil após criado
    // EXCEÇÃO: Admin e Suporte podem ter múltiplos perfis
    if (currentProfile && currentProfile.perfil && currentProfile.perfil !== 'nutri') {
      if (!currentProfile.is_admin && !currentProfile.is_support) {
        return NextResponse.json(
          { 
            error: `Você não pode alterar seu perfil. Este email está cadastrado na área ${currentProfile.perfil}.`,
            technical: process.env.NODE_ENV === 'development' ? {
              currentPerfil: currentProfile.perfil,
              attemptedPerfil: 'nutri',
              is_admin: currentProfile.is_admin,
              is_support: currentProfile.is_support
            } : undefined
          },
          { status: 403 }
        )
      }
    }

    // Atualizar user_profiles (apenas campos que existem)
    const profileData: any = {
      nome_completo: nome,
      email: email || user.email, // Sincronizar email também
      perfil: 'nutri', // Garantir que o perfil está definido
      profession: 'nutri', // Sincronizar profession baseado no perfil
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
    
    // Sempre salvar userSlug se fornecido; senão, na primeira vez (ex.: onboarding) gerar a partir do nome
    if (userSlug !== undefined && userSlug !== null) {
      profileData.user_slug = userSlug || null
      console.log('🔗 User slug que será salvo:', userSlug)
    } else if (nome?.trim()) {
      // Primeira vez: gerar e salvar slug automaticamente para não exigir que a pessoa salve depois
      try {
        const slugGerado = await generateAvailableUserSlug(nome.trim())
        if (slugGerado) {
          profileData.user_slug = slugGerado
          console.log('🔗 User slug gerado automaticamente (primeira vez):', slugGerado)
        }
      } catch (e) {
        console.warn('⚠️ Falha ao gerar user_slug no PUT:', e)
      }
    }
    
    // Sempre salvar countryCode se fornecido (mesmo que seja string vazia, será null)
    if (countryCode !== undefined && countryCode !== null) {
      profileData.country_code = countryCode || null
      console.log('🌍 Country code que será salvo:', countryCode)
    } else {
      console.log('🌍 Country code não fornecido, mantendo valor atual')
    }
    
    // Campos de branding
    if (logoUrl !== undefined) {
      profileData.logo_url = logoUrl || null
      console.log('🎨 Logo URL que será salvo:', logoUrl)
    }
    
    if (brandColor !== undefined) {
      // Validar formato HEX
      if (brandColor && !/^#[0-9A-F]{6}$/i.test(brandColor)) {
        return NextResponse.json(
          { error: 'Cor da marca deve estar no formato HEX (#RRGGBB)' },
          { status: 400 }
        )
      }
      profileData.brand_color = brandColor || null
      console.log('🎨 Cor da marca que será salva:', brandColor)
    }
    
    if (brandName !== undefined) {
      profileData.brand_name = brandName || null
      console.log('🏢 Nome da marca que será salvo:', brandName)
    }
    
    if (professionalCredential !== undefined) {
      profileData.professional_credential = professionalCredential || null
      console.log('📜 Credencial profissional que será salva:', professionalCredential)
    }

    // Preparar dados completos para UPSERT
    const fullProfileData = {
      user_id: user.id,
      ...profileData
    }

    console.log('📝 Salvando perfil (UPSERT - Nutri):', {
      userId: user.id,
      profileData: Object.keys(fullProfileData),
      dadosCompletos: {
        nome_completo: fullProfileData.nome_completo,
        email: fullProfileData.email,
        whatsapp: fullProfileData.whatsapp,
        country_code: fullProfileData.country_code,
        user_slug: fullProfileData.user_slug,
        bio: fullProfileData.bio ? `${fullProfileData.bio.substring(0, 50)}...` : null,
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
            perfil: 'nutri',
            profession: 'nutri', // Sincronizar profession
            updated_at: new Date().toISOString()
          }
          // Garantir que whatsapp seja salvo no salvamento básico também
          const whatsappValue = whatsapp !== undefined ? whatsapp : (telefone !== undefined ? telefone : null)
          if (whatsappValue !== null && whatsappValue !== undefined) {
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
          // Garantir que bio seja salvo no básico também
          if (bio !== undefined) {
            basicData.bio = bio || null
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
          profession: 'nutri', // Garantir que profession está sincronizado
          updated_at: new Date().toISOString()
        }
        // Garantir que whatsapp, countryCode e userSlug sejam salvos no UPDATE manual
        const whatsappValueUpdate = whatsapp !== undefined ? whatsapp : (telefone !== undefined ? telefone : null)
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
        if (countryCode !== undefined && countryCode !== null) {
          updateData.country_code = countryCode || null
        }
        if (userSlug !== undefined && userSlug !== null) {
          updateData.user_slug = userSlug || null
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
          profession: 'nutri', // Garantir que profession está sincronizado
          updated_at: new Date().toISOString()
        }
        // Garantir que whatsapp, countryCode e userSlug sejam salvos no INSERT manual
        const whatsappValueInsert = whatsapp !== undefined ? whatsapp : (telefone !== undefined ? telefone : null)
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
        if (countryCode !== undefined && countryCode !== null) {
          insertData.country_code = countryCode || null
        }
        if (userSlug !== undefined && userSlug !== null) {
          insertData.user_slug = userSlug || null
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

    // Log final de confirmação
    console.log('✅✅✅ PERFIL SALVO COM SUCESSO - CONFIRMAÇÃO FINAL:', {
      user_id: result.user_id,
      email: result.email || 'não fornecido',
      nome_completo: result.nome_completo,
      whatsapp: result.whatsapp,
      updated_at: result.updated_at,
      perfil: result.perfil
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

