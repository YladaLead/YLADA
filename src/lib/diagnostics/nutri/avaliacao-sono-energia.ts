/**
 * DIAGNÓSTICOS: Avaliação do Sono e Energia - ÁREA NUTRI
 *
 * Resultados pensados para conectar sinais de sono, ritmo circadiano
 * e performance diária com acompanhamento nutricional profissional.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const avaliacaoSonoEnergiaDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    sonoRestaurador: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu sono está restaurando bem a energia diária, mantendo humor, foco e recuperação muscular consistentes.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Rotina regular, exposição à luz natural pela manhã, alimentação leve no período noturno e gestão do estresse ajudam a preservar esse padrão.',
      acaoImediata:
        'Mantenha higiene do sono e horários consistentes.
Observe como seu corpo responde ao descanso diário.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Faça uma avaliação preventiva para confirmar se marcadores hormonais e nutricionais seguem alinhados e receba sugestões personalizadas para continuar evoluindo.'
    },
    sonoLevementePrejudicado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Há sinais de fadiga acumulada e sono moderadamente prejudicado, impactando produtividade e disposição ao longo do dia.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Cafeína tarde da noite, telas antes de dormir, horários irregulares e alto nível de estresse podem estar fragmentando o sono.',
      acaoImediata:
        'Reduza estímulos noturnos, como cafeína e telas.
Pequenos ajustes de rotina podem melhorar qualidade do sono.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende uma consulta para receber protocolos personalizados (luz, alimentação, micronutrientes) e reavaliar energia após 7–14 dias de ajustes.'
    },
    sonoComprometido: {
      diagnostico:
        '📋 DIAGNÓSTICO: O descanso está seriamente comprometido, indicando privação crônica de sono com impacto metabólico, emocional e hormonal.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Falta de horário fixo, trabalho noturno, estresse elevado e alimentação tardia mantêm o sistema nervoso em alerta e dificultam a entrada em sono profundo.',
      acaoImediata:
        'Evite mudanças drásticas sozinho.
Busque avaliação profissional para ajustar sono e rotina de forma segura.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Inicie acompanhamento nutricional e comportamental para restabelecer o sono, avaliar necessidade de exames e estruturar um plano completo de recuperação de energia.'
    }
  }
}
