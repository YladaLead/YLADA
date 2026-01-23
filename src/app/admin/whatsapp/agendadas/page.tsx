'use client'

import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

interface Agendada {
  id: string
  phone: string
  customer_name: string | null
  session: {
    id: string
    title: string
    date: string
    time: string
    weekday: string
    zoom_link: string
  } | null
  context?: any
}

function AgendadasContent() {
  const [loading, setLoading] = useState(true)
  const [agendadas, setAgendadas] = useState<Agendada[]>([])
  const [filtroData, setFiltroData] = useState('')
  const [filtroHora, setFiltroHora] = useState('')
  const [filtroSessionId, setFiltroSessionId] = useState('')
  const [sessoes, setSessoes] = useState<Array<{ id: string; title: string; starts_at: string }>>([])

  useEffect(() => {
    carregarSessoes()
    carregarAgendadas()
  }, [filtroData, filtroHora, filtroSessionId])

  const carregarSessoes = async () => {
    try {
      const response = await fetch('/api/admin/whatsapp/workshop-sessions?onlyActive=true', {
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setSessoes(data.sessions || [])
      }
    } catch (error) {
      console.error('Erro ao carregar sessões:', error)
    }
  }

  const carregarAgendadas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filtroData) params.set('data', filtroData)
      if (filtroHora) params.set('hora', filtroHora)
      if (filtroSessionId) params.set('session_id', filtroSessionId)

      const response = await fetch(`/api/admin/whatsapp/agendadas?${params.toString()}`, {
        credentials: 'include',
      })

      const data = await response.json()
      if (data.success) {
        setAgendadas(data.agendadas || [])
      }
    } catch (error) {
      console.error('Erro ao carregar agendadas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPhone = (phone: string) => {
    if (phone.length === 13 && phone.startsWith('55')) {
      const ddd = phone.substring(2, 4)
      const part1 = phone.substring(4, 9)
      const part2 = phone.substring(9)
      return `(${ddd}) ${part1}-${part2}`
    }
    return phone
  }

  // Agrupar por data/hora
  const agrupadas = agendadas.reduce((acc: Record<string, Agendada[]>, conv) => {
    if (!conv.session) return acc
    const key = `${conv.session.date} - ${conv.session.time}`
    if (!acc[key]) acc[key] = []
    acc[key].push(conv)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Agendadas para Aula</h1>
              <p className="text-sm text-gray-500 mt-1">Filtre por data, hora ou sessão</p>
            </div>
            <Link
              href="/admin/whatsapp"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                value={filtroHora}
                onChange={(e) => setFiltroHora(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sessão</label>
              <select
                value={filtroSessionId}
                onChange={(e) => setFiltroSessionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas</option>
                {sessoes.map((sess) => {
                  const date = new Date(sess.starts_at)
                  return (
                    <option key={sess.id} value={sess.id}>
                      {date.toLocaleDateString('pt-BR')} - {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando agendadas...</p>
          </div>
        ) : Object.keys(agrupadas).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma agendada encontrada</h3>
            <p className="text-sm text-gray-500">
              {filtroData || filtroHora || filtroSessionId
                ? 'Tente ajustar os filtros'
                : 'Ninguém agendou ainda'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(agrupadas).map(([key, convs]) => (
              <div key={key} className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📅 {key} ({convs.length} {convs.length === 1 ? 'pessoa' : 'pessoas'})
                </h2>
                <div className="space-y-3">
                  {convs.map((conv) => (
                    <div
                      key={conv.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {conv.customer_name || formatPhone(conv.phone)}
                        </p>
                        <p className="text-sm text-gray-500">{formatPhone(conv.phone)}</p>
                        {conv.session && (
                          <p className="text-xs text-gray-400 mt-1">
                            {conv.session.weekday} • {conv.session.title}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/admin/whatsapp?conversation=${conv.id}`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                      >
                        Ver Conversa
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AgendadasPage() {
  return (
    <AdminProtectedRoute>
      <AgendadasContent />
    </AdminProtectedRoute>
  )
}
