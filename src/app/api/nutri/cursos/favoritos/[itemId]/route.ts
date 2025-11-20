import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemType = searchParams.get('item_type')

    if (!itemType) {
      return NextResponse.json(
        { error: 'Parâmetro item_type é obrigatório' },
        { status: 400 }
      )
    }

    const supabase = supabaseAdmin

    const { error } = await supabase
      .from('cursos_favoritos')
      .delete()
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .eq('item_id', params.itemId)

    if (error) {
      console.error('Erro ao remover favorito:', error)
      return NextResponse.json({ error: 'Erro ao remover favorito' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Favorito removido com sucesso'
    })

  } catch (error: any) {
    console.error('Erro na API de favoritos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

