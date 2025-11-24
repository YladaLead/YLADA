/**
 * DIAGNÓSTICOS: Quiz Interativo - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizInterativoDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    metabolismoLento: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo está em modo de economia energética, sinalizando necessidade de revitalização personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Falta de nutrientes essenciais e horários irregulares de refeições podem estar reduzindo sua energia e disposição. Estudos indicam que 68% das pessoas com metabolismo lento apresentam carências nutricionais não identificadas. Uma avaliação completa identifica exatamente onde está o desequilíbrio'
      acaoImediata: 'Observe seu nível de energia e ritmo diário.
Evite auto-suplementação e busque avaliação para definir ajustes seguros.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu metabolismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — descubra em minutos como seu corpo pode responder a um plano personalizado.'
    }
    metabolismoEquilibrado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo está estável com potencial de otimização estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base metabólica estabelecida. Pesquisas mostram que pequenos ajustes nutricionais podem elevar a eficiência metabólica em até 15%. Uma análise detalhada mostra exatamente onde ganhar performance'
      acaoImediata: 'Mantenha seus hábitos e observe como o corpo responde.
Pequenos ajustes com orientação profissional podem potencializar seus resultados.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como estratégias avançadas podem potencializar ainda mais sua eficiência metabólica.'
    }
    metabolismoAcelerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu metabolismo rápido precisa de estabilização estratégica',
      causaRaiz: '🔍 CAUSA RAIZ: Alta queima calórica pode causar desequilíbrios e fadiga quando não há reposição adequada. Uma avaliação completa identifica exatamente como sustentar energia sem oscilações'
      acaoImediata: 'Observe sinais de cansaço ou fome frequente.
Busque orientação profissional para equilibrar energia e rotina alimentar.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo estabilização — e você já deu o primeiro passo. O próximo é descobrir como manter energia consistente com apoio personalizado.'
    }
  }
}
