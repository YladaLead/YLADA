import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Baixa um áudio do WhatsApp (Meta) e transcreve com OpenAI Whisper.
 * Custo: ~$0.006/minuto de áudio.
 */
export async function transcribeWhatsAppAudio(mediaId: string): Promise<string> {
  const token = process.env.WHATSAPP_TOKEN

  // 1. Busca a URL de download do áudio
  const mediaInfoRes = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!mediaInfoRes.ok) {
    throw new Error(`[Whisper] Erro ao buscar info do áudio: ${mediaInfoRes.status}`)
  }

  const mediaInfo = await mediaInfoRes.json()
  const mediaUrl: string = mediaInfo.url

  // 2. Baixa o arquivo de áudio
  const audioRes = await fetch(mediaUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!audioRes.ok) {
    throw new Error(`[Whisper] Erro ao baixar áudio: ${audioRes.status}`)
  }

  const audioBuffer = await audioRes.arrayBuffer()

  // 3. Cria o File para enviar ao Whisper
  const audioFile = new File([audioBuffer], 'audio.ogg', { type: 'audio/ogg; codecs=opus' })

  // 4. Transcreve com Whisper (PT-BR)
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    language: 'pt',
  })

  return transcription.text
}
