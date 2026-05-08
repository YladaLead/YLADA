import type { NextRequest } from 'next/server'
import { headers } from 'next/headers'

/**
 * Base URL absoluta para `og:image` / `og:url` em `generateMetadata` (sem `NextRequest`).
 * Prioriza o **host do pedido** (`www.ylada.com`, preview Vercel, etc.) para o WhatsApp não pedir
 * imagens noutro domínio definido só em `NEXT_PUBLIC_APP_URL`.
 */
export async function resolveYladaOgBaseUrlForMetadata(): Promise<string> {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.trim().replace(/\/$/, '') ||
    ''

  try {
    const h = await headers()
    const xfHost = h.get('x-forwarded-host')?.split(',')[0]?.trim()
    const host = (xfHost || h.get('host') || '').trim()
    if (host) {
      const proto = h.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https'
      return `${proto}://${host}`.replace(/\/$/, '')
    }
  } catch {
    /* headers() indisponível em alguns contextos */
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const hostOnly = vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return `https://${hostOnly}`
  }

  if (fromEnv) return fromEnv
  return 'https://ylada.app'
}

/**
 * Base URL pública para links `/l/[slug]`.
 * Chamadas server-side `fetch()` às APIs podem trazer Host interno ou sem `x-forwarded-proto`;
 * priorizamos env canônico para o líder abrir/copiar o mesmo URL que o contato usa.
 */
export function resolveYladaPublicLinkBaseUrl(request: NextRequest): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.trim().replace(/\/$/, '') ||
    ''
  if (fromEnv) return fromEnv

  const fromCaller = request.headers.get('x-ylada-public-origin')?.trim().replace(/\/$/, '')
  if (fromCaller && /^https?:\/\//i.test(fromCaller)) {
    try {
      const u = new URL(fromCaller)
      if (u.protocol === 'http:' || u.protocol === 'https:') {
        return `${u.protocol}//${u.host}`
      }
    } catch {
      /* ignore */
    }
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    const hostOnly = vercel.replace(/^https?:\/\//, '').replace(/\/$/, '')
    return `https://${hostOnly}`
  }

  const xfHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const host = (xfHost || request.headers.get('host') || '').replace(/\/$/, '')
  const proto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'http'
  if (host) return `${proto}://${host}`

  return ''
}
