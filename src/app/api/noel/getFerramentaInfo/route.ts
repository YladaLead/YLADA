/**
 * POST /api/noel/getFerramentaInfo
 * 
 * Função para NOEL buscar informações de ferramentas/calculadoras/quizzes
 * Busca por template_slug ou slug
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { buildWellnessToolUrl } from '@/lib/url-utils'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'

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
      
      if (user_id) {
        // Buscar user_slug
        console.log('🔍 [getFerramentaInfo] Buscando user_slug para user_id:', user_id)
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', user_id)
          .maybeSingle()
        
        if (profileError) {
          console.warn('⚠️ [getFerramentaInfo] Erro ao buscar profile (continuando sem user_slug):', profileError.message)
        }
        
        if (profile?.user_slug) {
          console.log('✅ [getFerramentaInfo] user_slug encontrado:', profile.user_slug)
          try {
            // Tentar buscar ferramenta personalizada
            const { data: ferramentaPersonalizada, error: ferramentaError } = await supabaseAdmin
              .from('user_templates')
              .select('*')
              .eq('user_id', user_id)
              .eq('template_slug', ferramenta_slug)
              .eq('profession', 'wellness')
              .eq('status', 'active')
              .maybeSingle()
            
            if (ferramentaError) {
              console.warn('⚠️ [getFerramentaInfo] Erro ao buscar ferramenta personalizada:', ferramentaError.message)
            }
            
            if (ferramentaPersonalizada && ferramentaPersonalizada.slug) {
              try {
                // IMPORTANTE: Usar o slug da ferramenta (não o template_slug)
                // A rota /pt/wellness/[user-slug]/[tool-slug] busca pelo campo 'slug' da user_templates
                link = buildWellnessToolUrl(profile.user_slug, ferramentaPersonalizada.slug)
                console.log('✅ [getFerramentaInfo] Link gerado com ferramenta personalizada:', {
                  user_slug: profile.user_slug,
                  tool_slug: ferramentaPersonalizada.slug,
                  template_slug: ferramentaPersonalizada.template_slug,
                  link
                })
                scriptApresentacao = ferramentaPersonalizada.custom_whatsapp_message || 
                                     ferramentaPersonalizada.description || 
                                     templateBase.whatsapp_message || 
                                     `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
              } catch (urlError: any) {
                console.error('❌ [getFerramentaInfo] Erro ao gerar link personalizado:', urlError)
                // Continuar sem link personalizado
              }
            } else {
              // Não encontrou ferramenta personalizada, tentar buscar pelo slug diretamente
              // Pode ser que a ferramenta tenha slug diferente do template_slug
              console.log('⚠️ [getFerramentaInfo] Ferramenta personalizada não encontrada, tentando buscar pelo slug diretamente...')
              
              const { data: ferramentaPorSlug, error: slugError } = await supabaseAdmin
                .from('user_templates')
                .select('slug, template_slug')
                .eq('user_id', user_id)
                .eq('slug', ferramenta_slug)
                .eq('profession', 'wellness')
                .eq('status', 'active')
                .maybeSingle()
              
              if (ferramentaPorSlug && ferramentaPorSlug.slug) {
                // Encontrou pelo slug direto
                try {
                  link = buildWellnessToolUrl(profile.user_slug, ferramentaPorSlug.slug)
                  console.log('✅ [getFerramentaInfo] Link gerado buscando pelo slug direto:', {
                    user_slug: profile.user_slug,
                    tool_slug: ferramentaPorSlug.slug,
                    link
                  })
                  scriptApresentacao = templateBase.whatsapp_message || 
                                       templateBase.description || 
                                       `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
                } catch (urlError: any) {
                  console.error('❌ [getFerramentaInfo] Erro ao gerar link com slug direto:', urlError)
                }
              } else {
                // Tentar buscar todas as ferramentas do usuário com esse template_slug para ver qual slug real tem
                const { data: todasFerramentas } = await supabaseAdmin
                  .from('user_templates')
                  .select('slug, template_slug, title')
                  .eq('user_id', user_id)
                  .eq('template_slug', ferramenta_slug)
                  .eq('profession', 'wellness')
                  .eq('status', 'active')
                  .limit(1)
                
                if (todasFerramentas && todasFerramentas.length > 0) {
                  const ferramentaEncontrada = todasFerramentas[0]
                  try {
                    link = buildWellnessToolUrl(profile.user_slug, ferramentaEncontrada.slug)
                    console.log('✅ [getFerramentaInfo] Link gerado buscando todas ferramentas:', {
                      user_slug: profile.user_slug,
                      tool_slug: ferramentaEncontrada.slug,
                      template_slug: ferramentaEncontrada.template_slug,
                      link
                    })
                    scriptApresentacao = templateBase.whatsapp_message || 
                                         templateBase.description || 
                                         `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
                  } catch (urlError: any) {
                    console.error('❌ [getFerramentaInfo] Erro ao gerar link:', urlError)
                  }
                } else {
                  // Última tentativa: usar o ferramenta_slug diretamente (pode não funcionar)
                  try {
                    link = buildWellnessToolUrl(profile.user_slug, ferramenta_slug)
                    console.log('⚠️ [getFerramentaInfo] Link gerado com ferramenta_slug (pode não existir):', {
                      user_slug: profile.user_slug,
                      tool_slug: ferramenta_slug,
                      link,
                      aviso: 'Ferramenta pode não existir com este slug'
                    })
                    scriptApresentacao = templateBase.whatsapp_message || 
                                         templateBase.description || 
                                         `Tenho uma ${templateBase.name} que pode te ajudar! Quer testar?`
                  } catch (urlError: any) {
                    console.error('❌ [getFerramentaInfo] Erro ao gerar link com ferramenta_slug:', urlError)
                  }
                }
              }
            }
          } catch (error: any) {
            console.error('❌ [getFerramentaInfo] Erro ao processar user_slug:', error)
            // Continuar sem link personalizado
          }
        }
      }
      
      // Se não tiver link ainda, usar template base genérico
      if (!link) {
        console.log('⚠️ [getFerramentaInfo] Usando link genérico (sem user_slug)')
        // Tentar usar link genérico da ferramenta (se existir no banco)
        // Caso contrário, usar link do template base
        const { data: ferramentaGenerica } = await supabaseAdmin
          .from('wellness_ferramentas')
          .select('id, slug')
          .eq('template_slug', ferramenta_slug)
          .eq('status', 'active')
          .maybeSingle()
        
        if (ferramentaGenerica?.id) {
          link = `${baseUrl}/pt/wellness/ferramenta/${ferramentaGenerica.id}`
          console.log('✅ [getFerramentaInfo] Link genérico encontrado via wellness_ferramentas:', link)
        } else {
          // Fallback: usar link do template (pode não funcionar se não houver rota)
          link = `${baseUrl}/pt/wellness/ferramenta/${templateBase.slug}`
          console.log('⚠️ [getFerramentaInfo] Usando link do template (pode não existir):', link)
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
    console.error('❌ Erro ao buscar ferramenta:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}
