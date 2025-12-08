import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/links/[codigo]
 * Busca um Link Wellness específico pelo código
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { codigo: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { codigo } = params

    const { data, error } = await supabaseAdmin
      .from('wellness_links')
      .select('*')
      .eq('codigo', codigo)
      .eq('ativo', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Link wellness não encontrado' },
          { status: 404 }
        )
      }
      console.error('[Wellness Links] Erro ao buscar link:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar link wellness' },
        { status: 500 }
      )
    }

    return NextResponse.json({ link: data })
  } catch (error) {
    console.error('[Wellness Links] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
