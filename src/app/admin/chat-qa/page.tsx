'use client'

import { useState, useEffect } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

interface ChatQA {
  id: string
  pergunta: string
  resposta: string
  area: string | null
  tags: string[]
  prioridade: number
  ativa: boolean
  vezes_usada: number
  vezes_ajudou: number
  vezes_nao_ajudou: number
  criado_em: string
}

export default function AdminChatQAPage() {
  return (
    <ProtectedRoute perfil="admin">
      <AdminChatQAContent />
    </ProtectedRoute>
  )
}

function AdminChatQAContent() {
  const { user } = useAuth()
  const [qaList, setQaList] = useState<ChatQA[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filtroArea, setFiltroArea] = useState<string>('todas')
  const [busca, setBusca] = useState('')

  const [formData, setFormData] = useState({
    pergunta: '',
    resposta: '',
    area: '',
    tags: '',
    prioridade: 0
  })

  useEffect(() => {
    carregarQA()
  }, [])

  const carregarQA = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/chat-qa', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setQaList(data)
      }
    } catch (error) {
      console.error('Erro ao carregar QA:', error)
    } finally {
      setLoading(false)
    }
  }

  const salvarQA = async () => {
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const body = editingId
        ? { ...formData, id: editingId, tags: tagsArray }
        : { ...formData, tags: tagsArray }

      const response = await fetch('/api/chat/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })

      if (response.ok) {
        await carregarQA()
        resetForm()
        alert(editingId ? 'Resposta atualizada!' : 'Resposta criada!')
      } else {
        const error = await response.json()
        alert('Erro: ' + (error.error || 'Erro ao salvar'))
      }
    } catch (error) {
      console.error('Erro ao salvar QA:', error)
      alert('Erro ao salvar')
    }
  }

  const deletarQA = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta resposta?')) return

    try {
      const response = await fetch(`/api/chat/qa/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        await carregarQA()
        alert('Resposta deletada!')
      }
    } catch (error) {
      console.error('Erro ao deletar QA:', error)
      alert('Erro ao deletar')
    }
  }

  const editarQA = (qa: ChatQA) => {
    setFormData({
      pergunta: qa.pergunta,
      resposta: qa.resposta,
      area: qa.area || '',
      tags: qa.tags.join(', '),
      prioridade: qa.prioridade
    })
    setEditingId(qa.id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      pergunta: '',
      resposta: '',
      area: '',
      tags: '',
      prioridade: 0
    })
    setEditingId(null)
    setShowForm(false)
  }

  const qaFiltradas = qaList.filter(qa => {
    const matchArea = filtroArea === 'todas' || qa.area === filtroArea || (!qa.area && filtroArea === 'todas')
    const matchBusca = busca === '' || 
      qa.pergunta.toLowerCase().includes(busca.toLowerCase()) ||
      qa.resposta.toLowerCase().includes(busca.toLowerCase())
    return matchArea && matchBusca
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gerenciar Perguntas e Respostas do ChatIA
          </h1>
          <p className="text-gray-600">
            Adicione e gerencie respostas que o ChatIA pode usar. O sistema aprende com perguntas frequentes.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {showForm ? 'Cancelar' : '+ Nova Resposta'}
            </button>

            <div className="flex gap-4">
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="todas">Todas as áreas</option>
                <option value="coach">Coach</option>
                <option value="nutri">Nutri</option>
                <option value="wellness">Wellness</option>
              </select>

              <input
                type="text"
                placeholder="Buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {showForm && (
            <div className="border-t pt-4 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pergunta *
                  </label>
                  <input
                    type="text"
                    value={formData.pergunta}
                    onChange={(e) => setFormData({ ...formData, pergunta: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ex: Como cadastrar um cliente?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resposta *
                  </label>
                  <textarea
                    value={formData.resposta}
                    onChange={(e) => setFormData({ ...formData, resposta: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                    placeholder="Digite a resposta completa..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Área
                    </label>
                    <select
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Todas</option>
                      <option value="coach">Coach</option>
                      <option value="nutri">Nutri</option>
                      <option value="wellness">Wellness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Ex: clientes, cadastro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prioridade (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.prioridade}
                      onChange={(e) => setFormData({ ...formData, prioridade: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={salvarQA}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingId ? 'Atualizar' : 'Criar'}
                  </button>
                  <button
                    onClick={resetForm}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pergunta</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estatísticas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qaFiltradas.map((qa) => (
                  <tr key={qa.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{qa.pergunta}</div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">{qa.resposta.substring(0, 100)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {qa.area || 'Todas'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {qa.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Usada: {qa.vezes_usada}</div>
                      <div>✅ {qa.vezes_ajudou} | ❌ {qa.vezes_nao_ajudou}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => editarQA(qa)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deletarQA(qa.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {qaFiltradas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhuma resposta encontrada. Crie a primeira!
          </div>
        )}
      </div>
    </div>
  )
}

