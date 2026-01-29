/**
 * Templates editáveis do fluxo WhatsApp (admin/whatsapp/fluxo).
 * Lê flow_templates do whatsapp_workshop_settings e aplica variáveis {{nome}}, {{link}}, etc.
 */

import { supabaseAdmin } from '@/lib/supabase'

let cache: { area: string; data: Record<string, string> | null; at: number } = { area: '', data: null, at: 0 }
const CACHE_MS = 60_000

export async function getFlowTemplates(area: string = 'nutri'): Promise<Record<string, string>> {
  if (cache.area === area && cache.data && Date.now() - cache.at < CACHE_MS) {
    return cache.data
  }
  const { data: settings } = await supabaseAdmin
    .from('whatsapp_workshop_settings')
    .select('flow_templates')
    .eq('area', area)
    .maybeSingle()
  const flow_templates = (settings?.flow_templates && typeof settings.flow_templates === 'object')
    ? (settings.flow_templates as Record<string, string>)
    : {}
  cache = { area, data: flow_templates, at: Date.now() }
  return flow_templates
}

export function applyTemplate(
  template: string,
  vars: { nome?: string; link?: string; [k: string]: string | undefined }
): string {
  let out = template
  for (const [k, v] of Object.entries(vars)) {
    if (v != null) out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'gi'), v)
  }
  return out
}

export async function getFlowTemplate(
  area: string,
  key: string
): Promise<string | null> {
  const templates = await getFlowTemplates(area)
  const value = templates[key]
  return typeof value === 'string' && value.trim() ? value.trim() : null
}
