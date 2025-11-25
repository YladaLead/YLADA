'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  Active,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function NovoFormularioNutri() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NovoFormularioNutriContent />
    </ProtectedRoute>
  )
}

export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'email' | 'phone'

export interface Field {
  id: string
  type: FieldType
  label: string
  required: boolean
  placeholder?: string
  options?: string[]
}

// Componente para item de componente arrastável
function DraggableComponent({ fieldType }: { fieldType: { type: FieldType; label: string; icon: string; description: string; suggestion: string } }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `component-${fieldType.type}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col gap-1 p-4 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-lg border-blue-500' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{fieldType.icon}</span>
        <span className="text-sm font-medium">{fieldType.label}</span>
      </div>
      <p className="text-xs text-gray-600 ml-9">{fieldType.description}</p>
    </div>
  )
}

// Componente para item arrastável na lista
function DraggableFieldItem({ field, onEdit, onRemove }: { 
  field: Field
  onEdit: (field: Field) => void
  onRemove: (id: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-3 shadow-sm ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm">{field.label || 'Campo sem título'}</p>
            <p className="text-xs text-gray-500">{getFieldTypeLabel(field.type)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(field)}
            className="p-1 hover:bg-gray-100 rounded text-blue-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onRemove(field.id)}
            className="p-1 hover:bg-gray-100 rounded text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente da área de drop
function FormDropZone({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'form-drop-zone',
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] transition-colors ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-white'
      } border-2 border-dashed border-gray-200 rounded-lg p-6`}
    >
      {children}
    </div>
  )
}

// Componente para preview do campo
function FieldPreview({ field }: { field: Field }) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        )
      case 'phone':
        return (
          <input
            type="tel"
            placeholder={field.placeholder || "Digite seu telefone"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        )
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            disabled
          />
        )
      case 'select':
        return (
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
            <option>Selecione uma opção</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input type="radio" name={field.id} className="mr-2" disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label key={index} className="flex items-center">
                <input type="checkbox" className="mr-2" disabled />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )
      case 'date':
        return (
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled
          />
        )
      default:
        return <div className="text-gray-400">Campo não suportado</div>
    }
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label || 'Campo sem título'}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  )
}

function getFieldTypeLabel(type: FieldType): string {
  const labels = {
    text: 'Texto',
    textarea: 'Área de texto',
    select: 'Lista suspensa',
    radio: 'Múltipla escolha',
    checkbox: 'Caixas de seleção',
    number: 'Número',
    date: 'Data',
    email: 'E-mail',
    phone: 'Telefone'
  }
  return labels[type] || type
}

function NovoFormularioNutriContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    form_type: 'questionario' as 'questionario' | 'anamnese' | 'avaliacao' | 'consentimento' | 'outro'
  })
  
  const [fields, setFields] = useState<Field[]>([])
  const [fieldEditando, setFieldEditando] = useState<Field | null>(null)
  const [mostrarModalCampo, setMostrarModalCampo] = useState(false)
  const [activeId, setActiveId] = useState<Active | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const fieldTypes: { type: FieldType; label: string; icon: string; description: string; suggestion: string }[] = [
    { 
      type: 'text', 
      label: 'Texto', 
      icon: '📝', 
      description: 'Para nomes, profissão, medicamentos',
      suggestion: 'Nome completo'
    },
    { 
      type: 'email', 
      label: 'E-mail', 
      icon: '📧', 
      description: 'Para contato e envio de materiais',
      suggestion: 'E-mail para contato'
    },
    { 
      type: 'phone', 
      label: 'Telefone', 
      icon: '📱', 
      description: 'Para emergências e WhatsApp',
      suggestion: 'Telefone/WhatsApp'
    },
    { 
      type: 'textarea', 
      label: 'Área de texto', 
      icon: '📄', 
      description: 'Para histórico médico, sintomas, objetivos',
      suggestion: 'Descreva seu histórico alimentar'
    },
    { 
      type: 'number', 
      label: 'Número', 
      icon: '🔢', 
      description: 'Para peso, altura, idade, horas de sono',
      suggestion: 'Peso atual (kg)'
    },
    { 
      type: 'date', 
      label: 'Data', 
      icon: '📅', 
      description: 'Para nascimento, início de sintomas',
      suggestion: 'Data de nascimento'
    },
    { 
      type: 'select', 
      label: 'Lista suspensa', 
      icon: '📋', 
      description: 'Para opções únicas: sexo, estado civil, escolaridade',
      suggestion: 'Sexo biológico'
    },
    { 
      type: 'radio', 
      label: 'Múltipla escolha', 
      icon: '🔘', 
      description: 'Para uma opção entre várias: nível de atividade',
      suggestion: 'Nível de atividade física'
    },
    { 
      type: 'checkbox', 
      label: 'Caixas de seleção', 
      icon: '☑️', 
      description: 'Para múltiplas opções: sintomas, alergias',
      suggestion: 'Sintomas que apresenta'
    },
  ]

  const adicionarCampo = (tipo: FieldType) => {
    const fieldType = fieldTypes.find(ft => ft.type === tipo)
    const novoCampo: Field = {
      id: `field_${Date.now()}`,
      type: tipo,
      label: fieldType?.suggestion || '',
      required: false,
      placeholder: tipo === 'text' ? 'Digite aqui...' : 
                   tipo === 'textarea' ? 'Descreva detalhadamente...' : 
                   tipo === 'email' ? 'exemplo@email.com' :
                   tipo === 'phone' ? '(11) 99999-9999' :
                   tipo === 'number' ? 'Digite o valor' : undefined,
      options: tipo === 'select' ? ['Feminino', 'Masculino'] :
               tipo === 'radio' ? ['Sedentário', 'Leve', 'Moderado', 'Intenso'] :
               tipo === 'checkbox' ? ['Dor de cabeça', 'Fadiga', 'Insônia', 'Ansiedade'] : undefined
    }
    setFieldEditando(novoCampo)
    setMostrarModalCampo(true)
  }

  const salvarCampo = () => {
    if (!fieldEditando || !fieldEditando.label.trim()) {
      alert('Preencha o rótulo do campo')
      return
    }

    if (fieldEditando.type === 'select' || fieldEditando.type === 'radio' || fieldEditando.type === 'checkbox') {
      if (!fieldEditando.options || fieldEditando.options.length < 1) {
        alert('Adicione pelo menos 1 opção')
        return
      }
    }

    const campoExistente = fields.findIndex(f => f.id === fieldEditando.id)
    if (campoExistente >= 0) {
      const novosFields = [...fields]
      novosFields[campoExistente] = fieldEditando
      setFields(novosFields)
    } else {
      setFields([...fields, fieldEditando])
    }

    setFieldEditando(null)
    setMostrarModalCampo(false)
  }

  const editarCampo = (campo: Field) => {
    setFieldEditando(campo)
    setMostrarModalCampo(true)
  }

  const removerCampo = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // Se arrastou um componente para a área de drop
    if (active.id.toString().startsWith('component-') && over?.id === 'form-drop-zone') {
      const componentType = active.id.toString().replace('component-', '') as FieldType
      adicionarCampo(componentType)
      setActiveId(null)
      return
    }

    // Se reordenou campos existentes
    if (active.id !== over?.id && !active.id.toString().startsWith('component-')) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }

    setActiveId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    if (!formData.name.trim()) {
      setErro('Nome do formulário é obrigatório')
      return
    }

    if (fields.length === 0) {
      setErro('Adicione pelo menos um campo ao formulário')
      return
    }

    setSalvando(true)

    try {
      const response = await fetch('/api/nutri/formularios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          structure: {
            fields: fields
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar formulário')
      }

      if (data.success) {
        setMensagemSucesso('Formulário criado com sucesso!')
        setTimeout(() => {
          router.push('/pt/nutri/formularios')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Erro ao criar formulário:', error)
      setErro(error.message || 'Erro ao criar formulário. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
      
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Novo Formulário</h1>
              <p className="text-sm text-gray-600">Arraste os componentes e veja o preview em tempo real</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col xl:flex-row gap-4 p-4">
          {/* Left Panel - Components */}
          <div className="w-full xl:w-80 bg-white border border-gray-200 rounded-lg p-4 overflow-y-auto max-h-96 xl:max-h-none">
            <div className="mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">📋 Informações Básicas</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  💡 <strong>Dica:</strong> Defina um nome claro e uma descrição que explique o objetivo do formulário para seus pacientes.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Formulário *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Anamnese Nutricional Completa"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Ex: Formulário para coletar informações sobre hábitos alimentares, histórico de saúde e objetivos nutricionais do paciente."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                  </label>
                  <select
                    value={formData.form_type}
                    onChange={(e) => setFormData({ ...formData, form_type: e.target.value as any })}
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="questionario">Questionário</option>
                    <option value="anamnese">Anamnese</option>
                    <option value="avaliacao">Avaliação</option>
                    <option value="consentimento">Consentimento</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">🧩 Componentes</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-green-800">
                  💡 <strong>Como usar:</strong> Arraste os componentes abaixo para a área de preview à direita, ou clique duas vezes para adicionar rapidamente.
                </p>
              </div>
              <SortableContext items={fieldTypes.map(ft => `component-${ft.type}`)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 gap-3">
                  {fieldTypes.map((fieldType) => (
                    <div key={fieldType.type} onDoubleClick={() => adicionarCampo(fieldType.type)}>
                      <DraggableComponent fieldType={fieldType} />
                    </div>
                  ))}
                </div>
              </SortableContext>
              </div>
            </div>

            {fields.length > 0 && (
              <div>
                <h2 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">📝 Campos Adicionados</h2>
                <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {fields.map((field) => (
                      <DraggableFieldItem
                        key={field.id}
                        field={field}
                        onEdit={editarCampo}
                        onRemove={removerCampo}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <FormDropZone>
                <div className="mb-6">
                  <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    {formData.name || 'Visualização do Formulário'}
                  </h2>
                  {formData.description && (
                    <p className="text-sm lg:text-base text-gray-600">{formData.description}</p>
                  )}
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-6">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-3">Arraste componentes aqui</h3>
                    <p className="text-gray-500 mb-4">Arraste os componentes do painel à esquerda para esta área</p>
                    <p className="text-sm text-gray-400">Ou clique duas vezes em um componente para adicionar rapidamente</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6">
                    <div className="mb-6">
                      <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                        {formData.name || 'Visualização do Formulário'}
                      </h2>
                      {formData.description && (
                        <p className="text-sm lg:text-base text-gray-600">{formData.description}</p>
                      )}
                    </div>
                    
                    <form className="space-y-6">
                      {fields.map((field) => (
                        <FieldPreview key={field.id} field={field} />
                      ))}
                      <div className="pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
                          disabled
                        >
                          Enviar Formulário
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </FormDropZone>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/pt/nutri/formularios')}
                  className="flex-1 bg-gray-100 text-gray-700 py-4 px-4 text-base rounded-md font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={salvando || fields.length === 0 || !formData.name.trim()}
                  className="flex-1 bg-blue-600 text-white py-4 px-4 text-base rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {salvando ? 'Salvando...' : 'Criar Formulário'}
                </button>
              </div>

              {erro && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{erro}</p>
                    </div>
                  </div>
                </div>
              )}

              {mensagemSucesso && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{mensagemSucesso}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          activeId.toString().startsWith('component-') ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg opacity-90">
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {fieldTypes.find(ft => `component-${ft.type}` === activeId.toString())?.icon}
                </span>
                <span className="text-sm font-medium">
                  {fieldTypes.find(ft => `component-${ft.type}` === activeId.toString())?.label}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-3 shadow-lg opacity-90">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <div>
                  <p className="font-medium text-sm">
                    {fields.find(f => f.id === activeId.toString())?.label || 'Campo sem título'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFieldTypeLabel(fields.find(f => f.id === activeId.toString())?.type || 'text')}
                  </p>
                </div>
              </div>
            </div>
          )
        ) : null}
      </DragOverlay>

      {/* Modal de Edição de Campo */}
      {mostrarModalCampo && fieldEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base lg:text-lg font-semibold">
                  Configurar Campo - {getFieldTypeLabel(fieldEditando.type)}
                </h3>
                <button
                  onClick={() => setMostrarModalCampo(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Orientação específica para o tipo de campo */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Dica para {getFieldTypeLabel(fieldEditando.type)}:</strong> {
                    fieldTypes.find(ft => ft.type === fieldEditando.type)?.description || 'Configure este campo conforme sua necessidade.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rótulo do Campo *
                  </label>
                  <input
                    type="text"
                    value={fieldEditando.label}
                    onChange={(e) => setFieldEditando({ ...fieldEditando, label: e.target.value })}
                    className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={fieldTypes.find(ft => ft.type === fieldEditando.type)?.suggestion || "Ex: Nome completo"}
                  />
                </div>

                {(fieldEditando.type === 'text' || fieldEditando.type === 'textarea' || fieldEditando.type === 'email' || fieldEditando.type === 'phone' || fieldEditando.type === 'number') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placeholder
                    </label>
                    <input
                      type="text"
                      value={fieldEditando.placeholder || ''}
                      onChange={(e) => setFieldEditando({ ...fieldEditando, placeholder: e.target.value })}
                      className="w-full px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Digite seu nome completo"
                    />
                  </div>
                )}

                {(fieldEditando.type === 'select' || fieldEditando.type === 'radio' || fieldEditando.type === 'checkbox') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opções
                    </label>
                    <div className="space-y-2">
                      {fieldEditando.options?.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(fieldEditando.options || [])]
                              newOptions[index] = e.target.value
                              setFieldEditando({ ...fieldEditando, options: newOptions })
                            }}
                            className="flex-1 px-3 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Opção ${index + 1}`}
                          />
                          <button
                            onClick={() => {
                              const newOptions = fieldEditando.options?.filter((_, i) => i !== index)
                              setFieldEditando({ ...fieldEditando, options: newOptions })
                            }}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newOptions = [...(fieldEditando.options || []), '']
                          setFieldEditando({ ...fieldEditando, options: newOptions })
                        }}
                        className="w-full px-3 py-3 text-base border border-dashed border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                      >
                        + Adicionar opção
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="required"
                    checked={fieldEditando.required}
                    onChange={(e) => setFieldEditando({ ...fieldEditando, required: e.target.checked })}
                    className="mr-2"
                  />
                  <label htmlFor="required" className="text-sm text-gray-700">
                    Campo obrigatório
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setMostrarModalCampo(false)}
                  className="flex-1 px-4 py-3 text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarCampo}
                  className="flex-1 px-4 py-3 text-base bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Salvar Campo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  )
}