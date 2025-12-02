'use client'

import Link from 'next/link'
import type { Tutorial } from '@/types/formacao'

interface TutoriaisSectionProps {
  tutoriais: Tutorial[]
}

export default function TutoriaisSection({ tutoriais }: TutoriaisSectionProps) {
  if (tutoriais.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <p className="text-gray-600">Nenhum guia técnico disponível no momento.</p>
        <p className="text-sm text-gray-500 mt-2">Os guias técnicos do livro estarão disponíveis em breve!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Introdução ao Manual Técnico */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-l-4 border-blue-400">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📖 Manual Técnico YLADA</h2>
        <p className="text-gray-700">
          Como aplicar o Método YLADA dentro do sistema. Guias práticos para usar cada ferramenta e funcionalidade.
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Aprenda: Como usar Captação YLADA, Como usar Gestão GSAL, Como usar Formulários, Como criar Links de ferramentas, Como divulgar sua primeira ferramenta.
        </p>
      </div>

      {/* Grid de Guias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tutoriais.map((tutorial) => (
          <Link
            key={tutorial.id}
            href={`/pt/nutri/formacao/tutorial/${tutorial.id}`}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {tutorial.thumbnail_url ? (
                <img
                  src={tutorial.thumbnail_url}
                  alt={tutorial.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
                  🎓
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                    📖 Manual Técnico
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{tutorial.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{tutorial.tool_name}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {tutorial.duration_minutes} min • {tutorial.level}
                  </span>
                  <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Ler Manual →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

