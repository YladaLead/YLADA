'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase-client'
import { toLocalDateStringISO } from '@/lib/date-utils'
import { getAdminUsuariosTranslations } from '@/lib/translations/admin-usuarios'

const supabase = createClient()

interface Usuario {
  id: string
  nome: string
  email: string
  area: string
  status: 'ativo' | 'inativo'
  assinatura: 'mensal' | 'anual' | 'gratuita' | 'sem assinatura'
  assinaturaId: string | null
  assinaturaVencimento: string | null
  dataCadastro: string | null
  leadsGerados: number
  cursosCompletos: number
  linksEnviados?: number
  cliquesLinks?: number
  isMigrado?: boolean
  assinaturaSituacao: 'ativa' | 'vencida' | 'sem'
  statusAssinatura?: 'active' | 'canceled' | 'past_due' | null
  assinaturaDiasVencida: number | null
  nome_presidente: string | null
  nome_presidente_canonico?: string | null
  is_presidente?: boolean
}

interface Stats {
  total: number
  ativos: number
  inativos: number
}

export default function AdminUsuarios() {
  // Admin sempre em português
  const t = useMemo(() => getAdminUsuariosTranslations('pt'), [])

  const [filtroBloco, setFiltroBloco] = useState<'todos' | 'ylada' | 'wellness'>('todos')
  const [filtroArea, setFiltroArea] = useState<string>('todos')

  // Áreas disponíveis conforme o bloco selecionado (YLADA vs Wellness)
  const opcoesArea = useMemo(() => {
    if (filtroBloco === 'wellness') {
      return [{ value: 'todos' as const, label: t.filters.all }, { value: 'wellness' as const, label: t.areas.wellness }]
    }
    if (filtroBloco === 'ylada') {
      return [
        { value: 'todos' as const, label: t.filters.all },
        { value: 'nutri' as const, label: t.areas.nutri },
        { value: 'coach' as const, label: t.areas.coach },
        { value: 'nutra' as const, label: t.areas.nutra },
        { value: 'med' as const, label: t.areas.med },
        { value: 'psi' as const, label: t.areas.psi },
        { value: 'psicanalise' as const, label: t.areas.psicanalise },
        { value: 'odonto' as const, label: t.areas.odonto },
        { value: 'estetica' as const, label: t.areas.estetica },
        { value: 'fitness' as const, label: t.areas.fitness },
        { value: 'perfumaria' as const, label: t.areas.perfumaria },
        { value: 'ylada' as const, label: t.areas.ylada },
      ]
    }
    return [
      { value: 'todos' as const, label: t.filters.all },
      { value: 'nutri' as const, label: t.areas.nutri },
      { value: 'coach' as const, label: t.areas.coach },
      { value: 'nutra' as const, label: t.areas.nutra },
      { value: 'wellness' as const, label: t.areas.wellness },
    ]
  }, [filtroBloco, t])
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [filtroAssinatura, setFiltroAssinatura] = useState<'todos' | 'gratuita' | 'mensal' | 'anual' | 'sem'>('todos')
  const [filtroPresidente, setFiltroPresidente] = useState<string>('todos')
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
  const [definindoPresidente, setDefinindoPresidente] = useState<string | null>(null)
  const [mostrarSenhaProvisoria, setMostrarSenhaProvisoria] = useState(false)
  const [senhaProvisoriaGerada, setSenhaProvisoriaGerada] = useState<{
    password: string
    expiresAt: string
  } | null>(null)
  

  // Todas as áreas para edição de perfil (modal Editar Usuário)
  const TODAS_AREAS_EDICAO: { value: string; label: string }[] = useMemo(() => [
    { value: 'wellness', label: t.areas.wellness },
    { value: 'nutri', label: t.areas.nutri },
    { value: 'coach', label: t.areas.coach },
    { value: 'nutra', label: t.areas.nutra },
    { value: 'med', label: t.areas.med },
    { value: 'psi', label: t.areas.psi },
    { value: 'psicanalise', label: t.areas.psicanalise },
    { value: 'odonto', label: t.areas.odonto },
    { value: 'estetica', label: t.areas.estetica },
    { value: 'fitness', label: t.areas.fitness },
    { value: 'perfumaria', label: t.areas.perfumaria },
    { value: 'ylada', label: t.areas.ylada },
  ], [t])

  // Formulários
  const [formUsuario, setFormUsuario] = useState({
    area: 'wellness' as string,
    nome_completo: '',
    nome_presidente: '' as string | null
  })

  // Lista de presidentes autorizados
  const [presidentesAutorizados, setPresidentesAutorizados] = useState<Array<{ nome_completo: string }>>([])

  const [formAssinatura, setFormAssinatura] = useState({
    current_period_end: '',
    plan_type: 'monthly' as 'monthly' | 'annual' | 'free',
    status: 'active' as 'active' | 'canceled' | 'past_due'
  })

  // Carregar lista de presidentes autorizados
  const definirComoPresidente = async (userId: string) => {
    setDefinindoPresidente(userId)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/presidentes/definir-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(data.message || t.messages.presidentDefined)
        carregarUsuarios()
      } else {
        setError(data.error || t.messages.errorDefinePresident)
      }
    } catch (err: any) {
      setError(t.messages.errorDefinePresident)
    } finally {
      setDefinindoPresidente(null)
    }
  }

  const carregarPresidentes = async () => {
    try {
      const response = await fetch('/api/admin/presidentes/autorizar?canonical=1', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Usar lista canônica (um nome por casal/equipe) quando disponível; senão lista completa ativa
          if (data.canonicalList && data.canonicalList.length > 0) {
            setPresidentesAutorizados(
              data.canonicalList.map((nome: string) => ({ nome_completo: nome }))
            )
          } else if (data.presidentes) {
            const ativos = data.presidentes
              .filter((p: any) => p.status === 'ativo')
              .map((p: any) => ({ nome_completo: p.nome_completo }))
            setPresidentesAutorizados(ativos)
          }
        }
      }
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err)
    }
  }

  // Buscar dados da API
  const carregarUsuarios = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filtroBloco !== 'todos') params.append('bloco', filtroBloco)
      if (filtroArea !== 'todos') params.append('area', filtroArea)
      if (filtroStatus !== 'todos') params.append('status', filtroStatus)
      if (filtroAssinatura !== 'todos') params.append('assinatura', filtroAssinatura)
      if (filtroPresidente !== 'todos') params.append('presidente', filtroPresidente)
      if (busca) params.append('busca', busca)

      const url = `/api/admin/usuarios?${params.toString()}`
      const response = await fetch(url, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(t.messages.errorLoad)
      }

      const data = await response.json()

      if (data.success) {
        setUsuarios(data.usuarios || [])
        setStats(data.stats || { total: 0, ativos: 0, inativos: 0 })
      } else {
        throw new Error(t.messages.errorLoad)
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err)
      setError(err.message || t.messages.errorLoad)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarPresidentes()
    const timeoutId = setTimeout(() => {
      carregarUsuarios()
    }, busca ? 500 : 0)

    return () => clearTimeout(timeoutId)
  }, [filtroBloco, filtroArea, filtroStatus, filtroAssinatura, filtroPresidente, busca])

  // Abrir modal de editar usuário (usa nome canônico no dropdown quando existir)
  const abrirEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario)
    setFormUsuario({
      area: usuario.area,
      nome_completo: usuario.nome,
      nome_presidente: (usuario.nome_presidente_canonico ?? usuario.nome_presidente) || null
    })
    setMostrarEditarUsuario(true)
  }

  // Abrir modal de editar assinatura
  const abrirEditarAssinatura = (usuario: Usuario) => {
    if (!usuario.assinaturaId) {
      setError(t.messages.errorNoSubscription)
      return
    }
    setUsuarioSelecionado(usuario)
    
    // Data de vencimento no fuso local (YYYY-MM-DD) para bater com o "Vence: DD/MM" da lista — ver lib/date-utils.ts
    const dataFormatada = toLocalDateStringISO(usuario.assinaturaVencimento)
    
    setFormAssinatura({
      current_period_end: dataFormatada,
      plan_type: usuario.assinatura === 'mensal' ? 'monthly' : 
                 usuario.assinatura === 'anual' ? 'annual' : 'free',
      status: (usuario.statusAssinatura as 'active' | 'canceled' | 'past_due') || 'active'
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
        setError(t.messages.errorNotAuthenticated)
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
        setError(data.error || t.messages.errorUpdate)
        return
      }

      setSuccess(t.messages.userUpdated)
      setMostrarEditarUsuario(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || t.messages.errorUpdate)
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
        setError(t.messages.errorNotAuthenticated)
        return
      }

      // Converter data para ISO se fornecida
      const body: any = {
        plan_type: formAssinatura.plan_type,
        status: formAssinatura.status
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
        setError(data.error || t.messages.errorUpdate)
        return
      }

      setSuccess(t.messages.subscriptionUpdated)
      setMostrarEditarAssinatura(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || t.messages.errorUpdate)
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
        setSuccess(t.messages.userUpdated)
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

  // Gerar senha provisória
  const gerarSenhaProvisoria = async (userId: string, email: string) => {
    if (!confirm(`Gerar senha provisória para ${email}?\n\nA senha expirará em 3 dias.`)) {
      return
    }

    try {
      setSalvando(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/admin/usuarios/${userId}/temporary-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSenhaProvisoriaGerada({
          password: data.temporaryPassword,
          expiresAt: data.expiresAtFormatted
        })
        setMostrarSenhaProvisoria(true)
        setSuccess(t.messages.tempPasswordGenerated)
      } else {
        setError(data.error || 'Erro ao gerar senha provisória')
      }
    } catch (err: any) {
      console.error('Erro ao gerar senha provisória:', err)
      setError(err.message || 'Erro ao gerar senha provisória')
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
        setError(t.messages.errorNotAuthenticated)
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
        setError(data.error || t.messages.errorDelete)
        return
      }

      setSuccess(t.messages.userDeleted)
      setMostrarDeletarUsuario(false)
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || t.messages.errorDelete)
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

  const getAreaLabel = (area: Usuario['area']) => {
    // Compactar o texto para evitar scroll horizontal após adicionar "Presidente"
    switch (area) {
      case 'wellness':
        return 'Well'
      case 'nutri':
        return 'Nutri'
      case 'coach':
        return 'Coach'
      case 'nutra':
        return 'Nutra'
      default:
        return area
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.table.statusActive}</span>
      case 'inativo':
        return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{t.table.statusInactive}</span>
      default:
        return null
    }
  }

  const getAssinaturaStatusBadge = (situacao: Usuario['assinaturaSituacao']) => {
    switch (situacao) {
      case 'ativa':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800">{t.subscriptionBadge.active}</span>
      case 'vencida':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">{t.subscriptionBadge.expired}</span>
      case 'sem':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-600">{t.subscriptionBadge.none}</span>
    }
  }

  const getAssinaturaTipoLabel = (tipo: Usuario['assinatura']) => {
    switch (tipo) {
      case 'mensal':
        return t.subscriptionType.monthly
      case 'anual':
        return t.subscriptionType.annual
      case 'gratuita':
        return t.subscriptionType.free
      default:
        return t.subscriptionType.none
    }
  }

  const exportarPlanilhaUsuarios = () => {
    const headers = [t.table.nameLabel, 'Email', t.table.area, t.table.president, t.table.status, t.table.subscription, t.table.enrollment, t.table.leads, t.table.linksLabel, t.table.clicksLabel]
    const rows = usuarios.map((u) => [
      u.nome,
      u.email,
      u.area,
      u.nome_presidente_canonico || u.nome_presidente || '',
      u.status,
      getAssinaturaTipoLabel(u.assinatura),
      u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR') : '',
      String(u.leadsGerados),
      String(u.linksEnviados ?? 0),
      String(u.cliquesLinks ?? 0),
    ])
    const csv = [headers.join(';'), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
                <h1 className="text-2xl font-bold text-gray-900">{t.page.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← {t.page.back}
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

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.block}</label>
              <select
                value={filtroBloco}
                onChange={(e) => {
                  const novo = e.target.value as 'todos' | 'ylada' | 'wellness'
                  setFiltroBloco(novo)
                  if (novo === 'wellness' && filtroArea !== 'todos' && filtroArea !== 'wellness') {
                    setFiltroArea('todos')
                  } else if (novo === 'ylada' && filtroArea === 'wellness') {
                    setFiltroArea('todos')
                  }
                }}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="ylada">YLADA</option>
                <option value="wellness">{t.areas.wellness}</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">{t.filters.blockHint}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.search}</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder={t.filters.searchPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.area}</label>
              <select
                value={opcoesArea.some((o) => o.value === filtroArea) ? filtroArea : 'todos'}
                onChange={(e) => setFiltroArea(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                {opcoesArea.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{t.filters.areaHint}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.status}</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="ativo">{t.filters.active}</option>
                <option value="inativo">{t.filters.inactive}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.subscription}</label>
              <select
                value={filtroAssinatura}
                onChange={(e) => setFiltroAssinatura(e.target.value as any)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="gratuita">{t.filters.free}</option>
                <option value="mensal">{t.filters.monthly}</option>
                <option value="anual">{t.filters.annual}</option>
                <option value="sem">{t.filters.noSubscription}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.filters.president}</label>
              <select
                value={filtroPresidente}
                onChange={(e) => setFiltroPresidente(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                {presidentesAutorizados.map((p) => (
                  <option key={p.nome_completo} value={p.nome_completo}>
                    {p.nome_completo}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={exportarPlanilhaUsuarios}
                disabled={loading || usuarios.length === 0}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📥 {t.export}
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mb-6 text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">{t.messages.loading}</p>
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.stats.total}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.stats.active}</p>
              <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.stats.inactive}</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inativos}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">{t.stats.showing}</p>
              <p className="text-2xl font-bold text-blue-600">{usuarios.length}</p>
            </div>
          </div>
        )}

        {/* Lista de Usuários */}
        {!loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {usuarios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{t.messages.noUsers}</p>
              </div>
            ) : (
              <div
                className="overflow-x-auto w-full max-w-full touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <table className="w-full min-w-[800px] divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.user}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.area}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.isPresident}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.president}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.status}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.subscription}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.enrollment}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.leads}</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-3 py-4">
                          <div className="flex items-center min-w-[200px]">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-3 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate" title={usuario.nome}>
                                {usuario.nome}
                              </div>
                              <div className="text-sm text-gray-500 truncate" title={usuario.email}>
                                {usuario.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getAreaIcon(usuario.area)}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getAreaColor(usuario.area)}`}
                              title={usuario.area}
                            >
                              {getAreaLabel(usuario.area)}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {usuario.is_presidente ? (
                            <span className="text-xs font-medium text-green-700">{t.table.yes}</span>
                          ) : usuario.area === 'wellness' ? (
                            <button
                              type="button"
                              onClick={() => definirComoPresidente(usuario.id)}
                              disabled={definindoPresidente === usuario.id}
                              className="text-xs text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                            >
                              {definindoPresidente === usuario.id ? t.table.saving : t.table.defineAsPresident}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-4 min-w-[150px]">
                          <div className="text-sm text-gray-900 truncate" title={usuario.nome_presidente_canonico || usuario.nome_presidente || ''}>
                            {usuario.nome_presidente_canonico || usuario.nome_presidente || <span className="text-gray-400 italic">{t.table.notDefined}</span>}
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {getStatusBadge(usuario.status)}
                        </td>
                        <td className="px-3 py-4 min-w-[180px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            {getAssinaturaStatusBadge(usuario.assinaturaSituacao)}
                            <span className="text-sm text-gray-900">
                              {getAssinaturaTipoLabel(usuario.assinatura)}
                            </span>
                            {usuario.isMigrado && (
                              <span className="text-xs text-orange-600" title="Usuário migrado">🔄</span>
                            )}
                          </div>
                          {usuario.assinaturaVencimento ? (
                            usuario.assinaturaSituacao === 'ativa' ? (
                              <div className="text-xs text-gray-500 mt-1">
                                {t.table.expires}: {new Date(usuario.assinaturaVencimento).toLocaleDateString('pt-BR')}
                              </div>
                            ) : (
                              <div className="text-xs text-red-600 mt-1">
                                {t.table.expired}: {new Date(usuario.assinaturaVencimento).toLocaleDateString('pt-BR')}
                                {typeof usuario.assinaturaDiasVencida === 'number' && (
                                  <span className="ml-1">
                                    ({usuario.assinaturaDiasVencida === 0 ? 'hoje' : `há ${usuario.assinaturaDiasVencida} dia${usuario.assinaturaDiasVencida === 1 ? '' : 's'}`})
                                  </span>
                                )}
                              </div>
                            )
                          ) : (
                            <div className="text-xs text-gray-500 mt-1">
                              {t.table.neverSubscribed}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                          {usuario.dataCadastro
                            ? new Date(usuario.dataCadastro).toLocaleDateString('pt-BR')
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap min-w-[100px]">
                          <div className="text-[11px] text-gray-600 space-y-1">
                            <div>
                              <span className="font-medium">{t.table.leadsLabel}:</span> <span className="text-gray-900 font-semibold">{usuario.leadsGerados}</span>
                            </div>
                            <div>
                              <span className="font-medium">{t.table.linksLabel}:</span> <span className="text-gray-900 font-semibold">{usuario.linksEnviados ?? 0}</span>
                            </div>
                            <div>
                              <span className="font-medium">{t.table.clicksLabel}:</span> <span className="text-gray-900 font-semibold">{usuario.cliquesLinks ?? 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium min-w-[140px]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => abrirEditarUsuario(usuario)}
                              className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                            >
                              {t.table.edit}
                            </button>
                            {usuario.assinaturaId && (
                              <button
                                onClick={() => abrirEditarAssinatura(usuario)}
                                className="text-green-600 hover:text-green-900 whitespace-nowrap"
                              >
                                {t.table.subscriptionBtn}
                              </button>
                            )}
                            <button
                              onClick={() => abrirDeletarUsuario(usuario)}
                              className="text-red-600 hover:text-red-900 whitespace-nowrap"
                            >
                              {t.table.delete}
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
            <h2 className="text-xl font-bold mb-4">{t.modal.editUser}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.fullName}</label>
                <input
                  type="text"
                  value={formUsuario.nome_completo}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nome_completo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.area}</label>
                <select
                  value={TODAS_AREAS_EDICAO.some((a) => a.value === formUsuario.area) ? formUsuario.area : 'wellness'}
                  onChange={(e) => setFormUsuario({ ...formUsuario, area: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {TODAS_AREAS_EDICAO.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{t.modal.areaHint}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.president}</label>
                <select
                  value={formUsuario.nome_presidente || ''}
                  onChange={(e) => setFormUsuario({ ...formUsuario, nome_presidente: e.target.value || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t.table.notDefined}</option>
                  {presidentesAutorizados.map((presidente) => (
                    <option key={presidente.nome_completo} value={presidente.nome_completo}>
                      {presidente.nome_completo}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {t.modal.presidentHint}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">🔑 {t.modal.tempPassword}</h3>
                <p className="text-xs text-gray-600 mb-3">
                  {t.modal.tempPasswordHint}
                </p>
                <button
                  onClick={() => usuarioSelecionado && gerarSenhaProvisoria(usuarioSelecionado.id, usuarioSelecionado.email)}
                  disabled={salvando}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {salvando ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      {t.modal.saving}
                    </>
                  ) : (
                    <>
                      🔑 {t.modal.generateTempPassword}
                    </>
                  )}
                </button>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setMostrarEditarUsuario(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t.modal.cancel}
                </button>
                <button
                  onClick={salvarEditarUsuario}
                  disabled={salvando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {salvando ? t.modal.saving : t.modal.save}
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
            <h2 className="text-xl font-bold mb-4">{t.modal.editSubscription}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.planType}</label>
                <select
                  value={formAssinatura.plan_type}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, plan_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">{t.filters.monthly}</option>
                  <option value="annual">{t.filters.annual}</option>
                  <option value="free">{t.filters.free}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.expirationDate}</label>
                <input
                  type="date"
                  value={formAssinatura.current_period_end}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, current_period_end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.subscriptionStatus}</label>
                <select
                  value={formAssinatura.status}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, status: e.target.value as 'active' | 'canceled' | 'past_due' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">{t.subscriptionBadge.active}</option>
                  <option value="canceled">{t.subscriptionBadge.expired}</option>
                  <option value="past_due">Past due</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">{t.modal.subscriptionStatusHint}</p>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setMostrarEditarAssinatura(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {t.modal.cancel}
                </button>
                <button
                  onClick={salvarEditarAssinatura}
                  disabled={salvando}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {salvando ? t.modal.saving : t.modal.save}
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
            <h2 className="text-xl font-bold mb-4 text-red-600">{t.modal.deleteUser}</h2>
            <p className="mb-4 text-gray-700">
              {t.modal.deleteConfirm} <strong>{usuarioSelecionado.nome}</strong> ({usuarioSelecionado.email})?
              <br />
              <span className="text-sm text-red-600">{t.modal.deleteWarning}</span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setMostrarDeletarUsuario(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t.modal.cancel}
              </button>
              <button
                onClick={confirmarDeletarUsuario}
                disabled={salvando}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {salvando ? t.modal.saving : t.table.delete}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Senha Provisória Gerada */}
      {mostrarSenhaProvisoria && senhaProvisoriaGerada && usuarioSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">🔑 {t.modal.tempPasswordTitle}</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>⚠️ {t.modal.tempPasswordImportant}</strong>
                </p>
                <p className="text-sm text-yellow-700">
                  {t.modal.tempPasswordSend}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.table.user}</label>
                <p className="text-sm text-gray-900 font-medium">{usuarioSelecionado.nome}</p>
                <p className="text-sm text-gray-600">{usuarioSelecionado.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.modal.tempPasswordLabel}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={senhaProvisoriaGerada.password}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                    id="temporary-password-input"
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('temporary-password-input') as HTMLInputElement
                      input?.select()
                      document.execCommand('copy')
                      setSuccess(t.messages.passwordCopied)
                      setTimeout(() => setSuccess(null), 3000)
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    📋 {t.modal.copy}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t.modal.expiresAt}</label>
                <p className="text-sm text-gray-900">{senhaProvisoriaGerada.expiresAt}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-800">
                  <strong>💡 {t.modal.tempPasswordTip}</strong>
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  "Olá! Sua senha provisória é: <strong>{senhaProvisoriaGerada.password}</strong><br/>
                  Ela expira em 3 dias. Após fazer login, você poderá alterar sua senha."
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setMostrarSenhaProvisoria(false)
                  setSenhaProvisoriaGerada(null)
                  setMostrarEditarUsuario(false)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t.modal.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
