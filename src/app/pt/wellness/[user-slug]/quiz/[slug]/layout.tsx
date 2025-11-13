import { Metadata } from 'next'
import { getOGImageUrl, getFullOGImageUrl } from '@/lib/og-image-map'
import { getOGMessages } from '@/lib/og-messages-map'
import { quizDB } from '@/lib/quiz-db'

interface Props {
  params: Promise<{
    'user-slug': string
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams

  try {
    // Buscar dados do quiz
    const quiz = await quizDB.getQuizBySlug(slug)

    if (!quiz) {
      // Construir URL base para fallback
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
      const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/quiz/${slug}`
      
      // Fallback para metadata padrão
      return {
        title: 'Quiz Personalizado - WELLNESS',
        description: 'Quiz personalizado de bem-estar',
        openGraph: {
          title: 'Quiz Personalizado - WELLNESS',
          description: 'Quiz personalizado de bem-estar',
          url: pageUrl,
          siteName: 'WELLNESS - Your Leading Data System',
          type: 'website',
          locale: 'pt_BR',
          images: [{
            url: getFullOGImageUrl('quiz-personalizado', baseUrl),
            width: 1200,
            height: 630,
            type: 'image/jpeg',
          }],
        },
      }
    }

    // Construir URL base primeiro (usar www.ylada.com como padrão para produção)
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
    
    // Obter imagem OG para quiz personalizado com baseUrl correto
    const ogImageUrl = getFullOGImageUrl('quiz-personalizado', baseUrl)
    
    // Obter mensagens estimulantes para quiz
    const ogMessages = getOGMessages('quiz-personalizado')
    
    // Usar mensagens estimulantes ou título/descrição do quiz
    const ogTitle = ogMessages.title || quiz.titulo
    const ogDescription = ogMessages.description || quiz.descricao || 'Quiz personalizado de bem-estar'

    // Construir URL completa da página
    const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/quiz/${slug}`

    return {
      title: `${ogTitle} - WELLNESS`,
      description: ogDescription,
      openGraph: {
        title: `${ogTitle} - WELLNESS`,
        description: ogDescription,
        url: pageUrl,
        siteName: 'WELLNESS - Your Leading Data System',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: ogTitle,
            type: 'image/jpeg',
          },
        ],
        locale: 'pt_BR',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${ogTitle} - WELLNESS`,
        description: ogDescription,
        images: [ogImageUrl],
      },
    }
  } catch (error) {
    console.error('[OG Metadata] Error generating quiz metadata:', error)
    // Construir URL base para fallback
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'
    const pageUrl = `${baseUrl}/pt/wellness/${resolvedParams['user-slug']}/quiz/${slug}`
    
    // Fallback para metadata padrão
    return {
      title: 'Quiz Personalizado - WELLNESS',
      description: 'Quiz personalizado de bem-estar',
      openGraph: {
        title: 'Quiz Personalizado - WELLNESS',
        description: 'Quiz personalizado de bem-estar',
        url: pageUrl,
        siteName: 'WELLNESS - Your Leading Data System',
        type: 'website',
        locale: 'pt_BR',
        images: [{
          url: getFullOGImageUrl('quiz-personalizado', baseUrl),
          width: 1200,
          height: 630,
          type: 'image/jpeg',
        }],
      },
    }
  }
}

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

