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
import { readDesafio } from '@/lib/porta-unica/desafio-client'
import { reconhecimentoDoDesafio } from '@/lib/porta-unica/reconhecimento-desafio'
import type { DesafioResposta } from '@/lib/porta-unica/desafio'

/** Destino: o Noel da matriz com o chat já aberto (`?chat=1` expande a recepção). */
const NOEL_HOME_COM_CHAT = '/pt/home?chat=1'

export default function NoelDiretoComecar() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [resposta, setResposta] = useState<DesafioResposta | null>(null)

  useEffect(() => {
    setResposta(readDesafio())
    setMounted(true)
  }, [])

  function falarComNoel(): void {
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
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700"
        >
          Começar com o Noel
        </button>
      </div>
    </main>
  )
}
