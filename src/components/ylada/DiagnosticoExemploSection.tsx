'use client'

import Link from 'next/link'
import {
  DIAGNOSTICO_EXEMPLOS,
  type DiagnosticoExemploArea,
} from '@/config/ylada-diagnostico-exemplos'

interface DiagnosticoExemploSectionProps {
  area: DiagnosticoExemploArea
  ctaHref?: string
  /** Para nutri: usa /pt/nutri/oferta em vez de /pt/precos */
  ctaLabel?: string
}

/**
 * Seção "Veja como uma avaliação pode gerar uma consulta".
 * Mostra diagnóstico exemplo + mensagem do paciente + área para vídeo.
 * Logo abaixo: cards com exemplos de avaliações por categoria.
 */
export function DiagnosticoExemploSection({
  area,
  ctaHref = '/pt/precos',
  ctaLabel = 'Começar agora',
}: DiagnosticoExemploSectionProps) {
  const config = DIAGNOSTICO_EXEMPLOS[area]

  const tituloPrincipal =
    area === 'seller'
      ? 'Veja como uma avaliação pode gerar uma conversa'
      : 'Veja como uma avaliação pode gerar uma consulta'

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Título e subtítulo */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center">
            {tituloPrincipal}
          </h2>
          <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">
            Uma avaliação simples pode transformar curiosidade em interesse real.
          </p>

          {/* Layout: Avaliação + Mensagem | Vídeo */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Coluna esquerda: Diagnóstico (espelhando o resultado real) + Mensagem do paciente */}
            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Avaliação respondida</p>
                <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 max-w-sm overflow-hidden">
                  <p className="text-xs text-gray-400 mb-3 font-mono">
                    &quot;{config.avaliacao}&quot;
                  </p>
                  {/* Bloco do resultado — alinhado à página de resultado real */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50/30 p-4 border border-blue-100 border-l-4 border-l-blue-600">
                    <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
                      Seu perfil
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                      {config.perfil}
                    </h3>
                    <p className="text-sm text-gray-700 leading-snug mb-4">
                      {config.explicacao}
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Possíveis sinais:</p>
                    <ul className="text-sm text-gray-700 space-y-1.5">
                      {config.sinais.map((sinal) => (
                        <li key={sinal} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>{sinal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 italic">{config.sugestao}</p>
                  <p className="text-sm text-gray-700 font-medium mt-2">
                    {config.fraseAgendamento}
                  </p>
                </div>
              </div>

              {/* Mensagem que o paciente envia — estilo WhatsApp */}
              <div className="relative max-w-sm ml-4">
                <div className="bg-[#dcf8c6] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-green-200/80">
                  <p className="text-sm text-gray-800 leading-snug">&quot;{config.mensagem}&quot;</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Mensagem que o {config.labelPaciente} envia depois
                </p>
              </div>
            </div>

            {/* Coluna direita: Vídeo */}
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600">Vídeo do fluxo completo</p>
              <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center p-6">
                  <p className="text-gray-500 text-sm mb-2">Área para vídeo</p>
                  <p className="text-gray-400 text-xs max-w-[220px] mx-auto">
                    Vídeo curto (30–40s): criar avaliação → enviar link → {config.labelPaciente}{' '}
                    responde → diagnóstico aparece → conversa começa
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Exemplos de avaliações por categoria — 3 cards */}
          <div className="mt-12">
            <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
              {config.tituloSecaoCards}
            </h3>
            <p className="text-gray-600 text-center text-sm mb-6">{config.tituloSecaoCardsDesc}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {config.cards.map((card) => (
                <div
                  key={card}
                  className="bg-white rounded-xl p-4 border-2 border-gray-200 text-center font-medium text-gray-900 hover:border-blue-300 transition-colors"
                >
                  {card}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-center text-sm mt-4">
              O sistema já vem com avaliações prontas para usar.
            </p>
          </div>

          {/* Parágrafos de reforço */}
          <p className="text-gray-700 text-center mt-10 max-w-2xl mx-auto">
            Quando o {config.labelPaciente} responde uma avaliação, ele começa a refletir sobre sua
            própria situação. Isso desperta interesse e facilita o agendamento.
          </p>
          <p className="text-gray-800 font-medium text-center mt-4">
            O objetivo não é convencer curiosos.
            <br />
            É atrair {config.labelPaciente}s que já entendem o valor.
          </p>
          <p className="text-gray-600 text-sm text-center mt-2">
            Os diagnósticos podem ser enviados de forma visual para iniciar conversas pelo WhatsApp.
          </p>

          {/* CTA */}
          <div className="text-center mt-8">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
            >
              {ctaLabel}
            </Link>
            <p className="text-gray-500 text-sm mt-2">Acesso liberado após o pagamento</p>
          </div>
        </div>
      </div>
    </section>
  )
}
