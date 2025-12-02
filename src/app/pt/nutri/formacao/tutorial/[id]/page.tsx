'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import type { Tutorial } from '@/types/formacao'

export default function TutorialPage() {
  const params = useParams()
  const tutorialId = params.id as string

  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarTutorial = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const res = await fetch(`/api/nutri/formacao/tutoriais/${tutorialId}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Erro ao carregar tutorial')
        }

        const data = await res.json()
        setTutorial(data.data)
      } catch (error: any) {
        console.error('Erro ao carregar tutorial:', error)
        setErro('Erro ao carregar tutorial')
      } finally {
        setCarregando(false)
      }
    }

    if (tutorialId) {
      carregarTutorial()
    }
  }, [tutorialId])

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando tutorial...</p>
          </div>
        </div>
      </div>
    )
  }

  if (erro || !tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800">{erro || 'Tutorial não encontrado'}</p>
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
          ← Voltar para tutoriais
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Player */}
          <div className="aspect-video bg-black">
            {tutorial.video_url ? (
              <video
                src={tutorial.video_url}
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
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {tutorial.tool_name}
              </span>
              <span className="text-xs text-gray-500">{tutorial.level}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{tutorial.title}</h1>
            <p className="text-gray-600 mb-6 whitespace-pre-line">{tutorial.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{tutorial.duration_minutes} minutos</span>
              <Link
                href="/pt/nutri/formacao"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver mais tutoriais →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

