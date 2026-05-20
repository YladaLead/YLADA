'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Curso {
  id: string
  titulo: string
  descricao: string
  imagem?: string
  nivel: string
  categoria: string
  preco: number
  preco_com_desconto?: number
  duracao_horas: number
  total_aulas: number
  avaliacao_media: number
  total_avaliacoes: number
  checkout_url?: string
}

export default function VendaCursoPage() {
  const [curso, setCurso] = useState<Curso | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento do curso
    setLoading(false)
    setCurso({
      id: '1',
      titulo: 'Nutrição Clínica Básica',
      descricao: 'Aprenda os fundamentos da nutrição clínica de forma prática e objetiva. Curso completo com material didático, vídeos e certificado.',
      nivel: 'iniciante',
      categoria: 'Nutrição',
      preco: 299.90,
      preco_com_desconto: 199.90,
      duracao_horas: 40,
      total_aulas: 25,
      avaliacao_media: 4.7,
      total_avaliacoes: 150,
      checkout_url: 'https://checkout.exemplo.com/curso-1'
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!curso) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Curso não encontrado</h1>
          <Link href="/" className="text-green-600 hover:underline">
            Voltar para home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Image
                src="/images/logo/ylada/novo/ylada-horizontal-claro.png"
                alt="YLADA"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="hidden sm:inline">Acesso 100% online</span>
              <span className="text-green-600 font-medium">✓ Garantia de 7 dias</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Conteúdo Principal */}
          <div>
            {/* Nível e Categoria */}
            <div className="mb-4 flex items-center space-x-3">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {curso.nivel}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                {curso.categoria}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {curso.titulo}
            </h1>

            {/* Avaliação */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-gray-700 font-medium">{curso.avaliacao_media}</span>
              </div>
              <span className="text-gray-600">({curso.total_avaliacoes} avaliações)</span>
            </div>

            {/* Descrição */}
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{curso.descricao}</p>
            </div>

            {/* Conteúdo do Curso */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">O que você vai aprender</h2>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Fundamentos da nutrição clínica
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Avaliação nutricional completa
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Elaboração de planos alimentares
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  Casos clínicos práticos
                </li>
              </ul>
            </div>

            {/* Conteúdo Programático */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Conteúdo Programático</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Módulo 1: Introdução</p>
                    <p className="text-sm text-gray-600">5 aulas • 8 horas</p>
                  </div>
                  <span className="text-sm text-gray-500">Pré-visualizar</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Módulo 2: Fundamentos</p>
                    <p className="text-sm text-gray-600">10 aulas • 15 horas</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Módulo 3: Prática</p>
                    <p className="text-sm text-gray-600">10 aulas • 17 horas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Card de Compra */}
          <div className="lg:sticky lg:top-24 lg:max-h-[600px]">
            <div className="bg-white rounded-xl shadow-lg border-2 border-green-200 p-6">
              {/* Preço */}
              <div className="mb-6">
                {curso.preco_com_desconto ? (
                  <>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {curso.preco_com_desconto}
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        R$ {curso.preco}
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        {Math.round(((curso.preco - curso.preco_com_desconto) / curso.preco) * 100)}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold text-green-600">
                    R$ {curso.preco}
                  </div>
                )}
              </div>

              {/* Botão CTA */}
              <a
                href={curso.checkout_url || '#'}
                className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white text-center px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg font-medium text-lg mb-4"
              >
                🛒 Garantir Agora
              </a>

              {/* Benefícios */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  Acesso imediato e vitalício
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  Certificado de conclusão
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  Suporte do professor
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-600 mr-2">✓</span>
                  Garantia de 7 dias
                </div>
              </div>

              {/* Estatísticas */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <p className="font-bold text-gray-900">{curso.total_aulas}</p>
                    <p className="text-gray-600">Aulas</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{curso.duracao_horas}h</p>
                    <p className="text-gray-600">Duração</p>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{curso.total_avaliacoes}+</p>
                    <p className="text-gray-600">Alunos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

