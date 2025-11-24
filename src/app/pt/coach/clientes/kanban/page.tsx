'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import KanbanConfigModal from '@/components/nutri/KanbanConfigModal'
import { useAuth } from '@/contexts/AuthContext'
import { displayPhoneWithFlag } from '@/utils/phoneFormatter'

interface Cliente {
  id: string
  name: string
  email: string | null
  phone: string | null
  status: string
  goal: string | null
  converted_from_lead: boolean
  lead_source: string | null
  created_at: string
  next_appointment?: string | null
  last_appointment?: string | null
  tags?: string[] | null
}

interface Column {
  id: string
  value: string
  label: string
  description: string
  color: string
  order: number
}

interface CardField {
  field: string
  visible: boolean
}

interface QuickAction {
  action: string
  visible: boolean
}

const defaultColumns: Column[] = [
  { id: 'lead', value: 'lead', label: 'Contato', description: 'Entrou agora, precisa de acolhimento', color: 'border-purple-200 bg-purple-50', order: 1 },
  { id: 'pre_consulta', value: 'pre_consulta', label: 'Pré-Consulta', description: 'Já falou com você, falta agendar', color: 'border-yellow-200 bg-yellow-50', order: 2 },
  { id: 'ativa', value: 'ativa', label: 'Ativa', description: 'Em atendimento e com plano ativo', color: 'border-green-200 bg-green-50', order: 3 },
  { id: 'pausa', value: 'pausa', label: 'Pausa', description: 'Deu um tempo, precisa nutrir relação', color: 'border-orange-200 bg-orange-50', order: 4 },
  { id: 'finalizada', value: 'finalizada', label: 'Finalizada', description: 'Concluiu o ciclo com você', color: 'border-gray-200 bg-gray-50', order: 5 }
]

function useStatusHelpers() {
  const badgeClasses: Record<string, string> = {
    lead: 'bg-purple-100 text-purple-800',
    pre_consulta: 'bg-yellow-100 text-yellow-800',
    ativa: 'bg-green-100 text-green-800',
    pausa: 'bg-orange-100 text-orange-800',
    finalizada: 'bg-gray-200 text-gray-700'
  }
  return {
    getStatusBadge: (status: string) => badgeClasses[status] || 'bg-gray-200 text-gray-700'
  }
}

function ClienteCard({ 
  cliente, 
  cardFields, 
  quickActions 
}: { 
  cliente: Cliente
  cardFields: CardField[]
  quickActions: QuickAction[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useDraggable({
    id: cliente.id,
    data: { status: cliente.status }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1
  }

  const { getStatusBadge } = useStatusHelpers()

  const showField = (field: string) => {
    const fieldConfig = cardFields.find(f => f.field === field)
    return fieldConfig?.visible !== false
  }

  const showAction = (action: string) => {
    const actionConfig = quickActions.find(a => a.action === action)
    return actionConfig?.visible !== false
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      lead: 'Contato',
      pre_consulta: 'Pré-Consulta',
      ativa: 'Ativa',
      pausa: 'Pausa',
      finalizada: 'Finalizada'
    }
    return statusMap[status] || status
  }

  return (
    <div
      ref={setNodeRef}
      style={style as CSSProperties}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">{cliente.name}</h3>
          {showField('telefone') && cliente.phone && (
            <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
              {displayPhoneWithFlag(cliente.phone)}
            </p>
          )}
          {showField('email') && cliente.email && (
            <p className="text-xs text-gray-500 mt-1">{cliente.email}</p>
          )}
        </div>
        {showField('status_badge') && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${getStatusBadge(cliente.status)}`}>
            {getStatusLabel(cliente.status)}
          </span>
        )}
      </div>

      {showField('objetivo') && cliente.goal && (
        <p className="text-xs text-gray-700 mt-3 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-2">
          🎯 {cliente.goal}
        </p>
      )}

      {showField('proxima_consulta') && cliente.next_appointment && (
        <p className="text-xs text-gray-600 mt-2">
          📅 Próxima: {new Date(cliente.next_appointment).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      )}

      {showField('ultima_consulta') && cliente.last_appointment && (
        <p className="text-xs text-gray-500 mt-1">
          🕐 Última: {new Date(cliente.last_appointment).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
          })}
        </p>
      )}

      {showField('tags') && cliente.tags && cliente.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {cliente.tags.map((tag, idx) => (
            <span key={idx} className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
        <span>
          {new Date(cliente.created_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short'
          })}
        </span>
        <div className="flex items-center gap-2">
          {showAction('whatsapp') && cliente.phone && (
            <a
              href={`https://wa.me/${cliente.phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700"
              onClick={(event) => event.stopPropagation()}
              title="WhatsApp"
            >
              💬
            </a>
          )}
          {showAction('ver_perfil') && (
            <Link
              href={`/pt/coach/clientes/${cliente.id}`}
              className="text-purple-600 font-medium hover:underline"
              onClick={(event) => event.stopPropagation()}
            >
              Ver perfil
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({
  status,
  label,
  description,
  color,
  clientes,
  cardFields,
  quickActions
}: {
  status: string
  label: string
  description: string
  color: string
  clientes: Cliente[]
  cardFields: CardField[]
  quickActions: QuickAction[]
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status }
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-2xl border bg-white ${color} ${isOver ? 'ring-2 ring-purple-400 ring-offset-1' : ''} min-h-[500px]`}
    >
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{label}</h2>
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          </div>
          <span className="text-xs font-semibold text-gray-600 bg-white/70 px-2 py-1 rounded-full">
            {clientes.length}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {clientes.length === 0 ? (
          <div className="text-center text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg py-6 px-3 bg-white/70">
            Arraste alguém para cá
          </div>
        ) : (
          clientes.map((cliente) => (
            <ClienteCard 
              key={cliente.id} 
              cliente={cliente}
              cardFields={cardFields}
              quickActions={quickActions}
            />
          ))
        )}
      </div>
    </div>
  )
}

function KanbanContent() {
  const { user, loading } = useAuth()
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeClient, setActiveClient] = useState<Cliente | null>(null)
  const [atualizacaoPendente, setAtualizacaoPendente] = useState<string | null>(null)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [columns, setColumns] = useState<Column[]>(defaultColumns)
  const [cardFields, setCardFields] = useState<CardField[]>([])
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [carregandoConfig, setCarregandoConfig] = useState(true)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  // Carregar configuração do Kanban
  useEffect(() => {
    if (!user) return

    const carregarConfig = async () => {
      try {
        setCarregandoConfig(true)
        const response = await fetch('/api/c/kanban/config', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.config) {
            const config = data.data.config
            setColumns(config.columns || defaultColumns)
            setCardFields(config.card_fields || [])
            setQuickActions(config.quick_actions || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar config do Kanban:', error)
      } finally {
        setCarregandoConfig(false)
      }
    }

    carregarConfig()
  }, [user])

  // Carregar clientes
  useEffect(() => {
    if (!user) return

    const carregarClientes = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const params = new URLSearchParams()
        params.append('limit', '200')
        params.append('order_by', 'created_at')
        params.append('order', 'asc')

        const response = await fetch(`/api/c/clientes?${params.toString()}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao carregar clientes' }))
          throw new Error(errorData.error || 'Erro ao carregar clientes')
        }

        const data = await response.json()
        if (data.success && data.data?.clients) {
          setClientes(data.data.clients)
        } else {
          setClientes([])
        }
      } catch (error: any) {
        console.error('Erro ao carregar clientes na visão Kanban:', error)
        setErro(error.message || 'Erro ao carregar clientes')
      } finally {
        setCarregando(false)
      }
    }

    carregarClientes()
  }, [user])

  // Salvar configuração
  const handleSaveConfig = async (config: { columns: Column[], card_fields: CardField[], quick_actions: QuickAction[] }) => {
    try {
      const response = await fetch('/api/c/kanban/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config),
        credentials: 'include'
      })

      if (response.ok) {
        setColumns(config.columns)
        setCardFields(config.card_fields)
        setQuickActions(config.quick_actions)
      }
    } catch (error) {
      console.error('Erro ao salvar config do Kanban:', error)
      alert('Erro ao salvar configuração. Tente novamente.')
    }
  }

  const clientesFiltrados = useMemo(() => {
    if (!busca) return clientes
    const termo = busca.toLowerCase().trim()
    return clientes.filter((cliente) => {
      const alvo = `${cliente.name || ''} ${cliente.email || ''} ${cliente.phone || ''}`.toLowerCase()
      return alvo.includes(termo)
    })
  }, [clientes, busca])

  const clientesPorStatus = useMemo(() => {
    // Ordenar colunas por order
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    return sortedColumns.map((coluna) => ({
      ...coluna,
      clientes: clientesFiltrados.filter((cliente) => cliente.status === coluna.value)
    }))
  }, [clientesFiltrados, columns])

  const handleDragStart = (event: DragStartEvent) => {
    const clientId = event.active.id as string
    const cliente = clientes.find((c) => c.id === clientId)
    setActiveClient(cliente || null)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveClient(null)
    const { active, over } = event
    if (!over) return

    const clientId = active.id as string
    const targetStatus = over.data?.current?.status

    if (!targetStatus) return

    const clienteAtual = clientes.find((c) => c.id === clientId)
    if (!clienteAtual || clienteAtual.status === targetStatus) return

    const estadoAnterior = clienteAtual.status

    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.id === clientId ? { ...cliente, status: targetStatus } : cliente
      )
    )

    setAtualizacaoPendente(clientId)

    try {
      const response = await fetch(`/api/c/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: targetStatus })
      })

      if (!response.ok) {
        throw new Error('Não foi possível atualizar o status')
      }

    } catch (error: any) {
      console.error('Erro ao atualizar status via Kanban:', error)
      setClientes((prev) =>
        prev.map((cliente) =>
          cliente.id === clientId ? { ...cliente, status: estadoAnterior } : cliente
        )
      )
      setErro('Não conseguimos mover essa cliente agora. Tente novamente em instantes.')
    } finally {
      setAtualizacaoPendente(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalClientes = clientesFiltrados.length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Kanban de Clientes</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kanban de Clientes</h1>
              <p className="text-gray-600 mt-1">
                Arraste cada cliente para o estágio onde ela está hoje. Linguagem simples para seu fluxo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setConfigModalOpen(true)}
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ⚙️ Customizar
              </button>
              <Link
                href="/pt/coach/clientes"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ← Voltar para lista
              </Link>
              <Link
                href="/pt/coach/clientes/novo"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                ➕ Novo Cliente
              </Link>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Total nesta visão</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalClientes}</p>
            </div>
            <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Ativos e atentos</p>
              <p className="text-3xl font-bold text-green-700 mt-1">
                {clientesFiltrados.filter((cliente) => cliente.status === 'ativa').length}
              </p>
            </div>
            <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Novos contatos</p>
              <p className="text-3xl font-bold text-purple-700 mt-1">
                {clientesFiltrados.filter((cliente) => cliente.status === 'lead').length}
              </p>
            </div>
          </div>

          <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <label htmlFor="busca" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por nome, telefone ou email
            </label>
            <input
              id="busca"
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: Maria, 11 9999..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-800">
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando quadro...</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveClient(null)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
                {clientesPorStatus.map((coluna) => (
                  <KanbanColumn
                    key={coluna.value}
                    status={coluna.value}
                    label={coluna.label}
                    description={coluna.description}
                    color={coluna.color}
                    clientes={coluna.clientes}
                    cardFields={cardFields}
                    quickActions={quickActions}
                  />
                ))}
              </div>

              <DragOverlay>
                {activeClient ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-lg w-64">
                    <p className="text-sm font-semibold text-gray-900">{activeClient.name}</p>
                    {activeClient.goal && (
                      <p className="text-xs text-gray-600 mt-2">🎯 {activeClient.goal}</p>
                    )}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}

          {atualizacaoPendente && (
            <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg">
              Salvando mudança...
            </div>
          )}
        </div>
      </div>

      {/* Modal de Configuração */}
      <KanbanConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onSave={handleSaveConfig}
        initialConfig={{
          columns,
          card_fields: cardFields,
          quick_actions: quickActions
        }}
      />
    </div>
  )
}

export default function KanbanClientesPage() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <KanbanContent />
    </ProtectedRoute>
  )
}


