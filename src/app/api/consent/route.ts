import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/consent
 * Registrar consentimento do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consentType, version = '1.0', granted = true } = body

    if (!consentType) {
      return NextResponse.json(
        { error: 'Tipo de consentimento é obrigatório' },
        { status: 400 }
      )
    }

    // Tentar autenticar (opcional - pode ser anônimo)
    let userId: string | null = null
    try {
      const authResult = await requireApiAuth(request, [])
      if (!(authResult instanceof NextResponse)) {
        userId = authResult.user.id
      }
    } catch (e) {
      // Usuário não autenticado - consentimento anônimo permitido
    }

    // Obter IP e User Agent
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     null
    const userAgent = request.headers.get('user-agent') || null

    // Se já existe consentimento deste tipo para este usuário, atualizar
    if (userId) {
      const { data: existing } = await supabaseAdmin
        .from('user_consents')
        .select('id')
        .eq('user_id', userId)
        .eq('consent_type', consentType)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (existing) {
        // Atualizar consentimento existente
        const { error } = await supabaseAdmin
          .from('user_consents')
          .update({
            granted,
            version,
            granted_at: granted ? new Date().toISOString() : null,
            revoked_at: granted ? null : new Date().toISOString(),
            ip_address: ipAddress,
            user_agent: userAgent,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)

        if (error) {
          console.error('Erro ao atualizar consentimento:', error)
          return NextResponse.json(
            { error: 'Erro ao atualizar consentimento' },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Consentimento atualizado',
          updated: true 
        })
      }
    }

    // Criar novo consentimento
    const { data, error } = await supabaseAdmin
      .from('user_consents')
      .insert({
        user_id: userId,
        consent_type: consentType,
        version,
        granted,
        granted_at: granted ? new Date().toISOString() : null,
        revoked_at: granted ? null : new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar consentimento:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar consentimento' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Consentimento registrado',
      data 
    })
  } catch (error: any) {
    console.error('Erro na API de consentimento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar consentimento' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/consent
 * Obter consentimentos do usuário autenticado
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('user_consents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar consentimentos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar consentimentos' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Erro na API de consentimento:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}
































