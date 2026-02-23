'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'

export default function NutriOnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [telefone, setTelefone] = useState('')
  const [countryCode, setCountryCode] = useState('BR')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Carregar perfil para preencher nome/telefone se já existirem
  useEffect(() => {
    if (!user) return
    const carregar = async () => {
      try {
        const res = await fetch('/api/nutri/profile', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const p = data.profile
          if (p?.nome) setNomeCompleto(p.nome)
          else if (user.user_metadata?.full_name) setNomeCompleto(user.user_metadata.full_name)
          else if (user.user_metadata?.name) setNomeCompleto(user.user_metadata.name)
          else if (user.email) setNomeCompleto(user.email.split('@')[0] || '')
          if (p?.whatsapp) setTelefone(p.whatsapp)
          if (p?.countryCode) setCountryCode(p.countryCode || 'BR')
        }
      } catch {
        if (user.user_metadata?.full_name) setNomeCompleto(user.user_metadata.full_name)
        else if (user.email) setNomeCompleto(user.email.split('@')[0] || '')
      }
    }
    carregar()
  }, [user])

  // Verificar se já tem diagnóstico: redirecionar para home
  useEffect(() => {
    const verificarDiagnostico = async () => {
      if (loading || !user) {
        setChecking(false)
        return
      }

      try {
        const response = await fetch('/api/nutri/diagnostico', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.hasDiagnostico) {
            router.replace('/pt/nutri/home')
            return
          }
        }
      } catch (error) {
        console.error('Erro ao verificar diagnóstico:', error)
      } finally {
        setChecking(false)
      }
    }

    verificarDiagnostico()
  }, [user, loading, router])

  const telefoneLimpo = telefone.replace(/\D/g, '')
  const nomePreenchido = nomeCompleto.trim().length >= 2
  const telefonePreenchido = telefoneLimpo.length >= 10
  const podeContinuar = nomePreenchido && telefonePreenchido && !salvando

  const handleComecar = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (!podeContinuar) return

    setErro(null)
    setSalvando(true)
    try {
      const response = await fetch('/api/nutri/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome: nomeCompleto.trim(),
          whatsapp: telefoneLimpo,
          countryCode
        })
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setErro(data.error || 'Não foi possível salvar. Tente de novo.')
        setSalvando(false)
        return
      }

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nutri_veio_do_onboarding', 'true')
        sessionStorage.setItem('nutri_veio_do_onboarding_timestamp', Date.now().toString())
        window.location.href = '/pt/nutri/diagnostico'
      } else {
        router.push('/pt/nutri/diagnostico')
      }
    } catch (err) {
      setErro('Algo deu errado. Tente novamente.')
      setSalvando(false)
    }
  }

  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/logo/nutri-horizontal.png"
            alt="YLADA Nutri"
            width={200}
            height={60}
            className="h-12 w-auto mx-auto mb-6"
            priority
          />
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 border border-gray-100">
          {/* Mensagem da LYA */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full px-6 py-3 mb-6 gap-3">
              {/* Avatar da LYA - Usar fallback até imagem estar disponível */}
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xl">
                👩‍💼
              </div>
              <span className="font-semibold text-lg">LYA</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Bem-vinda à YLADA Nutri
            </h1>
            
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              Aqui você não caminha sozinha.
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              Eu sou a <strong className="text-blue-600">LYA</strong> e vou te guiar passo a passo para você se tornar uma <strong className="text-blue-600">Nutri-Empresária</strong> organizada, confiante e lucrativa.
            </p>
          </div>

          {/* Separador */}
          <div className="border-t border-gray-200 my-8"></div>

          {/* Frase amigável + coleta de nome e telefone */}
          <div className="mb-6">
            <p className="text-center text-gray-700 text-lg leading-relaxed mb-6">
              Para que a gente possa te orientar da melhor forma e manter um contato próximo, preencha os dados abaixo.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="onboarding-nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  id="onboarding-nome"
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Ex.: Maria Silva"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="onboarding-telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone / WhatsApp <span className="text-red-500">*</span>
                </label>
                <PhoneInputWithCountry
                  value={telefone}
                  onChange={(phone, code) => {
                    setTelefone(phone)
                    setCountryCode(code || 'BR')
                  }}
                  defaultCountryCode={countryCode}
                  className="w-full rounded-xl focus-within:ring-2 focus-within:ring-blue-500"
                  placeholder="11 99999-9999"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Assim podemos te avisar sobre novidades e suporte quando precisar
                </p>
              </div>
            </div>

            {erro && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{erro}</p>
              </div>
            )}
          </div>

          {/* Próximo Passo */}
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-lg">
              Agora sim: vamos fazer seu <strong className="text-gray-900">Diagnóstico Estratégico</strong>?
            </p>
            
            <button
              onClick={handleComecar}
              disabled={!podeContinuar}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
            >
              {salvando ? 'Salvando...' : '👉 Começar meu Diagnóstico Estratégico'}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Leva apenas alguns minutos e é essencial para eu te orientar da melhor forma
            </p>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Você pode editar essas informações a qualquer momento em Configurações
          </p>
        </div>
      </div>
    </div>
  )
}




