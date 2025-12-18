'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF04RotinaMinima() {
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
          <span className="text-gray-700 font-medium">Rotina Mínima da Nutri-Empresária</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Rotina Mínima da Nutri-Empresária YLADA
            </h1>
            <p className="text-xl text-gray-600">
              Menos confusão. Mais constância.
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">A regra que sustenta o crescimento</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Rotina mínima é o mínimo viável bem feito.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não é sobre fazer muito, é sobre fazer sempre.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Intensidade sem constância gera abandono.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Constância simples gera resultado.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Consistência vence motivação.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que a rotina mínima funciona</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Reduz sobrecarga mental.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Evita improviso diário.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Cria previsibilidade na agenda.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Libera energia para decisões melhores.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Quem não decide antes, decide no caos.</p>
          </div>

          {/* Slide 4 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estrutura da rotina mínima</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Captação:</strong> gerar movimento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Atendimento:</strong> servir com qualidade.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Acompanhamento:</strong> manter vínculo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Gestão:</strong> registrar e organizar.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Toda semana precisa ter esses quatro blocos.</p>
          </div>

          {/* Slide 5 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Captação — o mínimo que não pode faltar</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Pequenas ações todos os dias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Conversas reais, não perfeição.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Uso de scripts simples.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Foco em constância, não volume.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 mt-1 font-medium">→</span>
                <span className="font-medium">Exemplo prático: 15 a 20 minutos por dia.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Sem movimento, não existe crescimento.</p>
          </div>

          {/* Slide 6 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Atendimento sem virar refém da agenda</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Defina horários claros de atendimento.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Evite encaixes constantes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Proteja seus horários de foco.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Qualidade vem da organização.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Agenda organizada protege sua energia.</p>
          </div>

          {/* Slide 7 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acompanhamento que fideliza</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Reserve um momento específico da semana.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use mensagens simples e humanas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não precisa acompanhar tudo, todos os dias.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A constância vale mais que excesso.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Acompanhamento cria confiança.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestão simples e objetiva</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Registre leads e atendimentos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Atualize dados com regularidade.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use números para decisões, não para pressão.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Gestão é clareza, não burocracia.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 O que não é registrado não pode melhorar.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Exemplo de rotina mínima semanal</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Captação:</strong> todos os dias (15–20 min).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Atendimento:</strong> blocos definidos na agenda.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Acompanhamento:</strong> 1 a 2 vezes por semana.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Gestão:</strong> 1 momento fixo semanal.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Ajuste à sua realidade, mas mantenha a estrutura.</p>
          </div>

          {/* Slide 10 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Erros que sabotam a rotina</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Criar rotinas irreais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Copiar a agenda de outra pessoa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Querer fazer tudo ao mesmo tempo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Abandonar a rotina na primeira semana.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Rotina boa é a que você consegue manter.</p>
          </div>

          {/* Slide 11 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como aplicar a rotina na Jornada YLADA</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use este material como referência.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ajuste conforme a Jornada avança.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>A LYA ajuda a adaptar quando necessário.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não complique o que foi feito para ser simples.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Estrutura antes de expansão.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Este guia está disponível para você construir sua rotina no seu tempo.<br/>
              Volte aqui sempre que precisar ajustar ou relembrar os princípios da rotina mínima.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 Constância simples gera resultados reais.
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
