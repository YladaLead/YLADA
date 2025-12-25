import { Metadata } from 'next'
import { getOGImageUrl, getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

interface Props {
  params: Promise<{
    'user-slug': string
    'tool-slug': string
  }>
}

function resolveAppBaseUrl() {
  const directUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  if (directUrl) {
    return directUrl
  }

  // Desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://www.ylada.com'
}

async function fetchToolFromSupabase(userSlug: string, toolSlug: string) {
  if (!supabaseAdmin) {
    console.warn('[OG Metadata] Supabase admin client unavailable')
    return null
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select(
        `
        id,
        title,
        description,
        template_slug,
        user_profiles!inner(user_slug)
      `
      )
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .single()

    if (error) {
      console.error('[OG Metadata] ❌ Supabase query failed:', {
        userSlug,
        toolSlug,
        error: error.message,
        code: error.code,
        details: error.details
      })
      return null
    }

    return data
  } catch (error) {
    console.error('[OG Metadata] ❌ Unexpected Supabase error:', {
      userSlug,
      toolSlug,
      error
    })
    return null
  }
}

async function fetchToolFromApi(userSlug: string, toolSlug: string, baseUrl: string) {
  const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/wellness/ferramentas/by-url?user_slug=${encodeURIComponent(userSlug)}&tool_slug=${encodeURIComponent(toolSlug)}`

  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'x-metadata-fetch': 'true'
      },
      next: {
        revalidate: 0
      }
    })

    if (!response.ok) {
      console.error('[OG Metadata] ❌ API fallback returned error:', {
        userSlug,
        toolSlug,
        status: response.status,
        statusText: response.statusText
      })
      return null
    }

    const data = await response.json()
    return data.tool || null
  } catch (error) {
    console.error('[OG Metadata] ❌ API fallback failed:', {
      userSlug,
      toolSlug,
      error
    })
    return null
  }
}

async function resolveToolData(userSlug: string, toolSlug: string, baseUrl: string) {
  const directData = await fetchToolFromSupabase(userSlug, toolSlug)
  if (directData) {
    return directData
  }

  return fetchToolFromApi(userSlug, toolSlug, baseUrl)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { 'user-slug': userSlug, 'tool-slug': toolSlug } = resolvedParams
  const baseUrl = resolveAppBaseUrl()
  const area: 'wellness' = 'wellness'

  try {
    const tool = await resolveToolData(userSlug, toolSlug, baseUrl)

    if (!tool) {
      // Debug: log do erro
      console.error('[OG Metadata] ❌ Tool not found after fallbacks:', {
        userSlug,
        toolSlug,
        baseUrl
      })
      
      // Verificar se o slug parece ser um fluxo de recrutamento
      // (tentativa de detectar mesmo sem dados completos)
      const slugLower = toolSlug.toLowerCase()
      const pareceFluxoRecrutamento = slugLower.includes('maes') || 
                                      slugLower.includes('renda') || 
                                      slugLower.includes('trabalhar') ||
                                      slugLower.includes('recrutamento')
      
      // Construir URL base para fallback
      let inferredImage: string
      let fallbackTitle: string
      let fallbackDescription: string
      
      if (pareceFluxoRecrutamento) {
        // Se parece ser fluxo de recrutamento, usar imagem do quiz-potencial
        inferredImage = `${baseUrl}/images/og/wellness/quiz-potencial.jpg`
        fallbackTitle = toolSlug // Usar o slug como título (será formatado)
        fallbackDescription = 'Descubra seu perfil e potencial'
      } else {
        // Para outros casos, usar imagem padrão
        inferredImage = `${baseUrl}/images/wellness-hero-com-logo.png`
        fallbackTitle = 'Ferramenta de Bem-Estar'
        fallbackDescription = 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida.'
      }
      
      console.log('[OG Metadata] 🔍 Using inferred metadata (fallback):', {
        toolSlug,
        inferredImage,
        pareceFluxoRecrutamento
      })
      
      // Remover "WELLNESS" duplicado se já estiver no título (apenas para não-fluxos)
      if (!pareceFluxoRecrutamento && fallbackTitle.includes('WELLNESS')) {
        fallbackTitle = fallbackTitle.replace(/\s*-\s*WELLNESS\s*/gi, '').trim()
      }
      
      return {
        title: `${fallbackTitle} - WELLNESS`,
        description: fallbackDescription,
        openGraph: {
          title: `${fallbackTitle} - WELLNESS`,
          description: fallbackDescription,
          url: `${baseUrl}/pt/wellness/${userSlug}/${toolSlug}`,
          siteName: 'WELLNESS - Your Leading Data System',
          type: 'website',
          locale: 'pt_BR',
          images: [{
            url: inferredImage,
            width: 1200,
            height: 630,
            type: pareceFluxoRecrutamento ? 'image/jpeg' : 'image/png',
          }],
        },
      }
    }

    // Verificar se é um fluxo de recrutamento
    const isFluxoRecrutamento = tool.is_fluxo && (
      tool.fluxo_tipo === 'recrutamento' || 
      (tool.content?.tipo === 'recrutamento')
    )
    
    // Normalizar template_slug
    const normalizedSlug = normalizeTemplateSlug(tool.template_slug)
    
    // Debug: log para verificar normalização
    console.log('[OG Metadata] ✅ Tool found:', {
      userSlug,
      toolSlug,
      template_slug: tool.template_slug,
      normalizedSlug,
      toolTitle: tool.title,
      toolId: tool.id,
      isFluxoRecrutamento,
      fluxo_tipo: tool.fluxo_tipo
    })
    
    // Se for fluxo de recrutamento, usar imagem do quiz-potencial e texto do fluxo
    let ogImageUrl: string
    let ogTitle: string
    let ogDescription: string
    
    if (isFluxoRecrutamento) {
      // Para fluxos de recrutamento: usar imagem do quiz-potencial
      ogImageUrl = `${baseUrl}/images/og/wellness/quiz-potencial.jpg`
      
      // Usar o nome do fluxo como título (é a proposta para quem vai preencher)
      ogTitle = tool.title || tool.content?.fluxo?.nome || 'Avaliação Personalizada'
      ogDescription = 'Descubra seu perfil e potencial'
      
      console.log('[OG Metadata] Fluxo de recrutamento detectado:', {
        fluxoNome: tool.content?.fluxo?.nome,
        ogTitle,
        ogImageUrl
      })
    } else {
      // Para outras ferramentas: usar imagem específica do template (mesma lógica do Nutri)
      ogImageUrl = getFullOGImageUrl(normalizedSlug, baseUrl, area)
      
      // Garantir que a URL seja absoluta
      const absoluteImageUrl = ogImageUrl.startsWith('http') 
        ? ogImageUrl 
        : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
      
      ogImageUrl = absoluteImageUrl
      
      // Obter mensagens estimulantes baseadas no tipo de ferramenta
      const ogMessages = getOGMessages(normalizedSlug)
      
      // Usar mensagens estimulantes ou título/descrição personalizados do usuário (prioridade: ogMessages > tool.title/description)
      ogTitle = ogMessages.title || tool.title || 'Ferramenta de Bem-Estar'
      ogDescription = ogMessages.description || tool.description || 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida.'
      
      console.log('[OG Metadata] Ferramenta normal:', {
        normalizedSlug,
        ogImageUrl,
        ogTitle,
        ogDescription,
        hasOGMessage: !!ogMessages.title
      })
    }
    
    // Remover "WELLNESS" duplicado se já estiver no título (apenas para não-fluxos)
    if (!isFluxoRecrutamento && ogTitle.includes('WELLNESS')) {
      ogTitle = ogTitle.replace(/\s*-\s*WELLNESS\s*/gi, '').trim()
    }
    
    // Garantir que o título não esteja vazio
    if (!ogTitle || ogTitle.trim() === '') {
      ogTitle = isFluxoRecrutamento ? 'Avaliação Personalizada' : 'Ferramenta de Bem-Estar'
    }

    // Construir URL completa da página
    const pageUrl = `${baseUrl}/pt/wellness/${userSlug}/${toolSlug}`

    return {
      title: `${ogTitle} - WELLNESS`,
      description: ogDescription,
      openGraph: {
        title: `${ogTitle} - WELLNESS`,
        description: ogDescription,
        url: pageUrl,
        siteName: 'WELLNESS - Your Leading Data System',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogTitle,
            type: ogImageUrl.includes('.jpg') || ogImageUrl.includes('.jpeg') ? 'image/jpeg' : 'image/png',
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${ogTitle} - WELLNESS`,
        description: ogDescription,
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    console.error('[OG Metadata] Error generating metadata:', error)
    // Construir URL base para fallback
    const fallbackBaseUrl = resolveAppBaseUrl()
        
    // Fallback para metadata padrão
    const pageUrl = `${fallbackBaseUrl}/pt/wellness/${userSlug}/${toolSlug}`
    return {
      title: 'Ferramenta de Bem-Estar - WELLNESS',
      description: 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida',
      openGraph: {
        title: 'Ferramenta de Bem-Estar - WELLNESS',
        description: 'Acesse ferramentas personalizadas para melhorar seu bem-estar e qualidade de vida',
        url: pageUrl,
        siteName: 'WELLNESS - Your Leading Data System',
        type: 'website',
        locale: 'pt_BR',
        images: [{
          url: `${fallbackBaseUrl}/images/wellness-hero-com-logo.png`,
          width: 1200,
          height: 630,
          type: 'image/png',
        }],
      },
    }
  }
}

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

