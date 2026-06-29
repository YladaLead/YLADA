/**
 * Casca do "Noel direto" (pós-cadastro, Fase 2): lê o `ylada_desafio` capturado
 * pela porta, reconhece o que a pessoa já disse (sem re-perguntar) e cai direto no
 * Noel servindo. A condução de verdade (diagnóstico do dono / Espelho) é a lane do
 * método, dentro do Noel — aqui é só a ponte que lê o desafio e abre o chat.
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (Fase 2, r88)
 */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { readDesafio } from '@/lib/porta-unica/desafio-client'
import { reconhecimentoDoDesafio } from '@/lib/porta-unica/reconhecimento-desafio'
import type { DesafioResposta } from '@/lib/porta-unica/desafio'

/** Destino: o Noel da matriz com o chat já aberto (`?chat=1` expande a recepção). */
const NOEL_HOME_COM_CHAT = '/pt/home?chat=1'

type SessaoMinima = { access_token?: string } | null
type UsuarioMinimo = { email?: string | null; user_metadata?: Record<string, unknown> } | null

/** Nome que a pessoa já deu no cadastro (sessão). A API só cria a linha de
 *  `user_profiles` se vier nome OU WhatsApp — então mandamos o nome. */
function nomeDoUsuario(user: UsuarioMinimo): string {
  const meta = user?.user_metadata
  const full = typeof meta?.full_name === 'string' ? meta.full_name.trim() : ''
  const name = typeof meta?.name === 'string' ? meta.name.trim() : ''
  const fromEmail = user?.email ? user.email.split('@')[0] : ''
  return full || name || fromEmail || 'Novo usuário'
}

/**
 * Garante a linha em `user_profiles` (perfil `ylada`) que a onboarding antiga criava
 * — sem ela a guarda do /pt/home derruba o usuário novo pro login. O PUT
 * /api/ylada/profile só insere a linha quando há nome/WhatsApp (route ~l.253), por
 * isso mandamos o nome (já dado no cadastro) + o token de sessão no header. Best-effort:
 * não trava a navegação se falhar (no pior caso a guarda reclama e a gente vê o log).
 */
async function garantirPerfilYlada(user: UsuarioMinimo, session: SessaoMinima): Promise<void> {
  try {
    const authHeader = session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}
    await fetch('/api/ylada/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      credentials: 'include',
      body: JSON.stringify({ segment: 'ylada', area_specific: { nome: nomeDoUsuario(user) } }),
    })
  } catch {
    /* best-effort: segue pro Noel mesmo se o ensure falhar */
  }
}

export default function NoelDiretoComecar() {
  const router = useRouter()
  const { user, session } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [seguindo, setSeguindo] = useState(false)
  const [resposta, setResposta] = useState<DesafioResposta | null>(null)

  useEffect(() => {
    setResposta(readDesafio())
    setMounted(true)
  }, [])

  async function falarComNoel(): Promise<void> {
    setSeguindo(true)
    await garantirPerfilYlada(user as UsuarioMinimo, session as SessaoMinima)
    router.push(NOEL_HOME_COM_CHAT)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex justify-center">
          <Image
            src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
            alt="YLADA"
            width={280}
            height={84}
            priority
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-700">Noel</p>
        {!mounted ? (
          <div className="h-7 w-3/4 animate-pulse rounded bg-gray-100" aria-hidden />
        ) : (
          <>
            <p className="mb-2 text-lg leading-relaxed text-gray-900">{reconhecimentoDoDesafio(resposta)}</p>
            <p className="mb-8 text-base leading-relaxed text-gray-600">
              Vou te ajudar com isso. Bora começar?
            </p>
          </>
        )}
        <button
          type="button"
          onClick={falarComNoel}
          disabled={seguindo}
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {seguindo ? 'Preparando…' : 'Começar com o Noel'}
        </button>
      </div>
    </main>
  )
}
