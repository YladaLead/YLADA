/**
 * POST /api/wellness/notificacoes/create
 * 
 * Cria notificações inteligentes
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { TipoNotificacao } from '@/types/wellness-noel'

interface CreateNotificacaoRequest {
  consultor_id: string
  tipo: TipoNotificacao
  titulo: string
  mensagem: string
  acao_url?: string
  acao_texto?: string
}

export async function POST(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body: CreateNotificacaoRequest = await request.json()
    const { consultor_id, ...dadosNotificacao } = body

    // Verificar se consultor pertence ao usuário (ou se é admin)
    const { data: consultor } = await supabaseAdmin
      .from('ylada_wellness_consultores')
      .select('id, user_id')
      .eq('id', consultor_id)
      .single()

    if (!consultor) {
      return NextResponse.json(
        { error: 'Consultor não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão (próprio consultor ou admin)
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin, is_support')
      .eq('user_id', user.id)
      .single()

    const isAdmin = profile?.is_admin || profile?.is_support
    const isOwnConsultor = consultor.user_id === user.id

    if (!isAdmin && !isOwnConsultor) {
      return NextResponse.json(
        { error: 'Sem permissão para criar notificação' },
        { status: 403 }
      )
    }

    // Criar notificação
    const { data: notificacao, error: notifError } = await supabaseAdmin
      .from('ylada_wellness_notificacoes')
      .insert({
        consultor_id: consultor_id,
        ...dadosNotificacao,
        data_envio: new Date().toISOString(),
      })
      .select()
      .single()

    if (notifError || !notificacao) {
      console.error('❌ Erro ao criar notificação:', notifError)
      return NextResponse.json(
        { error: 'Erro ao criar notificação', details: notifError?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      notificacao,
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar notificação:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

