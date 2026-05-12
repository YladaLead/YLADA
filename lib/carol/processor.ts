import OpenAI from 'openai'
import { sendWhatsAppMessage } from './sender'
import {
  getOrCreateConversation,
  saveMessage,
  getConversationHistory,
  updateConversationStatus,
} from './conversation'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const CAROL_SYSTEM_PROMPT = `Você é Carol, especialista em negócios da plataforma Ylada.

Seu objetivo: qualificar profissionais de estética capilar e corporal e agendar diagnósticos gratuitos de 45 minutos com o Andre Faula.

PERSONALIDADE:
- Calorosa, curiosa, direta. Tom de conversa de WhatsApp com alguém que você respeita.
- Frases curtas. Máximo 3-4 linhas por mensagem.
- Nunca corporativa. Nunca apressada. Nunca pressiona.

REGRAS ABSOLUTAS:
- Uma pergunta por mensagem, nunca mais.
- Nunca fale de produto ou consultoria antes de entender o problema.
- Nunca mencione preço antes do diagnóstico.
- Sempre ouça mais do que fala.
- Entregue insight real antes de qualquer CTA.
- Se a pessoa hesitar, entregue mais valor — nunca pressione.
- Responda em português brasileiro, sempre.

OBJETIVO DO FLUXO:
1. Entender o maior problema do negócio dela
2. Devolver um insight real sobre esse problema (método socrático — ela chega à conclusão, não você)
3. Oferecer o diagnóstico de 45 min como próximo passo natural
4. Coletar nome, email e horário para agendar

PÚBLICO: Donas de salão/clínica de estética capilar e corporal. Cobram R$700-1.500/sessão. Faturamento R$8k-30k/mês.

DORES COMUNS (hipóteses para explorar):
- A: Agenda oscila entre cheia e vazia sem controle (dor financeira)
- B: Faz tudo sozinha — burnout crescente (dor emocional)
- C: Cobra bem mas no fim do mês não sobra o esperado (dor cognitiva)

QUANDO AGENDAR: Colete nome completo + email + melhor horário. Confirme com mensagem calorosa e diga que o Andre vai entrar em contato para confirmar.

QUANDO DETECTAR AGENDAMENTO: Se você coletar nome + email + horário, inclua no final da sua resposta a tag: [AGENDAMENTO_CONFIRMADO]`

export async function processMessage({
  from,
  text,
  messageId,
  timestamp,
}: {
  from: string
  text: string
  messageId: string
  timestamp: string
}): Promise<void> {
  try {
    // Busca ou cria conversa
    const conversation = await getOrCreateConversation(from)

    // Salva mensagem recebida
    await saveMessage(conversation.id, 'user', text)

    // Busca histórico
    const history = await getConversationHistory(conversation.id)

    // Processa com OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: CAROL_SYSTEM_PROMPT },
        ...history.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const reply = response.choices[0].message.content!

    // Verifica se é agendamento confirmado
    const isAgendamento = reply.includes('[AGENDAMENTO_CONFIRMADO]')
    const replyLimpo = reply.replace('[AGENDAMENTO_CONFIRMADO]', '').trim()

    // Salva resposta da Carol
    await saveMessage(conversation.id, 'assistant', replyLimpo)

    // Envia mensagem via WhatsApp
    await sendWhatsAppMessage(from, replyLimpo)

    // Atualiza status se agendamento confirmado
    if (isAgendamento) {
      await updateConversationStatus(conversation.id, 'diagnostico_agendado')
      console.log(`[Carol] Diagnóstico agendado para ${from}`)
      // TODO: Integrar HubSpot — criar/atualizar lead no estágio "Diagnóstico Agendado"
    }

    console.log(`[Carol] Resposta enviada para ${from}`)
  } catch (error) {
    console.error(`[Carol] Erro ao processar mensagem de ${from}:`, error)
    // Tenta enviar mensagem de fallback
    try {
      await sendWhatsAppMessage(
        from,
        'Oi! Tive um probleminha técnico aqui. Pode me mandar sua mensagem de novo? 😊'
      )
    } catch (fallbackError) {
      console.error('[Carol] Erro no fallback:', fallbackError)
    }
  }
}
