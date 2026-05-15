import { Metadata } from 'next'
import { getFullOGImageUrl } from '@/lib/og-image-map'
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
  if (directUrl) return directUrl
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000'
  return 'https://ylada.app'
}

async function fetchToolData(userSlug: string, toolSlug: string) {
  if (!supabaseAdmin) return null
  try {
    const { data } = await supabaseAdmin
      .from('user_templates')
      .select('id, title, description, template_slug, user_profiles!inner(user_slug)')
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .single()
    return data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'user-slug': userSlug, 'tool-slug': toolSlug } = await params
  const baseUrl = resolveAppBaseUrl()
  const area = 'wellness' as const // coach-bem-estar compartilha infraestrutura wellness

  try {
    const tool = await fetchToolData(userSlug, toolSlug)
    const normalizedSlug = normalizeTemplateSlug(tool?.template_slug ?? toolSlug)
    const ogMessages = getOGMessages(normalizedSlug)
    const ogTitle = ogMessages.title || tool?.title || 'Ferramenta de Bem-estar'
    const ogDescription =
      ogMessages.description || tool?.description || 'Acesse ferramentas personalizadas de bem-estar'
    const ogImageUrl = getFullOGImageUrl(normalizedSlug, baseUrl, area)
    const absoluteImage = ogImageUrl.startsWith('http')
      ? ogImageUrl
      : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
    const pageUrl = `${baseUrl}/pt/coach-bem-estar/${userSlug}/${toolSlug}`

    return {
      title: `${ogTitle} - Coach de Bem-estar`,
      description: ogDescription,
      openGraph: {
        title: `${ogTitle} - Coach de Bem-estar`,
        description: ogDescription,
        url: pageUrl,
        siteName: 'YLADA Coach de Bem-estar',
        type: 'website',
        locale: 'pt_BR',
        images: [{ url: absoluteImage, width: 1200, height: 630, alt: ogTitle, type: 'image/jpeg' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${ogTitle} - Coach de Bem-estar`,
        description: ogDescription,
        images: [absoluteImage],
      },
    }
  } catch {
    return {
      title: 'Ferramenta de Bem-estar - YLADA',
      description: 'Acesse ferramentas personalizadas de coaching de bem-estar',
    }
  }
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
