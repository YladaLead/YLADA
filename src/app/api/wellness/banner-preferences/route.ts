import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/banner-preferences
 * 
 * Busca as preferências de banners do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar ou criar settings do usuário
    let { data: settings, error: fetchError } = await supabaseAdmin
      .from('noel_user_settings')
      .select('preferences')
      .eq('user_id', user.id)
      .maybeSingle()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Erro ao buscar preferências:', fetchError)
      return NextResponse.json(
        { error: 'Erro ao buscar preferências' },
        { status: 500 }
      )
    }

    // Se não existir, criar registro vazio
    if (!settings) {
      const { data: newSettings, error: createError } = await supabaseAdmin
        .from('noel_user_settings')
        .insert({
          user_id: user.id,
          preferences: {}
        })
        .select('preferences')
        .single()

      if (createError) {
        console.error('Erro ao criar preferências:', createError)
        return NextResponse.json(
          { error: 'Erro ao criar preferências' },
          { status: 500 }
        )
      }

      settings = newSettings
    }

    const preferences = settings.preferences || {}
    
    return NextResponse.json({
      success: true,
      preferences: {
        dismissedProfileBanner: preferences.dismissedProfileBanner || false,
        dismissedPWABanner: preferences.dismissedPWABanner || false,
        dismissedNotificationsBanner: preferences.dismissedNotificationsBanner || false,
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar preferências de banners:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/wellness/banner-preferences
 * 
 * Salva as preferências de banners do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { 
      dismissedProfileBanner,
      dismissedPWABanner,
      dismissedNotificationsBanner 
    } = body

    // Buscar settings existente
    const { data: existingSettings } = await supabaseAdmin
      .from('noel_user_settings')
      .select('preferences')
      .eq('user_id', user.id)
      .maybeSingle()

    const currentPreferences = existingSettings?.preferences || {}

    // Atualizar preferências
    const updatedPreferences = {
      ...currentPreferences,
      ...(dismissedProfileBanner !== undefined && { dismissedProfileBanner }),
      ...(dismissedPWABanner !== undefined && { dismissedPWABanner }),
      ...(dismissedNotificationsBanner !== undefined && { dismissedNotificationsBanner }),
    }

    // Upsert (criar ou atualizar)
    const { data, error } = await supabaseAdmin
      .from('noel_user_settings')
      .upsert({
        user_id: user.id,
        preferences: updatedPreferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select('preferences')
      .single()

    if (error) {
      console.error('Erro ao salvar preferências:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar preferências' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      preferences: data.preferences
    })
  } catch (error: any) {
    console.error('Erro ao salvar preferências de banners:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
















