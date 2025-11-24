/**
 * DIAGNÓSTICOS: Avaliação do Sono e Energia - ÁREA COACH
 *
 * Resultados pensados para conectar sinais de sono, ritmo circadiano
 * e performance diária com acompanhamento nutricional profissional.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const avaliacaoSonoEnergiaDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    sonoRestaurador: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu sono está restaurando bem a energia diária, mantendo humor, foco e recuperação muscular consistentes.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Rotina regular, exposição à luz natural pela manhã, alimentação leve no período noturno e gestão do estresse ajudam a preservar esse padrão.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Manter horários estáveis, reduzir telas 60 minutos antes de dormir e preservar jantares leves ricos em triptofano e magnésio.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Faça uma avaliação preventiva para confirmar se marcadores hormonais e de bem-estar seguem alinhados e receba sugestões personalizadas para continuar evoluindo.'
    },
    sonoLevementePrejudicado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Há sinais de fadiga acumulada e sono moderadamente prejudicado, impactando produtividade e disposição ao longo do dia.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Cafeína tarde da noite, telas antes de dormir, horários irregulares e alto nível de estresse podem estar fragmentando o sono.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Readequar cafeína para antes das 15h, implementar rotina de higiene do sono, organizar jantares mais leves e inserir pequenas pausas de respiração ao longo do dia.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende uma consulta para receber protocolos personalizados (luz, alimentação, micronutrientes) e reavaliar energia após 7–14 dias de ajustes.'
    },
    sonoComprometido: {
      diagnostico:
        '📋 DIAGNÓSTICO: O descanso está seriamente comprometido, indicando privação crônica de sono com impacto metabólico, emocional e hormonal.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Falta de horário fixo, trabalho noturno, estresse elevado e alimentação tardia mantêm o sistema nervoso em alerta e dificultam a entrada em sono profundo.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Criar agenda rígida para dormir e acordar, reduzir exposição a telas e luz azul, implementar técnicas de relaxamento e reorganizar refeições noturnas sob supervisão.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Inicie acompanhamento de bem-estar e comportamental para restabelecer o sono, avaliar necessidade de exames e estruturar um plano completo de recuperação de energia.'
    }
  }
}
