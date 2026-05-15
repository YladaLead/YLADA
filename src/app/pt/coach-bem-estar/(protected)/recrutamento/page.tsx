import Link from 'next/link'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'

export default function CoachBemEstarRecrutamentoPage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Opcional</p>
        <h1 className="mt-1 text-xl font-semibold text-gray-800">Equipe e recrutamento</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Ferramentas para quem também constrói equipe: os mesmos diagnósticos e links da base operacional, aqui dentro
          do Coach de bem-estar. Use <strong>Links</strong> no menu para a biblioteca YLADA; abaixo, vendas e
          recrutamento (vá até <strong>Links</strong> no menu e, na mesma página, a secção de quizzes e fluxos).
        </p>

        <ul className="mt-8 space-y-3">
          <li>
            <Link
              href="/pt/coach-bem-estar/links?tipo=recrutamento#ferramentas"
              className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <span className="text-sm font-medium text-gray-900">Diagnósticos e links de recrutamento</span>
              <span className="mt-1 block text-xs text-gray-500">
                Quizzes, fluxos rápidos e HOM — mesmo conteúdo que na jornada operacional, sem sair desta área.
              </span>
              <span className="mt-2 inline-block text-xs font-medium text-blue-700">Abrir →</span>
            </Link>
          </li>
          <li>
            <Link
              href="/pt/wellness/fluxos?categoria=Recrutamento"
              className="block rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow"
            >
              <span className="text-sm font-medium text-gray-900">Fluxos guiados de recrutamento</span>
              <span className="mt-1 block text-xs text-gray-500">
                Recrutamento completo, apresentação gravada, onboarding do novo membro.
              </span>
              <span className="mt-2 inline-block text-xs font-medium text-blue-700">Abrir →</span>
            </Link>
          </li>
          <li>
            <Link
              href="/pt/wellness/fluxos"
              className="block rounded-lg border border-transparent px-1 py-2 text-xs text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
            >
              Ver todos os fluxos e ações
            </Link>
          </li>
        </ul>
      </div>
    </YladaAreaShell>
  )
}
