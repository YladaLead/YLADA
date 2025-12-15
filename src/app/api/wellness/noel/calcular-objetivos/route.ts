import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { calcularObjetivosCompletos, formatarCalculoParaNoel } from '@/lib/noel-wellness/meta-calculator-completo'

/**
 * POST /api/wellness/noel/calcular-objetivos
 * 
 * Calcula objetivos completos de vendas, recrutamento e produção da equipe
 * para bater as metas estabelecidas pelo usuário
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar perfil estratégico do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Perfil estratégico não encontrado. Complete o onboarding primeiro.' },
        { status: 404 }
      )
    }

    // Buscar PV atual do mês
    const mesAno = new Date().toISOString().slice(0, 7) // YYYY-MM
    
    const { data: pvData } = await supabaseAdmin
      .from('wellness_consultant_pv_monthly')
      .select('pv_total')
      .eq('consultant_id', user.id)
      .eq('mes_ano', mesAno)
      .single()

    const pvAtual = pvData?.pv_total || 0

    // Calcular objetivos completos
    const calculo = await calcularObjetivosCompletos(profile, pvAtual)

    // Formatar para o NOEL (passar tipo_trabalho para personalizar)
    const tipoTrabalho = profile.tipo_trabalho || null
    const textoFormatado = formatarCalculoParaNoel(calculo, tipoTrabalho || undefined)

    return NextResponse.json({
      sucesso: true,
      calculo,
      texto_formatado: textoFormatado,
      resumo: {
        meta_pv: calculo.meta_pv,
        meta_financeira: calculo.meta_financeira,
        pv_atual,
        pv_necessario: calculo.pv_necessario,
        caminho_mais_rapido: calculo.resumo.caminho_mais_rapido,
        tempo_estimado: calculo.resumo.tempo_estimado_meses
      }
    })
  } catch (error: any) {
    console.error('Erro ao calcular objetivos:', error)
    return NextResponse.json(
      { error: 'Erro ao calcular objetivos', detalhes: error.message },
      { status: 500 }
    )
  }
}
