import { readFile } from 'fs/promises'
import path from 'path'
import { ImageResponse } from 'next/og'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * OG dinâmico: leitura só de PNGs em `public/marketing/` com caminhos literais em cada `readFile`.
 * Evita `readFile(..., rel)` com `rel` variável — o file tracer da Vercel incluía todo `public/` (~250MB+ de `images/og`).
 */
export const runtime = 'nodejs'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const T_DIAG_CAP = 'diagnostico_capilar_v1' as const
const T_DIAG_CORP = 'diagnostico_corporal_v1' as const
const T_PRE_CAP = 'pre_diagnostico_capilar_v1' as const
const T_PRE_CORP = 'pre_diagnostico_corporal_v1' as const
const T_PRE_AVAL_CLIENTE = 'pre_avaliacao_capilar_cliente_v1' as const

async function resolveTemplateKeyFromToken(token: string): Promise<string | null> {
  const t = decodeURIComponent((token || '').trim())
  if (!t) return null
  const sb = getSupabaseAdmin()
  if (!sb) return null

  const { data: link, error: linkErr } = await sb
    .from('ylada_estetica_consultancy_share_links')
    .select('material_id, estetica_consult_client_id')
    .eq('token', t)
    .maybeSingle()
  if (linkErr || !link) return null

  const { data: mat, error: matErr } = await sb
    .from('ylada_estetica_consultancy_materials')
    .select('template_key')
    .eq('id', link.material_id as string)
    .maybeSingle()
  if (matErr || !mat) return null

  return (mat as { template_key?: string | null }).template_key ?? null
}

async function loadResponderOgBuffer(templateKey: string | null): Promise<Buffer> {
  const root = process.cwd()
  if (templateKey === T_DIAG_CAP) {
    return readFile(
      path.join(root, 'public', 'marketing', 'estetica-diagnostico-pre-reuniao-pos-pagamento-capilar.png')
    )
  }
  if (templateKey === T_DIAG_CORP) {
    return readFile(
      path.join(root, 'public', 'marketing', 'estetica-diagnostico-pre-reuniao-pos-pagamento-corporal.png')
    )
  }
  if (templateKey === T_PRE_CAP || templateKey === T_PRE_CORP || templateKey === T_PRE_AVAL_CLIENTE) {
    return readFile(path.join(root, 'public', 'marketing', 'estetica-consultoria-responder-og.png'))
  }
  return readFile(path.join(root, 'public', 'marketing', 'estetica-consultoria-responder-og.png'))
}

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const safe = typeof token === 'string' ? decodeURIComponent(token).trim() : ''
  const templateKey = safe ? await resolveTemplateKeyFromToken(safe) : null

  const buf = await loadResponderOgBuffer(templateKey)
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
