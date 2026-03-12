'use client'

import { Suspense } from 'react'
import DiagnosticoQuiz from '@/components/ylada/DiagnosticoQuiz'

export default function DiagnosticoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <DiagnosticoQuiz slug="comunicacao" />
    </Suspense>
  )
}
