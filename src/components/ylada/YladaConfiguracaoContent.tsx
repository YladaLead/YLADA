'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { useAuth } from '@/hooks/useAuth'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { translateError } from '@/lib/error-messages'
import { getYladaAreaPathPrefix } from '@/config/ylada-areas'

interface YladaConfiguracaoContentProps {
  areaCodigo: string
  areaLabel: string
}

export default function YladaConfiguracaoContent({ areaCodigo, areaLabel }: YladaConfiguracaoContentProps) {
  const { user, signOut } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()
  const prefix = getYladaAreaPathPrefix(areaCodigo)

  const [perfil, setPerfil] = useState({
    nome: '',
    email: '',
    telefone: '',
    whatsapp: '',
    countryCode: 'BR',
    bio: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [salvoComSucesso, setSalvoComSucesso] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false)
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [salvandoSenha, setSalvandoSenha] = useState(false)
  const [erroSenha, setErroSenha] = useState<string | null>(null)
  const [sucessoSenha, setSucessoSenha] = useState(false)

  const [subscription, setSubscription] = useState<{
    id: string
    plan_type: string
    status: string
    current_period_end: string
    current_period_start?: string
  } | null>(null)
  const [stats, setStats] = useState<{ links_count: number; respostas_total: number; leads_capturados: number }>({
    links_count: 0,
    respostas_total: 0,
    leads_capturados: 0,
  })
  const [progress, setProgress] = useState<{
    profile_ok: boolean
    whatsapp_ok: boolean
    first_link_ok: boolean
    shared_ok: boolean
    first_lead_ok: boolean
    steps_done: number
    steps_total: number
  } | null>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [erroAssinatura, setErroAssinatura] = useState<string | null>(null)

  const carregarPerfil = async () => {
    if (!user) return
    try {
      setCarregando(true)
      const response = await authenticatedFetch('/api/ylada/account')
      if (response.ok) {
        const data = await response.json()
        if (data.profile) {
          setPerfil({
            nome: data.profile.nome || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
            email: data.profile.email || user?.email || '',
            telefone: data.profile.whatsapp || data.profile.telefone || '',
            whatsapp: data.profile.whatsapp || data.profile.telefone || '',
            countryCode: data.profile.countryCode || 'BR',
            bio: data.profile.bio || '',
          })
        }
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error)
      setPerfil((prev) => ({
        ...prev,
        nome: prev.nome || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        email: prev.email || user?.email || '',
      }))
    } finally {
      setCarregando(false)
    }
  }

  const carregarAssinatura = async () => {
    if (!user) return
    try {
      setLoadingSubscription(true)
      const res = await authenticatedFetch('/api/ylada/subscription')
      const data = await res.json()
      if (data.subscription) setSubscription(data.subscription)
      else setSubscription(null)
      if (data.stats) setStats(data.stats)
      if (data.progress) setProgress(data.progress)
    } catch {
      setSubscription(null)
    } finally {
      setLoadingSubscription(false)
    }
  }

  useEffect(() => {
    if (user) {
      setPerfil((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
      }))
      carregarPerfil()
      carregarAssinatura()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const cancelarAssinatura = async () => {
    try {
      setCanceling(true)
      setErroAssinatura(null)
      const res = await authenticatedFetch('/api/ylada/subscription/cancel', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao cancelar')
      setShowCancelModal(false)
      setSubscription(null)
    } catch (e: any) {
      setErroAssinatura(e.message || 'Erro ao cancelar assinatura')
      setTimeout(() => setErroAssinatura(null), 5000)
    } finally {
      setCanceling(false)
    }
  }

  const salvarPerfil = async () => {
    if (!perfil.nome?.trim()) {
      setErro('O nome é obrigatório.')
      setTimeout(() => setErro(null), 5000)
      return
    }
    try {
      setSalvando(true)
      setSalvoComSucesso(false)
      const response = await authenticatedFetch('/api/ylada/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: perfil.nome,
          telefone: perfil.telefone,
          whatsapp: perfil.whatsapp,
          countryCode: perfil.countryCode,
          bio: perfil.bio,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao salvar')
      setSalvoComSucesso(true)
      setErro(null)
      await carregarPerfil()
      setTimeout(() => setSalvoComSucesso(false), 5000)
    } catch (error: any) {
      setErro(translateError(error))
      setTimeout(() => setErro(null), 5000)
    } finally {
      setSalvando(false)
    }
  }

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErroSenha('Preencha todos os campos.')
      return
    }
    if (novaSenha.length < 6) {
      setErroSenha('A nova senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (novaSenha !== confirmarSenha) {
      setErroSenha('A nova senha e a confirmação não conferem.')
      return
    }
    try {
      setSalvandoSenha(true)
      setErroSenha(null)
      const response = await authenticatedFetch('/api/ylada/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: senhaAtual,
          newPassword: novaSenha,
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Erro ao alterar senha')
      setSucessoSenha(true)
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      if (data.requiresLogout) {
        setTimeout(() => signOut(), 1500)
      }
    } catch (error: any) {
      setErroSenha(translateError(error))
    } finally {
      setSalvandoSenha(false)
    }
  }

  const iniciais = (perfil.nome || perfil.email || '?').trim().slice(0, 2).toUpperCase()

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-[720px] space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Configurações da conta</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Gerencie suas informações, segurança e assinatura.
        </p>
      </div>

      {/* Perfil profissional — informações usadas pelo Noel */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div
              className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-semibold"
              aria-hidden
            >
              {iniciais}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{perfil.nome || 'Seu nome'}</h2>
              <p className="text-sm text-gray-500">{perfil.email}</p>
            </div>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-sm text-gray-600 mb-6">
            Atualize seu nome, contato e descrição profissional. O telefone pode ser usado nos botões de contato dos seus diagnósticos.
          </p>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo</label>
              <input
                type="text"
                value={perfil.nome}
                onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={perfil.email}
                readOnly
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                title="O email não pode ser alterado aqui"
              />
              <p className="text-xs text-gray-500 mt-1">Usado para login. Não pode ser alterado nesta tela.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefone / WhatsApp profissional</label>
              <PhoneInputWithCountry
                value={perfil.whatsapp || perfil.telefone?.replace(/\D/g, '') || ''}
                onChange={(phone, countryCode) => {
                  setPerfil({
                    ...perfil,
                    telefone: phone,
                    whatsapp: phone.replace(/\D/g, ''),
                    countryCode,
                  })
                }}
                defaultCountryCode={perfil.countryCode}
              />
              <p className="text-xs text-gray-500 mt-1">Esse número será usado nos botões de contato dos diagnósticos para que clientes falem diretamente com você.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrição profissional (opcional)</label>
              <textarea
                value={perfil.bio}
                onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex.: especialista em estética facial, pós-graduada em..."
              />
              <p className="text-xs text-gray-500 mt-1">Essa descrição pode aparecer em diagnósticos ou conversas com clientes.</p>
            </div>
            {erro && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {erro}
              </div>
            )}
            {salvoComSucesso && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <span aria-hidden>✔</span>
                Perfil atualizado com sucesso.
              </div>
            )}
            <button
              onClick={salvarPerfil}
              disabled={salvando}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {salvando ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Salvando...
                </>
              ) : (
                'Salvar perfil'
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Segurança da conta */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Segurança da conta</h2>
        <p className="text-sm text-gray-600 mb-6">
          Atualize sua senha para manter sua conta segura.
        </p>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha atual</label>
            <div className="relative">
              <input
                type={showSenhaAtual ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showSenhaAtual ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showSenhaAtual ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nova senha</label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showNovaSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showNovaSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar nova senha</label>
            <div className="relative">
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label={showConfirmarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showConfirmarSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          {erroSenha && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {erroSenha}
            </div>
          )}
          {sucessoSenha && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
              <span aria-hidden>✔</span>
              Senha alterada. Você será deslogado para fazer login com a nova senha.
            </div>
          )}
          <button
            onClick={alterarSenha}
            disabled={salvandoSenha}
            className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {salvandoSenha ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Alterando...
              </>
            ) : (
              'Alterar senha'
            )}
          </button>
        </div>
      </section>

      {/* Progresso na YLADA — onboarding contínuo, ativação e retenção */}
      {progress && (
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Seu progresso na YLADA</h2>
          <p className="text-sm text-gray-600 mb-6">
            Complete os passos abaixo para começar a atrair clientes.
          </p>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-3 text-sm">
              {progress.profile_ok ? (
                <span className="text-green-600 font-medium" aria-hidden>☑</span>
              ) : (
                <span className="text-gray-300 font-medium" aria-hidden>☐</span>
              )}
              <span className={progress.profile_ok ? 'text-gray-700' : 'text-gray-500'}>
                Perfil profissional configurado
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {progress.whatsapp_ok ? (
                <span className="text-green-600 font-medium" aria-hidden>☑</span>
              ) : (
                <span className="text-gray-300 font-medium" aria-hidden>☐</span>
              )}
              <span className={progress.whatsapp_ok ? 'text-gray-700' : 'text-gray-500'}>
                WhatsApp conectado
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {progress.first_link_ok ? (
                <span className="text-green-600 font-medium" aria-hidden>☑</span>
              ) : (
                <span className="text-gray-300 font-medium" aria-hidden>☐</span>
              )}
              <span className={progress.first_link_ok ? 'text-gray-700' : 'text-gray-500'}>
                Criar seu primeiro diagnóstico
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {progress.shared_ok ? (
                <span className="text-green-600 font-medium" aria-hidden>☑</span>
              ) : (
                <span className="text-gray-300 font-medium" aria-hidden>☐</span>
              )}
              <span className={progress.shared_ok ? 'text-gray-700' : 'text-gray-500'}>
                Compartilhar diagnóstico com clientes
              </span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              {progress.first_lead_ok ? (
                <span className="text-green-600 font-medium" aria-hidden>☑</span>
              ) : (
                <span className="text-gray-300 font-medium" aria-hidden>☐</span>
              )}
              <span className={progress.first_lead_ok ? 'text-gray-700' : 'text-gray-500'}>
                Receber seu primeiro lead
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700">
                {progress.steps_done} de {progress.steps_total} passos concluídos
              </p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progress.steps_total ? (100 * progress.steps_done) / progress.steps_total : 0}%` }}
                />
              </div>
            </div>
            {progress.steps_done < progress.steps_total && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-gray-500">Próximo passo:</p>
                {!progress.profile_ok || !progress.whatsapp_ok ? (
                  <Link
                    href={`${prefix}/perfil-empresarial`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 text-center"
                  >
                    Completar perfil
                  </Link>
                ) : !progress.first_link_ok ? (
                  <Link
                    href={`${prefix}/links/novo`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 text-center"
                  >
                    Criar diagnóstico
                  </Link>
                ) : !progress.shared_ok ? (
                  <Link
                    href={`${prefix}/links`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 text-center"
                  >
                    Ver diagnósticos
                  </Link>
                ) : !progress.first_lead_ok ? (
                  <Link
                    href={`${prefix}/leads`}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 text-center"
                  >
                    Ver leads
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Assinatura — card padrão SaaS + impacto + cancelar */}
      <section id="assinatura" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Assinatura</h2>
        <p className="text-sm text-gray-600 mb-6">
          Veja o status do seu plano e gerencie sua assinatura.
        </p>
        {loadingSubscription ? (
          <div className="flex items-center gap-2 text-gray-500">
            <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-indigo-600" />
            Carregando...
          </div>
        ) : subscription ? (
          <div className="space-y-6">
            {/* Card plano atual — padrão SaaS */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plano atual</p>
                  <p className="text-lg font-semibold text-gray-900 mt-0.5">
                    {subscription.plan_type === 'free' && 'Plano gratuito'}
                    {(subscription.plan_type === 'monthly' || subscription.plan_type === 'annual') && 'YLADA Professional'}
                    {!['free', 'monthly', 'annual'].includes(subscription.plan_type) && subscription.plan_type}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                  <p className="text-lg font-semibold text-green-700 mt-0.5">Ativo</p>
                </div>
                {(subscription.plan_type === 'monthly' || subscription.plan_type === 'annual') && subscription.current_period_end && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima cobrança</p>
                    <p className="text-lg font-semibold text-gray-900 mt-0.5">
                      {new Date(subscription.current_period_end).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnósticos criados</p>
                  <p className="text-lg font-semibold text-gray-900 mt-0.5">{stats.links_count}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Leads capturados</p>
                  <p className="text-lg font-semibold text-gray-900 mt-0.5">{stats.leads_capturados}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {(subscription.plan_type === 'monthly' || subscription.plan_type === 'annual') && (
                  <Link
                    href="/pt/precos"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
                  >
                    Alterar plano
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar assinatura
                </button>
              </div>
            </div>

            {/* Impacto da YLADA — retenção */}
            {(stats.respostas_total > 0 || stats.leads_capturados > 0) && (
              <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Impacto da YLADA na sua conta</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>Diagnósticos respondidos: <strong>{stats.respostas_total}</strong></li>
                  <li>Conversas iniciadas: <strong>{stats.leads_capturados}</strong></li>
                </ul>
              </div>
            )}

            {subscription.plan_type === 'free' && (
              <Link
                href="/pt/precos"
                className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
              >
                Assinar plano Pro
              </Link>
            )}
            {erroAssinatura && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {erroAssinatura}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-900">Você ainda não ativou um plano da YLADA.</p>
            <p className="text-sm text-gray-600">
              Ative um plano para criar diagnósticos ilimitados, atrair clientes e usar o mentor Noel.
            </p>
            <Link
              href="/pt/precos"
              className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700"
            >
              Ativar plano
            </Link>
          </div>
        )}
      </section>

      {/* Modal confirmar cancelamento */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cancel-modal-title">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 id="cancel-modal-title" className="text-lg font-semibold text-gray-900 mb-2">Cancelar assinatura?</h3>
            <p className="text-gray-600 text-sm mb-6">
              Você continua com acesso até o fim do período já pago. Depois disso, não haverá nova cobrança.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={cancelarAssinatura}
                disabled={canceling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {canceling ? 'Cancelando...' : 'Sim, cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conta */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Conta</h2>
        <p className="text-sm text-gray-600 mb-4">
          Para editar informações estratégicas usadas pelo Noel e pelos diagnósticos, acesse a área{' '}
          <Link href={`${prefix}/perfil-empresarial`} className="text-indigo-600 hover:underline font-medium">
            Perfil
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900"
        >
          Encerrar sessão
        </button>
      </section>
    </div>
  )
}
