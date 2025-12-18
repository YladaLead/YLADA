'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF03ChecklistDia7() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600 transition-all">
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <Link href="/pt/nutri/metodo/biblioteca" className="hover:text-blue-600 transition-all">
            Materiais de Apoio
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Checklist de Consolidação — Primeira Semana</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Checklist de Consolidação — Primeira Semana
            </h1>
            <p className="text-xl text-gray-600">
              O que você construiu até aqui
            </p>
            <p className="text-sm text-gray-500 mt-2">
              YLADA Nutri • Jornada de Transformação Profissional
            </p>
          </div>

          {/* Botão Download */}
          <div className="flex justify-center">
            <button
              disabled
              className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed flex items-center gap-2"
            >
              <span>📄</span>
              <span>PDF em preparação</span>
            </button>
          </div>
        </div>

        {/* Conteúdo dos Slides */}
        <div className="space-y-6">
          
          {/* Slide 2 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que a primeira semana importa</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A primeira semana define a sua base de crescimento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Aqui você sai do modo tentativa e entra no modo construção.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Pequenos ajustes agora evitam grandes problemas depois.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Este checklist é para confirmar direção, não para se cobrar.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Consolidação vem antes de aceleração.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que você já construiu até o Dia 7</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Clareza maior sobre seu momento profissional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Direção mais definida para sua atuação.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Primeiras ações executadas com intenção.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Menos confusão sobre o que priorizar.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Progresso não é sensação. É estrutura.</p>
          </div>

          {/* Slide 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Checklist de consolidação — Semana 1</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Executei os Dias 1 a 7 sem pular etapas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Entendi qual é o meu foco principal neste momento.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Diminuí a ansiedade por fazer tudo ao mesmo tempo.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Passei a seguir a Jornada como guia principal.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Continuidade gera confiança.</p>
          </div>

          {/* Slide 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ajustes importantes nesta fase</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Ajustei expectativas irreais.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Simplifiquei minha rotina profissional.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Parei de buscar estratégias avançadas cedo demais.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Comecei a respeitar meu ritmo real.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Simplicidade é estratégia.</p>
          </div>

          {/* Slide 6 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Sinais claros de avanço</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Menos confusão mental.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mais clareza de prioridades.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Execução mais objetiva.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Sensação de direção, não de pressão.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Clareza é um dos primeiros resultados reais.</p>
          </div>

          {/* Slide 7 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erros comuns após a primeira semana</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Achar que ainda não é suficiente.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Querer mudar tudo de novo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Comparar seu início com o meio de alguém.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Abandonar a estrutura cedo demais.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 O erro não é avançar devagar. É desistir cedo.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Se algo não saiu como esperado</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Revise os dias já concluídos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use a LYA para tirar dúvidas pontuais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ajuste sua rotina mínima, se necessário.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Continue seguindo a Jornada.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Ajustar não é voltar atrás. É amadurecer.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que muda após a primeira semana</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mais segurança nas decisões.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Menos dispersão.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Capacidade maior de sustentar ações.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Base pronta para os próximos passos.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Base sólida permite crescimento sustentável.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Este checklist está disponível para você revisar sua primeira semana.<br/>
              Use sempre que quiser confirmar seu progresso e celebrar suas conquistas.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 Cada semana concluída é uma vitória importante.
            </p>
          </div>

        </div>

        {/* Navegação */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/pt/nutri/metodo/biblioteca"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm border border-gray-200"
          >
            ← Voltar para Materiais de Apoio
          </Link>
        </div>
      </div>
    </div>
  )
}
