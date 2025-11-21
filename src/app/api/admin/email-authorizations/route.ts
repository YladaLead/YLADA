import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar autorizações por email
 * Query params:
 * - area: filtrar por área
 * - status: filtrar por status (pending, activated, expired, cancelled)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
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
    const area = searchParams.get('area')
    const status = searchParams.get('status')

    let query = supabaseAdmin
      .from('email_authorizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (area) {
      query = query.eq('area', area)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erro ao buscar autorizações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar autorizações', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })
  } catch (error: any) {
    console.error('Erro na API de autorizações:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar autorizações' },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar nova autorização por email
 * Body:
 * - email: string (obrigatório)
 * - area: string (obrigatório) - 'wellness', 'nutri', 'coach', 'nutra'
 * - expires_in_days: number (opcional, padrão: 365)
 * - notes: string (opcional)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
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
    const { email, area, expires_in_days = 365, notes } = body

    // Validações
    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    if (!area || !['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    if (expires_in_days && (expires_in_days < 1 || expires_in_days > 3650)) {
      return NextResponse.json(
        { error: 'expires_in_days deve estar entre 1 e 3650 (10 anos)' },
        { status: 400 }
      )
    }

    // Normalizar email (lowercase)
    const normalizedEmail = email.trim().toLowerCase()

    // Verificar se já existe autorização pendente para este email e área
    const { data: existing } = await supabaseAdmin
      .from('email_authorizations')
      .select('id, status')
      .eq('email', normalizedEmail)
      .eq('area', area)
      .eq('status', 'pending')
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Já existe uma autorização pendente para este email e área' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe e já tem assinatura ativa
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = users.users.find(u => u.email?.toLowerCase() === normalizedEmail)

    if (existingUser) {
      // Verificar se já tem assinatura ativa
      const { data: activeSubscription } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', existingUser.id)
        .eq('area', area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle()

      if (activeSubscription) {
        return NextResponse.json(
          { error: 'Este usuário já tem assinatura ativa para esta área' },
          { status: 400 }
        )
      }
    }

    // Criar autorização
    const { data, error } = await supabaseAdmin
      .from('email_authorizations')
      .insert({
        email: normalizedEmail,
        area,
        expires_in_days,
        notes: notes || null,
        created_by: user.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar autorização:', error)
      return NextResponse.json(
        { error: 'Erro ao criar autorização', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Autorização criada para ${normalizedEmail}. A assinatura será ativada automaticamente quando o usuário se cadastrar.`
    })
  } catch (error: any) {
    console.error('Erro na API de autorizações:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar autorização' },
      { status: 500 }
    )
  }
}

