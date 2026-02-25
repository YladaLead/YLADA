'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Presidente {
  id: string
  nome_completo: string
  email: string | null
  status: 'ativo' | 'inativo'
  observacoes: string | null
  autorizado_por_email: string | null
  user_id: string | null
  autoriza_equipe_automatico?: boolean
  data_autorizacao_equipe_automatico?: string | null
  texto_autorizacao_equipe?: string | null
  created_at: string
  updated_at: string
}

interface UsuarioWellness {
  id: string
  nome: string
  email: string
  area: string
}

function AdminPresidentesContent() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [presidentes, setPresidentes] = useState<Presidente[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [usuariosWellness, setUsuariosWellness] = useState<UsuarioWellness[]>([])
  const [vincularLoading, setVincularLoading] = useState<string | null>(null) // id do presidente sendo atualizado
  const [buscaPresidentes, setBuscaPresidentes] = useState('') // filtra lista por nome ou e-mail
  const [buscaUsuario, setBuscaUsuario] = useState('') // filtra usuários ao vincular (form e tabela)
  const [emailPorPresidente, setEmailPorPresidente] = useState<Record<string, string>>({}) // e-mail digitado por linha para vincular
  const [erroVincular, setErroVincular] = useState<Record<string, string>>({}) // mensagem de erro por presidente
  const [mostrarSugestoesEmail, setMostrarSugestoesEmail] = useState(false) // autocomplete no cadastro
  const [registroAutorizacaoModal, setRegistroAutorizacaoModal] = useState<Presidente | null>(null) // comprovação do aceite (data + texto)

  // Formulário para adicionar presidente
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    observacoes: '',
    user_id: '' as string | null,
  })

  // Buscar lista de presidentes
  const carregarPresidentes = async () => {
    try {
      setLoadingList(true)
      const response = await fetch('/api/admin/presidentes/autorizar', {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setPresidentes(data.presidentes || [])
        }
      }
    } catch (err) {
      console.error('Erro ao carregar presidentes:', err)
      setError('Erro ao carregar lista de presidentes')
    } finally {
      setLoadingList(false)
    }
  }

  const carregarUsuariosWellness = async () => {
    try {
      const response = await fetch('/api/admin/usuarios?area=wellness', { credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        setUsuariosWellness(data.usuarios || [])
      }
    } catch (err) {
      console.error('Erro ao carregar usuários wellness:', err)
    }
  }

  useEffect(() => {
    carregarPresidentes()
    carregarUsuariosWellness()
  }, [])

  // Ao digitar o e-mail do presidente, vincular à conta automaticamente se existir usuário com esse e-mail
  useEffect(() => {
    const em = formData.email.trim().toLowerCase()
    if (!em || usuariosWellness.length === 0) return
    const found = usuariosWellness.find((u) => u.email?.toLowerCase() === em)
    if (found && formData.user_id !== found.id) {
      setFormData((prev) => ({ ...prev, user_id: found.id }))
    }
  }, [formData.email, usuariosWellness])

  // Adicionar presidente
  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/presidentes/autorizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome_completo: formData.nome_completo.trim(),
          email: formData.email.trim() || null,
          observacoes: formData.observacoes.trim() || null,
          user_id: formData.user_id || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Presidente autorizado com sucesso!')
        setFormData({ nome_completo: '', email: '', observacoes: '', user_id: null })
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao autorizar presidente')
      }
    } catch (err: any) {
      setError('Erro ao autorizar presidente. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  // Desativar presidente
  const handleDesativar = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar este presidente?')) {
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/admin/presidentes/autorizar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSuccess('Presidente desativado com sucesso!')
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao desativar presidente')
      }
    } catch (err: any) {
      setError('Erro ao desativar presidente. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVincular = async (presidenteId: string, userId: string | null) => {
    setVincularLoading(presidenteId)
    setError(null)
    setSuccess(null)
    setErroVincular((prev) => ({ ...prev, [presidenteId]: '' }))
    try {
      const response = await fetch('/api/admin/presidentes/autorizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: presidenteId, user_id: userId || null }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setSuccess(userId ? 'Conta vinculada com sucesso.' : 'Conta desvinculada com sucesso.')
        setEmailPorPresidente((prev) => ({ ...prev, [presidenteId]: '' }))
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao vincular')
      }
    } catch (err: any) {
      setError('Erro ao vincular. Tente novamente.')
      console.error('Erro:', err)
    } finally {
      setVincularLoading(null)
    }
  }

  const registrarAutorizacaoEquipe = async (presidenteId: string) => {
    setVincularLoading(presidenteId)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/presidentes/autorizar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: presidenteId,
          autoriza_equipe_automatico: true,
          data_autorizacao_equipe_automatico: new Date().toISOString(),
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess('Autorização equipe registrada e documentada.')
        carregarPresidentes()
      } else {
        setError(data.error || 'Erro ao registrar.')
      }
    } catch (err: any) {
      setError('Erro ao registrar. Tente novamente.')
    } finally {
      setVincularLoading(null)
    }
  }

  const vincularPorEmail = (presidenteId: string) => {
    const email = emailPorPresidente[presidenteId]?.trim().toLowerCase()
    setErroVincular((prev) => ({ ...prev, [presidenteId]: '' }))
    if (!email) {
      setErroVincular((prev) => ({ ...prev, [presidenteId]: 'Digite o e-mail' }))
      return
    }
    const user = usuariosWellness.find((u) => u.email?.toLowerCase() === email)
    if (!user) {
      setErroVincular((prev) => ({ ...prev, [presidenteId]: 'Nenhuma conta com este e-mail' }))
      return
    }
    handleVincular(presidenteId, user.id)
  }

  const presidentesAtivos = presidentes.filter(p => p.status === 'ativo')
  const presidentesInativos = presidentes.filter(p => p.status === 'inativo')

  // Filtrar presidentes pela busca (nome ou e-mail)
  const buscaNorm = buscaPresidentes.trim().toLowerCase()
  const presidentesFiltrados = buscaNorm
    ? presidentes.filter(
        (p) =>
          (p.nome_completo && p.nome_completo.toLowerCase().includes(buscaNorm)) ||
          (p.email && p.email.toLowerCase().includes(buscaNorm))
      )
    : presidentes

  // Filtrar usuários Wellness pela busca (e-mail ou nome) para vincular
  const usuarioBuscaNorm = buscaUsuario.trim().toLowerCase()
  const usuariosFiltrados =
    usuarioBuscaNorm && usuariosWellness.length > 0
      ? usuariosWellness.filter(
          (u) =>
            (u.email && u.email.toLowerCase().includes(usuarioBuscaNorm)) ||
            (u.nome && u.nome.toLowerCase().includes(usuarioBuscaNorm))
        )
      : usuariosWellness

  // Sugestões de e-mail ao digitar no cadastro (mostra contas Wellness que batem com o texto)
  const emailCadastroNorm = formData.email.trim().toLowerCase()
  const sugestoesEmailCadastro =
    mostrarSugestoesEmail && emailCadastroNorm.length >= 2 && usuariosWellness.length > 0
      ? usuariosWellness
          .filter(
            (u) =>
              (u.email && u.email.toLowerCase().includes(emailCadastroNorm)) ||
              (u.nome && u.nome.toLowerCase().includes(emailCadastroNorm))
          )
          .slice(0, 10)
      : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <h1 className="text-2xl font-bold text-gray-900">
                  🏆 Gerenciar Presidentes Autorizados
                </h1>
              </Link>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Gerencie a lista de presidentes autorizados para criar conta no ambiente exclusivo
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Formulário para adicionar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ➕ Adicionar Presidente Autorizado
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Adicione presidentes manualmente. O nome será usado no dropdown da página de trial.
            <strong className="text-gray-900"> Use nomes padronizados!</strong>
          </p>
          <form onSubmit={handleAdicionar} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo do Presidente * (padronizado)
              </label>
              <input
                type="text"
                value={formData.nome_completo}
                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                required
                minLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Claudinei Leite"
              />
              <p className="text-xs text-gray-500 mt-1">
                ⚠️ Use o nome exato que aparecerá no dropdown (ex: "Andre e Deise Faula")
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail do presidente
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setMostrarSugestoesEmail(true)}
                onBlur={() => setTimeout(() => setMostrarSugestoesEmail(false), 200)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Comece a digitar para ver e-mails existentes"
              />
              {sugestoesEmailCadastro.length > 0 && (
                <ul
                  className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {sugestoesEmailCadastro.map((u) => (
                    <li key={u.id}>
                      <button
                        type="button"
                        onMouseDown={() => {
                          setFormData((prev) => ({ ...prev, email: u.email, user_id: u.id }))
                          setMostrarSugestoesEmail(false)
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 text-gray-900"
                      >
                        <span className="font-medium">{u.email}</span>
                        {u.nome && u.nome !== u.email && (
                          <span className="text-gray-500 ml-2">— {u.nome}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Este é o e-mail da conta do presidente. Cadastrando por aqui, ele já fica vinculado; ao logar, terá acesso à área &quot;Convite para equipe&quot;. Use o autocomplete para achar e-mails existentes.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações (opcional)
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Observações sobre este presidente..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adicionando...' : 'Adicionar Presidente'}
            </button>
          </form>
        </div>

        {/* Lista de presidentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Presidentes ({presidentesAtivos.length} ativos, {presidentesInativos.length} inativos)
            </h2>
            <input
              type="text"
              value={buscaPresidentes}
              onChange={(e) => setBuscaPresidentes(e.target.value)}
              placeholder="Digite o e-mail ou nome para buscar presidente"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {loadingList ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Carregando...</p>
            </div>
          ) : presidentes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum presidente autorizado ainda. Adicione o primeiro acima.
            </div>
          ) : presidentesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum presidente encontrado com &quot;{buscaPresidentes}&quot;. Limpe a busca ou adicione um novo.
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome Completo
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conta vinculada
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Autorizado por
                    </th>
                    <th
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      title="Aceite do documento: link para equipe sem autorização prévia. Quem aceitou aparece aqui com data."
                    >
                      Autoriz. equipe
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {presidentesFiltrados.map((presidente) => (
                    <tr key={presidente.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900 truncate" title={presidente.nome_completo}>
                          {presidente.nome_completo}
                        </div>
                        {presidente.observacoes && (
                          <div className="text-xs text-gray-500 mt-1 truncate" title={presidente.observacoes}>
                            {presidente.observacoes}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900 truncate" title={presidente.email || ''}>
                          {presidente.email || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          presidente.status === 'ativo'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {presidente.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          {presidente.user_id ? (
                            <>
                              <span className="text-sm text-gray-900 truncate" title={usuariosWellness.find((u) => u.id === presidente.user_id)?.email}>
                                {usuariosWellness.find((u) => u.id === presidente.user_id)?.email ?? '—'}
                              </span>
                              {presidente.status === 'ativo' && (
                                <button
                                  type="button"
                                  onClick={() => handleVincular(presidente.id, null)}
                                  disabled={vincularLoading === presidente.id}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Desvincular
                                </button>
                              )}
                            </>
                          ) : presidente.status === 'ativo' ? (
                            <>
                              <input
                                type="email"
                                value={emailPorPresidente[presidente.id] ?? ''}
                                onChange={(e) => {
                                  setEmailPorPresidente((prev) => ({ ...prev, [presidente.id]: e.target.value }))
                                  setErroVincular((prev) => ({ ...prev, [presidente.id]: '' }))
                                }}
                                onKeyDown={(e) => e.key === 'Enter' && vincularPorEmail(presidente.id)}
                                placeholder="Digite o e-mail do presidente"
                                className="text-xs border border-gray-300 rounded px-2 py-1.5 w-full max-w-[200px]"
                              />
                              <button
                                type="button"
                                onClick={() => vincularPorEmail(presidente.id)}
                                disabled={vincularLoading === presidente.id}
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded w-fit"
                              >
                                {vincularLoading === presidente.id ? 'Salvando…' : 'Vincular'}
                              </button>
                              {erroVincular[presidente.id] && (
                                <span className="text-xs text-red-600">{erroVincular[presidente.id]}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900 truncate" title={presidente.autorizado_por_email || ''}>
                          {presidente.autorizado_por_email || '-'}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-col gap-1">
                          {presidente.autoriza_equipe_automatico ? (
                            <>
                              <span className="text-xs text-green-700 font-medium">Sim</span>
                              <span className="text-xs text-gray-500">
                                {presidente.data_autorizacao_equipe_automatico
                                  ? new Date(presidente.data_autorizacao_equipe_automatico).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                    })
                                  : ''}
                              </span>
                              <button
                                type="button"
                                onClick={() => setRegistroAutorizacaoModal(presidente)}
                                className="text-xs text-green-600 hover:text-green-800 text-left"
                              >
                                Ver registro
                              </button>
                            </>
                          ) : presidente.status === 'ativo' ? (
                            <button
                              type="button"
                              onClick={() => registrarAutorizacaoEquipe(presidente.id)}
                              disabled={vincularLoading === presidente.id}
                              className="text-xs text-green-600 hover:text-green-800"
                            >
                              {vincularLoading === presidente.id ? 'Salvando…' : 'Registrar documento'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-500">Não</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(presidente.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {presidente.status === 'ativo' && (
                          <button
                            onClick={() => handleDesativar(presidente.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                          >
                            Desativar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: comprovação do aceite (para responder se alguém disser que não liberou) */}
        {registroAutorizacaoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setRegistroAutorizacaoModal(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Registro do aceite</h3>
                <button
                  type="button"
                  onClick={() => setRegistroAutorizacaoModal(null)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Fechar"
                >
                  ✕
                </button>
              </div>
              <div className="px-5 py-4 overflow-y-auto flex-1 space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>{registroAutorizacaoModal.nome_completo}</strong>
                </p>
                <p className="text-sm text-gray-700">
                  Aceite registrado em:{' '}
                  <strong>
                    {registroAutorizacaoModal.data_autorizacao_equipe_automatico
                      ? new Date(registroAutorizacaoModal.data_autorizacao_equipe_automatico).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })
                      : '—'}
                  </strong>
                </p>
                <div className="pt-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Texto aceito (documentado)</p>
                  <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 whitespace-pre-line border border-gray-200">
                    {registroAutorizacaoModal.texto_autorizacao_equipe || 'Texto não registrado no momento do aceite.'}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Use este registro como comprovação caso alguém alegue que não autorizou. A data e o texto ficam gravados no sistema.
                </p>
              </div>
              <div className="px-5 py-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setRegistroAutorizacaoModal(null)}
                  className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function AdminPresidentesPage() {
  return (
    <AdminProtectedRoute>
      <AdminPresidentesContent />
    </AdminProtectedRoute>
  )
}
