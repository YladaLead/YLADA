'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

const supabase = createClient()

interface Subscription {
  id: string
  user_id: string
  usuario: string
  email: string
  area: 'nutri' | 'coach' | 'nutra' | 'wellness'
  tipo: 'mensal' | 'anual' | 'gratuito'
  valor: number
  status: 'ativa' | 'cancelada' | 'expirada' | 'atrasada' | 'não paga' | 'trial'
  dataInicio: string
  proxVencimento: string
  is_migrated?: boolean
  migrated_from?: string | null
  requires_manual_renewal?: boolean
  currency?: string
}

function AdminSubscriptionsContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Lista de assinaturas
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  
  // Formulário para criar plano gratuito
  const [freePlanForm, setFreePlanForm] = useState({
    user_id: '',
    email: '',
    name: '',
    area: 'wellness' as 'wellness' | 'nutri' | 'coach' | 'nutra',
    expires_in_days: 365
  })

  // Estados para busca de usuário
  const [buscaUsuario, setBuscaUsuario] = useState('')
  const [usuariosEncontrados, setUsuariosEncontrados] = useState<any[]>([])
  const [buscandoUsuario, setBuscandoUsuario] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null)
  const [loadingManual, setLoadingManual] = useState(false)


  // Buscar lista de assinaturas
  useEffect(() => {
    const carregarAssinaturas = async () => {
      try {
        setLoadingSubscriptions(true)
        const response = await fetch('/api/admin/receitas?status=active', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.receitas) {
            setSubscriptions(data.receitas.slice(0, 20)) // Limitar a 20 mais recentes
          }
        }
      } catch (err) {
        console.error('Erro ao carregar assinaturas:', err)
      } finally {
        setLoadingSubscriptions(false)
      }
    }

    carregarAssinaturas()
  }, [])


  // Buscar usuários por nome, email ou telefone
  const buscarUsuarios = async () => {
    if (!buscaUsuario.trim()) {
      setUsuariosEncontrados([])
      return
    }

    try {
      setBuscandoUsuario(true)
      const response = await fetch(`/api/admin/usuarios?busca=${encodeURIComponent(buscaUsuario)}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.usuarios) {
          setUsuariosEncontrados(data.usuarios.slice(0, 10)) // Limitar a 10 resultados
        } else {
          setUsuariosEncontrados([])
        }
      } else {
        setUsuariosEncontrados([])
      }
    } catch (err) {
      console.error('Erro ao buscar usuários:', err)
      setUsuariosEncontrados([])
    } finally {
      setBuscandoUsuario(false)
    }
  }

  // Debounce para busca
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      buscarUsuarios()
    }, buscaUsuario ? 500 : 0)

    return () => clearTimeout(timeoutId)
  }, [buscaUsuario])

  // Selecionar usuário
  const selecionarUsuario = (usuario: any) => {
    setUsuarioSelecionado(usuario)
    // A API retorna 'id' que é o user_id, mas vamos garantir que temos o valor correto
    const userId = usuario.id || usuario.user_id
    if (!userId) {
      console.error('❌ Usuário selecionado não tem id ou user_id:', usuario)
      setError('Erro: Usuário selecionado não tem ID válido')
      return
    }
    setFreePlanForm({ ...freePlanForm, user_id: userId, email: '', name: '' })
    setBuscaUsuario(`${usuario.nome} (${usuario.email})`)
    setUsuariosEncontrados([])
  }

  const handleCreateFreePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar que tem user_id (selecionado) OU email (para criar novo)
    const hasUserId = freePlanForm.user_id && freePlanForm.user_id.trim() !== ''
    const hasEmail = freePlanForm.email && freePlanForm.email.trim() !== ''
    
    if (!hasUserId && !hasEmail) {
      setError('Selecione um usuário existente ou preencha email e nome para criar novo usuário')
      return
    }

    // Se for criar novo usuário, validar email e nome
    if (!hasUserId && (!hasEmail || !freePlanForm.name || freePlanForm.name.trim() === '')) {
      setError('Para criar novo usuário, preencha email e nome')
      return
    }

    // Se tem usuário selecionado mas user_id está vazio, tentar usar o usuarioSelecionado
    if (!hasUserId && usuarioSelecionado) {
      const userId = usuarioSelecionado.id || usuarioSelecionado.user_id
      if (userId) {
        console.log('⚠️ user_id estava vazio, usando usuarioSelecionado.id:', userId)
        setFreePlanForm({ ...freePlanForm, user_id: userId })
        // Aguardar um tick para o estado atualizar
        await new Promise(resolve => setTimeout(resolve, 0))
      }
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Preparar body (remover campos vazios)
      // Usar o estado atualizado após possível correção
      const currentUserId = freePlanForm.user_id?.trim() || usuarioSelecionado?.id || usuarioSelecionado?.user_id || ''
      const currentEmail = freePlanForm.email?.trim() || ''
      
      const body: any = {
        area: freePlanForm.area,
        expires_in_days: freePlanForm.expires_in_days
      }

      // Debug: verificar o que está sendo enviado
      console.log('🔍 Debug - freePlanForm:', freePlanForm)
      console.log('🔍 Debug - usuarioSelecionado:', usuarioSelecionado)
      console.log('🔍 Debug - currentUserId:', currentUserId)

      if (currentUserId) {
        body.user_id = currentUserId
        console.log('✅ Enviando user_id:', body.user_id)
      } else if (currentEmail) {
        body.email = currentEmail
        body.name = freePlanForm.name?.trim() || ''
        console.log('✅ Criando novo usuário com email:', body.email)
      } else {
        setError('Erro: Nenhum usuário selecionado e nenhum email fornecido')
        setLoading(false)
        return
      }

      console.log('📤 Body final sendo enviado:', JSON.stringify(body, null, 2))

      const response = await fetch('/api/admin/subscriptions/free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao criar plano gratuito')
        return
      }

      const wasNewUser = !freePlanForm.user_id
      setSuccess(
        wasNewUser 
          ? `Usuário criado e plano gratuito criado com sucesso! Válido por ${freePlanForm.expires_in_days} dias.`
          : `Plano gratuito criado com sucesso! Válido por ${freePlanForm.expires_in_days} dias.`
      )
      setFreePlanForm({
        user_id: '',
        email: '',
        name: '',
        area: 'wellness',
        expires_in_days: 365
      })
      setBuscaUsuario('')
      setUsuarioSelecionado(null)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar plano gratuito')
    } finally {
      setLoading(false)
    }
  }

  // Incluir no plano mensal (Wellness) — assinatura manual
  const handleIncluirPlanoMensalWellness = async (e: React.FormEvent) => {
    e.preventDefault()
    const currentUserId = freePlanForm.user_id?.trim() || usuarioSelecionado?.id || usuarioSelecionado?.user_id || ''
    const currentEmail = freePlanForm.email?.trim() || ''
    if (!currentUserId && !currentEmail) {
      setError('Selecione um usuário na busca acima ou preencha email e nome (opção "Criar para pessoa NÃO cadastrada")')
      return
    }
    if (!currentUserId && (!currentEmail || !freePlanForm.name?.trim())) {
      setError('Para criar novo usuário e incluir no plano mensal, preencha email e nome')
      return
    }
    setLoadingManual(true)
    setError(null)
    setSuccess(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }
      const body: { area: string; plan_type: string; user_id?: string; email?: string; name?: string } = {
        area: 'wellness',
        plan_type: 'monthly',
      }
      if (currentUserId) body.user_id = currentUserId
      else {
        body.email = currentEmail
        body.name = freePlanForm.name?.trim() || ''
      }
      const response = await fetch('/api/admin/subscriptions/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error || 'Erro ao incluir no plano mensal')
        return
      }
      setSuccess(data.message || 'Incluída no plano mensal Wellness com sucesso.')
      setUsuarioSelecionado(null)
      setBuscaUsuario('')
      setFreePlanForm({ ...freePlanForm, user_id: '', email: '', name: '' })
    } catch (err: any) {
      setError(err.message || 'Erro ao incluir no plano mensal')
    } finally {
      setLoadingManual(false)
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
                <h1 className="text-2xl font-bold text-gray-900">Criar Plano Gratuito</h1>
                <p className="text-sm text-gray-600">Criar assinaturas gratuitas para usuários</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="max-w-2xl space-y-6">
          {/* Incluir no plano mensal (Wellness) */}
          <div className="bg-white rounded-lg shadow p-6 w-full border-l-4 border-blue-500">
            <h2 className="text-xl font-bold mb-2">📅 Incluir no plano mensal (Wellness)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Use quando o pagamento foi aprovado no Mercado Pago mas a assinatura não foi reconhecida. Busque o usuário abaixo (ou preencha email e nome para criar novo) e clique no botão.
            </p>
            <form onSubmit={handleIncluirPlanoMensalWellness} className="space-y-3">
              <p className="text-xs text-gray-500">
                Usuário: use a busca e seleção do formulário &quot;Criar Plano Gratuito&quot; abaixo, ou preencha email e nome na opção &quot;Criar para pessoa NÃO cadastrada&quot;.
              </p>
              <button
                type="submit"
                disabled={loadingManual || (!freePlanForm.user_id && !freePlanForm.email)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingManual ? 'Incluindo...' : 'Incluir no plano mensal Wellness'}
              </button>
            </form>
          </div>

          {/* Criar Plano Gratuito */}
          <div className="bg-white rounded-lg shadow p-6 w-full">
            <h2 className="text-xl font-bold mb-4">🎁 Criar Plano Gratuito</h2>
            <p className="text-sm text-gray-600 mb-4">
              Você pode criar planos para <strong>usuários já cadastrados</strong> ou para <strong>pessoas não cadastradas</strong> (será criado um novo usuário automaticamente).
            </p>
            
            {/* Opção rápida: Criar para pessoa não cadastrada */}
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-blue-900">✨ Criar para pessoa NÃO cadastrada</h3>
                <button
                  type="button"
                  onClick={() => {
                    setBuscaUsuario('')
                    setUsuarioSelecionado(null)
                    setFreePlanForm({ ...freePlanForm, user_id: '', email: '', name: '' })
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Usar esta opção →
                </button>
              </div>
              <p className="text-xs text-blue-700 mb-3">
                Se a pessoa ainda não tem cadastro, preencha email e nome abaixo. Um novo usuário será criado automaticamente.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={freePlanForm.email}
                    onChange={(e) => setFreePlanForm({ ...freePlanForm, email: e.target.value, user_id: '' })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-900 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={freePlanForm.name}
                    onChange={(e) => setFreePlanForm({ ...freePlanForm, name: e.target.value, user_id: '' })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Nome do usuário"
                  />
                </div>
              </div>
            </div>

            {/* Divisor */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OU</span>
              </div>
            </div>

            <form onSubmit={handleCreateFreePlan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar Usuário Já Cadastrado (Nome, Email ou Telefone)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={buscaUsuario}
                    onChange={(e) => {
                      const newValue = e.target.value
                      setBuscaUsuario(newValue)
                      // Só limpar seleção se o usuário estiver realmente digitando uma nova busca
                      // Se o campo estiver vazio ou diferente do usuário selecionado, limpar
                      if (!newValue || (usuarioSelecionado && !newValue.includes(usuarioSelecionado.nome))) {
                        setUsuarioSelecionado(null)
                        setFreePlanForm({ ...freePlanForm, user_id: '', email: '', name: '' })
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Digite nome, email ou telefone..."
                  />
                  {buscandoUsuario && (
                    <div className="absolute right-3 top-2.5">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    </div>
                  )}
                </div>
                
                {/* Lista de usuários encontrados */}
                {usuariosEncontrados.length > 0 && !usuarioSelecionado && (
                  <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                    {usuariosEncontrados.map((usuario) => (
                      <button
                        key={usuario.id || usuario.user_id}
                        type="button"
                        onClick={() => selecionarUsuario(usuario)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{usuario.nome}</div>
                        <div className="text-sm text-gray-600">{usuario.email}</div>
                        <div className="text-xs text-gray-500">Área: {usuario.area}</div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Usuário selecionado */}
                {usuarioSelecionado && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-900">{usuarioSelecionado.nome}</div>
                        <div className="text-sm text-green-700">{usuarioSelecionado.email}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUsuarioSelecionado(null)
                          setBuscaUsuario('')
                          setFreePlanForm({ ...freePlanForm, user_id: '' })
                        }}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Opção: Criar novo usuário se não encontrou */}
              {usuariosEncontrados.length === 0 && buscaUsuario.trim() && !usuarioSelecionado && !buscandoUsuario && (
                <div className="mt-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-3">
                    <strong>⚠️ Usuário não encontrado.</strong> Se você preencheu email e nome acima, o sistema criará um novo usuário automaticamente. Caso contrário, preencha os campos acima.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Área
                </label>
                <select
                  value={freePlanForm.area}
                  onChange={(e) => setFreePlanForm({ ...freePlanForm, area: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="wellness">Wellness</option>
                  <option value="nutri">Nutri</option>
                  <option value="coach">Coach</option>
                  <option value="nutra">Nutra</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válido por (dias)
                </label>
                <input
                  type="number"
                  value={freePlanForm.expires_in_days}
                  onChange={(e) => setFreePlanForm({ ...freePlanForm, expires_in_days: parseInt(e.target.value) })}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Plano Gratuito'}
              </button>
            </form>
          </div>
        </div>

        {/* Lista de Assinaturas Ativas */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📋 Assinaturas Ativas</h2>
            <Link
              href="/admin/receitas"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          
          {loadingSubscriptions ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm text-gray-600">Carregando assinaturas...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Nenhuma assinatura ativa encontrada</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{sub.usuario}</div>
                        {sub.email && (
                          <div className="text-xs text-gray-500">{sub.email}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm text-gray-900 capitalize">{sub.area}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sub.tipo === 'mensal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : sub.tipo === 'anual'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {sub.tipo === 'mensal' ? 'Mensal' : sub.tipo === 'anual' ? 'Anual' : 'Gratuito'}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {sub.currency === 'brl' ? 'R$' : '$'} {sub.valor.toFixed(2).replace('.', ',')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {sub.proxVencimento ? new Date(sub.proxVencimento).toLocaleDateString('pt-BR') : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {sub.status}
                          </span>
                          {sub.is_migrated && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800" title="Migrado">🔄</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function AdminSubscriptionsPage() {
  return (
    <AdminProtectedRoute>
      <AdminSubscriptionsContent />
    </AdminProtectedRoute>
  )
}

