import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/plano/dia/[dia]
 * 
 * Retorna as tarefas e ações do dia específico do plano de 90 dias
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ dia: string }> }
) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { dia } = await params
    const diaNumero = parseInt(dia)

    // Validar dia (1-90)
    if (isNaN(diaNumero) || diaNumero < 1 || diaNumero > 90) {
      return NextResponse.json(
        { success: false, error: 'Dia inválido. Deve ser entre 1 e 90.' },
        { status: 400 }
      )
    }

    // Buscar dados do dia na tabela wellness_planos_dias
    const { data: planoDia, error: planoError } = await supabaseAdmin
      .from('wellness_planos_dias')
      .select('*')
      .eq('dia', diaNumero)
      .single()

    if (planoError && planoError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar plano do dia:', planoError)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar plano do dia' },
        { status: 500 }
      )
    }

    // Se não encontrou o dia específico, retornar estrutura básica
    if (!planoDia) {
      return NextResponse.json({
        success: true,
        data: {
          dia: diaNumero,
          titulo: `Dia ${diaNumero} do Plano`,
          foco: 'Ações diárias para construir sua base',
          microtarefas: [
            'Enviar 3 convites leves',
            'Fazer 1 follow-up',
            'Publicar 1 divulgação simples'
          ],
          scripts_sugeridos: [],
          notificacoes_do_dia: [],
          mensagem_noel: 'Pequenos passos diários viram grandes resultados. Vamos juntos!',
          fase: Math.ceil(diaNumero / 22.5) // Aproximação: 90 dias / 4 fases = 22.5 dias por fase
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        dia: planoDia.dia,
        titulo: planoDia.titulo,
        foco: planoDia.foco,
        microtarefas: Array.isArray(planoDia.microtarefas) ? planoDia.microtarefas : [],
        scripts_sugeridos: Array.isArray(planoDia.scripts_sugeridos) ? planoDia.scripts_sugeridos : [],
        notificacoes_do_dia: Array.isArray(planoDia.notificacoes_do_dia) ? planoDia.notificacoes_do_dia : [],
        mensagem_noel: planoDia.mensagem_noel,
        fase: planoDia.fase
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar plano do dia:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
