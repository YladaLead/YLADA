'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Lembrete {
  id: string
  titulo: string
  mensagem: string
  tipo: 'info' | 'success' | 'warning' | 'action'
  acao?: {
    texto: string
    rota: string
  }
  prioridade: 'baixa' | 'media' | 'alta'
}

export default function WellnessNotificacoes() {
  const [lembretes, setLembretes] = useState<Lembrete[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarTodas, setMostrarTodas] = useState(false)
  const router = useRouter()

  useEffect(() => {
    buscarLembretes()
  }, [])

  const buscarLembretes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wellness/lembretes', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar lembretes')
      }

      const data = await response.json()
      if (data.success && data.data.lembretes) {
        setLembretes(data.data.lembretes)
      }
    } catch (error) {
      console.error('Erro ao buscar lembretes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcao = (rota: string) => {
    router.push(rota)
  }

  const getTipoStyles = (tipo: Lembrete['tipo']) => {
    switch (tipo) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'action':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getTipoIcon = (tipo: Lembrete['tipo']) => {
    switch (tipo) {
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      case 'action':
        return '🎯'
      default:
        return 'ℹ️'
    }
  }

  if (loading) {
    return null
  }

  if (lembretes.length === 0) {
    return null
  }

  const lembretesParaMostrar = mostrarTodas ? lembretes : lembretes.slice(0, 3)

  return (
    <div className="mb-6 space-y-3">
      {lembretesParaMostrar.map((lembrete) => (
        <div
          key={lembrete.id}
          className={`rounded-lg border-2 p-4 ${getTipoStyles(lembrete.tipo)} transition-all hover:shadow-md`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{getTipoIcon(lembrete.tipo)}</span>
                <h3 className="font-bold text-sm sm:text-base">
                  {lembrete.titulo}
                </h3>
              </div>
              <p className="text-sm text-gray-700 mb-2">
                {lembrete.mensagem}
              </p>
              {lembrete.acao && (
                <button
                  onClick={() => handleAcao(lembrete.acao!.rota)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-current rounded-lg font-medium text-sm hover:bg-opacity-80 transition-colors"
                >
                  {lembrete.acao.texto}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                // Marcar como lido (pode implementar persistência depois)
                setLembretes(prev => prev.filter(l => l.id !== lembrete.id))
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar notificação"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
      
      {lembretes.length > 3 && !mostrarTodas && (
        <button
          onClick={() => setMostrarTodas(true)}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium py-2"
        >
          Ver mais {lembretes.length - 3} lembretes
        </button>
      )}
      
      {mostrarTodas && lembretes.length > 3 && (
        <button
          onClick={() => setMostrarTodas(false)}
          className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium py-2"
        >
          Mostrar menos
        </button>
      )}
    </div>
  )
}

