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

  return 'https://ylada.app'
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
      .eq('profession', 'coach')
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
  const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/coach/ferramentas/by-url?user_slug=${encodeURIComponent(userSlug)}&tool_slug=${encodeURIComponent(toolSlug)}`

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
  const area: 'coach' = 'coach'

  try {
    const tool = await resolveToolData(userSlug, toolSlug, baseUrl)

    if (!tool) {
      // Debug: log do erro
      console.error('[OG Metadata] ❌ Tool not found after fallbacks:', {
        userSlug,
        toolSlug,
        baseUrl
      })
      
      // Construir URL base para fallback
      // Tentar inferir template_slug do tool-slug para usar imagem correta mesmo se ferramenta não for encontrada
      const inferredSlug = normalizeTemplateSlug(toolSlug)
      const inferredImage = getFullOGImageUrl(inferredSlug, baseUrl, area)
      const inferredImageAbsolute = inferredImage.startsWith('http') 
        ? inferredImage 
        : `${baseUrl}${inferredImage.startsWith('/') ? inferredImage : `/${inferredImage}`}`
      const inferredMessages = getOGMessages(inferredSlug)
      
      console.log('[OG Metadata] 🔍 Using inferred metadata (fallback):', {
        toolSlug,
        inferredSlug,
        inferredImage,
        inferredImageAbsolute,
        baseUrl,
        hasInferredMessage: !!inferredMessages.title
      })
      
      // Fallback para metadata padrão
      let fallbackTitle = inferredMessages.title || 'Ferramenta de Coaching'
      const fallbackDescription = inferredMessages.description || 'Acesse ferramentas personalizadas de coaching'
      
      // Remover "COACH" duplicado se já estiver no título
      if (fallbackTitle.includes('COACH')) {
        fallbackTitle = fallbackTitle.replace(/\s*-\s*COACH\s*/gi, '').trim()
      }
      
      return {
        title: `${fallbackTitle} - COACH`,
        description: fallbackDescription,
        openGraph: {
          title: `${fallbackTitle} - COACH`,
          description: fallbackDescription,
          url: `${baseUrl}/pt/coach/${userSlug}/${toolSlug}`,
          siteName: 'COACH - Your Leading Data System',
          type: 'website',
          locale: 'pt_BR',
          images: [{
            url: inferredImageAbsolute,
            width: 1200,
            height: 630,
            type: 'image/jpeg',
          }],
        },
      }
    }

    // Normalizar template_slug
    const normalizedSlug = normalizeTemplateSlug(tool.template_slug)
    
    // Debug: log para verificar normalização
    console.log('[OG Metadata] ✅ Tool found:', {
      userSlug,
      toolSlug,
      template_slug: tool.template_slug,
      normalizedSlug,
      toolTitle: tool.title,
      toolId: tool.id
    })
    
    // Obter imagem OG com baseUrl correto e área Coach
    const ogImageUrl = getFullOGImageUrl(normalizedSlug, baseUrl, area)
    
    // Garantir que a URL seja absoluta
    const absoluteImageUrl = ogImageUrl.startsWith('http') 
      ? ogImageUrl 
      : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
    
    // Debug: log para verificar imagem OG
    console.log('[OG Metadata] Image URL (Coach):', {
      normalizedSlug,
      ogImageUrl,
      absoluteImageUrl,
      baseUrl,
      imagePath: getOGImageUrl(normalizedSlug, area),
      area
    })
    
    // Obter mensagens estimulantes baseadas no tipo de ferramenta
    const ogMessages = getOGMessages(normalizedSlug)
    
    // Debug: log para verificar mensagens
    console.log('[OG Metadata] Messages:', {
      normalizedSlug,
      hasMessage: !!ogMessages.title,
      ogTitle: ogMessages.title,
      fallbackTitle: tool.title
    })
    
    // Usar mensagens estimulantes ou título/descrição personalizados do usuário
    let ogTitle = ogMessages.title || tool.title || 'Ferramenta de Coaching'
    const ogDescription = ogMessages.description || tool.description || 'Acesse ferramentas personalizadas de coaching'
    
    // Remover "COACH" duplicado se já estiver no título
    if (ogTitle.includes('COACH')) {
      ogTitle = ogTitle.replace(/\s*-\s*COACH\s*/gi, '').trim()
    }
    
    // Garantir que o título não esteja vazio
    if (!ogTitle || ogTitle.trim() === '') {
      ogTitle = 'Ferramenta de Coaching'
    }

    // Construir URL completa da página
    const pageUrl = `${baseUrl}/pt/coach/${userSlug}/${toolSlug}`

    return {
      title: `${ogTitle} - COACH`,
      description: ogDescription,
      openGraph: {
        title: `${ogTitle} - COACH`,
        description: ogDescription,
        url: pageUrl,
        siteName: 'COACH - Your Leading Data System',
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: ogTitle,
            type: 'image/jpeg',
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${ogTitle} - COACH`,
        description: ogDescription,
        images: [absoluteImageUrl],
      },
    }
  } catch (error) {
    console.error('[OG Metadata] Error generating metadata:', error)
    // Construir URL base para fallback
    const fallbackBaseUrl = resolveAppBaseUrl()
        
    // Fallback para metadata padrão
    const pageUrl = `${fallbackBaseUrl}/pt/coach/${userSlug}/${toolSlug}`
    return {
      title: 'Ferramenta de Coaching - COACH',
      description: 'Acesse ferramentas personalizadas de coaching',
      openGraph: {
        title: 'Ferramenta de Coaching - COACH',
        description: 'Acesse ferramentas personalizadas de coaching',
        url: pageUrl,
        siteName: 'COACH - Your Leading Data System',
        type: 'website',
        locale: 'pt_BR',
        images: [{
          url: (() => {
            const defaultImage = getFullOGImageUrl('default', fallbackBaseUrl, area)
            return defaultImage.startsWith('http')
              ? defaultImage
              : `${fallbackBaseUrl}${defaultImage.startsWith('/') ? defaultImage : `/${defaultImage}`}`
          })(),
          width: 1200,
          height: 630,
          type: 'image/jpeg',
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

