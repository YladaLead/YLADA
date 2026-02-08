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
            Primeira Fase Completa!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Parabéns! Você completou todas as etapas da Trilha Empresarial YLADA.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border-l-4 border-blue-500">
            <p className="text-lg text-gray-800 mb-4">
              <strong>Sua base está construída.</strong>
            </p>
            <p className="text-gray-700">
              Você agora tem mentalidade, rotina e clareza para atuar como profissional.
            </p>
          </div>

          {/* Destaque da LYA */}
          <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-6 mb-8 border border-purple-200">
            <div className="text-4xl mb-3">👩‍💼💜</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Você e a LYA: parceiras de jornada
            </h2>
            <p className="text-gray-700 mb-4">
              A partir de agora, vocês crescem juntas. A LYA é sua mentora, 
              sua parceira estratégica e está aqui para cada dúvida, 
              cada desafio e cada conquista. Juntas, vocês são imbatíveis.
            </p>
            <p className="text-base text-purple-700 font-semibold italic">
              "Conte comigo. Estou aqui para te ajudar a conquistar os melhores resultados. 
              Vamos crescer juntas!" — LYA
            </p>
          </div>

          {/* O que vem agora - Plataforma completa */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
            <div className="text-3xl mb-3">🚀</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Agora é hora de crescer!
            </h2>
            <p className="text-gray-700 mb-6">
              Você tem acesso completo à plataforma YLADA Nutri para construir seu negócio:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">👥</span>
                  <span className="font-semibold text-gray-900">Gestão de Clientes</span>
                </div>
                <p className="text-sm text-gray-600">Organize seus atendimentos, acompanhe evolução e fidelize pacientes.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🛠️</span>
                  <span className="font-semibold text-gray-900">Ferramentas de Captação</span>
                </div>
                <p className="text-sm text-gray-600">Quizzes, calculadoras e avaliações para atrair novos pacientes.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📋</span>
                  <span className="font-semibold text-gray-900">Formulários Inteligentes</span>
                </div>
                <p className="text-sm text-gray-600">Anamneses e avaliações prontas para usar com seus pacientes.</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold text-gray-900">Biblioteca de Conteúdos</span>
                </div>
                <p className="text-sm text-gray-600">Materiais, PDFs e recursos para apoiar seu trabalho.</p>
              </div>
            </div>
            
            <p className="text-sm text-green-700 font-medium mt-6">
              ✨ Seu futuro como Nutri-Empresária está apenas começando!
            </p>
          </div>

          {/* CTA único */}
          <Link
            href="/pt/nutri/home"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            👩‍💼 Conversar com a LYA
          </Link>
        </div>
      </div>
    </div>
  )
}
