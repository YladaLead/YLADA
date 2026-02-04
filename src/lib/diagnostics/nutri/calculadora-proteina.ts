/**
 * DIAGNÓSTICOS: Calculadora de Proteína - ÁREA NUTRI
 * Mesmo diagnóstico do Wellness, com CTA para nutricionista (dono da plataforma).
 * baixaProteina = perder peso | proteinaNormal = manter | altaProteina = ganhar massa
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO (perda de peso): A quantidade de proteína que o cliente precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para perder peso com saúde, essa quantidade ajuda a preservar massa muscular e manter saciedade. A referência geral é 1,2 a 2,2 g/kg; para perda de peso costuma-se usar até ~2,2 g/kg.',
      causaRaiz: '🔍 CAUSA RAIZ: Na perda de peso, muitas pessoas comem menos e acabam consumindo pouca proteína, o que pode levar à perda de massa muscular e menos saciedade. Garantir a quantidade adequada (conforme resultado) ajuda a emagrecer de forma mais saudável. Um nutricionista monta um plano personalizado.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Priorize proteínas magras em todas as refeições (frango, peixes, ovos, leguminosas). Distribua a meta diária em 4 a 5 refeições. Para um plano completo, consulte um nutricionista.',
      plano7Dias: '📅 PLANO 7 DIAS: Aumente progressivamente a presença de proteína magra em 4-5 refeições até atingir a meta do resultado. Um nutricionista pode ajustar as quantidades e o restante da alimentação.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Só faz sentido após avaliação. Um nutricionista define se e quanto suplementar para ajudar a atingir a meta sem excesso de calorias.',
      alimentacao: '🍎 ALIMENTAÇÃO: Foque em proteínas magras e distribuição ao longo do dia. Um plano personalizado com nutricionista ajusta cardápio e porções ao perfil do cliente.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de perda de peso personalizado e seguro, consulte um nutricionista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO (manutenção): A quantidade de proteína que o cliente precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para manter peso e saúde, essa meta ajuda a preservar massa muscular e bem-estar. A referência geral é 1,2 a 2,2 g/kg.',
      causaRaiz: '🔍 CAUSA RAIZ: Manter a ingestão adequada de proteína contribui para massa muscular, saciedade e metabolismo. A meta do resultado foi calculada para o perfil. Um nutricionista pode refinar quantidades e distribuição.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Distribua a meta diária em 4 a 5 refeições com fontes variadas (carnes magras, ovos, leguminosas, laticínios). Para acompanhamento, consulte um nutricionista.',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada conforme a meta do resultado. Um nutricionista pode ajustar horários e combinações ao perfil do cliente.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se há benefício de suporte adicional. Consulte um nutricionista para decisões seguras.',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha a meta do resultado com foco em qualidade e variedade. Um plano com nutricionista pode otimizar distribuição e horários.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para acompanhamento e otimizações, consulte um nutricionista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO (ganho de massa): A quantidade de proteína que o cliente precisa por dia aparece no resultado acima (g/dia e g por kg de peso). Para ganhar massa muscular, essa meta favorece síntese proteica e recuperação. A referência geral é 1,2 a 2,2 g/kg; para ganho de massa pode ser maior (ex.: até ~2,5 g/kg).',
      causaRaiz: '🔍 CAUSA RAIZ: Ganho de massa exige proteína em quantidade e distribuição adequadas ao longo do dia. A meta do resultado foi calculada para o objetivo e nível de atividade. Um nutricionista monta um plano completo (dieta + timing).',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Inclua proteína em todas as refeições, com ênfase pós-treino. Fontes variadas: carnes, ovos, laticínios, leguminosas. Para um plano personalizado de ganho de massa, consulte um nutricionista.',
      plano7Dias: '📅 PLANO 7 DIAS: Aumente progressivamente até a meta do resultado, distribuída em 4-5 refeições. Um nutricionista pode definir quantidades por refeição e suplementação se necessário.',
      suplementacao: '💊 SUPLEMENTAÇÃO: Pode ser útil para atingir a meta; deve ser orientada por um nutricionista para dose e tipo adequados.',
      alimentacao: '🍎 ALIMENTAÇÃO: Priorize a meta do resultado com fontes de qualidade e distribuição estratégica. Um plano personalizado com nutricionista maximiza ganhos.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de ganho de massa personalizado, consulte um nutricionista da plataforma.'
    }
  }
}
