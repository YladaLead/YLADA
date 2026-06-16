// =====================================================
// NOEL - FORMATADOR DE RESPOSTA
// Formata a resposta final do NOEL para exibição
// =====================================================

import type { NoelResponseStructure } from './response-builder'
import { formatarRespostaCompleta } from './response-builder'

/**
 * Formata resposta para exibição no chat
 */
export function formatarParaChat(
  estrutura: NoelResponseStructure,
  opcoes: {
    incluirScript?: boolean
    incluirEmojis?: boolean
    formato?: 'completo' | 'resumido'
  } = {}
): string {
  const { incluirScript = true, incluirEmojis = true, formato = 'completo' } = opcoes

  if (formato === 'resumido') {
    return formatarResumido(estrutura, incluirEmojis)
  }

  return formatarRespostaCompleta(estrutura, incluirScript)
}

/**
 * Formata resposta resumida
 */
function formatarResumido(
  estrutura: NoelResponseStructure,
  incluirEmojis: boolean
): string {
  const partes: string[] = []

  partes.push(estrutura.acolhimento)
  
  if (estrutura.script_sugerido) {
    partes.push('')
    partes.push('💬 Script:')
    partes.push(estrutura.script_sugerido.conteudo)
  }

  partes.push('')
  partes.push(estrutura.reforco_emocional)
  partes.push(estrutura.proximo_passo)

  return partes.join('\n')
}

/**
 * Formata resposta para API (JSON)
 */
export function formatarParaAPI(
  estrutura: NoelResponseStructure,
  mensagemUsuario?: string,
  perfilConsultor?: any
): {
  resposta: string
  script?: {
    id: string
    nome: string
    conteudo: string
    versao: string
  }
  estrutura: {
    acolhimento: string
    contexto: string
    acao_pratica: string
    reforco_emocional: string
    proximo_passo: string
  }
} {
  return {
    resposta: formatarRespostaCompleta(estrutura, true, mensagemUsuario, perfilConsultor),
    script: estrutura.script_sugerido ? {
      id: estrutura.script_sugerido.id,
      nome: estrutura.script_sugerido.nome,
      conteudo: estrutura.script_sugerido.conteudo,
      versao: estrutura.script_sugerido.versao
    } : undefined,
    estrutura: {
      acolhimento: estrutura.acolhimento,
      contexto: estrutura.contexto,
      acao_pratica: estrutura.acao_pratica,
      reforco_emocional: estrutura.reforco_emocional,
      proximo_passo: estrutura.proximo_passo
    }
  }
}

/**
 * Formata resposta para WhatsApp (texto simples)
 */
export function formatarParaWhatsApp(
  estrutura: NoelResponseStructure
): string {
  const partes: string[] = []

  // Apenas o essencial para WhatsApp
  if (estrutura.script_sugerido) {
    partes.push(estrutura.script_sugerido.conteudo)
  } else {
    partes.push(estrutura.acao_pratica)
  }

  return partes.join('\n')
}


