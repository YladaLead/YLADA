/**
 * Extrai dados de negócio das mensagens do usuário e atualiza o perfil do Noel
 * de forma silenciosa, não-bloqueante.
 *
 * Executa a cada EXTRACTION_EVERY_N turnos do usuário para manter custo baixo.
 * Usa gpt-4o-mini com JSON estruturado (zero latência pro usuário — fire-and-forget).
 *
 * @see migrations/204-ylada-noel-profile.sql — schema da tabela de destino
 * @see src/lib/ylada-profile-resumo.ts      — como o Noel consome esses campos
 */

import OpenAI from 'openai'
import type { SupabaseClient } from '@supabase/supabase-js'

/** Campos que o Noel usa para orientar o usuário. */
export interface ProfileFieldsDetected {
  dor_principal?: string
  prioridade_atual?: string
  fase_negocio?: 'iniciante' | 'em_crescimento' | 'estabilizado' | 'escalando'
  ticket_medio?: number
  canais_principais?: string[]
  metas_principais?: string
}

type ChatMessage = { role: string; content: string }

/** Roda a cada N mensagens do usuário (5 = ~1 call por 5 turnos). */
const EXTRACTION_EVERY_N = 5

const SYSTEM_PROMPT = `
Você é um extrator de dados de negócio. Analise as mensagens do usuário abaixo
e extraia SOMENTE as informações mencionadas explicitamente sobre o negócio dele.

Retorne um JSON com APENAS os campos que foram citados de forma clara.
Omita qualquer campo que não tenha sido mencionado. Não invente.

Campos disponíveis:
- dor_principal (string): maior dificuldade atual. Ex: "agenda vazia", "clientes que somem após a consulta"
- prioridade_atual (string): foco principal agora. Ex: "atrair mais clientes", "aumentar ticket"
- fase_negocio (string enum): um de: "iniciante" | "em_crescimento" | "estabilizado" | "escalando"
- ticket_medio (number): valor médio por venda/cliente em reais. Ex: 800 (sem R$, apenas número)
- canais_principais (array de strings): onde vende ou capta. Ex: ["Instagram", "WhatsApp", "Indicação"]
- metas_principais (string): objetivos declarados. Ex: "fechar 3 contratos novos este mês"

Responda APENAS com JSON válido. Exemplos:
{"dor_principal": "clientes que somem após a primeira sessão", "ticket_medio": 1200}
{"fase_negocio": "em_crescimento", "canais_principais": ["Instagram", "indicação"]}
{}
`.trim()

/**
 * Decide se deve rodar a extração neste turno.
 * Conta as mensagens do usuário no histórico + a mensagem atual.
 */
export function deveExtrair(history: ChatMessage[]): boolean {
  const userCount = history.filter((m) => m.role === 'user').length + 1
  return userCount % EXTRACTION_EVERY_N === 0
}

/**
 * Extrai campos de perfil das últimas mensagens do usuário via gpt-4o-mini.
 * Retorna null se nada relevante foi detectado ou se houve erro.
 */
export async function extrairCamposDePerfil(
  history: ChatMessage[],
  currentMessage: string,
): Promise<ProfileFieldsDetected | null> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Pega até 6 mensagens recentes do usuário — contexto suficiente, janela pequena
  const userMessages = [...history.filter((m) => m.role === 'user').map((m) => m.content), currentMessage]
    .slice(-6)
    .join('\n---\n')

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessages },
      ],
      max_tokens: 200,
      temperature: 0,
      response_format: { type: 'json_object' },
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) return null

    const parsed = JSON.parse(raw) as Record<string, unknown>

    // Sanitiza e valida cada campo
    const result: ProfileFieldsDetected = {}

    if (typeof parsed.dor_principal === 'string' && parsed.dor_principal.trim().length > 3) {
      result.dor_principal = parsed.dor_principal.trim()
    }
    if (typeof parsed.prioridade_atual === 'string' && parsed.prioridade_atual.trim().length > 3) {
      result.prioridade_atual = parsed.prioridade_atual.trim()
    }
    if (
      typeof parsed.fase_negocio === 'string' &&
      ['iniciante', 'em_crescimento', 'estabilizado', 'escalando'].includes(parsed.fase_negocio)
    ) {
      result.fase_negocio = parsed.fase_negocio as ProfileFieldsDetected['fase_negocio']
    }
    if (typeof parsed.ticket_medio === 'number' && parsed.ticket_medio > 0) {
      result.ticket_medio = Math.round(parsed.ticket_medio)
    }
    if (Array.isArray(parsed.canais_principais) && parsed.canais_principais.length > 0) {
      result.canais_principais = parsed.canais_principais.filter((c) => typeof c === 'string')
    }
    if (typeof parsed.metas_principais === 'string' && parsed.metas_principais.trim().length > 3) {
      result.metas_principais = parsed.metas_principais.trim()
    }

    return Object.keys(result).length > 0 ? result : null
  } catch {
    // Falha silenciosa — nunca bloqueia o usuário
    return null
  }
}

/**
 * UPSERT silencioso nos campos detectados do perfil empresarial.
 * Só atualiza campos com valor — nunca apaga o que já estava.
 */
export async function gravarCamposDePerfil(
  supabase: SupabaseClient,
  userId: string,
  segment: string,
  fields: ProfileFieldsDetected,
): Promise<void> {
  const payload: Record<string, unknown> = {
    user_id: userId,
    segment,
    updated_at: new Date().toISOString(),
  }

  if (fields.dor_principal !== undefined) payload.dor_principal = fields.dor_principal
  if (fields.prioridade_atual !== undefined) payload.prioridade_atual = fields.prioridade_atual
  if (fields.fase_negocio !== undefined) payload.fase_negocio = fields.fase_negocio
  if (fields.ticket_medio !== undefined) payload.ticket_medio = fields.ticket_medio
  if (fields.canais_principais !== undefined) payload.canais_principais = JSON.stringify(fields.canais_principais)
  if (fields.metas_principais !== undefined) payload.metas_principais = fields.metas_principais

  await supabase
    .from('ylada_noel_profile')
    .upsert(payload, {
      onConflict: 'user_id,segment',
      ignoreDuplicates: false,
    })
}

/**
 * Ponto de entrada principal — chame com void (fire-and-forget) no final do route do Noel.
 *
 * @example
 * void atualizarPerfilDoChat({ userId, segment, history, currentMessage, supabase }).catch(() => {})
 */
export async function atualizarPerfilDoChat({
  userId,
  segment,
  history,
  currentMessage,
  supabase,
}: {
  userId: string
  segment: string
  history: ChatMessage[]
  currentMessage: string
  supabase: SupabaseClient
}): Promise<void> {
  if (!deveExtrair(history)) return

  const fields = await extrairCamposDePerfil(history, currentMessage)
  if (!fields) return

  await gravarCamposDePerfil(supabase, userId, segment, fields)
}
