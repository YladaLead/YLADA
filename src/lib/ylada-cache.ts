import { supabaseAdmin } from '@/lib/supabase-fixed'

export interface CacheEntry {
  id: string
  user_input: string
  user_profile: any
  assistant_response: any
  created_at: string
  usage_count: number
}

export interface TemplateCache {
  id: string
  profession: string
  specialization: string
  objective: string
  tool_type: string
  template_content: any
  success_rate: number
  usage_count: number
  created_at: string
}

export class YLADACache {
  
  // Buscar resposta em cache
  async getCachedResponse(userInput: string, userProfile: any): Promise<CacheEntry | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_response_cache')
        .select('*')
        .eq('user_input', userInput.toLowerCase().trim())
        .eq('user_profile', JSON.stringify(userProfile))
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return null
      }

      // Incrementar contador de uso
      await this.incrementCacheUsage(data.id)

      return data as CacheEntry
    } catch (error) {
      console.error('Erro ao buscar cache:', error)
      return null
    }
  }

  // Salvar resposta no cache
  async saveCachedResponse(
    userInput: string, 
    userProfile: any, 
    assistantResponse: any
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_response_cache')
        .insert({
          user_input: userInput.toLowerCase().trim(),
          user_profile: userProfile,
          assistant_response: assistantResponse,
          usage_count: 1
        })

      if (error) {
        console.error('Erro ao salvar cache:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar cache:', error)
    }
  }

  // Incrementar uso do cache
  async incrementCacheUsage(cacheId: string): Promise<void> {
    try {
      await supabaseAdmin
        .from('ai_response_cache')
        .update({ usage_count: supabaseAdmin.raw('usage_count + 1') })
        .eq('id', cacheId)
    } catch (error) {
      console.error('Erro ao incrementar uso do cache:', error)
    }
  }

  // Buscar template similar
  async getSimilarTemplate(
    profession: string,
    specialization: string,
    objective: string,
    toolType: string
  ): Promise<TemplateCache | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_generated_templates')
        .select('*')
        .eq('profession', profession)
        .eq('specialization', specialization)
        .eq('objective', objective)
        .eq('tool_type', toolType)
        .order('success_rate', { ascending: false })
        .order('usage_count', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        return null
      }

      return data as TemplateCache
    } catch (error) {
      console.error('Erro ao buscar template similar:', error)
      return null
    }
  }

  // Salvar template gerado
  async saveGeneratedTemplate(
    profession: string,
    specialization: string,
    objective: string,
    toolType: string,
    templateContent: any,
    successRate: number = 0.5
  ): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('ai_generated_templates')
        .insert({
          profession,
          specialization,
          objective,
          tool_type: toolType,
          template_content: templateContent,
          success_rate: successRate,
          usage_count: 1
        })

      if (error) {
        console.error('Erro ao salvar template:', error)
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error)
    }
  }

  // Atualizar taxa de sucesso do template
  async updateTemplateSuccessRate(
    templateId: string,
    isSuccessful: boolean
  ): Promise<void> {
    try {
      // Buscar template atual
      const { data: template, error: fetchError } = await supabaseAdmin
        .from('ai_generated_templates')
        .select('success_rate, usage_count')
        .eq('id', templateId)
        .single()

      if (fetchError || !template) {
        return
      }

      // Calcular nova taxa de sucesso
      const currentSuccesses = template.success_rate * template.usage_count
      const newSuccesses = isSuccessful ? currentSuccesses + 1 : currentSuccesses
      const newUsageCount = template.usage_count + 1
      const newSuccessRate = newSuccesses / newUsageCount

      // Atualizar template
      await supabaseAdmin
        .from('ai_generated_templates')
        .update({
          success_rate: newSuccessRate,
          usage_count: newUsageCount
        })
        .eq('id', templateId)

    } catch (error) {
      console.error('Erro ao atualizar taxa de sucesso:', error)
    }
  }

  // Buscar templates populares por profissão
  async getPopularTemplatesByProfession(profession: string): Promise<TemplateCache[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('ai_generated_templates')
        .select('*')
        .eq('profession', profession)
        .order('usage_count', { ascending: false })
        .order('success_rate', { ascending: false })
        .limit(10)

      if (error) {
        return []
      }

      return data as TemplateCache[]
    } catch (error) {
      console.error('Erro ao buscar templates populares:', error)
      return []
    }
  }

  // Limpar cache antigo (manter apenas últimos 30 dias)
  async cleanOldCache(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      await supabaseAdmin
        .from('ai_response_cache')
        .delete()
        .lt('created_at', thirtyDaysAgo.toISOString())

      console.log('Cache antigo limpo com sucesso')
    } catch (error) {
      console.error('Erro ao limpar cache antigo:', error)
    }
  }

  // Estatísticas do cache
  async getCacheStats(): Promise<{
    totalEntries: number
    totalUsage: number
    averageSuccessRate: number
  }> {
    try {
      const { data: cacheStats, error: cacheError } = await supabaseAdmin
        .from('ai_response_cache')
        .select('usage_count')

      const { data: templateStats, error: templateError } = await supabaseAdmin
        .from('ai_generated_templates')
        .select('success_rate, usage_count')

      if (cacheError || templateError) {
        return { totalEntries: 0, totalUsage: 0, averageSuccessRate: 0 }
      }

      const totalEntries = cacheStats?.length || 0
      const totalUsage = cacheStats?.reduce((sum, entry) => sum + entry.usage_count, 0) || 0
      
      const totalTemplateUsage = templateStats?.reduce((sum, template) => sum + template.usage_count, 0) || 0
      const weightedSuccessRate = templateStats?.reduce((sum, template) => 
        sum + (template.success_rate * template.usage_count), 0) || 0
      const averageSuccessRate = totalTemplateUsage > 0 ? weightedSuccessRate / totalTemplateUsage : 0

      return {
        totalEntries,
        totalUsage,
        averageSuccessRate
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas do cache:', error)
      return { totalEntries: 0, totalUsage: 0, averageSuccessRate: 0 }
    }
  }
}

// Instância singleton
export const yladaCache = new YLADACache()
