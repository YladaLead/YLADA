'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { getYladaDiagnosticoBuilderHref } from '@/config/ylada-areas'

import YladaAreaShell from './YladaAreaShell'

interface ComoUsarContentProps {
  areaCodigo: string
  areaLabel: string
}

type BlocoVariant = 'blue' | 'white' | 'yellow' | 'red' | 'neutral'

const VARIANT_CLASS: Record<BlocoVariant, string> = {
  blue: 'bg-sky-50/90 border-sky-100/80',
  white: 'bg-white border-gray-200/90',
  yellow: 'bg-amber-50/80 border-amber-100/80',
  red: 'bg-red-50/70 border-red-100/80',
  neutral: 'bg-gray-50/90 border-gray-200/80',
}

function Chevron({ className }: { className?: string }) {
  return (
    <span
      className={`shrink-0 text-gray-400 transition-transform group-open:rotate-180 ${className ?? ''}`}
      aria-hidden
    >
      ▼
    </span>
  )
}

function Destaque({ children, tone }: { children: ReactNode; tone: 'green' | 'blue' }) {
  const cls =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
      : 'border-sky-200 bg-sky-50/90 text-sky-950'
  return (
    <div className={`mt-4 rounded-lg border px-3 py-2.5 text-sm font-medium leading-snug ${cls}`}>
      {children}
    </div>
  )
}

/** Bloco expansível: fechado por padrão; resumo = título + uma frase. */
function BlocoComoUsar({
  id,
  titulo,
  resumo,
  variant,
  children,
}: {
  id: string
  titulo: string
  resumo: string
  variant: BlocoVariant
  children: ReactNode
}) {
  const shell = VARIANT_CLASS[variant]
  return (
    <details
      id={id}
      className={`group rounded-xl border shadow-sm open:shadow-md transition-shadow ${shell}`}
    >
      <summary className="cursor-pointer list-none flex items-start justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 text-left">
          <h2 className="font-semibold text-gray-900">{titulo}</h2>
          <p className="text-sm text-gray-600 mt-1 leading-snug">{resumo}</p>
        </div>
        <Chevron className="mt-1" />
      </summary>
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-black/[0.06] text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </details>
  )
}

const PASSOS_FLUXO = ['Post', 'Pessoa chama', 'Você envia perguntas', 'Pessoa descobre', 'Conversa']

function FluxoHorizontal() {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-start justify-center gap-y-5 gap-x-0 sm:justify-between">
        {PASSOS_FLUXO.map((label, i) => (
          <div key={label} className="flex items-start">
            <div className="flex w-[5rem] flex-col items-center sm:w-[5.25rem]">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white shadow-sm"
                aria-hidden
              >
                {i + 1}
              </div>
              <span className="mt-2 text-center text-[11px] font-medium leading-tight text-gray-800 sm:text-xs">
                {label}
              </span>
            </div>
            {i < PASSOS_FLUXO.length - 1 && (
              <div
                className="mx-0.5 mt-[18px] hidden h-0.5 w-3 shrink-0 bg-sky-200 sm:block md:w-6"
                aria-hidden
              />
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-gray-600 text-center sm:text-left">
        Simples assim.
        <span className="font-medium text-gray-800"> Se pular uma etapa, perde força.</span>
      </p>
    </div>
  )
}

export default function ComoUsarContent({ areaCodigo, areaLabel }: ComoUsarContentProps) {
  const diagnosticoHref = getYladaDiagnosticoBuilderHref(areaCodigo)
  void areaLabel

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl mx-auto space-y-8 pb-10">
        {/* Topo */}
        <header className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Como usar</h1>
            <p className="text-gray-800 mt-1.5 text-sm sm:text-base font-medium leading-snug">
              Menos explicação. Apenas mais respostas e venda.
            </p>
          </div>
          <p className="text-base font-semibold text-sky-900 bg-sky-50/80 border border-sky-100 rounded-xl px-3 py-2.5 leading-snug">
            Pergunta certa abre conversa que fecha.
          </p>
          <Link
            href={diagnosticoHref}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 transition-colors"
          >
            Criar meu primeiro diagnóstico
          </Link>
        </header>

        <div className="space-y-3">
          <BlocoComoUsar
            id="entenda-jeito"
            variant="blue"
            titulo="O jeito certo"
            resumo="Post puxa mensagem. Quem chama já deu o primeiro sim."
          >
            <div className="pt-4 space-y-3">
              <p>
                No post você só desperta. Quem te chama já entrou no jogo — aí você conduz com
                perguntas e diagnóstico.
              </p>
              <ul className="list-none space-y-1.5 pt-1 text-gray-800">
                <li>👉 Não entregue resposta pronta no post.</li>
                <li>👉 Entregue caminho: ela age, você vende na conversa.</li>
              </ul>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="passo-passo"
            variant="white"
            titulo="Passo a passo"
            resumo="Do post à venda: cinco passos. Pule um e o resultado enfraquece."
          >
            <FluxoHorizontal />
          </BlocoComoUsar>

          <BlocoComoUsar
            id="post-certo"
            variant="white"
            titulo="Como fazer um post que gera cliente"
            resumo="Dor + promessa curta + ‘me chama’. Sem chamada, não tem lead."
          >
            <div className="pt-4 space-y-5">
              <p className="font-medium text-gray-900">Estrutura simples</p>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900">1. Comece com a dor</p>
                  <p className="mt-1 text-gray-600">
                    Você sente que seu corpo não responde como deveria?
                  </p>
                  <p className="text-gray-600">
                    Você sente que está fazendo tudo certo e não vê resultado?
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">2. Mostre que existe solução</p>
                  <p className="mt-1 text-gray-600">Isso pode ter uma causa específica</p>
                  <p className="text-gray-600">E dá pra entender isso rápido</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">3. Chame para ação</p>
                  <ul className="mt-2 list-none space-y-2 text-gray-700">
                    <li>
                      👉 Me chama que eu te mando um caminho rápido pra você descobrir seu diagnóstico
                      gratuito
                    </li>
                    <li>👉 Comenta EU que eu te envio um teste rápido</li>
                    <li>👉 Quer descobrir seu resultado? Me chama</li>
                  </ul>
                </div>
              </div>
              <Destaque tone="green">
                Se a pessoa não te chama, o post não cumpriu o papel
              </Destaque>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="quando-chamar"
            variant="yellow"
            titulo="Quando a pessoa te chamar"
            resumo="Curto: manda o link das perguntas. Sem pitch."
          >
            <div className="pt-4 space-y-4">
              <p className="font-medium text-gray-900">Mensagem pronta</p>
              <div className="rounded-lg border border-amber-200/80 bg-white/80 px-3 py-3 text-gray-800 leading-relaxed whitespace-pre-line">
                {`Ótimo
Vou te mandar um caminho rápido com algumas perguntas
No final você já recebe seu diagnóstico`}
              </div>
              <ul className="list-none space-y-2 text-gray-700">
                <li>👉 Não explique demais</li>
                <li>👉 Não venda ainda</li>
                <li>👉 Só envie o caminho</li>
              </ul>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="por-que-funciona"
            variant="blue"
            titulo="Por que isso funciona"
            resumo="Ela se enxerga no problema; você vira referência antes do preço."
          >
            <div className="pt-4 space-y-3">
              <p className="font-medium text-gray-900">Quando a pessoa responde:</p>
              <ul className="list-none space-y-2">
                <li>Ela começa a pensar nela mesma</li>
                <li>Ela entende melhor o problema</li>
                <li>Ela confia mais em você</li>
              </ul>
              <Destaque tone="blue">Menos argumento seu. Mais clareza dela — o diagnóstico empurra a decisão.</Destaque>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="depois-diagnostico"
            variant="white"
            titulo="Como continuar a conversa"
            resumo="Cita o resultado, pergunta se faz sentido, oferece o próximo passo."
          >
            <div className="pt-4 space-y-4">
              <p className="font-medium text-gray-900">Mensagem simples</p>
              <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-3 text-gray-800 leading-relaxed whitespace-pre-line">
                {`Vi seu resultado aqui.
Faz sentido pra você isso?`}
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-3 text-gray-800 leading-relaxed whitespace-pre-line">
                {`Quer que eu te ajude com isso?
Te explico como funciona no seu caso`}
              </div>
              <Destaque tone="green">Conversa simples vende mais do que explicação longa</Destaque>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="evite-isso"
            variant="red"
            titulo="Evite isso"
            resumo="O que mata conversão — fuja disso."
          >
            <ul className="pt-4 list-none space-y-2.5 font-medium text-gray-800">
              <li>Post sem chamada</li>
              <li>Explicar demais</li>
              <li>Mandar link sem contexto</li>
              <li>Tentar vender antes da hora</li>
            </ul>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="resumo"
            variant="neutral"
            titulo="Resumo"
            resumo="Uma linha para lembrar o fluxo completo."
          >
            <p className="pt-4 text-center text-base sm:text-lg font-semibold text-gray-900 tracking-tight leading-relaxed">
              Post → Pessoa chama → Perguntas → Diagnóstico → Conversa → Cliente
            </p>
          </BlocoComoUsar>
        </div>

        <footer className="text-center border-t border-gray-200 pt-6">
          <p className="text-gray-900 font-medium text-sm sm:text-base leading-relaxed">
            A pessoa responde.
            <br />
            Ela entende sobre o problema dela.
            <br />
            Ela fecha com você.
          </p>
        </footer>
      </div>
    </YladaAreaShell>
  )
}
