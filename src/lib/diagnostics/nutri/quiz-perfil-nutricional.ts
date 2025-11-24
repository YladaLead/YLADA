/**
 * DIAGNÓSTICOS: Quiz Perfil Nutricional - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizPerfilNutricionalDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    absorcaoBaixa: {
      diagnostico: '📋 DIAGNÓSTICO: Dificuldades de absorção que precisam de intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Problemas digestivos ou inflamação podem estar reduzindo a absorção de nutrientes. Estudos indicam que 60% das pessoas com absorção baixa têm condições digestivas não identificadas. Uma avaliação completa identifica exatamente a origem e como reverter'
      acaoImediata: 'Observe sinais como cansaço ou digestão lenta.
Busque avaliação profissional para entender e corrigir possíveis falhas de absorção.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo precisa de cuidado agora — e é totalmente possível reverter com apoio profissional especializado.'
    }
    absorcaoModerada: {
      diagnostico: '📋 DIAGNÓSTICO: Boa base digestiva, mas pode ser otimizada com estratégias personalizadas',
      causaRaiz: '🔍 CAUSA RAIZ: Boa digestão estabelecida, mas timing e combinações podem ser refinados. Pesquisas mostram que otimizações estratégicas podem aumentar absorção em até 30%. Uma análise detalhada mostra exatamente onde ganhar eficiência'
      acaoImediata: 'Reflita sobre sua rotina alimentar e digestiva.
Pequenos ajustes com orientação profissional podem otimizar sua absorção.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Esse é o primeiro passo. O próximo é descobrir como seu corpo pode responder a estratégias avançadas de absorção.'
    }
    absorcaoOtimizada: {
      diagnostico: '📋 DIAGNÓSTICO: Sistema digestivo funcionando bem; estratégias avançadas podem potencializar ainda mais',
      causaRaiz: '🔍 CAUSA RAIZ: Sistema digestivo saudável e eficiente. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis superiores. Uma avaliação preventiva identifica oportunidades específicas'
      acaoImediata: 'Mantenha seus hábitos e atenção ao corpo.
Avaliações regulares ajudam a preservar o bom desempenho nutricional.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio digestivo é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.'
    }
  }
}
