'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { getCountryByCode } from '@/components/CountrySelector'

const linkYouTubeHOM = 'https://youtu.be/Uva_4zHdcqQ'

// Extrair ID do vídeo do YouTube
const getYouTubeVideoId = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

const videoId = getYouTubeVideoId(linkYouTubeHOM)

export default function HOMPage() {
  const params = useParams()
  const userSlug = params['user-slug'] as string
  
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    carregarPerfil()
  }, [userSlug])

  // Configurar YouTube Player API para resetar vídeo quando terminar
  useEffect(() => {
    if (typeof window === 'undefined' || !videoId) return

    // Carregar YouTube IFrame API se ainda não estiver carregada
    if (!(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    // Função para inicializar o player quando a API estiver pronta
    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        const iframe = document.getElementById('hom-video-player')
        if (iframe && !playerRef.current) {
          playerRef.current = new (window as any).YT.Player('hom-video-player', {
            events: {
              onStateChange: (event: any) => {
                // Quando o vídeo terminar (state = 0 = ENDED)
                if (event.data === (window as any).YT.PlayerState.ENDED) {
                  // Resetar para o início e pausar
                  setTimeout(() => {
                    if (playerRef.current) {
                      playerRef.current.seekTo(0, true)
                      playerRef.current.pauseVideo()
                    }
                  }, 500)
                }
              },
            },
          })
        }
      }
    }

    // Se a API já estiver carregada
    if ((window as any).YT && (window as any).YT.Player) {
      setTimeout(initPlayer, 1000)
    } else {
      // Aguardar a API carregar
      ;(window as any).onYouTubeIframeAPIReady = () => {
        setTimeout(initPlayer, 500)
      }
    }

    return () => {
      // Cleanup
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (e) {
          console.error('Erro ao destruir player:', e)
        }
        playerRef.current = null
      }
    }
  }, [videoId])

  const carregarPerfil = async () => {
    try {
      console.log('🔍 Carregando perfil para user_slug:', userSlug)
      const response = await fetch(`/api/wellness/profile/by-slug?user_slug=${userSlug}`)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Perfil carregado:', data.profile)
        setProfile(data.profile)
      } else {
        const errorData = await response.json()
        console.error('❌ Erro ao carregar perfil:', errorData)
        alert('Erro ao carregar perfil. Verifique o console para mais detalhes.')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar perfil:', error)
      alert('Erro ao carregar perfil. Verifique o console para mais detalhes.')
    } finally {
      setLoading(false)
    }
  }

  // Monitorar ações dos botões
  const registrarAcao = async (acao: 'nao_interessei' | 'tirar_duvida' | 'saber_mais') => {
    try {
      await fetch('/api/wellness/hom/track-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_slug: userSlug,
          acao,
          timestamp: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Erro ao registrar ação:', error)
      // Não interromper o fluxo se falhar
    }
  }

  const abrirWhatsApp = () => {
    if (!profile?.whatsapp) {
      alert('WhatsApp não disponível para este usuário.')
      return
    }

    // Registrar ação
    registrarAcao('saber_mais')

    const countryCode = profile.countryCode || 'BR'
    const country = getCountryByCode(countryCode)
    const phoneCode = country?.phoneCode ? country.phoneCode.replace(/[^0-9]/g, '') : '55'
    const phoneNumber = profile.whatsapp.replace(/\D/g, '')
    
    // Remover código do país se já estiver presente
    const numeroLimpo = phoneNumber.startsWith(phoneCode) 
      ? phoneNumber.substring(phoneCode.length) 
      : phoneNumber
    
    const whatsappNumber = `${phoneCode}${numeroLimpo}`
    
    console.log('📱 WhatsApp - Gostei quero começar:', {
      countryCode,
      phoneCode,
      phoneNumber,
      numeroLimpo,
      whatsappNumber,
      profile
    })
    
    const mensagem = `Olá! 👋

Gostei da oportunidade e quero minha licença! Quero começar fazendo a licença.`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`
    console.log('🔗 Abrindo WhatsApp:', whatsappUrl)
    console.log('📝 Mensagem que será enviada:', mensagem)
    window.open(whatsappUrl, '_blank')
  }

  const tirarDuvida = () => {
    if (!profile?.whatsapp) {
      alert('WhatsApp não disponível para este usuário.')
      return
    }

    // Registrar ação
    registrarAcao('tirar_duvida')

    const countryCode = profile.countryCode || 'BR'
    const country = getCountryByCode(countryCode)
    const phoneCode = country?.phoneCode ? country.phoneCode.replace(/[^0-9]/g, '') : '55'
    const phoneNumber = profile.whatsapp.replace(/\D/g, '')
    
    // Remover código do país se já estiver presente
    const numeroLimpo = phoneNumber.startsWith(phoneCode) 
      ? phoneNumber.substring(phoneCode.length) 
      : phoneNumber
    
    const whatsappNumber = `${phoneCode}${numeroLimpo}`
    
    console.log('📱 WhatsApp - Quero tirar dúvida:', {
      countryCode,
      phoneCode,
      phoneNumber,
      numeroLimpo,
      whatsappNumber,
      profile
    })
    
    const mensagem = `Olá! 👋

Assisti o vídeo e tenho dúvidas.`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`
    console.log('🔗 Abrindo WhatsApp:', whatsappUrl)
    console.log('📝 Mensagem que será enviada:', mensagem)
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando apresentação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cabeçalho com Título - Design Premium */}
        <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-pulse"></div>
          
          <div className="relative z-10 text-center">
            {/* Título */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg">
              🍹 <span className="whitespace-nowrap">Oportunidade: Bebidas</span> Funcionais
            </h1>
            <p className="text-amber-100 text-base sm:text-lg md:text-xl font-medium">
              Uma oportunidade de negócio que está transformando vidas
            </p>
          </div>
        </div>

        {/* Vídeo do YouTube */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-6 border-2 border-amber-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Assista à apresentação
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900 shadow-lg">
            {videoId ? (
              <iframe
                id="hom-video-player"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}`}
                title="Apresentação Bebidas Funcionais"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>Erro ao carregar vídeo</p>
              </div>
            )}
          </div>
        </div>

        {/* Botões de Ação - Apenas 2 com design premium */}
        <div className="bg-white rounded-xl shadow-xl p-6 border-2 border-amber-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={tirarDuvida}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              💬 Quero tirar dúvida
            </button>
            <button
              onClick={abrirWhatsApp}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-lg"
            >
              🚀 Gostei quero começar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
