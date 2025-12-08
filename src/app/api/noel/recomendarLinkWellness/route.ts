import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { recommendLink, type RecomendacaoContext } from '@/lib/noel-wellness/links-recommender'

/**
 * POST /api/noel/recomendarLinkWellness
 * NOEL Function: Recomenda um Link Wellness baseado em contexto
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { tipo_lead, necessidade, palavras_chave, objetivo } = body

    const contexto: RecomendacaoContext = {
      tipoLead: tipo_lead || undefined,
      necessidadeIdentificada: necessidade || undefined,
      palavrasChave: palavras_chave ? palavras_chave.split(',').map((k: string) => k.trim()) : undefined,
      objetivo: objetivo || undefined,
    }

    const link = await recommendLink(contexto)

    if (!link) {
      return NextResponse.json({
        success: false,
        message: 'Nenhum link encontrado para o contexto fornecido',
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        codigo: link.codigo,
        nome: link.nome,
        categoria: link.categoria,
        objetivo: link.objetivo,
        script_curto: link.script_curto,
        quando_usar: link.quando_usar,
        publico_alvo: link.publico_alvo,
      },
    })
  } catch (error) {
    console.error('[NOEL] Erro ao recomendar Link Wellness:', error)
    return NextResponse.json(
      { error: 'Erro ao recomendar link wellness' },
      { status: 500 }
    )
  }
}

