'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

interface Invite {
  id: string
  email: string
  nome_completo: string | null
  status: string
  expires_at: string
  created_at: string
  used_at: string | null
}

export default function ConviteEquipePage() {
  return (
    <ConditionalWellnessSidebar>
      <ConviteEquipeContent />
    </ConditionalWellnessSidebar>
  )
}

function ConviteEquipeContent() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [isPresidente, setIsPresidente] = useState<boolean | null>(null)
  const [autorizaEquipeAutomatico, setAutorizaEquipeAutomatico] = useState(false)
  const [dataAutorizacaoEquipe, setDataAutorizacaoEquipe] = useState<string | null>(null)
  const [aceitandoAutorizacao, setAceitandoAutorizacao] = useState(false)
  const [invites, setInvites] = useState<Invite[]>([])
  const [loadingInvites, setLoadingInvites] = useState(true)

  const [email, setEmail] = useState('')
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastInviteUrl, setLastInviteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!user || authLoading) return
    const check = async () => {
      try {
        const res = await fetch('/api/wellness/presidente/status', { credentials: 'include' })
        const data = await res.json()
        setIsPresidente(data.isPresidente === true)
        setAutorizaEquipeAutomatico(data.autorizaEquipeAutomatico === true)
        setDataAutorizacaoEquipe(data.dataAutorizacaoEquipe || null)
        if (!data.isPresidente) return
        const invRes = await fetch('/api/wellness/trial/my-invites', { credentials: 'include' })
        const invData = await invRes.json()
        if (invData.success && invData.invites) setInvites(invData.invites)
      } catch {
        setIsPresidente(false)
      } finally {
        setLoadingInvites(false)
      }
    }
    check()
  }, [user, authLoading])

  const loadInvites = async () => {
    try {
      const res = await fetch('/api/wellness/trial/my-invites', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.invites) setInvites(data.invites)
    } catch {}
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLastInviteUrl(null)
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.')
      return
    }
    setGenerating(true)
    try {
      const res = await fetch('/api/wellness/trial/generate-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          nome_completo: nomeCompleto.trim() || undefined,
          whatsapp: whatsapp.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao gerar link.')
        return
      }
      setLastInviteUrl(data.invite_url)
      setEmail('')
      setNomeCompleto('')
      setWhatsapp('')
      loadInvites()
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (!lastInviteUrl) return
    navigator.clipboard.writeText(lastInviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const TEXTO_AUTORIZACAO = 'Autorizo que membros da minha equipe possam receber link de acesso à plataforma Wellness (trial de 3 dias) sem necessidade de autorização prévia minha para cada convite. Declaro estar ciente de que posso gerar e enviar links de convite diretamente por esta área.'

  const handleAceitarAutorizacao = async () => {
    setAceitandoAutorizacao(true)
    try {
      const res = await fetch('/api/wellness/presidente/aceitar-autorizacao-equipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ texto_aceito: TEXTO_AUTORIZACAO }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setAutorizaEquipeAutomatico(true)
        setDataAutorizacaoEquipe(data.data_autorizacao || new Date().toISOString())
      }
    } finally {
      setAceitandoAutorizacao(false)
    }
  }

  if (authLoading || isPresidente === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
      </div>
    )
  }

  if (!isPresidente) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-md text-center">
          <p className="text-gray-700">Esta área é exclusiva para presidentes.</p>
          <button
            onClick={() => router.push('/pt/wellness/home')}
            className="mt-4 text-green-600 font-medium hover:underline"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Convite para equipe</h1>
        <p className="text-gray-600 mb-6">
          Gere um link único para alguém da sua equipe acessar a plataforma Wellness por 3 dias. Cada link vale para uma única pessoa.
        </p>

        <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail da pessoa *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome (opcional)</label>
              <input
                type="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Nome da pessoa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (opcional)</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          {error && (
            <p className="mt-3 text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={generating}
            className="mt-4 w-full sm:w-auto px-6 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? 'Gerando...' : 'Gerar link'}
          </button>
        </form>

        {lastInviteUrl && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-medium text-green-800 mb-2">Link gerado. Envie para a pessoa:</p>
            <div className="flex flex-wrap gap-2 items-center">
              <input
                type="text"
                readOnly
                value={lastInviteUrl}
                className="flex-1 min-w-0 text-sm text-gray-700 bg-white border border-green-200 rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
              >
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4 border-b border-gray-200">
            Links que você gerou
          </h2>
          {loadingInvites ? (
            <div className="p-6 text-center text-gray-500">Carregando...</div>
          ) : invites.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Nenhum convite ainda.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {invites.map((inv) => (
                <li key={inv.id} className="px-6 py-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{inv.email}</span>
                    {inv.nome_completo && (
                      <span className="text-gray-500 text-sm ml-2">({inv.nome_completo})</span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    inv.status === 'used' ? 'bg-gray-100 text-gray-700' :
                    inv.status === 'expired' ? 'bg-amber-100 text-amber-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {inv.status === 'pending' ? 'Pendente' : inv.status === 'used' ? 'Usado' : 'Expirado'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(inv.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Documento de autorização — opcional, só pra quem quiser; fica embaixo depois de gerar link */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Documento de autorização</h2>
          {autorizaEquipeAutomatico ? (
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-medium text-green-800">
                OK! A partir de hoje, as pessoas da sua equipe que solicitarem receberão o link de 3 dias para uso gratuito.
              </p>
              <p className="text-gray-600">
                ✅ Seu aceite foi registrado em{' '}
                <strong>
                  {dataAutorizacaoEquipe
                    ? new Date(dataAutorizacaoEquipe).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '—'}
                </strong>
                . Este documento fica registrado no painel administrativo (lista de presidentes, coluna &quot;Autoriz. equipe&quot;).
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700 mb-4 whitespace-pre-line">{TEXTO_AUTORIZACAO}</p>
              <button
                type="button"
                onClick={handleAceitarAutorizacao}
                disabled={aceitandoAutorizacao}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {aceitandoAutorizacao ? 'Registrando…' : 'Li e autorizo'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Ao clicar, sua autorização será registrada com data e hora (documentado).
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
