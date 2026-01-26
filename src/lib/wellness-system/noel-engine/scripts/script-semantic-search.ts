// =====================================================
// NOEL - BUSCA SEMÂNTICA DE SCRIPTS
// Usa embeddings para encontrar scripts similares à pergunta
// Independente de como a pessoa pergunta
// =====================================================

import { supabaseAdmin } from '@/lib/supabase'
import type { WellnessScript } from '@/types/wellness-system'
import { generateEmbedding } from '@/lib/noel-wellness/knowledge-search'

/**
 * Busca scripts por similaridade semântica
 * Usa embeddings para encontrar scripts relevantes mesmo com palavras diferentes
 * ⚡ OTIMIZAÇÃO: Aceita embedding pré-gerado para reutilização (economia 66%)
 */
export async function buscarScriptsPorSimilaridade(
  pergunta: string,
  options: {
    categoria?: string
    limite?: number
    threshold?: number // 0.0 a 1.0 (quanto maior, mais similar precisa ser)
    queryEmbedding?: number[] // Embedding opcional para reutilização
  } = {}
): Promise<{
  scripts: WellnessScript[]
  melhorMatch: WellnessScript | null
  similaridade: number
}> {
  const { categoria, limite = 5, threshold = 0.3, queryEmbedding: providedEmbedding } = options

  try {
    // 1. Gerar embedding da pergunta (ou usar o fornecido)
    console.log('🔍 Gerando embedding da pergunta...')
    const queryEmbedding = providedEmbedding || await generateEmbedding(pergunta)
    console.log('✅ Embedding gerado:', queryEmbedding.length, 'dimensões')

    // 2. Buscar scripts por similaridade usando pgvector
    // NOTA: Isso requer que a tabela wellness_scripts tenha uma coluna de embedding
    // Por enquanto, vamos fazer busca híbrida: embeddings + busca por texto
    
    // Primeiro, tentar buscar usando embeddings se a tabela tiver suporte
    // Se não tiver, fazer busca inteligente por texto
    
    // Buscar todos os scripts ativos (ou filtrar por categoria)
    let query = supabaseAdmin!
      .from('wellness_scripts')
      .select('*')
      .eq('ativo', true)
      .limit(limite * 3) // Buscar mais para depois filtrar por similaridade

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data: scripts, error } = await query

    if (error || !scripts || scripts.length === 0) {
      console.log('⚠️ Nenhum script encontrado no banco')
      return {
        scripts: [],
        melhorMatch: null,
        similaridade: 0,
      }
    }

    // 3. Busca híbrida: primeiro por texto (rápido), depois semântica (se necessário)
    console.log(`📊 Analisando ${scripts.length} scripts...`)

    // Primeiro: busca rápida por texto (palavras-chave)
    const palavrasChave = pergunta
      .toLowerCase()
      .split(/\s+/)
      .filter((palavra) => palavra.length > 3)
      .slice(0, 5)

    const scriptsComRelevanciaTexto = scripts.map((script) => {
      const textoCompleto = `${script.nome} ${script.conteudo}`.toLowerCase()
      const relevanciaTexto = palavrasChave.filter((palavra) =>
        textoCompleto.includes(palavra)
      ).length

      return {
        script: script as WellnessScript,
        relevanciaTexto,
      }
    })

    // Ordenar por relevância de texto e pegar os top 10
    const topScriptsTexto = scriptsComRelevanciaTexto
      .filter((item) => item.relevanciaTexto > 0)
      .sort((a, b) => b.relevanciaTexto - a.relevanciaTexto)
      .slice(0, 10)

    // Se encontrou bons resultados por texto, usar eles
    if (topScriptsTexto.length > 0 && topScriptsTexto[0].relevanciaTexto >= palavrasChave.length * 0.4) {
      console.log('✅ Scripts encontrados por busca de texto:', topScriptsTexto.length)
      return {
        scripts: topScriptsTexto.map((item) => item.script),
        melhorMatch: topScriptsTexto[0].script,
        similaridade: topScriptsTexto[0].relevanciaTexto / palavrasChave.length,
      }
    }

    // Se não encontrou por texto, usar busca semântica (mas limitada para performance)
    console.log('🔍 Busca por texto não encontrou resultados suficientes, usando busca semântica...')
    
    // Limitar a 5 scripts para não gastar muitos tokens
    const scriptsParaComparar = scripts.slice(0, 5)

    const scriptsComSimilaridade = await Promise.all(
      scriptsParaComparar.map(async (script) => {
        try {
          // Gerar embedding do script (nome + conteúdo resumido)
          const textoScript = `${script.nome} ${script.conteudo.substring(0, 500)}`
          const scriptEmbedding = await generateEmbedding(textoScript)

          // Calcular similaridade cosseno
          const similaridade = calcularSimilaridadeCosseno(queryEmbedding, scriptEmbedding)

          return {
            script: script as WellnessScript,
            similaridade,
          }
        } catch (error) {
          console.error(`⚠️ Erro ao calcular similaridade para script ${script.id}:`, error)
          return {
            script: script as WellnessScript,
            similaridade: 0,
          }
        }
      })
    )

    // 4. Filtrar por threshold e ordenar por similaridade
    const scriptsFiltrados = scriptsComSimilaridade
      .filter((item) => item.similaridade >= threshold)
      .sort((a, b) => b.similaridade - a.similaridade)
      .slice(0, limite)

    const melhorMatch = scriptsFiltrados.length > 0 ? scriptsFiltrados[0].script : null
    const melhorSimilaridade = scriptsFiltrados.length > 0 ? scriptsFiltrados[0].similaridade : 0

    console.log('✅ Busca semântica concluída:', {
      total_scripts: scripts.length,
      scripts_analisados: scriptsParaComparar.length,
      scripts_encontrados: scriptsFiltrados.length,
      melhor_similaridade: melhorSimilaridade,
      melhor_script: melhorMatch?.nome,
    })

    return {
      scripts: scriptsFiltrados.map((item) => item.script),
      melhorMatch,
      similaridade: melhorSimilaridade,
    }
  } catch (error: any) {
    console.error('❌ Erro na busca semântica de scripts:', error)
    
    // Fallback: busca simples por texto
    return buscarScriptsPorTexto(pergunta, options)
  }
}

/**
 * Busca scripts por texto (fallback quando embeddings não estão disponíveis)
 */
async function buscarScriptsPorTexto(
  pergunta: string,
  options: {
    categoria?: string
    limite?: number
  } = {}
): Promise<{
  scripts: WellnessScript[]
  melhorMatch: WellnessScript | null
  similaridade: number
}> {
  const { categoria, limite = 5 } = options

  // Extrair palavras-chave da pergunta
  const palavrasChave = pergunta
    .toLowerCase()
    .split(/\s+/)
    .filter((palavra) => palavra.length > 3)
    .slice(0, 5)

  let query = supabaseAdmin!
    .from('wellness_scripts')
    .select('*')
    .eq('ativo', true)

  if (categoria) {
    query = query.eq('categoria', categoria)
  }

  // Buscar scripts que contenham as palavras-chave no nome ou conteúdo
  const { data: scripts, error } = await query

  if (error || !scripts) {
    return {
      scripts: [],
      melhorMatch: null,
      similaridade: 0,
    }
  }

  // Ordenar por relevância (quantas palavras-chave aparecem)
  const scriptsComRelevancia = scripts.map((script) => {
    const textoCompleto = `${script.nome} ${script.conteudo}`.toLowerCase()
    const relevancia = palavrasChave.filter((palavra) =>
      textoCompleto.includes(palavra)
    ).length

    return {
      script: script as WellnessScript,
      relevancia,
    }
  })

  const scriptsOrdenados = scriptsComRelevancia
    .filter((item) => item.relevancia > 0)
    .sort((a, b) => b.relevancia - a.relevancia)
    .slice(0, limite)

  return {
    scripts: scriptsOrdenados.map((item) => item.script),
    melhorMatch: scriptsOrdenados.length > 0 ? scriptsOrdenados[0].script : null,
    similaridade: scriptsOrdenados.length > 0 ? scriptsOrdenados[0].relevancia / palavrasChave.length : 0,
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


