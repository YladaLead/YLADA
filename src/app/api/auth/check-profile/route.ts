import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

type CheckProfileResponse = {
  exists: boolean
  hasProfile: boolean
  canCreate: boolean
  perfil?: string | null
  is_admin?: boolean
  is_support?: boolean
}

const CACHE_TTL_MS = 1000 * 60 * 5 // 5 minutos
const profileCache = new Map<string, { expiresAt: number; payload: CheckProfileResponse }>()

function getCachedProfile(email: string) {
  const cached = profileCache.get(email)
  if (!cached) return null
  if (cached.expiresAt > Date.now()) {
    return cached.payload
  }
  profileCache.delete(email)
  return null
}

function setCachedProfile(email: string, payload: CheckProfileResponse) {
  profileCache.set(email, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    payload,
  })
}

/**
 * Verificar perfil por email antes do login/cadastro
 * Retorna o perfil atual do email (se existir)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    const cached = getCachedProfile(normalizedEmail)
    if (cached) {
      return NextResponse.json({ ...cached, cache: 'hit' })
    }

    // Buscar diretamente na tabela user_profiles (indexada e bem mais rápida)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, email, is_admin, is_support')
      .ilike('email', normalizedEmail)
      .maybeSingle()

    // Se o erro for HTML ou de rede (Supabase inacessível, URL errada, projeto pausado),
    // retornar resposta segura para não bloquear o login (frontend continua com signIn)
    const errorMsg = (profileError?.message || '').toString()
    const looksLikeHtml = errorMsg.trimStart().startsWith('<') || /<!DOCTYPE/i.test(errorMsg)
    const isNetworkOrConfig =
      profileError?.code === 'PGRST301' ||
      /fetch failed|econnreset|etimedout|enotfound|network/i.test(errorMsg)

    if (profileError && profileError.code !== 'PGRST116') {
      if (looksLikeHtml || isNetworkOrConfig) {
        console.warn(
          'check-profile: Supabase inacessível ou resposta inesperada, permitindo login com fallback:',
          errorMsg.slice(0, 80)
        )
        const defaultResponse: CheckProfileResponse = {
          exists: false,
          hasProfile: false,
          canCreate: true,
        }
        return NextResponse.json(defaultResponse)
      }
      console.error('Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao verificar perfil' },
        { status: 500 }
      )
    }

    if (profile) {
      const response: CheckProfileResponse = {
        exists: true,
        hasProfile: true,
        canCreate: false,
        perfil: profile.perfil,
        is_admin: profile.is_admin || false,
        is_support: profile.is_support || false,
      }
      setCachedProfile(normalizedEmail, response)
      return NextResponse.json(response)
    }

    // Caso não exista em user_profiles, considerar como novo email.
    // O Supabase bloqueará cadastro duplicado se já houver usuário com este email.
    const defaultResponse: CheckProfileResponse = {
      exists: false,
      hasProfile: false,
      canCreate: true,
    }
    setCachedProfile(normalizedEmail, defaultResponse)
    return NextResponse.json(defaultResponse)
  } catch (error: any) {
    const msg = (error?.message || String(error)).slice(0, 200)
    const looksLikeHtml = /<\s*!?\s*DOCTYPE|<\s*html/i.test(msg)
    console.error('Erro ao verificar perfil:', looksLikeHtml ? msg : error)
    // Se a exceção for HTML/resposta inesperada, não bloquear login
    if (looksLikeHtml || /fetch failed|econnreset|etimedout/i.test(msg)) {
      return NextResponse.json({
        exists: false,
        hasProfile: false,
        canCreate: true,
      })
    }
    return NextResponse.json(
      { error: 'Erro interno ao verificar perfil' },
      { status: 500 }
    )
  }
}

