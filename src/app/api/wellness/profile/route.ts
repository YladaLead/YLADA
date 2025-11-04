import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

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
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, telefone, whatsapp, bio, user_slug, country_code')
        .eq('user_id', user.id)
        .single()

      if (!profileError) {
        profile = profileData
      } else if (profileError.code !== 'PGRST116') {
        // Se não é erro de "não encontrado", logar mas continuar
        console.warn('Erro ao buscar perfil completo:', profileError)
      }
    } catch (err: any) {
      // Se campos não existem, tentar buscar apenas campos básicos
      try {
        const { data: basicProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('nome_completo, email')
          .eq('user_id', user.id)
          .single()
        profile = basicProfile
      } catch (e) {
        console.warn('Erro ao buscar perfil básico:', e)
      }
    }

    // Buscar email do auth.users
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(user.id)

    return NextResponse.json({
      success: true,
      profile: {
        nome: profile?.nome_completo || authUser?.user?.user_metadata?.full_name || '',
        email: authUser?.user?.email || profile?.email || '',
        telefone: profile?.telefone || '',
        whatsapp: profile?.whatsapp || profile?.telefone || '',
        countryCode: profile?.country_code || 'BR',
        bio: profile?.bio || '',
        userSlug: profile?.user_slug || ''
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar perfil' },
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
      telefone,
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
          { error: 'Este slug já está em uso por outro usuário' },
          { status: 409 }
        )
      }
    }

    // Atualizar user_profiles (apenas campos que existem)
    const profileData: any = {
      nome_completo: nome
    }

    // Adicionar campos opcionais apenas se fornecidos e se as colunas existirem
    if (telefone || whatsapp) {
      profileData.telefone = telefone || whatsapp
      profileData.whatsapp = whatsapp || telefone
    }
    
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
      .single()

    let result
    if (existingProfile) {
      // Atualizar existente
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Criar novo
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: user.id,
          ...profileData
        })
        .select()
        .single()

      if (error) throw error
      result = data
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
    console.error('Erro ao salvar perfil:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao salvar perfil' },
      { status: 500 }
    )
  }
}

