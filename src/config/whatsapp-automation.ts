/**
 * Kill-switch central da automação Carol/WhatsApp.
 * Quando true: nenhuma resposta automática, nenhum disparo agendado.
 * Padrão: desligado (retorna true se CAROL_AUTOMATION_DISABLED não for exatamente 'false').
 * Para religar no futuro: CAROL_AUTOMATION_DISABLED=false no .env.
 * Ver PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md.
 */
export function isCarolAutomationDisabled(): boolean {
  return process.env.CAROL_AUTOMATION_DISABLED !== 'false'
}

/**
 * Disparos PROATIVOS (iniciar conversa) no WhatsApp.
 *
 * Quando true:
 * - Pode enviar mensagem automática após cadastro (ex.: workshop / formulários)
 * - Pode agendar/enviar boas-vindas via worker
 *
 * Padrão: DESLIGADO. (Somente envia se a env vier exatamente 'true')
 *
 * Obs: Isso NÃO desliga a Carol responder quando a pessoa chama (webhook).
 */
export function isWhatsAppAutoInviteEnabled(): boolean {
  return process.env.WHATSAPP_AUTO_INVITE === 'true'
}

/**
 * Boas-vindas automáticas para leads que não chamaram no WhatsApp (worker/process-all).
 * Padrão: DESLIGADO.
 */
export function isWhatsAppAutoWelcomeEnabled(): boolean {
  return process.env.WHATSAPP_AUTO_WELCOME === 'true'
}
