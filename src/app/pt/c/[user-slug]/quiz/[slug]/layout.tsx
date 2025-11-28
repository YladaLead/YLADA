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

function resolveAppBaseUrl() {
  const directUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  if (directUrl) {
    return directUrl
  }

  // Desenvolvimento local
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  return 'https://ylada.app'
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const area: 'coach' = 'coach'
  const baseUrl = resolveAppBaseUrl()

  try {
    // Buscar dados do quiz
    const quiz = await quizDB.getQuizBySlug(slug)

    if (!quiz) {
      // Fallback para metadata padrão
      const pageUrl = `${baseUrl}/pt/c/${resolvedParams['user-slug']}/quiz/${slug}`
      const defaultImage = getFullOGImageUrl('quiz-personalizado', baseUrl, area)
      const defaultImageAbsolute = defaultImage.startsWith('http')
        ? defaultImage
        : `${baseUrl}${defaultImage.startsWith('/') ? defaultImage : `/${defaultImage}`}`
      
      return {
        title: 'Quiz Personalizado - COACH',
        description: 'Quiz personalizado de coaching',
        openGraph: {
          title: 'Quiz Personalizado - COACH',
          description: 'Quiz personalizado de coaching',
          url: pageUrl,
          siteName: 'COACH - Your Leading Data System',
          type: 'website',
          locale: 'pt_BR',
          images: [{
            url: defaultImageAbsolute,
            width: 1200,
            height: 630,
            type: 'image/jpeg',
          }],
        },
      }
    }

    // Obter imagem OG para quiz personalizado com baseUrl correto e área Coach
    const ogImageUrl = getFullOGImageUrl('quiz-personalizado', baseUrl, area)
    
    // Garantir que a URL seja absoluta
    const absoluteImageUrl = ogImageUrl.startsWith('http') 
      ? ogImageUrl 
      : `${baseUrl}${ogImageUrl.startsWith('/') ? ogImageUrl : `/${ogImageUrl}`}`
    
    // Obter mensagens estimulantes para quiz
    const ogMessages = getOGMessages('quiz-personalizado')
    
    // Usar mensagens estimulantes ou título/descrição do quiz
    let ogTitle = ogMessages.title || quiz.titulo || 'Quiz Personalizado'
    const ogDescription = ogMessages.description || quiz.descricao || 'Quiz personalizado de coaching'
    
    // Remover "COACH" duplicado se já estiver no título
    if (ogTitle.includes('COACH')) {
      ogTitle = ogTitle.replace(/\s*-\s*COACH\s*/gi, '').trim()
    }
    
    // Garantir que o título não esteja vazio
    if (!ogTitle || ogTitle.trim() === '') {
      ogTitle = 'Quiz Personalizado'
    }

    // Construir URL completa da página (usando /pt/c/ ao invés de /pt/coach/)
    const pageUrl = `${baseUrl}/pt/c/${resolvedParams['user-slug']}/quiz/${slug}`

    return {
      title: `${ogTitle} - COACH`,
      description: ogDescription,
      openGraph: {
        title: `${ogTitle} - COACH`,
        description: ogDescription,
        url: pageUrl,
        siteName: 'COACH - Your Leading Data System',
        images: [
          {
            url: absoluteImageUrl,
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
        title: `${ogTitle} - COACH`,
        description: ogDescription,
        images: [absoluteImageUrl],
      },
    }
  } catch (error) {
    console.error('[OG Metadata] Error generating quiz metadata:', error)
    // Construir URL base para fallback
    const fallbackBaseUrl = resolveAppBaseUrl()
    const pageUrl = `${fallbackBaseUrl}/pt/c/${resolvedParams['user-slug']}/quiz/${slug}`
    
    // Fallback para metadata padrão
    const defaultImage = getFullOGImageUrl('quiz-personalizado', fallbackBaseUrl, area)
    const defaultImageAbsolute = defaultImage.startsWith('http')
      ? defaultImage
      : `${fallbackBaseUrl}${defaultImage.startsWith('/') ? defaultImage : `/${defaultImage}`}`
    
    return {
      title: 'Quiz Personalizado - COACH',
      description: 'Quiz personalizado de coaching',
      openGraph: {
        title: 'Quiz Personalizado - COACH',
        description: 'Quiz personalizado de coaching',
        url: pageUrl,
        siteName: 'COACH - Your Leading Data System',
        type: 'website',
        locale: 'pt_BR',
        images: [{
          url: defaultImageAbsolute,
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

