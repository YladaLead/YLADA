/**
 * DIAGNÓSTICOS: Você está Nutrido ou Apenas Alimentado - ÁREA NUTRI
 * 
 * Diagnósticos focados em diferenciar nutrição de alimentação
 * que estimulam contato com nutricionista profissional
 */

import { DiagnosticosPorFerramenta } from '../types'

export const nutridoVsAlimentadoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    apenasAlimentado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu perfil indica que você está apenas se alimentando, mas não nutrido adequadamente. Um acompanhamento nutricional especializado é essencial para garantir que você receba todos os nutrientes necessários e transforme sua alimentação em nutrição real.',
      causaRaiz: '🔍 CAUSA RAIZ: Alimentar-se sem nutrir adequadamente pode levar a deficiências nutricionais, baixa energia, problemas de saúde, baixa imunidade e piora da qualidade de vida. Estudos mostram que até 75% das pessoas se alimentam mas não estão adequadamente nutridas, consumindo calorias vazias sem nutrientes essenciais. Quando não identificado e tratado, esse padrão pode piorar ao longo do tempo. Uma avaliação nutricional completa identifica deficiências nutricionais, cria um plano personalizado para garantir nutrição completa e fornece orientações para transformar alimentação em nutrição real.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional especializada para garantir nutrição adequada. Uma nutricionista pode criar um plano personalizado que inclui estratégias nutricionais otimizadas para garantir todos os nutrientes necessários, receitas nutritivas e práticas, protocolos adequados e acompanhamento constante. Evite abordagens genéricas — cada pessoa tem necessidades nutricionais específicas.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial de transformação nutricional com estratégias nutricionais otimizadas para garantir todos os nutrientes essenciais, plano alimentar adequado, cronograma detalhado, acompanhamento para monitorar nutrição e ajustes conforme sua resposta individual. O suporte nutricional é fundamental para uma transformação nutricional segura e eficaz.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional completa. Multivitamínicos, ômega-3 e probióticos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera suas deficiências nutricionais. Priorize alimentos densos em nutrientes, estratégias de combinação de alimentos para maximizar absorção nutricional e receitas nutritivas e práticas. Uma nutricionista ajusta quantidades e combinações ideais para você, garantindo nutrição completa e adequada.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua saúde pode melhorar significativamente ao garantir nutrição adequada. Agende uma avaliação nutricional para receber um acompanhamento especializado com estratégias personalizadas. Descubra como transformar alimentação em nutrição real pode transformar seu bem-estar.'
    },
    parcialmenteNutrido: {
      diagnostico: '📋 DIAGNÓSTICO: Você está parcialmente nutrido, mas pode ser otimizado. Um acompanhamento nutricional pode ajudar a garantir que você receba todos os nutrientes necessários e transforme sua alimentação em nutrição completa.',
      causaRaiz: '🔍 CAUSA RAIZ: Nutrição parcial indica boa base, mas há oportunidades de otimização para garantir nutrição completa. Pesquisas indicam que muitas pessoas têm algum nível de nutrição mas podem garantir nutrição mais completa e adequada. Uma avaliação nutricional completa identifica oportunidades específicas de otimização nutricional, cria estratégias personalizadas e fornece orientações para elevar seus resultados para o próximo nível.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber estratégias de otimização nutricional personalizadas. Uma nutricionista pode criar um plano que inclui estratégias nutricionais otimizadas, ajustes no estilo de vida e acompanhamento para garantir que você alcance nutrição adequada e completa. Com pequenos ajustes personalizados, você pode melhorar significativamente sua nutrição.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo de otimização nutricional com estratégias nutricionais otimizadas, ajustes no timing das refeições, plano alimentar adequado, acompanhamento para monitorar melhorias e ajustes conforme seu progresso individual. O acompanhamento nutricional garante otimização contínua.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes de manutenção podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera sua nutrição parcial. Priorize otimização nutricional, estratégias de timing alimentar e combinações de alimentos que maximizam absorção nutricional. Uma nutricionista ajusta quantidades e combinações ideais para você, criando hábitos alimentares que mantêm nutrição otimizada.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Com estratégias personalizadas, você pode otimizar sua nutrição e melhorar seus resultados. Agende uma avaliação nutricional para receber um plano de otimização nutricional. Estratégias adequadas podem fazer toda diferença na sua nutrição completa!'
    },
    bemNutrido: {
      diagnostico: '📋 DIAGNÓSTICO: Você já está bem nutrido! Mesmo assim, um acompanhamento nutricional preventivo pode ajudar a manter essa nutrição adequada e otimizar ainda mais sua saúde nutricional.',
      causaRaiz: '🔍 CAUSA RAIZ: Ter boa nutrição é um grande ativo, mas pode ser otimizado ainda mais com estratégias preventivas adequadas. Pesquisas mostram que nutrição pode ser mantida e otimizada continuamente. Uma avaliação nutricional completa cria estratégias preventivas personalizadas e fornece orientações para manter seu bem-estar em longo prazo. A prevenção é sempre melhor que o tratamento.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma avaliação nutricional preventiva para otimizar sua nutrição. Uma nutricionista pode criar estratégias personalizadas, ajustar plano alimentar adequado e fornecer orientações para manter sua excelente condição ao longo do tempo. A prevenção garante qualidade de vida contínua.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo preventivo com otimização de nutrição, estratégias para manter nutrição adequada, plano alimentar adequado, orientações sobre combinações ideais de alimentos e acompanhamento para garantir que você mantenha sua excelente condição. A prevenção é a melhor estratégia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes preventivos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar preventivo considera sua boa nutrição atual. Priorize otimização nutricional, estratégias para manter excelente nutrição e combinações alimentares ideais. Uma nutricionista ajusta quantidades e combinações para manter sua nutrição adequada em excelência.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Mantenha sua excelente nutrição com estratégias preventivas personalizadas. Agende uma avaliação nutricional para receber orientações adequadas ao seu perfil. A prevenção é o melhor investimento para sua saúde a longo prazo!'
    }
  }
}










