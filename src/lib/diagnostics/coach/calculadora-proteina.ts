/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaProteina: {
      diagnostico: '📋 ANÁLISE: Sua ingestão proteica estimada está abaixo do recomendado, o que pode impactar energia, saciedade, recuperação muscular e manutenção de massa magra.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Em ações educativas, observamos que muitas mulheres consomem menos proteína do que imaginam, principalmente por falta de planejamento ou rotina alimentar irregular — algo comum fora do Brasil.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Aumentar a presença de fontes proteicas nas refeições principais costuma ser o primeiro ajuste recomendado.',
      proximoPasso: '🎯 PRÓXIMO PASSO (educativo): Essa verificação mostra apenas um recorte. Uma análise de bem-estar mais ampla ajuda a entender quanto, quando e como ajustar proteína de forma adequada à sua rotina.'
    },
    proteinaNormal: {
      diagnostico: '📋 ANÁLISE: Sua ingestão proteica estimada está dentro de uma faixa adequada para seu nível de atividade e objetivo informado.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Mesmo quando a quantidade está adequada, ajustes de distribuição ao longo do dia podem melhorar aproveitamento nutricional.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Manter o consumo atual e observar como a proteína está distribuída entre as refeições.',
      proximoPasso: '🎯 PRÓXIMO PASSO (educativo): Uma análise mais detalhada pode identificar oportunidades simples de otimização nutricional.'
    },
    altaProteina: {
      diagnostico: '📋 ANÁLISE: Sua ingestão proteica estimada está acima da faixa normalmente necessária para a maioria das pessoas.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Consumir proteína em excesso nem sempre gera benefícios adicionais e pode indicar desequilíbrio na distribuição de outros nutrientes.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Ajustar a ingestão para uma faixa mais eficiente costuma trazer melhor equilíbrio nutricional.',
      proximoPasso: '🎯 PRÓXIMO PASSO (educativo): Uma análise de bem-estar ajuda a entender se sua ingestão está adequada ou pode ser otimizada.'
    }
  }
}
