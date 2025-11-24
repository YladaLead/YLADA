/**
 * DIAGNÓSTICOS: Story Interativo - ÁREA COACH
 */

import { DiagnosticosPorFerramenta } from '../types'

export const storyInterativoDiagnosticos: DiagnosticosPorFerramenta = {
  coach: {
    engajamentoBasico: {
      diagnostico: '📱 DIAGNÓSTICO: Stories básicos e consistentes podem aumentar seu engajamento inicial com conteúdo prático e visual',
      causaRaiz: '🔍 CAUSA RAIZ: Publicações simples com gatilhos claros (perguntas, enquetes, antes/depois) geram interação rápida. Estudos de social media indicam que stories com CTA único e visual limpo elevam respostas em até 30% para perfis iniciantes'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Publique 3 stories sequenciais: 1) Dor comum do público, 2) Dica prática, 3) CTA de resposta/DM',
      proximoPasso: '🎯 PRÓXIMO PASSO: Estruture seus stories com roteiro de 3 passos e um CTA simples. Evolua para formatos moderados após 7 dias.'
    }
    engajamentoModerado: {
      diagnostico: '📱 DIAGNÓSTICO: Stories moderados com narrativa e prova social elevam cliques e respostas qualificadas',
      causaRaiz: '🔍 CAUSA RAIZ: Narrativas curtas (problema → caminho → resultado) com elementos interativos aumentam tempo de retenção. Perfis intermediários performam melhor com agenda temática e CTAs segmentados'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Use roteiro de 5 telas: dor → mito → micro-aula (1 dica) → prova/print → CTA para formulário/DM',
      proximoPasso: '🎯 PRÓXIMO PASSO: Adote calendário fixo (ex.: 2ª mito, 4ª checklist, 6ª prova) e mensure respostas/DMs por tema.'
    }
    engajamentoAvancado: {
      diagnostico: '📱 DIAGNÓSTICO: Stories avançados com hooks fortes e trilhas temáticas geram picos de conversão',
      causaRaiz: '🔍 CAUSA RAIZ: Gatilhos de autoridade + prova + antecipação elevam conversões. Sequências de 6-8 telas com storytelling e CTA direto para captura aumentam leads qualificados'
      acaoImediata: '⚡ AÇÃO IMEDIATA: Roteiro de 7 telas: hook → dor → autoridade → prova → micro-aula → oferta de valor (PDF/checklist) → CTA link/DM',
      proximoPasso: '🎯 PRÓXIMO PASSO: Integre tracking de métricas (visualizações por tela e replies) e faça testes A/B de hooks e CTAs.'
    }
  }
}
