// =====================================================
// NOEL - PROCESSO DE RACIOCÍNIO INTERNO
// Baseado na Lousa 1 do Prompt-Mestre
// =====================================================

import type { WellnessInteractionContext, TipoInteracao } from '@/types/wellness-system'

/**
 * Ordem de raciocínio do NOEL (9 passos)
 */
export const ordemRaciocínio = [
  '1. Identificar tipo de interação',
  '2. Entender contexto e necessidade',
  '3. Selecionar modo de operação',
  '4. Detectar objeções (se houver)',
  '5. Escolher script apropriado',
  '6. Adaptar script ao contexto',
  '7. Validar regras fundamentais',
  '8. Construir resposta estruturada',
  '9. Sugerir próxima ação'
]

/**
 * Processa uma mensagem do distribuidor e retorna o contexto de raciocínio
 */
export function processarMensagem(
  mensagem: string,
  contextoExistente?: WellnessInteractionContext
): {
  tipo_interacao: TipoInteracao
  contexto: WellnessInteractionContext
  palavras_chave: string[]
  intencao: string
} {
  const palavras_chave: string[] = []
  let tipo_interacao: TipoInteracao = 'pergunta'
  let intencao = 'geral'

  // Detectar tipo de interação
  if (mensagem.match(/script|mensagem|texto|o que dizer/i)) {
    tipo_interacao = 'solicitacao_script'
    palavras_chave.push('script')
  } else if (mensagem.match(/objeção|dificuldade|problema|não quer/i)) {
    tipo_interacao = 'objeção'
    palavras_chave.push('objeção')
  } else if (mensagem.match(/como está|acompanhar|seguir/i)) {
    tipo_interacao = 'acompanhamento'
    palavras_chave.push('acompanhamento')
  } else if (mensagem.match(/diagnóstico|entender|analisar/i)) {
    tipo_interacao = 'diagnostico'
    palavras_chave.push('diagnóstico')
  }

  // Detectar palavras-chave de contexto
  if (mensagem.match(/energia|disposição|cansado/i)) {
    palavras_chave.push('energia')
    intencao = 'energia'
  } else if (mensagem.match(/metabolismo|acelerar|queimar/i)) {
    palavras_chave.push('metabolismo')
    intencao = 'metabolismo'
  } else if (mensagem.match(/retenção|inchado|inchaço/i)) {
    palavras_chave.push('retenção')
    intencao = 'retenção'
  } else if (mensagem.match(/foco|concentração|clareza/i)) {
    palavras_chave.push('foco')
    intencao = 'foco'
  }

  // Detectar tipo de pessoa
  if (mensagem.match(/amigo|próximo|conhecido/i)) {
    palavras_chave.push('pessoa_proxima')
  } else if (mensagem.match(/indicação|indicou|me indicou/i)) {
    palavras_chave.push('indicacao')
  } else if (mensagem.match(/instagram|story|curtiu/i)) {
    palavras_chave.push('instagram')
  }

  // Construir contexto
  const contexto: WellnessInteractionContext = {
    ...contextoExistente,
    objetivo: intencao as any,
    pessoa_tipo: palavras_chave.includes('pessoa_proxima')
      ? 'proximo'
      : palavras_chave.includes('indicacao')
      ? 'indicacao'
      : palavras_chave.includes('instagram')
      ? 'instagram'
      : undefined
  }

  return {
    tipo_interacao,
    contexto,
    palavras_chave,
    intencao
  }
}

/**
 * Framework de decisão do NOEL
 */
export function tomarDecisao(contexto: {
  tipo_interacao: TipoInteracao
  contexto: WellnessInteractionContext
  palavras_chave: string[]
}): {
  modo_operacao: string
  prioridade: 'alta' | 'media' | 'baixa'
  acao_imediata: string
} {
  let modo_operacao = 'suporte'
  let prioridade: 'alta' | 'media' | 'baixa' = 'media'
  let acao_imediata = 'responder com empatia'

  // Decidir modo de operação
  if (contexto.palavras_chave.includes('objeção')) {
    modo_operacao = 'suporte'
    prioridade = 'alta'
    acao_imediata = 'tratar objeção com Premium Light Copy'
  } else if (contexto.tipo_interacao === 'solicitacao_script') {
    modo_operacao = 'venda'
    prioridade = 'alta'
    acao_imediata = 'fornecer script contextual'
  } else if (contexto.tipo_interacao === 'acompanhamento') {
    modo_operacao = 'acompanhamento'
    prioridade = 'media'
    acao_imediata = 'fornecer script de acompanhamento'
  }

  return {
    modo_operacao,
    prioridade,
    acao_imediata
  }
}





