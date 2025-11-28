'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

interface Ticket {
  id: string
  assunto: string
  status: string
  prioridade: string
  categoria?: string
  user_name: string
  agent_name?: string
  created_at: string
  ultima_mensagem_em?: string
  mensagens_count: number
}

export default function TicketsNutriPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('todas')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/pt/nutri/dashboard')
      return
    }

    if (user) {
      loadTickets()
    }
  }, [user, authLoading, filterStatus])

  const loadTickets = async () => {
    try {
      setLoading(true)
      setError(null)

      const url = filterStatus === 'todas' 
        ? '/api/nutri/support/tickets'
        : `/api/nutri/support/tickets?status=${filterStatus}`

      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar tickets')
      }

      const data = await response.json()
      if (data.success) {
        setTickets(data.tickets || [])
      } else {
        throw new Error(data.error || 'Erro ao carregar tickets')
      }
    } catch (err: any) {
      console.error('Erro ao carregar tickets:', err)
      setError(err.message || 'Erro ao carregar tickets')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      aguardando: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-800' },
      em_atendimento: { label: 'Em Atendimento', color: 'bg-blue-100 text-blue-800' },
      resolvido: { label: 'Resolvido', color: 'bg-green-100 text-green-800' },
      fechado: { label: 'Fechado', color: 'bg-gray-100 text-gray-800' },
    }
    const badge = badges[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.label}
      </span>
    )
  }

  const getPriorityBadge = (prioridade: string) => {
    const badges: Record<string, { label: string; emoji: string; color: string }> = {
      baixa: { label: 'Baixa', emoji: '⚪', color: 'text-gray-600' },
      normal: { label: 'Normal', emoji: '🔵', color: 'text-blue-600' },
      alta: { label: 'Alta', emoji: '🟠', color: 'text-orange-600' },
      urgente: { label: 'Urgente', emoji: '🔴', color: 'text-red-600' },
    }
    const badge = badges[prioridade] || badges.normal
    return (
      <span className={`text-xs font-medium ${badge.color}`}>
        {badge.emoji} {badge.label}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-6">
              <Link href="/pt/nutri/dashboard">
                <Image
                  src="/images/logo/nutri-horizontal.png"
                  alt="Nutri by YLADA"
                  width={180}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Tickets de Suporte
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/pt/nutri/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Voltar ao Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filtrar por status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="aguardando">Aguardando</option>
              <option value="em_atendimento">Em Atendimento</option>
              <option value="resolvido">Resolvido</option>
              <option value="fechado">Fechado</option>
            </select>
            <button
              onClick={loadTickets}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Atualizar
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Lista de Tickets */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <p className="text-gray-600 text-lg">Nenhum ticket encontrado</p>
            <p className="text-gray-500 text-sm mt-2">
              {filterStatus === 'todas' 
                ? 'Não há tickets de suporte no momento.'
                : `Não há tickets com status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/pt/nutri/suporte/tickets/${ticket.id}`}
                  className="block p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {ticket.assunto || 'Sem assunto'}
                        </h3>
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.prioridade)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                        <span>👤 {ticket.user_name}</span>
                        {ticket.agent_name && (
                          <span>👨‍💼 Atendente: {ticket.agent_name}</span>
                        )}
                        <span>💬 {ticket.mensagens_count || 0} mensagens</span>
                        {ticket.categoria && (
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {ticket.categoria}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 ml-4">
                      <div>Criado em</div>
                      <div className="font-medium">{formatDate(ticket.created_at)}</div>
                      {ticket.ultima_mensagem_em && (
                        <>
                          <div className="mt-2">Última mensagem</div>
                          <div className="font-medium">{formatDate(ticket.ultima_mensagem_em)}</div>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

