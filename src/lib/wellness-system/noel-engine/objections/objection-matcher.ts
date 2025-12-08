// =====================================================
// NOEL - MATCHER DE OBJEÇÕES
// Detecta e identifica objeções na mensagem do usuário
// =====================================================

import type { WellnessObjeção, ObjeçãoCategoria } from '@/types/wellness-system'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Palavras-chave para detectar objeções
 */
const objeçãoKeywords: Record<string, string[]> = {
  'A.1': ['caro', 'preço', 'valor', 'custar', 'barato'],
  'A.2': ['pensar', 'pensar sobre', 'vou pensar', 'deixa eu pensar'],
  'A.3': ['funciona', 'funciona para mim', 'não sei se funciona'],
  'A.4': ['marido', 'esposa', 'conversar com', 'falar com'],
  'A.5': ['tempo', 'não tenho tempo', 'correria', 'ocupado'],
  'A.6': ['usar certinho', 'medo de usar', 'não usar certo'],
  'A.7': ['já tentei', 'não funcionou', 'tentei outras coisas'],
  'A.8': ['não gosto de bebida', 'bebida', 'gosto'],
  'A.9': ['sem dinheiro', 'sem grana', 'sem condições', 'apertado'],
  'A.10': ['comprometer', 'compromisso', 'não quero me comprometer'],
  'C.1': ['tempo para isso', 'não tenho tempo', 'tempo'],
  'C.2': ['não sou vendedor', 'vendedor', 'vender'],
  'C.3': ['vergonha', 'chamar', 'envergonhado'],
  'C.4': ['não conheço', 'pouca gente', 'conheço poucos'],
  'C.5': ['medo', 'não dar certo', 'dar errado'],
  'C.6': ['dinheiro para começar', 'investir', 'sem dinheiro'],
  'C.7': ['não entendo', 'herbalife', 'wellness', 'entender'],
  'C.8': ['não é para mim', 'não serve', 'não combina'],
  'C.9': ['incomodar', 'não quero incomodar', 'chato'],
  'C.10': ['já tentei antes', 'tentei e não funcionou']
}

/**
 * Detecta objeções na mensagem do usuário
 */
export function detectarObjeção(mensagem: string): {
  codigo?: string
  categoria?: ObjeçãoCategoria
  confianca: number
} {
  const mensagemLower = mensagem.toLowerCase()
  let melhorMatch: { codigo: string; confianca: number } | null = null

  // Buscar palavras-chave
  for (const [codigo, keywords] of Object.entries(objeçãoKeywords)) {
    const matches = keywords.filter(kw => mensagemLower.includes(kw.toLowerCase()))
    const confianca = matches.length / keywords.length

    if (confianca > 0 && (!melhorMatch || confianca > melhorMatch.confianca)) {
      melhorMatch = { codigo, confianca }
    }
  }

  if (!melhorMatch || melhorMatch.confianca < 0.3) {
    return { confianca: 0 }
  }

  // Determinar categoria baseado no código
  let categoria: ObjeçãoCategoria = 'clientes'
  if (melhorMatch.codigo.startsWith('B.')) {
    categoria = 'clientes_recorrentes'
  } else if (melhorMatch.codigo.startsWith('C.')) {
    categoria = 'recrutamento'
  } else if (melhorMatch.codigo.startsWith('D.')) {
    categoria = 'distribuidores'
  } else if (melhorMatch.codigo.startsWith('E.')) {
    categoria = 'avancadas'
  }

  return {
    codigo: melhorMatch.codigo,
    categoria,
    confianca: melhorMatch.confianca
  }
}

/**
 * Busca objeção no banco de dados
 */
export async function buscarObjeção(
  categoria: ObjeçãoCategoria,
  codigo: string
): Promise<WellnessObjeção | null> {
  const { data, error } = await supabaseAdmin!
    .from('wellness_objecoes')
    .select('*')
    .eq('categoria', categoria)
    .eq('codigo', codigo)
    .eq('ativo', true)
    .single()

  if (error) {
    console.error('❌ Erro ao buscar objeção:', error)
    return null
  }

  return data as WellnessObjeção | null
}

/**
 * Busca objeção por texto (fuzzy match)
 */
export async function buscarObjeçãoPorTexto(
  texto: string
): Promise<WellnessObjeção | null> {
  // Primeiro tentar detectar objeção
  const deteccao = detectarObjeção(texto)

  if (!deteccao.codigo || !deteccao.categoria) {
    return null
  }

  return buscarObjeção(deteccao.categoria, deteccao.codigo)
}

/**
 * Busca múltiplas objeções por categoria
 */
export async function buscarObjeçõesPorCategoria(
  categoria: ObjeçãoCategoria
): Promise<WellnessObjeção[]> {
  const { data, error } = await supabaseAdmin!
    .from('wellness_objecoes')
    .select('*')
    .eq('categoria', categoria)
    .eq('ativo', true)
    .order('ordem', { ascending: true })
    .order('codigo', { ascending: true })

  if (error) {
    console.error('❌ Erro ao buscar objeções:', error)
    return []
  }

  return (data || []) as WellnessObjeção[]
}





