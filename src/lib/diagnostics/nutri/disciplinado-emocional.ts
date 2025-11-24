/**
 * DIAGNÓSTICOS: Você é mais disciplinado ou emocional com a comida? - ÁREA NUTRI
 *
 * Categoriza o comportamento alimentar em quatro perfis para orientar a nutricionista.
 */

import { DiagnosticosPorFerramenta } from '../types'

export const disciplinadoEmocionalDiagnosticos: DiagnosticosPorFerramenta = {
  nutri: {
    perfilDisciplinado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu perfil é predominantemente disciplinado. Você mantém planejamento mesmo em dias corridos e consegue diferenciar fome física de vontade de comer.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Pessoas disciplinadas costumam ter repertório de escolhas, rotina estruturada e compreensão dos sinais do corpo. Ainda assim, pequenas rigidez podem gerar gatilhos em eventos sociais ou viagens.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Consolidar a rotina com estratégias de flexibilidade inteligente para não perder consistência quando a agenda muda.',
        '📅 PLANO 7 DIAS: Ajustar distribuição de macros, revisar janelas de refeições e inserir “buffers” inteligentes (lanches estratégicos, lista de substituições).',
        '💊 SUPLEMENTAÇÃO: Avaliação individual orienta o uso de adaptógenos leves ou suporte metabólico para performance/recuperação, sempre sob supervisão.',
        '🍎 ALIMENTAÇÃO: Plano personalizado com refeições âncora, kits de emergência e indicações para eventos sociais, mantendo autonomia.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Marque a consulta para transformar sua disciplina em resultados sustentáveis com flexibilidade planejada.'
    }
    perfilEquilibrado: {
      diagnostico:
        '📋 DIAGNÓSTICO: Você está no meio-termo entre disciplina e emoção. Consegue seguir planos, mas oscila quando o dia sai do roteiro.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Falta de estrutura clara em horários críticos, aliada a gatilhos emocionais leves, faz você alternar períodos “100%” com “descompasso”.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Implementar rituais curtos (check-ins de energia/fome) e preparar opções práticas antes dos momentos vulneráveis.',
        '📅 PLANO 7 DIAS: Diário rápido para mapear gatilhos, plano alimentar modular e combinação de estratégias de saciedade/hábito.',
        '💊 SUPLEMENTAÇÃO: Avaliação profissional define se precisa de suporte para estresse, sono ou controle de apetite.',
        '🍎 ALIMENTAÇÃO: Montagem de refeições escaláveis (simples x completas) e roteiro para dias atípicos.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Em consulta, alinhamos um protocolo híbrido (razão + emoção) para você manter constância sem radicalismos.'
    }
    perfilEmocional: {
      diagnostico:
        '📋 DIAGNÓSTICO: Seu comportamento alimentar é guiado majoritariamente por emoções (ansiedade, recompensa, cansaço).'
      causaRaiz:
        '🔍 CAUSA RAIZ: Comer sem fome física, pular refeições e buscar conforto na comida indicam falta de estratégias emocionais paralelas ao plano nutricional.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Criar alternativas de regulação emocional (respiração, pausa consciente, substitutos simbólicos) antes de acessar alimentos de escape.',
        '📅 PLANO 7 DIAS: Roteiro com refeições âncora, lanches de urgência, protocolo SOS para episódios emocionais e registro simples de gatilho → resposta.',
        '💊 SUPLEMENTAÇÃO: Somente após avaliação profissional; pode incluir magnésio, adaptógenos ou suporte ansiolítico leve quando indicado.',
        '🍎 ALIMENTAÇÃO: Plano acolhedor com alimentos de conforto em versões equilibradas e combinados que promovem saciedade hormonal.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Junto com a nutricionista, você constrói uma estratégia integrada (alimentação + emoções) para retomar o controle com acolhimento.'
    }
    perfilImpulsivo: {
      diagnostico:
        '📋 DIAGNÓSTICO: Há forte impulsividade alimentar. Decisões acontecem “no automático”, sem planejamento, gerando arrependimento posterior.'
      causaRaiz:
        '🔍 CAUSA RAIZ: Agenda caótica, ausência de preparo prévio e “tudo ou nada” são gatilhos típicos. Falta estrutura e suporte para momentos de baixa energia.'
      acaoImediata:
        '⚡ AÇÃO IMEDIATA: Construir micro-hábitos (checklists de bolso, kits prontos, alarmes) para interromper o ciclo de impulsividade.',
        '📅 PLANO 7 DIAS: Planejamento guiado pela nutricionista com refeições pré-definidas, lista curta de escolhas seguras e acompanhamento diário.',
        '💊 SUPLEMENTAÇÃO: Avaliação profissional define uso de compostos para foco/energia estável (B-complex, adaptógenos) quando necessário.',
        '🍎 ALIMENTAÇÃO: Montar “menu piloto” com opções rápidas e nutritivas + protocolo para imprevistos, reduzindo decisões sob pressão.'
      proximoPasso:
        '🎯 PRÓXIMO PASSO: Agende acompanhamento para transformar impulsos em escolhas estratégicas com suporte 1:1.'
    }
  }
}
