import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST - Registrar uma ação do distribuidor
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { tipo, descricao, metadata, pagina, rota } = body

    if (!tipo || !descricao) {
      return NextResponse.json(
        { error: 'Tipo e descrição são obrigatórios' },
        { status: 400 }
      )
    }

    // Inserir ação no banco
    const { data: acao, error } = await supabaseAdmin
      .from('wellness_acoes')
      .insert({
        user_id: user.id,
        acao_tipo: tipo,
        acao_descricao: descricao,
        acao_metadata: metadata || null,
        pagina: pagina || null,
        rota: rota || null
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao registrar ação:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar ação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { acao }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao registrar ação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// GET - Buscar ações recentes e gerar lembretes
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limite = parseInt(searchParams.get('limite') || '50')
    const dias = parseInt(searchParams.get('dias') || '7')

    // Buscar ações recentes (últimos N dias)
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - dias)

    const { data: acoes, error } = await supabaseAdmin
      .from('wellness_acoes')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', dataLimite.toISOString())
      .order('created_at', { ascending: false })
      .limit(limite)

    if (error) {
      console.error('Erro ao buscar ações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar ações' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { acoes: acoes || [] }
    })

  } catch (error: any) {
    console.error('Erro ao buscar ações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

