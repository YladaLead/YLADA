'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Cartilha {
  id: string
  codigo: string
  titulo: string
  descricao?: string
  url: string
  tags?: string[]
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function BibliotecaCartilhasPage() {
  return (
    <ConditionalWellnessSidebar>
      <BibliotecaCartilhasContent />
    </ConditionalWellnessSidebar>
  )
}

function BibliotecaCartilhasContent() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [cartilhas, setCartilhas] = useState<Cartilha[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarCartilhas = async () => {
      try {
        setLoading(true)
        // Buscar apenas PDFs de ferramentas (calculadoras, quizzes, guias práticos)
        const response = await authenticatedFetch('/api/wellness/biblioteca/materiais?categoria=cartilha&tipo=pdf', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            // Filtrar PDFs de ferramentas E PDFs de treinamento/cursos migrados
            // Excluir PDFs de scripts e aulas
            const cartilhasFiltradas = (data.data || []).filter((cartilha: Cartilha) => {
              const codigo = cartilha.codigo.toLowerCase()
              const titulo = cartilha.titulo.toLowerCase()
              const tags = (cartilha.tags || []).map((t: string) => t.toLowerCase())
              
              // Incluir: calculadoras, quizzes, composição, planejador
              const isFerramenta = 
                codigo.includes('calculadora') ||
                codigo.includes('quiz') ||
                codigo.includes('composicao') ||
                codigo.includes('planejador') ||
                titulo.includes('calculadora') ||
                titulo.includes('quiz') ||
                titulo.includes('composição') ||
                titulo.includes('planejador')
              
              // Incluir: PDFs migrados de cursos (treinamento)
              const isTreinamento = 
                codigo.includes('pdf-curso-') ||
                tags.includes('treinamento') ||
                tags.includes('curso') ||
                tags.includes('migrado')
              
              // Excluir: scripts, aulas
              const isScriptOuAula = 
                codigo.includes('script') ||
                codigo.includes('aula') ||
                titulo.includes('script') ||
                titulo.includes('aula')
              
              return (isFerramenta || isTreinamento) && !isScriptOuAula
            })
            
            setCartilhas(cartilhasFiltradas)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar cartilhas:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarCartilhas()
  }, [authenticatedFetch])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando cartilhas...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/pt/wellness/biblioteca')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
          >
            ← Voltar para Biblioteca
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">📖 Cartilhas de Treinamento</h1>
          <p className="text-lg text-gray-600">
            Guias práticos de uso das ferramentas: calculadoras, quizzes e materiais para aplicar no dia a dia.
          </p>
        </div>

        {cartilhas.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 mb-4">Nenhuma cartilha encontrada.</p>
            <p className="text-sm text-gray-500">
              As cartilhas serão adicionadas em breve.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartilhas.map((cartilha) => (
              <div
                key={cartilha.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="text-5xl mb-4 text-center">📄</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{cartilha.titulo}</h3>
                  {cartilha.descricao && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{cartilha.descricao}</p>
                  )}
                  <div className="flex gap-2">
                    <a
                      href={cartilha.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                    >
                      📄 Abrir PDF
                    </a>
                    <a
                      href={cartilha.url}
                      download
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      ⬇️ Baixar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
