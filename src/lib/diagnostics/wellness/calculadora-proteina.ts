/**
 * DIAGNÓSTICOS: Calculadora de Proteína - ÁREA WELLNESS
 * Diagnóstico por objetivo: mostra quanto a pessoa precisa (conforme resultado) e orienta.
 * baixaProteina = objetivo perder peso | proteinaNormal = manter | altaProteina = ganhar massa
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO (perda de peso): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para perder peso com saúde, essa quantidade ajuda a preservar massa muscular e manter saciedade. A referência geral é 1,2 a 2,2 g/kg; para perda de peso costuma-se usar até ~2,2 g/kg.',
      causaRaiz: '🔍 CAUSA RAIZ: Na perda de peso, muitas pessoas comem menos e acabam consumindo pouca proteína, o que pode levar à perda de massa muscular e menos saciedade. Garantir a quantidade adequada (conforme resultado) ajuda a emagrecer de forma mais saudável. Um especialista monta um plano personalizado.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Priorize proteínas magras em todas as refeições (frango, peixes, ovos, leguminosas). Distribua a meta diária em 4 a 5 refeições. Para um plano completo, consulte um especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Aumente progressivamente a presença de proteína magra em 4-5 refeições até atingir a meta do resultado. Um especialista pode ajustar as quantidades e o restante da alimentação.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Só faz sentido após avaliação. Um especialista define se e quanto suplementar para ajudar a atingir a meta sem excesso de calorias.',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em proteínas magras e distribuição ao longo do dia. Um plano personalizado com especialista ajusta cardápio e porções ao seu perfil.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de perda de peso personalizado e seguro, consulte um especialista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO (manutenção): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para manter peso e saúde, essa meta ajuda a preservar massa muscular e bem-estar. A referência geral é 1,2 a 2,2 g/kg.',
      causaRaiz: '🔍 CAUSA RAIZ: Manter a ingestão adequada de proteína contribui para massa muscular, saciedade e metabolismo. A meta do resultado foi calculada para o seu perfil. Um especialista pode refinar quantidades e distribuição.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Distribua a meta diária em 4 a 5 refeições com fontes variadas (carnes magras, ovos, leguminosas, laticínios). Para acompanhamento, consulte um especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada conforme a meta do resultado. Um especialista pode ajustar horários e combinações ao seu perfil.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você se beneficia de suporte adicional. Consulte um especialista para decisões seguras.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha a meta do resultado com foco em qualidade e variedade. Um plano com especialista pode otimizar distribuição e horários.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para acompanhamento e otimizações, consulte um especialista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO (ganho de massa): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para ganhar massa muscular, essa meta favorece síntese proteica e recuperação. A referência geral é 1,2 a 2,2 g/kg; para ganho de massa pode ser maior (ex.: até ~2,5 g/kg).',
      causaRaiz: '🔍 CAUSA RAIZ: Ganho de massa exige proteína em quantidade e distribuição adequadas ao longo do dia. A meta do resultado foi calculada para o seu objetivo e nível de atividade. Um especialista monta um plano completo (dieta + timing).',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Inclua proteína em todas as refeições, com ênfase pós-treino. Fontes variadas: carnes, ovos, laticínios, leguminosas. Para um plano personalizado de ganho de massa, consulte um especialista.',
      plano7Dias: '📅 PLANO 7 DIAS: Aumente progressivamente até a meta do resultado, distribuída em 4-5 refeições. Um especialista pode definir quantidades por refeição e suplementação se necessário.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Pode ser útil para atingir a meta; deve ser orientada por um especialista para dose e tipo adequados.',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize a meta do resultado com fontes de qualidade e distribuição estratégica. Um plano personalizado com especialista maximiza ganhos.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de ganho de massa personalizado, consulte um especialista da plataforma.'
    }
  }
}
