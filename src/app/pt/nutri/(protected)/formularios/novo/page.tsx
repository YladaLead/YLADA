'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import dynamic from 'next/dynamic'
import React from 'react'

// Lazy load do QRCode
const QRCode = dynamic(() => import('@/components/QRCode'), { ssr: false })
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
  useDraggable,
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
  return <NovoFormularioNutriContent />
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
    isDragging,
  } = useDraggable({ id: `component-${fieldType.type}` })

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center gap-2 p-2 text-left border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-lg border-blue-500' : ''}`}
    >
      <span className="text-lg">{fieldType.icon}</span>
      <div className="flex-1 min-w-0">
        <span className="text-xs font-medium block">{fieldType.label}</span>
        <p className="text-xs text-gray-500 truncate">{fieldType.description}</p>
      </div>
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
      data-drop-zone
      className={`min-h-[400px] transition-colors ${
        isOver ? 'bg-blue-50 border-blue-300' : 'bg-white'
      } border-2 border-dashed border-gray-200 rounded-lg p-6`}
    >
      {children}
    </div>
  )
}

// Componente para preview do campo
function FieldPreview({ field, onEdit, onRemove }: { field: Field, onEdit?: (field: Field) => void, onRemove?: (fieldId: string) => void }) {
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
    <div 
      ref={setNodeRef}
      style={style}
      className={`mb-4 p-3 border border-gray-200 rounded-lg bg-white ${isDragging ? 'shadow-lg border-blue-500' : 'hover:border-gray-300'}`}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded mt-1 flex-shrink-0"
          title="Arrastar para reordenar"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              {field.label || 'Campo sem título'}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="flex items-center gap-1">
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(field)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Editar campo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(field.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Remover campo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {renderField()}
        </div>
      </div>
    </div>
  )
}

export function getFieldTypeLabel(type: FieldType): string {
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

// Stub functions para compatibilidade com imports de [id]/page.tsx
export function TooltipButton({ children, onClick, className, tooltip }: { 
  children: React.ReactNode
  onClick: () => void
  className: string
  tooltip: string
}) {
  return (
    <button onClick={onClick} className={className} title={tooltip}>
      {children}
    </button>
  )
}

export function getFieldDescription(type: FieldType): string {
  return ''
}

export function getFieldPlaceholderExample(type: FieldType): string {
  return ''
}

export function getPlaceholderExample(type: FieldType): string {
  return ''
}

export function getHelpTextExample(type: FieldType): string {
  return ''
}

export function renderFieldPreview(field: Field) {
  return <div className="text-sm text-gray-500">Preview do campo {field.label}</div>
}

export function ModalEditarCampo({ campo, onChange, onSalvar, onCancelar }: any) {
  return null
}

function NovoFormularioNutriContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  
  // Estados para templates
  const [mostrarTemplates, setMostrarTemplates] = useState(true) // Mostrar templates por padrão
  const [templates, setTemplates] = useState<any[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    form_type: 'questionario' as 'questionario' | 'anamnese' | 'avaliacao' | 'consentimento' | 'outro',
    nameAlign: 'left' as 'left' | 'center' | 'right',
    descriptionAlign: 'left' as 'left' | 'center' | 'right'
  })
  
  const [fields, setFields] = useState<Field[]>([])
  const [fieldEditando, setFieldEditando] = useState<Field | null>(null)
  const [mostrarModalCampo, setMostrarModalCampo] = useState(false)
  const [activeId, setActiveId] = useState<Active | null>(null)
  const [generateShortUrl, setGenerateShortUrl] = useState(false)
  const [customShortCode, setCustomShortCode] = useState('')
  const [shortCodeDisponivel, setShortCodeDisponivel] = useState<boolean | null>(null)
  const [verificandoShortCode, setVerificandoShortCode] = useState(false)
  const [usarCodigoPersonalizado, setUsarCodigoPersonalizado] = useState(false)
  
  // Estados para slug
  const [slug, setSlug] = useState('')
  const [slugDisponivel, setSlugDisponivel] = useState<boolean | null>(null)
  const [verificandoSlug, setVerificandoSlug] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Carregar templates ao montar o componente
  useEffect(() => {
    carregarTemplates()
  }, [])

  const carregarTemplates = async () => {
    setCarregandoTemplates(true)
    try {
      const response = await fetch('/api/nutri/formularios?is_template=true', {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success && data.data.forms) {
        setTemplates(data.data.forms)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setCarregandoTemplates(false)
    }
  }

  // Gerar slug a partir do nome
  const gerarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Verificar disponibilidade do slug
  const verificarSlug = async (slugValue: string) => {
    if (!slugValue || slugValue.trim() === '') {
      setSlugDisponivel(null)
      return
    }

    setVerificandoSlug(true)
    try {
      const response = await fetch(`/api/nutri/formularios/check-slug?slug=${encodeURIComponent(slugValue)}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setSlugDisponivel(data.available)
      } else {
        setSlugDisponivel(false)
      }
    } catch (error) {
      console.error('Erro ao verificar slug:', error)
      setSlugDisponivel(false)
    } finally {
      setVerificandoSlug(false)
    }
  }

  // Atualizar slug quando nome mudar (apenas se slug estiver vazio)
  useEffect(() => {
    if (formData.name && !slug) {
      const slugGerado = gerarSlug(formData.name)
      setSlug(slugGerado)
      if (slugGerado) {
        verificarSlug(slugGerado)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.name])

  const usarTemplate = (template: any) => {
    // Copiar dados do template - formulário vem pronto
    setFormData({
      name: template.name,
      description: template.description || '',
      form_type: template.form_type || 'questionario',
      nameAlign: template.structure?.nameAlign || 'left',
      descriptionAlign: template.structure?.descriptionAlign || 'left'
    })
    
    // Gerar slug do nome do template
    if (template.name) {
      const slugGerado = gerarSlug(template.name)
      setSlug(slugGerado)
      verificarSlug(slugGerado)
    }
    
    // Copiar campos do template - garantir que todos os atributos sejam copiados
    if (template.structure && template.structure.fields) {
      const camposCopiados = template.structure.fields.map((f: any) => ({
        id: f.id,
        type: f.type === 'tel' ? 'phone' : f.type, // Converter 'tel' para 'phone' na área Nutri
        label: f.label,
        required: f.required !== undefined ? f.required : true,
        placeholder: f.placeholder || undefined,
        helpText: f.helpText || undefined,
        options: f.options ? [...f.options] : undefined,
        min: f.min,
        max: f.max,
        step: f.step,
        unit: f.unit || undefined
      }))
      setFields(camposCopiados)
    }
    
    // Esconder templates e mostrar editor
    setMostrarTemplates(false)
  }

  const criarDoZero = () => {
    setFormData({
      name: '',
      description: '',
      form_type: 'questionario',
      nameAlign: 'left',
      descriptionAlign: 'left'
    })
    setFields([])
    setMostrarTemplates(false)
  }

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
    const isNovoCampo = campoExistente < 0
    
    if (campoExistente >= 0) {
      const novosFields = [...fields]
      novosFields[campoExistente] = fieldEditando
      setFields(novosFields)
    } else {
      setFields([...fields, fieldEditando])
    }

    setFieldEditando(null)
    setMostrarModalCampo(false)
    
    // Scroll suave para o final da área de drop após adicionar novo campo
    if (isNovoCampo) {
      setTimeout(() => {
        const dropZone = document.querySelector('[data-drop-zone]')
        if (dropZone) {
          const lastField = dropZone.lastElementChild
          if (lastField) {
            lastField.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 150)
    }
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
    setMensagemSucesso(null)

    // Validações
    if (!formData.name || !formData.name.trim()) {
      setErro('Nome do formulário é obrigatório')
      return
    }

    if (fields.length === 0) {
      setErro('Adicione pelo menos um campo ao formulário')
      return
    }

    // Preparar payload
    const payload = {
      name: formData.name.trim(),
      description: (formData.description || '').trim() || null,
      form_type: 'questionario',
      structure: {
        fields: fields,
        nameAlign: formData.nameAlign,
        descriptionAlign: formData.descriptionAlign
      },
      slug: slug && slug.trim() ? slug.trim() : null,
      generate_short_url: generateShortUrl,
      custom_short_code: usarCodigoPersonalizado && customShortCode.length >= 3 && shortCodeDisponivel ? customShortCode.trim() : null
    }

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 Enviando formulário:', {
        name: payload.name,
        description: payload.description,
        fieldsCount: payload.structure.fields.length,
        slug: payload.slug
      })
    }

    setSalvando(true)

    try {
      const response = await fetch('/api/nutri/formularios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('❌ Erro ao parsear resposta JSON:', parseError)
        const textResponse = await response.text()
        console.error('📄 Resposta do servidor (texto):', textResponse)
        throw new Error('Resposta inválida do servidor')
      }

      if (!response.ok) {
        // Log detalhado do erro
        console.error('❌ Erro ao criar formulário:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          technical: data.technical,
          payload: payload
        })
        
        throw new Error(data.error || 'Erro ao criar formulário')
      }

      if (data.success && data.data?.form) {
        console.log('✅ Formulário criado com sucesso:', data.data.form)
        setMensagemSucesso('Formulário criado com sucesso!')
        setTimeout(() => {
          router.push('/pt/nutri/formularios')
        }, 1500)
      } else {
        console.error('❌ Resposta inválida:', data)
        throw new Error(data.error || 'Resposta inválida do servidor')
      }
    } catch (error: any) {
      console.error('❌ Erro ao criar formulário:', error)
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

  // Tela de seleção de templates
  if (mostrarTemplates) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        
        <div className="flex-1 flex flex-col lg:ml-64">
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
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
                <h1 className="text-xl font-semibold text-gray-900">Criar Novo Formulário</h1>
                <p className="text-sm text-gray-600">Escolha um formulário pré-montado ou crie do zero</p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Formulários Pré-montados</h2>
                <p className="text-gray-600 mb-6">Formulários prontos para usar. Escolha um e personalize conforme sua necessidade</p>
                
                {carregandoTemplates ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando formulários...</p>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-600">Nenhum formulário pré-montado disponível no momento</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => usarTemplate(template)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Pronto</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description || 'Sem descrição'}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{template.form_type || 'questionario'}</span>
                          <span>{template.structure?.fields?.length || 0} campos</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            usarTemplate(template)
                          }}
                          className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Usar este formulário
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Opção de criar do zero */}
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Criar do Zero</h3>
                <p className="text-gray-600 mb-4">Prefere criar seu próprio formulário personalizado?</p>
                <button
                  onClick={criarDoZero}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Criar Formulário Personalizado
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
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
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Novo Formulário</h1>
                  <p className="text-sm text-gray-600">Arraste os componentes e veja o preview em tempo real</p>
                </div>
                <button
                  onClick={() => setMostrarTemplates(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver formulários pré-montados
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex gap-4 p-4">
          {/* Left Panel - Preview */}
          <div className="flex-1 overflow-y-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  👁️ Preview do Formulário
                </h2>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Atualização em tempo real
                </div>
              </div>
              <FormDropZone>
                <div className="mb-6 space-y-3">
                  {/* Edição inline do nome */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setFormData(prev => ({ ...prev, name: newValue }))
                        }}
                        placeholder="Nome do Formulário *"
                        required
                        className={`flex-1 text-xl lg:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2 hover:bg-blue-50 transition-colors ${
                          formData.nameAlign === 'center' ? 'text-center' :
                          formData.nameAlign === 'right' ? 'text-right' :
                          'text-left'
                        }`}
                        style={{ minHeight: '2rem' }}
                      />
                      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, nameAlign: 'left' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.nameAlign === 'left' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Alinhar à esquerda"
                        >
                          ⬅️
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, nameAlign: 'center' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.nameAlign === 'center' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Centralizar"
                        >
                          ⬌
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, nameAlign: 'right' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.nameAlign === 'right' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Alinhar à direita"
                        >
                          ➡️
                        </button>
                      </div>
                    </div>
                    {!formData.name && (
                      <p className="text-xs text-gray-400 italic">Digite o nome do formulário</p>
                    )}
                  </div>
                  {/* Edição inline da descrição */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => {
                          const newValue = e.target.value
                          setFormData(prev => ({ ...prev, description: newValue }))
                        }}
                        placeholder="Descrição do formulário (opcional)"
                        className={`flex-1 text-sm lg:text-base text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 -ml-2 hover:bg-blue-50 transition-colors resize-none ${
                          formData.descriptionAlign === 'center' ? 'text-center' :
                          formData.descriptionAlign === 'right' ? 'text-right' :
                          'text-left'
                        }`}
                        rows={2}
                        style={{ minHeight: '3rem' }}
                      />
                      <div className="flex flex-col gap-1 bg-gray-100 rounded-lg p-1">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, descriptionAlign: 'left' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.descriptionAlign === 'left' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Alinhar à esquerda"
                        >
                          ⬅️
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, descriptionAlign: 'center' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.descriptionAlign === 'center' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Centralizar"
                        >
                          ⬌
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, descriptionAlign: 'right' })}
                          className={`p-1.5 rounded transition-colors ${
                            formData.descriptionAlign === 'right' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                          }`}
                          title="Alinhar à direita"
                        >
                          ➡️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                    <div className="text-blue-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">🎯 Solte os componentes aqui</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Arraste da sidebar direita ou clique duas vezes
                    </p>
                    <div className="bg-white border border-blue-200 rounded-lg p-4 max-w-sm mx-auto shadow-sm">
                      <p className="text-xs text-blue-800">
                        💡 <strong>Sugestão:</strong> Comece com "Nome" e "Email" para identificar o paciente
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg p-6">
                    <form className="space-y-6">
                      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                        {fields.map((field) => (
                          <FieldPreview 
                            key={field.id} 
                            field={field} 
                            onEdit={editarCampo}
                            onRemove={removerCampo}
                          />
                        ))}
                      </SortableContext>
                      
                      {/* Área visual para arrastar próximo campo */}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50/30 transition-all">
                        <div className="text-center text-gray-400">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm font-medium">Arraste mais campos aqui</p>
                          <p className="text-xs mt-1">ou clique duas vezes no componente →</p>
                        </div>
                      </div>
                      
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
              <form onSubmit={handleSubmit} className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/pt/nutri/formularios')}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-4 text-base rounded-md font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando || fields.length === 0 || !formData.name || !formData.name.trim()}
                    className="flex-1 bg-blue-600 text-white py-4 px-4 text-base rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    onClick={(e) => {
                      // Validação adicional antes de submeter
                      if (!formData.name || !formData.name.trim()) {
                        e.preventDefault()
                        setErro('Nome do formulário é obrigatório')
                        return false
                      }
                      if (fields.length === 0) {
                        e.preventDefault()
                        setErro('Adicione pelo menos um campo ao formulário')
                        return false
                      }
                    }}
                  >
                    {salvando ? 'Salvando...' : 'Criar Formulário'}
                  </button>
                </div>
              </form>

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

          {/* Right Sidebar - URL Curta e Componentes */}
          <div className="w-80 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="flex flex-col h-full">
              {/* URL do Formulário (Slug) */}
              <div className="border-b border-gray-200 px-4 py-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Formulário
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={slug}
                    onChange={async (e) => {
                      const value = gerarSlug(e.target.value)
                      setSlug(value)
                      if (value) {
                        verificarSlug(value)
                      } else {
                        setSlugDisponivel(null)
                      }
                    }}
                    placeholder="nome-do-formulario"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  {verificandoSlug && (
                    <p className="text-xs text-gray-500">Verificando...</p>
                  )}
                  {!verificandoSlug && slugDisponivel === true && slug && (
                    <p className="text-xs text-blue-600">✅ Nome disponível!</p>
                  )}
                  {!verificandoSlug && slugDisponivel === false && slug && (
                    <p className="text-xs text-red-600">❌ Este nome já está em uso</p>
                  )}
                  <p className="text-xs text-gray-500">
                    URL: <span className="font-mono text-blue-700">{typeof window !== 'undefined' ? window.location.origin : ''}/pt/nutri/[seu-usuario]/formulario/{slug || 'nome-do-formulario'}</span>
                  </p>
                </div>
              </div>

              {/* URL Curta */}
              <div className="border-b border-gray-200 px-4 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="generateShortUrl"
                    checked={generateShortUrl}
                    onChange={(e) => {
                      setGenerateShortUrl(e.target.checked)
                      if (!e.target.checked) {
                        setCustomShortCode('')
                        setUsarCodigoPersonalizado(false)
                        setShortCodeDisponivel(null)
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="generateShortUrl" className="flex-1 cursor-pointer text-sm font-medium text-gray-700">
                    Gerar URL Curta
                      </label>
                </div>
                {generateShortUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="usarCodigoPersonalizado"
                        checked={usarCodigoPersonalizado}
                        onChange={(e) => {
                          setUsarCodigoPersonalizado(e.target.checked)
                          if (!e.target.checked) {
                            setCustomShortCode('')
                            setShortCodeDisponivel(null)
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="usarCodigoPersonalizado" className="text-xs text-gray-600 cursor-pointer">
                        Usar código personalizado
                      </label>
                    </div>
                    {usarCodigoPersonalizado && (
                    <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customShortCode}
                            onChange={async (e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 10)
                              setCustomShortCode(value)
                              
                              if (value.length >= 3) {
                                setVerificandoShortCode(true)
                                try {
                                  const response = await fetch(
                                    `/api/nutri/check-short-code?code=${encodeURIComponent(value)}&type=form`
                                  )
                                  const data = await response.json()
                                  setShortCodeDisponivel(data.available)
                                } catch (error) {
                                  console.error('Erro ao verificar código:', error)
                                  setShortCodeDisponivel(false)
                                } finally {
                                  setVerificandoShortCode(false)
                                }
                              } else {
                                setShortCodeDisponivel(null)
                              }
                            }}
                            placeholder="meu-codigo"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                    </div>
                        {verificandoShortCode && (
                          <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                        )}
                        {!verificandoShortCode && shortCodeDisponivel === true && customShortCode.length >= 3 && (
                          <p className="text-xs text-blue-600 mt-1">✅ Código disponível!</p>
                        )}
                        {!verificandoShortCode && shortCodeDisponivel === false && customShortCode.length >= 3 && (
                          <p className="text-xs text-red-600 mt-1">❌ Este código já está em uso</p>
                        )}
                        {customShortCode.length > 0 && customShortCode.length < 3 && (
                          <p className="text-xs text-yellow-600 mt-1">⚠️ Mínimo de 3 caracteres</p>
                        )}
                    </div>
                    )}
                    {usarCodigoPersonalizado && customShortCode.length >= 3 && shortCodeDisponivel ? (
                      <>
                        <p className="text-xs text-gray-500 mb-3">
                          URL: <span className="font-mono font-semibold text-blue-700">{typeof window !== 'undefined' ? window.location.origin : ''}/p/{customShortCode}</span>
                        </p>
                        {/* QR Code Preview */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-2 text-center font-medium">QR Code:</p>
                          <div className="flex justify-center">
                            <QRCode 
                              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/p/${customShortCode}`} 
                              size={120} 
                            />
                  </div>
                          <p className="text-xs text-gray-400 text-center mt-2">
                            Escaneie para acessar o formulário
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Uma URL curta será gerada automaticamente após salvar. O QR code estará disponível na página de envio do formulário.
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Componentes */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4">
                <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  🧩 Componentes
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-800">
                    💡 <strong>Como usar:</strong> Arraste para o preview à esquerda ou clique duas vezes.
                  </p>
                </div>
                  <div className="grid grid-cols-1 gap-2">
                    {fieldTypes.map((fieldType) => (
                      <div key={fieldType.type} onDoubleClick={() => adicionarCampo(fieldType.type)}>
                        <DraggableComponent fieldType={fieldType} />
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
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
    </DndContext>

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
    </>
  )
}