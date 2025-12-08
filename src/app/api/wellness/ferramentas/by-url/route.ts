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

    // Buscar ferramenta pela combinação user_slug + tool_slug
    // Primeiro buscar o user_id pelo user_slug
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug, user_id, nome_completo, email, country_code, whatsapp')
      .eq('user_slug', userSlug)
      .maybeSingle()
    
    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }
    
    // Agora buscar a ferramenta pelo user_id
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('slug', toolSlug)
      .eq('profession', 'wellness')
      .eq('status', 'active')
      .maybeSingle()

    // Se encontrou a ferramenta, adicionar o perfil e retornar
    if (data) {
      const ownerId = data.user_id || userProfile.user_id
      const subscriptionOk = await ensureActiveSubscription(ownerId)
      
      if (!subscriptionOk) {
        return NextResponse.json(
          { error: 'link_indisponivel', message: 'Assinatura expirada' },
          { status: 403 }
        )
      }
      
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
          // Verificar assinatura
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          if (!subscriptionOk) {
            return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada' },
              { status: 403 }
            )
          }
          
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
        
        // Se não for fluxo, tentar buscar por template_slug (fallback)
        const { data: toolByTemplateSlug, error: errorByTemplateSlug } = await supabaseAdmin
          .from('user_templates')
          .select('*')
          .eq('user_id', userProfile.user_id)
          .eq('template_slug', toolSlug)
          .eq('profession', 'wellness')
          .eq('status', 'active')
          .maybeSingle()
        
        if (!errorByTemplateSlug && toolByTemplateSlug) {
          // Encontrou por template_slug - verificar assinatura
          const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
          
          if (!subscriptionOk) {
          return NextResponse.json(
              { error: 'link_indisponivel', message: 'Assinatura expirada' },
              { status: 403 }
          )
          }
          
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
        
        // Se ainda não encontrou, tentar buscar por variações do slug
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
              const subscriptionOk = await ensureActiveSubscription(userProfile.user_id)
              if (!subscriptionOk) {
                return NextResponse.json(
                  { error: 'link_indisponivel', message: 'Assinatura expirada' },
                  { status: 403 }
                )
              }
              
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
            
            return NextResponse.json(
              { error: 'Ferramenta não encontrada' },
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


