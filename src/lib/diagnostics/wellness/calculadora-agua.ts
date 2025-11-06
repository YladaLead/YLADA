/**
 * DIAGNÓSTICOS: Calculadora de Água - ÁREA WELLNESS
 * 
 * Copiado de Nutri - pode ser personalizado depois
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraAguaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    baixaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está abaixo do recomendado, o que pode afetar funções essenciais do organismo e performance',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de líquidos ou perda excessiva. Estudos indicam que mesmo desidratação leve (1-2% do peso corporal) pode reduzir desempenho físico em até 10% e afetar funções cognitivas. Uma avaliação nutricional identifica exatamente qual é sua necessidade real considerando atividade física, clima e perfil individual',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente consumo de água gradualmente para 2.5-3L por dia, distribuído ao longo do dia. Busque avaliação nutricional para um plano personalizado que considere sua rotina e necessidades específicas',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo hidratacional inicial com lembretes horários e estratégias para aumentar ingestão de forma natural e sustentável, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Eletrólitos e magnésio podem ser considerados, especialmente se há atividade física, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente frutas aquosas (melancia, laranja), chás e sopas de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de hidratação adequada — descubra em minutos como otimizar sua ingestão hídrica com um plano personalizado.'
    },
    hidratacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua hidratação está adequada, mantenha o padrão e considere otimizações estratégicas para máximo desempenho',
      causaRaiz: '🔍 CAUSA RAIZ: Boa ingestão hídrica e equilíbrio eletrolítico estabelecidos. Pesquisas mostram que otimizações de timing e qualidade dos líquidos podem melhorar recuperação em até 15%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing da hidratação (antes, durante e após exercícios). Considere avaliação preventiva para identificar oportunidades de melhoria na distribuição',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada ao longo do dia, ajustada conforme seu perfil de atividade e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Eletrólitos específicos podem ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade dos líquidos. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua hidratação está adequada. Descubra como estratégias avançadas de timing podem potencializar ainda mais sua performance e bem-estar.'
    },
    altaHidratacao: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente hidratação! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize reposição eletrolítica',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, hidratação acima de 3L/dia é adequada quando acompanhada de reposição eletrolítica. Uma avaliação nutricional identifica se está dentro da faixa ideal e como otimizar eletrólitos',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e otimize reposição eletrolítica, especialmente em atividades intensas ou clima quente. Considere avaliação para identificar necessidades específicas de eletrólitos',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com reposição eletrolítica estratégica, ajustada conforme seu perfil de atividade e condições climáticas',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de reposição eletrolítica adicional. Eletrólitos premium e magnésio podem ser considerados, mas sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em variedade hidratacional e alimentos ricos em eletrólitos. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Sua hidratação está otimizada. Descubra como estratégias avançadas de reposição eletrolítica podem potencializar ainda mais sua performance.'
    }
  }
}

