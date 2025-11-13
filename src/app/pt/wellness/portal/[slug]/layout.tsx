import { Metadata } from 'next'
import { getOGImageUrl, getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { supabaseAdmin } from '@/lib/supabase'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  try {
    // Buscar dados do portal (sem user-slug na URL)
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, name, description, user_id')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (portalError || !portal) {
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

    // Obter imagem OG para portal
    const ogImageUrl = getFullOGImageUrl('portal')
    
    // Obter mensagens estimulantes para portal
    const ogMessages = getOGMessages('portal')
    
    // Usar mensagens estimulantes ou nome/descrição do portal
    const ogTitle = ogMessages.title || portal.name
    const ogDescription = ogMessages.description || portal.description || 'Portal personalizado de bem-estar'

    // Construir URL completa
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
    const pageUrl = `${baseUrl}/pt/wellness/portal/${slug}`

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
    console.error('Erro ao gerar metadata do portal:', error)
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
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

