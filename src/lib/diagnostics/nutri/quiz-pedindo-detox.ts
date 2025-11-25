/**
 * DIAGNÓSTICOS: Seu corpo está pedindo Detox? - ÁREA NUTRI
 *
 * Diagnósticos criados para traduzir sinais de sobrecarga de toxinas
 * em planos personalizados conduzidos por profissional de nutriçãos.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizPedindoDetoxDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    corpoEquilibrado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu corpo mostra equilíbrio metabólico e não apresenta sinais relevantes de acúmulo de toxinas.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Hidratação consistente, consumo baixo de ultraprocessados e rotina de sono organizada preservam os sistemas naturais de detox.',
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Mantenha sua rotina equilibrada e hábitos preventivos. Observe sinais do corpo e continue com constância.',
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Realize uma avaliação preventiva para confirmar marcadores hepáticos e intestinais e receber um plano de manutenção supervisionado.'
    },
    sinaisLevesToxinas: {
      diagnostico:
        '📋 DIAGNÓSTICO: Existem sinais leves de sobrecarga, como cansaço, inchaço e digestão lenta, indicando necessidade de um detox guiado.',
      causaRaiz:
        '🔍 CAUSA RAIZ: Picos de açúcar, álcool, preparo improvisado das refeições e alto estresse podem desacelerar a eliminação natural de toxinas.'
      acaoImediata:
        'Observe sinais de retenção ou cansaço leve.
Pequenos ajustes guiados por profissional podem apoiar detox de forma segura.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende uma mini avaliação detox para receber um plano personalizado com ajustes progressivos e monitoramento semanal.'
    }
    corpoPedindoDetox: {
      diagnostico:
        '📋 DIAGNÓSTICO: O organismo envia sinais claros de sobrecarga de toxinas, exigindo intervenção personalizada e supervisão profissional.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Estresse crônico, sono inadequado, álcool frequente, medicamentos e inflamação intestinal dificultam a detoxificação endógena.'
      acaoImediata:
        'Busque avaliação profissional antes de iniciar qualquer protocolo detox.
Estratégias individualizadas garantem segurança e eficácia.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Marque uma consulta nutricional para construir um plano detox completo com fases de reparo intestinal, suporte hepático e acompanhamento contínuo.'
    }
  }
}
