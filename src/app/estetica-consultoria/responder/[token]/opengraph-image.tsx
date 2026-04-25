import { ImageResponse } from 'next/og'
import {
  ESTETICA_RESPONDER_SHARE_TITLE,
  buildEsteticaResponderShareDescription,
  resolveEsteticaConsultoriaResponderOgBand,
  responderOgBandLabel,
} from '@/lib/estetica-consultoria-responder-og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const safe = typeof token === 'string' ? decodeURIComponent(token).trim() : ''
  const band = safe ? await resolveEsteticaConsultoriaResponderOgBand(safe) : 'unknown'
  const line = responderOgBandLabel(band)
  const paragraph = buildEsteticaResponderShareDescription(band)

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
            fontSize: 52,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          {ESTETICA_RESPONDER_SHARE_TITLE}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 36,
            fontWeight: 700,
            color: '#0369a1',
            lineHeight: 1.15,
          }}
        >
          {line}
        </div>
        <div
          style={{
            marginTop: 26,
            fontSize: 26,
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
