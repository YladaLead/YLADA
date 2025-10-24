'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function TemplatesNutri() {
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas')

  const templates = [
    {
      id: 'quiz-metabolismo',
      nome: 'Quiz do Metabolismo',
      categoria: 'Quiz',
      descricao: 'Descubra se você tem metabolismo rápido, moderado ou lento',
      icon: '🧬',
      cor: 'blue',
      perguntas: 5,
      tempoEstimado: '2 min',
      leadsMedio: '45/mês',
      conversao: '26%',
      preview: 'Perguntas sobre hábitos alimentares, exercícios e energia'
    },
    {
      id: 'calculadora-imc',
      nome: 'Calculadora de IMC',
      categoria: 'Calculadora',
      descricao: 'Calcule seu IMC com interpretação personalizada',
      icon: '📊',
      cor: 'green',
      perguntas: 3,
      tempoEstimado: '1 min',
      leadsMedio: '32/mês',
      conversao: '25%',
      preview: 'Altura, peso e análise do resultado'
    },
    {
      id: 'quiz-intolerancia',
      nome: 'Quiz de Intolerâncias',
      categoria: 'Quiz',
      descricao: 'Identifique possíveis intolerâncias alimentares',
      icon: '🚫',
      cor: 'red',
      perguntas: 7,
      tempoEstimado: '3 min',
      leadsMedio: '38/mês',
      conversao: '28%',
      preview: 'Sintomas digestivos e reações alimentares'
    },
    {
      id: 'calculadora-agua',
      nome: 'Calculadora de Água',
      categoria: 'Calculadora',
      descricao: 'Calcule sua necessidade diária de hidratação',
      icon: '💧',
      cor: 'blue',
      perguntas: 4,
      tempoEstimado: '1 min',
      leadsMedio: '28/mês',
      conversao: '22%',
      preview: 'Peso, atividade física e clima'
    },
    {
      id: 'quiz-sono',
      nome: 'Quiz da Qualidade do Sono',
      categoria: 'Quiz',
      descricao: 'Avalie como o sono afeta sua alimentação',
      icon: '😴',
      cor: 'purple',
      perguntas: 6,
      tempoEstimado: '2 min',
      leadsMedio: '35/mês',
      conversao: '24%',
      preview: 'Hábitos de sono e alimentação noturna'
    },
    {
      id: 'calculadora-proteina',
      nome: 'Calculadora de Proteína',
      categoria: 'Calculadora',
      descricao: 'Calcule sua necessidade proteica diária',
      icon: '🥩',
      cor: 'orange',
      perguntas: 5,
      tempoEstimado: '2 min',
      leadsMedio: '42/mês',
      conversao: '27%',
      preview: 'Peso, objetivos e atividade física'
    },
    {
      id: 'quiz-estresse',
      nome: 'Quiz do Estresse Alimentar',
      categoria: 'Quiz',
      descricao: 'Identifique como o estresse afeta sua alimentação',
      icon: '😰',
      cor: 'yellow',
      perguntas: 8,
      tempoEstimado: '3 min',
      leadsMedio: '31/mês',
      conversao: '25%',
      preview: 'Situações estressantes e hábitos alimentares'
    },
    {
      id: 'calculadora-calorias',
      nome: 'Calculadora de Calorias',
      categoria: 'Calculadora',
      descricao: 'Calcule seu gasto calórico diário',
      icon: '🔥',
      cor: 'red',
      perguntas: 6,
      tempoEstimado: '2 min',
      leadsMedio: '39/mês',
      conversao: '26%',
      preview: 'Dados pessoais e nível de atividade'
    }
  ]

  const categorias = ['todas', 'Quiz', 'Calculadora']

  const templatesFiltrados = templates.filter(template => 
    categoriaFiltro === 'todas' || template.categoria === categoriaFiltro
  )

  const getCorClasses = (cor: string) => {
    const cores = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
    return cores[cor as keyof typeof cores] || cores.blue
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/logos/ylada-logo-horizontal-vazado.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Templates NUTRI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/ferramentas"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar às Ferramentas
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introdução */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-3">🎨</span>
            Templates Prontos para Nutricionistas
          </h2>
          <p className="text-gray-700 mb-4">
            Escolha um template testado e otimizado para nutricionistas. Todos os templates foram criados 
            especificamente para capturar leads qualificados na área de nutrição.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span>Testados com nutricionistas reais</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600">⚡</span>
              <span>Configuração em menos de 5 minutos</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-purple-600">🎯</span>
              <span>Alta taxa de conversão garantida</span>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {categoria === 'todas' ? 'Todas as categorias' : categoria}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Grid de Templates */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesFiltrados.map((template) => (
            <div key={template.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.nome}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCorClasses(template.cor)}`}>
                      {template.categoria}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{template.descricao}</p>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <p className="text-sm text-gray-700">{template.preview}</p>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{template.perguntas}</p>
                  <p className="text-xs text-gray-600">Perguntas</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{template.tempoEstimado}</p>
                  <p className="text-xs text-gray-600">Duração</p>
                </div>
              </div>

              {/* Performance */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-green-600">{template.leadsMedio}</p>
                  <p className="text-xs text-gray-600">Leads médio</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-blue-600">{template.conversao}</p>
                  <p className="text-xs text-gray-600">Conversão</p>
                </div>
              </div>

              {/* Ações */}
              <div className="flex space-x-2">
                <Link
                  href={`/pt/nutri/ferramentas/template/${template.id}`}
                  className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Usar Template
                </Link>
                <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ações Rápidas */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Não encontrou o que procura?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/pt/nutri/ferramentas/nova"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <h3 className="font-medium text-gray-900">Criar Ferramenta Personalizada</h3>
                <p className="text-sm text-gray-600">Crie uma ferramenta do zero com suas especificações</p>
              </div>
            </Link>
            
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">💡</span>
              <div>
                <h3 className="font-medium text-gray-900">Sugerir Novo Template</h3>
                <p className="text-sm text-gray-600">Nos conte que tipo de ferramenta você gostaria</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
