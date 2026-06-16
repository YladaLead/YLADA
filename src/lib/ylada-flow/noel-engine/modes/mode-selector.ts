// =====================================================
// NOEL - SELETOR DE MODOS DE OPERAÇÃO
// Seleciona o modo apropriado baseado no contexto
// =====================================================

import type { NoelOperationMode, TipoInteracao, WellnessInteractionContext } from '@/types/wellness-system'
import { operationModes } from './operation-modes'

/**
 * Seleciona o modo de operação apropriado baseado no contexto
 */
export function selecionarModo(contexto: {
  tipo_interacao: TipoInteracao
  contexto: WellnessInteractionContext
  mensagem: string
  palavras_chave: string[]
}): NoelOperationMode {
  const { tipo_interacao, contexto: ctx, mensagem, palavras_chave } = contexto

  // Regras de seleção baseadas em palavras-chave e contexto

  // RECRUTAMENTO: Detecta interesse em negócio
  if (
    palavras_chave.some(k => ['negócio', 'renda', 'oportunidade', 'projeto', 'hom'].includes(k.toLowerCase())) ||
    mensagem.match(/renda extra|oportunidade|negócio|projeto/i)
  ) {
    return 'recrutamento'
  }

  // REATIVAÇÃO: Cliente inativo ou que sumiu
  if (
    palavras_chave.some(k => ['sumiu', 'inativo', 'parou', 'desistiu'].includes(k.toLowerCase())) ||
    ctx.cliente_id && palavras_chave.includes('reativar')
  ) {
    return 'reativacao'
  }

  // UPSELL: Cliente já comprou e está satisfeito
  if (
    palavras_chave.some(k => ['turbo', 'hype', 'rotina', 'mensal'].includes(k.toLowerCase())) ||
    (ctx.cliente_id && mensagem.match(/quero mais|próximo passo|evoluir/i))
  ) {
    return 'upsell'
  }

  // ACOMPANHAMENTO: Check-in ou follow-up
  if (
    tipo_interacao === 'acompanhamento' ||
    palavras_chave.some(k => ['acompanhar', 'seguir', 'check-in', 'como está'].includes(k.toLowerCase()))
  ) {
    return 'acompanhamento'
  }

  // DIAGNÓSTICO: Entender necessidade
  if (
    tipo_interacao === 'diagnostico' ||
    palavras_chave.some(k => ['diagnóstico', 'entender', 'analisar', 'o que precisa'].includes(k.toLowerCase())) ||
    !ctx.objetivo // Sem objetivo definido = precisa diagnosticar
  ) {
    return 'diagnostico'
  }

  // SUPORTE: Problema ou desânimo
  if (
    palavras_chave.some(k => ['problema', 'dificuldade', 'desanimado', 'não consigo', 'ajuda'].includes(k.toLowerCase())) ||
    mensagem.match(/não consigo|não sei|ajuda|problema/i)
  ) {
    return 'suporte'
  }

  // TREINAMENTO: Pedido de aprendizado
  if (
    tipo_interacao === 'solicitacao_script' ||
    palavras_chave.some(k => ['como fazer', 'ensinar', 'aprender', 'treinar'].includes(k.toLowerCase()))
  ) {
    return 'treinamento'
  }

  // OBJEÇÃO: Tratamento de objeção
  if (
    tipo_interacao === 'objeção' ||
    palavras_chave.some(k => ['objeção', 'não quer', 'caro', 'pensar'].includes(k.toLowerCase()))
  ) {
    return 'suporte' // Objeções são tratadas no modo suporte
  }

  // VENDA: Default para conversas de venda
  if (
    ctx.objetivo || // Tem objetivo definido = venda
    palavras_chave.some(k => ['vender', 'kit', 'produto', 'oferta'].includes(k.toLowerCase()))
  ) {
    return 'venda'
  }

  // Default: suporte (modo mais seguro)
  return 'suporte'
}

/**
 * Valida se o modo selecionado é apropriado para o contexto
 */
export function validarModo(
  modo: NoelOperationMode,
  contexto: WellnessInteractionContext
): {
  valido: boolean
  motivo?: string
  sugestao?: NoelOperationMode
} {
  // Validação específica para recrutamento
  if (modo === 'recrutamento') {
    // Verificar se não está mencionando PV (viola regra fundamental)
    // Esta validação será feita na construção da resposta
  }

  // Validação para upsell: precisa ter cliente ativo
  if (modo === 'upsell' && !contexto.cliente_id) {
    return {
      valido: false,
      motivo: 'Upsell requer cliente identificado',
      sugestao: 'diagnostico'
    }
  }

  // Validação para reativação: precisa ter cliente ou lead
  if (modo === 'reativacao' && !contexto.cliente_id && !contexto.prospect_id) {
    return {
      valido: false,
      motivo: 'Reativação requer cliente ou prospect identificado',
      sugestao: 'diagnostico'
    }
  }

  return { valido: true }
}

/**
 * Obtém a descrição e ações típicas de um modo
 */
export function getModoInfo(modo: NoelOperationMode) {
  return operationModes[modo]
}





