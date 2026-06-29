/**
 * Porta única de entrada: tela 1 (paradoxo + "Descubra como") → tela 2 (a
 * pergunta + opções) → tela 3 (devolutiva que REAGE à escolha + CTA de cadastro).
 * Captura a resposta no localStorage e leva pro cadastro existente preservando o
 * ?ref do loop. A devolutiva forte (diagnóstico) segue na lane do Noel, pós-cadastro;
 * aqui é só o toque "a" (1-2 linhas) que paga o "Descubra como".
 * @see blueprint-plataforma/Porta_Unica_Entrada_Regua.md §3, §5
 * @see blueprint-plataforma/Noel_Completo_Metodo_e_Conducao.md §9.3 (r89, refinada r90)
 */
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  DESAFIO_OPCOES,
  montarResposta,
  respostaCompleta,
  type DesafioKey,
} from '@/lib/porta-unica/desafio'
import { persistDesafio } from '@/lib/porta-unica/desafio-client'
import { devolutivaReativaPara } from '@/lib/porta-unica/devolutiva-reativa'
import { buildSignupUrlWithReferral, parseReferralParams } from '@/lib/referrals/referral-url'
import { persistReferral } from '@/lib/referrals/referral-client'

export default function PortaUnica() {
  const router = useRouter()
  const [passo, setPasso] = useState<1 | 2 | 3>(1)
  const [ref, setRef] = useState<string | null>(null)
  const [escolha, setEscolha] = useState<DesafioKey | null>(null)

  useEffect(() => {
    const parsed = parseReferralParams(window.location.search)
    setRef(parsed.ref)
    persistReferral(parsed.ref, parsed.source)
  }, [])

  function irParaDevolutiva(key: DesafioKey, textoLivre: string): void {
    persistDesafio(montarResposta(key, textoLivre))
    setEscolha(key)
    setPasso(3)
  }

  function criarConta(): void {
    router.push(buildSignupUrlWithReferral({ code: ref }))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {passo === 1 ? <Tela1 onAvancar={() => setPasso(2)} /> : null}
        {passo === 2 ? <Tela2 onResponder={irParaDevolutiva} /> : null}
        {passo === 3 && escolha ? <Tela3 desafioKey={escolha} onCriarConta={criarConta} /> : null}
      </div>
    </main>
  )
}

function Tela1({ onAvancar }: { onAvancar: () => void }) {
  return (
    <div className="text-center">
      <div className="mb-6 flex justify-center">
        <Image
          src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
          alt="YLADA"
          width={280}
          height={84}
          priority
          className="h-12 w-auto object-contain"
        />
      </div>
      <h1 className="mb-8 text-3xl font-bold leading-tight text-gray-900">
        Explique menos.
        <br />
        Venda mais.
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

function Tela3({
  desafioKey,
  onCriarConta,
}: {
  desafioKey: DesafioKey
  onCriarConta: () => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-700">Noel</p>
      <p className="mb-8 text-lg leading-relaxed text-gray-900">{devolutivaReativaPara(desafioKey)}</p>
      <button
        type="button"
        onClick={onCriarConta}
        className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700"
      >
        Criar minha conta
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
