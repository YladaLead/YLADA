import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import { createServerSupabaseClient } from '@/lib/supabase-server'

/**
 * DELETE /api/auth/delete-account
 *
 * Exclui permanentemente a conta do usuário autenticado.
 * Obrigatório pela Apple App Store desde junho 2022.
 *
 * O que é removido:
 *  1. Usuário do auth.users (via admin SDK) — invalida todos os tokens
 *  2. Dados dependentes são limpos via RLS / CASCADE no banco
 *
 * Se precisar de soft-delete ou remoção de dados de outras tabelas,
 * adicione as queries antes da exclusão do auth user.
 */
export async function DELETE() {
  try {
    // 1. Pegar sessão atual
    const supabase = await createServerSupabaseClient()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const userId = session.user.id

    // 2. (Opcional) Marcar dados como excluídos antes de deletar o auth user
    // Adicionar queries aqui se quiser registrar LGPD audit trail, por ex.:
    // await supabaseAdmin.from('deleted_accounts').insert({ user_id: userId, deleted_at: new Date() })

    // 3. Excluir usuário do Supabase Auth (admin)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('[delete-account] erro ao excluir usuário:', deleteError)
      return NextResponse.json({ error: 'Erro ao excluir conta. Tente novamente.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[delete-account] erro inesperado:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
