import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * DELETE /api/user/delete-account
 * Deleta TODOS os dados do usuário autenticado (Direito ao Esquecimento - LGPD/GDPR)
 * 
 * IMPORTANTE: Esta ação é IRREVERSÍVEL
 */
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const userId = user.id

    console.log(`🗑️ Iniciando exclusão de conta para usuário: ${userId}`)

    // Deletar dados de todas as tabelas relacionadas
    // Ordem importa devido a foreign keys

    // 1. Conversões Wellness
    try {
      await supabaseAdmin
        .from('wellness_conversions')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Conversões deletadas')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar conversões:', e)
    }

    // 2. Assinaturas Wellness
    try {
      await supabaseAdmin
        .from('wellness_subscriptions')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Assinaturas deletadas')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar assinaturas:', e)
    }

    // 3. Perfil Wellness/NOEL
    try {
      await supabaseAdmin
        .from('wellness_noel_profile')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Perfil Wellness deletado')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar perfil Wellness:', e)
    }

    // 4. Templates Coach
    try {
      await supabaseAdmin
        .from('coach_user_templates')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Templates Coach deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar templates Coach:', e)
    }

    // 5. Clientes Coach
    try {
      await supabaseAdmin
        .from('coach_clients')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Clientes Coach deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar clientes Coach:', e)
    }

    // 6. Leads Coach
    try {
      await supabaseAdmin
        .from('coach_leads')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Leads Coach deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar leads Coach:', e)
    }

    // 7. Templates Nutri
    try {
      await supabaseAdmin
        .from('user_templates')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Templates Nutri deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar templates Nutri:', e)
    }

    // 8. Clientes Nutri
    try {
      await supabaseAdmin
        .from('clients')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Clientes Nutri deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar clientes Nutri:', e)
    }

    // 9. Leads Nutri
    try {
      await supabaseAdmin
        .from('leads')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Leads Nutri deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar leads Nutri:', e)
    }

    // 10. Consentimentos
    try {
      await supabaseAdmin
        .from('user_consents')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Consentimentos deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar consentimentos:', e)
    }

    // 11. Push Subscriptions
    try {
      await supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Push subscriptions deletadas')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar push subscriptions:', e)
    }

    // 12. Rate Limits (NOEL)
    try {
      await supabaseAdmin
        .from('noel_rate_limits')
        .delete()
        .eq('user_id', userId)
      console.log('✅ Rate limits deletados')
    } catch (e) {
      console.warn('⚠️ Erro ao deletar rate limits:', e)
    }

    // 13. Security Logs (NOEL) - Manter anônimos para auditoria
    // Não deletamos logs de segurança para manter auditoria

    // 14. Perfil do usuário (user_profiles)
    // Isso será deletado automaticamente pelo CASCADE quando deletarmos o usuário do auth

    // 15. Finalmente, deletar usuário do Supabase Auth
    // Isso vai deletar automaticamente user_profiles por CASCADE
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('❌ Erro ao deletar usuário do auth:', deleteError)
      return NextResponse.json(
        { 
          error: 'Erro ao deletar conta. Alguns dados podem ter sido removidos, mas a conta ainda existe.',
          details: deleteError.message 
        },
        { status: 500 }
      )
    }

    console.log('✅ Conta deletada com sucesso')

    return NextResponse.json({
      success: true,
      message: 'Conta e todos os dados associados foram deletados permanentemente.'
    })
  } catch (error: any) {
    console.error('❌ Erro ao deletar conta:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar conta' },
      { status: 500 }
    )
  }
}
































