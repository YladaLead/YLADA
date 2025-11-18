/**
 * DIAGNÓSTICOS: Qual é o seu Tipo de Fome - ÁREA NUTRI
 * 
 * Diagnósticos focados em identificar tipo de fome (física vs emocional)
 * que estimulam contato com nutricionista profissional
 */

import { DiagnosticosPorFerramenta } from '../types'

export const tipoFomeDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    fomeEmocional: {
      diagnostico: '📋 DIAGNÓSTICO: Seu perfil indica que você tem padrões de fome emocional que precisam de atenção. Um acompanhamento nutricional especializado é essencial para identificar e controlar esses padrões, melhorando significativamente sua relação com a comida e resultados.',
      causaRaiz: '🔍 CAUSA RAIZ: Fome emocional ocorre quando você come em resposta a sentimentos como estresse, ansiedade, tristeza ou tédio, em vez de fome física real. Estudos mostram que até 75% das pessoas comem por razões emocionais sem perceber, o que pode impactar negativamente resultados de emagrecimento e bem-estar. Quando não identificados e tratados, esses padrões podem sabotar seus objetivos. Uma avaliação nutricional completa identifica gatilhos emocionais, padrões alimentares e cria estratégias personalizadas de controle. A combinação de plano alimentar adequado com estratégias de controle emocional faz toda diferença na sua relação com a comida.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional especializada para identificar e controlar sua fome emocional. Uma nutricionista pode criar um plano personalizado que inclui estratégias para diferenciar fome física de emocional, técnicas de controle emocional, plano alimentar adequado e acompanhamento constante. Evite abordagens genéricas — cada pessoa tem gatilhos emocionais específicos.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial focado em identificar gatilhos emocionais, estratégias para diferenciar fome física de emocional, plano alimentar adequado, técnicas de controle emocional, cronograma detalhado e acompanhamento para monitorar progresso. O suporte nutricional é fundamental para uma transformação segura e eficaz.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional completa. Alguns nutrientes como magnésio e triptofano podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera seus padrões de fome emocional. Priorize alimentos que promovem saciedade, estratégias de combinação de alimentos e técnicas para diferenciar fome física de emocional. Uma nutricionista ajusta quantidades e horários ideais para você, criando hábitos alimentares que melhoram sua relação com a comida.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua relação com a comida pode melhorar significativamente ao tratar adequadamente sua fome emocional. Agende uma avaliação nutricional para receber um acompanhamento especializado com estratégias personalizadas. Descubra como identificar e controlar padrões emocionais pode transformar seu bem-estar.'
    },
    fomeMista: {
      diagnostico: '📋 DIAGNÓSTICO: Você apresenta padrões mistos de fome. Um acompanhamento nutricional pode ajudar a otimizar seu controle alimentar e criar estratégias personalizadas para cada tipo de fome.',
      causaRaiz: '🔍 CAUSA RAIZ: Fome mista indica que você tem momentos de fome física real e momentos de fome emocional. Pesquisas indicam que muitas pessoas têm dificuldade em diferenciar entre os dois tipos, o que pode impactar resultados. Uma avaliação nutricional completa identifica padrões específicos, cria estratégias diferenciadas para cada tipo de fome e fornece orientações para otimizar seu controle alimentar. A diferenciação entre tipos de fome é fundamental para resultados eficazes.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para uma análise personalizada que identifica seus padrões específicos de fome. Uma nutricionista pode criar estratégias práticas para diferenciar fome física de emocional, ajustar plano alimentar adequado e acompanhar sua evolução. Com pequenos ajustes personalizados, você pode melhorar significativamente seu controle alimentar.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial com identificação de padrões de fome, estratégias práticas para diferenciar tipos de fome, plano alimentar adequado, cronograma de observação e ajustes, e acompanhamento para monitorar melhorias. O acompanhamento nutricional ajuda a identificar conexões sutis entre emoções e fome.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera seus padrões mistos de fome. Priorize alimentos que promovem saciedade e estratégias para identificar padrões. Uma nutricionista ajusta quantidades e horários ideais para você, criando hábitos alimentares que promovem bem-estar contínuo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Com um acompanhamento nutricional personalizado, você pode otimizar seu controle de fome e melhorar seu bem-estar. Agende uma avaliação nutricional para receber estratégias práticas adequadas ao seu perfil. Pequenos ajustes podem fazer grande diferença na sua qualidade de vida!'
    },
    fomeFisica: {
      diagnostico: '📋 DIAGNÓSTICO: Você parece ter bom controle da fome física! Mesmo assim, um acompanhamento nutricional preventivo pode ajudar a manter esse controle e otimizar ainda mais sua alimentação.',
      causaRaiz: '🔍 CAUSA RAIZ: Ter bom controle da fome física é um grande ativo, mas mesmo pessoas com bom controle podem se beneficiar de otimizações preventivas. Pesquisas mostram que hábitos alimentares inadequados ao longo do tempo podem levar ao desenvolvimento de padrões de fome emocional. Uma avaliação nutricional completa cria estratégias preventivas personalizadas e fornece orientações para manter seu bem-estar em longo prazo. A prevenção é sempre melhor que o tratamento.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma avaliação nutricional preventiva para otimizar seu controle de fome. Uma nutricionista pode criar estratégias personalizadas, ajustar plano alimentar adequado e fornecer orientações para manter sua excelente condição ao longo do tempo. A prevenção garante qualidade de vida contínua.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo preventivo com otimização de controle de fome, estratégias para manter equilíbrio alimentar, plano alimentar adequado, orientações sobre combinações ideais de alimentos e acompanhamento para garantir que você mantenha sua excelente condição. A prevenção é a melhor estratégia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes preventivos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar preventivo considera seu bom controle atual. Priorize otimização nutricional, estratégias para manter excelente controle de fome e combinações alimentares ideais. Uma nutricionista ajusta quantidades e horários para manter sua relação saudável com comida em excelência.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Mantenha seu excelente controle de fome com estratégias preventivas personalizadas. Agende uma avaliação nutricional para receber orientações adequadas ao seu perfil. A prevenção é o melhor investimento para sua saúde a longo prazo!'
    }
  }
}

