/**
 * DIAGNÓSTICOS: Calculadora de Proteína - ÁREA WELLNESS
 * Diagnóstico baseado na comparação entre ingestão informada e recomendação (g/dia e g/kg).
 * Sempre direciona ao especialista (nutricionista/plataforma).
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está abaixo do adequado para você. Em geral recomenda-se entre 1,2 e 2,2 g de proteína por kg de peso, conforme objetivo e atividade. O adequado para você aparece no resultado acima (g/dia e g por kg).',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que muitas pessoas consomem menos proteína do que precisam para otimizar resultados. Uma avaliação com nutricionista ou especialista identifica sua necessidade real e como alcançá-la de forma segura.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas nas refeições principais de forma gradual. Carnes magras, ovos, leguminosas e laticínios são boas fontes. Para um plano personalizado, consulte um nutricionista ou especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Aumente progressivamente a presença de proteína em 4-5 refeições. Um especialista pode definir as quantidades ideais para você (em geral 1,2 a 2,2 g/kg conforme objetivo).',
      suplementacao: '💊 SUPLEMENTAÇÃO: Só faz sentido após avaliação completa. Um nutricionista ou especialista define se e quanto suplementar, de forma segura.',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize proteína em todas as refeições principais. Um plano personalizado com nutricionista ou especialista ajusta quantidades e fontes ao seu perfil.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para confirmar sua necessidade exata e um plano personalizado, consulte um nutricionista ou especialista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está adequada em relação à recomendação para você (conforme g/dia e g por kg no resultado). Em geral a faixa de 1,2 a 2,2 g por kg de peso é usada como referência, variando com objetivo e atividade.',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica em relação à sua meta. Pesquisas mostram que otimizações de timing podem potencializar resultados. Uma avaliação com especialista identifica oportunidades específicas para você.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha o consumo atual e a distribuição ao longo do dia. Para acompanhamento e ajustes finos, consulte um nutricionista ou especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada. Um especialista pode refinar quantidades e horários conforme seu perfil.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional. Consulte um nutricionista ou especialista para decisões seguras.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha o padrão atual com foco em qualidade. Um plano com especialista pode otimizar combinações e horários.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Sua ingestão está adequada. Para acompanhamento e otimizações, consulte um nutricionista ou especialista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está acima do recomendado para você. O adequado para você aparece no resultado (g/dia e g por kg). Em geral acima de 2,2 g/kg há pouco ganho adicional; o ideal é confirmar com um especialista.',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão acima do necessário costuma não trazer benefício extra e pode desequilibrar outros nutrientes. Estudos mostram que a faixa de 1,2 a 2,2 g/kg atende a maioria. Um nutricionista ou especialista confirma sua meta ideal.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Redistribua calorias para outros nutrientes (fibras, gorduras boas, carboidratos de qualidade). Para ajuste personalizado da meta de proteína, consulte um nutricionista ou especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com redistribuição balanceada. Um especialista ajusta as quantidades ao seu perfil e objetivos.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se há necessidade de suplementação. O protocolo deve ser personalizado por um especialista.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha proteína em nível adequado (conforme resultado) e diversifique outros nutrientes. Um plano personalizado com especialista define as quantidades ideais.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para otimizar sua meta de proteína e o restante da alimentação, consulte um nutricionista ou especialista da plataforma.'
    }
  }
}

