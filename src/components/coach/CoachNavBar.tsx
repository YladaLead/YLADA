'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface CoachNavBarProps {
  showTitle?: boolean
  title?: string
}

export default function CoachNavBar({ showTitle = false, title }: CoachNavBarProps) {
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    // signOut já redireciona para /pt/coach/login automaticamente
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/pt/coach/home">
              <Image
                src="/images/logo/coach-horizontal.png"
                alt="Coach by YLADA"
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
              href="/pt/coach/home"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pt/coach/configuracao"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
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
