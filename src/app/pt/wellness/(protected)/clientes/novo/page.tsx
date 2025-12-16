'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

export default function NovoClienteWellness() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <NovoClienteWellnessContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function NovoClienteWellnessContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_contato: '',
    tipo_pessoa: '',
    objetivo_principal: '',
    status: 'lead'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.cliente_nome.trim()) {
      alert('Nome do cliente é obrigatório')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/wellness/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/pt/wellness/clientes/${data.cliente.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      alert('Erro ao criar cliente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Novo Cliente" />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Cliente</h1>
            <p className="text-gray-600 mt-1">Preencha as informações básicas do cliente</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nome */}
            <div>
              <label htmlFor="cliente_nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="cliente_nome"
                required
                value={formData.cliente_nome}
                onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Maria Silva"
              />
            </div>

            {/* Contato */}
            <div>
              <label htmlFor="cliente_contato" className="block text-sm font-medium text-gray-700 mb-2">
                Contato (WhatsApp, Email, etc.)
              </label>
              <input
                type="text"
                id="cliente_contato"
                value={formData.cliente_contato}
                onChange={(e) => setFormData({ ...formData, cliente_contato: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: (11) 99999-9999 ou email@exemplo.com"
              />
            </div>

            {/* Tipo de Pessoa */}
            <div>
              <label htmlFor="tipo_pessoa" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Pessoa
              </label>
              <select
                id="tipo_pessoa"
                value={formData.tipo_pessoa}
                onChange={(e) => setFormData({ ...formData, tipo_pessoa: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="proximo">Pessoa Próxima</option>
                <option value="indicacao">Indicação</option>
                <option value="instagram">Instagram</option>
                <option value="mercado_frio">Mercado Frio</option>
              </select>
            </div>

            {/* Objetivo Principal */}
            <div>
              <label htmlFor="objetivo_principal" className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo Principal
              </label>
              <select
                id="objetivo_principal"
                value={formData.objetivo_principal}
                onChange={(e) => setFormData({ ...formData, objetivo_principal: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                <option value="energia">Energia</option>
                <option value="metabolismo">Metabolismo</option>
                <option value="retencao">Retenção</option>
                <option value="foco">Foco</option>
                <option value="emagrecimento">Emagrecimento</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status Inicial
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="lead">Lead</option>
                <option value="cliente_kit">Cliente Kit</option>
                <option value="cliente_recorrente">Cliente Recorrente</option>
              </select>
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Salvando...' : 'Salvar Cliente'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}





