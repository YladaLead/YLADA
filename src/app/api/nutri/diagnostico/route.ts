import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { gerarPerfilEstrategico } from '@/lib/nutri/gerar-perfil-estrategico'
import type { NutriDiagnostico } from '@/types/nutri-diagnostico'

// POST - Salvar diagnóstico
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    
    // Validação: travas máximo 3
    if (body.travas && body.travas.length > 3) {
      return NextResponse.json(
        { error: 'Selecione no máximo 3 travas.' },
        { status: 400 }
      )
    }

    // Salvar diagnóstico
    const diagnosticoData: Omit<NutriDiagnostico, 'id' | 'created_at' | 'updated_at' | 'completed_at'> = {
      user_id: user.id,
      tipo_atuacao: body.tipo_atuacao,
      tempo_atuacao: body.tempo_atuacao,
      autoavaliacao: body.autoavaliacao,
      situacao_atual: body.situacao_atual,
      processos_captacao: body.processos_captacao || false,
      processos_avaliacao: body.processos_avaliacao || false,
      processos_fechamento: body.processos_fechamento || false,
      processos_acompanhamento: body.processos_acompanhamento || false,
      objetivo_principal: body.objetivo_principal,
      meta_financeira: body.meta_financeira,
      travas: body.travas || [],
      tempo_disponivel: body.tempo_disponivel,
      preferencia: body.preferencia,
      campo_aberto: body.campo_aberto?.trim() || '' // Opcional, pode ser vazio
    }

    // Inserir ou atualizar diagnóstico
    const { data: diagnostico, error: diagnosticoError } = await supabaseAdmin
      .from('nutri_diagnostico')
      .upsert(diagnosticoData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (diagnosticoError) {
      console.error('❌ Erro ao salvar diagnóstico:', diagnosticoError)
      return NextResponse.json(
        { error: 'Erro ao salvar diagnóstico' },
        { status: 500 }
      )
    }

    // Gerar perfil estratégico automaticamente
    const perfilEstrategico = gerarPerfilEstrategico(diagnostico as NutriDiagnostico)

    // Salvar perfil estratégico
    const { data: perfil, error: perfilError } = await supabaseAdmin
      .from('nutri_perfil_estrategico')
      .upsert({
        user_id: user.id,
        ...perfilEstrategico
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (perfilError) {
      console.error('❌ Erro ao salvar perfil estratégico:', perfilError)
      // Não bloquear - perfil pode ser gerado depois
    }

    // Marcar diagnóstico como completo em user_profiles
    await supabaseAdmin
      .from('user_profiles')
      .update({ diagnostico_completo: true })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      diagnostico,
      perfil_estrategico: perfil || perfilEstrategico,
      message: 'Diagnóstico salvo com sucesso. A LYA está analisando seus dados...'
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao processar diagnóstico', details: error.message },
      { status: 500 }
    )
  }
}

// GET - Verificar se diagnóstico foi completado
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: diagnostico } = await supabaseAdmin
      .from('nutri_diagnostico')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    return NextResponse.json({
      hasDiagnostico: !!diagnostico,
      diagnostico: diagnostico || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar diagnóstico:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar diagnóstico' },
      { status: 500 }
    )
  }
}

