'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

interface Usuario {
  id: string
  nome: string
  email: string
  area: 'nutri' | 'coach' | 'nutra' | 'wellness'
  status: 'ativo' | 'inativo'
  assinatura: 'mensal' | 'anual' | 'gratuita' | 'sem assinatura'
  assinaturaId: string | null
  assinaturaVencimento: string | null
  dataCadastro: string | null
  leadsGerados: number
  cursosCompletos: number
  isMigrado?: boolean
}

interface Stats {
  total: number
  ativos: number
  inativos: number
}

export default function AdminUsuarios() {
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [busca, setBusca] = useState('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, ativos: 0, inativos: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Estados para modais
  const [mostrarEditarUsuario, setMostrarEditarUsuario] = useState(false)
  const [mostrarEditarAssinatura, setMostrarEditarAssinatura] = useState(false)
  const [mostrarDeletarUsuario, setMostrarDeletarUsuario] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null)
  const [salvando, setSalvando] = useState(false)
  
  // Estados para atualização em massa de área
  const [bulkUpdateFrom, setBulkUpdateFrom] = useState<'nutri' | 'coach' | 'nutra' | 'wellness' | ''>('')
  const [bulkUpdateTo, setBulkUpdateTo] = useState<'nutri' | 'coach' | 'nutra' | 'wellness' | ''>('')
  const [bulkUpdateResult, setBulkUpdateResult] = useState<{
    success: boolean
    message: string
    updated?: number
  } | null>(null)

  // Formulários
  const [formUsuario, setFormUsuario] = useState({
    area: 'wellness' as 'wellness' | 'nutri' | 'coach' | 'nutra',
    nome_completo: ''
  })

  const [formAssinatura, setFormAssinatura] = useState({
    current_period_end: '',
    plan_type: 'monthly' as 'monthly' | 'annual' | 'free'
  })

  // Buscar dados da API
  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filtroArea !== 'todos') params.append('area', filtroArea)
      if (filtroStatus !== 'todos') params.append('status', filtroStatus)
      if (busca) params.append('busca', busca)

      const url = `/api/admin/usuarios?${params.toString()}`
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar usuários')
      }

      const data = await response.json()

      if (data.success) {
        setUsuarios(data.usuarios || [])
        setStats(data.stats || { total: 0, ativos: 0, inativos: 0 })
      } else {
        throw new Error('Formato de dados inválido')
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarUsuarios()
    }, busca ? 500 : 0)

    return () => clearTimeout(timeoutId)
  }, [filtroArea, filtroStatus, busca])

  // Abrir modal de editar usuário
  const abrirEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario)
    setFormUsuario({
      area: usuario.area,
      nome_completo: usuario.nome
    })
    setMostrarEditarUsuario(true)
  }

  // Abrir modal de editar assinatura
  const abrirEditarAssinatura = (usuario: Usuario) => {
    if (!usuario.assinaturaId) {
      setError('Usuário não tem assinatura ativa')
      return
    }
    setUsuarioSelecionado(usuario)
    
    // Converter data para formato YYYY-MM-DD para input type="date"
    let dataFormatada = ''
    if (usuario.assinaturaVencimento) {
      const date = new Date(usuario.assinaturaVencimento)
      dataFormatada = date.toISOString().split('T')[0]
    }
    
    setFormAssinatura({
      current_period_end: dataFormatada,
      plan_type: usuario.assinatura === 'mensal' ? 'monthly' : 
                 usuario.assinatura === 'anual' ? 'annual' : 'free'
    })
    setMostrarEditarAssinatura(true)
  }

  // Abrir modal de deletar
  const abrirDeletarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario)
    setMostrarDeletarUsuario(true)
  }

  // Salvar edição de usuário
  const salvarEditarUsuario = async () => {
    if (!usuarioSelecionado) return

    setSalvando(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch(`/api/admin/usuarios/${usuarioSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(formUsuario)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao atualizar usuário')
        return
      }

      setSuccess('Usuário atualizado com sucesso!')
      setMostrarEditarUsuario(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar usuário')
    } finally {
      setSalvando(false)
    }
  }

  // Salvar edição de assinatura
  const salvarEditarAssinatura = async () => {
    if (!usuarioSelecionado || !usuarioSelecionado.assinaturaId) return

    setSalvando(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Converter data para ISO se fornecida
      const body: any = {
        plan_type: formAssinatura.plan_type
      }
      if (formAssinatura.current_period_end) {
        const date = new Date(formAssinatura.current_period_end)
        body.current_period_end = date.toISOString()
      }

      const response = await fetch(`/api/admin/subscriptions/${usuarioSelecionado.assinaturaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao atualizar assinatura')
        return
      }

      setSuccess('Assinatura atualizada com sucesso!')
      setMostrarEditarAssinatura(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar assinatura')
    } finally {
      setSalvando(false)
    }
  }

  // Definir senha padrão para TODOS os usuários migrados
  const definirSenhaParaTodosMigrados = async () => {
    if (!confirm('Definir senha padrão (Ylada2025!) para TODOS os usuários migrados?\n\nIsso pode levar alguns segundos...')) {
      return
    }

    try {
      setSalvando(true)
      setError(null)
      setSuccess(null)

      const response = await fetch('/api/admin/usuarios/set-default-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          defaultPassword: 'Ylada2025!'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(`✅ ${data.message}\n\nAtualizados: ${data.updated}\nFalharam: ${data.failed}\nTotal: ${data.total}`)
        setTimeout(() => setSuccess(null), 10000)
      } else {
        setError(data.error || 'Erro ao definir senhas')
      }
    } catch (err: any) {
      console.error('Erro ao definir senhas:', err)
      setError(err.message || 'Erro ao definir senhas')
    } finally {
      setSalvando(false)
    }
  }

  // Atualizar área em massa
  const atualizarAreaEmMassa = async () => {
    if (!bulkUpdateFrom || !bulkUpdateTo) {
      setError('Selecione a área origem e destino')
      return
    }

    if (bulkUpdateFrom === bulkUpdateTo) {
      setError('A área origem e destino devem ser diferentes')
      return
    }

    // Primeiro, verificar quantos usuários serão afetados
    try {
      setSalvando(true)
      setError(null)
      setBulkUpdateResult(null)

      // Buscar quantos usuários serão afetados
      const checkResponse = await fetch(`/api/admin/usuarios?area=${bulkUpdateFrom}`, {
        credentials: 'include'
      })
      
      const checkData = await checkResponse.json()
      const totalAfetados = checkData.usuarios?.length || 0

      if (totalAfetados === 0) {
        setBulkUpdateResult({
          success: false,
          message: `Nenhum usuário encontrado com área '${bulkUpdateFrom}'`
        })
        setSalvando(false)
        return
      }

      // Confirmar com o usuário
      const confirmar = window.confirm(
        `⚠️ ATENÇÃO: Esta ação irá atualizar ${totalAfetados} usuário(s) de '${bulkUpdateFrom}' para '${bulkUpdateTo}'.\n\n` +
        `Isso afetará:\n` +
        `- A área de acesso deles\n` +
        `- Os dados de análise\n` +
        `- As assinaturas vinculadas\n\n` +
        `Deseja continuar?`
      )

      if (!confirmar) {
        setSalvando(false)
        return
      }

      // Executar atualização
      const response = await fetch('/api/admin/usuarios/bulk-update-area', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          from_area: bulkUpdateFrom,
          to_area: bulkUpdateTo
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setBulkUpdateResult({
          success: true,
          message: `✅ ${data.message || 'Área atualizada com sucesso!'}`,
          updated: data.updated || totalAfetados
        })
        setSuccess(`Área atualizada: ${data.updated || totalAfetados} usuário(s) de '${bulkUpdateFrom}' para '${bulkUpdateTo}'`)
        
        // Limpar seleções
        setBulkUpdateFrom('')
        setBulkUpdateTo('')
        
        // Recarregar lista
        setTimeout(() => {
          carregarUsuarios()
          setBulkUpdateResult(null)
        }, 3000)
      } else {
        setBulkUpdateResult({
          success: false,
          message: data.error || 'Erro ao atualizar área'
        })
        setError(data.error || 'Erro ao atualizar área')
      }
    } catch (err: any) {
      console.error('Erro ao atualizar área:', err)
      setBulkUpdateResult({
        success: false,
        message: err.message || 'Erro ao atualizar área'
      })
      setError(err.message || 'Erro ao atualizar área')
    } finally {
      setSalvando(false)
    }
  }

  // Definir senha padrão para usuário migrado individual
  const definirSenhaPadrao = async (email: string) => {
    if (!confirm(`Definir senha padrão (Ylada2025!) para ${email}?`)) {
      return
    }

    try {
      setSalvando(true)
      setError(null)

      const response = await fetch('/api/admin/usuarios/definir-senha-individual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: email,
          password: 'Ylada2025!'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess(`Senha padrão definida com sucesso para ${email}`)
        setTimeout(() => setSuccess(null), 5000)
      } else {
        setError(data.error || 'Erro ao definir senha')
      }
    } catch (err: any) {
      console.error('Erro ao definir senha:', err)
      setError(err.message || 'Erro ao definir senha')
    } finally {
      setSalvando(false)
    }
  }

  // Deletar usuário
  const confirmarDeletarUsuario = async () => {
    if (!usuarioSelecionado) return

    setSalvando(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch(`/api/admin/usuarios/${usuarioSelecionado.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Erro ao deletar usuário')
        return
      }

      setSuccess('Usuário deletado com sucesso!')
      setMostrarDeletarUsuario(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || 'Erro ao deletar usuário')
    } finally {
      setSalvando(false)
    }
  }


  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'nutri': return '🥗'
      case 'coach': return '💜'
      case 'nutra': return '🔬'
      case 'wellness': return '💖'
      default: return '👤'
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'nutri': return 'bg-green-100 text-green-800'
      case 'coach': return 'bg-purple-100 text-purple-800'
      case 'nutra': return 'bg-blue-100 text-blue-800'
      case 'wellness': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativo</span>
      case 'inativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inativo</span>
      default:
        return null
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
                <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
                <p className="text-sm text-gray-600">Gerencie seus nutricionistas, coaches e consultores</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
        {/* Mensagens */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">⚡ Ações Rápidas</h2>
          
          {/* Seção Senhas */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-md font-medium text-gray-700 mb-3">🔑 Senhas</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={definirSenhaParaTodosMigrados}
                disabled={salvando}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {salvando ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processando...
                  </>
                ) : (
                  <>
                    🔑 Definir Senha Padrão para TODOS os Usuários Migrados
                  </>
                )}
              </button>
              <p className="text-sm text-gray-600">
                Define a senha padrão <strong>Ylada2025!</strong> para todos os usuários migrados
              </p>
            </div>
          </div>

          {/* Seção Áreas */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-3">🔄 Atualizar Áreas</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>⚠️ Atenção:</strong> Esta ação atualiza a área (perfil) de múltiplos usuários de uma vez.
              </p>
              <p className="text-sm text-yellow-700">
                Você verá quantos usuários serão afetados antes de confirmar.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={bulkUpdateFrom}
                onChange={(e) => setBulkUpdateFrom(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione área origem</option>
                <option value="nutri">Nutri</option>
                <option value="coach">Coach</option>
                <option value="nutra">Nutra</option>
                <option value="wellness">Wellness</option>
              </select>
              <span className="text-gray-500">→</span>
              <select
                value={bulkUpdateTo}
                onChange={(e) => setBulkUpdateTo(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione área destino</option>
                <option value="nutri">Nutri</option>
                <option value="coach">Coach</option>
                <option value="nutra">Nutra</option>
                <option value="wellness">Wellness</option>
              </select>
              <button
                onClick={atualizarAreaEmMassa}
                disabled={!bulkUpdateFrom || !bulkUpdateTo || salvando}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {salvando ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processando...
                  </>
                ) : (
                  <>
                    🔄 Atualizar Área em Massa
                  </>
                )}
              </button>
            </div>
            {bulkUpdateResult && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                bulkUpdateResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p><strong>{bulkUpdateResult.success ? '✅' : '❌'}</strong> {bulkUpdateResult.message}</p>
                {bulkUpdateResult.updated !== undefined && (
                  <p className="mt-1">Usuários atualizados: <strong>{bulkUpdateResult.updated}</strong></p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome ou email..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
              <select
                value={filtroArea}
                onChange={(e) => setFiltroArea(e.target.value as any)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">Todos</option>
                <option value="nutri">Nutricionistas</option>
                <option value="coach">Coaches</option>
                <option value="nutra">Nutra</option>
                <option value="wellness">Wellness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando usuários...</p>
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Ativos</p>
              <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Inativos</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inativos}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Mostrando</p>
              <p className="text-2xl font-bold text-blue-600">{usuarios.length}</p>
            </div>
          </div>
        )}

        {/* Lista de Usuários */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {usuarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assinatura</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{usuario.nome}</div>
                              <div className="text-sm text-gray-500">{usuario.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getAreaIcon(usuario.area)}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAreaColor(usuario.area)} capitalize`}>
                              {usuario.area}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(usuario.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {usuario.assinatura}
                            {usuario.isMigrado && (
                              <span className="ml-1 text-xs text-orange-600" title="Usuário migrado">🔄</span>
                            )}
                          </div>
                          {usuario.assinaturaVencimento && (
                            <div className="text-xs text-gray-500">Vence: {new Date(usuario.assinaturaVencimento).toLocaleDateString('pt-BR')}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{usuario.leadsGerados}</div>
                          <div className="text-xs text-gray-500">{usuario.cursosCompletos} cursos</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => abrirEditarUsuario(usuario)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Editar
                            </button>
                            {usuario.assinaturaId && (
                              <button
                                onClick={() => abrirEditarAssinatura(usuario)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Assinatura
                              </button>
                            )}
                            <button
                              onClick={() => abrirDeletarUsuario(usuario)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Deletar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal Editar Usuário */}
      {mostrarEditarUsuario && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Editar Usuário</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={formUsuario.nome_completo}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nome_completo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
                <select
                  value={formUsuario.area}
                  onChange={(e) => setFormUsuario({ ...formUsuario, area: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="wellness">Wellness</option>
                  <option value="nutri">Nutri</option>
                  <option value="coach">Coach</option>
                  <option value="nutra">Nutra</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setMostrarEditarUsuario(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEditarUsuario}
                  disabled={salvando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Assinatura */}
      {mostrarEditarAssinatura && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Editar Assinatura</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Plano</label>
                <select
                  value={formAssinatura.plan_type}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, plan_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Mensal</option>
                  <option value="annual">Anual</option>
                  <option value="free">Gratuito</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
                <input
                  type="date"
                  value={formAssinatura.current_period_end}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, current_period_end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setMostrarEditarAssinatura(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarEditarAssinatura}
                  disabled={salvando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Deletar Usuário */}
      {mostrarDeletarUsuario && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-red-600">Deletar Usuário</h2>
            <p className="mb-4 text-gray-700">
              Tem certeza que deseja deletar <strong>{usuarioSelecionado.nome}</strong> ({usuarioSelecionado.email})?
              <br />
              <span className="text-sm text-red-600">Esta ação não pode ser desfeita!</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarDeletarUsuario(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarDeletarUsuario}
                disabled={salvando}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {salvando ? 'Deletando...' : 'Deletar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
