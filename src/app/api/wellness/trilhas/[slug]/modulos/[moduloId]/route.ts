import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar módulo específico com aulas, checklists e scripts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; moduloId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { moduloId } = await params

    // Buscar módulo
    const { data: modulo, error: moduloError } = await supabaseAdmin
      .from('wellness_modulos')
      .select('*')
      .eq('id', moduloId)
      .eq('is_ativo', true)
      .single()

    if (moduloError || !modulo) {
      return NextResponse.json(
        { error: 'Módulo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar aulas do módulo
    const { data: aulas, error: aulasError } = await supabaseAdmin
      .from('wellness_aulas')
      .select('*')
      .eq('modulo_id', moduloId)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (aulasError) {
      console.error('Erro ao buscar aulas:', aulasError)
    }

    // Buscar checklists do módulo
    const { data: checklists, error: checklistsError } = await supabaseAdmin
      .from('wellness_checklists')
      .select('*')
      .eq('modulo_id', moduloId)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (checklistsError) {
      console.error('Erro ao buscar checklists:', checklistsError)
    }

    // Buscar scripts do módulo
    const { data: scripts, error: scriptsError } = await supabaseAdmin
      .from('wellness_scripts')
      .select('*')
      .eq('modulo_id', moduloId)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true })

    if (scriptsError) {
      console.error('Erro ao buscar scripts:', scriptsError)
    }

    // Buscar progresso do usuário
    const { data: progressoModulo } = await supabaseAdmin
      .from('wellness_progresso')
      .select('progresso_percentual, concluido')
      .eq('user_id', user.id)
      .eq('modulo_id', moduloId)
      .eq('tipo', 'modulo')
      .maybeSingle()

    // Buscar progresso de cada aula
    const aulasComProgresso = await Promise.all(
      (aulas || []).map(async (aula) => {
        const { data: progressoAula } = await supabaseAdmin
          .from('wellness_progresso')
          .select('concluido')
          .eq('user_id', user.id)
          .eq('aula_id', aula.id)
          .eq('tipo', 'aula')
          .maybeSingle()

        return {
          ...aula,
          concluido: progressoAula?.concluido || false
        }
      })
    )

    // Buscar progresso de checklists
    const checklistsComProgresso = await Promise.all(
      (checklists || []).map(async (item) => {
        const { data: progressoChecklist } = await supabaseAdmin
          .from('wellness_progresso')
          .select('concluido')
          .eq('user_id', user.id)
          .eq('checklist_item_id', item.id)
          .eq('tipo', 'checklist')
          .maybeSingle()

        return {
          ...item,
          concluido: progressoChecklist?.concluido || false
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        modulo: {
          ...modulo,
          progresso: progressoModulo?.progresso_percentual || 0,
          concluido: progressoModulo?.concluido || false
        },
        aulas: aulasComProgresso,
        checklists: checklistsComProgresso,
        scripts: scripts || []
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar módulo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

