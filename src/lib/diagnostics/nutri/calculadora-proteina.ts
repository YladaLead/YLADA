/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saciedade',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que 70% das pessoas que treinam consomem menos proteína do que precisam para otimizar resultados. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Observe seu consumo diário de proteínas. Busque avaliação profissional para distribuir proteína de forma segura ao longo do dia.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está adequada, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: 'Mantenha seus hábitos atuais e observe como seu corpo responde.
Pequenos ajustes com orientação profissional podem melhorar a distribuição de proteína.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está elevada, o que pode ser otimizada para máximo benefício com menor sobrecarga',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão proteica acima do necessário pode não trazer benefícios adicionais. Estudos mostram que acima de 2.2g/kg há pouco ganho adicional. Uma avaliação nutricional identifica se está dentro da faixa ideal ou pode ser ajustada',
      acaoImediata: 'Mantenha seu consumo equilibrado e atenção à variedade nutricional.
Avaliações periódicas ajudam a otimizar a ingestão sem desequilíbrios.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua nutrição de forma completa e equilibrada com apoio personalizado.'
    }
  }
}
