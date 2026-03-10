'use client'

import dynamic from 'next/dynamic'

const InstitutionalPageContent = dynamic(
  () => import('./InstitutionalPageContent'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <p className="text-gray-500">Carregando...</p>
      </div>
    ),
  }
)

export default function HomePage() {
  return <InstitutionalPageContent />
}
