import { readFile } from 'fs/promises'
import path from 'path'
import { ImageResponse } from 'next/og'
import {
  esteticaResponderShareOgImagePath,
  resolveEsteticaConsultoriaResponderShareContext,
} from '@/lib/estetica-consultoria-responder-og'

export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const safe = typeof token === 'string' ? decodeURIComponent(token).trim() : ''
  const ctx = safe ? await resolveEsteticaConsultoriaResponderShareContext(safe) : { band: 'unknown' as const, templateKey: null }

  const rel =
    esteticaResponderShareOgImagePath(ctx.templateKey)?.replace(/^\//, '') ??
    'marketing/estetica-consultoria-responder-og.png'

  const full = path.join(process.cwd(), 'public', rel)
  const buf = await readFile(full)
  const dataUrl = `data:image/png;base64,${buf.toString('base64')}`

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
        <img src={dataUrl} width={1200} height={630} alt="" style={{ objectFit: 'cover', width: 1200, height: 630 }} />
      </div>
    ),
    { ...size }
  )
}
