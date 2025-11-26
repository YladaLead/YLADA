/**
 * DIAGNÓSTICOS: Calculadora Água - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraAguaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está abaixo do recomendado, o que pode afetar funções essenciais do organismo e performance.',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de líquidos ou perda excessiva. Estudos indicam que mesmo desidratação leve (1-2% do peso corporal) pode reduzir desempenho físico em até 10% e afetar funções cognitivas. Uma avaliação de bem-estar identifica exatamente qual é sua necessidade real considerando atividade física, clima e perfil individual.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente consumo de água gradualmente para 2.5-3L por dia, distribuído ao longo do dia. Busque avaliação de bem-estar para um plano personalizado que considere sua rotina e necessidades específicas',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de hidratação adequada — descubra em minutos como otimizar sua ingestão hídrica com um plano personalizado.'
    },
    hidratacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está adequada, mantenha o padrão e considere otimizações estratégicas para máximo desempenho.',
      causaRaiz: '🔍 CAUSA RAIZ: Boa ingestão hídrica e equilíbrio eletrolítico estabelecidos. Pesquisas mostram que otimizações de timing e qualidade dos líquidos podem melhorar recuperação em até 15%. Uma análise de bem-estar identifica oportunidades específicas para você.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing da hidratação (antes, durante e após exercícios). Considere avaliação preventiva para identificar oportunidades de melhoria na distribuição',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua hidratação está adequada. Descubra como estratégias avançadas de timing podem potencializar ainda mais sua performance e bem-estar.'
    },
    altaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente hidratação! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize reposição eletrolítica.',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, hidratação acima de 3L/dia é adequada quando acompanhada de reposição eletrolítica. Uma avaliação de bem-estar identifica se está dentro da faixa ideal e como otimizar eletrólitos.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e otimize reposição eletrolítica, especialmente em atividades intensas ou clima quente. Considere avaliação para identificar necessidades específicas de eletrólitos',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Sua hidratação está otimizada. Descubra como estratégias avançadas de reposição eletrolítica podem potencializar ainda mais sua performance.'
    }
  }
}
