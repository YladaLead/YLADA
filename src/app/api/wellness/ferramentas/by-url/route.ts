import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { FluxoCliente } from '@/types/wellness-system'

// Função para normalizar slug (igual à usada no frontend)
function normalizarSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Função para encontrar fluxo pelo slug normalizado
function encontrarFluxoPorSlug(slug: string): { fluxo: FluxoCliente; tipo: 'recrutamento' | 'vendas' } | null {
  const slugNormalizado = normalizarSlug(slug)
  
  // Buscar em fluxos de recrutamento
  for (const fluxo of fluxosRecrutamento) {
    const fluxoSlug = normalizarSlug(fluxo.nome)
    if (fluxoSlug === slugNormalizado) {
      return { fluxo, tipo: 'recrutamento' }
    }
  }
  
  // Buscar em fluxos de vendas
  for (const fluxo of fluxosClientes) {
    const fluxoSlug = normalizarSlug(fluxo.nome)
    if (fluxoSlug === slugNormalizado) {
      return { fluxo, tipo: 'vendas' }
    }
  }
  
  return null
}

// Buscar ferramenta por URL completa (user-slug/tool-slug)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')
    const toolSlug = searchParams.get('tool_slug')

    if (!userSlug || !toolSlug) {
      return NextResponse.json(
        { error: 'user_slug e tool_slug são obrigatórios' },
        { status: 400 }
      )
    }

    const ensureActiveSubscription = async (ownerId: string | null) => {
      if (!ownerId) return true
      
      // Verificar se é admin ou suporte (bypass)
      const bypass = await canBypassSubscription(ownerId)
      if (bypass) {
        console.log(`✅ Usuário ${ownerId} pode bypassar (admin/suporte)`)
        return true
      }
      
      // Verificar assinatura ativa
      return await hasActiveSubscription(ownerId, 'wellness')
    }

    // Log inicial para diagnóstico
    console.log('🔍 [Wellness API] Buscando ferramenta:', {
      user_slug: userSlug,
      tool_slug: toolSlug
    })
    
    // Buscar ferramenta pela combinação user_slug + tool_slug
    // Primeiro buscar o user_id pelo user_slug
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug, user_id, nome_completo, email, country_code, whatsapp')
      .eq('user_slug', userSlug)
      .maybeSingle()
    
    if (profileError || !userProfile) {
      console.warn('⚠️ [Wellness API] Usuário não encontrado:', {
        user_slug: userSlug,
        error: profileError?.message,
        code: profileError?.code
      })
      return NextResponse.json(
        { error: 'Usuário não encontrado', message: `Não foi possível encontrar um usuário com o slug "${userSlug}"` },
        { status: 404 }
      )
    }
    
    // Aliases: slug da URL -> slugs possíveis no banco (ex.: quiz-nutrition-assessment = Quiz Avaliação Nutricional = quiz-perfil-nutricional)
    const slugAliasesForUserTemplates: Record<string, string[]> = {
      'quiz-nutrition-assessment': ['quiz-perfil-nutricional'],
    }
    const slugsToTryUser = [toolSlug, ...(slugAliasesForUserTemplates[toolSlug] || [])]

    // Buscar a ferramenta pelo user_id (slug ou alias)
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .in('slug', slugsToTryUser)
      .eq('profession', 'wellness')
      .eq('status', 'active')
      .maybeSingle()

    // Se encontrou a ferramenta, adicionar o perfil e retornar
    if (data) {
      const ownerId = data.user_id || userProfile.user_id
      
      // Log detalhado para diagnóstico
      console.log('🔍 [Wellness API] Ferramenta encontrada, verificando assinatura:', {
        tool_id: data.id,
        tool_slug: data.slug,
        user_id: ownerId,
        user_slug: userSlug
      })
      
      const subscriptionOk = await ensureActiveSubscription(ownerId)
      
      if (!subscriptionOk) {
        console.warn('⚠️ [Wellness API] Assinatura não ativa ou expirada:', {
          tool_id: data.id,
          user_id: ownerId,
          user_slug: userSlug,
          tool_slug: toolSlug
        })
        return NextResponse.json(
          { error: 'link_indisponivel', message: 'Assinatura expirada ou não ativa' },
          { status: 403 }
        )
      }
      
      console.log('✅ [Wellness API] Ferramenta retornada com sucesso:', {
        tool_id: data.id,
        tool_slug: data.slug
      })
      
      return NextResponse.json({ 
        tool: {
          ...data,
          user_profiles: userProfile
        }
      })
    }
    
    // Se não encontrou, verificar se é um fluxo ou template base
    if (!data) {
        // Ferramenta não encontrada - verificar se é um fluxo
        const fluxoEncontrado = encontrarFluxoPorSlug(toolSlug)
        if (fluxoEncontrado) {
          console.log('🔍 [Wellness API] Fluxo encontrado, verificando assinatura:', {
            fluxo_id: fluxoEncontrado.fluxo.id,
            tipo: fluxoEncontrado.tipo,
            user_id: userProfile.user_id
          })
          
          // Verificar assinatura
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          if (!subscriptionOk) {
            console.warn('⚠️ [Wellness API] Assinatura não ativa (fluxo):', {
              fluxo_id: fluxoEncontrado.fluxo.id,
              user_id: userProfile.user_id
            })
            return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada ou não ativa' },
              { status: 403 }
            )
          }
          
          console.log('✅ [Wellness API] Fluxo retornado:', {
            fluxo_id: fluxoEncontrado.fluxo.id
          })
          
          // Retornar fluxo formatado como ferramenta
          return NextResponse.json({
            tool: {
              id: `fluxo-${fluxoEncontrado.fluxo.id}`,
              title: fluxoEncontrado.fluxo.nome,
              slug: toolSlug,
              template_slug: `fluxo-${fluxoEncontrado.tipo}-${fluxoEncontrado.fluxo.id}`,
              profession: 'wellness',
              status: 'active',
              content: {
                template_type: 'fluxo',
                fluxo: fluxoEncontrado.fluxo,
                tipo: fluxoEncontrado.tipo
              },
              user_profiles: userProfile,
              whatsapp_number: userProfile.whatsapp,
              is_fluxo: true,
              fluxo_tipo: fluxoEncontrado.tipo
            }
          })
        }
        
        // Se não for fluxo, tentar buscar por template_slug (fallback), incluindo aliases
        const slugsForTemplateSlug = [toolSlug, ...(slugAliasesForUserTemplates[toolSlug] || [])]
        const { data: toolByTemplateSlug, error: errorByTemplateSlug } = await supabaseAdmin
          .from('user_templates')
          .select('*')
          .eq('user_id', userProfile.user_id)
          .in('template_slug', slugsForTemplateSlug)
          .eq('profession', 'wellness')
          .eq('status', 'active')
          .maybeSingle()
        
        if (!errorByTemplateSlug && toolByTemplateSlug) {
          // Encontrou por template_slug - verificar assinatura
          console.log('🔍 [Wellness API] Ferramenta encontrada por template_slug, verificando assinatura:', {
            tool_id: toolByTemplateSlug.id,
            template_slug: toolByTemplateSlug.template_slug,
            user_id: userProfile.user_id
          })
          
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          
          if (!subscriptionOk) {
            console.warn('⚠️ [Wellness API] Assinatura não ativa (template_slug):', {
              tool_id: toolByTemplateSlug.id,
              user_id: userProfile.user_id
            })
            return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada ou não ativa' },
              { status: 403 }
            )
          }
          
          console.log('✅ [Wellness API] Ferramenta retornada (template_slug):', {
            tool_id: toolByTemplateSlug.id
          })
          
          return NextResponse.json({ 
            tool: {
              ...toolByTemplateSlug,
              user_profiles: userProfile
            }
          })
        }
        
        // Fallback final: buscar template base e criar ferramenta virtual
        // Isso permite que links funcionem mesmo se o usuário nunca criou a ferramenta
        // Tentar buscar por slug exato primeiro
        let templateBase: any = null
        let templateError: any = null
        
        // Tentar buscar por slug exato (sem filtro de profession primeiro)
        const { data: templateExato, error: errorExato } = await supabaseAdmin
          .from('templates_nutrition')
          .select('*')
          .eq('slug', toolSlug)
          .eq('is_active', true)
          .maybeSingle()
        
        console.log('🔍 Buscando template base:', {
          toolSlug,
          encontrado: !!templateExato,
          error: errorExato?.message,
          templateName: templateExato?.name,
          templateId: templateExato?.id,
          temContent: !!templateExato?.content,
          profession: templateExato?.profession
        })
        
        if (!errorExato && templateExato) {
          // Verificar se é wellness (se a coluna existir)
          if (templateExato.profession === undefined || templateExato.profession === 'wellness') {
            templateBase = templateExato
          } else {
            // Se não for wellness, tentar buscar variação
            const { data: templateVariacao, error: errorVariacao } = await supabaseAdmin
              .from('templates_nutrition')
              .select('*')
              .eq('slug', toolSlug)
              .eq('is_active', true)
              .or('profession.is.null,profession.eq.wellness')
              .maybeSingle()
            
            if (!errorVariacao && templateVariacao) {
              templateBase = templateVariacao
            }
          }
        }
        
        // Aliases: slug da URL -> slug possível no banco (ex.: template em inglês; quiz-nutrition-assessment = quiz-perfil-nutricional)
        const slugAliases: Record<string, string[]> = {
          'template-diagnostico-parasitose': ['parasitosis-diagnosis'],
          'diagnostico-parasitose': ['parasitosis-diagnosis'],
          parasitose: ['parasitosis-diagnosis'],
          'quiz-nutrition-assessment': ['quiz-perfil-nutricional'],
        }
        const slugsToTry = [toolSlug, ...(slugAliases[toolSlug] || [])]

        // Se ainda não encontrou, tentar slugs alternativos e depois variações
        if (!templateBase) {
          for (const slug of slugsToTry) {
            if (slug === toolSlug) continue // já tentamos toolSlug acima
            const { data: templateAlias, error: errorAlias } = await supabaseAdmin
              .from('templates_nutrition')
              .select('*')
              .eq('slug', slug)
              .eq('is_active', true)
              .or('profession.is.null,profession.eq.wellness')
              .maybeSingle()
            if (!errorAlias && templateAlias) {
              templateBase = templateAlias
              break
            }
          }
        }
        if (!templateBase) {
          const slugNormalizado = toolSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
          const { data: templateNormalizado, error: errorNormalizado } = await supabaseAdmin
            .from('templates_nutrition')
            .select('*')
            .eq('is_active', true)
            .ilike('slug', `%${slugNormalizado}%`)
            .or('profession.is.null,profession.eq.wellness')
            .limit(1)
                .maybeSingle()
              
          if (!errorNormalizado && templateNormalizado) {
            templateBase = templateNormalizado
          } else {
            templateError = errorNormalizado || errorExato
          }
        }
        
        if (templateBase) {
          // Verificar assinatura
          console.log('🔍 [Wellness API] Template base encontrado, verificando assinatura:', {
            template_id: templateBase.id,
            template_slug: templateBase.slug,
            user_id: userProfile.user_id
          })
          
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          if (!subscriptionOk) {
            console.warn('⚠️ [Wellness API] Assinatura não ativa (template base):', {
              template_id: templateBase.id,
              user_id: userProfile.user_id
            })
            return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada ou não ativa' },
              { status: 403 }
            )
          }
          
          console.log('✅ [Wellness API] Ferramenta virtual criada (template base):', {
            template_id: templateBase.id
          })
          
          // Criar ferramenta virtual baseada no template
          return NextResponse.json({
            tool: {
              id: `template-${templateBase.id}`,
              title: templateBase.name,
              slug: toolSlug,
              template_slug: toolSlug,
              template_id: templateBase.id,
              description: templateBase.description || templateBase.title || '',
              emoji: templateBase.icon || '📋',
              custom_colors: { principal: '#10B981', secundaria: '#059669' },
              cta_type: 'whatsapp',
              whatsapp_number: userProfile.whatsapp || null,
              cta_button_text: 'Conversar com Especialista',
              profession: 'wellness',
              status: 'active',
              content: templateBase.content || {},
              user_profiles: userProfile,
              is_template_base: true // Flag para indicar que é template base
            }
          })
        }

        // Fallback: templates built-in (têm página no app mas podem não existir em templates_nutrition)
        // Ex.: diagnóstico de parasitose — página em wellness/templates/parasitosis-diagnosis
        const builtInTemplates: Record<string, { title: string; description: string; emoji: string }> = {
          'template-diagnostico-parasitose': {
            title: 'Diagnóstico de Parasitose',
            description: 'Identifique sinais de parasitose e receba orientações iniciais personalizadas',
            emoji: '🦠'
          },
          'diagnostico-parasitose': {
            title: 'Diagnóstico de Parasitose',
            description: 'Identifique sinais de parasitose e receba orientações iniciais personalizadas',
            emoji: '🦠'
          },
          parasitose: {
            title: 'Diagnóstico de Parasitose',
            description: 'Identifique sinais de parasitose e receba orientações iniciais personalizadas',
            emoji: '🦠'
          }
        }
        const builtIn = builtInTemplates[toolSlug]
        if (builtIn) {
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          if (!subscriptionOk) {
            return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada ou não ativa' },
              { status: 403 }
            )
          }
          console.log('✅ [Wellness API] Ferramenta virtual (built-in):', { tool_slug: toolSlug })
          return NextResponse.json({
            tool: {
              id: `builtin-${toolSlug}`,
              title: builtIn.title,
              slug: toolSlug,
              template_slug: toolSlug,
              description: builtIn.description,
              emoji: builtIn.emoji,
              custom_colors: { principal: '#10B981', secundaria: '#059669' },
              cta_type: 'whatsapp',
              whatsapp_number: userProfile.whatsapp || null,
              cta_button_text: 'Conversar com Especialista',
              profession: 'wellness',
              status: 'active',
              content: {},
              user_profiles: userProfile,
              is_template_base: true
            }
          })
        }
        
        // Se chegou aqui, realmente não encontrou a ferramenta
        console.warn('⚠️ [Wellness API] Ferramenta não encontrada após todas as tentativas:', {
          user_slug: userSlug,
          tool_slug: toolSlug,
          user_id: userProfile.user_id
        })
        
        return NextResponse.json(
          { error: 'Ferramenta não encontrada', message: `Não foi possível encontrar uma ferramenta com o slug "${toolSlug}" para o usuário "${userSlug}"` },
          { status: 404 }
        )
          }
  } catch (error: any) {
    console.error('Erro ao buscar ferramenta por URL:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}


