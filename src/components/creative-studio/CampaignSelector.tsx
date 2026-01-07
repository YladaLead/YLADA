'use client'

import { useState } from 'react'
import { Check, ChevronDown, Target, MessageCircle, Presentation, ShoppingCart, Eye } from 'lucide-react'

export type CampaignType = 
  | 'agenda-vazia'
  | 'muito-esforco'
  | 'confusao'
  | 'cansaco-mental'
  | 'solidao-profissional'
  | 'curiosidade'
  | 'remarketing'
  | 'outro'

export type CTAType = 
  | 'pagina-descoberta'
  | 'whatsapp'
  | 'pagina-ylada'
  | 'aula-apresentacao'
  | 'pagina-venda'
  | 'outro'

interface CampaignConfig {
  type: CampaignType
  name: string
  description: string
  painPoints: string[]
  idealCTA: CTAType[]
}

interface CTAConfig {
  type: CTAType
  name: string
  description: string
  ctaPhrases: string[]
}

const CAMPAIGN_TYPES: CampaignConfig[] = [
  {
    type: 'agenda-vazia',
    name: 'Agenda Vazia',
    description: 'Tráfego frio - pessoa ainda não confia',
    painPoints: ['agenda vazia', 'poucos clientes', 'dependência de indicações'],
    idealCTA: ['pagina-descoberta']
  },
  {
    type: 'muito-esforco',
    name: 'Muito Esforço, Pouco Retorno',
    description: 'Tráfego frio - trabalha muito mas não cresce',
    painPoints: ['sobrecarga', 'múltiplas tarefas', 'trabalho sem resultado'],
    idealCTA: ['pagina-descoberta']
  },
  {
    type: 'confusao',
    name: 'Confusão / Falta de Direção',
    description: 'Tráfego frio - não sabe o que fazer',
    painPoints: ['falta de direção', 'incerteza', 'não sabe por onde começar'],
    idealCTA: ['aula-apresentacao', 'pagina-descoberta']
  },
  {
    type: 'cansaco-mental',
    name: 'Cansaço Mental',
    description: 'Meio do funil - dor emocional profunda',
    painPoints: ['burnout', 'estresse', 'sobrecarga mental'],
    idealCTA: ['whatsapp', 'aula-apresentacao']
  },
  {
    type: 'solidao-profissional',
    name: 'Solidão Profissional',
    description: 'Meio do funil - quer ser ouvida',
    painPoints: ['solidão', 'trabalho sozinha', 'falta de apoio'],
    idealCTA: ['whatsapp', 'aula-apresentacao']
  },
  {
    type: 'curiosidade',
    name: 'Curiosidade / Conceito',
    description: 'Todos os públicos - quer entender o YLADA',
    painPoints: ['quer entender', 'curiosidade', 'conceito novo'],
    idealCTA: ['pagina-ylada', 'aula-apresentacao']
  },
  {
    type: 'remarketing',
    name: 'Remarketing',
    description: 'Já conhece, precisa de impulso',
    painPoints: ['já visitou', 'precisa de impulso', 'dúvida final'],
    idealCTA: ['aula-apresentacao', 'pagina-venda', 'whatsapp']
  },
  {
    type: 'outro',
    name: 'Outro',
    description: 'Campanha personalizada',
    painPoints: [],
    idealCTA: []
  }
]

const CTA_TYPES: CTAConfig[] = [
  {
    type: 'pagina-descoberta',
    name: 'Página de Descoberta',
    description: 'Página leve, explicativa, sem pressão - URL: /pt/nutri/descobrir',
    ctaPhrases: [
      'Descubra se isso faz sentido pra você',
      'Veja como funciona',
      'Entre e explore',
      'Descubra se encaixa no seu momento'
    ]
  },
  {
    type: 'whatsapp',
    name: 'WhatsApp',
    description: 'Atendimento humanizado - para dores emocionais',
    ctaPhrases: [
      'Fale com alguém que entende sua rotina',
      'Converse com a gente',
      'Explique sua situação',
      'Fale com quem já passou por isso'
    ]
  },
  {
    type: 'pagina-ylada',
    name: 'Página YLADA',
    description: 'Descoberta + convite - para curiosidade',
    ctaPhrases: [
      'Descubra o YLADA',
      'Veja por dentro',
      'Entenda o conceito',
      'Conheça o YLADA'
    ]
  },
  {
    type: 'aula-apresentacao',
    name: 'Aula / Apresentação',
    description: 'Apresentação estratégica gratuita - clareza sem venda',
    ctaPhrases: [
      'Participe da apresentação gratuita',
      'Assista à apresentação estratégica',
      'Participe do encontro de clareza',
      'Veja a apresentação gratuita'
    ]
  },
  {
    type: 'pagina-venda',
    name: 'Página de Venda',
    description: 'Venda direta - para remarketing',
    ctaPhrases: [
      'Comece agora',
      'Transforme sua carreira',
      'Acesse e comece hoje',
      'Comece sua transformação'
    ]
  },
  {
    type: 'outro',
    name: 'Outro',
    description: 'CTA personalizado',
    ctaPhrases: []
  }
]

interface CampaignSelectorProps {
  selectedCampaign: CampaignType | null
  selectedCTA: CTAType | null
  onCampaignChange: (campaign: CampaignType) => void
  onCTAChange: (cta: CTAType) => void
  compact?: boolean
}

export function CampaignSelector({
  selectedCampaign,
  selectedCTA,
  onCampaignChange,
  onCTAChange,
  compact = false
}: CampaignSelectorProps) {
  const [campaignOpen, setCampaignOpen] = useState(false)
  const [ctaOpen, setCtaOpen] = useState(false)

  const selectedCampaignData = CAMPAIGN_TYPES.find(c => c.type === selectedCampaign)
  const selectedCTAData = CTA_TYPES.find(c => c.type === selectedCTA)

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        {/* Campanha - Compacto */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setCampaignOpen(!campaignOpen)
              setCtaOpen(false)
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-500 transition-colors text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="font-medium text-gray-900 truncate">
                {selectedCampaignData?.name || 'Campanha'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${campaignOpen ? 'rotate-180' : ''}`} />
          </button>

          {campaignOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {CAMPAIGN_TYPES.map((campaign) => (
                <button
                  key={campaign.type}
                  type="button"
                  onClick={() => {
                    onCampaignChange(campaign.type)
                    setCampaignOpen(false)
                    if (campaign.idealCTA.length === 1) {
                      onCTAChange(campaign.idealCTA[0])
                    }
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                >
                  <div className="font-medium text-gray-900">{campaign.name}</div>
                  <div className="text-xs text-gray-500">{campaign.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CTA - Compacto */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setCtaOpen(!ctaOpen)
              setCampaignOpen(false)
            }}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-500 transition-colors text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              {selectedCTA === 'pagina-descoberta' && <Eye className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              {selectedCTA === 'whatsapp' && <MessageCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
              {selectedCTA === 'pagina-ylada' && <Target className="w-4 h-4 text-purple-500 flex-shrink-0" />}
              {selectedCTA === 'aula-apresentacao' && <Presentation className="w-4 h-4 text-orange-500 flex-shrink-0" />}
              {selectedCTA === 'pagina-venda' && <ShoppingCart className="w-4 h-4 text-red-500 flex-shrink-0" />}
              {!selectedCTA && <Target className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              <span className="font-medium text-gray-900 truncate">
                {selectedCTAData?.name || 'Destino'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${ctaOpen ? 'rotate-180' : ''}`} />
          </button>

          {ctaOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto right-0">
              {CTA_TYPES.map((cta) => {
                const isRecommended = selectedCampaignData?.idealCTA.includes(cta.type)
                return (
                  <button
                    key={cta.type}
                    type="button"
                    onClick={() => {
                      onCTAChange(cta.type)
                      setCtaOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm ${
                      isRecommended ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900">{cta.name}</div>
                      {isRecommended && (
                        <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                          ✓
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Seleção de Campanha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🎯 Tipo de Campanha
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCampaignOpen(!campaignOpen)
              setCtaOpen(false)
            }}
            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-gray-400" />
              <div>
                <div className="font-medium text-gray-900">
                  {selectedCampaignData?.name || 'Selecione o tipo de campanha'}
                </div>
                {selectedCampaignData && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {selectedCampaignData.description}
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${campaignOpen ? 'rotate-180' : ''}`} />
          </button>

          {campaignOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {CAMPAIGN_TYPES.map((campaign) => (
                <button
                  key={campaign.type}
                  type="button"
                  onClick={() => {
                    onCampaignChange(campaign.type)
                    setCampaignOpen(false)
                    // Auto-selecionar CTA ideal se houver apenas uma opção
                    if (campaign.idealCTA.length === 1) {
                      onCTAChange(campaign.idealCTA[0])
                    }
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{campaign.description}</div>
                      {campaign.painPoints.length > 0 && (
                        <div className="text-xs text-gray-400 mt-1">
                          Dores: {campaign.painPoints.join(', ')}
                        </div>
                      )}
                    </div>
                    {selectedCampaign === campaign.type && (
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seleção de CTA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🎯 Destino / CTA
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCtaOpen(!ctaOpen)
              setCampaignOpen(false)
            }}
            className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center gap-3">
              {selectedCTA === 'pagina-descoberta' && <Eye className="w-5 h-5 text-blue-500" />}
              {selectedCTA === 'whatsapp' && <MessageCircle className="w-5 h-5 text-green-500" />}
              {selectedCTA === 'pagina-ylada' && <Target className="w-5 h-5 text-purple-500" />}
              {selectedCTA === 'aula-apresentacao' && <Presentation className="w-5 h-5 text-orange-500" />}
              {selectedCTA === 'pagina-venda' && <ShoppingCart className="w-5 h-5 text-red-500" />}
              {!selectedCTA && <Target className="w-5 h-5 text-gray-400" />}
              <div>
                <div className="font-medium text-gray-900">
                  {selectedCTAData?.name || 'Selecione o destino/CTA'}
                </div>
                {selectedCTAData && (
                  <div className="text-xs text-gray-500 mt-0.5">
                    {selectedCTAData.description}
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${ctaOpen ? 'rotate-180' : ''}`} />
          </button>

          {ctaOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              {CTA_TYPES.map((cta) => {
                const isRecommended = selectedCampaignData?.idealCTA.includes(cta.type)
                return (
                  <button
                    key={cta.type}
                    type="button"
                    onClick={() => {
                      onCTAChange(cta.type)
                      setCtaOpen(false)
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      isRecommended ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">{cta.name}</div>
                          {isRecommended && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Recomendado
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{cta.description}</div>
                        {cta.ctaPhrases.length > 0 && (
                          <div className="text-xs text-gray-400 mt-2">
                            <div className="font-medium mb-1">Frases sugeridas:</div>
                            <ul className="list-disc list-inside space-y-0.5">
                              {cta.ctaPhrases.slice(0, 2).map((phrase, idx) => (
                                <li key={idx}>{phrase}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      {selectedCTA === cta.type && (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Info sobre a seleção */}
      {selectedCampaignData && selectedCTAData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="text-xs text-blue-900">
            <div className="font-medium mb-1">💡 Estratégia:</div>
            <div>
              Campanha de <strong>{selectedCampaignData.name.toLowerCase()}</strong> funciona melhor com{' '}
              <strong>{selectedCTAData.name.toLowerCase()}</strong> porque{' '}
              {selectedCTAData.description.toLowerCase()}.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

