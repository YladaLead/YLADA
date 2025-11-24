/**
 * DIAGNÓSTICOS: Qual é seu perfil de intestino? - ÁREA COACH
 *
 * Conteúdo 100% direcionado para nutricionistas que conduzem
 * avaliações de funcionamento intestinal e microbiota.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const perfilIntestinoDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    intestinoEquilibrado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu funcionamento intestinal está equilibrado, com boa digestão, evacuações regulares e ausência de sinais inflamatórios relevantes.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Rotina alimentar organizada, ingestão adequada de fibras, hidratação consistente e microbiota estável sustentam esse cenário positivo.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Manter hábitos atuais, reforçando alimentos in natura, fibras variadas e exposição matinal à luz natural para preservar a saúde intestinal.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende uma avaliação digestiva preventiva para confirmar se todos os marcadores permanecem dentro do ideal e receber orientações personalizadas de manutenção.'
    }
    intestinoSensivel: {
      diagnostico:
        '📋 DIAGNÓSTICO: Há sinais de intestino preso ou sensível, com pequenas alterações no ritmo e indícios de fermentação excessiva.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Oscilações de fibras, baixa hidratação, rotina alimentar irregular e possíveis desequilíbrios leves da microbiota podem explicar os sintomas.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Ajustar consumo de fibras solúveis, incluir alimentos prebióticos, fracionar melhor as refeições e aumentar hidratação ao longo do dia.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Solicite uma análise de bem-estar completa para mapear intolerâncias, definir uso de probióticos específicos e alinhar um protocolo de restauração intestinal sob acompanhamento profissional.'
    }
    disbioseIntestinal: {
      diagnostico:
        '📋 DIAGNÓSTICO: Os sinais apontam para disbiose intestinal com provável inflamação, produção irregular de ácidos graxos e comprometimento da absorção de nutrientes.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Desequilíbrio importante da microbiota, excesso de processados, estresse e possíveis deficiências de fibras e compostos bioativos sustentam o quadro.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Suspender gatilhos inflamatórios (açúcar, ultraprocessados, álcool), priorizar alimentos calmantes para o intestino e iniciar protocolo de reparo guiado por Coach de bem-estar.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Marque uma consulta de bem-estar para elaborar um plano de restauração intestinal, com testes específicos, ajustes graduais e acompanhamento próximo da resposta do organismo.'
    }
  }
}
