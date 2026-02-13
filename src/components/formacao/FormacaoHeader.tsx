'use client'

import { useRouter } from 'next/navigation'

export default function FormacaoHeader() {
  const router = useRouter()

  const handleVoltarNoel = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/pt/nutri/home')
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              O Método YLADA
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              O que a faculdade não ensinou, mas que define o sucesso da Nutricionista moderna.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleVoltarNoel}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Voltar para a home do Noel"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline font-medium">Voltar ao Noel</span>
            <span className="sm:hidden font-medium">Noel</span>
          </button>
        </div>
      </div>
    </header>
  )
}

