import { supabaseAdmin } from '@/lib/supabase'
import { hasFeatureAccess } from './feature-helpers'

/**
 * Verifica se usuário tem plano anual OU acesso à feature cursos
 */
export async function checkAnnualPlanOrCursos(
  userId: string,
  area: 'nutri' | 'coach' | 'nutra'
): Promise<boolean> {
  try {
    // Verificar se tem feature cursos
    const hasCursos = await hasFeatureAccess(userId, area, 'cursos')
    if (hasCursos) {
      return true
    }

    // Verificar se tem plano anual
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .limit(1)
      .maybeSingle()

    return subscription?.plan_type === 'annual'
  } catch (error) {
    console.error('❌ Erro ao verificar plano anual/cursos:', error)
    return false
  }
}

/**
 * Calcula progresso de um módulo
 * Fórmula: vídeo (50%) + checklist (30%) + tarefas (20%)
 */
export async function calculateModuleProgress(
  userId: string,
  moduloId: string
): Promise<number> {
  try {
    // 1. Verificar se vídeo foi concluído (50%)
    const { data: progresso } = await supabaseAdmin
      .from('cursos_progresso')
      .select('progress_percentage')
      .eq('user_id', userId)
      .eq('item_type', 'modulo')
      .eq('item_id', moduloId)
      .maybeSingle()

    const videoConcluido = progresso?.progress_percentage === 100
    const videoScore = videoConcluido ? 0.5 : 0

    // 2. Verificar checklist (30%)
    const { data: checklistItems } = await supabaseAdmin
      .from('cursos_checklist')
      .select('id')
      .eq('modulo_id', moduloId)

    const totalChecklist = checklistItems?.length || 0
    let checklistConcluido = 0

    if (totalChecklist > 0) {
      const { data: progressoChecklist } = await supabaseAdmin
        .from('cursos_checklist_progresso')
        .select('checklist_id')
        .eq('user_id', userId)
        .eq('completed', true)
        .in('checklist_id', checklistItems.map(item => item.id))

      checklistConcluido = progressoChecklist?.length || 0
    }

    const checklistScore = totalChecklist > 0
      ? (checklistConcluido / totalChecklist) * 0.3
      : 0

    // 3. Verificar tarefas obrigatórias (20%)
    // Buscar aulas do módulo
    const { data: aulas } = await supabaseAdmin
      .from('cursos_aulas')
      .select('id')
      .eq('modulo_id', moduloId)

    const aulaIds = aulas?.map(a => a.id) || []
    let totalTarefas = 0
    let tarefasConcluidas = 0

    if (aulaIds.length > 0) {
      // Buscar tarefas obrigatórias
      const { data: tarefas } = await supabaseAdmin
        .from('cursos_tarefas')
        .select('id')
        .in('aula_id', aulaIds)
        .eq('obrigatoria', true)

      totalTarefas = tarefas?.length || 0

      if (totalTarefas > 0) {
        const { data: progressoTarefas } = await supabaseAdmin
          .from('cursos_tarefas_progresso')
          .select('tarefa_id')
          .eq('user_id', userId)
          .eq('completed', true)
          .in('tarefa_id', tarefas.map(t => t.id))

        tarefasConcluidas = progressoTarefas?.length || 0
      }
    }

    const tarefasScore = totalTarefas > 0
      ? (tarefasConcluidas / totalTarefas) * 0.2
      : 0

    // Calcular progresso total
    const progressoTotal = (videoScore + checklistScore + tarefasScore) * 100

    return Math.round(progressoTotal)
  } catch (error) {
    console.error('❌ Erro ao calcular progresso do módulo:', error)
    return 0
  }
}

/**
 * Verifica se módulo está liberado para o usuário
 * Módulo está liberado se:
 * - É o primeiro módulo da trilha
 * - Módulo anterior foi 100% concluído
 */
export async function checkModuleUnlocked(
  userId: string,
  moduloId: string
): Promise<boolean> {
  try {
    // Buscar módulo e trilha
    const { data: modulo } = await supabaseAdmin
      .from('cursos_modulos')
      .select('id, ordem, trilha_id')
      .eq('id', moduloId)
      .single()

    if (!modulo) {
      return false
    }

    // Se é o primeiro módulo (ordem = 1), está liberado
    if (modulo.ordem === 1) {
      return true
    }

    // Buscar módulo anterior
    const { data: moduloAnterior } = await supabaseAdmin
      .from('cursos_modulos')
      .select('id')
      .eq('trilha_id', modulo.trilha_id)
      .eq('ordem', modulo.ordem - 1)
      .single()

    if (!moduloAnterior) {
      return false
    }

    // Verificar se módulo anterior está 100% concluído
    const progresso = await calculateModuleProgress(userId, moduloAnterior.id)
    return progresso === 100
  } catch (error) {
    console.error('❌ Erro ao verificar liberação do módulo:', error)
    return false
  }
}

/**
 * Gera código único para certificado
 * Formato: ILADA-{ANO}-{RANDOM}
 */
export function generateCertificateCode(): string {
  const ano = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ILADA-${ano}-${random}`
}

/**
 * Verifica se todas as trilhas foram concluídas
 */
export async function checkAllTrilhasCompleted(
  userId: string,
  trilhaIds: string[]
): Promise<boolean> {
  try {
    for (const trilhaId of trilhaIds) {
      // Buscar progresso da trilha
      const { data: progresso } = await supabaseAdmin
        .from('cursos_progresso')
        .select('progress_percentage')
        .eq('user_id', userId)
        .eq('item_type', 'trilha')
        .eq('item_id', trilhaId)
        .maybeSingle()

      if (!progresso || progresso.progress_percentage < 100) {
        return false
      }
    }

    return true
  } catch (error) {
    console.error('❌ Erro ao verificar conclusão de trilhas:', error)
    return false
  }
}

