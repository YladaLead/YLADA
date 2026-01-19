'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { landingPageVideos } from '@/lib/landing-pages-assets'

const WORKSHOP_YOUTUBE_URL = 'https://www.youtube.com/watch?v=riDEYlrfu0E&feature=youtu.be'
const WORKSHOP_VIDEO_ID = 'riDEYlrfu0E'

export default function WellnessWorkshopPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [step, setStep] = useState<'intro' | 'workshop'>('intro')
  const [assistido, setAssistido] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [loading, setLoading] = useState(false)

  // Loading enquanto autenticação carrega
  if (authLoading) {
    return (
      <ConditionalWellnessSidebar>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      </ConditionalWellnessSidebar>
    )
  }

  // Verificar se já assistiu (opcional - pode salvar no banco depois)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jaAssistiuIntro = localStorage.getItem('wellness_workshop_intro_assistido')
      const jaAssistiu = localStorage.getItem('wellness_workshop_assistido')
      if (jaAssistiuIntro === 'true') {
        setStep('workshop')
      }
      if (jaAssistiu === 'true') {
        setAssistido(true)
      }
    }
  }, [])

  const handleAssistiuIntro = async () => {
    setLoading(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('wellness_workshop_intro_assistido', 'true')
    }
    setTimeout(() => {
      setStep('workshop')
      setLoading(false)
    }, 400)
  }

  const handleAssistido = async () => {
    setLoading(true)
    
    // Salvar no localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('wellness_workshop_assistido', 'true')
    }

    // TODO: Salvar no banco (opcional)
    // try {
    //   await fetch('/api/wellness/workshop/marcar-assistido', {
    //     method: 'POST',
    //     credentials: 'include'
    //   })
    // } catch (err) {
    //   console.error('Erro ao salvar status:', err)
    // }

    setAssistido(true)
    setLoading(false)

    // Redirecionar para home após 1 segundo
    setTimeout(() => {
      router.push('/pt/wellness/home')
    }, 1000)
  }

  const handleCopiarLink = () => {
    navigator.clipboard.writeText(WORKSHOP_YOUTUBE_URL)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <ConditionalWellnessSidebar>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <span className="text-3xl">{step === 'intro' ? '🎬' : '🎓'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {step === 'intro' ? 'Introdução (vídeo rápido)' : 'Workshop Completo - Filosofia Wellness'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {step === 'intro'
                ? 'Assista este vídeo de introdução. Se você já assistiu, pode pular direto para o workshop completo.'
                : 'Antes de começar a usar a plataforma, é fundamental entender toda a filosofia e metodologia por trás do sistema Wellness.'}
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            {/* Mensagem de Importância */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-6 sm:px-8 sm:py-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <span className="text-4xl">💡</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                    {step === 'intro' ? 'Por que assistir esta introdução?' : 'Por que assistir este workshop?'}
                  </h2>
                  <ul className="space-y-2 text-green-50 text-sm sm:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 mt-1">✓</span>
                      <span>
                        {step === 'intro'
                          ? 'Entenda rapidamente o que é o Wellness e como ele destrava suas conversas'
                          : 'Entenda a filosofia completa por trás do sistema Wellness'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 mt-1">✓</span>
                      <span>Descubra como usar a plataforma com máxima eficiência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 mt-1">✓</span>
                      <span>Aprenda dicas práticas e estratégias comprovadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-200 mt-1">✓</span>
                      <span>Tenha uma base sólida para começar sua jornada</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vídeo (Intro ou Workshop) */}
            <div className="p-6 sm:p-8">
              {step === 'intro' ? (
                <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-video">
                  <video
                    className="w-full h-full object-cover"
                    controls
                    loop
                    playsInline
                    preload="metadata"
                    poster={landingPageVideos.wellnessHeroPoster}
                  >
                    <source src={landingPageVideos.wellnessHero} type="video/mp4" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                </div>
              ) : (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${WORKSHOP_VIDEO_ID}`}
                    title="Workshop Completo - Filosofia Wellness"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Botão Já Assistido */}
                <button
                  onClick={step === 'intro' ? handleAssistiuIntro : handleAssistido}
                  disabled={loading || (step === 'workshop' && assistido)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>{step === 'intro' ? 'Abrindo workshop...' : 'Redirecionando...'}</span>
                    </>
                  ) : step === 'workshop' && assistido ? (
                    <>
                      <span>✅</span>
                      <span>Já assistido - Redirecionando...</span>
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      <span>
                        {step === 'intro'
                          ? 'Já assisti, ir para o workshop completo'
                          : 'Já assisti, continuar para a plataforma'}
                      </span>
                    </>
                  )}
                </button>

                {/* Botão Copiar Link */}
                <button
                  onClick={handleCopiarLink}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  {copiado ? (
                    <>
                      <span>✅</span>
                      <span>Link copiado!</span>
                    </>
                  ) : (
                    <>
                      <span>📋</span>
                      <span>{step === 'intro' ? 'Copiar link do workshop' : 'Copiar link para assistir depois'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Link direto */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Ou acesse diretamente:</p>
                <a
                  href={WORKSHOP_YOUTUBE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm font-medium break-all"
                >
                  {WORKSHOP_YOUTUBE_URL}
                </a>
              </div>
            </div>
          </div>

          {/* Card de Dicas */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💚</span>
              <span>Dicas para aproveitar ao máximo</span>
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">•</span>
                <span>Assista com atenção e anote os pontos principais</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">•</span>
                <span>
                  {step === 'intro'
                    ? 'Se já estiver pronto, pule para o workshop completo (aprox. 2 horas)'
                    : 'O workshop tem aproximadamente 2 horas - reserve um tempo adequado'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">•</span>
                <span>Você pode pausar e retomar quando quiser</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 mt-1">•</span>
                <span>Este material estará sempre disponível no menu para consulta</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ConditionalWellnessSidebar>
  )
}
