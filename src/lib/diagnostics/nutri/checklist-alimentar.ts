/**
 * DIAGNÓSTICOS: Checklist Alimentar - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const checklistAlimentarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    alimentacaoDeficiente: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação precisa de correção para melhorar saúde e bem-estar de forma sustentável',
      causaRaiz: '🔍 CAUSA RAIZ: Hábitos alimentares inadequados e possíveis deficiências nutricionais. Estudos indicam que 70% das doenças crônicas estão relacionadas à alimentação inadequada. Uma avaliação nutricional completa identifica exatamente quais deficiências estão presentes e como corrigir',
      acaoImediata: 'Observe seus hábitos alimentares e evite mudanças drásticas por conta própria.
Busque avaliação profissional para corrigir deficiências de forma segura.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua saúde começa pela alimentação — descubra em minutos como transformar seus hábitos alimentares com um plano personalizado e seguro.'
    },
    alimentacaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação está moderada, mas pode ser otimizada para melhorar saúde e performance',
      causaRaiz: '🔍 CAUSA RAIZ: Alguns hábitos alimentares podem ser otimizados e pequenas deficiências nutricionais podem estar presentes. Pesquisas mostram que otimizações estratégicas podem melhorar marcadores de saúde em até 30%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: 'Reflita sobre sua rotina alimentar e identifique pequenas melhorias.
Ajustes guiados por um profissional podem maximizar resultados.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua alimentação com estratégias personalizadas que potencializam sua saúde.'
    },
    alimentacaoEquilibrada: {
      diagnostico: '📋 DIAGNÓSTICO: Sua alimentação está equilibrada, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Bons hábitos alimentares estabelecidos. Estratégias preventivas e otimizações avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda melhores. Uma avaliação preventiva identifica oportunidades específicas',
      acaoImediata: 'Mantenha seus bons hábitos e atenção ao corpo.
Avaliações periódicas ajudam a potencializar a saúde a longo prazo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio alimentar é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais sua saúde e bem-estar.'
    }
  }
}
