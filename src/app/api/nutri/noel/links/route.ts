/**
 * GET /api/nutri/noel/links
 *
 * Retorna os links ativos do usuário (ferramentas + quizzes) e o link principal,
 * mesma fonte de verdade que o Noel usa. Páginas podem exibir "Seu link" sem passar pelo chat.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getNoelNutriLinks } from '@/lib/noel-nutri/build-context'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const userMessage = searchParams.get('message') ?? undefined

    const { links, linkPrincipal } = await getNoelNutriLinks(user.id, userMessage)

    return NextResponse.json({
      links,
      linkPrincipal
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Erro ao buscar links.'
    console.error('[Noel Nutri Links] Erro:', message)
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
