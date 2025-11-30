// =====================================================
// YLADA - TIPOS COMPARTILHADOS PARA WELLNESS
// =====================================================

export interface ToolConfig {
  title?: string
  description?: string
  emoji?: string
  custom_colors?: {
    principal: string
    secundaria: string
  }
  cta_type?: 'whatsapp' | 'url_externa'
  whatsapp_number?: string
  external_url?: string
  cta_button_text?: string
  custom_whatsapp_message?: string
  country_code?: string // Código do país (ex: 'US', 'BR', 'OTHER')
  show_whatsapp_button?: boolean // Mostrar botão WhatsApp pequeno ao lado do CTA principal
}

export interface TemplateBaseProps {
  config?: ToolConfig
}























