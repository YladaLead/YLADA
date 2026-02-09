import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/receitas/vendedores
 * Retorna lista de ref_vendedor distintos (para dropdown na página de Receitas).
 * Apenas admin pode acessar.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('ref_vendedor')
      .not('ref_vendedor', 'is', null)

    if (error) {
      console.error('Erro ao buscar vendedores:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar lista de vendedores', details: error.message },
        { status: 500 }
      )
    }

    const refs = (data || [])
      .map((row: { ref_vendedor: string | null }) => row.ref_vendedor?.trim())
      .filter((ref): ref is string => !!ref)
    const distinct = [...new Set(refs)].sort((a, b) => a.localeCompare(b, 'pt-BR'))

    return NextResponse.json({ vendedores: distinct })
  } catch (err: any) {
    console.error('Erro em GET /api/admin/receitas/vendedores:', err)
    return NextResponse.json(
      { error: err.message || 'Erro interno' },
      { status: 500 }
    )
  }
}
