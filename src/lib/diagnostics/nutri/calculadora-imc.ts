/**
 * DIAGNÓSTICOS: Calculadora IMC - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraImcDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixoPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica baixo peso, o que pode sinalizar carência energética e nutricional. É importante restaurar o equilíbrio de forma segura e personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Pode estar relacionado a ingestão calórica insuficiente, metabolismo acelerado ou má absorção. Estudos indicam que 40% das pessoas com baixo peso têm causas nutricionais não identificadas. Uma avaliação nutricional identifica exatamente onde está o desequilíbrio',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Evite aumento de calorias sem orientação. Busque equilíbrio entre alimentação e rotina para ganho saudável.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Descubra em minutos como seu corpo pode responder a um plano de ganho saudável — solicite sua análise personalizada agora.'
    },
    pesoNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC está normal, o que indica boa relação peso/altura. Manter hábitos saudáveis e considerar estratégias preventivas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa relação peso/altura estabelecida. Pesquisas mostram que pessoas com IMC normal que adotam estratégias nutricionais preventivas têm 60% menos risco de desenvolver desequilíbrios futuros. Continue cuidando da saúde com foco em qualidade nutricional',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha seus hábitos equilibrados e ativos. Avaliações periódicas ajudam a preservar esse resultado.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar.'
    },
    sobrepeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica sobrepeso, o que sinaliza necessidade de reequilíbrio controlado e personalizado',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio entre ingestão calórica e gasto energético. Estudos mostram que pequenas mudanças de 300 kcal por dia já podem influenciar a composição corporal ao longo do tempo. Uma avaliação completa identifica exatamente onde ajustar',
      acaoImediata: 'Observe seus hábitos e ritmo de vida.
Busque avaliação profissional para um ajuste gradual e seguro.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir peso de forma saudável e sustentável com apoio personalizado.'
    },
    obesidade: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica obesidade, o que requer intervenção personalizada e estruturada com acompanhamento profissional',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio metabólico significativo que pode afetar sua saúde. Pesquisas indicam que intervenções nutricionais personalizadas podem resultar em melhoria significativa. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança',
      acaoImediata: 'Procure acompanhamento profissional para um plano personalizado.
Evite dietas restritivas ou soluções rápidas — cada corpo tem seu ritmo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado e um plano estruturado.'
    }
  }
}
