'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function NutriOnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  // 🚨 CORREÇÃO: Verificar se já tem diagnóstico apenas uma vez
  // Se tiver diagnóstico, redirecionar para home
  // Se não tiver, permanecer na página de onboarding (não redirecionar)
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
          // Se já tem diagnóstico, redirecionar para home
          if (data.hasDiagnostico) {
            console.log('✅ Usuário já tem diagnóstico - redirecionando para home')
            router.replace('/pt/nutri/home')
            return
          } else {
            // Se não tem diagnóstico, permanecer na página de onboarding
            console.log('✅ Usuário sem diagnóstico - permanecendo na página de onboarding')
          }
        }
      } catch (error) {
        console.error('Erro ao verificar diagnóstico:', error)
        // Em caso de erro, permanecer na página (não redirecionar)
      } finally {
        setChecking(false)
      }
    }

    verificarDiagnostico()
  }, [user, loading, router])

  const handleComecar = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    console.log('🚀 Iniciando diagnóstico - navegando para /pt/nutri/diagnostico')
    
    // 🚨 CORREÇÃO: Marcar no sessionStorage que veio do onboarding
    // Isso garante que a página de diagnóstico saiba que não deve redirecionar de volta
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('nutri_veio_do_onboarding', 'true')
        sessionStorage.setItem('nutri_veio_do_onboarding_timestamp', Date.now().toString())
        console.log('✅ Flag de onboarding salva no sessionStorage')
      } catch (err) {
        console.error('Erro ao salvar no sessionStorage:', err)
      }
      
      // Usar window.location.href como método principal (mais confiável)
      // Isso força uma navegação completa mesmo se router.push falhar
      console.log('🔄 Navegando para /pt/nutri/diagnostico usando window.location.href...')
      try {
        window.location.href = '/pt/nutri/diagnostico'
      } catch (err) {
        console.error('Erro ao navegar:', err)
        // Fallback: tentar router.push
        router.push('/pt/nutri/diagnostico')
      }
    } else {
      // Fallback para SSR (não deve acontecer, mas por segurança)
      router.push('/pt/nutri/diagnostico')
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
                🤖
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

          {/* Próximo Passo */}
          <div className="text-center">
            <p className="text-gray-600 mb-6 text-lg">
              Para começar, preciso conhecer você melhor. Vamos fazer seu <strong className="text-gray-900">Diagnóstico Estratégico</strong>?
            </p>
            
            <button
              onClick={handleComecar}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              👉 Começar meu Diagnóstico Estratégico
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Leva apenas alguns minutos e é essencial para eu te orientar da melhor forma
            </p>
          </div>
        </div>

        {/* Informação adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Você pode editar essas informações a qualquer momento depois
          </p>
        </div>
      </div>
    </div>
  )
}




