'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface WellnessNavBarProps {
  showTitle?: boolean
  title?: string
  userName?: string
  userBio?: string
}

export default function WellnessNavBar({ showTitle = false, title, userName, userBio }: WellnessNavBarProps) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/pt')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Link href="/pt/wellness/dashboard" className="flex-shrink-0">
              <Image
                src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                alt="YLADA"
                width={180}
                height={60}
                className="h-8 sm:h-10 w-auto"
                style={{ backgroundColor: 'transparent' }}
              />
            </Link>
            {showTitle && title && (
              <>
                <div className="h-6 sm:h-8 w-px bg-gray-300 hidden lg:block flex-shrink-0"></div>
                <h1 className="hidden lg:block text-lg lg:text-xl font-semibold text-gray-900 truncate">
                  {title}
                </h1>
              </>
            )}
          </div>

          {/* Navegação - Responsiva */}
          <nav className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6 flex-shrink-0">
            <Link
              href="/pt/wellness/dashboard"
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-green-600 font-medium transition-colors whitespace-nowrap hidden sm:inline-block"
            >
              Dashboard
            </Link>
            <Link
              href="/pt/wellness/configuracao"
              className="flex items-center space-x-2 text-xs sm:text-sm lg:text-base text-gray-700 hover:text-green-600 font-medium transition-colors whitespace-nowrap group"
            >
              {userName ? (
                <>
                  {/* Avatar com iniciais */}
                  <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-sm group-hover:shadow-md transition-shadow">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  {/* Nome - apenas no desktop */}
                  <span className="hidden lg:inline-block truncate max-w-[120px]">
                    {userName.split(' ')[0]}
                  </span>
                </>
              ) : (
                <span>Perfil</span>
              )}
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm lg:text-base text-gray-700 hover:text-red-600 font-medium transition-colors whitespace-nowrap"
            >
              Sair
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

