'use client'

import Link from 'next/link'

export default function FormacaoHeader() {
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
          
          <Link
            href="/pt/nutri/home"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Voltar ao YLADA Nutri</span>
            <span className="sm:hidden">Voltar</span>
          </Link>
        </div>
      </div>
    </header>
  )
}

