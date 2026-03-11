'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

const PERFIS: Record<string, { titulo: string; explicacao: string }> = {
  curiosos: {
    titulo: 'Comunicação que atrai curiosos',
    explicacao:
      'Sua comunicação provavelmente chama atenção, mas ainda não filtra pessoas realmente interessadas. Isso faz com que você receba muitas conversas improdutivas.',
  },
  desenvolvimento: {
    titulo: 'Comunicação em desenvolvimento',
    explicacao:
      'Sua comunicação já gera algum resultado, mas ainda há espaço para melhorar. Com diagnósticos estratégicos, você pode atrair clientes mais preparados para contratar.',
  },
  clientes: {
    titulo: 'Comunicação que atrai clientes',
    explicacao:
      'Sua comunicação já filtra bem quem está interessado. Com o YLADA você pode escalar isso com diagnósticos automatizados e links inteligentes.',
  },
}

function ResultadoContent() {
  const searchParams = useSearchParams()
  const perfilParam = searchParams.get('perfil') || 'curiosos'
  const perfil = PERFIS[perfilParam] || PERFIS.curiosos

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
            Método YLADA
          </Link>
        </div>
      </header>

      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">Seu perfil</p>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {perfil.titulo}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">{perfil.explicacao}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 sm:p-8 border border-blue-100 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Como o YLADA resolve isso</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Diagnósticos</strong> — Crie quizzes que ajudam seus clientes a descobrir problemas antes da conversa</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Links inteligentes</strong> — Compartilhe ferramentas que geram valor e qualificam leads</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>Contatos qualificados</strong> — Receba pessoas que já entendem o valor do seu trabalho</span>
            </li>
          </ul>
        </div>

        <p className="text-sm text-gray-500 text-center mb-8 italic">
          Este foi apenas um exemplo de diagnóstico criado com YLADA. Com a plataforma você pode criar diagnósticos semelhantes para seus próprios clientes.
        </p>

        <div className="space-y-4">
          <Link
            href="/pt/escolha-perfil"
            className="block w-full text-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
          >
            Criar meus próprios diagnósticos com YLADA
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/pt/metodo-ylada"
              className="text-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Conhecer o método YLADA
            </Link>
            <Link
              href="/pt/precos"
              className="text-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Ver preços
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">YLADA</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">Método</Link>
        </div>
      </footer>
    </div>
  )
}

export default function ResultadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    }>
      <ResultadoContent />
    </Suspense>
  )
}
