import type { NextRequest } from 'next/server'

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
