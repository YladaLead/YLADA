'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import MetodoYLADAIntro from '@/components/formacao/MetodoYLADAIntro'
import VideoPlayerYLADA from '@/components/formacao/VideoPlayerYLADA'

// Pilares do Método YLADA
const pilares = [
  {
    id: '1',
    nome: 'Filosofia YLADA',
    descricao: 'Os fundamentos que nunca foram ensinados na faculdade',
    cor: 'from-blue-600 to-indigo-600'
  },
  {
    id: '2',
    nome: 'Nutri-Empresária 2.0',
    descricao: 'Transforme sua mentalidade e rotina em negócio',
    cor: 'from-purple-600 to-pink-600'
  },
  {
    id: '3',
    nome: 'Captação com Ferramentas YLADA',
    descricao: 'Gere leads diários de forma consistente e escalável',
    cor: 'from-green-600 to-teal-600'
  },
  {
    id: '4',
    nome: 'Atendimento que Encanta',
    descricao: 'Transforme cada atendimento em experiência memorável',
    cor: 'from-orange-600 to-red-600'
  },
  {
    id: '5',
    nome: 'GSAL & Crescimento',
    descricao: 'Gestão Simplificada e crescimento sustentável',
    cor: 'from-indigo-600 to-purple-600'
  }
]

export default function MetodoYLADAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vídeo 2 — Método YLADA */}
        <div className="mb-8">
          <VideoPlayerYLADA
            videoUrl={process.env.NEXT_PUBLIC_VIDEO_METODO_YLADA}
            title="Método YLADA — Introdução"
            description="Conheça o método que transforma nutricionistas em Nutri-Empresárias de sucesso."
            className="mb-6"
          />
        </div>

        {/* Introdução Oficial */}
        <MetodoYLADAIntro />

        {/* Seção dos 5 Pilares */}
        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Os 5 Pilares do Método
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Cada pilar é uma seção fundamental do método. Explore-os por conta própria ou siga a Trilha Empresarial, que organiza tudo passo a passo.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pilares.map((pilar, index) => (
              <Link
                key={pilar.id}
                href={`/pt/nutri/metodo/pilares/${pilar.id}`}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${pilar.cor} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Pilar {pilar.id} — {pilar.nome}
                </h3>
                <p className="text-gray-600 text-sm">
                  {pilar.descricao}
                </p>
                <div className="mt-4 text-blue-600 font-medium text-sm">
                  Ver Pilar →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Principal para Jornada */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para sua transformação?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Inicie sua Trilha Empresarial e transforme sua prática em negócio de sucesso, passo a passo por etapas.
            </p>
            <Link
              href="/pt/nutri/metodo/jornada"
              className="inline-block bg-white text-blue-600 text-xl font-bold px-10 py-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              🚀 Iniciar Trilha Empresarial
            </Link>
            <p className="text-sm text-blue-200 mt-4">
              Sua transformação começa agora
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

