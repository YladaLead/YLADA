/**
 * DIAGNÓSTICOS: Calculadora IMC - ÁREA WELLNESS
 * 
 * Copiado de Nutri - pode ser personalizado depois
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraImcDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    baixoPeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica baixo peso, o que pode sinalizar carência energética e nutricional. É importante restaurar o equilíbrio de forma segura e personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Pode estar relacionado a ingestão calórica insuficiente, metabolismo acelerado ou má absorção. Estudos indicam que 40% das pessoas com baixo peso têm causas nutricionais não identificadas. Uma avaliação nutricional identifica exatamente onde está o desequilíbrio',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Evite aumentar calorias de forma desordenada. O ideal é ajustar alimentos densos nutricionalmente conforme seu estilo de vida e rotina diária',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial para ganho saudável, com foco em refeições equilibradas, aumento gradual de calorias e estímulo do apetite natural',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade de suplementos só é definida após avaliação completa. Costuma-se considerar opções como whey protein, multivitamínicos e probióticos, sempre de acordo com a individualidade biológica',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize alimentos naturais e calóricos como abacate, castanhas, raízes e cereais integrais. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Descubra em minutos como seu corpo pode responder a um plano de ganho saudável — solicite sua análise personalizada agora.'
    },
    pesoNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC está normal, o que indica boa relação peso/altura. Manter hábitos saudáveis e considerar estratégias preventivas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa relação peso/altura estabelecida. Pesquisas mostram que pessoas com IMC normal que adotam estratégias nutricionais preventivas têm 60% menos risco de desenvolver desequilíbrios futuros. Continue cuidando da saúde com foco em qualidade nutricional',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha alimentação equilibrada e exercícios regulares. Considere avaliação preventiva para identificar oportunidades de otimização que preservam esse equilíbrio',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com alimentação variada e atividade física, ajustado conforme seu perfil metabólico e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte nutricional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade nutricional. Um plano personalizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias preventivas podem potencializar ainda mais sua saúde e bem-estar.'
    },
    sobrepeso: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica sobrepeso, o que sinaliza necessidade de reequilíbrio controlado e personalizado',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio entre ingestão calórica e gasto energético. Estudos mostram que pequenas mudanças de 300 kcal por dia já podem influenciar a composição corporal ao longo do tempo. Uma avaliação completa identifica exatamente onde ajustar',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Seu corpo está pedindo equilíbrio. Busque avaliação nutricional para um plano de redução gradual e segura. Evite dietas restritivas sem acompanhamento — cada organismo responde diferente',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de redução controlada com alimentação ajustada e estratégias de exercício, personalizado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação. Proteína magra e fibras costumam ser considerados, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Reduza carboidratos refinados e aumente proteínas e fibras de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir como reduzir peso de forma saudável e sustentável com apoio personalizado.'
    },
    obesidade: {
      diagnostico: '📋 DIAGNÓSTICO: Seu IMC indica obesidade, o que requer intervenção personalizada e estruturada com acompanhamento profissional',
      causaRaiz: '🔍 CAUSA RAIZ: Desequilíbrio metabólico significativo que pode afetar sua saúde. Pesquisas indicam que intervenções nutricionais personalizadas podem resultar em melhoria significativa. Uma avaliação completa identifica exatamente a origem e estratégias para reverter com segurança',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque acompanhamento profissional imediato para um plano estruturado e adequado ao seu perfil. Evite abordagens genéricas — cada caso requer estratégia específica e acompanhamento',
      plano7Dias: '📅 PLANO 7 DIAS: Intervenção nutricional inicial personalizada, com suporte multidisciplinar e acompanhamento para ajustes conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Suporte metabólico pode ser considerado, mas sempre de acordo com a individualidade biológica e sob acompanhamento profissional',
      alimentacao: '🍎 ALIMENTAÇÃO: Reeducação alimentar completa, totalmente personalizada, considerando suas necessidades metabólicas e preferências, sob acompanhamento profissional',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado e um plano estruturado.'
    }
  }
}

