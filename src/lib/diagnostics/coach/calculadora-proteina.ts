/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA COACH
 * Diagnóstico por objetivo: mostra quanto a pessoa precisa (conforme resultado) e orienta.
 * baixaProteina = perder peso | proteinaNormal = manter | altaProteina = ganhar massa
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaProteina: {
      diagnostico: '📋 ANÁLISE (perda de peso): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg). Para perder peso com saúde, essa meta ajuda a preservar massa muscular e saciedade. A referência geral é 1,2 a 2,2 g/kg; para perda de peso costuma-se usar até ~2,2 g/kg.',
      causaRaiz: '🔍 CONTEXTO: Na perda de peso, garantir proteína adequada evita perda de massa muscular e melhora saciedade. A meta do resultado foi calculada para o seu perfil. O especialista da plataforma pode montar um plano personalizado.',
      acaoImediata: '⚡ ORIENTAÇÃO: Priorize proteínas magras em todas as refeições e distribua a meta em 4 a 5 refeições. Para um plano completo, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de perda de peso personalizado, consulte o especialista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 ANÁLISE (manutenção): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg). Para manter peso e saúde, essa meta ajuda a preservar massa muscular. A referência geral é 1,2 a 2,2 g/kg.',
      causaRaiz: '🔍 CONTEXTO: Manter a ingestão adequada de proteína contribui para massa muscular e bem-estar. A meta do resultado foi calculada para o seu perfil. O especialista pode refinar distribuição e horários.',
      acaoImediata: '⚡ ORIENTAÇÃO: Distribua a meta em 4 a 5 refeições com fontes variadas. Para acompanhamento, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para acompanhamento e otimizações, consulte o especialista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 ANÁLISE (ganho de massa): A quantidade de proteína que você precisa por dia aparece no resultado acima (g/dia e g por kg). Para ganhar massa muscular, essa meta favorece síntese e recuperação. A referência geral é 1,2 a 2,2 g/kg; para ganho de massa pode ser maior (ex.: até ~2,5 g/kg).',
      causaRaiz: '🔍 CONTEXTO: Ganho de massa exige proteína em quantidade e distribuição adequadas. A meta do resultado foi calculada para o seu objetivo e atividade. O especialista da plataforma pode montar um plano completo.',
      acaoImediata: '⚡ ORIENTAÇÃO: Inclua proteína em todas as refeições, com ênfase pós-treino. Para um plano personalizado de ganho de massa, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para um plano de ganho de massa personalizado, consulte o especialista da plataforma.'
    }
  }
}
