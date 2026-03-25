'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase-client'
import { toLocalDateStringISO, formatYmdSlashPtBr } from '@/lib/date-utils'
import { getAdminUsuariosTranslations } from '@/lib/translations/admin-usuarios'
import { PERFIS_MATRIZ_YLADA } from '@/lib/admin-matriz-constants'

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
  whatsapp?: string | null
  /** Free matriz sem linha em subscriptions */
  implicitMatrizFree?: boolean
  podeGerenciarFreeMatriz?: boolean
  yladaFreeSubscriptionId?: string | null
  yladaFreePeriodEnd?: string | null
  /** Derivado do prefixo em stripe_subscription_id (free_mig_ / free_cor_ / legado free_) */
  yladaFreeGrantKind?: 'migration' | 'courtesy' | 'legacy' | null
  /** Categoria para filtro/coluna: free granular, mensal, anual, sem */
  assinaturaCategoria?:
    | 'mensal'
    | 'anual'
    | 'sem'
    | 'free_nunca_pago'
    | 'free_ex_pagante'
    | 'free_migracao'
  /** E-mail em domínio de teste (@ylada.com etc.) — stats de produção excluem */
  isContaTeste?: boolean
  /** Já existiu assinatura mensal ou anual (qualquer área), ver API `everHadPaid` */
  everHadPaid?: boolean
}

interface Stats {
  total: number
  ativos: number
  inativos: number
  historicoPago?: { nuncaPagouRecorrente: number; jaPagouRecorrente: number }
  contasTeste?: { total: number; ativos: number; inativos: number }
}

export default function AdminUsuarios() {
  // Admin sempre em português
  const t = useMemo(() => getAdminUsuariosTranslations('pt'), [])

  /** Base da listagem: Todos (YLADA+Wellness) | só YLADA (todos os segmentos) | só Wellness. API: query `bloco`. */
  const [filtroBloco, setFiltroBloco] = useState<'todos' | 'ylada' | 'wellness'>('ylada')
  /** Coluna Área — API: query `perfil` (slug exato; não confundir com area=ylada legado). */
  const [filtroSegmento, setFiltroSegmento] = useState('todos')
  const [ocultarContasTeste, setOcultarContasTeste] = useState(true)

  const mostrarColunasPresidente = false
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo'>('todos')
  const [filtroAssinatura, setFiltroAssinatura] = useState<
    | 'todos'
    | 'gratuita'
    | 'free_nunca_pago'
    | 'free_ex_pagante'
    | 'free_migracao'
    | 'mensal'
    | 'anual'
    | 'sem'
  >('todos')
  const [filtroHistorico, setFiltroHistorico] = useState<'todos' | 'nunca_pagou' | 'ja_pagou'>('todos')
  const [filtroPresidente, setFiltroPresidente] = useState<string>('todos')
  const [busca, setBusca] = useState('')
  /** Painel de filtros recolhido por padrão — mais espaço para a lista. */
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [stats, setStats] = useState<Stats>({
    total: 0,
    ativos: 0,
    inativos: 0,
    historicoPago: { nuncaPagouRecorrente: 0, jaPagouRecorrente: 0 },
  })
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

  const [diasMigracaoMatriz, setDiasMigracaoMatriz] = useState(3650)
  const [diasCortesiaMatriz, setDiasCortesiaMatriz] = useState(90)
  const [diasEstenderMatriz, setDiasEstenderMatriz] = useState(30)
  const [salvandoFreeMatriz, setSalvandoFreeMatriz] = useState(false)

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
    { value: 'seller', label: t.areas.seller },
  ], [t])

  const opcoesSegmento = useMemo(() => {
    const todosOpt = { value: 'todos', label: t.filters.all }
    const labelFor = (value: string) => {
      const k = value as keyof typeof t.areas
      return k in t.areas ? t.areas[k] : value
    }
    if (filtroBloco === 'wellness') {
      return [todosOpt, { value: 'wellness', label: t.areas.wellness }]
    }
    if (filtroBloco === 'ylada') {
      return [todosOpt, ...PERFIS_MATRIZ_YLADA.map((p) => ({ value: p, label: labelFor(p) }))]
    }
    return [todosOpt, ...TODAS_AREAS_EDICAO.map((a) => ({ value: a.value, label: a.label }))]
  }, [filtroBloco, t, TODAS_AREAS_EDICAO])

  const filtrosAtivosCount = useMemo(() => {
    let n = 0
    if (filtroBloco !== 'ylada') n++
    if (filtroSegmento !== 'todos') n++
    if (busca.trim()) n++
    if (filtroStatus !== 'todos') n++
    if (filtroAssinatura !== 'todos') n++
    if (filtroHistorico !== 'todos') n++
    if (filtroBloco === 'todos' && filtroPresidente !== 'todos') n++
    if (!ocultarContasTeste) n++
    return n
  }, [
    filtroBloco,
    filtroSegmento,
    busca,
    filtroStatus,
    filtroAssinatura,
    filtroHistorico,
    filtroPresidente,
    ocultarContasTeste,
  ])

  const usuariosVisiveis = useMemo(() => {
    if (!ocultarContasTeste) return usuarios
    return usuarios.filter((u) => !u.isContaTeste)
  }, [usuarios, ocultarContasTeste])

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

  // Buscar dados da API (`silent`: atualiza tabela sem spinner de página inteira — ex. após criar plano matriz)
  const carregarUsuarios = async (opts?: { silent?: boolean }) => {
    const silent = !!opts?.silent
    try {
      if (!silent) {
        setLoading(true)
        setError(null)
      }

      const params = new URLSearchParams()
      if (filtroBloco !== 'todos') params.append('bloco', filtroBloco)
      if (filtroStatus !== 'todos') params.append('status', filtroStatus)
      if (filtroAssinatura !== 'todos') params.append('assinatura', filtroAssinatura)
      if (filtroHistorico !== 'todos') params.append('historico', filtroHistorico)
      if (filtroBloco === 'todos' && filtroPresidente !== 'todos') {
        params.append('presidente', filtroPresidente)
      }
      if (busca) params.append('busca', busca)
      if (filtroSegmento !== 'todos') params.append('perfil', filtroSegmento)

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
        const s = data.stats || { total: 0, ativos: 0, inativos: 0 }
        setStats({
          total: s.total ?? 0,
          ativos: s.ativos ?? 0,
          inativos: s.inativos ?? 0,
          historicoPago: s.historicoPago ?? { nuncaPagouRecorrente: 0, jaPagouRecorrente: 0 },
          contasTeste: s.contasTeste ?? { total: 0, ativos: 0, inativos: 0 },
        })
      } else {
        throw new Error(t.messages.errorLoad)
      }
    } catch (err: any) {
      console.error('Erro ao carregar usuários:', err)
      if (!silent) setError(err.message || t.messages.errorLoad)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    carregarPresidentes()
    const timeoutId = setTimeout(() => {
      carregarUsuarios()
    }, busca ? 500 : 0)

    return () => clearTimeout(timeoutId)
  }, [filtroBloco, filtroSegmento, filtroStatus, filtroAssinatura, filtroHistorico, filtroPresidente, busca])

  // Abrir modal de editar usuário (usa nome canônico no dropdown quando existir)
  const abrirEditarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario)
    setFormUsuario({
      area: usuario.area,
      nome_completo: usuario.nome,
      nome_presidente: (usuario.nome_presidente_canonico ?? usuario.nome_presidente) || null
    })
    setDiasMigracaoMatriz(3650)
    setDiasCortesiaMatriz(90)
    setDiasEstenderMatriz(30)
    setMostrarEditarUsuario(true)
  }

  const criarPlanoFreeYlada = async (kind: 'migration' | 'courtesy', diasBruto: number) => {
    if (!usuarioSelecionado) return
    setSalvandoFreeMatriz(true)
    setError(null)
    try {
      const dias = Math.min(3650, Math.max(1, Math.floor(Number(diasBruto)) || (kind === 'migration' ? 3650 : 90)))
      const res = await fetch('/api/admin/subscriptions/free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          user_id: usuarioSelecionado.id,
          area: 'ylada',
          expires_in_days: dias,
          ylada_free_kind: kind,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.modal.matrizFreeError)
      setSuccess(data.message || t.modal.matrizFreeSuccessCreate)
      if (data.subscription && usuarioSelecionado) {
        setUsuarioSelecionado({
          ...usuarioSelecionado,
          yladaFreeSubscriptionId: data.subscription.id,
          yladaFreePeriodEnd: data.subscription.current_period_end,
          implicitMatrizFree: false,
          assinatura: 'gratuita',
          assinaturaSituacao: 'ativa',
          status: 'ativo',
          yladaFreeGrantKind: kind,
        })
      }
      carregarUsuarios()
    } catch (err: any) {
      setError(err.message || t.modal.matrizFreeError)
    } finally {
      setSalvandoFreeMatriz(false)
    }
  }

  const estenderPlanoFreeYlada = async () => {
    if (!usuarioSelecionado?.yladaFreeSubscriptionId) return
    setSalvandoFreeMatriz(true)
    setError(null)
    setSuccess(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        setError(t.messages.errorNotAuthenticated)
        return
      }
      const currentEndMs = usuarioSelecionado.yladaFreePeriodEnd
        ? new Date(usuarioSelecionado.yladaFreePeriodEnd).getTime()
        : Date.now()
      const base = new Date(Math.max(Date.now(), currentEndMs))
      const add = Math.min(3650, Math.max(1, Math.floor(Number(diasEstenderMatriz)) || 30))
      base.setUTCDate(base.getUTCDate() + add)
      const res = await fetch(`/api/admin/subscriptions/${usuarioSelecionado.yladaFreeSubscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ current_period_end: base.toISOString() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || t.modal.matrizFreeError)
      const endIso = data.subscription?.current_period_end as string | undefined
      const endFmt = endIso ? new Date(endIso).toLocaleDateString('pt-BR') : ''
      setSuccess(endFmt ? `${t.modal.matrizFreeSuccessExtend} ${t.table.planEndHighlight}: ${endFmt}.` : t.modal.matrizFreeSuccessExtend)
      if (data.subscription?.current_period_end) {
        setUsuarioSelecionado((u) =>
          u
            ? {
                ...u,
                yladaFreePeriodEnd: data.subscription.current_period_end,
                assinaturaVencimento: String(data.subscription.current_period_end).slice(0, 10),
              }
            : null
        )
      }
      await carregarUsuarios({ silent: true })
    } catch (err: any) {
      setError(err.message || t.modal.matrizFreeError)
    } finally {
      setSalvandoFreeMatriz(false)
    }
  }

  // Abrir modal de editar assinatura (assinaturaId OU linha ylada free matriz)
  const abrirEditarAssinatura = (usuario: Usuario) => {
    const subId = usuario.assinaturaId ?? usuario.yladaFreeSubscriptionId
    if (!subId) {
      setError(t.messages.errorNoSubscription)
      return
    }
    setUsuarioSelecionado({
      ...usuario,
      assinaturaId: subId,
    })
    const vencFonte =
      usuario.assinaturaVencimento ||
      (usuario.yladaFreePeriodEnd ? String(usuario.yladaFreePeriodEnd).slice(0, 10) : null)
    const dataFormatada = toLocalDateStringISO(vencFonte)
    
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

      const payload = mostrarColunasPresidente
        ? formUsuario
        : { area: formUsuario.area, nome_completo: formUsuario.nome_completo }

      const response = await fetch(`/api/admin/usuarios/${usuarioSelecionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(payload)
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
    const subId = usuarioSelecionado?.assinaturaId ?? usuarioSelecionado?.yladaFreeSubscriptionId
    if (!usuarioSelecionado || !subId) return

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

      const response = await fetch(`/api/admin/subscriptions/${subId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        credentials: 'include',
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t.messages.errorUpdate)
        return
      }

      setSuccess(t.messages.subscriptionUpdated)
      setMostrarEditarAssinatura(false)
      await carregarUsuarios({ silent: true })
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
      case 'ylada': return '🔷'
      case 'seller': return '🛒'
      default: return '👤'
    }
  }

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'nutri': return 'bg-green-100 text-green-800'
      case 'coach': return 'bg-purple-100 text-purple-800'
      case 'nutra': return 'bg-blue-100 text-blue-800'
      case 'wellness': return 'bg-teal-100 text-teal-800'
      case 'ylada': return 'bg-sky-100 text-sky-800'
      case 'seller': return 'bg-amber-100 text-amber-900'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAreaLabel = (area: Usuario['area']) => {
    const key = area as keyof typeof t.areas
    if (key in t.areas) return t.areas[key]
    return area
  }

  /** Categorias na listagem / CSV: free granular, cortesia, mensal, anual, sem. */
  const getAssinaturaListLabel = (u: Usuario) => {
    const c = u.assinaturaCategoria
    if (c === 'free_nunca_pago') {
      if (u.yladaFreeGrantKind === 'courtesy') return t.subscriptionType.courtesy
      return t.subscriptionType.freeNeverPaid
    }
    if (c === 'free_ex_pagante') return t.subscriptionType.freeFormerPaid
    if (c === 'free_migracao') return t.subscriptionType.freeMigration
    if (c === 'mensal') return t.subscriptionType.monthly
    if (c === 'anual') return t.subscriptionType.annual
    if (c === 'sem' || u.assinatura === 'sem assinatura') return t.subscriptionType.none
    if (u.assinatura === 'gratuita') {
      if (u.yladaFreeGrantKind === 'courtesy') return t.subscriptionType.courtesy
      return t.subscriptionType.free
    }
    if (u.assinatura === 'mensal') return t.subscriptionType.monthly
    if (u.assinatura === 'anual') return t.subscriptionType.annual
    return t.subscriptionType.none
  }

  /** Uma linha na tabela — detalhes longos ficam no title (tooltip). */
  const getAssinaturaCompactLabel = (u: Usuario): string => {
    const c = u.assinaturaCategoria
    if (c === 'free_nunca_pago') return u.yladaFreeGrantKind === 'courtesy' ? 'Cortesia' : 'Free'
    if (c === 'free_ex_pagante') return 'Free'
    if (c === 'free_migracao') return 'Free'
    if (c === 'mensal') return 'Mensal'
    if (c === 'anual') return 'Anual'
    if (c === 'sem' || u.assinatura === 'sem assinatura') return 'Sem assinatura'
    if (u.assinatura === 'gratuita') return u.yladaFreeGrantKind === 'courtesy' ? 'Cortesia' : 'Free'
    if (u.assinatura === 'mensal') return 'Mensal'
    if (u.assinatura === 'anual') return 'Anual'
    return '—'
  }

  const getPaymentHistoryLabel = (u: Usuario) =>
    u.everHadPaid ? t.filters.hadPaidPlan : t.filters.neverHadPaidPlan

  const getAssinaturaRowTitle = (u: Usuario): string => {
    const lines = [getAssinaturaListLabel(u), getPaymentHistoryLabel(u)]
    if (u.implicitMatrizFree && !u.yladaFreeSubscriptionId) lines.push(t.table.matrizNoSubRowHint)
    if (
      u.assinatura === 'gratuita' &&
      u.yladaFreeGrantKind === 'courtesy' &&
      (u.assinaturaSituacao === 'ativa' || u.assinaturaSituacao === 'vencida')
    ) {
      lines.push(t.table.freeCourtesyHint)
    }
    if (
      u.assinatura === 'gratuita' &&
      u.yladaFreeGrantKind !== 'courtesy' &&
      (u.assinaturaSituacao === 'ativa' || u.assinaturaSituacao === 'vencida')
    ) {
      lines.push(t.table.freeMatrizHint)
    }
    return lines.filter(Boolean).join('\n')
  }

  const exportarPlanilhaUsuarios = () => {
    const headers = mostrarColunasPresidente
      ? [t.table.nameLabel, 'Email', t.table.whatsapp, t.table.area, t.table.isPresident, t.table.president, t.table.subscription, t.filters.paymentHistory, t.table.enrollment, t.table.leads, t.table.linksLabel, t.table.clicksLabel]
      : [t.table.nameLabel, 'Email', t.table.whatsapp, t.table.area, t.table.subscription, t.filters.paymentHistory, t.table.enrollment, t.table.leads, t.table.linksLabel, t.table.clicksLabel]
    const rows = usuariosVisiveis.map((u) => {
      const base = [
        u.nome,
        u.email,
        u.whatsapp || '',
        u.area,
      ]
      const pres = mostrarColunasPresidente
        ? [u.is_presidente ? t.table.yes : '—', u.nome_presidente_canonico || u.nome_presidente || '']
        : []
      const rest = [
        getAssinaturaListLabel(u),
        getPaymentHistoryLabel(u),
        u.dataCadastro ? formatYmdSlashPtBr(u.dataCadastro) : '',
        String(u.leadsGerados),
        String(u.linksEnviados ?? 0),
        String(u.cliquesLinks ?? 0),
      ]
      return [...base, ...pres, ...rest]
    })
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
    <div className="h-dvh max-h-dvh flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link href="/admin" className="flex-shrink-0">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={140}
                  height={48}
                  className="h-8 sm:h-9 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300 flex-shrink-0 hidden sm:block" />
              <div className="min-w-0" title={t.page.subtitle}>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">{t.page.title}</h1>
                <p className="text-[11px] text-gray-500 truncate max-w-[min(100vw-8rem,28rem)] hidden md:block">{t.page.subtitle}</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              ← {t.page.back}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: flex para a tabela ter área fixa na viewport — rolagem H+V no mesmo painel */}
      <main className="flex-1 min-h-0 flex flex-col max-w-7xl mx-auto w-full px-3 sm:px-4 lg:px-6 pt-2 pb-2 gap-2">
        {/* Mensagens */}
        {success && (
          <div className="flex-shrink-0 bg-green-50 border border-green-200 text-green-800 px-3 py-1.5 rounded-md text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="flex-shrink-0 bg-red-50 border border-red-200 text-red-800 px-3 py-1.5 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Filtros — fechados por padrão; abre ao clicar (mais linhas visíveis na tabela). */}
        <div className="flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setFiltrosAbertos((v) => !v)}
            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
            aria-expanded={filtrosAbertos}
          >
            <span className="min-w-0">
              Filtros de listagem
              {filtrosAtivosCount > 0 ? (
                <span className="ml-2 text-xs font-normal text-sky-600 tabular-nums">
                  ({filtrosAtivosCount} ativo{filtrosAtivosCount !== 1 ? 's' : ''})
                </span>
              ) : (
                <span className="ml-2 text-xs font-normal text-gray-500">— toque para abrir</span>
              )}
            </span>
            <span className="text-gray-400 text-base leading-none shrink-0" aria-hidden>
              {filtrosAbertos ? '▴' : '▾'}
            </span>
          </button>
          {filtrosAbertos && (
            <div className="px-3 pb-2 pt-1 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-12 gap-x-2 gap-y-1.5 items-end">
            <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
              <label
                className="block text-[11px] font-medium text-gray-600 mb-0.5 cursor-help"
                title={t.filters.baseHint}
              >
                {t.filters.base}
              </label>
              <select
                value={filtroBloco}
                onChange={(e) => {
                  const novo = e.target.value as 'todos' | 'ylada' | 'wellness'
                  setFiltroBloco(novo)
                  setFiltroSegmento('todos')
                  if (novo !== 'todos') setFiltroPresidente('todos')
                }}
                disabled={loading}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="ylada">{t.filters.yladaAllSegments}</option>
                <option value="wellness">{t.areas.wellness}</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1 md:col-span-1 lg:col-span-2 xl:col-span-2">
              <label
                className="block text-[11px] font-medium text-gray-600 mb-0.5 cursor-help"
                title={t.filters.segmentHint}
              >
                {t.filters.segment}
              </label>
              <select
                value={filtroSegmento}
                onChange={(e) => setFiltroSegmento(e.target.value)}
                disabled={loading}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                {opcoesSegmento.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-3">
              <label
                className="block text-[11px] font-medium text-gray-600 mb-0.5 cursor-help"
                title={t.messages.searchHintAdmin}
              >
                {t.filters.search}
              </label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder={t.filters.searchPlaceholder}
                title={t.messages.searchHintAdmin}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-[11px] font-medium text-gray-600 mb-0.5">{t.filters.status}</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                disabled={loading}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="ativo">{t.filters.active}</option>
                <option value="inativo">{t.filters.inactive}</option>
              </select>
            </div>
            <div className="col-span-1 sm:col-span-1 lg:col-span-2 xl:col-span-2">
              <label
                className="block text-[11px] font-medium text-gray-600 mb-0.5 cursor-help"
                title={t.filters.subscriptionHint}
              >
                {t.filters.subscription}
              </label>
              <select
                value={filtroAssinatura}
                onChange={(e) => setFiltroAssinatura(e.target.value as any)}
                disabled={loading}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="gratuita">{t.filters.free}</option>
                <option value="free_nunca_pago">{t.filters.freeNeverPaid}</option>
                <option value="free_ex_pagante">{t.filters.freeFormerPaid}</option>
                <option value="free_migracao">{t.filters.freeMigration}</option>
                <option value="mensal">{t.filters.monthly}</option>
                <option value="anual">{t.filters.annual}</option>
                <option value="sem">{t.filters.noSubscription}</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-2">
              <label
                className="block text-[11px] font-medium text-gray-600 mb-0.5 cursor-help"
                title={t.filters.paymentHistoryHint}
              >
                {t.filters.paymentHistory}
              </label>
              <select
                value={filtroHistorico}
                onChange={(e) => setFiltroHistorico(e.target.value as 'todos' | 'nunca_pagou' | 'ja_pagou')}
                disabled={loading}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                <option value="todos">{t.filters.all}</option>
                <option value="nunca_pagou">{t.filters.neverHadPaidPlan}</option>
                <option value="ja_pagou">{t.filters.hadPaidPlan}</option>
              </select>
            </div>
            {filtroBloco === 'todos' && (
              <div className="col-span-2 sm:col-span-2 lg:col-span-2 xl:col-span-2">
                <label className="block text-[11px] font-medium text-gray-600 mb-0.5">{t.filters.president}</label>
                <select
                  value={filtroPresidente}
                  onChange={(e) => setFiltroPresidente(e.target.value)}
                  disabled={loading}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="todos">{t.filters.all}</option>
                  {presidentesAutorizados.map((p) => (
                    <option key={p.nome_completo} value={p.nome_completo}>
                      {p.nome_completo}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-span-2 sm:col-span-1 flex items-end xl:col-span-2">
              <button
                type="button"
                onClick={exportarPlanilhaUsuarios}
                disabled={loading || usuariosVisiveis.length === 0}
                className="w-full sm:w-auto px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                📥 {t.export}
              </button>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
            <input
              id="hide-test-accounts"
              type="checkbox"
              checked={ocultarContasTeste}
              onChange={(e) => setOcultarContasTeste(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="hide-test-accounts" className="text-xs text-gray-700 cursor-pointer select-none">
              {t.filters.hideTestAccounts}
            </label>
          </div>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-600">{t.messages.loading}</p>
          </div>
        )}

        {/* Stats — faixa compacta (mais altura para a tabela) */}
        {!loading && (
          <div
            className="flex-shrink-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 px-2.5 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm text-sm"
            title={`${t.stats.testDomainsHint}\n${t.stats.paymentHistoryProdHint}`}
          >
            <span className="text-gray-600">
              {t.stats.total}: <strong className="text-gray-900 tabular-nums">{stats.total}</strong>
              <span className="text-[10px] text-gray-400 font-normal ml-1 hidden sm:inline">(prod.)</span>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600">
              {t.stats.active}: <strong className="text-green-600 tabular-nums">{stats.ativos}</strong>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600">
              {t.stats.inactive}: <strong className="text-gray-700 tabular-nums">{stats.inativos}</strong>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600" title={t.stats.paymentHistoryProdHint}>
              {t.stats.paymentHistoryNeverProd}:{' '}
              <strong className="text-slate-700 tabular-nums">
                {stats.historicoPago?.nuncaPagouRecorrente ?? 0}
              </strong>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600" title={t.stats.paymentHistoryProdHint}>
              {t.stats.paymentHistoryFormerProd}:{' '}
              <strong className="text-indigo-700 tabular-nums">
                {stats.historicoPago?.jaPagouRecorrente ?? 0}
              </strong>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600" title={t.stats.testDomainsHint}>
              {t.stats.testAccounts}:{' '}
              <strong className="text-amber-700 tabular-nums">
                {stats.contasTeste?.total ?? 0}
              </strong>
            </span>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              |
            </span>
            <span className="text-gray-600">
              {t.stats.showing}: <strong className="text-blue-600 tabular-nums">{usuariosVisiveis.length}</strong>
              {ocultarContasTeste && usuarios.length !== usuariosVisiveis.length && (
                <span className="text-[10px] text-gray-400 font-normal ml-1" title={t.stats.testDomainsHint}>
                  ({t.stats.excludingTestAccounts})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Lista de Usuários — scroll único (vertical + horizontal) no espaço restante da tela */}
        {!loading && (
          <div className="flex-1 min-h-0 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[12rem]">
            {usuarios.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-12 px-4">
                <p className="text-gray-500">{t.messages.noUsers}</p>
              </div>
            ) : usuariosVisiveis.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-12 px-4">
                <p className="text-gray-500 max-w-md">{t.messages.noUsersVisibleHiddenTests}</p>
              </div>
            ) : (
              <div
                className="flex-1 min-h-0 w-full overflow-auto overscroll-contain [scrollbar-gutter:stable] touch-pan-x"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <table
                  className={`w-full divide-y divide-gray-200 ${mostrarColunasPresidente ? 'min-w-[780px]' : 'min-w-[560px]'}`}
                >
                  <thead className="bg-gray-50 sticky top-0 z-10 shadow-[inset_0_-1px_0_0_rgb(229,231,235)]">
                    <tr>
                      <th className="w-[13rem] max-w-[13rem] px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.user}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.whatsapp}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.area}</th>
                      {mostrarColunasPresidente && (
                        <>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.isPresident}</th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.president}</th>
                        </>
                      )}
                      <th className="w-[6.5rem] sm:w-24 px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.subscription}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase align-top">
                        <span className="block uppercase tracking-wider">{t.table.enrollment}</span>
                        <span className="block text-[10px] font-normal normal-case text-gray-400 tracking-normal mt-0.5 max-w-[9rem] leading-tight">
                          {t.table.enrollmentSub}
                        </span>
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.leads}</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.table.actions}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuariosVisiveis.map((usuario) => (
                      <tr key={usuario.id} className="hover:bg-gray-50">
                        <td className="px-2 py-2 align-top w-[13rem] max-w-[13rem]">
                          <div className="flex items-start gap-2 min-w-0">
                            <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                              {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <span className="text-xs font-medium text-gray-900 truncate" title={usuario.nome}>
                                  {usuario.nome}
                                </span>
                                {usuario.isContaTeste && (
                                  <span className="flex-shrink-0 px-1 py-0.5 rounded text-[9px] font-semibold bg-amber-100 text-amber-900">
                                    {t.table.testAccountBadge}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate leading-tight" title={usuario.email}>
                                {usuario.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-700 font-mono">
                          {usuario.whatsapp ? (
                            <span title={usuario.whatsapp}>{usuario.whatsapp}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-base mr-1.5">{getAreaIcon(usuario.area)}</span>
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${getAreaColor(usuario.area)}`}
                              title={usuario.area}
                            >
                              {getAreaLabel(usuario.area)}
                            </span>
                          </div>
                        </td>
                        {mostrarColunasPresidente && (
                          <>
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
                          </>
                        )}
                        <td className="px-2 py-2 align-top w-[6.5rem] sm:w-24 max-w-[7rem]">
                          {(() => {
                            const dataVencStr =
                              usuario.assinaturaVencimento ||
                              (usuario.yladaFreePeriodEnd
                                ? String(usuario.yladaFreePeriodEnd).slice(0, 10)
                                : null)
                            const dataVencFmt = dataVencStr
                              ? new Date(dataVencStr + 'T12:00:00').toLocaleDateString('pt-BR')
                              : null
                            const vencida = usuario.assinaturaSituacao === 'vencida'
                            const diasV = usuario.assinaturaDiasVencida
                            const titleExtra =
                              typeof diasV === 'number'
                                ? `\n${diasV === 0 ? 'Vence hoje' : `Vencido há ${diasV} dia(s)`}`
                                : ''
                            return (
                              <div
                                className="space-y-0.5"
                                title={`${getAssinaturaRowTitle(usuario)}${titleExtra}`}
                              >
                                {dataVencFmt && (
                                  <p
                                    className={`text-[10px] leading-tight tabular-nums truncate ${
                                      vencida ? 'text-red-700 font-medium' : 'text-gray-500'
                                    }`}
                                  >
                                    {dataVencFmt}
                                  </p>
                                )}
                                <div className="flex items-center gap-1 flex-wrap">
                                  {vencida && (
                                    <span className="px-1 py-0 rounded text-[9px] font-semibold bg-red-100 text-red-700 shrink-0">
                                      {t.subscriptionBadge.expired}
                                    </span>
                                  )}
                                  <span className="text-xs font-medium text-gray-900 leading-tight">
                                    {getAssinaturaCompactLabel(usuario)}
                                  </span>
                                  {usuario.isMigrado && (
                                    <span className="text-[10px] text-orange-600 shrink-0" title="Usuário migrado">
                                      🔄
                                    </span>
                                  )}
                                </div>
                              </div>
                            )
                          })()}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-600">
                          <div className="text-[9px] text-gray-400 uppercase tracking-wide mb-0.5">{t.table.profileDateStamp}</div>
                          {usuario.dataCadastro
                            ? formatYmdSlashPtBr(usuario.dataCadastro)
                            : <span className="text-gray-400">—</span>}
                        </td>
                        <td className="px-2 py-2 whitespace-nowrap min-w-[5.5rem]">
                          <div className="text-[10px] text-gray-600 space-y-0.5 leading-tight">
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
                        <td className="px-2 py-2 whitespace-nowrap text-xs font-medium min-w-[7rem]">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => abrirEditarUsuario(usuario)}
                              className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                            >
                              {t.table.edit}
                            </button>
                            {(usuario.assinaturaId || usuario.yladaFreeSubscriptionId) && (
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
          <div className="bg-white rounded-lg p-6 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
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
              {mostrarColunasPresidente && (
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
              )}

              {usuarioSelecionado.podeGerenciarFreeMatriz && (
                <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900">{t.modal.matrizFreeTitle}</h3>
                  <p className="text-xs text-gray-600">{t.modal.matrizFreeIntro}</p>
                  <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-2 py-1.5">
                    {t.modal.matrizFreeNotPassword}
                  </p>
                  {usuarioSelecionado.implicitMatrizFree && !usuarioSelecionado.yladaFreeSubscriptionId && (
                    <p className="text-xs text-gray-600">{t.modal.matrizFreeImplicitHint}</p>
                  )}
                  {usuarioSelecionado.yladaFreeSubscriptionId && (
                    <p className="text-xs text-gray-600">{t.modal.matrizFreeHasRowHint}</p>
                  )}

                  {!usuarioSelecionado.yladaFreeSubscriptionId && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-gray-200 bg-slate-50/80 p-3 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-900">{t.modal.matrizFreeMigrationTitle}</h4>
                        <p className="text-[11px] text-gray-600 leading-snug">{t.modal.matrizFreeMigrationIntro}</p>
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] font-medium text-gray-700">{t.modal.matrizFreeDaysValid}</label>
                          <div className="flex flex-col xs:flex-row gap-2 items-stretch xs:items-end">
                            <input
                              type="number"
                              min={1}
                              max={3650}
                              value={diasMigracaoMatriz}
                              onChange={(e) => setDiasMigracaoMatriz(Number(e.target.value))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => criarPlanoFreeYlada('migration', diasMigracaoMatriz)}
                              disabled={salvandoFreeMatriz || salvando}
                              className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                            >
                              {salvandoFreeMatriz ? t.modal.saving : t.modal.matrizFreeMigrationCreateBtn}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-900">{t.modal.matrizFreeCourtesyTitle}</h4>
                        <p className="text-[11px] text-gray-600 leading-snug">{t.modal.matrizFreeCourtesyIntro}</p>
                        <div className="flex flex-col gap-2">
                          <label className="text-[11px] font-medium text-gray-700">{t.modal.matrizFreeDaysValid}</label>
                          <div className="flex flex-col xs:flex-row gap-2 items-stretch xs:items-end">
                            <input
                              type="number"
                              min={1}
                              max={3650}
                              value={diasCortesiaMatriz}
                              onChange={(e) => setDiasCortesiaMatriz(Number(e.target.value))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => criarPlanoFreeYlada('courtesy', diasCortesiaMatriz)}
                              disabled={salvandoFreeMatriz || salvando}
                              className="px-3 py-1.5 bg-amber-700 text-white text-xs rounded-md hover:bg-amber-800 disabled:opacity-50 whitespace-nowrap"
                            >
                              {salvandoFreeMatriz ? t.modal.saving : t.modal.matrizFreeCourtesyCreateBtn}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {usuarioSelecionado.yladaFreeSubscriptionId && (
                    <div className="space-y-2">
                      <p className="text-xs text-gray-700">
                        <span className="font-medium">{t.modal.matrizFreeExpiresLabel}:</span>{' '}
                        {usuarioSelecionado.yladaFreePeriodEnd
                          ? new Date(usuarioSelecionado.yladaFreePeriodEnd).toLocaleDateString('pt-BR')
                          : '—'}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            {t.modal.matrizFreeExtendDays}
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={3650}
                            value={diasEstenderMatriz}
                            onChange={(e) => setDiasEstenderMatriz(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={estenderPlanoFreeYlada}
                          disabled={salvandoFreeMatriz || salvando}
                          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 whitespace-nowrap"
                        >
                          {salvandoFreeMatriz ? t.modal.saving : t.modal.matrizFreeExtend}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
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
                <p className="text-xs text-gray-600 mt-1.5 bg-slate-50 border border-slate-100 rounded-md px-2 py-1.5">
                  <span className="font-semibold text-gray-700">{t.modal.planCategoryInModal}</span>{' '}
                  {getAssinaturaListLabel(usuarioSelecionado)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.modal.expirationDate}</label>
                <input
                  type="date"
                  value={formAssinatura.current_period_end}
                  onChange={(e) => setFormAssinatura({ ...formAssinatura, current_period_end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{t.modal.expirationDateHint}</p>
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
