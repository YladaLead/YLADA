'use client'

import Link from 'next/link'

interface ModuleCardProps {
  id: string
  title: string
  description?: string
  progress: number
  unlocked: boolean
  trilhaId: string
  ordem: number
}

export default function ModuleCard({
  id,
  title,
  description,
  progress,
  unlocked,
  trilhaId,
  ordem,
}: ModuleCardProps) {
  const isCompleted = progress === 100

  return (
    <Link
      href={`/pt/nutri/cursos/${trilhaId}/${id}`}
      className={`block rounded-lg border-2 p-4 transition-all ${
        unlocked
          ? isCompleted
            ? 'bg-green-50 border-green-200 hover:border-green-300'
            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
          : 'bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
              unlocked
                ? isCompleted
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white'
                : 'bg-gray-400 text-white'
            }`}
          >
            {isCompleted ? '✓' : ordem}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        {!unlocked && (
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            🔒 Bloqueado
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      {unlocked && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Progresso</span>
            <span className="text-xs font-semibold text-gray-900">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${
                isCompleted ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  )
}

