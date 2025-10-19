import { supabaseAdmin } from '@/lib/supabase-fixed'
import { yladaCache } from './ylada-cache'

export interface LearningData {
  id: string
  user_input: string
  user_profile: any
  assistant_response: any
  user_feedback: 'positive' | 'negative' | 'neutral'
  success_metrics: {
    clicks?: number
    conversions?: number
    time_spent?: number
    completion_rate?: number
  }
  created_at: string
}

export interface PatternAnalysis {
  profession: string
  commonInputs: string[]
  successfulResponses: string[]
  failurePatterns: string[]
  improvementSuggestions: string[]
}

export class YLADALearning {
  
  // Salvar dados de aprendizado
  async saveLearningData(
    userInput: string,
    userProfile: any,
    assistantResponse: any,
    userFeedback: 'positive' | 'negative' | 'neutral' = 'neutral',
    successMetrics: any = {}
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ia_learning')
        .insert({
          user_input: userInput,
          user_profile: userProfile,
          assistant_response: assistantResponse,
          user_feedback: userFeedback,
          success_metrics: successMetrics
        })

      if (error) {
        console.error('Erro ao salvar dados de aprendizado:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar dados de aprendizado:', error)
    }
  }

  // Analisar padrões por profissão
  async analyzePatternsByProfession(profession: string): Promise<PatternAnalysis> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ia_learning')
        .select('*')
        .eq('user_profile->>profissao', profession)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error || !data) {
        return {
          profession,
          commonInputs: [],
          successfulResponses: [],
          failurePatterns: [],
          improvementSuggestions: []
        }
      }

      const learningData = data as LearningData[]
      
      // Analisar inputs comuns
      const inputCounts: { [key: string]: number } = {}
      learningData.forEach(entry => {
        const input = entry.user_input.toLowerCase()
        inputCounts[input] = (inputCounts[input] || 0) + 1
      })
      
      const commonInputs = Object.entries(inputCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([input]) => input)

      // Analisar respostas bem-sucedidas
      const positiveEntries = learningData.filter(entry => entry.user_feedback === 'positive')
      const successfulResponses = positiveEntries
        .map(entry => entry.assistant_response.message)
        .slice(0, 5)

      // Analisar padrões de falha
      const negativeEntries = learningData.filter(entry => entry.user_feedback === 'negative')
      const failurePatterns = negativeEntries
        .map(entry => entry.user_input)
        .slice(0, 5)

      // Gerar sugestões de melhoria
      const improvementSuggestions = this.generateImprovementSuggestions(
        commonInputs,
        successfulResponses,
        failurePatterns
      )

      return {
        profession,
        commonInputs,
        successfulResponses,
        failurePatterns,
        improvementSuggestions
      }
    } catch (error) {
      console.error('Erro ao analisar padrões:', error)
      return {
        profession,
        commonInputs: [],
        successfulResponses: [],
        failurePatterns: [],
        improvementSuggestions: []
      }
    }
  }

  // Gerar sugestões de melhoria
  private generateImprovementSuggestions(
    commonInputs: string[],
    successfulResponses: string[],
    failurePatterns: string[]
  ): string[] {
    const suggestions: string[] = []

    // Sugestão baseada em inputs comuns
    if (commonInputs.length > 0) {
      suggestions.push(`Criar templates pré-definidos para: ${commonInputs.slice(0, 3).join(', ')}`)
    }

    // Sugestão baseada em respostas bem-sucedidas
    if (successfulResponses.length > 0) {
      suggestions.push('Replicar padrões de respostas bem-sucedidas em novos templates')
    }

    // Sugestão baseada em falhas
    if (failurePatterns.length > 0) {
      suggestions.push(`Melhorar tratamento para: ${failurePatterns.slice(0, 2).join(', ')}`)
    }

    // Sugestões gerais
    suggestions.push('Implementar mais validações de entrada')
    suggestions.push('Adicionar mais opções de personalização')

    return suggestions
  }

  // Buscar insights de performance
  async getPerformanceInsights(): Promise<{
    totalInteractions: number
    positiveFeedbackRate: number
    averageResponseTime: number
    topProfessions: Array<{ profession: string; count: number }>
    improvementAreas: string[]
  }> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ia_learning')
        .select('*')

      if (error || !data) {
        return {
          totalInteractions: 0,
          positiveFeedbackRate: 0,
          averageResponseTime: 0,
          topProfessions: [],
          improvementAreas: []
        }
      }

      const learningData = data as LearningData[]
      
      // Calcular métricas básicas
      const totalInteractions = learningData.length
      const positiveFeedback = learningData.filter(entry => entry.user_feedback === 'positive').length
      const positiveFeedbackRate = totalInteractions > 0 ? positiveFeedback / totalInteractions : 0

      // Calcular tempo médio de resposta (simulado)
      const averageResponseTime = 1.5 // segundos

      // Top profissões
      const professionCounts: { [key: string]: number } = {}
      learningData.forEach(entry => {
        const profession = entry.user_profile?.profissao || 'Desconhecida'
        professionCounts[profession] = (professionCounts[profession] || 0) + 1
      })

      const topProfessions = Object.entries(professionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([profession, count]) => ({ profession, count }))

      // Áreas de melhoria
      const improvementAreas = [
        'Reduzir tempo de resposta',
        'Melhorar precisão das sugestões',
        'Aumentar taxa de conversão',
        'Expandir base de templates'
      ]

      return {
        totalInteractions,
        positiveFeedbackRate,
        averageResponseTime,
        topProfessions,
        improvementAreas
      }
    } catch (error) {
      console.error('Erro ao obter insights de performance:', error)
      return {
        totalInteractions: 0,
        positiveFeedbackRate: 0,
        averageResponseTime: 0,
        topProfessions: [],
        improvementAreas: []
      }
    }
  }

  // Aprender com feedback do usuário
  async learnFromFeedback(
    templateId: string,
    userFeedback: 'positive' | 'negative' | 'neutral',
    successMetrics: any = {}
  ): Promise<void> {
    try {
      // Atualizar taxa de sucesso do template
      await yladaCache.updateTemplateSuccessRate(templateId, userFeedback === 'positive')

      // Salvar dados de aprendizado
      await this.saveLearningData(
        'feedback',
        { templateId },
        { feedback: userFeedback },
        userFeedback,
        successMetrics
      )

      console.log(`📚 Aprendizado salvo: ${userFeedback} para template ${templateId}`)
    } catch (error) {
      console.error('Erro ao aprender com feedback:', error)
    }
  }

  // Gerar relatório de aprendizado
  async generateLearningReport(): Promise<{
    summary: string
    recommendations: string[]
    nextActions: string[]
  }> {
    try {
      const insights = await this.getPerformanceInsights()
      
      const summary = `
        📊 RELATÓRIO DE APRENDIZADO YLADA
        
        Total de Interações: ${insights.totalInteractions}
        Taxa de Feedback Positivo: ${(insights.positiveFeedbackRate * 100).toFixed(1)}%
        Tempo Médio de Resposta: ${insights.averageResponseTime}s
        
        Top Profissões:
        ${insights.topProfessions.map(p => `- ${p.profession}: ${p.count} interações`).join('\n')}
      `

      const recommendations = [
        'Implementar mais templates para profissões populares',
        'Otimizar respostas baseado em feedback positivo',
        'Melhorar tratamento de casos com feedback negativo',
        'Expandir sistema de cache para economizar IA'
      ]

      const nextActions = [
        'Analisar padrões de falha em detalhes',
        'Criar templates automáticos baseados em sucessos',
        'Implementar sistema de A/B testing',
        'Expandir base de dados de aprendizado'
      ]

      return {
        summary,
        recommendations,
        nextActions
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      return {
        summary: 'Erro ao gerar relatório',
        recommendations: [],
        nextActions: []
      }
    }
  }
}

// Instância singleton
export const yladaLearning = new YLADALearning()
