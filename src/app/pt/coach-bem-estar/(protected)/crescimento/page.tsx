import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import Link from 'next/link'

/**
 * Board de diagnóstico e crescimento — Coach de Bem-estar.
 * Ponto de entrada para o Noel entender o perfil e comportamento do usuário.
 */
export default function CoachBemEstarCrescimentoPage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          Diagnóstico do negócio
        </p>
        <h1 className="mt-1 text-xl font-semibold text-gray-800">
          Motor de crescimento
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Entenda onde está o gargalo do seu negócio, quais ações têm maior impacto
          e o que priorizar nesta semana. O Noel analisa seu perfil e te guia
          com base no que está funcionando para coaches de bem-estar.
        </p>

        <ul className="mt-8 space-y-3">
          <li>
            <Link
              href="/pt/coach-bem-estar/home"
              className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-green-300 hover:shadow"
            >
              <span className="text-sm font-medium text-gray-900">
                💬 Conversar com o Noel
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Diagnóstico socrático — o Noel faz as perguntas certas para
                revelar o próximo passo com clareza.
              </span>
              <span className="mt-2 inline-block text-xs font-medium text-green-700">
                Iniciar →
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/pt/coach-bem-estar/links"
              className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-green-300 hover:shadow"
            >
              <span className="text-sm font-medium text-gray-900">
                🔗 Ferramentas de conversão
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Links inteligentes, diagnósticos e quizzes para ativar novos
                clientes e qualificar leads no WhatsApp.
              </span>
              <span className="mt-2 inline-block text-xs font-medium text-green-700">
                Ver biblioteca →
              </span>
            </Link>
          </li>

          <li>
            <Link
              href="/pt/coach-bem-estar/recrutamento"
              className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-green-300 hover:shadow"
            >
              <span className="text-sm font-medium text-gray-900">
                👥 Recrutamento e equipe
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Ferramentas para quem também constrói equipe de coaches.
              </span>
              <span className="mt-2 inline-block text-xs font-medium text-green-700">
                Acessar →
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </YladaAreaShell>
  )
}
