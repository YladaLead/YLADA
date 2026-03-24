'use client'

import type { ReactNode } from 'react'

import YladaAreaShell from './YladaAreaShell'

interface ComoUsarContentProps {
  areaCodigo: string
  areaLabel: string
}

function Chevron({ className }: { className?: string }) {
  return (
    <span
      className={`text-gray-400 transition-transform group-open:rotate-180 ${className ?? ''}`}
      aria-hidden
    >
      ▼
    </span>
  )
}

/** Bloco expansível principal: título + resumo na barra, detalhe ao abrir. */
function SecaoComoUsar({
  id,
  titulo,
  resumo,
  children,
}: {
  id: string
  titulo: string
  resumo: string
  children: ReactNode
}) {
  return (
    <details
      id={id}
      className="group rounded-xl border border-gray-200 bg-white shadow-sm open:shadow-md open:border-gray-300 transition-shadow"
    >
      <summary className="cursor-pointer list-none flex items-start justify-between gap-3 p-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="font-semibold text-gray-900 text-left">{titulo}</h2>
          <p className="text-sm text-gray-500 mt-1 text-left leading-snug">{resumo}</p>
        </div>
        <Chevron className="shrink-0 mt-1" />
      </summary>
      <div className="px-5 pb-5 pt-0 border-t border-gray-100">{children}</div>
    </details>
  )
}

/** Subitem (1ª forma, 2ª forma…) — explicação curta ao expandir. */
function Subforma({
  titulo,
  children,
}: {
  titulo: string
  children: ReactNode
}) {
  return (
    <details className="group/sub rounded-lg border border-gray-100 bg-gray-50/80 open:bg-gray-50">
      <summary className="cursor-pointer list-none flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium text-gray-800 [&::-webkit-details-marker]:hidden">
        <span>{titulo}</span>
        <span
          className="text-gray-400 text-xs transition-transform group-open/sub:rotate-180"
          aria-hidden
        >
          ▼
        </span>
      </summary>
      <div className="px-3 pb-3 text-sm text-gray-600 leading-relaxed border-t border-gray-100/80 pt-2">
        {children}
      </div>
    </details>
  )
}

export default function ComoUsarContent({ areaCodigo, areaLabel }: ComoUsarContentProps) {
  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Como usar</h1>
          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
            Objetivo: menos teoria, mais ação. Abra um tópico, leia em um minuto e faça no WhatsApp
            ou no Instagram.
          </p>
        </header>

        <div className="space-y-3">
          <SecaoComoUsar
            id="gerar-contato"
            titulo="Gerar contato"
            resumo="Perguntas e diagnóstico: a pessoa age primeiro; você entra com conversa, não com panfleto."
          >
            <p className="text-sm text-gray-600 leading-relaxed pt-4 pb-3">
              Troque “veja meu trabalho” por um passo que peça uma resposta (escolha, autoavaliação,
              dúvida objetiva). Quem responde já abriu porta para o próximo passo.
            </p>
            <div className="space-y-2">
              <Subforma titulo="1ª forma — Link que pede resposta">
                <p>
                  Use um link de captação que termine em pergunta ou resultado pessoal (diagnóstico
                  curto, quiz, “qual situação é a sua?”). Envie com uma linha: o que ela vai
                  descobrir ao abrir — não o preço.
                </p>
              </Subforma>
              <Subforma titulo="2ª forma — Primeira mensagem depois do clique">
                <p>
                  Quando ela responder ou mandar print, confira em uma frase o que ela disse e faça
                  só uma pergunta que avance (disponibilidade, principal incômodo, se já tentou algo
                  antes).
                </p>
              </Subforma>
              <Subforma titulo="3ª forma — Noel como rascunho, você como filtro">
                <p>
                  Peça ao Noel um roteiro curto para o seu serviço e tom. Copie, enxugue para uma ou
                  duas frases no seu jeito de falar e envie. Não mande bloco automático sem ler.
                </p>
              </Subforma>
              <Subforma titulo="4ª forma — Repetição sem insistência chata">
                <p>
                  Para quem sumiu: um novo gancho (outro link ou outra pergunta) em dias diferentes.
                  Evite cobrar com textão; prefira algo útil ou curioso de novo.
                </p>
              </Subforma>
            </div>
          </SecaoComoUsar>

          <SecaoComoUsar
            id="acompanhar-clientes"
            titulo="Acompanhar clientes"
            resumo="Organize o que já entrou e responda no ritmo certo — sem perder quem está quente."
          >
            <ul className="text-sm text-gray-600 leading-relaxed space-y-3 pt-4 list-none">
              <li>
                <span className="font-medium text-gray-800">Lista viva.</span> Tudo que veio de link
                ou conversa entra num lugar só (leads / pipeline). Nome, canal, último contato.
              </li>
              <li>
                <span className="font-medium text-gray-800">Prioridade.</span> Quem respondeu
                recente ou pediu valor primeiro; depois quem só visualizou.
              </li>
              <li>
                <span className="font-medium text-gray-800">Follow-up curto.</span> Uma pergunta ou
                um envio útil; se não houver retorno, data para tentar de novo com outro ângulo.
              </li>
              <li>
                <span className="font-medium text-gray-800">Noel.</span> Use para variar mensagem de
                retomada ou resumir o histórico antes de você escrever — mantendo seu tom.
              </li>
            </ul>
          </SecaoComoUsar>

          <SecaoComoUsar
            id="converter-conversas"
            titulo="Converter conversas"
            resumo="Do interesse claro ao sim: proposta enxuta, próximo passo óbvio, sem pressão genérica."
          >
            <ul className="text-sm text-gray-600 leading-relaxed space-y-3 pt-4 list-none">
              <li>
                <span className="font-medium text-gray-800">Sinal de compra.</span> Quando ela
                perguntar preço, tempo, local ou “como funciona”, pare de educar e alinhe opção +
                valor + como agendar.
              </li>
              <li>
                <span className="font-medium text-gray-800">Uma decisão por vez.</span> Ofereça no
                máximo duas saídas (ex.: avaliação presencial / online). Menos escolha, mais
                movimento.
              </li>
              <li>
                <span className="font-medium text-gray-800">Fechar com data.</span> “Posso te
                encaixar quinta 14h ou sexta 10h?” vence “me avise quando quiser”.
              </li>
              <li>
                <span className="font-medium text-gray-800">Objeção em uma linha.</span> Responda
                dúvida real; se for preço, reafirme o que está incluído e o próximo passo. Noel ajuda
                a redigir se você travar.
              </li>
            </ul>
          </SecaoComoUsar>
        </div>
      </div>
    </YladaAreaShell>
  )
}
