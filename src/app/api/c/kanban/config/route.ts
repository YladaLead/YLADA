import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/c/kanban/config
 * Busca configuração do Kanban do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const { data: config, error } = await supabaseAdmin
      .from('kanban_config')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'coach')
      .maybeSingle()

    // PGRST116 = nenhuma linha encontrada (não é erro)
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar kanban_config:', error)
      throw error
    }

    // Se não existe, retornar padrão (cores roxas para Coach)
    if (!config) {
      const defaultConfig = {
        columns: [
          { id: 'lead', value: 'lead', label: 'Contato', description: 'Entrou agora, precisa de acolhimento', color: 'border-purple-300 bg-purple-50', order: 1 },
          { id: 'pre_consulta', value: 'pre_consulta', label: 'Pré-Consulta', description: 'Já falou com você, falta agendar', color: 'border-yellow-300 bg-yellow-50', order: 2 },
          { id: 'ativa', value: 'ativa', label: 'Ativa', description: 'Em atendimento e com plano ativo', color: 'border-green-300 bg-green-50', order: 3 },
          { id: 'pausa', value: 'pausa', label: 'Pausa', description: 'Deu um tempo, precisa nutrir relação', color: 'border-orange-300 bg-orange-50', order: 4 },
          { id: 'finalizada', value: 'finalizada', label: 'Finalizada', description: 'Concluiu o ciclo com você', color: 'border-gray-300 bg-gray-50', order: 5 }
        ],
        card_fields: [
          { field: 'telefone', visible: true },
          { field: 'email', visible: false },
          { field: 'objetivo', visible: true },
          { field: 'proxima_consulta', visible: true },
          { field: 'ultima_consulta', visible: true },
          { field: 'tags', visible: false },
          { field: 'status_badge', visible: true },
          { field: 'data_cadastro', visible: false }
        ],
        quick_actions: [
          { action: 'whatsapp', visible: true },
          { action: 'ver_perfil', visible: true }
        ]
      }

      return NextResponse.json({
        success: true,
        data: {
          config: defaultConfig
        }
      })
    }

    // Garantir que a estrutura está correta
    const configData = {
      columns: config.columns || [],
      card_fields: config.card_fields || [],
      quick_actions: config.quick_actions || []
    }

    return NextResponse.json({
      success: true,
      data: { config: configData }
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
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!user || !user.id) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { columns, card_fields, quick_actions } = body

    if (!columns || !Array.isArray(columns)) {
      return NextResponse.json(
        { error: 'columns é obrigatório e deve ser um array' },
        { status: 400 }
      )
    }

    // Validar e sanitizar dados antes de salvar
    const configToSave = {
      user_id: user.id,
      area: 'coach',
      columns: Array.isArray(columns) ? columns.map((col: any, index: number) => ({
        id: col.id || `custom-${Date.now()}-${index}`,
        value: col.value || col.id || `custom_${Date.now()}_${index}`,
        label: (col.label || 'Nova Coluna').trim(),
        description: (col.description || '').trim(),
        color: col.color || 'border-purple-300 bg-purple-50',
        order: typeof col.order === 'number' ? col.order : index + 1
      })) : [],
      card_fields: Array.isArray(card_fields) ? card_fields : [],
      quick_actions: Array.isArray(quick_actions) ? quick_actions : [],
      updated_at: new Date().toISOString()
    }

    console.log('💾 Salvando config do Kanban:', {
      userId: user.id,
      area: 'coach',
      columnsCount: configToSave.columns.length
    })

    // Verificar se já existe configuração
    const { data: existingConfig } = await supabaseAdmin
      .from('kanban_config')
      .select('id')
      .eq('user_id', user.id)
      .eq('area', 'coach')
      .maybeSingle()

    let data, error

    if (existingConfig) {
      // Atualizar configuração existente
      const { data: updated, error: updateError } = await supabaseAdmin
        .from('kanban_config')
        .update({
          columns: configToSave.columns,
          card_fields: configToSave.card_fields,
          quick_actions: configToSave.quick_actions,
          updated_at: configToSave.updated_at
        })
        .eq('user_id', user.id)
        .eq('area', 'coach')
        .select()
        .single()
      
      data = updated
      error = updateError
    } else {
      // Criar nova configuração
      const { data: created, error: createError } = await supabaseAdmin
        .from('kanban_config')
        .insert(configToSave)
        .select()
        .single()
      
      data = created
      error = createError
    }

    if (error) {
      console.error('❌ Erro ao salvar kanban_config:', {
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        existingConfig: !!existingConfig
      })
      return NextResponse.json(
        { 
          error: 'Erro ao salvar configuração', 
          details: error.message,
          technical: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      )
    }

    // Retornar estrutura consistente
    const responseData = {
      columns: data.columns || [],
      card_fields: data.card_fields || [],
      quick_actions: data.quick_actions || []
    }

    console.log('✅ Config do Kanban salva com sucesso')

    return NextResponse.json({
      success: true,
      data: { config: responseData }
    })
  } catch (error: any) {
    console.error('❌ Erro ao salvar config do Kanban:', error)
    console.error('Stack trace:', error.stack)
    return NextResponse.json(
      { 
        error: 'Erro ao salvar configuração', 
        details: error.message,
        technical: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}












