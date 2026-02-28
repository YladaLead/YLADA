/**
 * Camada StrategicIntro — bloco de continuidade antes da primeira pergunta.
 * Aumenta taxa de conclusão, cria sensação de método e padroniza a entrada em qualquer fluxo.
 * Texto adaptativo por contexto (single strategy, captar, educar/reter, vendas) e por perfil estratégico (dominantPain).
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

import type { StrategicProfile } from './strategic-profile'

export interface StrategicIntroContent {
  title: string
  subtitle: string
  micro: string
}

export interface StrategicIntroContext {
  /** Single = recomendação automática (1 card); inferido por safety_mode quando não persistido. */
  strategySlot?: 'single' | 'qualidade' | 'volume'
  safety_mode?: boolean
  objective?: string
  area_profissional?: string
  /** Perfil estratégico derivado (meta.strategic_profile); adapta subtítulo por dor dominante. */
  strategic_profile?: StrategicProfile | null
}

/**
 * Retorna título, subtítulo e micro para o bloco de intro antes da primeira pergunta.
 * Regras adaptativas por contexto; linguagem estratégica, nunca clínica.
 */
export function getStrategicIntro(context: StrategicIntroContext): StrategicIntroContent {
  const objective = (context.objective ?? 'captar').toString().trim().toLowerCase()
  const area = (context.area_profissional ?? '').toString().trim().toLowerCase()
  const isSingle =
    context.strategySlot === 'single' || (context.safety_mode === true && !context.strategySlot)

  const strategic = context.strategic_profile
  const pain = strategic?.dominantPain

  // Caso 1 — Single strategy (recomendação automática)
  if (isSingle) {
    const subtitleByPain: Record<string, string> = {
      agenda: 'Vamos organizar sua captação para gerar consultas com previsibilidade.',
      posicionamento: 'Vamos estruturar seu posicionamento para atrair pacientes certos.',
      conversao: 'Vamos melhorar sua conversão de interesse em consultas reais.',
      autoridade: 'Vamos fortalecer sua autoridade para atrair quem precisa de você.',
    }
    return {
      title: 'Estratégia recomendada ativada.',
      subtitle: (pain && subtitleByPain[pain]) ?? 'Vamos organizar sua captação para transformar interesse em consultas reais.',
      micro: 'Leva menos de 2 minutos.',
    }
  }

  // Caso 2 — Educar / reter
  if (objective === 'educar' || objective === 'reter') {
    return {
      title: 'Vamos mapear oportunidades.',
      subtitle: 'Suas respostas nos ajudam a indicar os próximos passos.',
      micro: 'É rápido.',
    }
  }

  // Caso 3 — Vendas / representantes
  if (/venda|vendedor|representante|comercial/.test(area)) {
    return {
      title: 'Vamos organizar sua captação.',
      subtitle:
        'Estruture seu processo para gerar mais conversas e mais fechamento.',
      micro: 'Responda com foco no seu objetivo atual.',
    }
  }

  // Caso 4 — Duas estratégias (usuário escolheu) / captar
  if (objective === 'captar') {
    const subtitleByPain: Record<string, string> = {
      agenda: 'Em poucos passos, você terá clareza para preencher sua agenda com previsibilidade.',
      posicionamento: 'Em poucos passos, você terá clareza para atrair os pacientes certos.',
      conversao: 'Em poucos passos, você terá clareza para converter interesse em consultas.',
      autoridade: 'Em poucos passos, você terá clareza para se posicionar com autoridade.',
    }
    return {
      title: 'Vamos estruturar sua estratégia.',
      subtitle: (pain && subtitleByPain[pain]) ?? 'Em poucos passos, você terá clareza para agir com precisão.',
      micro: 'Responda de forma objetiva.',
    }
  }

  // Fallback
  return {
    title: 'Vamos começar.',
    subtitle: 'Responda rapidamente para receber sua estratégia.',
    micro: 'Leva menos de 2 minutos.',
  }
}
