/**
 * ETAPA 1 — gate de convicção.
 * Verifica se o profissional já concluiu o autodiagnóstico do próprio negócio.
 * A presença de uma linha em ylada_conviccao_diagnostico = Etapa 1 concluída.
 *
 * Uso (server): antes de liberar a home/área para um usuário novo, checar
 * `conviccaoConcluida(userId, segment)`; se false, redirecionar para o
 * diagnóstico (/pt/diagnostico-conviccao?area=<segment>).
 *
 * @see src/app/api/ylada/conviccao/route.ts
 */
import { supabaseAdmin } from '@/lib/supabase'

export const CONVICCAO_DIAGNOSTICO_PATH = '/pt/diagnostico-conviccao'

/** True se o usuário já concluiu o autodiagnóstico de convicção para o segmento. */
export async function conviccaoConcluida(userId: string, segment: string): Promise<boolean> {
  if (!supabaseAdmin) return true // sem backend: não bloquear
  try {
    const { data, error } = await supabaseAdmin
      .from('ylada_conviccao_diagnostico')
      .select('user_id')
      .eq('user_id', userId)
      .eq('segment', segment)
      .maybeSingle()
    if (error) {
      console.warn('[conviccao-gate] erro ao checar, liberando por segurança:', error.message)
      return true
    }
    return !!data
  } catch (e) {
    console.warn('[conviccao-gate] exceção ao checar, liberando por segurança:', e)
    return true
  }
}

/** URL do diagnóstico para um segmento/área. */
export function conviccaoDiagnosticoUrl(segment: string): string {
  return `${CONVICCAO_DIAGNOSTICO_PATH}?area=${encodeURIComponent(segment)}`
}
