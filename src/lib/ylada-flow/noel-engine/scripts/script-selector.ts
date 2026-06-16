// =====================================================
// NOEL - SELETOR CONTEXTUAL DE SCRIPTS
// Seleciona o script apropriado baseado no contexto
// =====================================================

import type { WellnessScript, WellnessInteractionContext, ScriptCategoria, ScriptVersao } from '@/types/wellness-system'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Seleciona um script baseado no contexto fornecido
 */
export async function selecionarScript(contexto: {
  categoria?: ScriptCategoria
  subcategoria?: string
  versao?: ScriptVersao
  contexto: WellnessInteractionContext
  tags?: string[]
}): Promise<WellnessScript | null> {
  const { categoria, subcategoria, versao, contexto: ctx, tags } = contexto

  // Construir query base
  let query = supabaseAdmin!
    .from('wellness_scripts')
    .select('*')
    .eq('ativo', true)

  // Filtrar por categoria se fornecida
  if (categoria) {
    query = query.eq('categoria', categoria)
  }

  // Filtrar por subcategoria se fornecida
  if (subcategoria) {
    query = query.eq('subcategoria', subcategoria)
  }

  // Filtrar por versão se fornecida
  if (versao) {
    query = query.eq('versao', versao)
  }

  // Filtrar por tags se fornecidas
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags)
  }

  // Ordenar por ordem e depois por nome
  query = query.order('ordem', { ascending: true })
    .order('nome', { ascending: true })

  // Limitar a 1 resultado (o mais relevante)
  query = query.limit(1)

  const { data, error } = await query

  if (error) {
    console.error('❌ Erro ao buscar script:', error)
    return null
  }

  if (!data || data.length === 0) {
    return null
  }

  return data[0] as WellnessScript
}

/**
 * Seleciona script por tipo de pessoa
 */
export async function selecionarScriptPorTipoPessoa(
  tipoPessoa: WellnessInteractionContext['pessoa_tipo'],
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  const subcategoriaMap: Record<string, string> = {
    'proximo': 'pessoas_proximas',
    'indicacao': 'indicacoes',
    'instagram': 'instagram',
    'mercado_frio': 'mercado_frio',
    'cliente_ativo': 'clientes_ativos',
    'cliente_sumido': 'clientes_sumidos'
  }

  const subcategoria = tipoPessoa ? subcategoriaMap[tipoPessoa] : undefined

  return selecionarScript({
    categoria: 'tipo_pessoa',
    subcategoria,
    versao,
    contexto: { pessoa_tipo: tipoPessoa }
  })
}

/**
 * Seleciona script por objetivo do cliente
 */
export async function selecionarScriptPorObjetivo(
  objetivo: WellnessInteractionContext['objetivo'],
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'objetivo',
    subcategoria: objetivo,
    versao,
    contexto: { objetivo }
  })
}

/**
 * Seleciona script por etapa da conversa
 */
export async function selecionarScriptPorEtapa(
  etapa: WellnessInteractionContext['etapa'],
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'etapa',
    subcategoria: etapa,
    versao,
    contexto: { etapa }
  })
}

/**
 * Seleciona script de acompanhamento por dias
 */
export async function selecionarScriptAcompanhamento(
  dias: 7 | 14 | 30,
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'acompanhamento',
    subcategoria: `${dias}_dias`,
    versao,
    contexto: {}
  })
}

/**
 * Seleciona script de reativação
 */
export async function selecionarScriptReativacao(
  tipo: string,
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'reativacao',
    subcategoria: tipo,
    versao,
    contexto: {}
  })
}

/**
 * Seleciona script de recrutamento por etapa
 */
export async function selecionarScriptRecrutamento(
  etapa: string,
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'recrutamento',
    subcategoria: etapa,
    versao,
    contexto: {}
  })
}

/**
 * Seleciona script interno do NOEL
 */
export async function selecionarScriptInterno(
  tipo: string,
  versao: ScriptVersao = 'media'
): Promise<WellnessScript | null> {
  return selecionarScript({
    categoria: 'interno',
    subcategoria: tipo,
    versao,
    contexto: {}
  })
}

/**
 * Busca múltiplos scripts com filtros
 */
export async function buscarScripts(filtros: {
  categoria?: ScriptCategoria
  subcategoria?: string
  versao?: ScriptVersao
  tags?: string[]
  ativo?: boolean
  limit?: number
}): Promise<WellnessScript[]> {
  let query = supabaseAdmin!
    .from('wellness_scripts')
    .select('*')

  if (filtros.categoria) {
    query = query.eq('categoria', filtros.categoria)
  }

  if (filtros.subcategoria) {
    query = query.eq('subcategoria', filtros.subcategoria)
  }

  if (filtros.versao) {
    query = query.eq('versao', filtros.versao)
  }

  if (filtros.tags && filtros.tags.length > 0) {
    query = query.contains('tags', filtros.tags)
  }

  if (filtros.ativo !== undefined) {
    query = query.eq('ativo', filtros.ativo)
  }

  query = query.order('ordem', { ascending: true })
    .order('nome', { ascending: true })

  if (filtros.limit) {
    query = query.limit(filtros.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('❌ Erro ao buscar scripts:', error)
    return []
  }

  return (data || []) as WellnessScript[]
}





