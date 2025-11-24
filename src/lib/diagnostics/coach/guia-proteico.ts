/**
 * DIAGNÓSTICOS: Guia Proteico - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const guiaProteicoDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaProteina: {
      diagnostico: '🥩 DIAGNÓSTICO: Seu consumo de proteína está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saúde geral',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que consumo abaixo de 0.8g/kg pode comprometer síntese proteica e recuperação muscular. Uma avaliação de bem-estar identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação de bem-estar para um plano personalizado que distribua proteína ao longo do dia de forma estratégica',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaModerada: {
      diagnostico: '🥩 DIAGNÓSTICO: Seu consumo de proteína está adequado, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise de bem-estar identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição e qualidade',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    }
    altaProteina: {
      diagnostico: '🥩 DIAGNÓSTICO: Excelente consumo de proteína! Ideal para atletas e pessoas ativas. Mantenha padrão atual e otimize absorção',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo adequado para alta performance e recuperação. Para pessoas ativas, consumo acima de 1.2g/kg é adequado quando acompanhado de distribuição estratégica. Uma avaliação de bem-estar identifica se está dentro da faixa ideal e como otimizar timing',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue padrão atual e otimize absorção e timing, especialmente em períodos de maior demanda. Considere avaliação para identificar necessidades específicas',
      proximoPasso: '🎯 PRÓXIMO PASSO: Excelente! Seu consumo proteico está otimizado. Descubra como estratégias avançadas de timing e absorção podem potencializar ainda mais sua performance.'
    }
  }
}
