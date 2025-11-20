/**
 * DIAGNÓSTICOS: Teste de Retenção de Líquidos - ÁREA NUTRI
 * 
 * Diagnósticos focados em identificar retenção de líquidos
 * que estimulam contato com nutricionista profissional
 */

import { DiagnosticosPorFerramenta } from '../types'

export const retencaoLiquidosDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    retencaoAlta: {
      diagnostico: '📋 DIAGNÓSTICO: Seu perfil indica retenção alta de líquidos. Um acompanhamento nutricional especializado é essencial para identificar causas e criar estratégias personalizadas para reduzir o inchaço e melhorar significativamente seu bem-estar.',
      causaRaiz: '🔍 CAUSA RAIZ: Retenção de líquidos pode ser causada por desequilíbrios hormonais, excesso de sódio, falta de potássio, problemas circulatórios, sedentarismo ou condições médicas específicas. Estudos mostram que até 50% das mulheres podem apresentar retenção durante o ciclo menstrual. Quando não identificada e tratada adequadamente, a retenção pode piorar e afetar qualidade de vida. Uma avaliação nutricional completa identifica fatores causadores, cria um plano personalizado para reduzir retenção e fornece orientações para restaurar equilíbrio hidroeletrolítico.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional especializada para reduzir retenção de líquidos. Uma nutricionista pode criar um plano personalizado que inclui estratégias nutricionais otimizadas (redução de sódio, aumento de potássio), protocolos adequados e acompanhamento constante. Evite diuréticos sem orientação — isso pode causar desequilíbrios.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial de redução de retenção com estratégias nutricionais otimizadas (redução de sódio, aumento de potássio), plano alimentar adequado, cronograma detalhado, acompanhamento para monitorar progresso e ajustes conforme sua resposta individual. O suporte nutricional é fundamental para uma redução de retenção segura e eficaz.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional completa. Magnésio e potássio podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera sua retenção alta. Priorize alimentos ricos em potássio (banana, abacate), redução de sódio, alimentos diuréticos naturais (pepino, melancia) e estratégias de hidratação adequada. Uma nutricionista ajusta quantidades e combinações ideais para você, criando hábitos alimentares que reduzem retenção.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua qualidade de vida pode melhorar significativamente ao reduzir retenção de líquidos. Agende uma avaliação nutricional para receber um acompanhamento especializado com estratégias personalizadas. Descubra como um plano adequado pode restaurar seu equilíbrio e transformar seu bem-estar.'
    },
    retencaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Você apresenta retenção moderada. Um acompanhamento nutricional pode ajudar a reduzir a retenção e manter seu corpo em equilíbrio hidroeletrolítico.',
      causaRaiz: '🔍 CAUSA RAIZ: Retenção moderada indica que você tem alguns fatores que podem ser identificados e tratados com estratégias preventivas adequadas. Pesquisas indicam que muitas pessoas têm retenção moderada não identificada que pode ser prevenida. Uma avaliação nutricional completa identifica fatores específicos, cria estratégias preventivas personalizadas e fornece orientações para melhorar seu equilíbrio hidroeletrolítico e prevenir desconfortos futuros.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para uma análise preventiva que identifica seus fatores de retenção específicos. Uma nutricionista pode criar estratégias práticas para reduzir retenção, ajustar plano alimentar adequado e acompanhar sua evolução. Com pequenos ajustes personalizados, você pode melhorar significativamente seu equilíbrio hidroeletrolítico.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial com identificação de fatores de retenção, estratégias práticas para redução, plano alimentar adequado, cronograma de observação e ajustes, e acompanhamento para monitorar melhorias. O acompanhamento nutricional ajuda a identificar melhorias no equilíbrio hidroeletrolítico.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes para equilíbrio eletrolítico podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera sua retenção moderada. Priorize alimentos que reduzem retenção, estratégias para identificar padrões problemáticos e combinações que melhoram equilíbrio hidroeletrolítico. Uma nutricionista ajusta quantidades e combinações ideais para você, criando hábitos alimentares que promovem bem-estar contínuo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Com um acompanhamento nutricional personalizado, você pode reduzir sua retenção moderada e melhorar seu bem-estar. Agende uma avaliação nutricional para receber estratégias práticas adequadas ao seu perfil. Pequenos ajustes podem fazer grande diferença na sua qualidade de vida!'
    },
    retencaoBaixa: {
      diagnostico: '📋 DIAGNÓSTICO: Você tem baixa retenção! Mesmo assim, um acompanhamento nutricional preventivo pode ajudar a manter esse equilíbrio e otimizar ainda mais sua saúde hidroeletrolítica.',
      causaRaiz: '🔍 CAUSA RAIZ: Ter baixa retenção é um grande ativo, mas pode ser mantido e otimizado ainda mais com estratégias preventivas adequadas. Pesquisas mostram que hábitos inadequados ao longo do tempo podem aumentar retenção. Uma avaliação nutricional completa cria estratégias preventivas personalizadas e fornece orientações para manter seu bem-estar em longo prazo. A prevenção é sempre melhor que o tratamento.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma avaliação nutricional preventiva para manter sua baixa retenção. Uma nutricionista pode criar estratégias personalizadas, ajustar plano alimentar adequado e fornecer orientações para manter sua excelente condição ao longo do tempo. A prevenção garante qualidade de vida contínua.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo preventivo com otimização de equilíbrio hidroeletrolítico, estratégias para manter baixa retenção, plano alimentar adequado, orientações sobre combinações ideais de alimentos e acompanhamento para garantir que você mantenha sua excelente condição. A prevenção é a melhor estratégia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes preventivos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar preventivo considera sua baixa retenção atual. Priorize otimização nutricional, estratégias para manter excelente equilíbrio hidroeletrolítico e combinações alimentares ideais. Uma nutricionista ajusta quantidades e combinações para manter sua baixa retenção em excelência.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Mantenha sua baixa retenção com estratégias preventivas personalizadas. Agende uma avaliação nutricional para receber orientações adequadas ao seu perfil. A prevenção é o melhor investimento para sua saúde a longo prazo!'
    }
  }
}






