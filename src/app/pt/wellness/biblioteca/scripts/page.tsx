'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Script {
  id: string
  codigo: string
  titulo: string
  descricao?: string
  categoria: string
  texto: string
  tags?: string[]
}

export default function BibliotecaScriptsPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <BibliotecaScriptsContent />
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function BibliotecaScriptsContent() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [scriptSelecionado, setScriptSelecionado] = useState<Script | null>(null)

  useEffect(() => {
    const carregarScripts = async () => {
      try {
        setLoading(true)
        const url = filtroCategoria 
          ? `/api/wellness/biblioteca/scripts?categoria=${filtroCategoria}`
          : '/api/wellness/biblioteca/scripts'
        
        const response = await authenticatedFetch(url, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setScripts(data.data || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar scripts:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarScripts()
  }, [authenticatedFetch, filtroCategoria])

  const copiarScript = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      alert('Script copiado!')
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const enviarWhatsApp = (texto: string) => {
    const textoEncoded = encodeURIComponent(texto)
    window.open(`https://wa.me/?text=${textoEncoded}`, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando scripts...</p>
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">💬 Scripts Oficiais</h1>
          <p className="text-lg text-gray-600">
            Scripts prontos para usar em diferentes situações. O NOEL pode personalizar qualquer um deles.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroCategoria === ''
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {['convite', 'follow-up', 'apresentacao', 'fechamento', 'objecao', 'onboarding'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filtroCategoria === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Lista de Scripts */}
        {scripts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 mb-4">Nenhum script encontrado.</p>
            <p className="text-sm text-gray-500 mb-4">
              Os scripts serão adicionados em breve. Em caso de dúvidas, fale com o NOEL.
            </p>
            <button
              onClick={() => router.push('/pt/wellness/noel')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Falar com o NOEL
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{script.titulo}</h3>
                  {script.descricao && (
                    <p className="text-sm text-gray-600 mb-2">{script.descricao}</p>
                  )}
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize">
                    {script.categoria.replace('-', ' ')}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                    {script.texto}
                  </pre>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copiarScript(script.texto)}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📋 Copiar
                  </button>
                  <button
                    onClick={() => enviarWhatsApp(script.texto)}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    📱 WhatsApp
                  </button>
                  <button
                    onClick={() => router.push(`/pt/wellness/noel?personalizar=${encodeURIComponent(script.texto)}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    👤 NOEL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
