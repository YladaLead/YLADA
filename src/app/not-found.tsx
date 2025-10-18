import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
        <YLADALogo size="lg" className="mx-auto mb-6" />
        
        <div className="text-6xl mb-4">🔍</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h1>
        
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Voltar ao início
          </Link>
          
          <Link 
            href="/create"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Criar novo link
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-6">
          © 2024 YLADA. Transformando ideias em links inteligentes.
        </p>
      </div>
    </div>
  )
}
