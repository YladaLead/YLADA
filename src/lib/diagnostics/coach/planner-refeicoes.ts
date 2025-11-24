/**
 * DIAGNÓSTICOS: Planner de Refeições - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const plannerRefeicoesDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    perderPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para redução de peso através de déficit calórico controlado e personalizado',
      causaRaiz: '🔍 CAUSA RAIZ: O déficit calórico adequado promove redução de peso de forma saudável quando acompanhado de distribuição correta de macronutrientes. Estudos mostram que pequenas mudanças de 300-500 kcal por dia já podem resultar em perda de 0,5-1kg por semana quando mantidas consistentemente. Uma avaliação de bem-estar identifica exatamente qual déficit é mais adequado para seu metabolismo e estilo de vida',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente o plano com déficit calórico conforme sua rotina. Busque avaliação de bem-estar para receber ajustes personalizados e acompanhamento que garanta perda de peso saudável e sustentável. Evite restrições extremas — cada organismo responde diferente',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. Descubra como reduzir peso de forma saudável e sustentável com um plano personalizado e acompanhamento adequado.'
    },
    manterPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para manutenção do peso com equilíbrio de bem-estar e suporte à saúde geral',
      causaRaiz: '🔍 CAUSA RAIZ: A manutenção do peso requer equilíbrio preciso entre ingestão e gasto calórico, além de distribuição adequada de nutrientes. Pesquisas indicam que pessoas que mantêm peso estável com alimentação equilibrada têm 50% menos risco de desenvolver desequilíbrios metabólicos. Uma avaliação de bem-estar identifica exatamente quais são suas necessidades para manutenção ideal'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha o plano alimentar equilibrado e monitore peso semanalmente. Considere avaliação de bem-estar preventiva para identificar oportunidades de otimização que preservam esse equilíbrio e melhoram qualidade de bem-estar',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar com otimizações nutricionais.'
    }
    ganharMassa: {
      diagnostico: '📋 DIAGNÓSTICO: Seu plano alimentar está configurado para ganho de massa muscular através de superávit calórico controlado e alta proteína',
      causaRaiz: '🔍 CAUSA RAIZ: O ganho de massa muscular requer superávit calórico adequado combinado com proteína suficiente para síntese proteica. Estudos mostram que ganhos de 0,25-0,5kg de massa muscular por mês são realistas quando há superávit de 300-500 kcal com 1,6-2,2g de proteína por kg. Uma avaliação de bem-estar identifica exatamente qual superávit e distribuição de macronutrientes são mais eficazes para você'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Implemente o plano com superávit calórico e proteína elevada conforme sua rotina de treinos. Busque avaliação de bem-estar para receber ajustes personalizados que maximizam ganho de massa magra enquanto minimizam ganho de gordura',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de bem-estar adequada para resultados — descubra em minutos como otimizar seu ganho de massa muscular com um plano personalizado e estratégias direcionadas.'
    }
  }
}
