/**
 * GET /api/wellness/consultor/perfil-completo
 * 
 * Retorna todas as respostas do onboarding do consultor
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Carregar perfil completo do consultor
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (perfilError && perfilError.code !== 'PGRST116') {
      console.error('❌ Erro ao carregar perfil:', perfilError)
      return NextResponse.json(
        { error: 'Erro ao carregar perfil' },
        { status: 500 }
      )
    }

    if (!perfil) {
      return NextResponse.json({
        success: false,
        message: 'Perfil não encontrado. Complete o onboarding primeiro.'
      })
    }

    // Retornar perfil completo formatado
    return NextResponse.json({
      success: true,
      perfil: {
        // Dados básicos
        objetivo_principal: perfil.objetivo_principal,
        tempo_disponivel: perfil.tempo_disponivel,
        experiencia_herbalife: perfil.experiencia_herbalife || perfil.experiencia_vendas,
        canal_principal: perfil.canal_principal,
        canal_preferido: perfil.canal_preferido || [],
        
        // Dados operacionais
        prepara_bebidas: perfil.prepara_bebidas,
        trabalha_com: perfil.trabalha_com,
        meta_pv: perfil.meta_pv,
        meta_financeira: perfil.meta_financeira,
        
        // Dados sociais
        contatos_whatsapp: perfil.contatos_whatsapp,
        seguidores_instagram: perfil.seguidores_instagram,
        abertura_recrutar: perfil.abertura_recrutar,
        publico_preferido: perfil.publico_preferido || [],
        
        // Preferências
        tom: perfil.tom,
        ritmo: perfil.ritmo,
        lembretes: perfil.lembretes,
        
        // Dados antigos (compatibilidade)
        tem_lista_contatos: perfil.tem_lista_contatos,
        
        // Status
        onboarding_completo: perfil.onboarding_completo,
        onboarding_completado_at: perfil.onboarding_completado_at,
        created_at: perfil.created_at,
        updated_at: perfil.updated_at
      }
    })
  } catch (error: any) {
    console.error('❌ Erro ao carregar perfil completo:', error)
    return NextResponse.json(
      { error: 'Erro ao carregar perfil completo', details: error.message },
      { status: 500 }
    )
  }
}
