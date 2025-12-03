/**
 * Sistema de Busca Inteligente para Orientação Técnica
 * Busca genérica que funciona para todas as áreas
 */

import type { OrientacaoItem } from '@/types/orientation'

/**
 * Normaliza texto para busca (remove acentos, lowercase, etc)
 */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .trim()
}

/**
 * Calcula similaridade entre duas strings (0-1)
 */
export function calcularSimilaridade(str1: string, str2: string): number {
  const s1 = normalizarTexto(str1)
  const s2 = normalizarTexto(str2)
  
  // Se são iguais, retorna 1
  if (s1 === s2) return 1
  
  // Se uma contém a outra, retorna 0.8
  if (s1.includes(s2) || s2.includes(s1)) return 0.8
  
  // Calcular similaridade por palavras
  const palavras1 = s1.split(/\s+/).filter(p => p.length > 2)
  const palavras2 = s2.split(/\s+/).filter(p => p.length > 2)
  
  if (palavras1.length === 0 || palavras2.length === 0) return 0
  
  // Contar palavras em comum
  const palavrasComuns = palavras1.filter(p => palavras2.includes(p))
  const totalPalavras = Math.max(palavras1.length, palavras2.length)
  
  return palavrasComuns.length / totalPalavras
}

/**
 * Busca orientação por pergunta do usuário
 */
export function buscarOrientacao(
  pergunta: string,
  mapa: Record<string, OrientacaoItem>
): OrientacaoItem | null {
  const perguntaNormalizada = normalizarTexto(pergunta)
  const palavras = perguntaNormalizada.split(/\s+/).filter(p => p.length > 2)
  
  // Palavras genéricas que devem ter menos peso
  const palavrasGenericas = ['ver', 'criar', 'editar', 'adicionar', 'novo', 'fazer', 'como']
  const palavrasEspecificas = palavras.filter(p => !palavrasGenericas.includes(p))
  
  let melhorMatch: OrientacaoItem | null = null
  let melhorScore = 0
  
  // Buscar por palavras-chave exatas
  for (const [key, item] of Object.entries(mapa)) {
    const palavrasChave = item.palavras_chave.map(normalizarTexto)
    let score = 0
    
    // PRIORIDADE 1: Match com palavras-chave específicas (peso alto)
    palavrasEspecificas.forEach(palavra => {
      palavrasChave.forEach(pk => {
        if (palavra === pk || palavra.includes(pk) || pk.includes(palavra)) {
          score += 10 // Peso alto para palavras específicas
        }
      })
    })
    
    // PRIORIDADE 2: Match com palavras-chave genéricas (peso baixo)
    palavras.forEach(palavra => {
      palavrasChave.forEach(pk => {
        if (palavra === pk || palavra.includes(pk) || pk.includes(palavra)) {
          score += 2 // Peso baixo para palavras genéricas
        }
      })
    })
    
    // PRIORIDADE 3: Match com título (peso médio)
    const tituloNormalizado = normalizarTexto(item.titulo)
    palavrasEspecificas.forEach(palavra => {
      if (tituloNormalizado.includes(palavra)) {
        score += 5
      }
    })
    
    // PRIORIDADE 4: Match com descrição (peso baixo)
    const descricaoNormalizada = normalizarTexto(item.descricao)
    palavrasEspecificas.forEach(palavra => {
      if (descricaoNormalizada.includes(palavra)) {
        score += 1
      }
    })
    
    // Se score é alto o suficiente e melhor que o anterior, usar este
    if (score > melhorScore && score >= 5) {
      melhorScore = score
      melhorMatch = item
    }
  }
  
  // Se encontrou match com score bom, retornar
  if (melhorMatch) {
    return melhorMatch
  }
  
  // Fallback: Buscar por similaridade (resetar scores)
  melhorMatch = null
  melhorScore = 0
  
  for (const [key, item] of Object.entries(mapa)) {
    // Calcular score baseado em múltiplos fatores
    let score = 0
    
    // Score por palavras-chave
    item.palavras_chave.forEach(pk => {
      const similaridade = calcularSimilaridade(pergunta, pk)
      score += similaridade * 3 // Peso maior para palavras-chave
    })
    
    // Score por título
    const similaridadeTitulo = calcularSimilaridade(pergunta, item.titulo)
    score += similaridadeTitulo * 2
    
    // Score por descrição
    const similaridadeDesc = calcularSimilaridade(pergunta, item.descricao)
    score += similaridadeDesc
    
    if (score > melhorScore && score > 0.5) {
      melhorScore = score
      melhorMatch = item
    }
  }
  
  return melhorMatch
}

/**
 * Busca múltiplas orientações relacionadas
 */
export function buscarOrientacoesRelacionadas(
  pergunta: string,
  mapa: Record<string, OrientacaoItem>,
  limite: number = 3
): OrientacaoItem[] {
  const resultados: Array<{ item: OrientacaoItem; score: number }> = []
  
  for (const [key, item] of Object.entries(mapa)) {
    let score = 0
    
    // Calcular score
    item.palavras_chave.forEach(pk => {
      score += calcularSimilaridade(pergunta, pk) * 3
    })
    score += calcularSimilaridade(pergunta, item.titulo) * 2
    score += calcularSimilaridade(pergunta, item.descricao)
    
    if (score > 0.3) {
      resultados.push({ item, score })
    }
  }
  
  // Ordenar por score e retornar top N
  return resultados
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map(r => r.item)
}

