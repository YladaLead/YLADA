/**
 * NOEL WELLNESS - Analisador de Histórico
 * 
 * Analisa histórico do consultor para orientação personalizada
 * Focado em marketing multinível Herbalife
 */

import { supabaseAdmin } from '@/lib/supabase'

export interface ConsultantProfile {
  careerStage: 'iniciante' | 'desenvolvimento' | 'lideranca' | 'master'
  careerStageConfidence: number
  mainChallenges: string[]
  frequentTopics: string[]
  engagementLevel: 'baixo' | 'medio' | 'alto' | 'muito_alto'
  consistencyScore: number
  totalQueries: number
  queriesLast30Days: number
}

export interface QueryAnalysis {
  topic?: string
  challenge?: string
  careerStage?: 'iniciante' | 'desenvolvimento' | 'lideranca' | 'master'
  priorityArea?: string
  sentiment?: 'positivo' | 'neutro' | 'frustrado' | 'dúvida' | 'motivado'
}

/**
 * Analisa uma query individual para extrair informações
 */
export function analyzeQuery(query: string, module: 'mentor' | 'suporte' | 'tecnico'): QueryAnalysis {
  const lowerQuery = query.toLowerCase()
  const analysis: QueryAnalysis = {}

  // Detectar tópico
  const topics = {
    'pv': /pv|volume|pontos/i,
    'vendas': /vender|vendas|venda|cliente|clientes/i,
    'recrutamento': /recrutar|recrutamento|equipe|time|patrocinar|convidar/i,
    'lideranca': /liderança|liderar|equipe|time|duplicação/i,
    'metas': /meta|metas|objetivo|objetivos/i,
    'shake': /shake|bebida|herbalife|preparo/i,
    'produtos': /produto|produtos|catálogo|campanha/i,
    'scripts': /script|scripts|mensagem|texto|o que falar/i,
    'sistema': /sistema|plataforma|ferramenta|como usar/i,
    'organização': /organizar|organização|rotina|planejamento/i,
  }

  for (const [topic, pattern] of Object.entries(topics)) {
    if (pattern.test(query)) {
      analysis.topic = topic
      break
    }
  }

  // Detectar desafio
  const challenges = {
    'falta_clientes': /(não|sem|falta).*(cliente|venda|vender)/i,
    'dificuldade_vendas': /(dificuldade|não consigo|não sei).*(vender|venda)/i,
    'recrutamento_lento': /(não|dificuldade).*(recrutar|convidar|equipe)/i,
    'organização': /(desorganizado|organizar|organização|rotina)/i,
    'motivação': /(desmotivado|motivação|motivado|motivar)/i,
    'metas': /(não|dificuldade).*(atingir|alcançar|meta)/i,
    'conhecimento_produtos': /(não sei|dúvida|como).*(produto|shake|bebida)/i,
    'scripts': /(não sei|dúvida|como).*(falar|dizer|abordar|script)/i,
  }

  for (const [challenge, pattern] of Object.entries(challenges)) {
    if (pattern.test(query)) {
      analysis.challenge = challenge
      break
    }
  }

  // Detectar estágio da carreira (baseado em palavras-chave)
  if (/equipe|time|liderança|duplicação|patrocinar/i.test(query)) {
    analysis.careerStage = 'lideranca'
  } else if (/recrutar|convidar|começar|iniciar/i.test(query)) {
    analysis.careerStage = 'desenvolvimento'
  } else if (/master|elite|top/i.test(query)) {
    analysis.careerStage = 'master'
  } else {
    analysis.careerStage = 'iniciante'
  }

  // Detectar área prioritária
  if (module === 'mentor') {
    analysis.priorityArea = 'estrategia'
  } else if (module === 'suporte') {
    analysis.priorityArea = 'sistema'
  } else {
    analysis.priorityArea = 'conteudo'
  }

  // Detectar sentimento
  if (/(frustrado|difícil|não consigo|problema|erro)/i.test(query)) {
    analysis.sentiment = 'frustrado'
  } else if (/(dúvida|não sei|como|qual)/i.test(query)) {
    analysis.sentiment = 'dúvida'
  } else if (/(motivado|animado|ótimo|bom|sucesso)/i.test(query)) {
    analysis.sentiment = 'motivado'
  } else if (/(preciso|quero|gostaria)/i.test(query)) {
    analysis.sentiment = 'positivo'
  } else {
    analysis.sentiment = 'neutro'
  }

  return analysis
}

/**
 * Busca perfil do consultor
 */
export async function getConsultantProfile(userId: string): Promise<ConsultantProfile | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('wellness_consultant_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      careerStage: data.career_stage as ConsultantProfile['careerStage'],
      careerStageConfidence: data.career_stage_confidence,
      mainChallenges: data.main_challenges || [],
      frequentTopics: data.frequent_topics || [],
      engagementLevel: data.engagement_level as ConsultantProfile['engagementLevel'],
      consistencyScore: data.consistency_score,
      totalQueries: data.total_queries,
      queriesLast30Days: data.queries_last_30_days,
      recommendations: data.recommendations,
    }
  } catch (error) {
    console.error('❌ Erro ao buscar perfil do consultor:', error)
    return null
  }
}

/**
 * Salva análise da query no banco
 */
export async function saveQueryAnalysis(
  userId: string,
  query: string,
  analysis: QueryAnalysis,
  module: 'mentor' | 'suporte' | 'tecnico'
): Promise<void> {
  try {
    // Buscar última query do usuário para atualizar
    const { data: lastQuery } = await supabaseAdmin
      .from('wellness_user_queries')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (lastQuery) {
      await supabaseAdmin
        .from('wellness_user_queries')
        .update({
          detected_topic: analysis.topic,
          detected_challenge: analysis.challenge,
          career_stage: analysis.careerStage,
          priority_area: analysis.priorityArea,
          sentiment: analysis.sentiment,
        })
        .eq('id', lastQuery.id)
    }
  } catch (error) {
    console.error('❌ Erro ao salvar análise da query:', error)
  }
}

/**
 * Gera contexto personalizado baseado no perfil do consultor
 */
export function generatePersonalizedContext(profile: ConsultantProfile | null): string {
  if (!profile) {
    return ''
  }

  const contextParts: string[] = []

  // Contexto do estágio da carreira
  contextParts.push(`Estágio da carreira: ${profile.careerStage} (confiança: ${Math.round(profile.careerStageConfidence * 100)}%)`)

  // Desafios principais
  if (profile.mainChallenges.length > 0) {
    contextParts.push(`Desafios identificados: ${profile.mainChallenges.join(', ')}`)
  }

  // Tópicos frequentes
  if (profile.frequentTopics.length > 0) {
    contextParts.push(`Áreas de maior interesse: ${profile.frequentTopics.join(', ')}`)
  }

  // Nível de engajamento
  contextParts.push(`Nível de engajamento: ${profile.engagementLevel}`)
  contextParts.push(`Consistência: ${Math.round(profile.consistencyScore * 100)}%`)

  return contextParts.join('\n')
}

/**
 * Gera sugestões proativas baseadas no perfil
 */
export function generateProactiveSuggestions(profile: ConsultantProfile | null): string[] {
  if (!profile) {
    return []
  }

  const suggestions: string[] = []

  // Sugestões baseadas em desafios
  if (profile.mainChallenges.includes('falta_clientes')) {
    suggestions.push('Como aumentar minha base de clientes?')
  }
  if (profile.mainChallenges.includes('dificuldade_vendas')) {
    suggestions.push('Técnicas para melhorar minhas vendas')
  }
  if (profile.mainChallenges.includes('recrutamento_lento')) {
    suggestions.push('Como acelerar meu recrutamento?')
  }

  // Sugestões baseadas no estágio
  if (profile.careerStage === 'iniciante') {
    suggestions.push('Por onde começar no negócio?')
    suggestions.push('Como preparar shake Herbalife?')
  } else if (profile.careerStage === 'desenvolvimento') {
    suggestions.push('Como estruturar minha equipe?')
    suggestions.push('Estratégias para aumentar PV')
  } else if (profile.careerStage === 'lideranca') {
    suggestions.push('Como desenvolver líderes na equipe?')
    suggestions.push('Estratégias avançadas de duplicação')
  }

  // Sugestões baseadas em engajamento
  if (profile.consistencyScore < 0.5) {
    suggestions.push('Como criar uma rotina consistente?')
  }

  return suggestions.slice(0, 3) // máximo 3 sugestões
}

