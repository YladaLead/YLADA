// =====================================================
// NOEL - ADAPTADOR DE SCRIPTS
// Personaliza scripts baseado no contexto específico
// =====================================================

import type { WellnessScript, WellnessInteractionContext } from '@/types/wellness-system'

/**
 * Adapta um script substituindo placeholders por valores reais
 */
export function adaptarScript(
  script: WellnessScript,
  contexto: WellnessInteractionContext & {
    nome_pessoa?: string
    nome_consultant?: string
    produto?: string
    valor?: string
    [key: string]: any
  }
): string {
  let conteudoAdaptado = script.conteudo

  // Substituir [nome] pelo nome da pessoa
  if (contexto.nome_pessoa) {
    conteudoAdaptado = conteudoAdaptado.replace(/\[nome\]/g, contexto.nome_pessoa)
  }

  // Substituir [consultant] pelo nome do distribuidor
  if (contexto.nome_consultant) {
    conteudoAdaptado = conteudoAdaptado.replace(/\[consultant\]/g, contexto.nome_consultant)
  }

  // Substituir [produto] pelo produto mencionado
  if (contexto.produto) {
    conteudoAdaptado = conteudoAdaptado.replace(/\[produto\]/g, contexto.produto)
  }

  // Substituir [valor] pelo valor mencionado
  if (contexto.valor) {
    conteudoAdaptado = conteudoAdaptado.replace(/\[valor\]/g, contexto.valor)
  }

  // Adaptar tom baseado no tipo de pessoa
  if (contexto.pessoa_tipo === 'proximo') {
    // Tom mais íntimo para pessoas próximas
    conteudoAdaptado = conteudoAdaptado.replace(/você/g, 'você')
    conteudoAdaptado = conteudoAdaptado.replace(/senhor|senhora/g, '')
  } else if (contexto.pessoa_tipo === 'mercado_frio') {
    // Tom mais formal para mercado frio
    conteudoAdaptado = conteudoAdaptado.replace(/Oi/g, 'Olá')
  }

  // Adaptar baseado no objetivo
  if (contexto.objetivo === 'energia') {
    conteudoAdaptado = conteudoAdaptado.replace(/bebida/g, 'bebida de energia')
  } else if (contexto.objetivo === 'retencao') {
    conteudoAdaptado = conteudoAdaptado.replace(/bebida/g, 'bebida de fibra')
  }

  return conteudoAdaptado
}

/**
 * Seleciona a versão apropriada do script baseado no contexto
 */
export function selecionarVersaoApropriada(
  scripts: WellnessScript[],
  contexto: {
    urgencia?: 'alta' | 'media' | 'baixa'
    tempo_disponivel?: 'pouco' | 'medio' | 'muito'
    nivel_interesse?: 'baixo' | 'medio' | 'alto'
  }
): WellnessScript | null {
  if (scripts.length === 0) return null

  // Se há apenas um script, retorna ele
  if (scripts.length === 1) return scripts[0]

  // Priorizar versão baseado no contexto
  const { urgencia, tempo_disponivel, nivel_interesse } = contexto

  // Se tempo é pouco ou interesse é baixo, usar versão curta
  if (tempo_disponivel === 'pouco' || nivel_interesse === 'baixo') {
    const curta = scripts.find(s => s.versao === 'curta')
    if (curta) return curta
  }

  // Se interesse é alto, usar versão longa
  if (nivel_interesse === 'alto' && tempo_disponivel !== 'pouco') {
    const longa = scripts.find(s => s.versao === 'longa')
    if (longa) return longa
  }

  // Default: versão média
  const media = scripts.find(s => s.versao === 'media')
  if (media) return media

  // Fallback: primeiro script disponível
  return scripts[0]
}

/**
 * Combina múltiplos scripts em uma resposta única
 */
export function combinarScripts(
  scripts: WellnessScript[],
  separador: string = '\n\n'
): string {
  return scripts
    .map(s => s.conteudo)
    .filter(c => c && c.trim().length > 0)
    .join(separador)
}





