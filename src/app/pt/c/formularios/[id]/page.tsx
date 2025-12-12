'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import CoachSidebar from "@/components/coach/CoachSidebar"
import { useAuth } from '@/contexts/AuthContext'

// Importar tipos e componentes da página de criação
import { 
  FieldType,
  Field,
  TooltipButton, 
  getFieldTypeLabel, 
  getFieldDescription, 
  getFieldPlaceholderExample, 
  getPlaceholderExample, 
  getHelpTextExample, 
  renderFieldPreview, 
  ModalEditarCampo 
} from '../novo/page'

export default function EditarFormularioCoach() {
  return (
    <ProtectedRoute perfil="coach" allowAdmin={true}>
      <EditarFormularioCoachContent />
    </ProtectedRoute>
  )
}

function EditarFormularioCoachContent() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const formId = params.id as string
  const [carregando, setCarregando] = useState(true)
  const [formulario, setFormulario] = useState<any>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null)
  const [mensagemErro, setMensagemErro] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !formId) return

    const carregarFormulario = async () => {
      try {
        setCarregando(true)
        const response = await fetch(`/api/coach/formularios/${formId}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Formulário não encontrado')
        }

        const data = await response.json()
        if (data.success && data.data.form) {
          setFormulario(data.data.form)
        }
      } catch (error: any) {
        console.error('Erro ao carregar formulário:', error)
        setMensagemErro('Erro ao carregar formulário. Redirecionando...')
        setTimeout(() => router.push('/pt/c/formularios'), 2000)
      } finally {
        setCarregando(false)
      }
    }

    carregarFormulario()
  }, [user, formId, router])

  if (loading || carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!formulario) {
    return null
  }

  return (
    <EditarFormularioWrapper 
      formId={formId} 
      formularioInicial={formulario}
      mensagemSucesso={mensagemSucesso}
      setMensagemSucesso={setMensagemSucesso}
      mensagemErro={mensagemErro}
      setMensagemErro={setMensagemErro}
    />
  )
}

function EditarFormularioWrapper({ 
  formId, 
  formularioInicial,
  mensagemSucesso,
  setMensagemSucesso,
  mensagemErro,
  setMensagemErro
}: { 
  formId: string
  formularioInicial: any
  mensagemSucesso: string | null
  setMensagemSucesso: (msg: string | null) => void
  mensagemErro: string | null
  setMensagemErro: (msg: string | null) => void
}) {
  const router = useRouter()
  const [salvando, setSalvando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mostrarConfirmacaoExclusao, setMostrarConfirmacaoExclusao] = useState(false)
  
  const [formData, setFormData] = useState({
    name: formularioInicial.name || '',
    description: formularioInicial.description || '',
    form_type: formularioInicial.form_type || 'questionario'
  })
  
  const [fields, setFields] = useState<Field[]>(formularioInicial.structure?.fields || [])
  const [fieldEditando, setFieldEditando] = useState<Field | null>(null)
  const [mostrarModalCampo, setMostrarModalCampo] = useState(false)

  // Funções reutilizadas da página de criação
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
      setMensagemErro('Preencha o rótulo do campo')
      return
    }

    if (fieldEditando.type === 'select' || fieldEditando.type === 'radio') {
      if (!fieldEditando.options || fieldEditando.options.length < 2) {
        setMensagemErro('Adicione pelo menos 2 opções')
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
    setMensagemErro(null)

    if (!formData.name.trim()) {
      setMensagemErro('Nome do formulário é obrigatório')
      return
    }

    if (fields.length === 0) {
      setMensagemErro('Adicione pelo menos um campo ao formulário')
      return
    }

    setSalvando(true)

    try {
      const response = await fetch(`/api/c/formularios/${formId}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Erro ao atualizar formulário')
      }

      if (data.success) {
        setMensagemSucesso('Formulário atualizado com sucesso!')
        setTimeout(() => {
          router.push('/pt/c/formularios')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Erro ao atualizar formulário:', error)
      setMensagemErro(error.message || 'Erro ao atualizar formulário. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  const handleExcluir = async () => {
    setExcluindo(true)
    setMensagemErro(null)

    try {
      const response = await fetch(`/api/c/formularios/${formId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir formulário')
      }

      if (data.success) {
        setMensagemSucesso('Formulário excluído com sucesso!')
        setMostrarConfirmacaoExclusao(false)
        setTimeout(() => {
          router.push('/pt/c/formularios')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Erro ao excluir formulário:', error)
      setMensagemErro(error.message || 'Erro ao excluir formulário. Tente novamente.')
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar 
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      
      {/* Notificações */}
      {mensagemSucesso && (
        <div className="fixed top-4 right-4 bg-green-50 border-2 border-green-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-green-600 text-2xl">✅</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-green-900 mb-1">Sucesso!</h3>
              <p className="text-xs text-green-700">{mensagemSucesso}</p>
            </div>
            <button 
              onClick={() => setMensagemSucesso(null)}
              className="text-green-600 hover:text-green-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {mensagemErro && (
        <div className="fixed top-4 right-4 bg-red-50 border-2 border-red-400 rounded-lg shadow-lg p-4 z-50 max-w-md" style={{ animation: 'slideInRight 0.3s ease-out' }}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">❌</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-red-900 mb-1">Erro</h3>
              <p className="text-xs text-red-700">{mensagemErro}</p>
            </div>
            <button 
              onClick={() => setMensagemErro(null)}
              className="text-red-600 hover:text-red-800 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {mostrarConfirmacaoExclusao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setMostrarConfirmacaoExclusao(false)}>
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 text-2xl">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Excluir Formulário</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Tem certeza que deseja excluir o formulário <strong>"{formData.name}"</strong>?
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Esta ação não pode ser desfeita. Todas as respostas relacionadas a este formulário também serão removidas.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacaoExclusao(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  disabled={excluindo}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExcluir}
                  disabled={excluindo}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                >
                  {excluindo ? 'Excluindo...' : 'Sim, excluir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
          <h1 className="text-lg font-semibold text-gray-900">Editar Formulário</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pt/c/formularios')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Editar Formulário</h1>
                <p className="text-gray-600 mt-1">Atualize seu formulário personalizado</p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarConfirmacaoExclusao(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <span>🗑️</span>
                Excluir
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📋 Informações Iniciais</h2>
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

            {/* Builder de Campos - Reutilizar da página de criação */}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  👁️ Preview do Formulário
                </h2>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  Atualização em tempo real
                </div>
              </div>
              {fields.length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{formData.name || 'Formulário'}</h3>
                  {formData.description && (
                    <p className="text-gray-600 mb-6">{formData.description}</p>
                  )}
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
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">📝 Formulário vazio</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Adicione campos para ver o preview aqui
                  </p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 max-w-sm mx-auto">
                    <p className="text-xs text-purple-800">
                      💡 <strong>Dica:</strong> Use os botões acima para adicionar campos
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.push('/pt/c/formularios')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={salvando}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {salvando ? 'Salvando...' : 'Salvar Alterações'}
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




