'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function PDF05ScriptsEssenciais() {
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
          <span className="text-gray-700 font-medium">Scripts Essenciais YLADA</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Scripts Essenciais YLADA — Nutri
            </h1>
            <p className="text-xl text-gray-600">
              Fale com clareza, sem pressão
            </p>
            <p className="text-sm text-gray-500 mt-2">
              YLADA Nutri • Comunicação Profissional
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Como usar scripts do jeito certo</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Scripts são pontos de partida, não textos engessados.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Adapte para o seu jeito de falar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use como apoio para ganhar segurança.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Naturalidade vem com repetição.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Script bom é o que você consegue usar.</p>
          </div>

          {/* Slide 3 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quando estes scripts fazem sentido</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ao iniciar conversas profissionais.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ao responder interesse.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ao retomar contato.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ao conduzir para avaliação.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Comunicação clara evita ruído e ansiedade.</p>
          </div>

          {/* Slide 4 - Script 1 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm border border-green-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Script 1 — Convite leve</h2>
            <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
              <p className="text-gray-800 leading-relaxed">
                "Oi, tudo bem? 😊<br/><br/>
                Estou organizando um novo formato de acompanhamento nutricional e estou convidando algumas pessoas para conhecer.<br/><br/>
                Se fizer sentido para você, te explico rapidinho."
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-green-900">Observação:</p>
              <ul className="text-sm text-green-800 mt-2 space-y-1">
                <li>• Sem pressão</li>
                <li>• Sem promessa</li>
                <li>• Sem venda direta</li>
              </ul>
            </div>
            <p className="text-green-700 font-semibold mt-4">👉 Convite abre conversa, não fecha venda.</p>
          </div>

          {/* Slide 5 - Script 2 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Script 2 — Quando a pessoa demonstra interesse</h2>
            <div className="bg-white rounded-lg p-4 mb-4 border border-blue-200">
              <p className="text-gray-800 leading-relaxed">
                "Que bom 😊<br/><br/>
                Funciona assim: primeiro eu entendo sua rotina e seu objetivo, depois vejo se faz sentido te ajudar.<br/><br/>
                Posso te explicar como funciona a avaliação?"
              </p>
            </div>
            <p className="text-blue-700 font-semibold mt-4">👉 Interesse pede clareza, não excesso.</p>
          </div>

          {/* Slide 6 - Script 3 */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl shadow-sm border border-purple-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Script 3 — Follow-up sem pressão</h2>
            <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
              <p className="text-gray-800 leading-relaxed">
                "Oi! Passando só para saber se você conseguiu ver minha mensagem anterior 😊<br/><br/>
                Se não for o momento, está tudo bem."
              </p>
            </div>
            <div className="bg-purple-100 rounded-lg p-3 mb-3">
              <p className="text-sm font-medium text-purple-900">Observação:</p>
              <ul className="text-sm text-purple-800 mt-2 space-y-1">
                <li>• Follow-up respeitoso</li>
                <li>• Sem insistência</li>
              </ul>
            </div>
            <p className="text-purple-700 font-semibold mt-4">👉 Respeito constrói reputação.</p>
          </div>

          {/* Slide 7 - Script 4 */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-sm border border-orange-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Script 4 — Encaminhar para avaliação</h2>
            <div className="bg-white rounded-lg p-4 mb-4 border border-orange-200">
              <p className="text-gray-800 leading-relaxed">
                "Para te orientar com mais clareza, eu faço uma avaliação inicial.<br/><br/>
                Assim consigo entender seu momento e te dizer se e como posso te ajudar.<br/><br/>
                Posso te enviar o link?"
              </p>
            </div>
            <p className="text-orange-700 font-semibold mt-4">👉 Avaliação filtra e protege seu tempo.</p>
          </div>

          {/* Slide 8 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">O que evitar ao usar scripts</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Copiar e colar sem adaptar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Usar linguagem que não é sua.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Forçar conversa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Prometer resultado.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Simplicidade gera confiança.</p>
          </div>

          {/* Slide 9 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Menos é mais</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use 1 ou 2 scripts no início.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Repita até se sentir segura.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Ajuste conforme sua experiência.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Não tente usar todos de uma vez.</span>
              </li>
            </ul>
            <p className="text-blue-700 font-semibold mt-4">👉 Repetição gera fluidez.</p>
          </div>

          {/* Conclusão */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500 p-8">
            <p className="text-gray-700 text-center text-lg leading-relaxed">
              Estes scripts estão sempre disponíveis para você consultar.<br/>
              Use e adapte conforme sua necessidade, sem pressão.
            </p>
            <p className="text-blue-700 font-semibold text-center mt-4">
              💙 Comunicação natural se constrói com prática e confiança.
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
