/**
 * DIAGNÓSTICOS: Quiz de Bem-Estar - ÁREA NUTRI
 */

import { DiagnosticosPorFerramenta } from '../types'

export const quizBemEstarDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    bemEstarBaixo: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está comprometido por desequilíbrios nutricionais que precisam de intervenção personalizada',
      causaRaiz: '🔍 CAUSA RAIZ: Deficiências nutricionais podem estar afetando sua energia, humor e qualidade de vida. Estudos indicam que 73% das pessoas com bem-estar baixo têm carências de nutrientes essenciais sem perceber. Uma avaliação completa identifica exatamente o que está faltando e como isso impacta sua rotina'
      acaoImediata: 'Observe seus níveis de energia, sono e disposição.
Busque avaliação profissional para identificar e corrigir possíveis desequilíbrios.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu organismo já deu o primeiro sinal. Agora é hora de transformar esse diagnóstico em ação — personalize seu plano e veja resultados reais.'
    }
    bemEstarModerado: {
      diagnostico: '📋 DIAGNÓSTICO: Seu bem-estar está bom, mas pode ser otimizado com ajustes nutricionais estratégicos e personalizados',
      causaRaiz: '🔍 CAUSA RAIZ: Boa base nutricional estabelecida, porém pode faltar micronutrientes específicos para elevar seu bem-estar. Pesquisas mostram que otimizações nutricionais podem aumentar vitalidade em até 40%. Uma análise detalhada identifica exatamente o que pode fazer a diferença'
      acaoImediata: 'Reflita sobre sua rotina e como ela afeta seu bem-estar.
Pequenos ajustes com orientação profissional podem gerar grande diferença.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Seu corpo está pedindo equilíbrio — e você já deu o primeiro passo. O próximo é descobrir o que ele realmente precisa para evoluir.'
    }
    bemEstarAlto: {
      diagnostico: '📋 DIAGNÓSTICO: Excelente bem-estar! Mantenha com nutrição preventiva e estratégias avançadas de performance',
      causaRaiz: '🔍 CAUSA RAIZ: Ótima base nutricional e hábitos saudáveis estabelecidos. Estratégias preventivas avançadas ajudam a preservar essa condição ideal e evoluir para níveis ainda superiores. Uma avaliação preventiva identifica oportunidades específicas para você'
      acaoImediata: 'Mantenha sua rotina equilibrada e o cuidado com o corpo.
Avaliações periódicas ajudam a sustentar resultados a longo prazo.',
      proximoPasso: '🎯 PRÓXIMO PASSO: Parabéns! Seu equilíbrio atual é um ótimo ponto de partida. Descubra como estratégias avançadas podem potencializar ainda mais seus resultados.'
    }
  }
}
