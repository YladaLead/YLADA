'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import FormacaoTabs from '@/components/formacao/FormacaoTabs'
import MetodoYLADAIntro from '@/components/formacao/MetodoYLADAIntro'
import TrilhasSection from '@/components/formacao/TrilhasSection'
import MicrocursosSection from '@/components/formacao/MicrocursosSection'
import BibliotecaSection from '@/components/formacao/BibliotecaSection'
import TutoriaisSection from '@/components/formacao/TutoriaisSection'
import type { Trilha, Microcurso, BibliotecaItem, Tutorial } from '@/types/formacao'

export default function FormacaoPage() {
  const { user, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<'jornada' | 'trilhas' | 'microcursos' | 'biblioteca' | 'tutoriais'>('jornada')
  
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [microcursos, setMicrocursos] = useState<Microcurso[]>([])
  const [biblioteca, setBiblioteca] = useState<BibliotecaItem[]>([])
  const [tutoriais, setTutoriais] = useState<Tutorial[]>([])
  
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar dados
  useEffect(() => {
    if (!user) return

    const carregarDados = async () => {
      try {
        setCarregando(true)
        setErro(null)

        // Carregar trilhas
        const trilhasRes = await fetch('/api/nutri/formacao/trilhas', {
          credentials: 'include'
        })
        if (trilhasRes.ok) {
          const trilhasData = await trilhasRes.json()
          console.log('Trilhas recebidas:', trilhasData)
          setTrilhas(trilhasData.data || [])
        } else {
          console.error('Erro ao carregar trilhas:', trilhasRes.status, trilhasRes.statusText)
        }

        // Carregar microcursos
        const microcursosRes = await fetch('/api/nutri/formacao/microcursos', {
          credentials: 'include'
        })
        if (microcursosRes.ok) {
          const microcursosData = await microcursosRes.json()
          console.log('Microcursos recebidos:', microcursosData)
          setMicrocursos(microcursosData.data || [])
        } else {
          console.error('Erro ao carregar microcursos:', microcursosRes.status, microcursosRes.statusText)
        }

        // Carregar biblioteca
        const bibliotecaRes = await fetch('/api/nutri/formacao/biblioteca', {
          credentials: 'include'
        })
        if (bibliotecaRes.ok) {
          const bibliotecaData = await bibliotecaRes.json()
          console.log('Biblioteca recebida:', bibliotecaData)
          setBiblioteca(bibliotecaData.data || [])
        } else {
          console.error('Erro ao carregar biblioteca:', bibliotecaRes.status, bibliotecaRes.statusText)
        }

        // Carregar tutoriais
        const tutoriaisRes = await fetch('/api/nutri/formacao/tutoriais', {
          credentials: 'include'
        })
        if (tutoriaisRes.ok) {
          const tutoriaisData = await tutoriaisRes.json()
          console.log('Tutoriais recebidos:', tutoriaisData)
          setTutoriais(tutoriaisData.data || [])
        } else {
          console.error('Erro ao carregar tutoriais:', tutoriaisRes.status, tutoriaisRes.statusText)
        }

      } catch (error: any) {
        console.error('Erro ao carregar formação:', error)
        setErro('Erro ao carregar conteúdo')
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {erro && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <p className="text-red-800">{erro}</p>
          </div>
        )}

        {/* Introdução Oficial do Método YLADA - Sempre visível */}
        <MetodoYLADAIntro />

        <FormacaoTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {carregando ? (
          <div className="space-y-6">
            {/* Skeleton Loaders */}
            {activeTab === 'jornada' && (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            )}
            {activeTab === 'trilhas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'microcursos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'biblioteca' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'tutoriais' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {activeTab === 'jornada' && (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <div className="text-6xl mb-4">🗺️</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Jornada YLADA de 30 Dias</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Sua transformação passo a passo, dia a dia, organizada e guiada.
                </p>
                <p className="text-gray-500">
                  A Jornada de 30 Dias está sendo preparada e estará disponível em breve.
                </p>
                <p className="text-sm text-gray-400 mt-4">
                  Enquanto isso, explore os Pilares, Exercícios e Ferramentas do Método YLADA.
                </p>
              </div>
            )}
            {activeTab === 'trilhas' && <TrilhasSection trilhas={trilhas} />}
            {activeTab === 'microcursos' && <MicrocursosSection microcursos={microcursos} />}
            {activeTab === 'biblioteca' && <BibliotecaSection biblioteca={biblioteca} />}
            {activeTab === 'tutoriais' && <TutoriaisSection tutoriais={tutoriais} />}
          </>
        )}
      </div>
    </div>
  )
}

