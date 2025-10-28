import { NextResponse } from 'next/server'

// Rate limiting simples em memória (para produção, usar Redis)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  limit: number
  window: number // em segundos
  identifier?: string
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const { limit, window } = options
  const now = Date.now()
  const resetTime = now + window * 1000

  const key = identifier
  const record = requestCounts.get(key)

  if (!record || record.resetTime < now) {
    // Novo período de rate limit
    requestCounts.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: limit - 1, resetTime }
  }

  const { count } = record

  if (count >= limit) {
    // Rate limit excedido
    return { 
      allowed: false, 
      remaining: 0, 
      resetTime: record.resetTime 
    }
  }

  // Incrementar contador
  requestCounts.set(key, { count: count + 1, resetTime: record.resetTime })
  
  // Limpar registros expirados periodicamente
  if (requestCounts.size > 10000) {
    cleanupExpired()
  }

  return { 
    allowed: true, 
    remaining: limit - count - 1, 
    resetTime: record.resetTime 
  }
}

function cleanupExpired() {
  const now = Date.now()
  for (const [key, record] of requestCounts.entries()) {
    if (record.resetTime < now) {
      requestCounts.delete(key)
    }
  }
}

// Rate limit por IP
export async function rateLimitByIP(
  request: Request,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'

  return rateLimit(`ip:${ip}`, { ...options, identifier: ip })
}

// Rate limit por endpoint
export async function rateLimitByEndpoint(
  endpoint: string,
  identifier: string,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  return rateLimit(`endpoint:${endpoint}:${identifier}`, {
    ...options,
    identifier,
  })
}

// Rate limit combine (IP + endpoint)
export async function rateLimitCombine(
  request: Request,
  endpoint: string,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'

  return rateLimit(`combined:${endpoint}:${ip}`, {
    ...options,
    identifier: `${endpoint}:${ip}`,
  })
}

// Middleware helper para usar em API routes
export async function withRateLimit(
  request: Request,
  endpoint: string,
  callback: () => Promise<Response>,
  options: RateLimitOptions = { limit: 10, window: 60 }
) {
  const result = await rateLimitCombine(request, endpoint, options)

  if (!result.allowed) {
    return NextResponse.json(
      { 
        error: 'Rate limit excedido',
        message: 'Muitas requisições. Tente novamente em alguns instantes.',
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': options.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return callback()
}

