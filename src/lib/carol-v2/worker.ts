/**
 * Worker v2 (Carol) — implementação mínima para destravar a UI.
 *
 * Contexto:
 * - A rota `/api/admin/whatsapp/v2/worker` importa `runWorker` daqui.
 * - Em produção estava falhando: `runWorker is not a function` (módulo inexistente).
 *
 * Estratégia:
 * - Reutilizar o worker existente do scheduler (`processScheduledMessages`)
 *   para escoar a fila `whatsapp_scheduled_messages`.
 * - Retornar um shape compatível com a UI `/admin/whatsapp/v2`.
 */

import { processScheduledMessages } from '@/lib/whatsapp-automation/worker'

export type WorkerV2Result = {
  ok: boolean
  skipped?: boolean
  reason?: string
  boasVindas?: { enviados: number; erros: number }
  preAula?: { enviados: number; erros: number }
  followUpNaoRespondeu?: { enviados: number; erros: number }
  /** Dados adicionais para debug/observabilidade. */
  process?: {
    processed: number
    sent: number
    failed: number
    cancelled: number
    errors: number
  }
}

export async function runWorker(area: string = 'nutri'): Promise<WorkerV2Result> {
  try {
    // Hoje o sistema de fila não é particionado por área no schema (mensagens podem vir por conversation_id).
    // Mantemos o parâmetro por compatibilidade com a UI e para futuro.
    void area

    const result = await processScheduledMessages(50)

    // Se não há nada para processar, marcar como "skipped" para a UI explicar.
    if (!result || result.processed === 0) {
      return {
        ok: true,
        skipped: true,
        reason: 'Sem mensagens pendentes para processar',
        boasVindas: { enviados: 0, erros: 0 },
        preAula: { enviados: 0, erros: 0 },
        followUpNaoRespondeu: { enviados: 0, erros: 0 },
        process: result,
      }
    }

    // Por enquanto, alocamos os envios do scheduler em "Pré-aula" (a maior parte dos pendentes atuais).
    // Futuro: podemos segmentar por message_type (welcome/pre_class/etc) se necessário.
    return {
      ok: true,
      boasVindas: { enviados: 0, erros: 0 },
      preAula: { enviados: result.sent, erros: result.errors },
      followUpNaoRespondeu: { enviados: 0, erros: 0 },
      process: result,
    }
  } catch (error: any) {
    return {
      ok: false,
      skipped: false,
      reason: error?.message || 'Erro ao executar worker',
      boasVindas: { enviados: 0, erros: 1 },
      preAula: { enviados: 0, erros: 1 },
      followUpNaoRespondeu: { enviados: 0, erros: 1 },
    }
  }
}

