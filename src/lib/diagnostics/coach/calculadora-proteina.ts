/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA COACH
 * Diagnóstico baseado na comparação entre ingestão informada e recomendação.
 * Sempre direciona ao especialista (dono da plataforma).
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    baixaProteina: {
      diagnostico: '📋 ANÁLISE: Sua ingestão informada está abaixo do adequado para você. A recomendação para você aparece no resultado (g/dia e g por kg). Em geral usa-se entre 1,2 e 2,2 g de proteína por kg de peso, conforme objetivo e atividade.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Muitas pessoas consomem menos proteína do que imaginam, por falta de planejamento ou rotina irregular. Uma análise com o especialista da plataforma ajuda a definir quanto, quando e como ajustar de forma adequada.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Aumente fontes proteicas nas refeições principais. Para um plano personalizado, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para confirmar sua necessidade exata e um plano adequado à sua rotina, consulte o especialista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 ANÁLISE: Sua ingestão informada está adequada em relação à recomendação para você (g/dia e g por kg no resultado). A faixa de 1,2 a 2,2 g/kg é a referência usual, variando com objetivo e atividade.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Boa quantidade em relação à meta. Ajustes de distribuição ao longo do dia podem melhorar ainda mais o aproveitamento. O especialista pode identificar oportunidades simples.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Mantenha o consumo atual e a distribuição entre refeições. Para acompanhamento, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para acompanhamento e otimizações, consulte o especialista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 ANÁLISE: Sua ingestão informada está acima do recomendado para você. O adequado para você está no resultado (g/dia e g por kg). Acima de 2,2 g/kg costuma não trazer ganho adicional; um especialista pode confirmar sua meta ideal.',
      causaRaiz: '🔍 CONTEXTO MAIS COMUM: Excesso de proteína nem sempre gera benefício extra e pode desequilibrar outros nutrientes. O especialista da plataforma pode ajustar sua meta de forma personalizada.',
      acaoImediata: '⚡ ORIENTAÇÃO GERAL: Redistribua para outros nutrientes e mantenha proteína no nível adequado (conforme resultado). Para ajuste fino, consulte o especialista da plataforma.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para otimizar sua meta de proteína e o plano como um todo, consulte o especialista da plataforma.'
    }
  }
}
