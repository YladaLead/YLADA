import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const TEXTO_AUTORIZACAO_PADRAO = `Autorizo que membros da minha equipe possam receber link de acesso à plataforma Wellness (trial de 3 dias) sem necessidade de autorização prévia minha para cada convite. Declaro estar ciente de que posso gerar e enviar links de convite diretamente por esta área.`

/**
 * POST /api/wellness/presidente/aceitar-autorizacao-equipe
 * Presidente aceita o documento de autorização (fica documentado com data).
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: presidente, error: findError } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('id')
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .maybeSingle()

    if (findError || !presidente) {
      return NextResponse.json(
        { error: 'Presidente não encontrado ou inativo.' },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const textoAceito = (body.texto_aceito as string)?.trim() || TEXTO_AUTORIZACAO_PADRAO

    const { error: updateError } = await supabaseAdmin
      .from('presidentes_autorizados')
      .update({
        autoriza_equipe_automatico: true,
        data_autorizacao_equipe_automatico: new Date().toISOString(),
        texto_autorizacao_equipe: textoAceito,
        updated_at: new Date().toISOString(),
      })
      .eq('id', presidente.id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: 'Autorização registrada e documentada.',
      data_autorizacao: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Erro ao aceitar autorização:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao registrar autorização' },
      { status: 500 }
    )
  }
}
