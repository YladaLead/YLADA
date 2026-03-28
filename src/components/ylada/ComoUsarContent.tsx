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

function Destaque({ children, tone }: { children: ReactNode; tone: 'green' | 'blue' | 'amber' }) {
  const cls =
    tone === 'green'
      ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
      : tone === 'amber'
        ? 'border-amber-200 bg-amber-50/80 text-amber-950'
        : 'border-sky-200 bg-sky-50/90 text-sky-950'
  return (
    <div className={`mt-4 rounded-lg border px-3 py-2.5 text-sm font-medium leading-snug ${cls}`}>
      {children}
    </div>
  )
}

function BlocoComoUsar({
  id,
  titulo,
  resumo,
  variant,
  defaultOpen,
  children,
}: {
  id: string
  titulo: string
  resumo: string
  variant: BlocoVariant
  /** Abre o bloco ao carregar (bom para o primeiro tópico do guia). */
  defaultOpen?: boolean
  children: ReactNode
}) {
  const shell = VARIANT_CLASS[variant]
  return (
    <details
      id={id}
      {...(defaultOpen ? { defaultOpen: true } : {})}
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

function ListaMarcadores({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-2 mt-3">
      {items.map((t) => (
        <li key={t} className="pl-0 flex gap-2">
          <span className="text-sky-600 shrink-0" aria-hidden>
            •
          </span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

const GUIA_ANCORAS: { href: string; label: string }[] = [
  { href: '#por-que-funciona', label: 'Por que funciona' },
  { href: '#instagram-algoritmo', label: 'Direct e algoritmo' },
  { href: '#como-postar', label: 'Como postar' },
  { href: '#depois', label: 'Depois do fluxo' },
  { href: '#diferencial', label: 'Diferencial' },
  { href: '#regra-ouro', label: 'Regra de ouro' },
]

function GuiaNavegacaoRapida() {
  return (
    <nav
      className="rounded-xl border border-gray-200 bg-gray-50/90 px-3 py-3 sm:px-4"
      aria-label="Ir para uma seção do guia"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Neste guia</p>
      <div className="flex flex-wrap gap-2">
        {GUIA_ANCORAS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="inline-flex items-center rounded-full bg-white border border-gray-200 px-3 py-1.5 text-xs sm:text-sm font-medium text-sky-800 hover:border-sky-300 hover:bg-sky-50/80 transition-colors"
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default function ComoUsarContent({ areaCodigo, areaLabel }: ComoUsarContentProps) {
  const diagnosticoHref = getYladaDiagnosticoBuilderHref(areaCodigo)

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <header className="space-y-4">
          <div>
            <p className="text-sm font-medium text-sky-800 mb-1">Guia prático</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Como usar o YLADA
            </h1>
            <p className="text-gray-800 mt-3 text-base font-medium leading-snug">
              <strong>Agora fica bem mais fácil</strong> para você: dá para <strong>engajar mais</strong>,{' '}
              <strong>aprender a atrair gente mais qualificada</strong> e parar de fazer marketing sozinha no chute. O{' '}
              <strong>Noel</strong> entra para te ajudar com isso.
            </p>
          </div>

          <div className="rounded-xl border border-sky-100 bg-gradient-to-b from-sky-50/90 to-white p-4 sm:p-5 space-y-3">
            <p className="font-semibold text-gray-900">No chat, você conversa com o Noel</p>
            <p className="text-sm sm:text-[15px] text-gray-800 leading-relaxed">
              Você fala com ele sobre <strong>suas buscas</strong> e <strong>o que você quer</strong>: metas, sua área,
              como quer chamar cliente. Ele te orienta com <strong>estratégia</strong>, em cima do que você contou.
            </p>
            <p className="text-sm sm:text-[15px] text-gray-800 leading-relaxed">
              Além disso, ele <strong>monta sozinho</strong> a sequência de perguntas e te dá o{' '}
              <strong>link personalizado</strong>.
              As pessoas entram, respondem e <strong>recebem o diagnóstico na hora</strong> (automático, com base nas
              respostas). Você não precisa escrever análise na mão para cada uma.
            </p>
            <p className="text-sm sm:text-[15px] text-gray-800 leading-relaxed">
              Você só <strong>revisa</strong>, <strong>publica</strong> o link e manda para bio, Direct ou stories.
              Quem passa pelo fluxo é guiada até o fim. Depois que ela recebe o <strong>diagnóstico automático</strong>,
              aparece um <strong>convite para te chamar</strong> e um <strong>botão de WhatsApp</strong>: ao clicar, a
              conversa já abre <strong>direto com você</strong> (no seu WhatsApp).
            </p>
            <ListaMarcadores
              items={[
                'Estratégia no chat: você explica o que busca, o Noel te guia.',
                'Perguntas e diagnóstico para quem responde: automáticos depois que vocês alinham o fluxo.',
                'Link seu: é por ele que a pessoa responde e vê o resultado.',
              ]}
            />
            <p className="text-sm text-gray-600 pt-1">
              Quanto mais gente usar seu link e te chamar no Direct, mais o Instagram costuma enxergar conversa de verdade
              com seu perfil (isso ajuda alcance com o tempo, sem promessa de viralizar).
            </p>
          </div>

          <GuiaNavegacaoRapida />
        </header>

        <div className="space-y-3">
          <BlocoComoUsar
            id="por-que-funciona"
            variant="blue"
            titulo="Por que isso funciona"
            resumo="Você para de falar com todo mundo igual — no Instagram isso faz diferença imediata."
            defaultOpen
          >
            <div className="pt-4 space-y-4">
              <p>
                Existem, em geral, <strong>dois tipos de pessoas</strong> chegando até você. O erro é tratar as duas
                com o mesmo discurso.
              </p>

              <div className="rounded-lg border border-sky-200/80 bg-white/90 p-3 sm:p-4 space-y-2">
                <p className="font-semibold text-sky-950">Quem já está mais perto de fechar (uma minoria)</p>
                <p className="text-gray-700">
                  Está comparando profissionais, avaliando opções, pensando em dar o próximo passo. Aqui,{' '}
                  <strong>explicar demais</strong> costuma atrapalhar: você vira mais uma aula, menos uma decisão.
                </p>
                <p className="text-gray-700">
                  <strong>Com o YLADA:</strong> em vez de um textão, você envia um fluxo com diagnóstico. A pessoa
                  responde sobre ela, recebe uma análise automática e te chama no WhatsApp com mais contexto.
                </p>
                <Destaque tone="blue">
                  Ela tende a chegar vendo você com mais autoridade — e mais pronta para conversar negócio.
                </Destaque>
              </div>

              <div className="rounded-lg border border-amber-200/80 bg-amber-50/50 p-3 sm:p-4 space-y-2">
                <p className="font-semibold text-amber-950">Quem ainda está só consumindo conteúdo (a maioria)</p>
                <p className="text-gray-700">
                  Está no Instagram sem pressa de comprar, às vezes sem nem nomear bem o próprio incômodo. O erro comum
                  é <strong>empurrar venda</strong> antes de <strong>despertar curiosidade</strong>.
                </p>
                <p className="text-gray-700">
                  <strong>Com o YLADA:</strong> você faz posts que geram curiosidade e oferece um diagnóstico gratuito
                  via link — por exemplo: “Quer entender melhor como sua pele está hoje?” ou “Quer ver se sua rotina
                  está te ajudando no dia a dia?” (adapte à sua área e às regras do seu conselho profissional).
                </p>
                <p className="text-gray-700">Quando a pessoa responde, ela começa a se enxergar no tema, sente valor e confia mais em você.</p>
                <Destaque tone="amber">
                  Você cresce em autoridade e abre espaço para novas conversas sem depender só de post genérico.
                </Destaque>
              </div>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="instagram-algoritmo"
            variant="white"
            titulo="Direct, algoritmo e audiência"
            resumo="Por que responder no Direct e puxar pro link ajuda não só na venda, mas também no crescimento do perfil."
          >
            <div className="pt-4 space-y-3">
              <p className="text-gray-800">
                O Instagram usa sinais de interação (mensagens, respostas a stories, comentários, salvamentos, etc.)
                para entender se o conteúdo e o perfil geram conversa de verdade. Quando o seu post ou story leva a
                pessoa a <strong>te chamar no Direct</strong> (“me manda o link”, “quero o diagnóstico”), você acumula
                esse tipo de sinal — e o algoritmo <strong>tende a</strong> distribuir mais o que gera esse tipo de
                retorno.
              </p>
              <p className="text-gray-800">
                Por isso combina bem com o YLADA: você não fica só “postando dica”; você cria um motivo para a pessoa
                a <strong>agir</strong> (curiosidade + diagnóstico gratuito) e <strong>falar com você</strong> antes do
                WhatsApp. Isso reforça a ideia de que o seu perfil é lugar de descoberta — e ajuda a sustentar
                audiência e autoridade no médio prazo.
              </p>
              <Destaque tone="green">
                Resumindo: mais DMs qualificados por causa do fluxo → mais sinais de engajamento → mais chance de o
                Instagram continuar mostrando você para gente parecida com quem já interagiu. É um ciclo que você
                fortalece a cada boa chamada no Direct e cada link bem usado.
              </Destaque>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="como-postar"
            variant="white"
            titulo="Como postar do jeito certo"
            resumo="Post que não fecha, post técnico demais e post que puxa resposta — com exemplos."
          >
            <div className="pt-4 space-y-5">
              <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-3">
                <p className="font-semibold text-gray-500 text-xs uppercase tracking-wide mb-1">Post que costuma fracassar</p>
                <p className="text-gray-800 italic">“Beber água faz bem.”</p>
                <p className="text-sm text-gray-600 mt-2">Não gera ação nem conversa com você.</p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/40 p-3">
                <p className="font-semibold text-amber-900 text-xs uppercase tracking-wide mb-1">Post muito técnico</p>
                <p className="text-gray-800 italic">“Você deve tomar tantos ml por kg…”</p>
                <p className="text-sm text-gray-600 mt-2">Educa, mas não puxa “me chama” nem link.</p>
              </div>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                <p className="font-semibold text-emerald-900 text-xs uppercase tracking-wide mb-1">Post que puxa cliente</p>
                <p className="text-gray-900 font-medium leading-snug">
                  “Muita gente sente o corpo ‘pesado’ no dia a dia e não sabe por onde começar. Quer um jeito rápido
                  de ver o que faz sentido no seu caso?”
                </p>
                <p className="text-sm text-gray-700 mt-3 font-medium">Finalize com um dos ganchos:</p>
                <ListaMarcadores
                  items={[
                    '“Me chama que eu te envio um diagnóstico gratuito.”',
                    '“Clica no link da bio e descobre agora.”',
                  ]}
                />
              </div>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="depois"
            variant="blue"
            titulo="O que acontece depois"
            resumo="Do clique ao WhatsApp — o fluxo que a sua lead percorre."
          >
            <ol className="pt-4 list-decimal pl-5 space-y-2 text-gray-800">
              <li>A pessoa responde o diagnóstico / fluxo.</li>
              <li>Ela recebe uma análise automática com base nas respostas.</li>
              <li>Ela pode clicar no botão do WhatsApp (quando você configurar).</li>
              <li>Ela te chama mais informada do que um “oi, quanto custa?” seco.</li>
            </ol>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="diferencial"
            variant="white"
            titulo="O grande diferencial do YLADA"
            resumo="Menos tempo em explicação manual; mais conversas com contexto."
          >
            <div className="pt-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-gray-200 p-3 bg-gray-50/50">
                  <p className="font-semibold text-gray-900 mb-2">Sem um fluxo assim</p>
                  <ListaMarcadores
                    items={[
                      'Pensar conteúdo do zero o tempo todo',
                      'Responder tudo manualmente',
                      'Perder tempo com curiosos sem critério',
                    ]}
                  />
                </div>
                <div className="rounded-lg border border-sky-200 p-3 bg-sky-50/40">
                  <p className="font-semibold text-sky-950 mb-2">Com o YLADA</p>
                  <ListaMarcadores
                    items={[
                      'O Noel te ajuda a montar perguntas e diagnóstico',
                      'O fluxo qualifica e informa antes do seu “oi”',
                      'Você foca energia em quem já deu o primeiro sim',
                    ]}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Isso não elimina seu trabalho — você continua sendo a profissional. Mas reduz atrito na captação e
                deixa claro para a lead <strong>por que</strong> falar com você.
              </p>
            </div>
          </BlocoComoUsar>

          <BlocoComoUsar
            id="regra-ouro"
            variant="yellow"
            titulo="Regra de ouro"
            resumo="Pare de só explicar; faça a pessoa descobrir — com seu link."
          >
            <div className="pt-4 space-y-3">
              <p className="text-gray-800 font-medium leading-relaxed">
                Quem só explica atrai mais curioso passando. Quem usa um diagnóstico bem montado atrai gente que já
                investiu atenção nela mesma — e chega mais pronta para ouvir você.
              </p>
              <Destaque tone="green">
                Menos aula solta no Direct. Mais convite para descobrir + conversa com contexto.
              </Destaque>
            </div>
          </BlocoComoUsar>
        </div>

        <footer className="rounded-xl border border-gray-200 bg-white p-5 text-center space-y-3">
          <p className="text-gray-900 font-semibold text-base leading-relaxed">
            Pronto para montar seu primeiro fluxo?
          </p>
          <Link
            href={diagnosticoHref}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 transition-colors"
          >
            Criar meu primeiro diagnóstico
          </Link>
        </footer>
      </div>
    </YladaAreaShell>
  )
}
