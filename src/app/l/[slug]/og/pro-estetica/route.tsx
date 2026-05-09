import { ImageResponse } from 'next/og'
import { supabaseAdmin } from '@/lib/supabase'
import { normalizeYladaPublicLinkPathSegment } from '@/lib/ylada-public-link-path-normalize'
import { getProEsteticaOgDynamicCardLines } from '@/config/pro-estetica-og-dynamic-card-hooks'
import type { ProEsteticaDiagnosisVertical } from '@/lib/pro-estetica/pro-estetica-public-link-og'

export const runtime = 'nodejs'

/** URL resolvido via Google Fonts CSS (`Noto Sans` 700) — TTF para Satori/`ImageResponse`. */
async function loadNotoSansBold(): Promise<ArrayBuffer> {
  const res = await fetch(
    'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9d.ttf',
    { next: { revalidate: 86400 } },
  )
  if (!res.ok) throw new Error(`font fetch ${res.status}`)
  return res.arrayBuffer()
}

function card(
  lines: { headline: string; subline: string },
  palette: { from: string; via: string; to: string; accent: string },
) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 72,
        background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 52%, ${palette.to} 100%)`,
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: '#f8fafc',
          lineHeight: 1.1,
          letterSpacing: -0.02,
          maxWidth: 1050,
          fontFamily: 'Noto Sans',
        }}
      >
        {lines.headline}
      </div>
      <div
        style={{
          marginTop: 34,
          fontSize: 29,
          fontWeight: 700,
          color: palette.accent,
          lineHeight: 1.38,
          maxWidth: 1020,
          fontFamily: 'Noto Sans',
        }}
      >
        {lines.subline}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 46,
          right: 70,
          fontSize: 25,
          fontWeight: 700,
          color: '#94a3b8',
          letterSpacing: 0.06,
          fontFamily: 'Noto Sans',
        }}
      >
        YLADA
      </div>
    </div>
  )
}

const PALETTE_CAPILAR = { from: '#0c4a6e', via: '#155e75', to: '#0e7490', accent: '#7dd3fc' }
const PALETTE_CORPORAL = { from: '#1e1b4b', via: '#312e81', to: '#4c1d95', accent: '#e9d5ff' }
const PALETTE_GENERIC = { from: '#0f172a', via: '#334155', to: '#1e293b', accent: '#cbd5e1' }

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug: slugRaw } = await context.params
  const slug = slugRaw ? normalizeYladaPublicLinkPathSegment(slugRaw) : ''

  let vertical: ProEsteticaDiagnosisVertical | null = null
  let templateId: string | null = null
  let linkTitle = 'Link inteligente'

  if (slug && supabaseAdmin) {
    const { data: link } = await supabaseAdmin
      .from('ylada_links')
      .select('title, config_json, template_id')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()

    if (link) {
      const config = (link.config_json as Record<string, unknown>) ?? {}
      const meta = (config.meta as Record<string, unknown>) ?? {}
      const page = (config.page as Record<string, unknown>) ?? {}
      const dv = typeof meta.diagnosis_vertical === 'string' ? meta.diagnosis_vertical.trim().toLowerCase() : ''
      if (dv === 'capilar' || dv === 'corporal') {
        vertical = dv
      }
      templateId = typeof link.template_id === 'string' ? link.template_id.trim() : null
      linkTitle =
        (page.title as string) ?? (config.title as string) ?? (link.title as string) ?? 'Link inteligente'
    }
  }

  const shortTitle = (() => {
    const t = linkTitle.trim()
    return t.length > 68 ? `${t.slice(0, 65)}…` : t
  })()

  const lines =
    vertical != null
      ? getProEsteticaOgDynamicCardLines({ vertical, templateId, linkTitle })
      : {
          headline: shortTitle || 'Quiz inteligente',
          subline: 'Toque no link — respostas rápidas e um resultado pensado pra você.',
        }

  const palette = vertical === 'capilar' ? PALETTE_CAPILAR : vertical === 'corporal' ? PALETTE_CORPORAL : PALETTE_GENERIC

  let fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: 700 }[] = []
  try {
    fonts = [{ name: 'Noto Sans', data: await loadNotoSansBold(), style: 'normal', weight: 700 }]
  } catch {
    fonts = []
  }

  return new ImageResponse(card(lines, palette), {
    width: 1200,
    height: 630,
    fonts,
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
