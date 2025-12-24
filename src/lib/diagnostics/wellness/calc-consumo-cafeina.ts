/**
 * DIAGNÓSTICOS: Calculadora Consumo de Cafeína - ÁREA WELLNESS
 * 
 * Focado em identificar necessidade de Hype Drink como alternativa ao café
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calcConsumoCafeinaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    consumoAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Seu consumo de cafeína está elevado e pode estar causando dependência',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo excessivo de cafeína pode gerar dependência, ansiedade e quedas bruscas de energia. Alternativas com cafeína natural e dosagem controlada podem ajudar a equilibrar o consumo',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ser uma alternativa mais equilibrada ao café excessivo. Ele combina cafeína natural, vitaminas e hidratação em uma solução prática',
      plano7Dias: '📅 PLANO 7 DIAS: Substitua parte do seu consumo de café pelo Hype Drink. Ele pode ajudar a manter energia mais estável ao longo do dia',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural (chá verde e preto), vitaminas do complexo B e hidratação. Ele pode ser uma alternativa mais equilibrada ao café excessivo',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina, especialmente para manter energia mais estável',
      proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode ajudar a equilibrar seu consumo de cafeína. Quer experimentar?'
    },
    consumoModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu consumo de cafeína está moderado, mas pode ser otimizado',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo moderado de cafeína pode ser otimizado com alternativas que oferecem cafeína natural junto com outros benefícios como vitaminas e hidratação',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ajudar a distribuir melhor a cafeína ao longo do dia, combinando com vitaminas e hidratação',
      plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink como complemento ao seu café. Ele pode ajudar a manter energia mais estável',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink combina cafeína natural, vitaminas do complexo B e hidratação. Ele pode otimizar seu consumo de cafeína',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode otimizar seu consumo de cafeína. Quer experimentar?'
    },
    consumoBaixo: {
      diagnostico: '📋 DIAGNÓSTICO: Seu consumo de cafeína está baixo. O Hype Drink pode ser uma boa opção',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo baixo de cafeína pode ser aumentado de forma equilibrada com o Hype Drink, que oferece cafeína natural junto com vitaminas e hidratação',
      acaoImediata: '⚡ AÇÃO IMEDIATA: O Hype Drink pode ajudar a aumentar energia e foco de forma equilibrada, com cafeína natural e dosagem controlada',
      plano7Dias: '📅 PLANO 7 DIAS: Use o Hype Drink pela manhã ou nos momentos de maior necessidade. Ele pode ajudar a aumentar energia e foco',
      suplementacao: '💊 SUPLEMENTAÇÃO: O Hype Drink oferece cafeína natural com dosagem controlada, ideal para quem não consome muito café',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha uma alimentação equilibrada. O Hype Drink pode complementar sua rotina',
      proximoPasso: '🎯 PRÓXIMO PASSO: O Hype Drink pode ajudar a aumentar sua energia e foco. Quer experimentar?'
    }
  }
}

