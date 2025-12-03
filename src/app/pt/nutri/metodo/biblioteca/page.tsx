'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import type { BibliotecaItem } from '@/types/formacao'

export default function BibliotecaPage() {
  const [biblioteca, setBiblioteca] = useState<BibliotecaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarBiblioteca = async () => {
      try {
        const res = await fetch('/api/nutri/formacao/biblioteca', {
          credentials: 'include'
        })

        if (res.ok) {
          const data = await res.json()
          setBiblioteca(data.data || [])
        }
      } catch (error) {
        console.error('Erro ao carregar biblioteca:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarBiblioteca()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link 
            href="/pt/nutri/metodo" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Biblioteca</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Biblioteca YLADA
          </h1>
          <p className="text-lg text-gray-600">
            Materiais complementares, PDFs, scripts, checklists e templates para sua jornada.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : biblioteca.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-600">Nenhum material disponível no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biblioteca.map((item) => {
              // Verificar se é o Guia Completo do Método YLADA (página interna)
              const isGuiaMetodo = item.title.toLowerCase().includes('guia completo do método ylada')
              const linkHref = isGuiaMetodo 
                ? '/pt/nutri/metodo/biblioteca/guia-metodo-ylada'
                : item.file_url

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ease-out hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl flex-shrink-0">
                      {item.file_type === 'pdf' && '📄'}
                      {item.file_type === 'template' && '🎨'}
                      {item.file_type === 'script' && '📝'}
                      {item.file_type === 'planilha' && '📊'}
                      {item.file_type === 'mensagem' && '💬'}
                      {!['pdf', 'template', 'script', 'planilha', 'mensagem'].includes(item.file_type) && '📎'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {item.category}
                        </span>
                        {isGuiaMetodo ? (
                          <Link
                            href={linkHref}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                          >
                            Ler agora →
                          </Link>
                        ) : (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
                          >
                            Baixar PDF →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

