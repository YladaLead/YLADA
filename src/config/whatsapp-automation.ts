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
