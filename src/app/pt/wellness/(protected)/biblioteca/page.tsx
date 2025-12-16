'use client'

import { useRouter } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

interface SecaoBiblioteca {
  id: string
  titulo: string
  descricao: string
  icone: string
  cor: string
  link: string
}

const secoes: SecaoBiblioteca[] = [
  {
    id: 'materiais',
    titulo: 'Materiais de Apresentação',
    descricao: 'PDFs, apresentações e materiais oficiais para usar nas suas conversas',
    icone: '📄',
    cor: 'blue',
    link: '/pt/wellness/biblioteca/materiais'
  },
  {
    id: 'cartilhas',
    titulo: 'Cartilhas de Treinamento',
    descricao: 'Guias completos para novos distribuidores, vendas, apresentações e mais',
    icone: '📖',
    cor: 'purple',
    link: '/pt/wellness/biblioteca/cartilhas'
  },
  {
    id: 'produtos',
    titulo: 'Produtos & Bebidas',
    descricao: 'Guias dos produtos, modo de preparo e informações técnicas',
    icone: '🥤',
    cor: 'green',
    link: '/pt/wellness/biblioteca/produtos'
  },
  {
    id: 'scripts',
    titulo: 'Scripts Oficiais',
    descricao: 'Scripts prontos para usar em diferentes situações',
    icone: '💬',
    cor: 'orange',
    link: '/pt/wellness/biblioteca/scripts'
  },
  {
    id: 'videos',
    titulo: 'Vídeos de Treinamento',
    descricao: 'Vídeos sobre preparo, vendas, convites e apresentações',
    icone: '🎥',
    cor: 'red',
    link: '/pt/wellness/biblioteca/videos'
  },
  {
    id: 'divulgacao',
    titulo: 'Materiais para Divulgação',
    descricao: 'Imagens, posts, stories e materiais prontos para compartilhar nas redes sociais',
    icone: '📱',
    cor: 'pink',
    link: '/pt/wellness/biblioteca/divulgacao'
  }
]

const getCorClasses = (cor: string) => {
  const cores: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
    pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
  }
  return cores[cor] || 'bg-gray-50 border-gray-200 hover:bg-gray-100'
}

export default function BibliotecaPage() {
  const router = useRouter()

  // Layout server-side já valida autenticação, perfil e assinatura
  return (
    <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">📚 Biblioteca Oficial</h1>
                <p className="text-lg text-gray-600">
                  Materiais fixos, scripts, cartilhas e apresentações organizados e prontos para uso
                </p>
              </div>

              {/* Grid de Seções */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {secoes.map((secao) => (
                  <button
                    key={secao.id}
                    onClick={() => router.push(secao.link)}
                    className={`${getCorClasses(secao.cor)} rounded-xl p-6 border-2 shadow-sm transition-all text-left group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {secao.icone}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{secao.titulo}</h3>
                          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                        </div>
                        <p className="text-sm text-gray-600">{secao.descricao}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ajuda NOEL */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Precisa de ajuda para encontrar um material específico ou personalizar um script?
                </p>
                <button
                  onClick={() => router.push('/pt/wellness/noel')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Falar com o NOEL →
                </button>
              </div>
            </div>
          </div>
    </ConditionalWellnessSidebar>
  )
}
