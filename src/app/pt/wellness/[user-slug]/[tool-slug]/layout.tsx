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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { 'user-slug': userSlug, 'tool-slug': toolSlug } = resolvedParams

  try {
    // Buscar dados da ferramenta
    const { data: tool, error } = await supabaseAdmin
      .from('user_templates')
      .select(`
        id,
        title,
        description,
        template_slug,
        user_profiles!inner(user_slug)
      `)
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .single()

    if (error || !tool) {
      // Fallback para metadata padrão
      return {
        title: 'Ferramenta Wellness - YLADA',
        description: 'Ferramenta personalizada de bem-estar',
        openGraph: {
          title: 'Ferramenta Wellness - YLADA',
          description: 'Ferramenta personalizada de bem-estar',
          images: [getFullOGImageUrl('default')],
        },
      }
    }

    // Normalizar template_slug
    const normalizedSlug = normalizeTemplateSlug(tool.template_slug)
    
    // Obter imagem OG
    const ogImageUrl = getFullOGImageUrl(normalizedSlug)
    
    // Obter mensagens estimulantes baseadas no tipo de ferramenta
    const ogMessages = getOGMessages(normalizedSlug)
    
    // Usar mensagens estimulantes ou título/descrição personalizados do usuário
    // Priorizar mensagens estimulantes para melhor conversão
    const ogTitle = ogMessages.title || tool.title
    const ogDescription = ogMessages.description || tool.description || 'Ferramenta personalizada de bem-estar'

    // Construir URL completa
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ylada.app'
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
    console.error('Erro ao gerar metadata:', error)
    // Fallback para metadata padrão
    return {
      title: 'Ferramenta Wellness - YLADA',
      description: 'Ferramenta personalizada de bem-estar',
      openGraph: {
        title: 'Ferramenta Wellness - YLADA',
        description: 'Ferramenta personalizada de bem-estar',
        images: [getFullOGImageUrl('default')],
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

