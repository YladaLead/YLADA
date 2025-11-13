import { Metadata } from 'next'
import { getOGImageUrl, getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { supabaseAdmin } from '@/lib/supabase'

interface Props {
  params: Promise<{
    'user-slug': string
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  try {
    // Buscar dados do portal
    // Primeiro buscar o portal pelo slug
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, name, description, user_id')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (portalError || !portal) {
      // Construir URL base para fallback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
      const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/portal/${slug}`
      
      // Fallback para metadata padrão
      return {
        title: 'Portal do Bem-Estar - WELLNESS',
        description: 'Portal personalizado de bem-estar',
        openGraph: {
          title: 'Portal do Bem-Estar - WELLNESS',
          description: 'Portal personalizado de bem-estar',
          url: pageUrl,
          siteName: 'WELLNESS - Your Leading Data System',
          type: 'website',
          locale: 'pt_BR',
          images: [{
            url: getFullOGImageUrl('portal', baseUrl),
            width: 1200,
            height: 630,
            type: 'image/jpeg',
          }],
        },
      }
    }

    // Verificar se o user_slug corresponde ao user_id do portal
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', portal.user_id)
      .single()

    if (!profile || profile.user_slug !== resolvedParams['user-slug']) {
      // Fallback para metadata padrão
      return {
        title: 'Portal do Bem-Estar - WELLNESS',
        description: 'Portal personalizado de bem-estar',
        openGraph: {
          title: 'Portal do Bem-Estar - WELLNESS',
          description: 'Portal personalizado de bem-estar',
          images: [getFullOGImageUrl('portal')],
        },
      }
    }

    // Construir URL base primeiro (usar www.ylada.com como padrão para produção)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
    
    // Obter imagem OG para portal com baseUrl correto
    const ogImageUrl = getFullOGImageUrl('portal', baseUrl)
    
    // Obter mensagens estimulantes para portal
    const ogMessages = getOGMessages('portal')
    
    // Usar mensagens estimulantes ou nome/descrição do portal
    const ogTitle = ogMessages.title || portal.name
    const ogDescription = ogMessages.description || portal.description || 'Portal personalizado de bem-estar'

    // Construir URL completa da página
    const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/portal/${slug}`

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
            type: 'image/jpeg',
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
    console.error('[OG Metadata] Error generating portal metadata:', error)
    // Construir URL base para fallback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
    const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/portal/${slug}`
    
    // Fallback para metadata padrão
    return {
      title: 'Portal do Bem-Estar - WELLNESS',
      description: 'Portal personalizado de bem-estar',
      openGraph: {
        title: 'Portal do Bem-Estar - WELLNESS',
        description: 'Portal personalizado de bem-estar',
        url: pageUrl,
        siteName: 'WELLNESS - Your Leading Data System',
        type: 'website',
        locale: 'pt_BR',
        images: [{
          url: getFullOGImageUrl('portal', baseUrl),
          width: 1200,
          height: 630,
          type: 'image/jpeg',
        }],
      },
    }
  }
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

