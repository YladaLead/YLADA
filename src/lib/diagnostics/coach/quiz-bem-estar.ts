/**
 * DIAGNÓSTICOS: Quiz de Bem-Estar - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizBemEstarDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    bemEstarBaixo: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Estudos indicam que 73% das pessoas com bem-estar baixo têm carências de nutrientes essenciais sem perceber. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina',
      acaoImediata: '⚡ AÇÃO IMEDIATA: Busque uma avaliação de bem-estar para receber um protocolo seguro e adequado ao seu perfil. Evite auto-suplementação — cada organismo responde de forma única',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — personalize seu plano e veja resultados reais.'
    },
    bemEstarModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base de bem-estar estabelecida, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Mantenha hábitos atuais e considere uma consulta para identificar oportunidades de otimização. Às vezes pequenos ajustes feitos de forma personalizada geram grandes melhorias',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.'
    }
    bemEstarAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com bem-estar preventiva e estratégias avançadas de performance',
      causaRaiz: '🔍 CAUSA RAIZ: Ótima base de bem-estar e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Continue a rotina atual e considere uma avaliação preventiva para introduzir estratégias de bem-estar avançadas que sustentam resultados a longo prazo',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.'
    }
  }
}
