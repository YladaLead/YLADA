'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  
  // Detectar área pela URL
  const getAreaFromPath = (path: string | null) => {
    if (!path) return null
    if (path.includes('/nutri/')) return 'nutri'
    if (path.includes('/coach/')) return 'coach'
    if (path.includes('/wellness/')) return 'wellness'
    if (path.includes('/nutra/')) return 'nutra'
    return null
  }
  
  const area = getAreaFromPath(pathname)
  
  // Configurações por área
  const areaConfig: Record<string, {
    logo: string
    alt: string
    width: number
    height: number
    homePath: string
    bgGradient: string
    buttonColor: string
    buttonHover: string
  }> = {
    nutri: {
      logo: '/images/logo/nutri-horizontal.png',
      alt: 'Nutri by YLADA',
      width: 280,
      height: 84,
      homePath: '/pt/nutri',
      bgGradient: 'from-blue-50 to-indigo-100',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      buttonHover: 'hover:bg-blue-200'
    },
    coach: {
      logo: '/images/logo/coach-horizontal.png',
      alt: 'Coach by YLADA',
      width: 280,
      height: 84,
      homePath: '/pt/coach',
      bgGradient: 'from-purple-50 to-purple-100',
      buttonColor: 'bg-purple-600 hover:bg-purple-700',
      buttonHover: 'hover:bg-purple-200'
    },
    wellness: {
      logo: '/images/logo/wellness-horizontal.png',
      alt: 'WELLNESS - Your Leading Data System',
      width: 572,
      height: 150,
      homePath: '/pt/wellness',
      bgGradient: 'from-green-50 to-emerald-100',
      buttonColor: 'bg-green-600 hover:bg-green-700',
      buttonHover: 'hover:bg-green-200'
    },
    nutra: {
      logo: '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png',
      alt: 'YLADA Nutra',
      width: 280,
      height: 84,
      homePath: '/pt/nutra',
      bgGradient: 'from-orange-50 to-orange-100',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      buttonHover: 'hover:bg-orange-200'
    }
  }
  
  const config = area ? areaConfig[area] : null
  const defaultGradient = 'from-blue-50 to-indigo-100'
  const defaultButtonColor = 'bg-blue-600 hover:bg-blue-700'
  const defaultButtonHover = 'hover:bg-gray-200'
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${config?.bgGradient || defaultGradient} flex items-center justify-center`}>
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
        {/* Logo da área ou logo genérico */}
        {config ? (
          <div className="mb-6 flex justify-center">
            <Image
              src={config.logo}
              alt={config.alt}
              width={config.width}
              height={config.height}
              className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
              alt="YLADA - Your Leading Advanced Data Assistant"
              width={280}
              height={84}
              className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
        )}
        
        <div className="text-6xl mb-4">🔍</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="space-y-3">
          <Link 
            href={config?.homePath || '/'}
            className={`block w-full ${config?.buttonColor || defaultButtonColor} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
          >
            {area ? `Voltar para ${area === 'nutri' ? 'Nutri' : area === 'coach' ? 'Coach' : area === 'wellness' ? 'Wellness' : 'Nutra'}` : 'Voltar ao início'}
          </Link>
          
          {!area && (
            <Link 
              href="/create"
              className={`block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold ${defaultButtonHover} transition-colors`}
            >
              Criar novo link
            </Link>
          )}
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          © 2024 YLADA. Transformando ideias em links inteligentes.
        </p>
      </div>
    </div>
  )
}
