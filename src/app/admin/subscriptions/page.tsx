'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  UserCheck,
  CreditCard,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  PieChart,
  X,
  MoreVertical,
  AlertTriangle,
  Clock,
  Gift,
  Pause,
  Play,
  Ban,
  Trash2,
  KeyRound
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  recentUsers: number
  conversionRate: string
}

interface User {
  id: string
  name: string
  email: string
  phone: string
  subscription_status: string
  subscription_plan: string
  stripe_customer_id: string
  created_at: string
  subscriptions: Array<{
    id: string
    status: string
    plan_type: string
    current_period_end: string
    cancel_at_period_end: boolean
  }>
}

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  description: string
  created_at: string
  subscriptions: {
    user_id: string
    professionals: {
      name: string
      email: string
    }
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [dropdownPosition, setDropdownPosition] = useState<{top: number, left: number} | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    show: boolean
    action: string
    userId: string
    userName: string
    message: string
  } | null>(null)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState('all')

  useEffect(() => {
    loadDashboardData()
  }, [])

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (openDropdown && !target.closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDropdown])

  const handleDropdownClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation()
    
    const buttonRect = e.currentTarget.getBoundingClientRect()
    const position = {
      top: buttonRect.bottom + 5,
      left: buttonRect.right - 224 // 224px = w-56 (14rem)
    }
    
    setDropdownPosition(position)
    setOpenDropdown(openDropdown === userId ? null : userId)
  }

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsRes, usersRes, paymentsRes] = await Promise.all([
        fetch('/api/admin?action=dashboard'),
        fetch('/api/admin?action=users'),
        fetch('/api/admin?action=payments')
      ])

      const [statsData, usersData, paymentsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        paymentsRes.json()
      ])

      setStats(statsData)
      setUsers(usersData.users || [])
      setPayments(paymentsData.payments || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (action: string, userId: string, subscriptionId?: string, newPlan?: string) => {
    setActionLoading(action)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          userId,
          subscriptionId,
          newPlan
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        await loadDashboardData() // Recarregar dados
      } else {
        alert('Erro: ' + result.error)
      }
    } catch (error) {
      console.error('Erro na ação:', error)
      alert('Erro ao processar ação')
    } finally {
      setActionLoading(null)
    }
  }

  const showConfirmation = (action: string, userId: string, userName: string) => {
    const actions = {
      'give_grace_period': {
        message: `Conceder 7 dias de período de graça para ${userName}?`,
        icon: Clock,
        color: 'text-purple-600'
      },
      'give_free_subscription_monthly': {
        message: `Dar 1 mês de assinatura gratuita para ${userName}?`,
        icon: Gift,
        color: 'text-green-600'
      },
      'give_free_subscription_yearly': {
        message: `Dar 1 ano de assinatura gratuita para ${userName}?`,
        icon: Gift,
        color: 'text-blue-600'
      },
      'suspend_user': {
        message: `Suspender usuário ${userName}?`,
        icon: Pause,
        color: 'text-yellow-600'
      },
      'reactivate_user': {
        message: `Reativar usuário ${userName}?`,
        icon: Play,
        color: 'text-green-600'
      },
      'cancel_subscription': {
        message: `Cancelar assinatura de ${userName}?`,
        icon: Ban,
        color: 'text-orange-600'
      },
      'reset_password': {
        message: `Resetar senha de ${userName}? Uma nova senha temporária será definida.`,
        icon: KeyRound,
        color: 'text-blue-600'
      },
      'delete_user': {
        message: `EXCLUIR PERMANENTEMENTE o usuário ${userName}? Esta ação não pode ser desfeita!`,
        icon: Trash2,
        color: 'text-red-600'
      }
    }

    const actionConfig = actions[action as keyof typeof actions]
    if (actionConfig) {
      setConfirmAction({
        show: true,
        action,
        userId,
        userName,
        message: actionConfig.message
      })
    }
  }

  const confirmActionHandler = async () => {
    if (!confirmAction) return

    setActionLoading(confirmAction.action)
    try {
      let response
      
      if (confirmAction.action === 'give_free_subscription_monthly') {
        response = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'give_free_subscription', 
            userId: confirmAction.userId, 
            planType: 'monthly', 
            months: 1 
          })
        })
      } else if (confirmAction.action === 'give_free_subscription_yearly') {
        response = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'give_free_subscription', 
            userId: confirmAction.userId, 
            planType: 'yearly', 
            months: 12 
          })
        })
      } else {
        response = await fetch('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: confirmAction.action, 
            userId: confirmAction.userId 
          })
        })
      }

      const result = await response.json()
      
      if (result.success) {
        alert(result.message)
        await loadDashboardData()
      } else {
        alert('Erro: ' + result.error)
      }
    } catch (error) {
      console.error('Erro na ação:', error)
      alert('Erro ao processar ação')
    } finally {
      setActionLoading(null)
      setConfirmAction(null)
      setOpenDropdown(null)
    }
  }

  const handleGiveFreeSubscription = async (userId: string, planType: string, months: number) => {
    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'give_free_subscription',
          userId: userId,
          planType: planType,
          months: months
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await loadDashboardData()
        alert(result.message || `Assinatura ${planType} gratuita de ${months} meses concedida!`)
      } else {
        alert('Erro: ' + (result.error || result.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao dar assinatura gratuita:', error)
      alert('Erro ao dar assinatura gratuita: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleGiveGracePeriod = async (userId: string) => {
    setActionLoading(userId)
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'give_grace_period',
          userId: userId,
          days: 10
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await loadDashboardData()
        alert(result.message || 'Período de graça de 10 dias concedido com sucesso!')
      } else {
        alert('Erro: ' + (result.error || result.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao conceder período de graça:', error)
      alert('Erro ao conceder período de graça: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateUser = async (userData: { name: string; email: string; phone?: string; username: string; tempPassword: string }) => {
    setActionLoading('create_user')
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_user',
          ...userData
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        await loadDashboardData()
        setShowCreateUserModal(false)
        alert(`Usuário criado com sucesso!\n\nEmail: ${result.user.email}\nSenha temporária: ${result.user.tempPassword}\n\nCompartilhe essas credenciais com o usuário.`)
      } else {
        alert('Erro: ' + (result.error || result.message || 'Erro desconhecido'))
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      alert('Erro ao criar usuário: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
    } finally {
      setActionLoading(null)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'brl') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'canceled': return 'text-red-600 bg-red-50'
      case 'past_due': return 'text-yellow-600 bg-yellow-50'
      case 'inactive': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo'
      case 'canceled': return 'Cancelado'
      case 'past_due': return 'Em Atraso'
      case 'inactive': return 'Inativo'
      case 'unpaid': return 'Não Pago'
      default: return status
    }
  }

  // Função para filtrar usuários
  const getFilteredUsers = () => {
    return users.filter(user => {
      // Filtro por status
      if (statusFilter !== 'all' && user.subscription_status !== statusFilter) {
        return false
      }

      // Filtro por plano
      const userPlan = user.subscriptions?.[0]?.plan_type || user.subscription_plan
      if (planFilter !== 'all' && userPlan !== planFilter) {
        return false
      }

      // Filtro por busca (nome ou email)
      if (searchTerm && !user.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !user.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro por data
      if (dateFilter !== 'all') {
        const userDate = new Date(user.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - userDate.getTime()) / (1000 * 60 * 60 * 24))
        
        switch (dateFilter) {
          case 'today':
            if (daysDiff !== 0) return false
            break
          case 'week':
            if (daysDiff > 7) return false
            break
          case 'month':
            if (daysDiff > 30) return false
            break
          case 'year':
            if (daysDiff > 365) return false
            break
        }
      }

      return true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados administrativos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">Gestão de usuários e assinaturas</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center"
            >
              <Settings className="w-4 h-4 mr-2" />
              Voltar ao Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
              { id: 'users', name: 'Usuários', icon: Users },
              { id: 'payments', name: 'Pagamentos', icon: CreditCard },
              { id: 'reports', name: 'Relatórios', icon: PieChart }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assinaturas Ativas</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Receita (30 dias)</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        payment.status === 'succeeded' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.subscriptions?.professionals?.name || 'Usuário'}
                        </p>
                        <p className="text-sm text-gray-600">{payment.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount, payment.currency)}</p>
                      <p className="text-sm text-gray-600">{formatDate(payment.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gestão de Usuários</h3>
              <button
                onClick={() => setShowCreateUserModal(true)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                Criar Usuário
              </button>
            </div>
            
            {/* Filtros */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Busca por nome/email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                  <input
                    type="text"
                    placeholder="Nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Filtro por status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="past_due">Em Atraso</option>
                    <option value="canceled">Cancelado</option>
                    <option value="unpaid">Não Pago</option>
                  </select>
                </div>

                {/* Filtro por plano */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plano</label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todos os planos</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>

                {/* Filtro por data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Cadastro</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">Todas as datas</option>
                    <option value="today">Hoje</option>
                    <option value="week">Última semana</option>
                    <option value="month">Último mês</option>
                    <option value="year">Último ano</option>
                  </select>
                </div>
              </div>
              
              {/* Contador de resultados */}
              <div className="mt-3 text-sm text-gray-600">
                Mostrando {getFilteredUsers().length} de {users.length} usuários
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plano</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredUsers().map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name || 'Sem nome'}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.subscription_status)}`}>
                          {getStatusText(user.subscription_status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.subscriptions?.[0]?.plan_type === 'monthly' ? 'Mensal' : 
                         user.subscriptions?.[0]?.plan_type === 'yearly' ? 'Anual' : 
                         user.subscription_plan === 'monthly' ? 'Mensal' :
                         user.subscription_plan === 'yearly' ? 'Anual' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.subscription_status === 'active' && user.grace_period_end ? (
                          <div>
                            <div className="text-xs text-purple-600">Período de graça</div>
                            <div className="text-xs">{formatDate(user.grace_period_end)}</div>
                          </div>
                        ) : user.subscriptions?.[0]?.current_period_end ? (
                          <div>
                            <div className="text-xs text-blue-600">Assinatura</div>
                            <div className="text-xs">{formatDate(user.subscriptions[0].current_period_end)}</div>
                            {(() => {
                              const endDate = new Date(user.subscriptions[0].current_period_end)
                              const now = new Date()
                              const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                              return daysLeft > 0 ? (
                                <div className="text-xs text-green-600">{daysLeft} dias restantes</div>
                              ) : (
                                <div className="text-xs text-red-600">Vencido</div>
                              )
                            })()}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="relative inline-block dropdown-container">
                          <button
                            data-user-id={user.id}
                            onClick={(e) => handleDropdownClick(e, user.id)}
                            className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            <MoreVertical className="w-4 h-4" />
                            <span>Ações</span>
                          </button>
                          
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h3>
            </div>
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payment.subscriptions?.professionals?.name || 'Usuário'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payment.subscriptions?.professionals?.email || 'Email não disponível'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(payment.amount, payment.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'succeeded' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                        }`}>
                          {payment.status === 'succeeded' ? 'Pago' : 'Falhou'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Relatórios Financeiros</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Download className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Exportar Usuários</h4>
                  <p className="text-sm text-gray-600">CSV com todos os usuários</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <Download className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Exportar Pagamentos</h4>
                  <p className="text-sm text-gray-600">CSV com histórico de pagamentos</p>
                </button>
                
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                  <BarChart3 className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-medium text-gray-900">Relatório Mensal</h4>
                  <p className="text-sm text-gray-600">Análise de receita e churn</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Criação de Usuário */}
      {showCreateUserModal && (
        <CreateUserModal
          onClose={() => setShowCreateUserModal(false)}
          onCreateUser={handleCreateUser}
          loading={actionLoading === 'create_user'}
        />
      )}

      {/* Modal de confirmação */}
      {confirmAction && (
        <ConfirmationModal
          show={confirmAction.show}
          message={confirmAction.message}
          onConfirm={confirmActionHandler}
          onCancel={() => setConfirmAction(null)}
          loading={actionLoading === confirmAction.action}
        />
      )}

      {/* Dropdown Portal */}
      {openDropdown && dropdownPosition && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed w-56 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-96 overflow-y-auto"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left
          }}
        >
          <div className="py-1">
            {/* Período de graça */}
            <button
              onClick={() => showConfirmation('give_grace_period', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-purple-600 hover:bg-purple-50"
            >
              <Clock className="w-4 h-4 mr-2" />
              7 dias de graça
            </button>
            
            {/* Assinaturas gratuitas */}
            <button
              onClick={() => showConfirmation('give_free_subscription_monthly', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
            >
              <Gift className="w-4 h-4 mr-2" />
              1 mês gratuito
            </button>
            
            <button
              onClick={() => showConfirmation('give_free_subscription_yearly', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <Gift className="w-4 h-4 mr-2" />
              1 ano gratuito
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            {/* Reset de senha */}
            <button
              onClick={() => showConfirmation('reset_password', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Resetar senha
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            <button
              onClick={() => showConfirmation('suspend_user', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50"
            >
              <Pause className="w-4 h-4 mr-2" />
              Suspender
            </button>
            
            <button
              onClick={() => showConfirmation('reactivate_user', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
            >
              <Play className="w-4 h-4 mr-2" />
              Reativar
            </button>
            
            <button
              onClick={() => showConfirmation('cancel_subscription', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-orange-600 hover:bg-orange-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              Cancelar assinatura
            </button>
            
            <div className="border-t border-gray-100 my-1"></div>
            
            {/* Ação perigosa */}
            <button
              onClick={() => showConfirmation('delete_user', openDropdown, users.find(u => u.id === openDropdown)?.name || 'Usuário')}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir usuário
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

// Componente do Modal de Criação de Usuário
function CreateUserModal({ onClose, onCreateUser, loading }: { 
  onClose: () => void
  onCreateUser: (data: { name: string; email: string; phone?: string; username: string; tempPassword: string }) => void
  loading: boolean 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    countryCode: '+55',
    tempPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.email && formData.username && formData.tempPassword) {
      const phoneWithCountryCode = formData.phone ? `${formData.countryCode} ${formData.phone}` : undefined
      onCreateUser({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        phone: phoneWithCountryCode,
        tempPassword: formData.tempPassword
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Criar Novo Usuário</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Nome completo do usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Senha Temporária *
            </label>
            <div className="flex">
              <input
                type="text"
                required
                value={formData.tempPassword}
                onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Senha temporária"
              />
              <button
                type="button"
                onClick={() => {
                  const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase()
                  setFormData({ ...formData, tempPassword: newPassword })
                }}
                className="ml-2 px-3 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200 text-sm"
              >
                Gerar
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Senha temporária que o usuário usará para fazer login</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone (opcional)
            </label>
            <div className="flex">
              <div className="flex-shrink-0">
                <select
                  value={formData.countryCode || '+55'}
                  onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-l-md border-r-0 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                >
                  <option value="+55">🇧🇷 +55 Brasil</option>
                  <option value="+351">🇵🇹 +351 Portugal</option>
                  <option value="+34">🇪🇸 +34 Espanha</option>
                  <option value="+1">🇺🇸 +1 EUA/Canadá</option>
                  <option value="+44">🇬🇧 +44 Reino Unido</option>
                  <option value="+33">🇫🇷 +33 França</option>
                  <option value="+49">🇩🇪 +49 Alemanha</option>
                  <option value="+39">🇮🇹 +39 Itália</option>
                  <option value="+54">🇦🇷 +54 Argentina</option>
                  <option value="+56">🇨🇱 +56 Chile</option>
                  <option value="+57">🇨🇴 +57 Colômbia</option>
                  <option value="+52">🇲🇽 +52 México</option>
                  <option value="+598">🇺🇾 +598 Uruguai</option>
                  <option value="+595">🇵🇾 +595 Paraguai</option>
                </select>
              </div>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  
                  // Aplicar máscara baseada no país selecionado
                  if (formData.countryCode === '+55') {
                    // Brasil: (DDD) 99999-9999
                    if (value.length <= 2) {
                      value = value
                    } else if (value.length <= 6) {
                      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
                    } else if (value.length <= 10) {
                      value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`
                    } else {
                      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`
                    }
                  } else if (formData.countryCode === '+351') {
                    // Portugal: 999 999 999
                    if (value.length <= 3) {
                      value = value
                    } else if (value.length <= 6) {
                      value = `${value.slice(0, 3)} ${value.slice(3)}`
                    } else {
                      value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)}`
                    }
                  } else if (formData.countryCode === '+1') {
                    // EUA/Canadá: (999) 999-9999
                    if (value.length <= 3) {
                      value = value
                    } else if (value.length <= 6) {
                      value = `(${value.slice(0, 3)}) ${value.slice(3)}`
                    } else {
                      value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
                    }
                  } else {
                    // Outros países: formato simples
                    if (value.length > 15) value = value.slice(0, 15)
                  }
                  
                  setFormData({ ...formData, phone: value })
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder={formData.countryCode === '+55' ? '(11) 99999-9999' : 
                           formData.countryCode === '+351' ? '999 999 999' :
                           formData.countryCode === '+1' ? '(999) 999-9999' : '999999999'}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formato: {formData.countryCode === '+55' ? '(DDD) 99999-9999' : 
                       formData.countryCode === '+351' ? '999 999 999' :
                       formData.countryCode === '+1' ? '(999) 999-9999' : '999999999'}
            </p>
          </div>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Período de graça:</strong> O usuário receberá automaticamente 7 dias de acesso completo.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.email || !formData.username || !formData.tempPassword}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal de confirmação
function ConfirmationModal({ 
  show, 
  message, 
  onConfirm, 
  onCancel, 
  loading 
}: { 
  show: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-yellow-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Confirmar Ação</h3>
        </div>
        
        <p className="text-gray-700 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}
