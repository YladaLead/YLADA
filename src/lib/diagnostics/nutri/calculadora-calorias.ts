/**
 * DIAGNÓSTICOS: Calculadora Calorias - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraCaloriasDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    deficitCalorico: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de déficit calórico para emagrecimento controlado e sustentável',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico acima do gasto energético diário. Pesquisas mostram que pequenas reduções de 300-500 calorias por dia resultam em perda de 0.5-1kg por semana, de forma segura. Uma avaliação nutricional identifica exatamente onde ajustar calorias sem comprometer massa muscular e nutrição adequada',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Reduza gradualmente 300-500 calorias por dia. Busque avaliação nutricional para um plano personalizado que preserve massa muscular e garanta nutrição adequada durante o processo',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pronto para mudança — descubra em minutos como criar um déficit calórico personalizado que preserva sua massa muscular e garante resultados sustentáveis.'
    },
    manutencaoCalorica: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão calórica está equilibrada, mantenha o padrão e considere otimizações na qualidade nutricional',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico adequado para manutenção do peso atual estabelecido. Pesquisas mostram que otimizações na qualidade nutricional, mesmo mantendo calorias, podem melhorar composição corporal e saúde metabólica. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize qualidade nutricional, distribuindo macronutrientes estrategicamente. Considere avaliação preventiva para identificar melhorias na composição da dieta',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio calórico está adequado. Descubra como otimizações na qualidade nutricional podem potencializar ainda mais sua saúde e composição corporal.'
    },
    superavitCalorico: {
      diagnostico: '📋 DIAGNÓSTICO: Você precisa de superávit calórico para ganho de peso saudável e massa muscular',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo calórico abaixo do necessário para ganho de massa. Estudos indicam que superávit de 300-500 calorias por dia, combinado com treino adequado, pode resultar em ganho de 0.25-0.5kg de massa muscular por mês. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente gradualmente 300-500 calorias por dia com alimentos densos nutricionalmente. Busque avaliação nutricional para um plano personalizado que priorize ganho de massa muscular de forma saudável',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pronto para crescer — descubra em minutos como criar um superávit calórico personalizado que maximiza ganho de massa muscular de forma saudável.'
    }
  }
