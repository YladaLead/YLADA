import { ImageResponse } from 'next/og'
import {
  buildEsteticaResponderShareDescription,
  buildEsteticaResponderShareTitle,
  publicSiteOriginForEsteticaResponderOg,
  responderOgAccentColor,
  responderOgBandLabel,
  responderOgFormKindLabel,
  resolveEsteticaConsultoriaResponderShareContext,
} from '@/lib/estetica-consultoria-responder-og'

/** Manter alinhado a `@/lib/estetica-consultoria-form-templates` (evita importar o módulo grande nesta rota). */
const TEMPLATE_DIAGNOSTICO_CAPILAR_ID = 'diagnostico_capilar_v1' as const
const TEMPLATE_DIAGNOSTICO_CORPORAL_ID = 'diagnostico_corporal_v1' as const

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const DIAGNOSTICO_POS_PAGAMENTO_FILE: Record<string, string> = {
  [TEMPLATE_DIAGNOSTICO_CAPILAR_ID]: 'marketing/estetica-diagnostico-pre-reuniao-pos-pagamento-capilar.png',
  [TEMPLATE_DIAGNOSTICO_CORPORAL_ID]: 'marketing/estetica-diagnostico-pre-reuniao-pos-pagamento-corporal.png',
}

function absolutePublicAssetUrl(publicPathNoLeadingSlash: string): string {
  const base = publicSiteOriginForEsteticaResponderOg().replace(/\/$/, '')
  const rel = publicPathNoLeadingSlash.replace(/^\//, '')
  return `${base}/${rel}`
}

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const safe = typeof token === 'string' ? decodeURIComponent(token).trim() : ''
  const ctx = safe ? await resolveEsteticaConsultoriaResponderShareContext(safe) : { band: 'unknown' as const, templateKey: null }
  const { band, templateKey } = ctx

  const relFile =
    templateKey && DIAGNOSTICO_POS_PAGAMENTO_FILE[templateKey]
      ? DIAGNOSTICO_POS_PAGAMENTO_FILE[templateKey]
      : null
  if (relFile) {
    const imgUrl = absolutePublicAssetUrl(relFile)
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
          }}
        >
          <img src={imgUrl} width={1200} height={630} alt="" style={{ objectFit: 'cover', width: 1200, height: 630 }} />
        </div>
      ),
      { ...size }
    )
  }

  const headline = buildEsteticaResponderShareTitle(band, templateKey)
  const kindLine = responderOgFormKindLabel(templateKey)
  const line = responderOgBandLabel(band)
  const paragraph = buildEsteticaResponderShareDescription(band, templateKey)
  const accent = responderOgAccentColor(templateKey, band)

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '52px 60px',
          background: 'linear-gradient(145deg, #f8fafc 0%, #e0f2fe 45%, #ffffff 100%)',
          fontFamily: 'ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.12,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 30,
            fontWeight: 700,
            color: accent,
            lineHeight: 1.15,
          }}
        >
          {kindLine} · {line}
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 24,
            fontWeight: 500,
            color: '#334155',
            maxWidth: 1040,
            lineHeight: 1.4,
          }}
        >
          {paragraph}
        </div>
      </div>
    ),
    { ...size }
  )
}
