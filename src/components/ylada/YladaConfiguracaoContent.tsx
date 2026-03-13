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

  useEffect(() => {
    if (user) {
      setPerfil((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        nome: prev.nome || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
      }))
      carregarPerfil()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Configuração</h1>
        <p className="text-gray-600">
          Preferências e dados da sua conta em {areaLabel}.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do perfil</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome completo</label>
            <input
              type="text"
              value={perfil.nome}
              onChange={(e) => setPerfil({ ...perfil, nome: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={perfil.email}
              readOnly
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
              title="O email não pode ser alterado aqui"
            />
            <p className="text-xs text-gray-500 mt-1">O email é usado para login e não pode ser alterado nesta tela.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio (opcional)</label>
            <textarea
              value={perfil.bio}
              onChange={(e) => setPerfil({ ...perfil, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Breve descrição profissional"
            />
          </div>
          {erro && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {erro}
            </div>
          )}
          {salvoComSucesso && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Perfil salvo com sucesso!
            </div>
          )}
          <button
            onClick={salvarPerfil}
            disabled={salvando}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {salvando ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>Salvar alterações</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar senha</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Senha atual</label>
            <div className="relative">
              <input
                type={showSenhaAtual ? 'text' : 'password'}
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showSenhaAtual ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nova senha</label>
            <div className="relative">
              <input
                type={showNovaSenha ? 'text' : 'password'}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNovaSenha(!showNovaSenha)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNovaSenha ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar nova senha</label>
            <div className="relative">
              <input
                type={showConfirmarSenha ? 'text' : 'password'}
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmarSenha(!showConfirmarSenha)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Senha alterada! Você será deslogado para fazer login com a nova senha.
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
              <>Alterar senha</>
            )}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Para editar seu <strong>perfil empresarial</strong> (informações para o Noel e diagnósticos), acesse{' '}
        <Link href={`${prefix}/perfil-empresarial`} className="text-blue-600 hover:underline">
          Perfil
        </Link>
        .
      </p>
    </div>
  )
}
