/**
 * DIAGNÓSTICOS: Risco de Síndrome Metabólica - ÁREA NUTRI
 * 
 * Diagnósticos focados em identificar risco de síndrome metabólica
 * que estimulam contato com nutricionista profissional
 */

import { DiagnosticosPorFerramenta } from '../types'

export const sindromeMetabolicaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    riscoAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Seu perfil indica risco alto para síndrome metabólica. Um acompanhamento nutricional especializado é essencial para prevenir complicações e melhorar significativamente sua saúde metabólica.',
      causaRaiz: '🔍 CAUSA RAIZ: Síndrome metabólica é caracterizada por um conjunto de fatores de risco (obesidade abdominal, pressão alta, glicemia elevada, triglicerídeos altos, colesterol HDL baixo) que aumentam risco de doenças cardiovasculares e diabetes. Estudos mostram que até 35% da população adulta pode ter síndrome metabólica não diagnosticada. Quando não identificados e tratados, esses fatores podem levar a complicações graves. Uma avaliação nutricional completa identifica fatores de risco, cria um plano preventivo personalizado e fornece orientações para reduzir riscos. A combinação de plano alimentar adequado com estratégias preventivas personalizadas faz toda diferença na redução de riscos.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional especializada urgente para reduzir seu risco de síndrome metabólica. Uma nutricionista pode criar um plano preventivo personalizado que inclui estratégias nutricionais otimizadas, protocolos adequados e acompanhamento constante. Evite abordagens genéricas — cada pessoa tem fatores de risco específicos que requerem estratégias personalizadas.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial de redução de riscos metabólicos com estratégias nutricionais otimizadas, plano alimentar adequado, cronograma detalhado, acompanhamento para monitorar progresso e ajustes conforme sua resposta individual. O suporte nutricional é fundamental para uma redução de riscos segura e eficaz.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional completa. Ômega-3, magnésio e fibras podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera seus fatores de risco metabólicos. Priorize alimentos que melhoram saúde cardiovascular, redução de açúcares refinados, aumento de fibras e estratégias de combinação de alimentos. Uma nutricionista ajusta quantidades e combinações ideais para você, criando hábitos alimentares que reduzem riscos.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Sua saúde metabólica pode melhorar significativamente ao reduzir fatores de risco. Agende uma avaliação nutricional urgente para receber um acompanhamento especializado com estratégias personalizadas. Descubra como um plano adequado pode reduzir seus riscos e transformar seu bem-estar.'
    },
    riscoModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Você apresenta risco moderado. Um acompanhamento nutricional preventivo pode ajudar a reduzir riscos e manter sua saúde metabólica em equilíbrio.',
      causaRaiz: '🔍 CAUSA RAIZ: Risco moderado indica que você tem alguns fatores de risco que podem ser reduzidos com estratégias preventivas adequadas. Pesquisas indicam que muitas pessoas têm riscos moderados não identificados que podem ser prevenidos. Uma avaliação nutricional completa identifica fatores de risco específicos, cria estratégias preventivas personalizadas e fornece orientações para melhorar sua saúde metabólica e prevenir complicações futuras.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para uma análise preventiva que identifica seus fatores de risco específicos. Uma nutricionista pode criar estratégias práticas para reduzir riscos, ajustar plano alimentar adequado e acompanhar sua evolução. Com pequenos ajustes personalizados, você pode melhorar significativamente sua saúde metabólica.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo inicial com identificação de fatores de risco, estratégias práticas para redução de riscos, plano alimentar adequado, cronograma de observação e ajustes, e acompanhamento para monitorar melhorias. O acompanhamento nutricional ajuda a identificar melhorias nos fatores de risco.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes preventivos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar personalizado considera seus riscos moderados. Priorize alimentos que reduzem riscos, estratégias para identificar padrões problemáticos e combinações que melhoram saúde metabólica. Uma nutricionista ajusta quantidades e combinações ideais para você, criando hábitos alimentares que promovem bem-estar contínuo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Com um acompanhamento nutricional personalizado, você pode reduzir seus riscos metabólicos e melhorar seu bem-estar. Agende uma avaliação nutricional para receber estratégias práticas adequadas ao seu perfil. Pequenos ajustes podem fazer grande diferença na sua qualidade de vida!'
    },
    riscoBaixo: {
      diagnostico: '📋 DIAGNÓSTICO: Você tem baixo risco! Mesmo assim, um acompanhamento nutricional preventivo pode ajudar a manter esse risco baixo e otimizar ainda mais sua saúde metabólica.',
      causaRaiz: '🔍 CAUSA RAIZ: Ter baixo risco é um grande ativo, mas pode ser mantido e otimizado ainda mais com estratégias preventivas adequadas. Pesquisas mostram que hábitos inadequados ao longo do tempo podem aumentar riscos metabólicos. Uma avaliação nutricional completa cria estratégias preventivas personalizadas e fornece orientações para manter seu bem-estar em longo prazo. A prevenção é sempre melhor que o tratamento.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Considere uma avaliação nutricional preventiva para manter seu baixo risco. Uma nutricionista pode criar estratégias personalizadas, ajustar plano alimentar adequado e fornecer orientações para manter sua excelente condição ao longo do tempo. A prevenção garante qualidade de vida contínua.',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo preventivo com otimização de saúde metabólica, estratégias para manter baixo risco, plano alimentar adequado, orientações sobre combinações ideais de alimentos e acompanhamento para garantir que você mantenha sua excelente condição. A prevenção é a melhor estratégia.',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação nutricional. Alguns nutrientes preventivos podem ser considerados quando há indicação, mas sempre de acordo com a individualidade biológica e necessidades específicas identificadas na consulta.',
      alimentacao: '🍎 ALIMENTAÇÃO: Um plano alimentar preventivo considera seu baixo risco atual. Priorize otimização nutricional, estratégias para manter excelente saúde metabólica e combinações alimentares ideais. Uma nutricionista ajusta quantidades e combinações para manter sua saúde metabólica em excelência.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Mantenha seu baixo risco com estratégias preventivas personalizadas. Agende uma avaliação nutricional para receber orientações adequadas ao seu perfil. A prevenção é o melhor investimento para sua saúde a longo prazo!'
    }
  }
}

