import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { gerarLembretes, lembretesGerais, configuracaoLembretes, TipoAcao } from '@/lib/wellness-system/lembretes'

// GET - Buscar lembretes baseados em ações do distribuidor
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult

    // Buscar ações recentes (últimos 7 dias)
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() - 7)

    const { data: acoes, error: acoesError } = await supabaseAdmin
      .from('wellness_acoes')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', dataLimite.toISOString())
      .order('created_at', { ascending: false })

    if (acoesError) {
      console.error('Erro ao buscar ações:', acoesError)
      return NextResponse.json(
        { error: 'Erro ao buscar ações' },
        { status: 500 }
      )
    }

    // Verificar se o usuário tem perfil configurado
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug, whatsapp')
      .eq('user_id', user.id)
      .single()

    const lembretes: any[] = []

    // Gerar lembretes baseados em ações
    if (acoes && acoes.length > 0) {
      const acoesFormatadas = acoes.map(acao => ({
        tipo: acao.acao_tipo as TipoAcao,
        descricao: acao.acao_descricao,
        metadata: acao.acao_metadata,
        pagina: acao.pagina,
        rota: acao.rota
      }))

      const lembretesAcoes = gerarLembretes(acoesFormatadas)
      lembretes.push(...lembretesAcoes)
    }

    // Adicionar lembretes gerais se não houver muitas ações
    if (!acoes || acoes.length === 0) {
      lembretes.push(...lembretesGerais)
    }

    // Verificar se precisa configurar perfil
    if (!profile?.user_slug || !profile?.whatsapp) {
      lembretes.push({
        id: 'configurar-perfil-urgente',
        titulo: '⚙️ Configure seu perfil',
        mensagem: 'Configure seu perfil completo (slug e WhatsApp) para gerar links personalizados.',
        tipo: 'warning',
        acao: {
          texto: 'Configurar',
          rota: '/pt/wellness/configuracao'
        },
        prioridade: 'alta'
      })
    }

    // Verificar se nunca gerou link
    const gerouLink = acoes?.some(acao => acao.acao_tipo === 'gerou_link')
    if (!gerouLink) {
      lembretes.push({
        id: 'primeiro-link-urgente',
        titulo: '🚀 Gere seu primeiro link',
        mensagem: 'Comece agora! Gere seu primeiro link personalizado e compartilhe com seus contatos.',
        tipo: 'action',
        acao: {
          texto: 'Gerar Link',
          rota: '/pt/wellness/system/ferramentas/gerador-link'
        },
        prioridade: 'alta'
      })
    }

    // Remover duplicatas e ordenar por prioridade
    const lembretesUnicos = Array.from(
      new Map(lembretes.map(l => [l.id, l])).values()
    )

    const ordemPrioridade = { alta: 3, media: 2, baixa: 1 }
    lembretesUnicos.sort((a, b) => 
      ordemPrioridade[b.prioridade] - ordemPrioridade[a.prioridade]
    )

    return NextResponse.json({
      success: true,
      data: { lembretes: lembretesUnicos }
    })

  } catch (error: any) {
    console.error('Erro ao buscar lembretes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

