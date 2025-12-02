'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import JornadaSection from '@/components/formacao/JornadaSection'

export default function JornadaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header da Jornada */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Jornada de 30 Dias – Método YLADA
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Lote sua agenda e transforme sua rotina em 30 dias aplicando o Método YLADA – O que a faculdade não ensinou.
          </p>
        </div>

        {/* Componente da Jornada */}
        <JornadaSection />
      </div>
    </div>
  )
}

