// =====================================================
// YLADA - HOOK PARA GERENCIAR CONFIGURAÇÕES WELLNESS
// =====================================================

import { ToolConfig } from '@/types/wellness'

export function useWellnessConfig(config?: ToolConfig) {
  const getTitle = (defaultTitle: string) => config?.title || defaultTitle
  const getDescription = (defaultDescription: string) => config?.description || defaultDescription
  const getEmoji = (defaultEmoji: string) => config?.emoji || defaultEmoji
  
  const getButtonStyle = () => {
    if (config?.custom_colors) {
      return {
        background: `linear-gradient(135deg, ${config.custom_colors.principal} 0%, ${config.custom_colors.secundaria} 100%)`
      }
    }
    return {
      background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)'
    }
  }

  return {
    config,
    getTitle,
    getDescription,
    getEmoji,
    getButtonStyle
  }
}





















