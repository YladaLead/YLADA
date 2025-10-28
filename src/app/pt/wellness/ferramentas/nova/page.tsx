'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Template {
  id: string
  nome: string
  categoria: string
  objetivo: string
  icon: string
  descricao: string
}

export default function NovaFerramentaWellness() {
  const [etapaAtual, setEtapaAtual] = useState(1)
  const [templateSelecionado, setTemplateSelecionado] = useState<Template | null>(null)

  // Templates disponíveis para Wellness
  const templates: Template[] = [
    {
      id: 'quiz-wellness-profile',
      nome: 'Quiz: Perfil de Bem-Estar',
      categoria: 'Quiz',
      objetivo: 'Descobrir perfil de bem-estar',
      icon: '❤️',
      descricao: 'Avalie saúde física, mental e emocional dos seus leads'
    },
    {
      id: 'calc-imc',
      nome: 'Calculadora IMC',
      categoria: 'Calculadora',
      objetivo: 'Calcular IMC',
      icon: '📊',
      descricao: 'Calcule o Índice de Massa Corporal com orientações'
    },
    {
      id: 'calc-proteina',
      nome: 'Calculadora de Proteína',
      categoria: 'Calculadora',
      objetivo: 'Calcular proteína diária',
      icon: '💪',
      descricao: 'Avalie necessidades proteicas individuais'
    },
    {
      id: 'calc-hidratacao',
      nome: 'Calculadora de Hidratação',
      categoria: 'Calculadora',
      objetivo: 'Calcular água diária',
      icon: '💧',
      descricao: 'Avalie necessidades de água e eletrólitos'
    },
    {
      id: 'quiz-ganhos',
      nome: 'Quiz: Ganhos e Prosperidade',
      categoria: 'Quiz',
      objetivo: 'Avaliar potencial financeiro',
      icon: '💰',
      descricao: 'Descubra se o estilo de vida permite ganhar mais'
    },
    {
      id: 'quiz-potencial',
      nome: 'Quiz: Potencial e Crescimento',
      categoria: 'Quiz',
      objetivo: 'Avaliar potencial de crescimento',
      icon: '📈',
      descricao: 'Descubra se o potencial está sendo bem aproveitado'
    }
  ]

  const criarFerramenta = (template: Template) => {
    setTemplateSelecionado(template)
    // Redirecionar para criação baseada no template
    // Por enquanto, vamos apenas mostrar o template selecionado
    setEtapaAtual(2)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {etapaAtual === 1 ? 'Nova Ferramenta' : templateSelecionado?.nome}
              </h1>
            </div>
            <Link
              href="/pt/wellness/ferramentas"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {etapaAtual === 1 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Escolha um Template
              </h2>
              <p className="text-gray-600">
                Selecione uma ferramenta pronta para personalizar e usar
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all hover:shadow-lg cursor-pointer group"
                  onClick={() => criarFerramenta(template)}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {template.nome}
                        </h3>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {template.categoria}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {template.descricao}
                    </p>
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
                      <strong>Objetivo:</strong> {template.objetivo}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {etapaAtual === 2 && templateSelecionado && (
          <div className="bg-white rounded-xl border-2 border-purple-200 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{templateSelecionado.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {templateSelecionado.nome}
              </h2>
              <p className="text-gray-600 mb-6">
                Essa ferramenta será implementada em breve com todos os recursos do YLADA.
              </p>
              <div className="space-y-3">
                <Link
                  href="/pt/wellness/templates"
                  className="inline-block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Ver Templates Disponíveis
                </Link>
                <Link
                  href="/pt/wellness/quiz-personalizado"
                  className="inline-block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Criar Quiz Personalizado
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

