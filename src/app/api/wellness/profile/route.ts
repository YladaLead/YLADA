import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// GET - Buscar perfil do usuário
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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
      // Tentar buscar todos os campos primeiro
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, whatsapp, bio, user_slug, country_code')
        .eq('user_id', user.id)
        .single()

      if (!profileError) {
        profile = profileData
      } else if (profileError.code === 'PGRST116') {
        // Não encontrado - tudo bem, será criado
        profile = null
      } else if (profileError.message?.includes('column') || profileError.message?.includes('schema cache')) {
        // Campos não existem - tentar buscar apenas campos básicos
        console.warn('Alguns campos não existem, buscando apenas campos básicos')
        try {
          const { data: basicProfile } = await supabaseAdmin
            .from('user_profiles')
            .select('nome_completo, email')
            .eq('user_id', user.id)
            .maybeSingle()
          profile = basicProfile || null
        } catch (e) {
          console.warn('Erro ao buscar perfil básico:', e)
          profile = null
        }
      } else {
        // Outro erro - logar mas continuar
        console.warn('Erro ao buscar perfil completo:', profileError)
        profile = null
      }
    } catch (err: any) {
      // Se deu erro geral, tentar buscar apenas campos básicos
      console.warn('Erro ao buscar perfil:', err)
      try {
        const { data: basicProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo, email')
          .eq('user_id', user.id)
          .maybeSingle()
        profile = basicProfile || null
      } catch (e) {
        console.warn('Erro ao buscar perfil básico:', e)
        profile = null
      }
    }

    // Buscar email do auth.users
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)

    return NextResponse.json({
      success: true,
      profile: {
        nome: profile?.nome_completo || authUser?.user?.user_metadata?.full_name || '',
        email: authUser?.user?.email || profile?.email || '',
        telefone: profile?.whatsapp || '', // telefone é mapeado de whatsapp
        whatsapp: profile?.whatsapp || '',
        countryCode: profile?.country_code || 'BR',
        bio: profile?.bio || '',
        userSlug: profile?.user_slug || ''
      }
    })
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
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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
      userSlug
    } = body

    // Verificar se user_slug já existe para outro usuário
    if (userSlug) {
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
    }

    // Atualizar user_profiles (apenas campos que existem)
    const profileData: any = {
      nome_completo: nome,
      perfil: 'wellness' // Garantir que o perfil está definido
    }

    // Adicionar campos opcionais apenas se fornecidos
    // Usar whatsapp (ou telefone como fallback) - apenas whatsapp existe no banco
    if (whatsapp || telefone) {
      profileData.whatsapp = whatsapp || telefone
    }
    
    // Adicionar campos que podem não existir ainda (o Supabase vai ignorar se não existirem)
    if (bio !== undefined) {
      profileData.bio = bio || null
    }
    
    if (userSlug !== undefined) {
      profileData.user_slug = userSlug || null
    }
    
    if (countryCode) {
      profileData.country_code = countryCode
    }

    // Verificar se perfil existe
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    console.log('📝 Salvando perfil:', {
      userId: user.id,
      existingProfile: !!existingProfile,
      profileData: Object.keys(profileData)
    })

    let result
    if (existingProfile) {
      // Atualizar existente - tentar atualizar todos os campos
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar perfil completo:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })

        // Se der erro de coluna não encontrada ou schema cache, tentar atualizar apenas campos básicos
        if (error.message?.includes('column') || error.message?.includes('schema cache') || error.code === '42703') {
          console.log('⚠️ Tentando salvar apenas campos básicos...')
          const basicData: any = {
            nome_completo: nome,
            perfil: 'wellness' // Garantir que o perfil está definido
          }
          if (whatsapp || telefone) {
            basicData.whatsapp = whatsapp || telefone
          }
          
          const { data: basicResult, error: basicError } = await supabaseAdmin
            .from('user_profiles')
            .update(basicData)
            .eq('user_id', user.id)
            .select()
            .single()
          
          if (basicError) {
            console.error('❌ Erro ao atualizar perfil básico:', basicError)
            throw basicError
          }
          console.log('✅ Perfil básico atualizado com sucesso')
          result = basicResult
        } else {
          throw error
        }
      } else {
        console.log('✅ Perfil atualizado com sucesso')
        result = data
      }
    } else {
      // Criar novo - tentar inserir todos os campos
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao criar perfil completo:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })

        // Se der erro de coluna não encontrada ou schema cache, tentar inserir apenas campos básicos
        if (error.message?.includes('column') || error.message?.includes('schema cache') || error.code === '42703') {
          console.log('⚠️ Tentando criar apenas com campos básicos...')
          const basicData: any = {
            user_id: user.id,
            nome_completo: nome,
            perfil: 'wellness' // Garantir que o perfil está definido
          }
          if (whatsapp || telefone) {
            basicData.whatsapp = whatsapp || telefone
          }
          
          const { data: basicResult, error: basicError } = await supabaseAdmin
            .from('user_profiles')
            .insert(basicData)
            .select()
            .single()
          
          if (basicError) {
            console.error('❌ Erro ao criar perfil básico:', basicError)
            throw basicError
          }
          console.log('✅ Perfil básico criado com sucesso')
          result = basicResult
        } else {
          throw error
        }
      } else {
        console.log('✅ Perfil criado com sucesso')
        result = data
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

    return NextResponse.json({
      success: true,
      profile: result
    })
  } catch (error: any) {
    console.error('❌ Erro técnico ao salvar perfil:', {
      error,
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint
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

