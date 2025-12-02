'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function JornadaConcluidaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border-2 border-yellow-300 text-center">
          {/* Medalha */}
          <div className="text-8xl mb-6">🏆</div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jornada YLADA Concluída!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Parabéns! Você completou os 30 dias do Método YLADA.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-l-4 border-blue-500">
            <p className="text-lg text-gray-800 mb-4">
              <strong>Sua transformação está completa.</strong>
            </p>
            <p className="text-gray-700">
              Você agora tem os fundamentos, ferramentas e práticas para viver como uma verdadeira Nutri-Empresária.
            </p>
          </div>

          {/* Conquistas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-3xl mb-2">📚</div>
              <div className="font-bold text-gray-900">30 Dias</div>
              <div className="text-sm text-gray-600">de Aprendizado</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-3xl mb-2">✓</div>
              <div className="font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Concluído</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-bold text-gray-900">Pronto</div>
              <div className="text-sm text-gray-600">Para Aplicar</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <Link
              href="/pt/nutri/metodo/jornada"
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              Revisar Minha Jornada
            </Link>
            
            <Link
              href="/pt/nutri/metodo"
              className="block w-full bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Explorar Pilares e Exercícios
            </Link>
          </div>

          <p className="text-sm text-gray-500 mt-8">
            Continue aplicando o Método YLADA no seu dia a dia. A transformação é contínua!
          </p>
        </div>
      </div>
    </div>
  )
}

