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
import NutriSidebar from '@/components/nutri/NutriSidebar'
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
  { id: 'lead', value: 'lead', label: 'Contato', description: 'Entrou agora, precisa de acolhimento', color: 'border-blue-300 bg-blue-50', order: 1 },
  { id: 'pre_consulta', value: 'pre_consulta', label: 'Pré-Consulta', description: 'Já falou com você, falta agendar', color: 'border-yellow-300 bg-yellow-50', order: 2 },
  { id: 'ativa', value: 'ativa', label: 'Ativa', description: 'Em atendimento e com plano ativo', color: 'border-green-300 bg-green-50', order: 3 },
  { id: 'pausa', value: 'pausa', label: 'Pausa', description: 'Deu um tempo, precisa nutrir relação', color: 'border-orange-300 bg-orange-50', order: 4 },
  { id: 'finalizada', value: 'finalizada', label: 'Finalizada', description: 'Concluiu o ciclo com você', color: 'border-gray-300 bg-gray-50', order: 5 }
]

function AddClientForm({ 
  status, 
  onSave, 
  onCancel 
}: { 
  status: string
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    phone_country_code: 'BR',
    birth_date: '',
    gender: '',
    cpf: '',
    status: status,
    goal: '',
    instagram: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipcode: ''
    }
  })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setErro('Nome é obrigatório')
      return
    }

    setSalvando(true)
    setErro(null)
    try {
      await onSave(formData)
    } catch (error: any) {
      setErro(error.message || 'Erro ao salvar cliente')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-800">{erro}</p>
        </div>
      )}

      {/* Dados Pessoais */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Dados Pessoais</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome completo"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Gênero
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="feminino">Feminino</option>
                <option value="masculino">Masculino</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              CPF
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contato */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Contato</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="11 99999-9999"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@usuario"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Endereço</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Rua
            </label>
            <input
              type="text"
              name="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Número
              </label>
              <input
                type="text"
                name="address.number"
                value={formData.address.number}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Complemento
              </label>
              <input
                type="text"
                name="address.complement"
                value={formData.address.complement}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <input
              type="text"
              name="address.neighborhood"
              value={formData.address.neighborhood}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="SP"
                maxLength={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              CEP
            </label>
            <input
              type="text"
              name="address.zipcode"
              value={formData.address.zipcode}
              onChange={handleChange}
              placeholder="00000-000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Status e Objetivo */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Status e Objetivo</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="lead">Contato</option>
              <option value="pre_consulta">Pré-Consulta</option>
              <option value="ativa">Ativa</option>
              <option value="pausa">Pausa</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Objetivo da Cliente
            </label>
            <textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              rows={3}
              placeholder="Descreva o objetivo principal da cliente..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={!formData.name.trim() || salvando}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {salvando ? 'Salvando...' : 'Salvar Cliente'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

function useStatusHelpers() {
  const badgeClasses: Record<string, string> = {
    lead: 'bg-blue-100 text-blue-800',
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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: cliente.id,
    data: { status: cliente.status }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
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
      className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing`}
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
            <span key={idx} className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
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
              href={`/pt/nutri/clientes/${cliente.id}`}
              className="text-blue-600 font-medium hover:underline"
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
  quickActions,
  onAddClient,
  onEditColumn,
  onDeleteColumn,
  isEditing,
  onSaveEdit,
  onCancelEdit
}: {
  status: string
  label: string
  description: string
  color: string
  clientes: Cliente[]
  cardFields: CardField[]
  quickActions: QuickAction[]
  onAddClient: (status: string) => void
  onEditColumn: (status: string) => void
  onDeleteColumn: (status: string) => void
  isEditing?: boolean
  onSaveEdit?: (label: string, description: string) => void
  onCancelEdit?: () => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${status}`,
    data: { status }
  })

  const isDefaultColumn = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada'].includes(status)
  const [editLabel, setEditLabel] = useState(label)
  const [editDescription, setEditDescription] = useState(description)

  useEffect(() => {
    if (isEditing) {
      setEditLabel(label)
      setEditDescription(description)
    }
  }, [isEditing, label, description])

  // Extrair a cor da borda e do fundo
  const borderColor = color.split(' ')[0] // ex: border-blue-300
  const bgColor = color.split(' ')[1] || 'bg-white' // ex: bg-blue-50
  
  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg ${borderColor} ${bgColor} ${isOver ? 'ring-2 ring-blue-400 ring-offset-1' : ''} min-h-[500px] w-[280px] flex-shrink-0 shadow-sm`}
    >
      <div className={`px-3 py-2 border-b ${borderColor} bg-white/60 backdrop-blur-sm`}>
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="w-full px-2 py-1 text-sm font-semibold border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nome da coluna"
              autoFocus
            />
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição (opcional)"
            />
            <div className="flex gap-1">
              <button
                onClick={() => onSaveEdit && onSaveEdit(editLabel, editDescription)}
                className="flex-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Salvar
              </button>
              <button
                onClick={() => {
                  setEditLabel(label)
                  setEditDescription(description)
                  onCancelEdit && onCancelEdit()
                }}
                className="px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-sm font-semibold text-gray-900 truncate">{label}</h2>
                <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-0.5 rounded-full flex-shrink-0">
                  ({clientes.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <select className="text-xs text-gray-600 border-none bg-transparent cursor-pointer hover:text-gray-900">
                  <option>A-Z</option>
                  <option>Z-A</option>
                  <option>Mais recente</option>
                  <option>Mais antigo</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => onEditColumn(status)}
                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                title="Editar coluna"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              {!isDefaultColumn && (
                <button
                  onClick={() => onDeleteColumn(status)}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remover coluna"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        <button
          onClick={() => onAddClient(status)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2 px-3 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          + Adicionar Cliente
        </button>

        {clientes.length === 0 ? (
          <div className="text-center text-xs text-gray-500 border border-dashed border-gray-300 rounded-lg py-8 px-3 bg-gray-50">
            <p className="mb-2">Nenhum cliente nesta coluna</p>
            <p className="text-[10px]">Clique em "Adicionar Cliente" acima</p>
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
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [clientStatusToAdd, setClientStatusToAdd] = useState<string | null>(null)
  const [showNewColumnForm, setShowNewColumnForm] = useState(false)
  const [newColumnLabel, setNewColumnLabel] = useState('')
  const [newColumnDescription, setNewColumnDescription] = useState('')
  const [editingColumn, setEditingColumn] = useState<string | null>(null)
  const [editingColumnLabel, setEditingColumnLabel] = useState('')
  const [editingColumnDescription, setEditingColumnDescription] = useState('')

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
        const response = await fetch('/api/nutri/kanban/config', {
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

        const response = await fetch(`/api/nutri/clientes?${params.toString()}`, {
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
      const response = await fetch('/api/nutri/kanban/config', {
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

  // Adicionar cliente na coluna
  const handleAddClient = (status: string) => {
    setClientStatusToAdd(status)
    setShowAddClientModal(true)
  }

  // Criar novo cliente
  const handleCreateClient = async (clientData: any) => {
    try {
      const response = await fetch('/api/nutri/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(clientData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar cliente')
      }

      if (data.success) {
        // Recarregar clientes
        const reloadResponse = await fetch(`/api/nutri/clientes?limit=200&order_by=created_at&order=asc`, {
          credentials: 'include'
        })
        if (reloadResponse.ok) {
          const reloadData = await reloadResponse.json()
          if (reloadData.success && reloadData.data?.clients) {
            setClientes(reloadData.data.clients)
          }
        }
        setShowAddClientModal(false)
        setClientStatusToAdd(null)
      }
    } catch (error: any) {
      console.error('Erro ao criar cliente:', error)
      throw error
    }
  }

  // Adicionar nova coluna
  const handleAddColumn = () => {
    if (!newColumnLabel.trim()) return

    const newColumn: Column = {
      id: `custom-${Date.now()}`,
      value: `custom_${Date.now()}`,
      label: newColumnLabel,
      description: newColumnDescription || '',
      color: 'border-purple-300 bg-purple-50',
      order: columns.length + 1
    }

    const updatedColumns = [...columns, newColumn]
    handleSaveConfig({
      columns: updatedColumns,
      card_fields: cardFields,
      quick_actions: quickActions
    })
    
    setNewColumnLabel('')
    setNewColumnDescription('')
    setShowNewColumnForm(false)
  }

  // Editar coluna
  const handleEditColumn = (status: string) => {
    setEditingColumn(status)
    const column = columns.find(c => c.value === status)
    if (column) {
      setEditingColumnLabel(column.label)
      setEditingColumnDescription(column.description)
    }
  }

  // Salvar edição de coluna (inline)
  const handleSaveColumnEdit = (label: string, description: string) => {
    if (!label.trim() || !editingColumn) return

    const updatedColumns = columns.map(col => 
      col.value === editingColumn
        ? { ...col, label: label.trim(), description: description.trim() }
        : col
    )

    handleSaveConfig({
      columns: updatedColumns,
      card_fields: cardFields,
      quick_actions: quickActions
    })

    setEditingColumn(null)
    setEditingColumnLabel('')
    setEditingColumnDescription('')
  }

  // Cancelar edição de coluna
  const handleCancelColumnEdit = () => {
    setEditingColumn(null)
    setEditingColumnLabel('')
    setEditingColumnDescription('')
  }

  // Remover coluna
  const handleDeleteColumn = async (status: string) => {
    if (!confirm('Tem certeza que deseja remover esta coluna? Os clientes serão movidos para a coluna "Contato".')) {
      return
    }

    // Mover clientes para 'lead'
    const clientesNaColuna = clientes.filter(c => c.status === status)
    for (const cliente of clientesNaColuna) {
      try {
        await fetch(`/api/nutri/clientes/${cliente.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ status: 'lead' })
        })
      } catch (error) {
        console.error('Erro ao mover cliente:', error)
      }
    }

    // Remover coluna
    const updatedColumns = columns.filter(c => c.value !== status)
    handleSaveConfig({
      columns: updatedColumns,
      card_fields: cardFields,
      quick_actions: quickActions
    })

    // Recarregar clientes
    const reloadResponse = await fetch(`/api/nutri/clientes?limit=200&order_by=created_at&order=asc`, {
      credentials: 'include'
    })
    if (reloadResponse.ok) {
      const reloadData = await reloadResponse.json()
      if (reloadData.success && reloadData.data?.clients) {
        setClientes(reloadData.data.clients)
      }
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
      const response = await fetch(`/api/nutri/clientes/${clientId}`, {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
      <NutriSidebar
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
                ⚙️ Personalizar Cards
              </button>
              <Link
                href="/pt/nutri/clientes"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ← Voltar para lista
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
            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">Novos contatos</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {erro && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-sm text-red-800">
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando quadro...</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveClient(null)}
            >
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-max">
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
                      onAddClient={handleAddClient}
                      onEditColumn={handleEditColumn}
                      onDeleteColumn={handleDeleteColumn}
                      isEditing={editingColumn === coluna.value}
                      onSaveEdit={handleSaveColumnEdit}
                      onCancelEdit={handleCancelColumnEdit}
                    />
                  ))}
                  
                  {/* Botão para adicionar nova coluna */}
                  {showNewColumnForm ? (
                    <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-4 w-[280px] flex-shrink-0 min-h-[500px]">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nome da Coluna *
                          </label>
                          <input
                            type="text"
                            value={newColumnLabel}
                            onChange={(e) => setNewColumnLabel(e.target.value)}
                            placeholder="Ex: Em Análise"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Descrição
                          </label>
                          <textarea
                            value={newColumnDescription}
                            onChange={(e) => setNewColumnDescription(e.target.value)}
                            placeholder="Ex: Aguardando avaliação inicial"
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              if (editingColumn) {
                                handleSaveColumnEdit(newColumnLabel, newColumnDescription)
                              } else {
                                handleAddColumn()
                              }
                            }}
                            disabled={!newColumnLabel.trim()}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editingColumn ? 'Salvar' : 'Criar Coluna'}
                          </button>
                          <button
                            onClick={() => {
                              setShowNewColumnForm(false)
                              setEditingColumn(null)
                              setNewColumnLabel('')
                              setNewColumnDescription('')
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowNewColumnForm(true)
                        setEditingColumn(null)
                        setNewColumnLabel('')
                        setNewColumnDescription('')
                      }}
                      className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-4 w-[280px] flex-shrink-0 min-h-[500px] flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-sm font-medium">Nova Coluna</span>
                    </button>
                  )}
                </div>
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

          {/* Modal para adicionar cliente */}
          {showAddClientModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-xl font-semibold text-gray-900">Adicionar Novo Cliente</h3>
                  <p className="text-sm text-gray-600 mt-1">Preencha os dados do cliente para sincronização completa</p>
                </div>
                <div className="px-6 py-4 overflow-y-auto flex-1">
                  <AddClientForm
                    status={clientStatusToAdd || 'lead'}
                    onSave={handleCreateClient}
                    onCancel={() => {
                      setShowAddClientModal(false)
                      setClientStatusToAdd(null)
                    }}
                  />
                </div>
              </div>
            </div>
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
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <KanbanContent />
    </ProtectedRoute>
  )
}


