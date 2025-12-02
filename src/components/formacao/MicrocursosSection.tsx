'use client'

import Link from 'next/link'
import type { Microcurso } from '@/types/formacao'

interface MicrocursosSectionProps {
  microcursos: Microcurso[]
}

export default function MicrocursosSection({ microcursos }: MicrocursosSectionProps) {
  if (microcursos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <p className="text-gray-600">Nenhum mini capítulo disponível no momento.</p>
        <p className="text-sm text-gray-500 mt-2">Os mini capítulos práticos estarão disponíveis em breve!</p>
      </div>
    )
  }

  // Ordenar por relevância (ordem do order_index)
  const microcursosOrdenados = [...microcursos].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))

  return (
    <div className="space-y-6">
      {/* Introdução aos Exercícios */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border-l-4 border-green-400">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">💪 Exercícios Aplicáveis do Método YLADA</h2>
        <p className="text-gray-700">
          Ações práticas que você aplica no mesmo dia. Cada exercício tem um objetivo claro, um checklist e uma ação imediata.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Use os exercícios por conta própria ou siga a Jornada de 30 Dias, que organiza tudo passo a passo.
        </p>
      </div>

      {/* Grid de Mini Capítulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {microcursosOrdenados.map((microcurso) => (
          <Link
            key={microcurso.id}
            href={`/pt/nutri/formacao/microcurso/${microcurso.id}`}
            className="bg-white rounded-xl p-4 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {microcurso.thumbnail_url && (
              <img
                src={microcurso.thumbnail_url}
                alt={microcurso.title}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                💪 Exercício
              </span>
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                ⚡ Aplicável
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{microcurso.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{microcurso.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{microcurso.duration_minutes} min</span>
              <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ler →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

