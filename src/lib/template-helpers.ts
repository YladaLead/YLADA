/**
 * Helpers reutilizáveis para validação e manipulação de templates
 * Use estas funções em todas as áreas (wellness, nutri, etc) para garantir consistência
 */

import { supabaseAdmin } from './supabase'
import { normalizeTemplateSlug } from './template-slug-map'

/**
 * Gera um slug a partir de um nome (normaliza texto para URL)
 * Usado para gerar slugs de templates e ferramentas
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-') // Substitui tudo que não é letra/número por hífen
    .replace(/-+/g, '-') // Remove múltiplos hífens seguidos
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
}

/**
 * Busca um template pelo slug
 * PRIORIDADE: 1) slug do banco, 2) slug gerado do name
 * 
 * @param templateSlug - O slug do template
 * @param profession - A profissão/área do template (ex: 'wellness', 'nutri')
 * @param language - O idioma do template (ex: 'pt', 'en')
 * @returns O template encontrado ou null se não existir
 */
export async function findTemplateBySlug(
  templateSlug: string,
  profession?: string,
  language: string = 'pt'
): Promise<{ id: string; name: string; slug?: string; content: any; profession?: string; language?: string } | null> {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin não configurado')
  }

  try {
    // Tentar buscar com filtro de profession se fornecido
    let query = supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, slug, content, profession, language')
      .eq('is_active', true)
      .eq('language', language)

    if (profession) {
      query = query.eq('profession', profession)
    }

    const { data: templates, error: templatesError } = await query

    if (templatesError) {
      // Se profession não existir, buscar sem filtro
      if (templatesError.message?.includes('profession') || templatesError.code === '42703') {
        const { data: allTemplates, error: allTemplatesError } = await supabaseAdmin
          .from('templates_nutrition')
          .select('id, name, slug, content, profession, language')
          .eq('is_active', true)
          .eq('language', language)

        if (allTemplatesError) {
          throw allTemplatesError
        }

        // ✅ PRIORIDADE 1: Buscar pelo slug do banco
        let template = (allTemplates || []).find(t => t.slug === templateSlug)
        
        // ✅ PRIORIDADE 2: Se não encontrou, buscar pelo slug gerado do name
        if (!template) {
          template = (allTemplates || []).find(t => {
            const slugFromName = generateSlugFromName(t.name)
            return slugFromName === templateSlug
          })
        }

        return template || null
      }
      throw templatesError
    }

    // ✅ PRIORIDADE 1: Buscar pelo slug do banco
    let template = (templates || []).find(t => t.slug === templateSlug)
    
    // ✅ PRIORIDADE 2: Se não encontrou, buscar pelo slug gerado do name
    if (!template) {
      template = (templates || []).find(t => {
        const slugFromName = generateSlugFromName(t.name)
        return slugFromName === templateSlug
      })
    }

    return template || null
  } catch (error) {
    console.error('Erro ao buscar template por slug:', error)
    throw error
  }
}

/**
 * Valida e trata erros de inserção no banco de dados
 * Retorna mensagens amigáveis em português
 */
export function handleDatabaseInsertError(error: any): {
  error: string
  status: number
  technical?: string
  code?: string
  hint?: string
} {
  // Erro de coluna não encontrada
  if (error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('does not exist')) {
    return {
      error: 'Estamos atualizando o sistema. Por favor, execute o script SQL de atualização e tente novamente.',
      status: 500,
      technical: error?.message,
      code: error?.code,
      hint: error?.hint
    }
  }

  // Erro de foreign key violation
  if (error?.code === '23503' || error?.message?.includes('foreign key') || error?.message?.includes('violates foreign key constraint')) {
    // Verificar se é problema com user_id
    if (error?.message?.includes('user_id') || error?.details?.includes('user_id')) {
      return {
        error: 'Erro de autenticação. Por favor, faça login novamente e tente criar a ferramenta.',
        status: 401,
        technical: error?.message,
        code: error?.code
      }
    }

    // Verificar se é problema com template_id
    if (error?.message?.includes('template_id') || error?.details?.includes('template_id')) {
      return {
        error: 'Template não encontrado ou inválido. Por favor, selecione outro template.',
        status: 400,
        technical: error?.message,
        code: error?.code
      }
    }

    return {
      error: 'Não foi possível salvar. Verifique se todos os dados estão corretos e se você tem permissão para criar esta ferramenta.',
      status: 400,
      technical: error?.message,
      code: error?.code,
      hint: error?.hint
    }
  }

  // Erro de duplicado/unique
  if (error?.code === '23505' || error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
    return {
      error: 'Este nome já está em uso. Escolha outro.',
      status: 409,
      technical: error?.message,
      code: error?.code
    }
  }

  // Erro genérico
  return {
    error: 'Ops! Algo deu errado. Tente novamente ou entre em contato com o suporte se o problema persistir.',
    status: 500,
    technical: error?.message,
    code: error?.code
  }
}

/**
 * Valida se um template existe antes de criar uma ferramenta
 * Retorna o template_id e o slug canônico se encontrado, ou null se não existir
 */
export async function validateTemplateBeforeCreate(
  templateSlug: string | null | undefined,
  templateId: string | null | undefined,
  profession?: string,
  language: string = 'pt'
): Promise<{ templateId: string | null; templateSlug: string | null; error?: string }> {
  // Se tem template_id, buscar direto pelo ID e retornar o slug do banco
  if (templateId) {
    try {
      const { data: template } = await supabaseAdmin
        .from('templates_nutrition')
        .select('id, slug, name')
        .eq('id', templateId)
        .maybeSingle()
      
      if (!template) {
        return {
          templateId: null,
          templateSlug: null,
          error: 'Template não encontrado. Por favor, selecione outro template.'
        }
      }
      
      // Retornar slug do banco se existir, senão normalizar do nome
      const slugCanonico = template.slug || normalizeTemplateSlug(template.name)
      
      return { 
        templateId: template.id,
        templateSlug: slugCanonico
      }
    } catch (error: any) {
      return {
        templateId: null,
        templateSlug: null,
        error: 'Erro ao buscar template. Verifique se o template selecionado existe.'
      }
    }
  }

  // Se tem template_slug, buscar pelo slug
  if (templateSlug) {
    const template = await findTemplateBySlug(templateSlug, profession, language)
    
    if (!template) {
      return {
        templateId: null,
        templateSlug: null,
        error: `Template "${templateSlug}" não encontrado. Por favor, selecione outro template.`
      }
    }

    // Verificar se o template é da profissão correta (se especificado)
    if (profession && template.profession && template.profession !== profession) {
      console.warn(`⚠️ Template ${templateSlug} não é do tipo ${profession} (é ${template.profession})`)
    }

    // Retornar slug do banco se existir, senão normalizar do nome
    const slugCanonico = template.slug || normalizeTemplateSlug(template.name)

    return { 
      templateId: template.id,
      templateSlug: slugCanonico
    }
  }

  // Se não tem nem template_id nem template_slug, retornar null (é válido criar sem template)
  return { templateId: null, templateSlug: null }
}

