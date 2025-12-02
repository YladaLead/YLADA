'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import type { Microcurso } from '@/types/formacao'

export default function MicrocursoPage() {
  const params = useParams()
  const microcursoId = params.id as string

  const [microcurso, setMicrocurso] = useState<Microcurso | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarMicrocurso = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const res = await fetch(`/api/nutri/formacao/microcursos/${microcursoId}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Erro ao carregar microcurso')
        }

        const data = await res.json()
        setMicrocurso(data.data)
      } catch (error: any) {
        console.error('Erro ao carregar microcurso:', error)
        setErro('Erro ao carregar microcurso')
      } finally {
        setCarregando(false)
      }
    }

    if (microcursoId) {
      carregarMicrocurso()
    }
  }, [microcursoId])

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando microcurso...</p>
          </div>
        </div>
      </div>
    )
  }

  if (erro || !microcurso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800">{erro || 'Microcurso não encontrado'}</p>
            <Link
              href="/pt/nutri/formacao"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/pt/nutri/formacao"
          className="text-blue-600 hover:text-blue-700 text-sm mb-6 inline-block"
        >
          ← Voltar para microcursos
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Player */}
          <div className="aspect-video bg-black">
            {microcurso.video_url ? (
              <video
                src={microcurso.video_url}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-lg">Vídeo em breve</p>
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo */}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{microcurso.title}</h1>
            <p className="text-gray-600 mb-6 whitespace-pre-line">{microcurso.description}</p>

            {/* Checklist */}
            {microcurso.checklist_items && microcurso.checklist_items.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">📋 Checklist de Aprendizado</h3>
                <ul className="space-y-2">
                  {microcurso.checklist_items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Espaço para material complementar */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">📎 Material Complementar</h3>
              <p className="text-xs text-gray-500">Materiais adicionais estarão disponíveis em breve</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>{microcurso.duration_minutes} minutos</span>
              <Link
                href="/pt/nutri/formacao"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver mais microcursos →
              </Link>
            </div>

            {/* Microtexto de navegação */}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/pt/nutri/formacao"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              >
                ← Ver todos os microcursos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

