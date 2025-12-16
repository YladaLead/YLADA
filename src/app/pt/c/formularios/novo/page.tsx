// Re-exportar página de novo formulário de /pt/coach/(protected)/formularios/novo para /pt/c/formularios/novo
'use client'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const NovoFormularioPage = dynamic(() => import('../../../coach/(protected)/formularios/novo/page'), {
  ssr: false
})

export default function NovoFormularioCoachWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NovoFormularioPage />
    </Suspense>
  )
}















