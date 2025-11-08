'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCursoModulo, WellnessModuloTopico, WellnessCursoMaterial } from '@/types/wellness-cursos'

const supabase = createClient()

type ModuloCompleto = WellnessCursoModulo & {
  topicos?: (WellnessModuloTopico & {
    cursos?: WellnessCursoMaterial[]
  })[]
}

export default function WellnessCursosPage() {
  const { user } = useAuth()
  const [modulos, setModulos] = useState<ModuloCompleto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarModulos()
  }, [])

  const carregarModulos = async () => {
    try {
      setLoading(true)
      
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setLoading(false)
        return
      }

      // Buscar módulos da biblioteca
      const modulosResponse = await fetch('/api/wellness/modulos', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!modulosResponse.ok) {
        throw new Error('Erro ao carregar módulos')
      }

      const modulosData = await modulosResponse.json()
      const modulosList = modulosData.modulos || []

      // Para cada módulo, carregar tópicos e materiais
      const modulosCompletos = await Promise.all(
        modulosList.map(async (modulo: WellnessCursoModulo) => {
          // Carregar tópicos
          const topicosResponse = await fetch(`/api/wellness/modulos/${modulo.id}/topicos`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })

          let topicos: (WellnessModuloTopico & { cursos?: WellnessCursoMaterial[] })[] = []
          
          if (topicosResponse.ok) {
            const topicosData = await topicosResponse.json()
            topicos = await Promise.all(
              (topicosData.topicos || []).map(async (topico: WellnessModuloTopico) => {
                // Carregar materiais do tópico
                const materiaisResponse = await fetch(`/api/wellness/modulos/${modulo.id}/topicos/${topico.id}/cursos`, {
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`
                  }
                })

                let cursos: WellnessCursoMaterial[] = []
                if (materiaisResponse.ok) {
                  const materiaisData = await materiaisResponse.json()
                  cursos = materiaisData.cursos || []
                }

                return { ...topico, cursos }
              })
            )
          }

          return { ...modulo, topicos }
        })
      )

      setModulos(modulosCompletos)
    } catch (error: any) {
      console.error('Erro ao carregar módulos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calcular total de materiais em um módulo
  const calcularTotalMateriais = (modulo: ModuloCompleto) => {
    return modulo.topicos?.reduce((acc, topico) => {
      return acc + (topico.cursos?.length || 0)
    }, 0) || 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Cursos" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">📚 Biblioteca de Conteúdo</h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Acesse materiais práticos, vídeos e documentos para seu desenvolvimento pessoal
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando conteúdo...</p>
          </div>
        )}

        {/* Grid de Módulos */}
        {!loading && (
          <>
            {modulos.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <div className="text-6xl mb-4">📚</div>
                <p className="text-gray-500 text-lg mb-2">Nenhum conteúdo disponível no momento.</p>
                <p className="text-gray-400 text-sm">Novos materiais serão adicionados em breve.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {modulos.map((modulo) => {
                  const totalMateriais = calcularTotalMateriais(modulo)
                  const totalTopicos = modulo.topicos?.length || 0
                  
                  return (
                    <Link
                      key={modulo.id}
                      href={`/pt/wellness/modulos/${modulo.id}`}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-green-300 transition-all group active:scale-[0.98]"
                    >
                      {/* Thumbnail */}
                      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-green-400 to-emerald-600 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl sm:text-6xl">📚</span>
                        </div>
                        {/* Overlay no hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                          {modulo.titulo}
                        </h3>
                        {modulo.descricao && (
                          <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                            {modulo.descricao}
                          </p>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-2 border-t border-gray-100">
                          <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                            <span>{totalTopicos} {totalTopicos === 1 ? 'tópico' : 'tópicos'}</span>
                            <span>•</span>
                            <span>{totalMateriais} {totalMateriais === 1 ? 'material' : 'materiais'}</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-green-600 group-hover:text-green-700 transition-colors">
                            Acessar →
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
