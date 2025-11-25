/**
 * DIAGNÓSTICOS: Calculadora Água - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraAguaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está abaixo do recomendado, o que pode afetar funções essenciais do organismo e performance',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de líquidos ou perda excessiva. Estudos indicam que mesmo desidratação leve (1-2% do peso corporal) pode reduzir desempenho físico em até 10% e afetar funções cognitivas. Uma avaliação nutricional identifica exatamente qual é sua necessidade real considerando atividade física, clima e perfil individual',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Observe seu padrão de hidratação ao longo do dia. Busque avaliação profissional para ajustar o consumo conforme suas necessidades.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de hidratação adequada — descubra em minutos como otimizar sua ingestão hídrica com um plano personalizado.'
    },
    hidratacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está adequada, mantenha o padrão e considere otimizações estratégicas para máximo desempenho',
      causaRaiz: '🔍 CAUSA RAIZ: Boa ingestão hídrica e equilíbrio eletrolítico estabelecidos. Pesquisas mostram que otimizações de timing e qualidade dos líquidos podem melhorar recuperação em até 15%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha seu consumo atual e observe como o corpo reage. Pequenos ajustes com orientação profissional podem otimizar sua hidratação.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua hidratação está adequada. Descubra como estratégias avançadas de timing podem potencializar ainda mais sua performance e bem-estar.'
    },
    altaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente hidratação! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize reposição eletrolítica',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, hidratação acima de 3L/dia é adequada quando acompanhada de reposição eletrolítica. Uma avaliação nutricional identifica se está dentro da faixa ideal e como otimizar eletrólitos',
      acaoImediata: 'Continue mantendo hábitos de hidratação consistentes.
Avaliações periódicas ajudam a identificar necessidades específicas de reposição.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Sua hidratação está otimizada. Descubra como estratégias avançadas de reposição eletrolítica podem potencializar ainda mais sua performance.'
    }
  }
}
