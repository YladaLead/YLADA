'use client'

import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'

export default function EmConstrucaoInstitutional() {
  const { t } = useTranslations('pt')
  const inst = t.institutional
  if (!inst) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500">Em construção</p>
        <Link href="/pt" className="mt-4 text-blue-600 font-medium">
          Voltar
        </Link>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-5xl sm:text-6xl mb-4" aria-hidden>
          🚧
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {inst.construction.title}
        </h1>
        <p className="text-gray-600 mb-6 sm:mb-8">
          {inst.construction.message}
        </p>
        <Link
          href="/pt"
          className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
        >
          {inst.construction.back}
        </Link>
      </div>
    </div>
  )
}
