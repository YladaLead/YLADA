'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, FileText, Image, Settings } from 'lucide-react'
import { EditorChat } from '@/components/creative-studio/EditorChat'
import { CampaignSelector, type CampaignType, type CTAType } from '@/components/creative-studio/CampaignSelector'

export default function CapCutKitPage() {
  const router = useRouter()
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignType | null>(null)
  const [selectedCTA, setSelectedCTA] = useState<CTAType | null>(null)

  // Construir objective baseado nas seleções
  const buildObjective = () => {
    if (!selectedCampaign) return 'kit-capcut-completo'
    
    const campaignNames: Record<CampaignType, string> = {
      'agenda-vazia': 'agenda vazia',
      'muito-esforco': 'muito esforço pouco retorno',
      'confusao': 'confusão falta de direção',
      'cansaco-mental': 'cansaço mental',
      'solidao-profissional': 'solidão profissional',
      'curiosidade': 'curiosidade conceito YLADA',
      'remarketing': 'remarketing',
      'outro': 'campanha personalizada'
    }

    const ctaNames: Record<CTAType, string> = {
      'pagina-descoberta': 'página de descoberta',
      'whatsapp': 'WhatsApp',
      'pagina-ylada': 'página YLADA',
      'aula-apresentacao': 'aula apresentação',
      'pagina-venda': 'página de venda',
      'outro': 'CTA personalizado'
    }

    let objective = `Kit para campanha de ${campaignNames[selectedCampaign]}`
    if (selectedCTA) {
      objective += ` com destino para ${ctaNames[selectedCTA]}`
    }

    return objective
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header Fixo */}
      <div className="flex-shrink-0 px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/pt/creative-studio')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                🎬 Gerador de Kit CapCut
              </h1>
              <p className="text-sm text-gray-500">
                Gere materiais completos para seu editor de vídeo
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seletores Compactos - Em Linha */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2">
        <CampaignSelector
          selectedCampaign={selectedCampaign}
          selectedCTA={selectedCTA}
          onCampaignChange={setSelectedCampaign}
          onCTAChange={setSelectedCTA}
          compact={true}
        />
      </div>

      {/* Conteúdo - Chat Full Screen */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <EditorChat 
          mode="create" 
          area="nutri" 
          purpose="quick-ad" 
          objective={buildObjective()}
          campaignType={selectedCampaign}
          ctaType={selectedCTA}
        />
      </div>
    </div>
  )
}


