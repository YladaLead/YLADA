/**
 * POST /api/noel/getFerramentaInfo
 * 
 * Função para NOEL buscar informações de ferramentas/calculadoras/quizzes
 * Busca por template_slug ou slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl, buildCoachBemEstarToolUrl } from '@/lib/url-utils'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { ferramenta_slug, user_id } = body

    console.log('🔍 [getFerramentaInfo] Parâmetros recebidos:', { ferramenta_slug, user_id })

    // Validar parâmetros
    if (!ferramenta_slug || typeof ferramenta_slug !== 'string') {
      console.warn('⚠️ [getFerramentaInfo] ferramenta_slug inválido:', ferramenta_slug)
      return NextResponse.json(
        { 
          success: false, 
          error: 'ferramenta_slug é obrigatório e deve ser uma string',
          message: 'Por favor, especifique qual ferramenta você precisa. Exemplos: "calculadora-agua", "calculadora-proteina", "calc-hidratacao"'
        },
        { status: 400 }
      )
    }

    if (!ferramenta_slug) {
      console.warn('⚠️ [getFerramentaInfo] ferramenta_slug faltando')
      return NextResponse.json(
        { 
          success: false, 
          error: 'ferramenta_slug é obrigatório',
          message: 'Por favor, especifique qual ferramenta você precisa. Exemplos: "calculadora-agua", "calculadora-proteina", "calc-hidratacao"'
        },
        { status: 400 }
      )
    }

    // Primeiro tentar buscar template base
    console.log('🔍 [getFerramentaInfo] Buscando template com slug:', ferramenta_slug)
    const { data: templateBase, error: templateError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('slug', ferramenta_slug)
      .eq('is_active', true)
      .maybeSingle()

    if (templateError) {
      console.error('❌ [getFerramentaInfo] Erro ao buscar template:', templateError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao buscar ferramenta no banco de dados',
          details: templateError.message
        },
        { status: 500 }
      )
    }

    if (templateBase && !templateError) {
      console.log('✅ [getFerramentaInfo] Template encontrado:', templateBase.name)
      // Template base encontrado
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
      
      // Se tiver user_id, tentar buscar ferramenta personalizada
      let link = ''
      let scriptApresentacao = ''
      let profile: { user_slug: string } | null = null
      
      if (user_id) {
        // Buscar user_slug
        console.log('🔍 [getFerramentaInfo] Buscando user_slug para user_id:', user_id)
        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug, profession')
          .eq('user_id', user_id)
          .maybeSingle()
        
        profile = profileData || null
        
        if (profileError) {
          console.warn('⚠️ [getFerramentaInfo] Erro ao buscar profile (continuando sem user_slug):', profileError.message)
        }
        
        if (profile?.user_slug) {
          console.log('✅ [getFerramentaInfo] user_slug encontrado:', profile.user_slug)
          try {
            // Normalizar o template_slug para buscar todas as variações
            let templateSlugNormalizado = ''
            try {
              templateSlugNormalizado = normalizeTemplateSlug(ferramenta_slug, 'wellness')
            } catch (normalizeError: any) {
              console.warn('⚠️ [getFerramentaInfo] Erro ao normalizar slug, usando original:', normalizeError)
              templateSlugNormalizado = ferramenta_slug
            }
            console.log('🔍 [getFerramentaInfo] Buscando ferramentas com template_slug normalizado:', {
              ferramenta_slug_original: ferramenta_slug,
              template_slug_normalizado: templateSlugNormalizado
            })
            
            // Buscar TODAS as ferramentas do usuário relacionadas a este template
            // IMPORTANTE: Buscar por TODAS as variações possíveis para garantir que encontramos a ferramenta
            // Isso cobre casos onde o usuário tem múltiplas ferramentas (agua, calculadora-de-agua, water, etc)
            
            console.log('🔍 [getFerramentaInfo] Buscando TODAS as ferramentas relacionadas:', {
              ferramenta_slug_original: ferramenta_slug,
              template_slug_normalizado: templateSlugNormalizado,
              user_id
            })
            
            // Fazer múltiplas queries e combinar resultados para garantir que encontramos todas
            // Inclui 'coach-bem-estar' para cobrir usuários dessa área
            const professions = ['wellness', 'coach-bem-estar']

            const [result1, result2, result3, result4, result5] = await Promise.all([
              // 1. Buscar por template_slug original (ex: "calculadora-agua")
              supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, title, custom_whatsapp_message, description, created_at, profession')
                .eq('user_id', user_id)
                .in('profession', professions)
                .eq('status', 'active')
                .eq('template_slug', ferramenta_slug),
              // 2. Buscar por template_slug normalizado (ex: "calc-hidratacao")
              supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, title, custom_whatsapp_message, description, created_at, profession')
                .eq('user_id', user_id)
                .in('profession', professions)
                .eq('status', 'active')
                .eq('template_slug', templateSlugNormalizado),
              // 3. Buscar por slug original (ex: "calculadora-agua")
              supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, title, custom_whatsapp_message, description, created_at, profession')
                .eq('user_id', user_id)
                .in('profession', professions)
                .eq('status', 'active')
                .eq('slug', ferramenta_slug),
              // 4. Buscar por slug normalizado (ex: "calc-hidratacao")
              supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, title, custom_whatsapp_message, description, created_at, profession')
                .eq('user_id', user_id)
                .in('profession', professions)
                .eq('status', 'active')
                .eq('slug', templateSlugNormalizado),
              // 5. Buscar TODAS as ferramentas do usuário (fallback - para garantir que não perdemos nenhuma)
              supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug, title, custom_whatsapp_message, description, created_at, profession')
                .eq('user_id', user_id)
                .in('profession', professions)
                .eq('status', 'active')
            ])
            
            // Combinar todos os resultados e remover duplicatas
            const todasFerramentasUnicas = new Map<string, any>()
            const todosResultados = [
              ...(result1.data || []),
              ...(result2.data || []),
              ...(result3.data || []),
              ...(result4.data || []),
              ...(result5.data || []) // Todas as ferramentas (para filtro manual depois)
            ]
            
            // Filtrar apenas ferramentas que correspondem ao template buscado
            const ferramentasRelacionadas = todosResultados.filter(ferramenta => {
              if (!ferramenta || !ferramenta.slug) return false
              
              try {
                const templateMatch = ferramenta.template_slug === ferramenta_slug || 
                                     ferramenta.template_slug === templateSlugNormalizado ||
                                     (ferramenta.template_slug && normalizeTemplateSlug(ferramenta.template_slug, 'wellness') === templateSlugNormalizado)
                const slugMatch = ferramenta.slug === ferramenta_slug || 
                                 ferramenta.slug === templateSlugNormalizado ||
                                 (ferramenta.slug && normalizeTemplateSlug(ferramenta.slug, 'wellness') === templateSlugNormalizado)
                return templateMatch || slugMatch
              } catch (error) {
                console.warn('⚠️ [getFerramentaInfo] Erro ao filtrar ferramenta:', error)
                // Em caso de erro, incluir se pelo menos o slug ou template_slug corresponder diretamente
                return ferramenta.slug === ferramenta_slug || 
                       ferramenta.slug === templateSlugNormalizado ||
                       ferramenta.template_slug === ferramenta_slug ||
                       ferramenta.template_slug === templateSlugNormalizado
              }
            })
            
            ferramentasRelacionadas.forEach(ferramenta => {
              // Usar slug como chave única para evitar duplicatas
              if (!todasFerramentasUnicas.has(ferramenta.slug)) {
                todasFerramentasUnicas.set(ferramenta.slug, ferramenta)
              }
            })
            
            const todasFerramentas = Array.from(todasFerramentasUnicas.values())
            const ferramentasError = result1.error || result2.error || result3.error || result4.error || result5.error
            
            console.log('📊 [getFerramentaInfo] Resultado da busca:', {
              total_encontradas: todasFerramentas.length,
              ferramentas: todasFerramentas.map(f => ({
                slug: f.slug,
                template_slug: f.template_slug,
                title: f.title
              }))
            })
            
            if (ferramentasError) {
              console.warn('⚠️ [getFerramentaInfo] Erro ao buscar ferramentas:', ferramentasError.message)
            }
            
            // Função para priorizar a melhor ferramenta
            const escolherMelhorFerramenta = (ferramentas: any[]) => {
              if (!ferramentas || ferramentas.length === 0) return null
              
              // Priorizar:
              // 1. Slug mais curto (ex: "agua" > "calculadora-de-agua")
              // 2. Template_slug que corresponde exatamente ao normalizado
              // 3. Mais recente
              
              return ferramentas.sort((a, b) => {
                // Prioridade 1: Slug mais curto
                const lengthDiff = a.slug.length - b.slug.length
                if (lengthDiff !== 0) return lengthDiff
                
                // Prioridade 2: Template_slug que corresponde ao normalizado
                const aMatches = a.template_slug === templateSlugNormalizado || a.template_slug === ferramenta_slug
                const bMatches = b.template_slug === templateSlugNormalizado || b.template_slug === ferramenta_slug
                if (aMatches && !bMatches) return -1
                if (!aMatches && bMatches) return 1
                
                // Prioridade 3: Mais recente
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
              })[0]
            }
            
            const ferramentaEscolhida = escolherMelhorFerramenta(todasFerramentas || [])
            
            if (ferramentaEscolhida && ferramentaEscolhida.slug) {
              try {
                // ✅ CRÍTICO: SEMPRE usar o slug da ferramenta (NUNCA usar template_slug no link)
                const toolSlugParaLink = ferramentaEscolhida.slug
                // Usar URL builder correto conforme a área do usuário
                const isCoachBemEstar =
                  ferramentaEscolhida.profession === 'coach-bem-estar' ||
                  (profile as any)?.profession === 'coach-bem-estar'
                link = isCoachBemEstar
                  ? buildCoachBemEstarToolUrl(profile.user_slug, toolSlugParaLink)
                  : buildWellnessToolUrl(profile.user_slug, toolSlugParaLink)
                console.log('✅ [getFerramentaInfo] Link gerado com ferramenta escolhida:', {
                  user_slug: profile.user_slug,
                  tool_slug_usado: toolSlugParaLink, // ✅ Slug usado no link
                  tool_slug_ferramenta: ferramentaEscolhida.slug,
                  template_slug: ferramentaEscolhida.template_slug,
                  title: ferramentaEscolhida.title,
                  total_encontradas: todasFerramentas?.length || 0,
                  link_gerado: link,
                  aviso: 'Link usa tool_slug, NÃO template_slug'
                })
                scriptApresentacao = ferramentaEscolhida.custom_whatsapp_message || 
                                     ferramentaEscolhida.description || 
                                     templateBase.whatsapp_message || 
                                     `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
              } catch (urlError: any) {
                console.error('❌ [getFerramentaInfo] Erro ao gerar link personalizado:', urlError)
                // Continuar sem link personalizado
              }
            } else {
              // Não encontrou nenhuma ferramenta, usar template base (sem user_slug)
              console.log('⚠️ [getFerramentaInfo] Nenhuma ferramenta personalizada encontrada, usando template base')
              // Link será gerado no fallback abaixo
            }
          } catch (error: any) {
            console.error('❌ [getFerramentaInfo] Erro ao processar user_slug:', error)
            // Continuar sem link personalizado
          }
        }
      }
      
      // Se não tiver link ainda, tentar buscar ferramenta genérica com slug correto
      if (!link) {
        console.log('⚠️ [getFerramentaInfo] Nenhuma ferramenta personalizada encontrada, tentando buscar ferramenta genérica')
        
        // Normalizar template_slug para buscar ferramenta genérica
        let templateSlugNormalizadoFallback = ''
        try {
          templateSlugNormalizadoFallback = normalizeTemplateSlug(ferramenta_slug, 'wellness')
        } catch (normalizeError: any) {
          console.warn('⚠️ [getFerramentaInfo] Erro ao normalizar slug no fallback, usando original:', normalizeError)
          templateSlugNormalizadoFallback = ferramenta_slug
        }
        
        // Tentar buscar ferramenta genérica que tenha um slug válido
        // Buscar por template_slug normalizado primeiro
        const { data: ferramentaGenerica } = await supabaseAdmin
          .from('wellness_ferramentas')
          .select('id, slug, template_slug')
          .eq('template_slug', templateSlugNormalizadoFallback || ferramenta_slug)
          .eq('status', 'active')
          .maybeSingle()
        
        if (ferramentaGenerica?.id && ferramentaGenerica?.slug) {
          // Se tiver user_slug, usar formato personalizado com URL builder correto
          if (profile?.user_slug) {
            const isCoachFallback = (profile as any)?.profession === 'coach-bem-estar'
            link = isCoachFallback
              ? buildCoachBemEstarToolUrl(profile.user_slug, ferramentaGenerica.slug)
              : buildWellnessToolUrl(profile.user_slug, ferramentaGenerica.slug)
            console.log('✅ [getFerramentaInfo] Link genérico encontrado com user_slug:', link)
          } else {
            // Sem user_slug, usar formato de fallback com ID
            link = `${baseUrl}/pt/wellness/ferramenta/${ferramentaGenerica.id}`
            console.log('✅ [getFerramentaInfo] Link genérico encontrado via wellness_ferramentas (sem user_slug):', link)
          }
        } else {
          // Se não encontrou ferramenta genérica, não gerar link incorreto
          // Retornar null para que o NOEL saiba que não há link disponível
          console.warn('⚠️ [getFerramentaInfo] Nenhuma ferramenta encontrada (nem personalizada nem genérica). Não gerando link.')
          link = null
        }
        
        scriptApresentacao = templateBase.whatsapp_message || 
                             templateBase.description || 
                             `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
      }
      
      console.log('✅ [getFerramentaInfo] Link gerado:', link)

      // Determinar quando usar baseado no tipo
      const quandoUsar = templateBase.type === 'calculadora' 
        ? `Use para pessoas que precisam calcular ${templateBase.name.toLowerCase()}.`
        : templateBase.type === 'quiz'
        ? `Use para engajar leads e descobrir necessidades relacionadas a ${templateBase.name.toLowerCase()}.`
        : `Use quando precisar de uma ferramenta de ${templateBase.name.toLowerCase()}.`

      return NextResponse.json({
        success: true,
        data: {
          slug: templateBase.slug,
          titulo: templateBase.name,
          descricao: templateBase.description || '',
          tipo: templateBase.type,
          link: link,
          script_apresentacao: scriptApresentacao,
          quando_usar: quandoUsar
        }
      })
    }

    // Se não encontrou template base, retornar erro
    console.warn('⚠️ [getFerramentaInfo] Template não encontrado com slug:', ferramenta_slug)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Ferramenta não encontrada',
        message: `Não foi possível encontrar uma ferramenta com o slug "${ferramenta_slug}". Verifique se o slug está correto.`
      },
      { status: 404 }
    )
  } catch (error: any) {
    console.error('❌ [getFerramentaInfo] Erro geral:', error)
    console.error('❌ [getFerramentaInfo] Stack:', error?.stack)
    console.error('❌ [getFerramentaInfo] Erro completo:', JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar ferramenta',
        message: 'Desculpe, tive um problema técnico ao buscar essa ferramenta. Tente novamente em alguns instantes.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
