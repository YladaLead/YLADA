'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/c/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

export default function NovoFormularioCoach() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <NovoFormularioCoachContent />
    </ProtectedRoute>
  )
}

export type FieldType = 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'time' | 'email' | 'tel' | 'yesno' | 'range' | 'file'

export interface Field {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  required: boolean
  options?: string[]
  min?: number
  max?: number
  step?: number // Para range e number
  unit?: string // Para number (ex: "kg", "cm")
  helpText?: string // Texto de ajuda abaixo do campo
}

// Componente TooltipButton
export function TooltipButton({ 
  children, 
  onClick, 
  className, 
  tooltip 
}: { 
  children: React.ReactNode
  onClick: () => void
  className: string
  tooltip: string
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={className}
      >
        {children}
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-50 max-w-xs whitespace-normal">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

function NovoFormularioCoachContent() {
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

  const adicionarCampo = (tipo: FieldType) => {
    const novoCampo: Field = {
      id: `field_${Date.now()}`,
      type: tipo,
      label: '',
      required: false,
      placeholder: tipo === 'text' ? 'Digite aqui...' : tipo === 'textarea' ? 'Descreva aqui...' : undefined,
      options: tipo === 'select' || tipo === 'radio' ? ['Opção 1', 'Opção 2'] : undefined
    }
    setFieldEditando(novoCampo)
    setMostrarModalCampo(true)
  }

  const salvarCampo = () => {
    if (!fieldEditando || !fieldEditando.label.trim()) {
      alert('Preencha o rótulo do campo')
      return
    }

    if (fieldEditando.type === 'select' || fieldEditando.type === 'radio') {
      if (!fieldEditando.options || fieldEditando.options.length < 2) {
        alert('Adicione pelo menos 2 opções')
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

  const moverCampo = (index: number, direcao: 'up' | 'down') => {
    if (direcao === 'up' && index === 0) return
    if (direcao === 'down' && index === fields.length - 1) return

    const novosFields = [...fields]
    const temp = novosFields[index]
    novosFields[index] = novosFields[direcao === 'up' ? index - 1 : index + 1]
    novosFields[direcao === 'up' ? index - 1 : index + 1] = temp
    setFields(novosFields)
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
      const response = await fetch('/api/c/formularios', {
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
          router.push('/pt/coach/formularios')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

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
          <h1 className="text-lg font-semibold text-gray-900">Novo Formulário</h1>
          <div className="w-10"></div>
        </div>

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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Criar Formulário Personalizado</h1>
            <p className="text-gray-600 mt-1">Construa seu formulário de anamnese ou avaliação</p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Formulário *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Ex: Anamnese Inicial"
                  />
                </div>
                <div>
                  <label htmlFor="form_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    id="form_type"
                    value={formData.form_type}
                    onChange={(e) => setFormData({ ...formData, form_type: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="questionario">Questionário</option>
                    <option value="anamnese">Anamnese</option>
                    <option value="avaliacao">Avaliação</option>
                    <option value="consentimento">Consentimento</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Descreva o objetivo deste formulário..."
                  />
                </div>
              </div>
            </div>

            {/* Builder de Campos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Campos do Formulário</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  <TooltipButton
                    onClick={() => adicionarCampo('text')}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium border border-purple-200"
                    tooltip="Campo de texto curto para nomes, objetivos, respostas breves"
                  >
                    📝 Texto
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('textarea')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium border border-green-200"
                    tooltip="Campo de texto longo para observações, históricos, descrições detalhadas"
                  >
                    📄 Texto Longo
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('select')}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium border border-purple-200"
                    tooltip="Lista suspensa - cliente escolhe uma opção de uma lista"
                  >
                    📋 Seleção
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('radio')}
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium border border-indigo-200"
                    tooltip="Múltipla escolha - cliente escolhe apenas UMA opção entre várias"
                  >
                    ⚪ Múltipla Escolha
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('checkbox')}
                    className="px-3 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors text-sm font-medium border border-pink-200"
                    tooltip="Caixas de seleção - cliente pode marcar VÁRIAS opções"
                  >
                    ☑️ Caixas
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('number')}
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium border border-orange-200"
                    tooltip="Campo numérico para peso, altura, medidas, quantidades (pode ter unidade como kg, cm)"
                  >
                    🔢 Número
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('date')}
                    className="px-3 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium border border-teal-200"
                    tooltip="Seletor de data com calendário - ao clicar, abre um calendário visual. Ideal para data de nascimento, início de programa, consultas"
                  >
                    📅 Data
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('time')}
                    className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-200 transition-colors text-sm font-medium border border-cyan-200"
                    tooltip="Seletor de hora - ao clicar, abre um seletor de hora visual. Ideal para horários de refeições, treinos, medicações"
                  >
                    🕐 Hora
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('email')}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium border border-yellow-200"
                    tooltip="Campo de e-mail com validação automática"
                  >
                    ✉️ E-mail
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('tel')}
                    className="px-3 py-2 bg-lime-100 text-lime-700 rounded-lg hover:bg-lime-200 transition-colors text-sm font-medium border border-lime-200"
                    tooltip="Campo de telefone com formatação automática"
                  >
                    📞 Telefone
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('yesno')}
                    className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium border border-emerald-200"
                    tooltip="Pergunta simples Sim/Não - ideal para questões diretas como 'Pratica exercícios?'"
                  >
                    ✅ Sim/Não
                  </TooltipButton>
                  <TooltipButton
                    onClick={() => adicionarCampo('range')}
                    className="px-3 py-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium border border-rose-200"
                    tooltip="Escala deslizante (slider) para notas de 1-10, níveis de energia, dor, etc"
                  >
                    📊 Escala
                  </TooltipButton>
                </div>
              </div>

              {fields.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-4">Nenhum campo adicionado ainda</p>
                  <p className="text-sm text-gray-500">Clique nos botões acima para adicionar campos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{field.label}</span>
                          {field.required && (
                            <span className="text-xs text-red-600">*</span>
                          )}
                          <span className="text-xs text-gray-500">({getFieldTypeLabel(field.type)})</span>
                        </div>
                        {field.placeholder && (
                          <p className="text-xs text-gray-500">{field.placeholder}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moverCampo(index, 'up')}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moverCampo(index, 'down')}
                          disabled={index === fields.length - 1}
                          className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => editarCampo(field)}
                          className="p-2 text-purple-600 hover:text-purple-700"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => removerCampo(field.id)}
                          className="p-2 text-red-600 hover:text-red-700"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview */}
            {fields.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{formData.name || 'Formulário'}</h3>
                  {formData.description && (
                    <p className="text-gray-600 mb-6">{formData.description}</p>
                  )}
                  {(fields.some(f => f.type === 'date' || f.type === 'time') && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-xs text-purple-800">
                        <strong>💡 Dica:</strong> Os campos de Data e Hora abrem calendários/seletores visuais quando o cliente clicar neles.
                      </p>
                    </div>
                  ))}
                  <div className="space-y-4">
                    {fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.label}
                          {field.required && <span className="text-red-600 ml-1">*</span>}
                        </label>
                        <div className="relative">
                          {renderFieldPreview(field)}
                          {field.unit && field.type === 'number' && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                              {field.unit}
                            </span>
                          )}
                        </div>
                        {field.helpText && (
                          <p className="mt-1 text-xs text-gray-500">{field.helpText}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/pt/coach/formularios')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar Formulário'}
              </button>
            </div>
          </form>
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

export function getFieldTypeLabel(type: FieldType): string {
  const labels: Record<FieldType, string> = {
    text: 'Texto',
    textarea: 'Texto Longo',
    select: 'Seleção',
    radio: 'Múltipla Escolha',
    checkbox: 'Caixa de Seleção',
    number: 'Número',
    date: 'Data',
    time: 'Hora',
    email: 'E-mail',
    tel: 'Telefone',
    yesno: 'Sim/Não',
    range: 'Escala',
    file: 'Upload de Arquivo'
  }
  return labels[type] || type
}

export function getFieldDescription(type: FieldType): string {
  const descriptions: Record<FieldType, string> = {
    text: 'Campo de texto curto para nomes, objetivos, respostas breves',
    textarea: 'Campo de texto longo para observações, históricos, descrições detalhadas',
    select: 'Lista suspensa - cliente escolhe uma opção de uma lista',
    radio: 'Múltipla escolha - cliente escolhe apenas UMA opção entre várias',
    checkbox: 'Caixas de seleção - cliente pode marcar VÁRIAS opções',
    number: 'Campo numérico para peso, altura, medidas, quantidades (pode ter unidade como kg, cm)',
    date: 'Seletor de data com calendário visual - ao clicar, abre um calendário para escolher a data. Ideal para data de nascimento, início de programa, consultas, prazos',
    time: 'Seletor de hora com relógio visual - ao clicar, abre um seletor de hora. Ideal para horários de refeições, treinos, medicações, lembretes',
    email: 'Campo de e-mail com validação automática',
    tel: 'Campo de telefone com formatação automática',
    yesno: 'Pergunta simples Sim/Não - ideal para questões diretas como "Pratica exercícios regularmente?"',
    range: 'Escala deslizante (slider) para notas de 1-10, níveis de energia, dor, satisfação, etc',
    file: 'Upload de arquivo para fotos, documentos, exames médicos'
  }
  return descriptions[type] || ''
}

export function getFieldPlaceholderExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Nome completo',
    textarea: 'Ex: Descreva seu objetivo principal',
    select: 'Ex: Objetivo principal',
    radio: 'Ex: Tipo de atividade física',
    checkbox: 'Ex: Sintomas apresentados',
    number: 'Ex: Peso atual',
    date: 'Ex: Data de nascimento',
    time: 'Ex: Horário do café da manhã',
    email: 'Ex: Seu melhor e-mail',
    tel: 'Ex: Telefone para contato',
    yesno: 'Ex: Pratica exercícios regularmente?',
    range: 'Ex: Nível de energia (1-10)',
    file: 'Ex: Foto de perfil'
  }
  return examples[type] || 'Ex: Nome do campo'
}

export function getPlaceholderExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Digite seu nome completo',
    textarea: 'Ex: Descreva em detalhes...',
    select: 'Ex: Selecione uma opção',
    radio: '',
    checkbox: '',
    number: 'Ex: 70',
    date: 'Clique para abrir o calendário',
    time: 'Clique para abrir o seletor de hora',
    email: 'Ex: seu@email.com',
    tel: 'Ex: (11) 99999-9999',
    yesno: '',
    range: '',
    file: ''
  }
  return examples[type] || 'Texto que aparece dentro do campo'
}

export function getHelpTextExample(type: FieldType): string {
  const examples: Record<FieldType, string> = {
    text: 'Ex: Digite seu nome completo como aparece no documento',
    textarea: 'Ex: Seja o mais detalhado possível',
    select: 'Ex: Escolha a opção que melhor descreve sua situação',
    radio: 'Ex: Selecione apenas uma opção',
    checkbox: 'Ex: Marque todas as opções que se aplicam',
    number: 'Ex: Digite seu peso atual em quilogramas',
    date: 'Ex: Clique no calendário para escolher a data (ex: data de nascimento, início do programa)',
    time: 'Ex: Clique no relógio para escolher o horário (ex: horário das refeições, treinos)',
    email: 'Ex: Usaremos este e-mail para enviar informações importantes',
    tel: 'Ex: Inclua o DDD',
    yesno: 'Ex: Responda Sim ou Não',
    range: 'Ex: Arraste o indicador para escolher seu nível',
    file: 'Ex: Formatos aceitos: JPG, PNG, PDF (máx. 5MB)'
  }
  return examples[type] || 'Ex: Texto de ajuda para o cliente'
}

export function renderFieldPreview(field: Field) {
  switch (field.type) {
    case 'text':
    case 'email':
    case 'tel':
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        />
      )
    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder}
          rows={4}
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white resize-none"
        />
      )
    case 'select':
      return (
        <select
          disabled
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
        >
          <option>Selecione uma opção</option>
          {field.options?.map((opt, idx) => (
            <option key={idx}>{opt}</option>
          ))}
        </select>
      )
    case 'radio':
      return (
        <div className="space-y-2">
          {field.options?.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="radio" disabled className="text-purple-600" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-2">
          {field.options?.map((opt, idx) => (
            <label key={idx} className="flex items-center gap-2">
              <input type="checkbox" disabled className="text-purple-600" />
              <span className="text-sm text-gray-700">{opt}</span>
            </label>
          ))}
        </div>
      )
    case 'number':
      return (
        <div className="relative">
          <input
            type="number"
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            disabled
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg bg-white ${field.unit ? 'pr-12' : ''}`}
          />
          {field.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">
              {field.unit}
            </span>
          )}
        </div>
      )
    case 'date':
      return (
        <div className="relative">
          <input
            type="date"
            disabled
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white cursor-pointer"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )
    case 'time':
      return (
        <div className="relative">
          <input
            type="time"
            disabled
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-white cursor-pointer"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      )
    case 'yesno':
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name={`yesno-${field.id}`} value="sim" disabled className="text-purple-600" />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name={`yesno-${field.id}`} value="nao" disabled className="text-purple-600" />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
      )
    case 'range':
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={field.min || 1}
            max={field.max || 10}
            step={field.step || 1}
            disabled
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{field.min || 1}</span>
            <span>{field.max || 10}</span>
          </div>
        </div>
      )
    case 'file':
      return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">Clique para fazer upload</p>
          <input
            type="file"
            disabled
            className="hidden"
          />
        </div>
      )
    default:
      return null
  }
}

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={getFieldPlaceholderExample(campo.type)}
            />
          </div>

          {(campo.type === 'date' || campo.type === 'time') && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-purple-900 mb-2">💡 Como funciona:</p>
              <p className="text-xs text-purple-800">
                {campo.type === 'date' 
                  ? 'O cliente verá um campo com ícone de calendário. Ao clicar, abre automaticamente um calendário visual para escolher a data. Não precisa configurar nada além do rótulo acima.'
                  : 'O cliente verá um campo com ícone de relógio. Ao clicar, abre automaticamente um seletor de hora. Não precisa configurar nada além do rótulo acima.'}
              </p>
            </div>
          )}

          {campo.type !== 'date' && campo.type !== 'time' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto de Ajuda (Placeholder)
              </label>
              <p className="text-xs text-gray-500 mb-2">Texto que aparece dentro do campo antes do cliente digitar (opcional)</p>
              <input
                type="text"
                value={campo.placeholder || ''}
                onChange={(e) => onChange({ ...campo, placeholder: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="required" className="text-sm font-medium text-gray-700">
              Campo obrigatório
            </label>
          </div>

          {(campo.type === 'select' || campo.type === 'radio' || campo.type === 'checkbox') && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={adicionarOpcao}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          )}

          {(campo.type === 'number' || campo.type === 'range') && (
            <div className="space-y-4 bg-purple-50 p-4 rounded-lg border border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-3">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Salvar Campo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

