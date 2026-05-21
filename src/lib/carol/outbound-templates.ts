/** Labels exibidos no painel Carol para templates outbound */
export const OUTBOUND_TEMPLATE_LABELS: Record<string, string> = {
  carol_pesquisa_agenda: 'Pesquisa agenda (Outbound)',
  carol_pergunta_abertura: 'Pergunta abertura',
  carol_pergunta_abertura_flow: 'Pergunta abertura (Flow)',
  carol_checklist_negocios: 'Checklist de negócios',
  carol_insight_estetica: 'Insight estética',
  carol_diagnostico_gratuito: 'Diagnóstico gratuito',
  hello_world: 'Hello World (teste)',
}

export function outboundTemplateLabel(templateName: string): string {
  return OUTBOUND_TEMPLATE_LABELS[templateName] ?? templateName
}
