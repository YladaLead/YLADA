import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Registrar ação na página HOM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_slug, acao, timestamp } = body

    if (!user_slug || !acao) {
      return NextResponse.json(
        { error: 'user_slug e acao são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar user_id pelo user_slug
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('user_slug', user_slug)
      .maybeSingle()

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    // Inserir registro de ação (pode criar uma tabela específica ou usar logs)
    // Por enquanto, vamos apenas logar (você pode criar uma tabela depois)
    console.log('📊 Ação HOM registrada:', {
      user_slug,
      user_id: profile.user_id,
      acao,
      timestamp: timestamp || new Date().toISOString()
    })

    // TODO: Criar tabela wellness_hom_actions para armazenar essas ações
    // Por enquanto, apenas retornar sucesso

    return NextResponse.json({ 
      success: true,
      message: 'Ação registrada com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao registrar ação HOM:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao registrar ação' },
      { status: 500 }
    )
  }
}
