import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// POST - Salvar resultado de diagnóstico
export async function POST(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const {
      fluxo_id,
      fluxo_tipo = 'cliente',
      fluxo_nome,
      respostas,
      perfil_identificado,
      kit_recomendado,
      score,
      nome_lead,
      email_lead,
      telefone_lead,
      whatsapp_lead,
      conversao = false
    } = body

    // Validações
    if (!fluxo_id || !fluxo_nome || !respostas) {
      return NextResponse.json(
        { error: 'fluxo_id, fluxo_nome e respostas são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar IP e User Agent
    const ip_address = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                       request.headers.get('x-real-ip') || 
                       null
    const user_agent = request.headers.get('user-agent') || null

    // Inserir diagnóstico
    const { data: diagnostico, error } = await supabaseAdmin
      .from('wellness_diagnosticos')
      .insert({
        user_id: user.id,
        fluxo_id,
        fluxo_tipo,
        fluxo_nome,
        respostas,
        perfil_identificado: perfil_identificado || null,
        kit_recomendado: kit_recomendado || null,
        score: score || null,
        nome_lead: nome_lead || null,
        email_lead: email_lead || null,
        telefone_lead: telefone_lead || null,
        whatsapp_lead: whatsapp_lead || null,
        ip_address: ip_address || null,
        user_agent: user_agent || null,
        conversao: conversao || false,
        conversao_at: conversao ? new Date().toISOString() : null
      })
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Erro ao salvar diagnóstico:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      diagnostico: {
        id: diagnostico.id,
        created_at: diagnostico.created_at
      }
    })
  } catch (error: any) {
    console.error('Erro técnico ao salvar diagnóstico:', error)
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// GET - Listar diagnósticos do usuário
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const fluxo_id = searchParams.get('fluxo_id')
    const fluxo_tipo = searchParams.get('fluxo_tipo')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('wellness_diagnosticos')
      .select('id, fluxo_id, fluxo_tipo, fluxo_nome, perfil_identificado, kit_recomendado, score, conversao, conversao_at, created_at', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (fluxo_id) {
      query = query.eq('fluxo_id', fluxo_id)
    }

    if (fluxo_tipo) {
      query = query.eq('fluxo_tipo', fluxo_tipo)
    }

    const { data: diagnosticos, error, count } = await query

    if (error) {
      console.error('Erro ao buscar diagnósticos:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      diagnosticos: diagnosticos || [],
      total: count || 0,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('Erro técnico ao buscar diagnósticos:', error)
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// PUT - Atualizar conversão de diagnóstico
export async function PUT(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { diagnostico_id, conversao } = body

    if (!diagnostico_id) {
      return NextResponse.json(
        { error: 'diagnostico_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o diagnóstico pertence ao usuário
    const { data: diagnosticoExistente, error: checkError } = await supabaseAdmin
      .from('wellness_diagnosticos')
      .select('id, user_id')
      .eq('id', diagnostico_id)
      .eq('user_id', user.id)
      .single()

    if (checkError || !diagnosticoExistente) {
      return NextResponse.json(
        { error: 'Diagnóstico não encontrado ou você não tem permissão' },
        { status: 404 }
      )
    }

    // Atualizar conversão
    const { data: diagnostico, error } = await supabaseAdmin
      .from('wellness_diagnosticos')
      .update({
        conversao: conversao !== undefined ? conversao : true,
        conversao_at: conversao !== false ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', diagnostico_id)
      .eq('user_id', user.id)
      .select('id, conversao, conversao_at')
      .single()

    if (error) {
      console.error('Erro ao atualizar conversão:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      diagnostico
    })
  } catch (error: any) {
    console.error('Erro técnico ao atualizar conversão:', error)
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

