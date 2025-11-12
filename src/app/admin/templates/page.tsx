'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Template {
  id: string
  name: string
  type: string
  language: string
  specialization?: string
  objective?: string
  title: string
  description?: string
  content: any
  cta_text?: string
  whatsapp_message?: string
  is_active: boolean
  usage_count: number
  created_at: string
  updated_at: string
  stats: {
    linksCriados: number
    totalViews: number
    totalLeads: number
    totalConversoes: number
    taxaConversao: number
  }
}

function AdminTemplatesContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  
  // Filtros
  const [area, setArea] = useState<'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra'>('todos')
  const [type, setType] = useState<'todos' | 'quiz' | 'calculadora' | 'planilha'>('todos')
  const [status, setStatus] = useState<'todos' | 'active' | 'inactive'>('todos')
  const [language, setLanguage] = useState<'todos' | 'pt' | 'en' | 'es'>('todos')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'usage' | 'recent' | 'name'>('usage')

  // Modal de criação/edição
  const [showModal, setShowModal] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'quiz' as 'quiz' | 'calculadora' | 'planilha',
    language: 'pt',
    specialization: '',
    objective: '',
    title: '',
    description: '',
    content: '{}',
    cta_text: '',
    whatsapp_message: '',
    is_active: true
  })

  // Carregar templates
  useEffect(() => {
    carregarTemplates()
  }, [area, type, status, language, search, sort])

  const carregarTemplates = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (area !== 'todos') params.append('area', area)
      if (type !== 'todos') params.append('type', type)
      if (status !== 'todos') params.append('status', status)
      if (language !== 'todos') params.append('language', language)
      if (search) params.append('search', search)
      if (sort) params.append('sort', sort)

      const url = `/api/admin/templates${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url, { credentials: 'include' })

      if (!response.ok) {
        throw new Error('Erro ao carregar templates')
      }

      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates || [])
      } else {
        throw new Error('Formato de dados inválido')
      }
    } catch (err: any) {
      console.error('Erro ao carregar templates:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (templateId: string) => {
    try {
      const response = await fetch(`/api/admin/templates/${templateId}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      })

      if (response.ok) {
        carregarTemplates()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao alterar status')
      }
    } catch (err: any) {
      alert('Erro ao alterar status: ' + err.message)
    }
  }

  const handleDuplicate = async (template: Template) => {
    if (!confirm(`Deseja duplicar o template "${template.name}"?`)) return

    try {
      const response = await fetch(`/api/admin/templates/${template.id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: `${template.name} (Cópia)`
        })
      })

      if (response.ok) {
        carregarTemplates()
        alert('Template duplicado com sucesso!')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao duplicar template')
      }
    } catch (err: any) {
      alert('Erro ao duplicar template: ' + err.message)
    }
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      type: template.type as any,
      language: template.language as any,
      specialization: template.specialization || '',
      objective: template.objective || '',
      title: template.title,
      description: template.description || '',
      content: JSON.stringify(template.content, null, 2),
      cta_text: template.cta_text || '',
      whatsapp_message: template.whatsapp_message || '',
      is_active: template.is_active
    })
    setShowModal(true)
  }

  const handleNew = () => {
    setEditingTemplate(null)
    setFormData({
      name: '',
      type: 'quiz',
      language: 'pt',
      specialization: '',
      objective: '',
      title: '',
      description: '',
      content: '{}',
      cta_text: '',
      whatsapp_message: '',
      is_active: true
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      // Validar JSON
      JSON.parse(formData.content)

      const url = editingTemplate
        ? `/api/admin/templates/${editingTemplate.id}`
        : '/api/admin/templates'
      
      const method = editingTemplate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          content: JSON.parse(formData.content)
        })
      })

      if (response.ok) {
        setShowModal(false)
        carregarTemplates()
        alert(editingTemplate ? 'Template atualizado com sucesso!' : 'Template criado com sucesso!')
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao salvar template')
      }
    } catch (err: any) {
      if (err.message.includes('JSON')) {
        alert('Erro: Conteúdo JSON inválido')
      } else {
        alert('Erro ao salvar: ' + err.message)
      }
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '❓'
      case 'calculadora': return '🔢'
      case 'planilha': return '📊'
      default: return '📄'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                <p className="text-sm text-gray-600">Gerenciar templates prontos do sistema</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                + Novo Template
              </button>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Voltar
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome, título ou descrição..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="wellness">Wellness</option>
                <option value="nutri">Nutri</option>
                <option value="coach">Coach</option>
                <option value="nutra">Nutra</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="quiz">Quiz</option>
                <option value="calculadora">Calculadora</option>
                <option value="planilha">Planilha</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            {/* Idioma */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="todos">Todos</option>
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>

          {/* Ordenação */}
          <div className="mt-4 flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            {(['usage', 'recent', 'name'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sort === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {s === 'usage' ? 'Mais Usados' : s === 'recent' ? 'Mais Recentes' : 'Nome'}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Templates */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando templates...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-500">Nenhum template encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getTypeIcon(template.type)}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500">{template.type} • {template.language}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleStatus(template.id)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      template.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {template.is_active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>

                {/* Descrição */}
                {template.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                )}

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500">Links Criados</p>
                    <p className="text-lg font-bold text-gray-900">{template.stats.linksCriados}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Visualizações</p>
                    <p className="text-lg font-bold text-gray-900">{template.stats.totalViews.toLocaleString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Leads</p>
                    <p className="text-lg font-bold text-green-600">{template.stats.totalLeads}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversões</p>
                    <p className="text-lg font-bold text-yellow-600">{template.stats.totalConversoes}</p>
                  </div>
                </div>

                {/* Taxa de Conversão */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">Taxa de Conversão</span>
                    <span className="font-medium">{template.stats.taxaConversao.toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(template.stats.taxaConversao, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDuplicate(template)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                  >
                    Duplicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Criação/Edição */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="quiz">Quiz</option>
                    <option value="calculadora">Calculadora</option>
                    <option value="planilha">Planilha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Idioma *</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pt">Português</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conteúdo JSON *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  rows={10}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={formData.cta_text}
                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem WhatsApp</label>
                  <input
                    type="text"
                    value={formData.whatsapp_message}
                    onChange={(e) => setFormData({ ...formData, whatsapp_message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminTemplatesPage() {
  return (
    <AdminProtectedRoute>
      <AdminTemplatesContent />
    </AdminProtectedRoute>
  )
}

