/**
 * LYA Semana 1 - Context Helper
 * 
 * Funções auxiliares para buscar e formatar contexto das reflexões
 * da Semana 1 para uso nos prompts da LYA
 */

import { supabaseAdmin } from '@/lib/supabase'

/**
 * Busca reflexões da Semana 1 (Dias 1-7) para contexto da LYA
 */
export async function getSemana1Reflexoes(userId: string): Promise<{
  checklistNotes: Array<{ day_number: number; item_index: number; nota: string }>
  dailyNotes: Array<{ day_number: number; conteudo: string }>
}> {
  try {
    const [checklistNotesResult, dailyNotesResult] = await Promise.all([
      // Buscar anotações dos exercícios de reflexão da Semana 1
      supabaseAdmin
        .from('journey_checklist_notes')
        .select('day_number, item_index, nota')
        .eq('user_id', userId)
        .gte('day_number', 1)
        .lte('day_number', 7)
        .order('day_number', { ascending: false })
        .order('item_index', { ascending: true }),
      // Buscar anotações diárias da Semana 1
      supabaseAdmin
        .from('journey_daily_notes')
        .select('day_number, conteudo')
        .eq('user_id', userId)
        .gte('day_number', 1)
        .lte('day_number', 7)
        .order('day_number', { ascending: false })
    ])

    return {
      checklistNotes: checklistNotesResult.data || [],
      dailyNotes: dailyNotesResult.data || []
    }
  } catch (error) {
    console.error('❌ Erro ao buscar reflexões da Semana 1:', error)
    return {
      checklistNotes: [],
      dailyNotes: []
    }
  }
}

/**
 * Formata reflexões para incluir no contexto do prompt da LYA
 */
export function formatReflexoesParaPrompt(
  checklistNotes: Array<{ day_number: number; item_index: number; nota: string }>,
  dailyNotes: Array<{ day_number: number; conteudo: string }>
): string {
  if (checklistNotes.length === 0 && dailyNotes.length === 0) {
    return ''
  }

  let contexto = '\n\n=== REFLEXÕES DA SEMANA 1 (CONTEXTO PARA PERSONALIZAÇÃO) ===\n'
  
  if (dailyNotes.length > 0) {
    contexto += '\n📝 Anotações Diárias:\n'
    dailyNotes.forEach(note => {
      if (note.conteudo && note.conteudo.trim()) {
        contexto += `- Dia ${note.day_number}: ${note.conteudo.substring(0, 300)}${note.conteudo.length > 300 ? '...' : ''}\n`
      }
    })
  }

  if (checklistNotes.length > 0) {
    contexto += '\n💭 Exercícios de Reflexão:\n'
    // Agrupar por dia
    const notasPorDia: Record<number, Array<{ item_index: number; nota: string }>> = {}
    checklistNotes.forEach(note => {
      if (note.nota && note.nota.trim()) {
        if (!notasPorDia[note.day_number]) {
          notasPorDia[note.day_number] = []
        }
        notasPorDia[note.day_number].push({
          item_index: note.item_index,
          nota: note.nota
        })
      }
    })

    Object.keys(notasPorDia)
      .map(Number)
      .sort((a, b) => b - a) // Mais recente primeiro
      .forEach(dayNumber => {
        contexto += `\nDia ${dayNumber}:\n`
        notasPorDia[dayNumber].forEach((note, idx) => {
          contexto += `  ${idx + 1}. ${note.nota.substring(0, 250)}${note.nota.length > 250 ? '...' : ''}\n`
        })
      })
  }

  contexto += '\n=== FIM DO CONTEXTO DE REFLEXÕES ===\n'
  contexto += '\nINSTRUÇÃO: Use essas reflexões para personalizar suas respostas. Retome palavras que ela usou, valide sentimentos, mostre que está acompanhando de verdade.\n'

  return contexto
}

/**
 * Busca e formata reflexões da Semana 1 para contexto da LYA
 */
export async function getSemana1ContextoFormatado(userId: string): Promise<string> {
  const { checklistNotes, dailyNotes } = await getSemana1Reflexoes(userId)
  return formatReflexoesParaPrompt(checklistNotes, dailyNotes)
}
