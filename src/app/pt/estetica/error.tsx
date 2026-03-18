'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function EsteticaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[estetica]', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-xl font-bold text-gray-900 mb-2">Algo deu errado</h1>
      <p className="text-gray-600 text-sm mb-4 max-w-md text-center">
        {error.message}
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          Tentar de novo
        </button>
        <Link
          href="/pt/estetica"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Voltar
        </Link>
      </div>
    </div>
  )
}
