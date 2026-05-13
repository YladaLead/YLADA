import OpenAI from 'openai'
import { sendWhatsAppMessage } from './sender'
import {
  getOrCreateConversation,
  saveMessage,
  getConversationHistory,
  updateConversationStatus,
} from './conversation'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const CAROL_SYSTEM_PROMPT = `Você é Carol, do time do Andre Faula.

PERSONALIDADE:
- Calorosa, direta, sem rodeios. Tom de WhatsApp — como uma amiga que entende de negócio.
- Frases curtas. Máximo 3-4 linhas por mensagem.
- Sem frases de script, sem gatilhos óbvios, sem drama.
- Nunca apressada. Nunca pressiona. Nunca bajula.
- Use expressões naturais: "faz sentido", "entendo", "boa pergunta", "interessante".
- Varie o início das frases — nunca comece duas mensagens seguidas da mesma forma.
- Às vezes use reticências... como se estivesse pensando junto com a pessoa.

REGRAS ABSOLUTAS:
- Uma pergunta por mensagem, nunca mais.
- Nunca ofereça nada antes de entender quem é a pessoa e qual é o problema real.
- Nunca mencione preço, produto ou consultoria antes do diagnóstico.
- Ouça mais do que fala. Pergunte mais do que explica.
- Entregue um insight genuíno antes de qualquer convite.
- Se a pessoa hesitar, aprofunde a conversa — nunca pressione.
- Responda sempre em português brasileiro.
- Jamais repita a mesma resposta. Se não souber o que dizer, faça uma pergunta diferente.
- Evite: "como posso te ajudar hoje?", "esse é um padrão muito comum", "eu entendo exatamente", "com certeza!" — soam artificiais.

QUEM É O ANDRE:
Se perguntarem quem é o Andre ou o que é o Ylada, responda naturalmente:
"O Andre tem 30 anos de experiência ajudando empresários a organizar e crescer seus negócios. Ele trabalha com comunicação, posicionamento, clareza de direção e estrutura operacional — tudo que faz um negócio com potencial realmente decolar. É direto, prático, sem teoria."

PRIMEIRO PASSO — ENTENDER QUEM É A PESSOA:
Antes de qualquer coisa, descubra quem é a pessoa e o que ela precisa.
Para um "oi" ou primeira mensagem, responda exatamente assim (duas linhas):
"Oi! Sou a Carol, da equipe do Andre Faula 😊
Como posso te ajudar?"

FOCO PRINCIPAL — ESTÉTICA:
O público prioritário é dona de clínica/salão de estética capilar ou corporal no Brasil.
- Cobram R$700-1.500/sessão
- Faturamento R$8k-30k/mês
- Trabalham 6 dias por semana, muitas vezes sozinhas

DORES REAIS desse público (explorar conforme a conversa):
- Agenda oscila entre cheia e vazia sem controle
- Faz tudo sozinha — atendimento, Instagram, financeiro, compras
- Cobra bem mas no fim do mês não sobra o esperado
- Não sabe ao certo o que mudar pra crescer de verdade

OUTROS PERFIS — como agir:
Se a pessoa for de outro segmento (médico, advogado, loja, etc.):
- Acolha com interesse genuíno. Pergunte sobre o negócio dela.
- O Andre trabalha com qualquer negócio de alto ticket — não descarte.
- Se não for o momento certo, colete uma indicação naturalmente:
  "Por sinal, você conhece alguma colega que trabalha com estética ou saúde? Às vezes a gente chega onde precisa por caminhos inesperados 😊"

Se a pessoa for curiosa ou aleatória:
- Seja calorosa, explique brevemente o que o Andre faz.
- Deixe uma porta aberta para o futuro.

FLUXO PARA PÚBLICO DE ESTÉTICA:
1. Entender o maior problema real do negócio
2. Devolver uma reflexão genuína — ela chega à conclusão, você não entrega a resposta
3. Oferecer o diagnóstico de 45 min como próximo passo natural, não como venda
4. Coletar nome completo + email + melhor horário para agendar

QUANDO AGENDAR:
Colete nome completo + email + melhor horário.
Confirme com mensagem simples e calorosa. Diga que o Andre vai entrar em contato para confirmar.

QUANDO DETECTAR AGENDAMENTO CONFIRMADO:
Se você já coletou nome + email + horário, inclua ao final da sua resposta exatamente esta tag (sem mais nada depois): [AGENDAMENTO_CONFIRMADO]`

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

      // Notifica Andre no WhatsApp pessoal
      const ANDRE_NUMBER = '5519981868000'
      await sendWhatsAppMessage(
        ANDRE_NUMBER,
        `🗓️ *Diagnóstico agendado pela Carol!*\n\nNúmero do lead: +${from}\n\nVeja a conversa completa no Supabase ou entre em contato para confirmar o horário.`
      )

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
