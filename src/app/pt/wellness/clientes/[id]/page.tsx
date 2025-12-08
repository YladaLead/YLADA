'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import Link from 'next/link'

interface Cliente {
  id: string
  cliente_nome: string
  cliente_contato?: string
  tipo_pessoa?: string
  objetivo_principal?: string
  status: string
  pv_total_cliente: number
  pv_mensal: number
  ultima_interacao?: string
  proxima_acao?: string
  produto_atual?: {
    id: string
    nome: string
    tipo: string
    pv: number
    categoria: string
  }
  ultima_compra?: {
    id: string
    data_compra: string
    previsao_recompra: string
    pv_total: number
    produto?: {
      id: string
      nome: string
      tipo: string
      pv: number
    }
  }
  compras?: Compra[]
}

interface Compra {
  id: string
  produto_id: string
  quantidade: number
  pv_total: number
  data_compra: string
  previsao_recompra: string
  observacoes?: string
  produto: {
    id: string
    nome: string
    tipo: string
    pv: number
    categoria: string
  }
}

export default function DetalhesClienteWellness() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <DetalhesClienteWellnessContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function DetalhesClienteWellnessContent() {
  const router = useRouter()
  const params = useParams()
  const clienteId = params.id as string

  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [loading, setLoading] = useState(true)
  const [abaAtiva, setAbaAtiva] = useState<'informacoes' | 'compras' | 'historico'>('informacoes')
  const [mostrarFormCompra, setMostrarFormCompra] = useState(false)

  useEffect(() => {
    if (clienteId) {
      carregarCliente()
    }
  }, [clienteId])

  const carregarCliente = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/wellness/clientes/${clienteId}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setCliente(data.cliente)
      } else {
        router.push('/pt/wellness/clientes')
      }
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      lead: { label: 'Lead', className: 'bg-blue-100 text-blue-800' },
      cliente_kit: { label: 'Cliente Kit', className: 'bg-yellow-100 text-yellow-800' },
      cliente_recorrente: { label: 'Recorrente', className: 'bg-green-100 text-green-800' },
      inativo: { label: 'Inativo', className: 'bg-gray-100 text-gray-800' },
      reativado: { label: 'Reativado', className: 'bg-purple-100 text-purple-800' }
    }
    return badges[status] || badges.lead
  }

  const formatarData = (data?: string) => {
    if (!data) return '-'
    return new Date(data).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Carregando..." />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Carregando cliente...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!cliente) {
    return null
  }

  const statusBadge = getStatusBadge(cliente.status)

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title={cliente.cliente_nome || 'Cliente'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{cliente.cliente_nome}</h1>
                {cliente.cliente_contato && (
                  <p className="text-gray-600 mt-1">{cliente.cliente_contato}</p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">PV Total</p>
                <p className="text-2xl font-bold text-green-600">{cliente.pv_total_cliente.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">PV Mensal</p>
                <p className="text-2xl font-bold text-gray-900">{cliente.pv_mensal.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total de Compras</p>
                <p className="text-2xl font-bold text-gray-900">{cliente.compras?.length || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Última Compra</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatarData(cliente.ultima_compra?.data_compra)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'informacoes', label: 'Informações' },
                { id: 'compras', label: 'Compras' },
                { id: 'historico', label: 'Histórico' }
              ].map((aba) => (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    abaAtiva === aba.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {aba.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Aba: Informações */}
            {abaAtiva === 'informacoes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Pessoa</label>
                    <p className="text-gray-900 capitalize">{cliente.tipo_pessoa || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objetivo Principal</label>
                    <p className="text-gray-900 capitalize">{cliente.objetivo_principal || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Produto Atual</label>
                    <p className="text-gray-900">{cliente.produto_atual?.nome || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Última Interação</label>
                    <p className="text-gray-900">{formatarData(cliente.ultima_interacao)}</p>
                  </div>
                </div>
                {cliente.proxima_acao && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Próxima Ação</label>
                    <p className="text-gray-900">{cliente.proxima_acao}</p>
                  </div>
                )}
                {cliente.ultima_compra && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-yellow-800 mb-1">Próxima Recompra</p>
                    <p className="text-lg font-bold text-yellow-900">
                      {formatarData(cliente.ultima_compra.previsao_recompra)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Aba: Compras */}
            {abaAtiva === 'compras' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Histórico de Compras</h2>
                  <button
                    onClick={() => setMostrarFormCompra(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    + Nova Compra
                  </button>
                </div>

                {mostrarFormCompra && (
                  <FormNovaCompra
                    clienteId={clienteId}
                    onSuccess={() => {
                      setMostrarFormCompra(false)
                      carregarCliente()
                    }}
                    onCancel={() => setMostrarFormCompra(false)}
                  />
                )}

                {cliente.compras && cliente.compras.length > 0 ? (
                  <div className="space-y-4">
                    {cliente.compras.map((compra) => (
                      <div
                        key={compra.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{compra.produto.nome}</h3>
                            <p className="text-sm text-gray-600">
                              {compra.quantidade}x • {formatarData(compra.data_compra)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{compra.pv_total.toFixed(2)} PV</p>
                            <p className="text-xs text-gray-500">
                              Recompra: {formatarData(compra.previsao_recompra)}
                            </p>
                          </div>
                        </div>
                        {compra.observacoes && (
                          <p className="text-sm text-gray-600 mt-2">{compra.observacoes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">Nenhuma compra registrada ainda</p>
                    <button
                      onClick={() => setMostrarFormCompra(true)}
                      className="mt-4 text-green-600 hover:text-green-700 font-medium"
                    >
                      Registrar primeira compra
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Aba: Histórico */}
            {abaAtiva === 'historico' && (
              <div>
                <p className="text-gray-600">Histórico de interações será implementado em breve</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Componente para formulário de nova compra
function FormNovaCompra({ 
  clienteId, 
  onSuccess, 
  onCancel 
}: { 
  clienteId: string
  onSuccess: () => void
  onCancel: () => void
}) {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: 1,
    data_compra: new Date().toISOString().split('T')[0],
    observacoes: ''
  })

  useEffect(() => {
    carregarProdutos()
  }, [])

  const carregarProdutos = async () => {
    try {
      const response = await fetch('/api/wellness/produtos', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        setProdutos(data.produtos || [])
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.produto_id) {
      alert('Selecione um produto')
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/wellness/clientes/${clienteId}/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const error = await response.json()
        alert(error.error || 'Erro ao registrar compra')
      }
    } catch (error) {
      console.error('Erro ao registrar compra:', error)
      alert('Erro ao registrar compra. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar Nova Compra</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Produto</label>
          <select
            required
            value={formData.produto_id}
            onChange={(e) => setFormData({ ...formData, produto_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Selecione um produto...</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome} - {produto.pv} PV
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
            <input
              type="number"
              min="1"
              value={formData.quantidade}
              onChange={(e) => setFormData({ ...formData, quantidade: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data da Compra</label>
            <input
              type="date"
              required
              value={formData.data_compra}
              onChange={(e) => setFormData({ ...formData, data_compra: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Observações (opcional)</label>
          <textarea
            value={formData.observacoes}
            onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Observações sobre esta compra..."
          />
        </div>
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Registrar Compra'}
          </button>
        </div>
      </form>
    </div>
  )
}





