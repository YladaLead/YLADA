'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

interface KanbanConfigModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: { columns: Column[], card_fields: CardField[], quick_actions: QuickAction[] }) => void
  initialConfig?: {
    columns: Column[]
    card_fields: CardField[]
    quick_actions: QuickAction[]
  }
}

// Campos padrão do card
const defaultCardFields: CardField[] = [
  { field: 'telefone', visible: true },
  { field: 'email', visible: false },
  { field: 'objetivo', visible: true },
  { field: 'proxima_consulta', visible: true },
  { field: 'ultima_consulta', visible: true },
  { field: 'tags', visible: false },
  { field: 'status_badge', visible: true }
]

// Ações rápidas padrão
const defaultQuickActions: QuickAction[] = [
  { action: 'whatsapp', visible: true },
  { action: 'ver_perfil', visible: true }
]

export default function KanbanConfigModal({
  isOpen,
  onClose,
  onSave,
  initialConfig
}: KanbanConfigModalProps) {
  const [columns, setColumns] = useState<Column[]>(initialConfig?.columns || [])
  const [cardFields, setCardFields] = useState<CardField[]>(
    initialConfig?.card_fields && initialConfig.card_fields.length > 0 
      ? initialConfig.card_fields 
      : defaultCardFields
  )
  const [quickActions, setQuickActions] = useState<QuickAction[]>(
    initialConfig?.quick_actions && initialConfig.quick_actions.length > 0
      ? initialConfig.quick_actions
      : defaultQuickActions
  )
  const [newColumnLabel, setNewColumnLabel] = useState('')
  const [newColumnDescription, setNewColumnDescription] = useState('')
  const [newColumnColor, setNewColumnColor] = useState('border-blue-300 bg-blue-50')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (isOpen) {
      if (initialConfig) {
        setColumns(initialConfig.columns || [])
        setCardFields(
          initialConfig.card_fields && initialConfig.card_fields.length > 0
            ? initialConfig.card_fields
            : defaultCardFields
        )
        setQuickActions(
          initialConfig.quick_actions && initialConfig.quick_actions.length > 0
            ? initialConfig.quick_actions
            : defaultQuickActions
        )
      } else {
        // Se não houver initialConfig, usar padrões
        setCardFields(defaultCardFields)
        setQuickActions(defaultQuickActions)
      }
    }
  }, [isOpen, initialConfig])

  const handleAddColumn = () => {
    if (!newColumnLabel.trim()) return

    const newColumn: Column = {
      id: `custom-${Date.now()}`,
      value: `custom_${Date.now()}`,
      label: newColumnLabel,
      description: newColumnDescription || '',
      color: newColumnColor,
      order: columns.length + 1
    }

    setColumns([...columns, newColumn])
    setNewColumnLabel('')
    setNewColumnDescription('')
    setNewColumnColor('border-blue-300 bg-blue-50')
  }

  const handleRemoveColumn = (columnId: string) => {
    // Não permitir remover se for uma das colunas padrão essenciais
    const defaultColumns = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada']
    const column = columns.find(c => c.id === columnId)
    if (column && defaultColumns.includes(column.value)) {
      alert('Não é possível remover colunas padrão do sistema.')
      return
    }
    setColumns(columns.filter(c => c.id !== columnId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = columns.findIndex(c => c.id === active.id)
    const newIndex = columns.findIndex(c => c.id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newColumns = [...columns]
    const [removed] = newColumns.splice(oldIndex, 1)
    newColumns.splice(newIndex, 0, removed)

    // Atualizar ordem
    const reordered = newColumns.map((col, index) => ({
      ...col,
      order: index + 1
    }))

    setColumns(reordered)
  }

  const handleSave = () => {
    onSave({
      columns,
      card_fields: cardFields,
      quick_actions: quickActions
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Customizar Kanban</h2>
          <p className="text-gray-600 mt-1">Personalize suas colunas e campos do card</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Seção: Colunas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Colunas</h3>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={columns.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {columns.map((column) => (
                    <SortableColumnItem
                      key={column.id}
                      column={column}
                      onRemove={handleRemoveColumn}
                      onUpdate={(id, updates) => {
                        setColumns(columns.map(c => c.id === id ? { ...c, ...updates } : c))
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {/* Adicionar Nova Coluna */}
            <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Adicionar Nova Coluna</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newColumnLabel}
                  onChange={(e) => setNewColumnLabel(e.target.value)}
                  placeholder="Nome da coluna (ex: Aguardando Exames)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={newColumnDescription}
                  onChange={(e) => setNewColumnDescription(e.target.value)}
                  placeholder="Descrição (opcional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={newColumnColor}
                  onChange={(e) => setNewColumnColor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="border-blue-300 bg-blue-50">Azul Suave</option>
                  <option value="border-green-300 bg-green-50">Verde Suave</option>
                  <option value="border-yellow-300 bg-yellow-50">Amarelo Suave</option>
                  <option value="border-orange-300 bg-orange-50">Laranja Suave</option>
                  <option value="border-purple-300 bg-purple-50">Roxo Suave</option>
                  <option value="border-pink-300 bg-pink-50">Rosa Suave</option>
                  <option value="border-cyan-300 bg-cyan-50">Ciano Suave</option>
                  <option value="border-teal-300 bg-teal-50">Verde-Água Suave</option>
                  <option value="border-indigo-300 bg-indigo-50">Índigo Suave</option>
                  <option value="border-gray-300 bg-gray-50">Cinza Suave</option>
                </select>
                <button
                  onClick={handleAddColumn}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ➕ Adicionar Coluna
                </button>
              </div>
            </div>
          </div>

          {/* Seção: Campos do Card */}
          <div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Campos do Card</h3>
              <p className="text-sm text-gray-600 mt-1">
                Escolha quais informações aparecem nos cards dos clientes no Kanban. 
                Desmarque os campos que você não precisa ver para deixar os cards mais limpos.
              </p>
            </div>
            <div className="space-y-2 mt-4">
              {cardFields.map((field) => {
                const fieldLabels: Record<string, { icon: string; label: string; description: string }> = {
                  telefone: { icon: '📞', label: 'Telefone', description: 'Número de telefone do cliente' },
                  email: { icon: '📧', label: 'Email', description: 'Endereço de email do cliente' },
                  objetivo: { icon: '🎯', label: 'Objetivo', description: 'Objetivo principal do cliente' },
                  proxima_consulta: { icon: '📅', label: 'Próxima Consulta', description: 'Data e hora da próxima consulta agendada' },
                  ultima_consulta: { icon: '🕐', label: 'Última Consulta', description: 'Data da última consulta realizada' },
                  tags: { icon: '🏷️', label: 'Tags', description: 'Tags ou etiquetas associadas ao cliente' },
                  status_badge: { icon: '🏷️', label: 'Badge de Status', description: 'Badge colorido mostrando o status atual' },
                  data_cadastro: { icon: '📆', label: 'Data de Cadastro', description: 'Data em que o cliente foi cadastrado' }
                }
                
                const fieldInfo = fieldLabels[field.field] || { icon: '📋', label: field.field, description: 'Campo personalizado' }
                
                return (
                  <label key={field.field} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{fieldInfo.icon}</span>
                        <span className="text-sm font-medium text-gray-900">{fieldInfo.label}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-7">{fieldInfo.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        {field.visible ? 'Visível' : 'Oculto'}
                      </span>
                      <input
                        type="checkbox"
                        checked={field.visible}
                        onChange={(e) => {
                          setCardFields(cardFields.map(f => 
                            f.field === field.field ? { ...f, visible: e.target.checked } : f
                          ))
                        }}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Seção: Ações Rápidas */}
          <div>
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
              <p className="text-sm text-gray-600 mt-1">
                Controle quais botões de ação rápida aparecem nos cards dos clientes. 
                Esses botões ficam na parte inferior de cada card para acesso rápido.
              </p>
            </div>
            <div className="space-y-2 mt-4">
              {quickActions.map((action) => (
                <label key={action.action} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {action.action === 'whatsapp' && '💬 WhatsApp'}
                        {action.action === 'ver_perfil' && '👁️ Ver Perfil'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {action.action === 'whatsapp' && 'Botão para abrir conversa no WhatsApp diretamente do card'}
                      {action.action === 'ver_perfil' && 'Link para visualizar o perfil completo do cliente'}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={action.visible}
                    onChange={(e) => {
                      setQuickActions(quickActions.map(a => 
                        a.action === action.action ? { ...a, visible: e.target.checked } : a
                      ))
                    }}
                    className="w-5 h-5 text-blue-600 ml-4 flex-shrink-0"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Salvar Configuração
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para item de coluna arrastável
function SortableColumnItem({
  column,
  onRemove,
  onUpdate
}: {
  column: Column
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Column>) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-400">
        ⋮⋮
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={column.label}
          onChange={(e) => onUpdate(column.id, { label: e.target.value })}
          className="font-semibold text-gray-900 border-none focus:outline-none focus:ring-0 p-0 w-full"
        />
        <input
          type="text"
          value={column.description}
          onChange={(e) => onUpdate(column.id, { description: e.target.value })}
          className="text-xs text-gray-500 border-none focus:outline-none focus:ring-0 p-0 mt-1 w-full"
          placeholder="Descrição..."
        />
      </div>
      <select
        value={column.color}
        onChange={(e) => onUpdate(column.id, { color: e.target.value })}
        className="text-xs border border-gray-300 rounded px-2 py-1"
      >
        <option value="border-blue-300 bg-blue-50">Azul Suave</option>
        <option value="border-green-300 bg-green-50">Verde Suave</option>
        <option value="border-yellow-300 bg-yellow-50">Amarelo Suave</option>
        <option value="border-orange-300 bg-orange-50">Laranja Suave</option>
        <option value="border-purple-300 bg-purple-50">Roxo Suave</option>
        <option value="border-pink-300 bg-pink-50">Rosa Suave</option>
        <option value="border-cyan-300 bg-cyan-50">Ciano Suave</option>
        <option value="border-teal-300 bg-teal-50">Verde-Água Suave</option>
        <option value="border-indigo-300 bg-indigo-50">Índigo Suave</option>
        <option value="border-gray-300 bg-gray-50">Cinza Suave</option>
      </select>
      <button
        onClick={() => onRemove(column.id)}
        className="text-red-600 hover:text-red-700"
        title="Remover coluna"
      >
        🗑️
      </button>
    </div>
  )
}

