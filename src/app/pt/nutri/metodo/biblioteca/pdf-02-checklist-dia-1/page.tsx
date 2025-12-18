'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF02ChecklistDia1() {
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
          <span className="text-gray-700 font-medium">Checklist Oficial do Dia 1</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Checklist Oficial — Dia 1 da Jornada YLADA
            </h1>
            <p className="text-xl text-gray-600">
              Comece do jeito certo
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Qual é o verdadeiro objetivo do Dia 1?</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Dia 1 não é sobre fazer tudo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>É sobre criar direção.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>É o ponto de partida da sua transformação profissional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Quem começa bem, avança com mais clareza e menos ansiedade.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 O Dia 1 define o ritmo da sua jornada.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quanto tempo você precisa reservar</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Tempo médio: 20 a 40 minutos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Escolha um momento sem interrupções.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Evite fazer correndo ou "pela metade".</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Este tempo é um investimento no seu crescimento.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Presença vale mais do que velocidade.</p>
          </div>

          {/* Slide 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Checklist de execução — Dia 1</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Acesse o Dia 1 da Jornada.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Leia com atenção todas as orientações.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Responda com sinceridade às perguntas propostas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Conclua todas as etapas do dia.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Não pule nenhuma parte.</p>
          </div>

          {/* Slide 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que precisa estar completo ao final do Dia 1</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>O conteúdo do Dia 1 foi totalmente finalizado.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Seu progresso foi registrado na Jornada.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>O próximo dia foi liberado.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⬜</span>
                <span>Você entendeu qual é o seu foco inicial.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Clareza é o primeiro resultado.</p>
          </div>

          {/* Slide 6 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que evitar no Dia 1</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não pular para dias futuros.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não tentar consumir todo o conteúdo da plataforma.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não buscar perfeição.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não se comparar com outras profissionais.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Comparação gera ansiedade. Execução gera avanço.</p>
          </div>

          {/* Slide 7 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erros comuns que atrapalham o início</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Fazer o Dia 1 com pressa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Interromper várias vezes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Abrir muitas abas ao mesmo tempo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não concluir o dia por completo.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Começar bem evita retrabalho depois.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como saber se o Dia 1 foi bem executado</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O sistema mostra o Dia 1 como concluído.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O Dia 2 está liberado.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Você sente mais clareza do que precisa fazer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A LYA já começa a ajustar as orientações para você.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Direção clara é sinal de conclusão correta.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que muda após concluir o Dia 1</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Você deixa o modo "confusão" e entra no modo "construção".</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>O sistema começa a se adaptar ao seu perfil.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Novas áreas ficam disponíveis conforme o progresso.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A jornada segue com mais objetividade.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Um passo bem feito muda todo o caminho.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Este checklist está disponível para consulta sempre que precisar.<br/>
              Use como referência para garantir que está no caminho certo.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 A LYA te acompanha em cada dia da sua jornada.
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
