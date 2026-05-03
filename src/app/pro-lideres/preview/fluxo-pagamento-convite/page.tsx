'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

type Scenario =
  | 'choose'
  | 'open_pix'
  | 'open_card'
  | 'open_pix_only'
  | 'ativacao_links'
  | 'ativacao_sem_links'

const MOCK_PIX = 'https://exemplo.ylada.com/pagamento-pix-membro'
const MOCK_CARD = 'https://exemplo.ylada.com/pagamento-cartao-membro'
const MOCK_SPACE = 'Consultoria Demo (nome do espaço)'

export default function ProLideresPreviewFluxoPagamentoConvitePage() {
  const [scenario, setScenario] = useState<Scenario>('choose')

  const openLinkState = useMemo(() => {
    if (scenario === 'open_pix') {
      return { kind: 'pix' as const, url: MOCK_PIX, chooseBack: { cardUrl: MOCK_CARD, pixUrl: MOCK_PIX } }
    }
    if (scenario === 'open_card') {
      return { kind: 'card' as const, url: MOCK_CARD, chooseBack: { cardUrl: MOCK_CARD, pixUrl: MOCK_PIX } }
    }
    if (scenario === 'open_pix_only') {
      return { kind: 'pix' as const, url: MOCK_PIX, chooseBack: undefined }
    }
    return null
  }, [scenario])

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-semibold">Pré-visualização (cópia e layout)</p>
        <p className="mt-1 text-amber-900/90">
          Isto não cria conta nem convite. Serve só para rever as mensagens do fluxo após o cadastro — o fluxo real está em{' '}
          <code className="rounded bg-white/80 px-1">/pro-lideres/convite/[token]</code> e em{' '}
          <code className="rounded bg-white/80 px-1">/pro-lideres/membro/ativacao</code>.
        </p>
        <Link href="/pro-lideres" className="mt-2 inline-block text-sm font-medium text-blue-700 underline">
          Voltar ao Pro Líderes
        </Link>
      </div>

      <div className="mx-auto mb-6 max-w-3xl">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Cenário</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ['choose', 'Convite: escolher Pix ou cartão'],
              ['open_pix', 'Convite: após escolher Pix'],
              ['open_card', 'Convite: após escolher cartão'],
              ['open_pix_only', 'Convite: só link Pix (sem escolha)'],
              ['ativacao_links', 'Página de espera (com links)'],
              ['ativacao_sem_links', 'Página de espera (sem links)'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setScenario(id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                scenario === id
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
          <div className="mb-6 flex justify-center">
            <Image
              src={YLADA_OG_FALLBACK_LOGO_PATH}
              alt="YLADA"
              width={200}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          {scenario === 'choose' ? (
            <div className="space-y-6 text-center">
              <h1 className="text-xl font-bold text-gray-900">
                Prefere fazer a sua assinatura pelo Pix ou pelo cartão?
              </h1>
              <div className="flex flex-col gap-3">
                <span className="inline-flex min-h-[48px] w-full cursor-default items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white opacity-90">
                  Pix
                </span>
                <span className="inline-flex min-h-[48px] w-full cursor-default items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-semibold text-white opacity-90">
                  Cartão
                </span>
              </div>
            </div>
          ) : scenario === 'ativacao_links' || scenario === 'ativacao_sem_links' ? (
            <>
              <h1 className="text-center text-xl font-bold text-gray-900">Obrigado!</h1>
              <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
                O teu registo em <strong className="text-gray-900">{MOCK_SPACE}</strong> foi recebido com sucesso.
              </p>
              <p className="mt-2 text-center text-sm font-medium text-gray-800">
                Em breve o teu acesso ao painel Pro Líderes será libertado.
              </p>
              {scenario === 'ativacao_links' ? (
                <div className="mt-6 space-y-3">
                  <p className="text-center text-xs text-gray-500">Se ainda precisares de pagar, usa uma destas opções:</p>
                  <span className="flex min-h-[48px] w-full cursor-default items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white opacity-90">
                    Pix
                  </span>
                  <span className="flex min-h-[48px] w-full cursor-default items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white opacity-90">
                    Cartão
                  </span>
                </div>
              ) : (
                <p className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-700">
                  Se precisares de combinar o pagamento, fala com a tua equipa. Em breve voltamos aqui contigo.
                </p>
              )}
              <p className="mt-6 text-center text-sm text-gray-500">Podes fechar esta página e voltar mais tarde.</p>
              <p className="mt-8 text-center text-xs text-gray-500">
                <span className="font-medium text-blue-600">Sair e entrar com outra conta</span>
              </p>
            </>
          ) : openLinkState ? (
            <div className="space-y-5 text-center">
              <h1 className="text-xl font-bold text-gray-900">Tudo certo com o acesso</h1>
              <p className="text-sm leading-relaxed text-gray-700">
                {openLinkState.kind === 'pix' ? (
                  <>
                    Abra o <strong className="text-gray-900">link de pagamento via Pix</strong> que o líder deixou, conclua conforme
                    combinado com a equipe; em seguida o líder liberta o acesso ao painel.
                  </>
                ) : (
                  <>
                    Abra o <strong className="text-gray-900">link de pagamento com cartão ou no Mercado Pago</strong>, conclua conforme
                    combinado com a equipe; em seguida o líder liberta o acesso ao painel.
                  </>
                )}
              </p>
              <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-left text-sm text-amber-950">
                <p className="font-semibold">
                  {openLinkState.kind === 'pix' ? 'Link (Pix)' : 'Link (cartão / Mercado Pago)'}
                </p>
                <p className="mt-1 break-all font-mono text-xs">{openLinkState.url}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <span className="inline-flex min-h-[48px] cursor-default items-center justify-center rounded-xl bg-amber-700 px-5 text-sm font-semibold text-white opacity-90">
                  Abrir link de pagamento
                </span>
                <span className="inline-flex min-h-[48px] cursor-default items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900">
                  Ver página de espera do acesso
                </span>
              </div>
              {openLinkState.chooseBack ? (
                <p className="text-sm font-medium text-blue-600 underline">Escolher outra forma de pagamento</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">No convite, após «Aceitar e entrar» (fluxo já logado)</p>
        <p className="mt-2 text-gray-600">
          Mensagem verde: <strong>«A seguir: página de espera até o líder ativar o acesso…»</strong> (enquanto o pedido é processado).
        </p>
      </div>
    </div>
  )
}
