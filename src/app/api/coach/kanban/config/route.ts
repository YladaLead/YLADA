import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/c/kanban/config
 * Busca configuração do Kanban do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['coach', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: config, error } = await supabaseAdmin
      .from('kanban_config')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'coach')
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // Se não existe, retornar padrão (cores roxas para Coach)
    if (!config) {
      return NextResponse.json({
        success: true,
        data: {
          config: {
            columns: [
              { id: 'lead', value: 'lead', label: 'Contato', description: 'Entrou agora, precisa de acolhimento', color: 'border-purple-200 bg-purple-50', order: 1 },
              { id: 'pre_consulta', value: 'pre_consulta', label: 'Pré-Consulta', description: 'Já falou com você, falta agendar', color: 'border-yellow-200 bg-yellow-50', order: 2 },
              { id: 'ativa', value: 'ativa', label: 'Ativa', description: 'Em atendimento e com plano ativo', color: 'border-green-200 bg-green-50', order: 3 },
              { id: 'pausa', value: 'pausa', label: 'Pausa', description: 'Deu um tempo, precisa nutrir relação', color: 'border-orange-200 bg-orange-50', order: 4 },
              { id: 'finalizada', value: 'finalizada', label: 'Finalizada', description: 'Concluiu o ciclo com você', color: 'border-gray-200 bg-gray-50', order: 5 }
            ],
            card_fields: [
              { field: 'telefone', visible: true },
              { field: 'email', visible: false },
              { field: 'objetivo', visible: true },
              { field: 'proxima_consulta', visible: true },
              { field: 'ultima_consulta', visible: true },
              { field: 'tags', visible: false },
              { field: 'status_badge', visible: true }
            ],
            quick_actions: [
              { action: 'whatsapp', visible: true },
              { action: 'ver_perfil', visible: true }
            ]
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: { config }
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar config do Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar configuração', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/c/kanban/config
 * Salva configuração do Kanban do usuário
 */
export async function PUT(request: NextRequest) {
  try {
    const user = await requireApiAuth(request, ['coach', 'admin'])
    if (!user || user instanceof NextResponse) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { columns, card_fields, quick_actions } = body

    if (!columns || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: 'columns é obrigatório e deve ser um array' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('kanban_config')
      .upsert(
        {
          user_id: user.id,
          area: 'coach',
          columns: columns || [],
          card_fields: card_fields || [],
          quick_actions: quick_actions || [],
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id,area'
        }
      )
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: { config: data }
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar config do Kanban:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar configuração', details: error.message },
      { status: 500 }
    )
  }
}

