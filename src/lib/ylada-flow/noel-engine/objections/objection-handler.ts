// =====================================================
// NOEL - HANDLER DE OBJEÇÕES
// Trata objeções e retorna respostas apropriadas
// =====================================================

import type { WellnessObjeção, ScriptVersao } from '@/types/wellness-system'
import * as objectionMatcher from './objection-matcher'

/**
 * Interface para resultado do tratamento de objeção
 */
export interface ObjeçãoHandlerResult {
  objeção: WellnessObjeção | null
  resposta: string
  versao_usada: 'curta' | 'media' | 'longa'
  gatilho_retomada?: string
  upgrade?: string
}

/**
 * Seleciona a versão apropriada da resposta à objeção
 */
function selecionarVersaoResposta(
  objeção: WellnessObjeção,
  contexto: {
    urgencia?: 'alta' | 'media' | 'baixa'
    tempo_disponivel?: 'pouco' | 'medio' | 'muito'
    nivel_interesse?: 'baixo' | 'medio' | 'alto'
    pessoa_respondeu_negativamente?: boolean
    pessoa_sumiu?: boolean
  }
): {
  resposta: string
  versao: 'curta' | 'media' | 'longa'
} {
  const { urgencia, tempo_disponivel, nivel_interesse, pessoa_respondeu_negativamente, pessoa_sumiu } = contexto

  // Se pessoa sumiu, usar resposta específica
  if (pessoa_sumiu && objeção.resposta_se_some) {
    return {
      resposta: objeção.resposta_se_some,
      versao: 'curta'
    }
  }

  // Se pessoa respondeu negativamente, usar resposta específica
  if (pessoa_respondeu_negativamente && objeção.resposta_se_negativa) {
    return {
      resposta: objeção.resposta_se_negativa,
      versao: 'curta'
    }
  }

  // Selecionar versão baseado no contexto
  if (tempo_disponivel === 'pouco' || nivel_interesse === 'baixo') {
    if (objeção.versao_curta) {
      return {
        resposta: objeção.versao_curta,
        versao: 'curta'
      }
    }
  }

  if (nivel_interesse === 'alto' && tempo_disponivel !== 'pouco') {
    if (objeção.versao_longa) {
      return {
        resposta: objeção.versao_longa,
        versao: 'longa'
      }
    }
  }

  // Default: versão média
  if (objeção.versao_media) {
    return {
      resposta: objeção.versao_media,
      versao: 'media'
    }
  }

  // Fallback: versão curta
  if (objeção.versao_curta) {
    return {
      resposta: objeção.versao_curta,
      versao: 'curta'
    }
  }

  // Último fallback: versão longa
  return {
    resposta: objeção.versao_longa || objeção.objeção,
    versao: 'longa'
  }
}

/**
 * Trata uma objeção e retorna resposta apropriada
 */
export async function tratarObjeção(
  mensagem: string,
  contexto: {
    urgencia?: 'alta' | 'media' | 'baixa'
    tempo_disponivel?: 'pouco' | 'medio' | 'muito'
    nivel_interesse?: 'baixo' | 'medio' | 'alto'
    pessoa_respondeu_negativamente?: boolean
    pessoa_sumiu?: boolean
    nome_pessoa?: string
  }
): Promise<ObjeçãoHandlerResult> {
  // Detectar objeção
  const deteccao = objectionMatcher.detectarObjeção(mensagem)

  if (!deteccao.codigo || !deteccao.categoria) {
    return {
      objeção: null,
      resposta: 'Entendo sua preocupação. Como posso te ajudar melhor?',
      versao_usada: 'curta'
    }
  }

  // Buscar objeção no banco
  const objeção = await objectionMatcher.buscarObjeção(
    deteccao.categoria,
    deteccao.codigo
  )

  if (!objeção) {
    return {
      objeção: null,
      resposta: 'Entendo sua preocupação. Como posso te ajudar melhor?',
      versao_usada: 'curta'
    }
  }

  // Selecionar versão apropriada
  const { resposta, versao } = selecionarVersaoResposta(objeção, contexto)

  // Adaptar resposta com nome da pessoa se fornecido
  let respostaAdaptada = resposta
  if (contexto.nome_pessoa) {
    respostaAdaptada = respostaAdaptada.replace(/\[nome\]/g, contexto.nome_pessoa)
  }

  return {
    objeção,
    resposta: respostaAdaptada,
    versao_usada: versao,
    gatilho_retomada: objeção.gatilho_retomada,
    upgrade: objeção.upgrade
  }
}

/**
 * Trata objeção conhecida diretamente
 */
export async function tratarObjeçãoConhecida(
  categoria: string,
  codigo: string,
  contexto: {
    urgencia?: 'alta' | 'media' | 'baixa'
    tempo_disponivel?: 'pouco' | 'medio' | 'muito'
    nivel_interesse?: 'baixo' | 'medio' | 'alto'
    pessoa_respondeu_negativamente?: boolean
    pessoa_sumiu?: boolean
    nome_pessoa?: string
  }
): Promise<ObjeçãoHandlerResult> {
  const objeção = await objectionMatcher.buscarObjeção(
    categoria as any,
    codigo
  )

  if (!objeção) {
    return {
      objeção: null,
      resposta: 'Entendo sua preocupação. Como posso te ajudar melhor?',
      versao_usada: 'curta'
    }
  }

  const { resposta, versao } = selecionarVersaoResposta(objeção, contexto)

  let respostaAdaptada = resposta
  if (contexto.nome_pessoa) {
    respostaAdaptada = respostaAdaptada.replace(/\[nome\]/g, contexto.nome_pessoa)
  }

  return {
    objeção,
    resposta: respostaAdaptada,
    versao_usada: versao,
    gatilho_retomada: objeção.gatilho_retomada,
    upgrade: objeção.upgrade
  }
}





