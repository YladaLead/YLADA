'use client'

import { useState, useEffect, useRef } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Message {
  id: string
  conteudo: string
  created_at: string
  imagens?: string[]
  video_url?: string
  audio_url?: string
  tipo?: string
  reactions?: Record<string, any[]>
  user: {
    id: string
    nome_completo: string
    email: string
  }
}

export default function ComunidadePage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [recording, setRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [showWhoReacted, setShowWhoReacted] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const emojiReactions = [
    { tipo: 'curtir', emoji: '❤️', label: 'Curtir' },
    { tipo: 'amei', emoji: '😍', label: 'Amei' },
    { tipo: 'util', emoji: '👍', label: 'Útil' },
    { tipo: 'engracado', emoji: '😂', label: 'Engraçado' },
    { tipo: 'fogo', emoji: '🔥', label: 'Fogo' },
    { tipo: 'incrivel', emoji: '🤩', label: 'Incrível' },
    { tipo: 'parabens', emoji: '🎉', label: 'Parabéns' },
    { tipo: 'apoio', emoji: '💪', label: 'Apoio' },
    { tipo: 'duvida', emoji: '🤔', label: 'Dúvida' },
    { tipo: 'surpreso', emoji: '😮', label: 'Surpreso' }
  ]

  useEffect(() => {
    carregarMensagens()
    
    // Atualizar a cada 3 segundos
    intervalRef.current = setInterval(() => {
      carregarMensagens()
    }, 3000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const carregarMensagens = async () => {
    try {
      const response = await fetch('/api/community/posts?area=wellness', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const posts = data.posts || []
        
        // Buscar reações para cada mensagem
        const postsComReacoes = await Promise.all(
          posts.map(async (post: Message) => {
            try {
              const reactionsResponse = await fetch(`/api/community/posts/${post.id}/react`, {
                credentials: 'include'
              })
              if (reactionsResponse.ok) {
                const reactionsData = await reactionsResponse.json()
                return { ...post, reactions: reactionsData.reactions }
              }
            } catch (error) {
              // Ignorar erros de reações
            }
            return post
          })
        )
        
        setMessages(postsComReacoes)
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error)
    } finally {
      setLoading(false)
    }
  }

  const fazerUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/community/upload', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Erro ao fazer upload')
    }
    
    const data = await response.json()
    return data.url
  }

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!message.trim() && uploadedUrls.length === 0 && !audioUrl) || sending || uploading) return

    setSending(true)
    try {
      // Fazer upload dos arquivos se houver
      let imagens: string[] = []
      let video_url: string | null = null
      let audio_url: string | null = null
      
      // Upload de áudio gravado
      if (audioBlob) {
        setUploading(true)
        try {
          const audioFile = new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
          audio_url = await fazerUpload(audioFile)
        } catch (uploadError: any) {
          alert(uploadError.message || 'Erro ao fazer upload do áudio')
          setUploading(false)
          setSending(false)
          return
        } finally {
          setUploading(false)
        }
      }
      
      if (selectedFiles.length > 0) {
        setUploading(true)
        try {
          const uploadPromises = selectedFiles.map(file => fazerUpload(file))
          const urls = await Promise.all(uploadPromises)
          
          // Separar imagens e vídeos
          urls.forEach((url, index) => {
            if (selectedFiles[index].type.startsWith('video/')) {
              video_url = url
            } else {
              imagens.push(url)
            }
          })
        } catch (uploadError: any) {
          alert(uploadError.message || 'Erro ao fazer upload')
          setUploading(false)
          setSending(false)
          return
        } finally {
          setUploading(false)
        }
      }

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conteudo: message.trim() || (audio_url ? 'Áudio compartilhado' : video_url ? 'Vídeo compartilhado' : 'Imagem compartilhada'),
          imagens: imagens.length > 0 ? imagens : undefined,
          video_url: video_url || undefined,
          audio_url: audio_url || undefined
        })
      })

      if (response.ok) {
        setMessage('')
        setSelectedFiles([])
        setUploadedUrls([])
        setAudioBlob(null)
        setAudioUrl(null)
        setRecordingTime(0)
        await carregarMensagens()
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Erro ao enviar:', error)
      alert('Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      })
      
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setRecording(true)
      setRecordingTime(0)
      
      // Atualizar tempo de gravação
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      alert('Erro ao acessar o microfone. Verifique as permissões.')
    }
  }

  const pararGravacao = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  const cancelarGravacao = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
    setRecording(false)
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
  }

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60)
    const secs = segundos % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      const isAudio = file.type.startsWith('audio/')
      const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024
      
      if (!isImage && !isVideo && !isAudio) {
        alert('Apenas imagens, vídeos e áudios são permitidos')
        return false
      }
      
      if (file.size > maxSize) {
        alert(`Arquivo muito grande. Máximo: ${isVideo ? '10MB' : '5MB'}`)
        return false
      }
      
      return true
    })
    
    setSelectedFiles(prev => [...prev, ...validFiles])
  }

  const removerArquivo = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatarMencao = (texto: string) => {
    return texto.split(' ').map((word, i) => {
      if (word.startsWith('@')) {
        const username = word.substring(1)
        return (
          <span key={i}>
            <span className="text-green-600 font-semibold">@{username}</span>{' '}
          </span>
        )
      }
      return <span key={i}>{word} </span>
    })
  }

  const reagir = async (postId: string, tipo: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ tipo })
      })

      if (response.ok) {
        await carregarMensagens()
      }
    } catch (error) {
      console.error('Erro ao reagir:', error)
    }
  }

  const verQuemReagiu = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/react`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(messages.map(m => 
          m.id === postId ? { ...m, reactions: data.reactions } : m
        ))
        setShowWhoReacted(postId)
      }
    } catch (error) {
      console.error('Erro ao buscar reações:', error)
    }
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const agora = new Date()
    const diff = agora.getTime() - date.getTime()
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (minutos < 1) return 'Agora'
    if (minutos < 60) return `${minutos}min`
    if (horas < 24) return `${horas}h`
    if (dias < 7) return `${dias}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">🏘️ Comunidade Wellness</h1>
                <p className="text-gray-600 mt-2">
                  Chat em tempo real - Converse com a comunidade
                </p>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-4 space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando mensagens...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhuma mensagem ainda
                    </h3>
                    <p className="text-gray-600">
                      Seja o primeiro a enviar uma mensagem!
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-green-600 font-semibold">
                            {msg.user.nome_completo?.charAt(0) || msg.user.email?.charAt(0) || 'U'}
                          </span>
                        </div>

                        {/* Mensagem */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold text-gray-900">
                              {msg.user.nome_completo || msg.user.email}
                            </p>
                            <span className="text-sm text-gray-500">
                              {formatarData(msg.created_at)}
                            </span>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3">
                            {msg.conteudo && (
                              <p className="text-gray-800 whitespace-pre-wrap break-words mb-2">
                                {formatarMencao(msg.conteudo)}
                              </p>
                            )}
                            
                            {/* Imagens */}
                            {msg.imagens && msg.imagens.length > 0 && (
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {msg.imagens.map((url, idx) => (
                                  <img
                                    key={idx}
                                    src={url}
                                    alt={`Imagem ${idx + 1}`}
                                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                    onClick={() => window.open(url, '_blank')}
                                  />
                                ))}
                              </div>
                            )}
                            
                            {/* Vídeo */}
                            {msg.video_url && (
                              <div className="mt-2">
                                <video
                                  src={msg.video_url}
                                  controls
                                  className="w-full max-w-md rounded-lg"
                                >
                                  Seu navegador não suporta vídeo.
                                </video>
                              </div>
                            )}
                            
                            {/* Áudio */}
                            {msg.audio_url && (
                              <div className="mt-2">
                                <audio
                                  src={msg.audio_url}
                                  controls
                                  className="w-full max-w-md"
                                >
                                  Seu navegador não suporta áudio.
                                </audio>
                              </div>
                            )}
                            
                            {/* Reações e Ações */}
                            <div className="mt-2 flex items-center space-x-4 text-sm">
                              {/* Mostrar reações existentes */}
                              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className="flex items-center space-x-1">
                                  {Object.entries(msg.reactions).map(([tipo, reactions]: [string, any]) => {
                                    const reactionEmoji = emojiReactions.find(r => r.tipo === tipo)
                                    const userReacted = reactions.some((r: any) => r.user?.user_id === user?.id)
                                    
                                    return (
                                      <button
                                        key={tipo}
                                        onClick={() => reagir(msg.id, tipo)}
                                        className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                          userReacted ? 'bg-green-100 border border-green-300' : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                        title={`${reactionEmoji?.label || tipo}: ${reactions.length}`}
                                      >
                                        <span>{reactionEmoji?.emoji || '👍'}</span>
                                        <span>{reactions.length}</span>
                                      </button>
                                    )
                                  })}
                                </div>
                              )}
                              
                              {/* Botão de reagir */}
                              <button
                                onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                                className="px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors text-sm"
                                title="Adicionar reação"
                              >
                                😊
                              </button>

                              {/* Menu de Reações */}
                              {showReactions === msg.id && (
                                <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex flex-wrap gap-2 z-20">
                                  {emojiReactions.map((reaction) => {
                                    const userReacted = msg.reactions?.[reaction.tipo]?.some(
                                      (r: any) => r.user?.user_id === user?.id
                                    )
                                    return (
                                      <button
                                        key={reaction.tipo}
                                        onClick={() => {
                                          reagir(msg.id, reaction.tipo)
                                          setShowReactions(null)
                                        }}
                                        className={`text-2xl hover:scale-125 transition-transform p-2 rounded-lg ${
                                          userReacted ? 'bg-green-50' : 'hover:bg-gray-50'
                                        }`}
                                        title={reaction.label}
                                      >
                                        {reaction.emoji}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Ver quem reagiu */}
                              {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <button
                                  onClick={() => verQuemReagiu(msg.id)}
                                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                                >
                                  👥 Ver quem reagiu
                                </button>
                              )}

                              {/* Compartilhar */}
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/pt/wellness/comunidade/${msg.id}`
                                  navigator.share({
                                    title: 'Comunidade YLADA Wellness',
                                    text: msg.conteudo || 'Veja esta mensagem na comunidade!',
                                    url: url
                                  }).catch(() => {
                                    navigator.clipboard.writeText(url)
                                    alert('Link copiado!')
                                  })
                                }}
                                className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                              >
                                📤 Compartilhar
                              </button>
                            </div>

                            {/* Modal: Quem reagiu */}
                            {showWhoReacted === msg.id && msg.reactions && (
                              <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-10">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold">Quem reagiu:</h4>
                                  <button
                                    onClick={() => setShowWhoReacted(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {Object.entries(msg.reactions).map(([tipo, reactions]: [string, any]) => {
                                    const reactionEmoji = emojiReactions.find(r => r.tipo === tipo)
                                    return (
                                      <div key={tipo} className="border-b border-gray-100 pb-2 last:border-0">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                          {reactionEmoji?.emoji} {reactionEmoji?.label} ({reactions.length})
                                        </p>
                                        <div className="space-y-1">
                                          {reactions.map((reaction: any) => (
                                            <p key={reaction.id} className="text-sm text-gray-600">
                                              {reaction.user?.nome_completo || reaction.user?.email}
                                            </p>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Caixa de Mensagem */}
              <form onSubmit={enviarMensagem} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                {/* Preview de áudio gravado */}
                {audioUrl && !recording && (
                  <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎤</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Áudio gravado</p>
                          <p className="text-xs text-gray-600">{formatarTempo(recordingTime)}</p>
                        </div>
                        <audio src={audioUrl} controls className="flex-1 max-w-xs" />
                      </div>
                      <button
                        type="button"
                        onClick={cancelarGravacao}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕ Remover
                      </button>
                    </div>
                  </div>
                )}

                {/* Preview de arquivos selecionados */}
                {selectedFiles.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        ) : file.type.startsWith('audio/') ? (
                          <div className="w-20 h-20 bg-purple-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎵</span>
                          </div>
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🎥</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removerArquivo(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          enviarMensagem(e)
                        }
                      }}
                      placeholder="Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        💡 Dica: Use @nome para mencionar alguém
                      </p>
                      <div className="flex items-center space-x-2">
                        {/* Botão de gravar áudio */}
                        {!recording ? (
                          <button
                            type="button"
                            onClick={iniciarGravacao}
                            disabled={uploading || sending}
                            className="text-sm text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
                            title="Gravar áudio"
                          >
                            🎤 Gravar áudio
                          </button>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 rounded-full">
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-red-700 font-medium">
                                {formatarTempo(recordingTime)}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={pararGravacao}
                              className="text-sm text-red-600 hover:text-red-700 transition-colors"
                            >
                              ⏹️ Parar
                            </button>
                            <button
                              type="button"
                              onClick={cancelarGravacao}
                              className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                            >
                              ✕ Cancelar
                            </button>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*,video/*,audio/*"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                        >
                          📎 Anexar arquivo
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={(!message.trim() && selectedFiles.length === 0 && !audioUrl) || sending || uploading || recording}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? '⏳' : sending ? '⏳' : recording ? '🎤' : '📤'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
