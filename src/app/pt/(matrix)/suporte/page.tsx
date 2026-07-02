import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

export default function MatrixSuportePage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div className="max-w-lg space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Precisa de ajuda?</h1>
          <p className="text-sm text-gray-600">Escolha o canal certo para o que você precisa.</p>
        </div>

        {/* Dúvidas sobre a plataforma */}
        <div className="rounded-xl border border-sky-100 bg-sky-50/60 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">💬 Dúvidas sobre a plataforma</p>
          <p className="text-sm text-gray-600 mb-3">
            O Noel responde perguntas sobre como criar diagnósticos, usar os links, interpretar resultados e muito mais.
          </p>
          <Link
            href="/pt/home?msg=Preciso+de+ajuda"
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Perguntar ao Noel
          </Link>
        </div>

        {/* Cancelamento e assinatura */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">📋 Cancelamento ou ajuste de assinatura</p>
          <p className="text-sm text-gray-600 mb-3">
            Para cancelar, pausar ou alterar seu plano, entre em contato por e-mail. Respondemos em até 1 dia útil.
          </p>
          <a
            href="mailto:suporte@ylada.com?subject=Cancelamento%20de%20assinatura"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            suporte@ylada.com
          </a>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Você também pode gerenciar sua assinatura em{' '}
          <Link href="/pt/configuracao#assinatura" className="underline hover:text-gray-600">
            Configurações → Assinatura
          </Link>
          .
        </p>
      </div>
    </YladaAreaShell>
  )
}
