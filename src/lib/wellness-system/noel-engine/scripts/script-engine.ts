// =====================================================
// NOEL - MOTOR DE SCRIPTS
// Orquestra seleção, adaptação e personalização de scripts
// =====================================================

import type { WellnessScript, WellnessInteractionContext, ScriptVersao } from '@/types/wellness-system'
import * as scriptSelector from './script-selector'
import * as scriptAdaptor from './script-adaptor'

/**
 * Interface para o resultado do motor de scripts
 */
export interface ScriptEngineResult {
  script: WellnessScript | null
  conteudo_adaptado: string
  versao_usada: ScriptVersao
  tags: string[]
}

/**
 * Motor principal de scripts
 * Seleciona, adapta e personaliza scripts baseado no contexto
 */
export async function processarScript(
  contexto: WellnessInteractionContext & {
    categoria?: string
    subcategoria?: string
    versao_preferida?: ScriptVersao
    nome_pessoa?: string
    nome_consultant?: string
    produto?: string
    valor?: string
    urgencia?: 'alta' | 'media' | 'baixa'
    tempo_disponivel?: 'pouco' | 'medio' | 'muito'
    nivel_interesse?: 'baixo' | 'medio' | 'alto'
  }
): Promise<ScriptEngineResult> {
  let script: WellnessScript | null = null
  let versao_usada: ScriptVersao = contexto.versao_preferida || 'media'

  // Estratégia de seleção baseada no contexto
  if (contexto.pessoa_tipo) {
    // Selecionar por tipo de pessoa
    script = await scriptSelector.selecionarScriptPorTipoPessoa(
      contexto.pessoa_tipo,
      versao_usada
    )
  } else if (contexto.objetivo) {
    // Selecionar por objetivo
    script = await scriptSelector.selecionarScriptPorObjetivo(
      contexto.objetivo,
      versao_usada
    )
  } else if (contexto.etapa) {
    // Selecionar por etapa
    script = await scriptSelector.selecionarScriptPorEtapa(
      contexto.etapa,
      versao_usada
    )
  } else if (contexto.categoria) {
    // Seleção genérica por categoria
    script = await scriptSelector.selecionarScript({
      categoria: contexto.categoria as any,
      subcategoria: contexto.subcategoria,
      versao: versao_usada,
      contexto
    })
  }

  // Se não encontrou script específico, buscar alternativas
  if (!script) {
    // Tentar buscar todas as versões disponíveis
    const scripts = await scriptSelector.buscarScripts({
      categoria: contexto.categoria as any,
      subcategoria: contexto.subcategoria,
      tags: contexto.objetivo ? [contexto.objetivo] : undefined
    })

    if (scripts.length > 0) {
      // Selecionar versão apropriada baseado no contexto
      script = scriptAdaptor.selecionarVersaoApropriada(scripts, {
        urgencia: contexto.urgencia,
        tempo_disponivel: contexto.tempo_disponivel,
        nivel_interesse: contexto.nivel_interesse
      })
    }
  }

  // Adaptar script se encontrado
  let conteudo_adaptado = ''
  if (script) {
    conteudo_adaptado = scriptAdaptor.adaptarScript(script, contexto)
    versao_usada = script.versao as ScriptVersao
  }

  return {
    script,
    conteudo_adaptado,
    versao_usada,
    tags: script?.tags || []
  }
}

/**
 * Busca script de acompanhamento específico
 */
export async function buscarScriptAcompanhamento(
  dias: 7 | 14 | 30,
  contexto: WellnessInteractionContext & {
    nome_pessoa?: string
    nome_consultant?: string
  }
): Promise<ScriptEngineResult> {
  const script = await scriptSelector.selecionarScriptAcompanhamento(dias, 'media')

  if (!script) {
    return {
      script: null,
      conteudo_adaptado: '',
      versao_usada: 'media',
      tags: []
    }
  }

  const conteudo_adaptado = scriptAdaptor.adaptarScript(script, contexto)

  return {
    script,
    conteudo_adaptado,
    versao_usada: script.versao as ScriptVersao,
    tags: script.tags || []
  }
}

/**
 * Busca script de reativação
 */
export async function buscarScriptReativacao(
  tipo: string,
  contexto: WellnessInteractionContext & {
    nome_pessoa?: string
    nome_consultant?: string
  }
): Promise<ScriptEngineResult> {
  const script = await scriptSelector.selecionarScriptReativacao(tipo, 'media')

  if (!script) {
    return {
      script: null,
      conteudo_adaptado: '',
      versao_usada: 'media',
      tags: []
    }
  }

  const conteudo_adaptado = scriptAdaptor.adaptarScript(script, contexto)

  return {
    script,
    conteudo_adaptado,
    versao_usada: script.versao as ScriptVersao,
    tags: script.tags || []
  }
}

/**
 * Busca script de recrutamento
 */
export async function buscarScriptRecrutamento(
  etapa: string,
  contexto: WellnessInteractionContext & {
    nome_pessoa?: string
    nome_consultant?: string
  }
): Promise<ScriptEngineResult> {
  const script = await scriptSelector.selecionarScriptRecrutamento(etapa, 'media')

  if (!script) {
    return {
      script: null,
      conteudo_adaptado: '',
      versao_usada: 'media',
      tags: []
    }
  }

  const conteudo_adaptado = scriptAdaptor.adaptarScript(script, contexto)

  return {
    script,
    conteudo_adaptado,
    versao_usada: script.versao as ScriptVersao,
    tags: script.tags || []
  }
}





