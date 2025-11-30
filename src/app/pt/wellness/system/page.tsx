'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function WellnessSystemPageContent() {
  const [moduloAberto, setModuloAberto] = useState<string | null>(null)

  const toggleModulo = (modulo: string) => {
    setModuloAberto(moduloAberto === modulo ? null : modulo)
  }

  const modulos = [
    {
      id: 'recrutar',
      titulo: 'RECRUTAR PESSOAS PARA O NEGÓCIO',
      emoji: '👥',
      cor: 'from-blue-500 to-blue-600',
      corHover: 'hover:from-blue-600 hover:to-blue-700',
      subitens: [
        { id: 'fluxos-recrutamento', titulo: 'Ver Fluxos de Recrutamento', rota: '/pt/wellness/system/recrutar/fluxos' },
        { id: 'scripts-recrutamento', titulo: 'Ver Scripts de Recrutamento', rota: '/pt/wellness/system/recrutar/scripts' },
        { id: 'enviar-link', titulo: 'Enviar Link de Apresentação', rota: '/pt/wellness/system/recrutar/enviar-link' },
        { id: 'objecoes-recrutamento', titulo: 'Objeções de Recrutamento', rota: '/pt/wellness/system/recrutar/objecoes' }
      ]
    },
    {
      id: 'vender',
      titulo: 'VENDER BEBIDAS FUNCIONAIS',
      emoji: '💚',
      cor: 'from-green-500 to-green-600',
      corHover: 'hover:from-green-600 hover:to-green-700',
      subitens: [
        { id: 'fluxos-cliente', titulo: 'Fluxos de Cliente (20 fluxos)', rota: '/pt/wellness/system/vender/fluxos' },
        { id: 'scripts-venda', titulo: 'Scripts de Venda', rota: '/pt/wellness/system/vender/scripts' },
        { id: 'scripts-fechamento', titulo: 'Scripts de Fechamento', rota: '/pt/wellness/system/vender/fechamento' },
        { id: 'scripts-objecoes', titulo: 'Scripts de Objeções (clientes)', rota: '/pt/wellness/system/vender/objecoes' },
        { id: 'follow-up', titulo: 'Follow-up automático', rota: '/pt/wellness/system/vender/follow-up' },
        { id: 'links-kits', titulo: 'Links de Venda do Kit Energia / Kit Acelera', rota: '/pt/wellness/system/vender/links-kits' },
        { id: 'produto-fechado', titulo: 'Produto Fechado / Cliente Premium', rota: '/pt/wellness/system/vender/produto-fechado' }
      ],
      temSubmenu: true // Indica que tem submenu de fluxos
    },
    {
      id: 'scripts',
      titulo: 'SCRIPTS (BIBLIOTECA COMPLETA)',
      emoji: '📚',
      cor: 'from-purple-500 to-purple-600',
      corHover: 'hover:from-purple-600 hover:to-purple-700',
      subitens: [
        { id: 'todos-scripts', titulo: 'Ver Todos os Scripts', rota: '/pt/wellness/system/scripts' },
        { id: 'abertura', titulo: 'Abertura', rota: '/pt/wellness/system/scripts/abertura' },
        { id: 'pos-link', titulo: 'Pós-Link', rota: '/pt/wellness/system/scripts/pos-link' },
        { id: 'pos-diagnostico', titulo: 'Pós-Diagnóstico', rota: '/pt/wellness/system/scripts/pos-diagnostico' },
        { id: 'oferta', titulo: 'Oferta', rota: '/pt/wellness/system/scripts/oferta' },
        { id: 'fechamento', titulo: 'Fechamento', rota: '/pt/wellness/system/scripts/fechamento' },
        { id: 'objecoes', titulo: 'Objeções', rota: '/pt/wellness/system/scripts/objecoes' },
        { id: 'recuperacao', titulo: 'Recuperação', rota: '/pt/wellness/system/scripts/recuperacao' },
        { id: 'indicacoes', titulo: 'Indicações', rota: '/pt/wellness/system/scripts/indicacoes' },
        { id: 'pos-venda', titulo: 'Pós-venda', rota: '/pt/wellness/system/scripts/pos-venda' },
        { id: 'recompra', titulo: 'Recompra', rota: '/pt/wellness/system/scripts/recompra' }
      ]
    },
    {
      id: 'treinamento',
      titulo: 'TREINAMENTO DO CONSULTOR',
      emoji: '🎓',
      cor: 'from-orange-500 to-orange-600',
      corHover: 'hover:from-orange-600 hover:to-orange-700',
      subitens: [
        { id: 'todos-treinamentos', titulo: 'Ver Todos os Treinamentos', rota: '/pt/wellness/system/treinamento' }
      ]
    },
    {
      id: 'ferramentas',
      titulo: 'FERRAMENTAS',
      emoji: '🛠️',
      cor: 'from-teal-500 to-teal-600',
      corHover: 'hover:from-teal-600 hover:to-teal-700',
      subitens: [
        { id: 'historico-diagnosticos', titulo: 'Histórico de Diagnósticos', rota: '/pt/wellness/system/diagnosticos' },
        { id: 'painel-conversoes', titulo: 'Painel de Conversões', rota: '/pt/wellness/system/ferramentas/painel-conversoes' },
        { id: 'gerador-link', titulo: 'Gerador de Link', rota: '/pt/wellness/system/ferramentas/gerador-link' }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Cabeçalho */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            O que você quer fazer agora?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha uma opção abaixo para começar
          </p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-105 ${moduloAberto === modulo.id ? 'ring-4 ring-green-400' : ''}`}
            >
              {/* Botão Principal do Módulo */}
              <button
                onClick={() => toggleModulo(modulo.id)}
                className={`w-full p-6 sm:p-8 bg-gradient-to-r ${modulo.cor} ${modulo.corHover} text-white transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl sm:text-5xl">{modulo.emoji}</span>
                    <h2 className="text-lg sm:text-xl font-bold text-left leading-tight">
                      {modulo.titulo}
                    </h2>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-300 ${moduloAberto === modulo.id ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Subitens (Expandido) */}
              {moduloAberto === modulo.id && (
                <div className="p-4 sm:p-6 space-y-2 sm:space-y-3 bg-gray-50">
                  {modulo.subitens.map((subitem) => (
                    <Link
                      key={subitem.id}
                      href={subitem.rota}
                      className="block p-3 sm:p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium text-gray-800 group-hover:text-green-700">
                          {subitem.titulo}
                        </span>
                        <svg
                          className="w-5 h-5 text-gray-400 group-hover:text-green-600 transform group-hover:translate-x-1 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rodapé com informações */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Dica:</strong> Clique em qualquer módulo para ver as opções disponíveis
          </p>
        </div>
      </main>
    </div>
  )
}

export default function WellnessSystemPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <WellnessSystemPageContent />
    </ProtectedRoute>
  )
}

