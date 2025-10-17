import { Metadata } from 'next'
import PersonalizedLinkContent from './PersonalizedLinkContent'

interface PageProps {
  params: {
    usuario: string
    projeto: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { usuario, projeto } = await params
  
  // Importar dinamicamente para evitar problemas de SSR
  const { getToolMessage } = await import('@/lib/tool-messages')
  
  // Tentar determinar a ferramenta baseada no nome do projeto
  const toolName = projeto.toLowerCase().replace(/[^a-z0-9]/g, '')
  
  // Mapear nomes em português para tool_name em inglês
  const toolNameMapping: { [key: string]: string } = {
    'imc': 'bmi',
    'hidratacao': 'hydration',
    'proteina': 'protein',
    'nutricao': 'nutrition-assessment',
    'avaliacao-nutricional': 'nutrition-assessment',
    'plano-alimentar': 'meal-planner',
    'calorias': 'calorie-calculator',
    'gordura-corporal': 'body-fat',
    'macronutrientes': 'macros',
    'consumo-agua': 'water-intake'
  }
  
  const mappedToolName = toolNameMapping[toolName] || toolName
  const toolMessage = getToolMessage(mappedToolName)
  
  const pageTitle = toolMessage?.title || `${projeto} - HerbaLead`
  const pageDescription = toolMessage?.description || 'Acesse nossa ferramenta especializada para cuidar da sua saúde.'
  const pageImage = toolMessage?.image || 'https://www.herbalead.com/logos/herbalead/herbalead-og-image.jpg'
  
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.herbalead.com/${usuario}/${projeto}`,
      siteName: 'HerbaLead',
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: 'pt_BR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },
    other: {
      'theme-color': '#10b981',
    },
  }
}

export default async function PersonalizedLinkPage({ params }: PageProps) {
  const awaitedParams = await params
  return <PersonalizedLinkContent params={awaitedParams} />
}