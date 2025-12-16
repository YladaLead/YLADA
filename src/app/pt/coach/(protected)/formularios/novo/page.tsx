'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'
import dynamic from 'next/dynamic'
import { 
  FieldType,
  Field,
  renderFieldPreview,
  getFieldTypeLabel,
  getFieldDescription
} from '@/components/coach/formularios-utils'

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

export default function NovoFormularioCoach() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NovoFormularioCoachContent />
    </Suspense>
  )
}

// Re-exportar tipos e funções de formularios-utils para compatibilidade
export type { FieldType, Field } from '@/components/coach/formularios-utils'
export { 
  TooltipButton,
  getFieldTypeLabel,
  getFieldDescription,
  getFieldPlaceholderExample,
  getPlaceholderExample,
  getHelpTextExample,
  renderFieldPreview,
  ModalEditarCampo
} from '@/components/coach/formularios-utils'

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
      className={`flex items-center gap-2 p-3 text-left border-2 rounded-lg transition-all group relative ${
        isDragging 
          ? 'border-purple-500 bg-purple-100 shadow-lg scale-95 opacity-75' 
          : 'border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 hover:shadow-md'
      }`}
      title="Arraste para adicionar ou clique duas vezes"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center gap-3 flex-1 min-w-0 w-full cursor-grab active:cursor-grabbing"
        onDoubleClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // Não fazer nada aqui - o duplo clique será tratado no container pai
        }}
      >
        <span className="text-xl flex-shrink-0">{fieldType.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{fieldType.label}</span>
            {!isDragging && (
              <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                👆 Arraste ou 2x clique
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{fieldType.description}</p>
        </div>
        {isDragging && (
          <div className="text-purple-600 animate-pulse text-lg">✨</div>
        )}
      </div>
      {/* Botão de ação rápida */}
      {!isDragging && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            // Disparar evento para o componente pai
            const event = new CustomEvent('addFieldQuick', { 
              detail: { fieldType: fieldType.type },
              bubbles: true 
            })
            e.currentTarget.closest('div')?.dispatchEvent(event)
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 z-10"
          title="Adicionar rapidamente (ou clique duas vezes no card)"
        >
          ➕
        </button>
      )}
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
      className={`min-h-[400px] transition-all duration-300 ${
        isOver 
          ? 'bg-purple-100 border-purple-500 border-4 shadow-2xl scale-[1.01] ring-4 ring-purple-200' 
          : 'bg-white border-2 border-dashed border-gray-300'
      } rounded-lg p-6 relative`}
    >
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-purple-500 bg-opacity-20 rounded-lg z-10 pointer-events-none">
          <div className="bg-purple-600 text-white px-8 py-4 rounded-xl shadow-2xl text-xl font-bold animate-bounce border-4 border-white">
            ✨ SOLTE AQUI PARA ADICIONAR! ✨
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

function DraggableFieldPreview({ field, onEdit, onRemove }: { field: Field, onEdit?: (field: Field) => void, onRemove?: (fieldId: string) => void }) {
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
          {renderFieldPreview(field)}
        </div>
      </div>
    </div>
  )
}

function NovoFormularioCoachContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Carregar templates ao montar o componente
  useEffect(() => {
    carregarTemplates()
    
    // Verificar se há template na URL
    const templateId = searchParams.get('template')
    if (templateId) {
      carregarTemplatePorId(templateId)
    }
  }, [searchParams])

  const carregarTemplates = async () => {
    setCarregandoTemplates(true)
    try {
      const response = await fetch('/api/coach/formularios?is_template=true', {
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

  const carregarTemplatePorId = async (templateId: string) => {
    try {
      const response = await fetch(`/api/coach/formularios?is_template=true`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success && data.data.forms) {
        const template = data.data.forms.find((t: any) => t.id === templateId)
        if (template) {
          usarTemplate(template)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar template:', error)
    }
  }

  const usarTemplate = (template: any) => {
    // Copiar dados do template - formulário vem pronto
    setFormData({
      name: template.name,
      description: template.description || '',
      form_type: template.form_type || 'questionario',
      nameAlign: template.structure?.nameAlign || 'left',
      descriptionAlign: template.structure?.descriptionAlign || 'left'
    })
    
    // Copiar campos do template - garantir que todos os atributos sejam copiados
    if (template.structure && template.structure.fields) {
      const camposCopiados = template.structure.fields.map((f: any) => ({
        id: f.id,
        type: f.type,
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

  const fieldTypes = [
    { 
      type: 'text' as FieldType, 
      label: 'Texto', 
      icon: '📝', 
      description: 'Para nomes, objetivos, respostas breves',
      suggestion: 'Nome completo'
    },
    { 
      type: 'textarea' as FieldType, 
      label: 'Texto Longo', 
      icon: '📄', 
      description: 'Para observações, históricos, descrições detalhadas',
      suggestion: 'Observações'
    },
    { 
      type: 'email' as FieldType, 
      label: 'E-mail', 
      icon: '✉️', 
      description: 'Campo de e-mail com validação automática',
      suggestion: 'E-mail'
    },
    { 
      type: 'tel' as FieldType, 
      label: 'Telefone', 
      icon: '📞', 
      description: 'Campo de telefone com formatação automática',
      suggestion: 'Telefone'
    },
    { 
      type: 'number' as FieldType, 
      label: 'Número', 
      icon: '🔢', 
      description: 'Para peso, altura, medidas, quantidades',
      suggestion: 'Peso (kg)'
    },
    { 
      type: 'date' as FieldType, 
      label: 'Data', 
      icon: '📅', 
      description: 'Seletor de data com calendário visual',
      suggestion: 'Data de nascimento'
    },
    { 
      type: 'time' as FieldType, 
      label: 'Hora', 
      icon: '🕐', 
      description: 'Seletor de hora com relógio visual',
      suggestion: 'Horário preferido'
    },
    { 
      type: 'select' as FieldType, 
      label: 'Lista suspensa', 
      icon: '📋', 
      description: 'Para opções únicas: sexo, estado civil, escolaridade',
      suggestion: 'Gênero'
    },
    { 
      type: 'radio' as FieldType, 
      label: 'Múltipla escolha', 
      icon: '⚪', 
      description: 'Para uma opção entre várias: nível de atividade',
      suggestion: 'Nível de atividade física'
    },
    { 
      type: 'checkbox' as FieldType, 
      label: 'Caixas de seleção', 
      icon: '☑️', 
      description: 'Para múltiplas opções: sintomas, alergias',
      suggestion: 'Objetivos'
    },
    { 
      type: 'yesno' as FieldType, 
      label: 'Sim/Não', 
      icon: '✅', 
      description: 'Pergunta simples Sim/Não',
      suggestion: 'Pratica exercícios regularmente?'
    },
    { 
      type: 'range' as FieldType, 
      label: 'Escala', 
      icon: '📊', 
      description: 'Escala deslizante para notas de 1-10, níveis de energia',
      suggestion: 'Nível de energia (1-10)'
    },
    { 
      type: 'file' as FieldType, 
      label: 'Upload de Arquivo', 
      icon: '📎', 
      description: 'Permite upload de arquivos, fotos, documentos',
      suggestion: 'Anexar arquivo'
    },
  ]

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // Se arrastou um componente para a área de drop ou sobre qualquer campo existente
    if (active.id.toString().startsWith('component-')) {
      // Se soltou sobre a área de drop ou sobre um campo existente, adiciona o componente
      if (over?.id === 'form-drop-zone' || (over?.id && !over.id.toString().startsWith('component-'))) {
        const componentType = active.id.toString().replace('component-', '') as FieldType
        adicionarCampo(componentType)
        setActiveId(null)
        return
      }
      // Se soltou em lugar nenhum, apenas limpa
      setActiveId(null)
      return
    }

    // Se reordenou campos existentes
    if (active.id !== over?.id && !active.id.toString().startsWith('component-') && over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(items, oldIndex, newIndex)
        }
        return items
      })
    }

    setActiveId(null)
  }

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
                   tipo === 'tel' ? '(11) 99999-9999' :
                   tipo === 'number' ? 'Digite o valor' : undefined,
      options: tipo === 'select' ? ['Feminino', 'Masculino'] :
               tipo === 'radio' ? ['Sedentário', 'Leve', 'Moderado', 'Intenso'] :
               tipo === 'checkbox' ? ['Ganhar massa', 'Perder peso', 'Melhorar condicionamento'] : undefined
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setErro('Nome do formulário é obrigatório')
      return
    }

    if (fields.length === 0) {
      setErro('Adicione pelo menos um campo ao formulário')
      return
    }

    setSalvando(true)
    setErro(null)
    setMensagemSucesso(null)

    try {
      const response = await fetch('/api/coach/formularios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          form_type: 'questionario', // Tipo padrão, não precisa ser editável
          structure: {
            fields: fields,
            nameAlign: formData.nameAlign,
            descriptionAlign: formData.descriptionAlign
          },
          generate_short_url: false,
          custom_short_code: null
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar formulário')
      }

      // Sucesso - mostrar mensagem com link
      const formId = responseData.data?.form?.id
      const shortCode = responseData.data?.form?.short_code
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
      const linkGerado = shortCode 
        ? `${baseUrl}/p/${shortCode}`
        : `${baseUrl}/f/${formId}`

      setMensagemSucesso(`✅ Formulário criado com sucesso! Link: ${linkGerado}`)
      
      // Copiar link automaticamente
      if (linkGerado) {
        navigator.clipboard.writeText(linkGerado)
      }

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push('/pt/coach/formularios')
      }, 3000)
    } catch (error: any) {
      console.error('Erro:', error)
      setErro(error.message || 'Erro ao salvar formulário. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Tela de seleção de templates
  if (mostrarTemplates) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CoachSidebar />

        <div className="lg:pl-72">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/pt/coach/formularios')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Criar Novo Formulário</h1>
              <p className="text-gray-600 mt-1">Escolha um template ou crie do zero</p>
            </div>

            {/* Formulários Pré-montados */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📋 Formulários Pré-montados</h2>
              <p className="text-gray-600 mb-6">Formulários prontos para usar. Escolha um e personalize conforme sua necessidade</p>
              
              {carregandoTemplates ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
                      className="bg-white rounded-lg border border-gray-200 p-6 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
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
                        className="mt-4 w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachSidebar />

      <div className="lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pt/coach/formularios')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Criar Formulário Personalizado</h1>
                <p className="text-gray-600 mt-1">Construa seu formulário de anamnese ou avaliação</p>
              </div>
              <button
                onClick={() => setMostrarTemplates(true)}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Ver formulários pré-montados
              </button>
            </div>
          </div>

          {/* Main Content */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4">
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
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Nome do Formulário *"
                            className={`flex-1 text-xl lg:text-2xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 -ml-2 hover:bg-purple-50 transition-colors ${
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
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descrição do formulário (opcional)"
                            className={`flex-1 text-sm lg:text-base text-gray-600 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 -ml-2 hover:bg-purple-50 transition-colors resize-none ${
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
                      <div className="text-center py-16 border-2 border-dashed border-purple-300 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                        <div className="text-purple-400 mb-6">
                        <svg className="w-20 h-20 mx-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">🎯 Área de Drop</h3>
                      <p className="text-gray-700 mb-6 text-base font-medium">
                          <strong className="text-purple-600">Arraste</strong> componentes da barra lateral ou <strong className="text-purple-600">clique duas vezes</strong> para adicionar
                      </p>
                        <div className="bg-white border-2 border-purple-300 rounded-lg p-5 max-w-md mx-auto shadow-lg">
                          <p className="text-sm text-purple-900 font-semibold">
                          💡 <strong>Dica:</strong> Comece com "Nome" e "Email" para identificar o cliente
                        </p>
                      </div>
                      {activeId && activeId.toString().startsWith('component-') && (
                        <div className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-xl text-base font-bold animate-pulse shadow-lg border-4 border-white">
                          ✨ SOLTE AQUI PARA ADICIONAR! ✨
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6">
                      <form className="space-y-6">
                        {/* Indicador visual quando arrastando sobre campos existentes */}
                        {activeId && activeId.toString().startsWith('component-') && (
                          <div className="mb-4 p-3 bg-purple-100 border-2 border-purple-400 border-dashed rounded-lg text-center">
                            <p className="text-sm font-semibold text-purple-800">
                              ✨ Arraste para qualquer lugar da lista ou solte aqui para adicionar no final
                            </p>
                          </div>
                        )}
                        <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                          {fields.map((field) => (
                            <DraggableFieldPreview 
                              key={field.id} 
                              field={field} 
                              onEdit={editarCampo}
                              onRemove={removerCampo}
                            />
                          ))}
                        </SortableContext>
                        {/* Área de drop no final da lista */}
                        {activeId && activeId.toString().startsWith('component-') && (
                          <div className="mt-4 p-6 border-2 border-dashed border-purple-400 bg-purple-50 rounded-lg text-center">
                            <p className="text-sm font-semibold text-purple-800">
                              ✨ Solte aqui para adicionar no final da lista
                            </p>
                          </div>
                        )}
                        <div className="pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md font-medium hover:bg-purple-700 transition-colors"
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
                      onClick={() => router.push('/pt/coach/formularios')}
                      className="flex-1 bg-gray-100 text-gray-700 py-4 px-4 text-base rounded-md font-medium hover:bg-gray-200 transition-colors"
                    >
                      Cancelar
                    </button>
                    <form onSubmit={handleSubmit}>
                      <button
                        type="submit"
                        disabled={salvando || fields.length === 0 || !formData.name.trim()}
                        className="w-full bg-purple-600 text-white py-4 px-4 text-base rounded-md font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {salvando ? 'Salvando...' : 'Criar Formulário'}
                      </button>
                    </form>
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
                    <div className="mt-4 bg-green-50 border-2 border-green-400 rounded-lg p-4 shadow-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-green-900 mb-2">{mensagemSucesso}</p>
                          <p className="text-xs text-green-700">
                            ✅ Link copiado automaticamente! Redirecionando em 3 segundos...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Componentes */}
              <div className="w-80 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                  {/* Informação sobre links */}
                  <div className="border-b border-gray-200 px-4 py-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <p className="text-xs text-purple-800 font-medium mb-1">💡 Links e QR Code</p>
                      <p className="text-xs text-purple-700">
                        Após salvar, você poderá gerar URL curta e QR code diretamente na listagem de formulários.
                      </p>
                    </div>
                  </div>

                  {/* Componentes */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="px-4 py-4">
                      <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        🧩 Componentes
                      </h2>
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 rounded-lg p-4 mb-4 shadow-sm">
                        <p className="text-sm text-purple-900 font-bold mb-2 flex items-center gap-2">
                          💡 Como adicionar campos:
                        </p>
                        <ul className="text-sm text-purple-800 space-y-2 ml-2">
                          <li className="flex items-center gap-2">
                            <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                            <strong>Arraste</strong> o componente para a área de preview (à esquerda)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                            <strong>Clique duas vezes</strong> no componente para adicionar rapidamente
                          </li>
                        </ul>
                        <div className="mt-3 pt-3 border-t border-purple-300">
                          <p className="text-xs text-purple-700 font-medium">
                            ✨ <strong>Dica:</strong> A área de drop fica destacada quando você arrasta um componente!
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {fieldTypes.map((fieldType) => (
                          <div 
                            key={fieldType.type} 
                            className="w-full"
                            onDoubleClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              adicionarCampo(fieldType.type)
                            }}
                            onAddFieldQuick={(e: any) => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (e.detail?.fieldType) {
                                adicionarCampo(e.detail.fieldType)
                              }
                            }}
                        >
                            <DraggableComponent fieldType={fieldType} />
                      </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeId ? (
                activeId.toString().startsWith('component-') ? (
                  <div className="bg-white border-2 border-purple-500 rounded-lg p-4 shadow-lg opacity-90">
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
        </div>
      </div>

      {/* Modal de Edição de Campo */}
      {mostrarModalCampo && fieldEditando && (
        <ModalEditarCampo
          campo={fieldEditando}
          onChange={setFieldEditando}
          onSalvar={salvarCampo}
          onCancelar={() => {
            setFieldEditando(null)
            setMostrarModalCampo(false)
          }}
        />
      )}
    </div>
  )
}

// Funções helper removidas - agora importadas de formularios-utils
// Mantendo apenas ModalEditarCampo que tem implementação específica aqui

export function ModalEditarCampo({
  campo,
  onChange,
  onSalvar,
  onCancelar
}: {
  campo: Field
  onChange: (campo: Field) => void
  onSalvar: () => void
  onCancelar: () => void
}) {
  const [novaOpcao, setNovaOpcao] = useState('')

  const adicionarOpcao = () => {
    if (novaOpcao.trim() && (campo.type === 'select' || campo.type === 'radio' || campo.type === 'checkbox')) {
      onChange({
        ...campo,
        options: [...(campo.options || []), novaOpcao.trim()]
      })
      setNovaOpcao('')
    }
  }

  const removerOpcao = (index: number) => {
    if (campo.options) {
      onChange({
        ...campo,
        options: campo.options.filter((_, i) => i !== index)
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onCancelar}>
      <div
        className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-3xl">
              {campo.type === 'date' && '📅'}
              {campo.type === 'time' && '🕐'}
              {campo.type === 'text' && '📝'}
              {campo.type === 'textarea' && '📄'}
              {campo.type === 'select' && '📋'}
              {campo.type === 'radio' && '⚪'}
              {campo.type === 'checkbox' && '☑️'}
              {campo.type === 'number' && '🔢'}
              {campo.type === 'email' && '✉️'}
              {campo.type === 'tel' && '📞'}
              {campo.type === 'yesno' && '✅'}
              {campo.type === 'range' && '📊'}
              {campo.type === 'file' && '📎'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">Editar Campo: {getFieldTypeLabel(campo.type)}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {campo.type === 'date' && 'O cliente verá um campo de data. Ao clicar, abre um calendário para escolher a data.'}
                {campo.type === 'time' && 'O cliente verá um campo de hora. Ao clicar, abre um seletor de hora.'}
                {campo.type !== 'date' && campo.type !== 'time' && getFieldDescription(campo.type)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rótulo do Campo *
            </label>
            <p className="text-xs text-gray-500 mb-2">O que aparece acima do campo (ex: "Data de nascimento")</p>
            <input
              type="text"
              value={campo.label}
              onChange={(e) => onChange({ ...campo, label: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={getFieldPlaceholderExample(campo.type)}
            />
          </div>

          {(campo.type === 'date' || campo.type === 'time') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">💡 Como funciona:</p>
              <p className="text-xs text-blue-800">
                {campo.type === 'date' 
                  ? 'O cliente verá um campo com ícone de calendário. Ao clicar, abre automaticamente um calendário visual para escolher a data. Não precisa configurar nada além do rótulo acima.'
                  : 'O cliente verá um campo com ícone de relógio. Ao clicar, abre automaticamente um seletor de hora. Não precisa configurar nada além do rótulo acima.'}
              </p>
            </div>
          )}

          {(campo.type === 'text' || campo.type === 'textarea' || campo.type === 'email' || campo.type === 'tel' || campo.type === 'number') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de Ajuda (Placeholder)
              </label>
              <p className="text-xs text-gray-500 mb-2">Texto que aparece dentro do campo antes do cliente digitar (opcional)</p>
              <input
                type="text"
                value={campo.placeholder || ''}
                onChange={(e) => onChange({ ...campo, placeholder: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={getPlaceholderExample(campo.type)}
              />
            </div>
          )}


          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="required"
              checked={campo.required}
              onChange={(e) => onChange({ ...campo, required: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">
              Campo obrigatório
            </label>
          </div>

          {(campo.type === 'select' || campo.type === 'radio' || campo.type === 'checkbox') && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opções *
              </label>
              <p className="text-xs text-gray-600 mb-3">
                {campo.type === 'select' 
                  ? 'Lista de opções que aparecem no menu suspenso (adicione pelo menos 2)'
                  : campo.type === 'radio'
                  ? 'Opções de múltipla escolha - cliente escolhe apenas UMA opção'
                  : 'Opções de caixas - cliente pode marcar VÁRIAS opções'}
              </p>
              <div className="space-y-2 mb-3">
                {campo.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const novasOpcoes = [...(campo.options || [])]
                        novasOpcoes[idx] = e.target.value
                        onChange({ ...campo, options: novasOpcoes })
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removerOpcao(idx)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaOpcao}
                  onChange={(e) => setNovaOpcao(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && adicionarOpcao()}
                  placeholder="Nova opção"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={adicionarOpcao}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          {(campo.type === 'number' || campo.type === 'range') && (
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
              <p className="text-sm font-medium text-blue-900 mb-3">
                {campo.type === 'number' 
                  ? '📊 Configurações de Número'
                  : '📊 Configurações de Escala'}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Mínimo
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {campo.type === 'number' 
                      ? 'Menor valor permitido (ex: 0 para peso)'
                      : 'Menor valor da escala (ex: 1)'}
                  </p>
                  <input
                    type="number"
                    value={campo.min || ''}
                    onChange={(e) => onChange({ ...campo, min: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder={campo.type === 'number' ? 'Ex: 0' : 'Ex: 1'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Máximo
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    {campo.type === 'number' 
                      ? 'Maior valor permitido (ex: 200 para peso)'
                      : 'Maior valor da escala (ex: 10)'}
                  </p>
                  <input
                    type="number"
                    value={campo.max || ''}
                    onChange={(e) => onChange({ ...campo, max: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder={campo.type === 'number' ? 'Ex: 200' : 'Ex: 10'}
                  />
                </div>
              </div>
              {campo.type === 'range' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Incremento (Step)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">De quanto em quanto o valor aumenta (ex: 1 para números inteiros, 0.5 para decimais)</p>
                  <input
                    type="number"
                    value={campo.step || 1}
                    onChange={(e) => onChange({ ...campo, step: e.target.value ? parseFloat(e.target.value) : 1 })}
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    placeholder="Ex: 1"
                  />
                </div>
              )}
              {campo.type === 'number' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidade (opcional)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Unidade de medida que aparece ao lado do número (ex: kg, cm, litros, copos)</p>
                  <input
                    type="text"
                    value={campo.unit || ''}
                    onChange={(e) => onChange({ ...campo, unit: e.target.value })}
                    placeholder="Ex: kg, cm, litros"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {(campo.type === 'date' || campo.type === 'time') ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de Ajuda (opcional)
              </label>
              <p className="text-xs text-gray-500 mb-2">Texto que aparece abaixo do campo para orientar o cliente</p>
              <input
                type="text"
                value={campo.helpText || ''}
                onChange={(e) => onChange({ ...campo, helpText: e.target.value })}
                placeholder={campo.type === 'date' ? 'Ex: Selecione sua data de nascimento' : 'Ex: Selecione o horário da refeição'}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de Ajuda (aparece abaixo do campo)
              </label>
              <p className="text-xs text-gray-500 mb-2">Texto explicativo que aparece abaixo do campo para orientar o cliente (opcional)</p>
              <input
                type="text"
                value={campo.helpText || ''}
                onChange={(e) => onChange({ ...campo, helpText: e.target.value })}
                placeholder={getHelpTextExample(campo.type)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancelar}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSalvar}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Salvar Campo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}