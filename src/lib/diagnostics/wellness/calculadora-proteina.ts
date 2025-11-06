/**
 * DIAGNÓSTICOS: Calculadora de Proteína - ÁREA WELLNESS
 * 
 * Copiado de Nutri - pode ser personalizado depois
 */

import { DiagnosticosPorFerramenta } from '../types'

export const calculadoraProteinaDiagnosticos: DiagnosticosPorFerramenta = {
  wellness: {
    baixaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está abaixo do recomendado, o que pode afetar massa muscular, recuperação e saciedade',
      causaRaiz: '🔍 CAUSA RAIZ: Consumo insuficiente de alimentos proteicos ou planejamento inadequado das refeições. Estudos indicam que 70% das pessoas que treinam consomem menos proteína do que precisam para otimizar resultados. Uma avaliação nutricional identifica exatamente qual é sua necessidade real e como alcançá-la',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Aumente proteínas em todas as refeições principais. Busque avaliação nutricional para um plano personalizado que distribua proteína ao longo do dia de forma estratégica',
      plano7Dias: '📅 PLANO 7 DIAS: Protocolo proteico inicial com 1.2-1.6g/kg de peso corporal, distribuído em 4-5 refeições, ajustado conforme sua resposta individual',
      suplementacao: '💊 SUPLEMENTAÇÃO: A necessidade só é definida após avaliação completa. Whey protein pode ser considerado, mas sempre de acordo com a individualidade biológica e em doses adequadas',
      alimentacao: '🍎 ALIMENTAÇÃO: Aumente carnes magras, ovos, leguminosas e laticínios de forma estratégica. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo precisa de proteína adequada para resultados — descubra em minutos como otimizar sua ingestão proteica com um plano personalizado.'
    },
    proteinaNormal: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está adequada, mantenha o padrão e considere otimizações estratégicas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa distribuição proteica ao longo do dia estabelecida. Pesquisas mostram que otimizações de timing podem aumentar síntese proteica em até 25%. Uma análise nutricional identifica oportunidades específicas para você',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha consumo atual e otimize timing das refeições proteicas. Considere avaliação para identificar oportunidades de melhoria na distribuição',
      plano7Dias: '📅 PLANO 7 DIAS: Manutenção com distribuição equilibrada, ajustada conforme seu perfil metabólico e objetivos pessoais',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação preventiva identifica se você se beneficia de suporte adicional. Multivitamínico e ômega-3 costumam ser considerados, mas apenas após análise do seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Mantenha padrão atual com foco em qualidade proteica. Um plano otimizado considera combinações específicas para maximizar absorção conforme seu perfil',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu consumo proteico está adequado. Descubra como estratégias avançadas de timing podem potencializar ainda mais seus resultados.'
    },
    altaProteina: {
      diagnostico: '📋 DIAGNÓSTICO: Sua ingestão proteica está elevada, o que pode ser otimizada para máximo benefício com menor sobrecarga',
      causaRaiz: '🔍 CAUSA RAIZ: Ingestão proteica acima do necessário pode não trazer benefícios adicionais. Estudos mostram que acima de 2.2g/kg há pouco ganho adicional. Uma avaliação nutricional identifica se está dentro da faixa ideal ou pode ser ajustada',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha proteína em nível adequado (1.6-2.0g/kg) e redistribua calorias para outros nutrientes essenciais. Considere avaliação para otimização do plano',
      plano7Dias: '📅 PLANO 7 DIAS: Otimização com redistribuição nutricional balanceada, ajustada conforme seu perfil metabólico e objetivos',
      suplementacao: '💊 SUPLEMENTAÇÃO: Uma avaliação identifica se você realmente precisa de suplementação adicional. O protocolo é personalizado conforme seu caso',
      alimentacao: '🍎 ALIMENTAÇÃO: Otimize distribuição proteica e diversifique outros nutrientes. Um plano personalizado ajusta quantidades e combinações ideais para você',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como otimizar sua nutrição de forma completa e equilibrada com apoio personalizado.'
    }
  }
}

