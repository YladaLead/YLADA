/**
 * DIAGNÓSTICOS: Você é mais disciplinado ou emocional com a comida? - ÁREA NUTRI
 *
 * Categoriza o comportamento alimentar em quatro perfis para orientar a profissional de nutrição.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const disciplinadoEmocionalDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    perfilDisciplinado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu perfil é predominantemente disciplinado. Você mantém planejamento mesmo em dias corridos e consegue diferenciar fome física de vontade de comer.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Pessoas disciplinadas costumam ter repertório de escolhas, rotina estruturada e compreensão dos sinais do corpo. Ainda assim, pequenas rigidez podem gerar gatilhos em eventos sociais ou viagens.',
      acaoImediata:
        'Mantenha equilíbrio e flexibilidade nas escolhas alimentares.
Evite rigidez excessiva para preservar bem-estar e prazer à mesa.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Marque a consulta para transformar sua disciplina em resultados sustentáveis com flexibilidade planejada.'
    },
    perfilEquilibrado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Você está no meio-termo entre disciplina e emoção. Consegue seguir planos, mas oscila quando o dia sai do roteiro.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Falta de estrutura clara em horários críticos, aliada a gatilhos emocionais leves, faz você alternar períodos "100%" com "descompasso".',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Implementar rituais curtos (check-ins de energia/fome) e preparar opções práticas antes dos momentos vulneráveis.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Em consulta, alinhamos um protocolo híbrido (razão + emoção) para você manter constância sem radicalismos.'
    },
    perfilEmocional: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu comportamento alimentar é guiado majoritariamente por emoções (ansiedade, recompensa, cansaço).',
      causaRaiz:
        '🔍 CAUSA RAIZ: Comer sem fome física, pular refeições e buscar conforto na comida indicam falta de estratégias emocionais paralelas ao plano nutricional.',
      acaoImediata:
        'Observe seus gatilhos emocionais ligados à comida.
Apoio nutricional e emocional pode ajudar a restaurar o controle e a leveza.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Junto com a profissional de nutrição, você constrói uma estratégia integrada (alimentação + emoções) para retomar o controle com acolhimento.'
    },
    perfilImpulsivo: {
      diagnostico:
        '📋 DIAGNÓSTICO: Há forte impulsividade alimentar. Decisões acontecem "no automático", sem planejamento, gerando arrependimento posterior.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Agenda caótica, ausência de preparo prévio e "tudo ou nada" são gatilhos típicos. Falta estrutura e suporte para momentos de baixa energia.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Construir micro-hábitos (checklists de bolso, kits prontos, alarmes) para interromper o ciclo de impulsividade.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende acompanhamento para transformar impulsos em escolhas estratégicas com suporte 1:1.'
    }
  }
}
