/**
 * DIAGNÓSTICOS: Calculadora Proteína - ÁREA NUTRI
 * Diagnóstico baseado na comparação entre ingestão informada e recomendação.
 * Sempre direciona ao nutricionista (dono da plataforma).
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está abaixo do adequado para você. A recomendação para você aparece no resultado (g/dia e g por kg). Em geral recomenda-se entre 1,2 e 2,2 g de proteína por kg de peso, conforme objetivo e atividade.',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente ou planejamento inadequado das refeições. Muitas pessoas consomem menos proteína do que precisam. Uma avaliação com nutricionista identifica sua necessidade real e como alcançá-la de forma segura.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas nas refeições principais de forma gradual. Para um plano personalizado e seguro, consulte um nutricionista.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para confirmar sua necessidade exata e um plano personalizado, consulte um nutricionista da plataforma.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está adequada em relação à recomendação para você (g/dia e g por kg no resultado). A faixa de 1,2 a 2,2 g/kg é a referência usual.',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica em relação à sua meta. Uma avaliação com nutricionista pode identificar oportunidades de otimização (timing, fontes).',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha o consumo atual e a distribuição ao longo do dia. Para acompanhamento, consulte um nutricionista.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para acompanhamento e otimizações, consulte um nutricionista da plataforma.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão informada está acima do recomendado para você. O adequado para você está no resultado (g/dia e g por kg). Acima de 2,2 g/kg costuma não trazer ganho adicional; um nutricionista pode confirmar sua meta ideal.',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão acima do necessário costuma não trazer benefício extra. Um nutricionista pode ajustar sua meta de proteína e o restante do plano de forma personalizada.',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Redistribua calorias para outros nutrientes e mantenha proteína no nível adequado (conforme resultado). Para ajuste personalizado, consulte um nutricionista.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Para otimizar sua meta de proteína e o plano alimentar completo, consulte um nutricionista da plataforma.'
    }
  }
}
