/**
 * DIAGNÓSTICOS: Diagnóstico de Parasitose - ÁREA NUTRI
 *
 * Baseado no conteúdo utilizado no painel administrativo (template-diagnostico-parasitose)
 * Mantém a mesma estrutura de mensagens utilizada nos demais diagnósticos Nutri.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const diagnosticoParasitoseDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    parasitoseBasica: {
      diagnostico:
        '🦠 DIAGNÓSTICO: Seus sinais indicam possível parasitose inicial. Um acompanhamento nutricional especializado é essencial para confirmar o quadro e iniciar um protocolo seguro.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Parasitas intestinais podem provocar distensão abdominal, alterações de apetite, náuseas e deficiências nutricionais. Mesmo casos leves podem comprometer a absorção de nutrientes e a imunidade quando não são investigados.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Agende uma avaliação nutricional para revisar histórico de exposição, hábitos de higiene e alimentação. A profissional orienta exames específicos e prepara um protocolo inicial antiparasitário.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Transforme o diagnóstico em ação. Com suporte profissional você confirma o quadro, recebe orientações individualizadas e evita que pequenos sinais evoluam para algo maior.'
    },
    parasitoseModerada: {
      diagnostico:
        '🦠 DIAGNÓSTICO: Há sinais consistentes de parasitose moderada. O ideal é iniciar um protocolo direcionado para evitar agravamento e restabelecer o equilíbrio intestinal.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Parasitas específicos exigem protocolos personalizados. Eles podem desencadear inflamação, alterações intestinais constantes e déficits nutricionais importantes.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Busque avaliação nutricional para receber um plano direcionado, validar exames e alinhar com outros profissionais de saúde quando necessário.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Dê continuidade ao protocolo com supervisão profissional. Assim você reduz sintomas, trata a causa e evita recidivas.'
    },
    parasitoseAvancada: {
      diagnostico:
        '🦠 DIAGNÓSTICO: Os sinais sugerem parasitose avançada ou recorrente. É indispensável acompanhamento especializado multidisciplinar.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Quadros complexos podem envolver múltiplos parasitas, inflamação intensa e comprometimento imunológico, exigindo protocolos avançados.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Procure uma nutricionista funcional para coordenar exames completos, alinhar condutas com o médico e definir o plano de suporte nutricional e detox adequado.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Mantenha acompanhamento contínuo. Relatórios nutricionais integrados ao tratamento médico aceleram resultados e protegem sua saúde intestinal.'
    }
  }
}
