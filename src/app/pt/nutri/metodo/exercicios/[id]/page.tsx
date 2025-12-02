'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function ExercicioPage() {
  const params = useParams()
  const exercicioId = params.id as string

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/metodo/exercicios"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para Exercícios
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Exercício YLADA
          </h1>
          <p className="text-gray-600">ID: {exercicioId}</p>
        </div>

        {/* Placeholder */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <p className="text-gray-600 mb-4">
            Conteúdo do exercício será preenchido em breve.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Objetivo</h3>
              <p className="text-gray-600">Objetivo do exercício...</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Passo a Passo</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Passo 1</li>
                <li>Passo 2</li>
                <li>Passo 3</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para a Jornada
          </Link>
        </div>
      </div>
    </div>
  )
}

