'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

interface ExercicioLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  backLink?: string
  backLabel?: string
}

export default function ExercicioLayout({
  title,
  subtitle,
  children,
  backLink = '/pt/nutri/metodo/jornada',
  backLabel = 'Voltar para Jornada'
}: ExercicioLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href={backLink}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← {backLabel}
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-gray-600">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        {children}

        {/* Navegação */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <Link
            href={backLink}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← {backLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}

