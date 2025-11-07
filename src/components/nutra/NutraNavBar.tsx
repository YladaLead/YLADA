'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

interface NutraNavBarProps {
  showTitle?: boolean
  title?: string
}

export default function NutraNavBar({ showTitle = false, title }: NutraNavBarProps) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push('/pt')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/pt/nutra/dashboard">
              <Image
                src="/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png"
                alt="YLADA Nutra"
                width={180}
                height={60}
                className="h-10 w-auto"
                style={{ backgroundColor: 'transparent' }}
              />
            </Link>
            {showTitle && title && (
              <>
                <div className="h-8 w-px bg-gray-300"></div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              </>
            )}
          </div>

          {/* Navegação */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/pt/nutra/dashboard"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/pt/nutra/configuracao"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Perfil
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Sair
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

