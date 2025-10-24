'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function QuizPersonalizado() {
  const [etapaAtual, setEtapaAtual] = useState(1)

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Quiz Personalizado
                </h1>
                <p className="text-sm text-gray-600">Crie quizzes únicos para seus clientes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status da Construção */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border-2 border-purple-200 mb-8">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🚧</span>
            <h2 className="text-2xl font-bold text-purple-900 mb-4">
              Quiz Personalizado em Desenvolvimento
            </h2>
            <p className="text-purple-700 mb-6 max-w-2xl mx-auto">
              Estamos construindo uma ferramenta poderosa para você criar quizzes personalizados 
              com perguntas dissertativas e alternativas. Em breve você poderá:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">📝</span>
                <h3 className="font-semibold text-gray-900 mb-2">Perguntas Dissertativas</h3>
                <p className="text-sm text-gray-600">
                  Crie perguntas abertas para capturar informações detalhadas dos seus clientes
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🔘</span>
                <h3 className="font-semibold text-gray-900 mb-2">Perguntas Alternativas</h3>
                <p className="text-sm text-gray-600">
                  Desenvolva questões de múltipla escolha para facilitar a resposta
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">🎨</span>
                <h3 className="font-semibold text-gray-900 mb-2">Personalização Visual</h3>
                <p className="text-sm text-gray-600">
                  Customize cores, fontes e layout para combinar com sua marca
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-2xl mb-2 block">📊</span>
                <h3 className="font-semibold text-gray-900 mb-2">Análise de Respostas</h3>
                <p className="text-sm text-gray-600">
                  Receba relatórios detalhados sobre as respostas dos seus clientes
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Funcionalidades Planejadas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Editor visual de perguntas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Múltiplos tipos de questão</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Lógica condicional</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Resultados personalizados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Captura automática de leads</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Integração com redes sociais</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alternativas Disponíveis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Enquanto isso, use nossas ferramentas prontas:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/pt/nutri/ferramentas/templates"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">🎨</span>
              <div>
                <h4 className="font-medium text-gray-900">Templates Prontos</h4>
                <p className="text-sm text-gray-600">38 ferramentas testadas e otimizadas</p>
              </div>
            </Link>
            
            <Link 
              href="/pt/nutri/ferramentas/nova"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">🛠️</span>
              <div>
                <h4 className="font-medium text-gray-900">Criar Ferramenta</h4>
                <p className="text-sm text-gray-600">Use nosso construtor de ferramentas</p>
              </div>
            </Link>
            
            <Link 
              href="/pt/nutri/leads"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h4 className="font-medium text-gray-900">Meus Leads</h4>
                <p className="text-sm text-gray-600">Gerencie leads capturados</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Notificação de Lançamento */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🔔</span>
            <div>
              <h4 className="font-semibold text-blue-900">Quer ser notificado do lançamento?</h4>
              <p className="text-sm text-blue-700">
                Deixe seu email e te avisaremos assim que o Quiz Personalizado estiver disponível!
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <input
              type="email"
              placeholder="Seu email"
              className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
