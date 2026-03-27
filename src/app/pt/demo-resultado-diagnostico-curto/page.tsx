'use client'

/**
 * Simulação visual: resultado de diagnóstico em versão curta + CTA WhatsApp + disclaimer.
 * Não altera fluxos reais. Acesse: /pt/demo-resultado-diagnostico-curto
 * Número de WhatsApp abaixo é apenas exemplo para teste de clique.
 */
import Link from 'next/link'
import DiagnosisDisclaimer from '@/components/ylada/DiagnosisDisclaimer'
import PoweredByYlada from '@/components/ylada/PoweredByYlada'

const WHATSAPP_EXEMPLO_E164 = '5519981868000'
/** Exemplo do que o visitante envia após o fluxo real: abertura + bloco “Resumo pro profissional” (vem da API). */
const MENSAGEM_PREFILL = `Oi, fiz a análise de hábitos alimentares e o resultado apontou possível bloqueio na organização das refeições. Gostaria de conversar sobre o próximo passo.

Resumo pro profissional:
• dificuldade principal: Tenho dificuldade em manter constância na dieta
• já tentei: Já segui planos prontos da internet
• causa provável: Falta de tempo para planejar
• objetivo: Quero emagrecer com saúde
• achado do diagnóstico: Indício de bloqueio na organização dos hábitos alimentares — com impacto na constância e na sensação de progresso.`

export default function DemoResultadoDiagnosticoCurtoPage() {
  const waUrl = `https://wa.me/${WHATSAPP_EXEMPLO_E164}?text=${encodeURIComponent(MENSAGEM_PREFILL)}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50/40 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
        <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-5 text-center">
          Simulação — não é um diagnóstico real
        </p>

        <span className="inline-block rounded-full bg-sky-100 text-sky-800 text-xs font-semibold px-3 py-1 mb-3">
          Seu resultado inicial
        </span>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Seu resultado</h1>

        <p className="text-sm text-gray-600 leading-relaxed mb-5">
          Pelas suas respostas, parece que organização da alimentação, planejamento e motivação aparecem
          como pontos centrais — um bom ponto de partida para conversar com o profissional.
        </p>

        <div className="rounded-xl border-l-4 border-sky-500 bg-sky-50/90 px-4 py-3 mb-5">
          <p className="text-[11px] font-semibold text-sky-700 uppercase tracking-wide mb-1.5">
            Diagnóstico
          </p>
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            Indício de bloqueio na organização dos hábitos alimentares — com impacto na constância e na
            sensação de progresso.
          </p>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          A leitura detalhada (causas prováveis, preocupações, consequências, dica rápida e próximos
          passos) fica mais clara em uma conversa —{' '}
          <span className="font-medium text-gray-900">no WhatsApp o profissional te envia o pacote completo</span>{' '}
          alinhado ao seu caso.
        </p>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors text-center"
        >
          Conversar no WhatsApp
        </a>

        <p className="text-center text-xs text-gray-400 mt-2">
          Exemplo: número {WHATSAPP_EXEMPLO_E164.replace(/^55/, '+55 ')}
        </p>

        <DiagnosisDisclaimer variant="informative" className="mt-6 pt-5 border-t border-gray-100" />
        <PoweredByYlada variant="compact" />

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link href="/pt/demo-visao-cliente" className="text-sm text-sky-600 hover:text-sky-800 block mb-2">
            Ver demo da visão do cliente (layout anterior)
          </Link>
          <Link href="/pt" className="text-sm text-gray-500 hover:text-gray-700">
            ← Voltar para a página inicial do YLADA
          </Link>
        </div>
      </div>
    </div>
  )
}
