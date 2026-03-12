'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import DiagnosticoQuiz from '@/components/ylada/DiagnosticoQuiz'
import { DIAGNOSTICOS } from '@/config/ylada-diagnosticos'
import { getVariante, isVariante } from '@/config/ylada-diagnostico-variantes'

const SLUGS_BASE = Object.keys(DIAGNOSTICOS)

export default function DiagnosticoSlugClient() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''

  if (isVariante(slug)) {
    const variante = getVariante(slug)
    if (!variante) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
          <p className="text-gray-600 mb-4">Diagnóstico não encontrado.</p>
          <Link href="/pt/diagnostico" className="text-blue-600 hover:underline">
            Voltar
          </Link>
        </div>
      )
    }
    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">Carregando...</p>
        </div>
      }>
        <DiagnosticoQuiz
          slug={variante.baseSlug}
          variantOverride={{
            tituloCurto: variante.titulo,
            descricaoStart: variante.descricao,
            bulletsStart: variante.bullets,
          }}
        />
      </Suspense>
    )
  }

  if (!SLUGS_BASE.includes(slug)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <p className="text-gray-600 mb-4">Diagnóstico não encontrado.</p>
        <Link href="/pt/diagnostico" className="text-blue-600 hover:underline">
          Voltar
        </Link>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <DiagnosticoQuiz slug={slug} />
    </Suspense>
  )
}
