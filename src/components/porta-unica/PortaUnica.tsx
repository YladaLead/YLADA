/**
 * Porta única de entrada (fatia independente): tela 1 (paradoxo + "Descubra como")
 * → tela 2 (a pergunta + opções). Captura a resposta no localStorage e leva pro
 * cadastro existente preservando o ?ref do loop. A devolutiva que reage é a lane
 * do método do Noel e entra depois (não está aqui).
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md §3, §5
 */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DESAFIO_OPCOES,
  montarResposta,
  respostaCompleta,
  type DesafioKey,
} from '@/lib/porta-unica/desafio'
import { persistDesafio } from '@/lib/porta-unica/desafio-client'
import { buildSignupUrlWithReferral, parseReferralParams } from '@/lib/referrals/referral-url'
import { persistReferral } from '@/lib/referrals/referral-client'

export default function PortaUnica() {
  const router = useRouter()
  const [passo, setPasso] = useState<1 | 2>(1)
  const [ref, setRef] = useState<string | null>(null)

  useEffect(() => {
    const parsed = parseReferralParams(window.location.search)
    setRef(parsed.ref)
    persistReferral(parsed.ref, parsed.source)
  }, [])

  function avancarParaCadastro(key: DesafioKey, textoLivre: string): void {
    persistDesafio(montarResposta(key, textoLivre))
    router.push(buildSignupUrlWithReferral({ code: ref }))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {passo === 1 ? (
          <Tela1 onAvancar={() => setPasso(2)} />
        ) : (
          <Tela2 onResponder={avancarParaCadastro} />
        )}
      </div>
    </main>
  )
}

function Tela1({ onAvancar }: { onAvancar: () => void }) {
  return (
    <div className="text-center">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-sky-600">YLADA</p>
      <h1 className="mb-8 text-3xl font-bold leading-tight text-gray-900">
        Explique menos. Venda mais.
      </h1>
      <button
        type="button"
        onClick={onAvancar}
        className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700"
      >
        Descubra como
      </button>
    </div>
  )
}

function Tela2({
  onResponder,
}: {
  onResponder: (key: DesafioKey, textoLivre: string) => void
}) {
  const [selecionada, setSelecionada] = useState<DesafioKey | null>(null)
  const [textoLivre, setTextoLivre] = useState('')
  const pronto = respostaCompleta(selecionada, textoLivre)

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold text-gray-900">O que mais te ajudaria agora?</h2>
      <ul className="flex flex-col gap-3">
        {DESAFIO_OPCOES.map((opcao) => (
          <li key={opcao.key}>
            <OpcaoBotao
              label={opcao.label}
              ativa={selecionada === opcao.key}
              onClick={() => setSelecionada(opcao.key)}
            />
          </li>
        ))}
      </ul>

      {selecionada === 'outro' ? (
        <textarea
          value={textoLivre}
          onChange={(e) => setTextoLivre(e.target.value.slice(0, 280))}
          rows={3}
          autoFocus
          placeholder="Me conta o que você queria que andasse melhor"
          className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-sky-500"
        />
      ) : null}

      <button
        type="button"
        disabled={!pronto}
        onClick={() => selecionada && onResponder(selecionada, textoLivre)}
        className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continuar
      </button>
    </div>
  )
}

function OpcaoBotao({
  label,
  ativa,
  onClick,
}: {
  label: string
  ativa: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-5 py-4 text-left text-base font-medium transition-colors ${
        ativa
          ? 'border-sky-600 bg-sky-50 text-sky-900'
          : 'border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
