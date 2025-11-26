/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saciedade.',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que 70% das pessoas que treinam consomem menos proteína do que precisam para otimizar resultados. Uma avaliação de bem-estar identifica exatamente qual é sua necessidade real e como alcançá-la.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação de bem-estar para um plano personalizado que distribua proteína ao longo do dia de forma estratégica',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está adequada, mantenha o padrão e considere otimizações estratégicas.',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise de bem-estar identifica oportunidades específicas para você.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está elevada, o que pode ser otimizada para máximo benefício com menor sobrecarga.',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão proteica acima do necessário pode não trazer benefícios adicionais. Estudos mostram que acima de 2.2g/kg há pouco ganho adicional. Uma avaliação de bem-estar identifica se está dentro da faixa ideal ou pode ser ajustada.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha proteína em nível adequado (1.6-2.0g/kg) e redistribua calorias para outros nutrientes essenciais. Considere avaliação para otimização do plano',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua bem-estar de forma completa e equilibrada com apoio personalizado.'
    }
  }
}
