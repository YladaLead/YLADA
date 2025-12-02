import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const fileId = params.id
    const { is_favorited } = await request.json()

    if (is_favorited) {
      // Adicionar favorito
      const { error } = await supabaseAdmin
        .from('library_favorites')
        .upsert({
          user_id: user.id,
          library_file_id: fileId
        }, {
          onConflict: 'user_id,library_file_id'
        })

      if (error) {
        console.error('Erro ao favoritar:', error)
        return NextResponse.json({ error: 'Erro ao favoritar' }, { status: 500 })
      }
    } else {
      // Remover favorito
      const { error } = await supabaseAdmin
        .from('library_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('library_file_id', fileId)

      if (error) {
        console.error('Erro ao desfavoritar:', error)
        return NextResponse.json({ error: 'Erro ao desfavoritar' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: is_favorited ? 'Adicionado aos favoritos' : 'Removido dos favoritos'
    })
  } catch (error: any) {
    console.error('Erro na API de favoritar:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

