// =====================================================
// NOEL - BUSCA SEMÂNTICA DE OBJEÇÕES
// Usa embeddings para encontrar objeções similares à pergunta
// Independente de como a pessoa pergunta
// =====================================================

import { supabaseAdmin } from '@/lib/supabase'
import type { WellnessObjeção } from '@/types/ylada-flow-legacy'
import { generateEmbedding } from '@/lib/noel-wellness/knowledge-search'

/**
 * Busca objeções por similaridade semântica
 * ⚡ OTIMIZAÇÃO: Aceita embedding pré-gerado para reutilização (economia 66%)
 */
export async function buscarObjeçõesPorSimilaridade(
  pergunta: string,
  options: {
    categoria?: string
    limite?: number
    threshold?: number
    queryEmbedding?: number[] // Embedding opcional para reutilização
  } = {}
): Promise<{
  objeções: WellnessObjeção[]
  melhorMatch: WellnessObjeção | null
  similaridade: number
}> {
  const { categoria, limite = 5, threshold = 0.3, queryEmbedding: providedEmbedding } = options

  try {
    // 1. Gerar embedding da pergunta (ou usar o fornecido)
    console.log('🔍 Gerando embedding da pergunta para objeções...')
    const queryEmbedding = providedEmbedding || await generateEmbedding(pergunta)

    // 2. Buscar objeções ativas
    let query = supabaseAdmin!
      .from('wellness_objecoes')
      .select('*')
      .eq('ativo', true)
      .limit(limite * 3)

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data: objeções, error } = await query

    if (error || !objeções || objeções.length === 0) {
      return {
        objeções: [],
        melhorMatch: null,
        similaridade: 0,
      }
    }

    // 3. Busca híbrida: primeiro por texto, depois semântica
    const palavrasChave = pergunta
      .toLowerCase()
      .split(/\s+/)
      .filter((palavra) => palavra.length > 3)
      .slice(0, 5)

    // Busca rápida por texto
    const objeçõesComRelevanciaTexto = objeções.map((objeção) => {
      const textoCompleto = `${objeção.objeção} ${objeção.versao_media || ''}`.toLowerCase()
      const relevanciaTexto = palavrasChave.filter((palavra) =>
        textoCompleto.includes(palavra)
      ).length

      return {
        objeção: objeção as WellnessObjeção,
        relevanciaTexto,
      }
    })

    const topObjeçõesTexto = objeçõesComRelevanciaTexto
      .filter((item) => item.relevanciaTexto > 0)
      .sort((a, b) => b.relevanciaTexto - a.relevanciaTexto)
      .slice(0, 5)

    // Se encontrou por texto, usar
    if (topObjeçõesTexto.length > 0 && topObjeçõesTexto[0].relevanciaTexto >= palavrasChave.length * 0.4) {
      console.log('✅ Objeções encontradas por busca de texto:', topObjeçõesTexto.length)
      return {
        objeções: topObjeçõesTexto.map((item) => item.objeção),
        melhorMatch: topObjeçõesTexto[0].objeção,
        similaridade: topObjeçõesTexto[0].relevanciaTexto / palavrasChave.length,
      }
    }

    // Se não encontrou por texto, usar busca semântica (limitada)
    console.log('🔍 Busca por texto não encontrou, usando busca semântica...')
    const objeçõesParaComparar = objeções.slice(0, 5) // Limitar para performance

    const objeçõesComSimilaridade = await Promise.all(
      objeçõesParaComparar.map(async (objeção) => {
        try {
          // Gerar embedding da objeção (resumido)
          const textoObjeção = `${objeção.objeção} ${objeção.versao_media || ''}`.substring(0, 500)
          const objeçãoEmbedding = await generateEmbedding(textoObjeção)

          // Calcular similaridade cosseno
          const similaridade = calcularSimilaridadeCosseno(queryEmbedding, objeçãoEmbedding)

          return {
            objeção: objeção as WellnessObjeção,
            similaridade,
          }
        } catch (error) {
          console.error(`⚠️ Erro ao calcular similaridade para objeção ${objeção.id}:`, error)
          return {
            objeção: objeção as WellnessObjeção,
            similaridade: 0,
          }
        }
      })
    )

    // 4. Filtrar e ordenar
    const objeçõesFiltradas = objeçõesComSimilaridade
      .filter((item) => item.similaridade >= threshold)
      .sort((a, b) => b.similaridade - a.similaridade)
      .slice(0, limite)

    const melhorMatch = objeçõesFiltradas.length > 0 ? objeçõesFiltradas[0].objeção : null
    const melhorSimilaridade = objeçõesFiltradas.length > 0 ? objeçõesFiltradas[0].similaridade : 0

    console.log('✅ Busca semântica de objeções concluída:', {
      total_objeções: objeções.length,
      objeções_encontradas: objeçõesFiltradas.length,
      melhor_similaridade: melhorSimilaridade,
    })

    return {
      objeções: objeçõesFiltradas.map((item) => item.objeção),
      melhorMatch,
      similaridade: melhorSimilaridade,
    }
  } catch (error: any) {
    console.error('❌ Erro na busca semântica de objeções:', error)
    return buscarObjeçõesPorTexto(pergunta, options)
  }
}

/**
 * Busca objeções por texto (fallback)
 */
async function buscarObjeçõesPorTexto(
  pergunta: string,
  options: {
    categoria?: string
    limite?: number
  } = {}
): Promise<{
  objeções: WellnessObjeção[]
  melhorMatch: WellnessObjeção | null
  similaridade: number
}> {
  const { categoria, limite = 5 } = options

  const palavrasChave = pergunta
    .toLowerCase()
    .split(/\s+/)
    .filter((palavra) => palavra.length > 3)
    .slice(0, 5)

  let query = supabaseAdmin!
    .from('wellness_objecoes')
    .select('*')
    .eq('ativo', true)

  if (categoria) {
    query = query.eq('categoria', categoria)
  }

  const { data: objeções, error } = await query

  if (error || !objeções) {
    return {
      objeções: [],
      melhorMatch: null,
      similaridade: 0,
    }
  }

  const objeçõesComRelevancia = objeções.map((objeção) => {
    const textoCompleto = `${objeção.objeção} ${objeção.versao_media || ''}`.toLowerCase()
    const relevancia = palavrasChave.filter((palavra) =>
      textoCompleto.includes(palavra)
    ).length

    return {
      objeção: objeção as WellnessObjeção,
      relevancia,
    }
  })

  const objeçõesOrdenadas = objeçõesComRelevancia
    .filter((item) => item.relevancia > 0)
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, limite)

  return {
    objeções: objeçõesOrdenadas.map((item) => item.objeção),
    melhorMatch: objeçõesOrdenadas.length > 0 ? objeçõesOrdenadas[0].objeção : null,
    similaridade: objeçõesOrdenadas.length > 0 ? objeçõesOrdenadas[0].relevancia / palavrasChave.length : 0,
  }
}

/**
 * Calcula similaridade cosseno entre dois vetores
 */
function calcularSimilaridadeCosseno(vetor1: number[], vetor2: number[]): number {
  if (vetor1.length !== vetor2.length) {
    return 0
  }

  let produtoEscalar = 0
  let norma1 = 0
  let norma2 = 0

  for (let i = 0; i < vetor1.length; i++) {
    produtoEscalar += vetor1[i] * vetor2[i]
    norma1 += vetor1[i] * vetor1[i]
    norma2 += vetor2[i] * vetor2[i]
  }

  const denominador = Math.sqrt(norma1) * Math.sqrt(norma2)
  
  if (denominador === 0) {
    return 0
  }

  return produtoEscalar / denominador
}


