import { Metadata } from 'next'
import {
  extractCoachBemEstarFluxoFromTool,
  findCoachBemEstarFluxoByToolSlug,
  getCoachBemEstarOpenGraphImageUrl,
  getCoachBemEstarOpenGraphText,
  pareceSlugFluxoRecrutamentoCoach,
} from '@/lib/coach-bem-estar/coach-bem-estar-public-link-og'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'
import { supabaseAdmin } from '@/lib/supabase'

interface Props {
  params: Promise<{
    'user-slug': string
    'tool-slug': string
  }>
}

type ToolRow = {
  title?: string | null
  description?: string | null
  template_slug?: string | null
  content?: { fluxo?: { id: string; nome?: string; objetivo?: string }; tipo?: string } | null
  fluxo_tipo?: string | null
  is_fluxo?: boolean
}

async function fetchToolFromApi(userSlug: string, toolSlug: string, baseUrl: string) {
  const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/wellness/ferramentas/by-url?user_slug=${encodeURIComponent(userSlug)}&tool_slug=${encodeURIComponent(toolSlug)}&area=coach-bem-estar`

  try {
    const response = await fetch(apiUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'x-metadata-fetch': 'true',
        'User-Agent': 'facebookexternalhit/1.1',
      },
      next: { revalidate: 0 },
    })

    if (!response.ok) return null
    const data = (await response.json()) as { tool?: ToolRow }
    return data.tool ?? null
  } catch {
    return null
  }
}

async function fetchToolFromSupabase(userSlug: string, toolSlug: string) {
  if (!supabaseAdmin) return null

  try {
    const { data } = await supabaseAdmin
      .from('user_templates')
      .select(
        'id, title, description, template_slug, user_profiles!inner(user_slug)'
      )
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .in('profession', ['wellness', 'coach-bem-estar'])
      .maybeSingle()

    return data ?? null
  } catch {
    return null
  }
}

async function resolveToolData(userSlug: string, toolSlug: string, baseUrl: string) {
  const slugLower = toolSlug.toLowerCase()
  const pareceFluxo =
    pareceSlugFluxoRecrutamentoCoach(toolSlug) ||
    slugLower.includes('retencao') ||
    slugLower.includes('energia') ||
    slugLower.includes('inchaco') ||
    slugLower.includes('inchaço')

  if (pareceFluxo) {
    const apiData = await fetchToolFromApi(userSlug, toolSlug, baseUrl)
    if (apiData) return apiData
  }

  const direct = await fetchToolFromSupabase(userSlug, toolSlug)
  if (direct) return direct

  return fetchToolFromApi(userSlug, toolSlug, baseUrl)
}

function ogImageType(url: string): string {
  if (url.includes('.png')) return 'image/png'
  if (url.includes('.webp')) return 'image/webp'
  return 'image/jpeg'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { 'user-slug': userSlug, 'tool-slug': toolSlug } = await params
  const baseUrl = await resolveYladaOgBaseUrlForMetadata()
  const pageUrl = `${baseUrl}/pt/coach-bem-estar/${userSlug}/${toolSlug}`

  try {
    const tool = await resolveToolData(userSlug, toolSlug, baseUrl)
    const fluxoFromTool = tool ? extractCoachBemEstarFluxoFromTool(tool) : null
    const fluxoFromSlug = findCoachBemEstarFluxoByToolSlug(toolSlug)
    const fluxoTipo = fluxoFromTool?.tipo ?? fluxoFromSlug?.tipo ?? null
    const fluxoId = fluxoFromTool?.fluxoId ?? fluxoFromSlug?.fluxo.id ?? null

    const ogImageUrl = getCoachBemEstarOpenGraphImageUrl({
      baseUrl,
      toolSlug,
      templateSlug: tool?.template_slug ?? toolSlug,
      fluxoId,
      fluxoTipo,
    })

    const { title: ogTitle, description: ogDescription } = getCoachBemEstarOpenGraphText({
      toolSlug,
      toolTitle: tool?.title,
      toolDescription: tool?.description,
      templateSlug: tool?.template_slug ?? toolSlug,
      fluxoNome: tool?.content?.fluxo?.nome ?? fluxoFromSlug?.fluxo.nome,
      fluxoObjetivo: tool?.content?.fluxo?.objetivo ?? fluxoFromSlug?.fluxo.objetivo,
      fluxoTipo,
    })

    const pageTitle = `${ogTitle} - Coach de Bem-estar`

    return {
      title: pageTitle,
      description: ogDescription,
      openGraph: {
        title: pageTitle,
        description: ogDescription,
        url: pageUrl,
        siteName: 'YLADA Coach de Bem-estar',
        type: 'website',
        locale: 'pt_BR',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogTitle,
            type: ogImageType(ogImageUrl),
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description: ogDescription,
        images: [ogImageUrl],
      },
    }
  } catch {
    const fallbackImage = getCoachBemEstarOpenGraphImageUrl({
      baseUrl,
      toolSlug,
      templateSlug: toolSlug,
    })
    return {
      title: 'Ferramenta de bem-estar - Coach de Bem-estar',
      description: 'Acesse ferramentas personalizadas de coaching de bem-estar',
      openGraph: {
        title: 'Ferramenta de bem-estar - Coach de Bem-estar',
        description: 'Acesse ferramentas personalizadas de coaching de bem-estar',
        url: pageUrl,
        siteName: 'YLADA Coach de Bem-estar',
        type: 'website',
        locale: 'pt_BR',
        images: [
          {
            url: fallbackImage,
            width: 1200,
            height: 630,
            type: ogImageType(fallbackImage),
          },
        ],
      },
    }
  }
}

export default function ToolLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
