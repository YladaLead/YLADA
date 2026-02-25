'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function MatrixError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[matrix] Erro:', error.message, error.digest)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full text-center">
        <p className="text-6xl mb-4" aria-hidden>⚠️</p>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Algo deu errado
        </h1>
        <p className="text-gray-600 mb-6">
          Ocorreu um erro ao carregar esta página. Tente novamente ou volte ao início.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Tentar de novo
          </button>
          <Link
            href="/pt"
            className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
          >
            Ir para o início
          </Link>
        </div>
      </div>
    </div>
  )
}
