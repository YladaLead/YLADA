'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

interface FluxoCard {
  id: string
  titulo: string
  descricao: string
  icone: string
  cor: string
  link: string
  categoria: string
}

const fluxos: FluxoCard[] = [
  // Ação Diária
  {
    id: '2-5-10',
    titulo: 'Fluxo 2-5-10',
    descricao: 'O método diário de crescimento: 2 convites, 5 follow-ups, 10 contatos. A base da duplicação.',
    icone: '⚡',
    cor: 'green',
    link: '/pt/wellness/fluxos/acao-diaria',
    categoria: 'Ação Diária'
  },
  {
    id: 'convite-leve',
    titulo: 'Fluxo de Convite Leve',
    descricao: 'Mensagens curtas, elegantes e que não geram resistência. Ideal para destravar quem tem medo de convidar.',
    icone: '💬',
    cor: 'blue',
    link: '/pt/wellness/fluxos/convite-leve',
    categoria: 'Ação Diária'
  },
  // Recrutamento
  {
    id: 'recrutamento',
    titulo: 'Fluxo de Recrutamento Completo',
    descricao: 'Processo completo em 9 etapas para identificar, convidar, apresentar e fechar novos distribuidores.',
    icone: '🎯',
    cor: 'purple',
    link: '/pt/wellness/fluxos/recrutamento',
    categoria: 'Recrutamento'
  },
  {
    id: 'apresentacao-gravada',
    titulo: 'Fluxo de Apresentação Gravada',
    descricao: 'Como entregar o vídeo de apresentação, mensagens antes e depois, e perguntas que geram decisão.',
    icone: '🎥',
    cor: 'indigo',
    link: '/pt/wellness/fluxos/apresentacao-gravada',
    categoria: 'Recrutamento'
  },
  {
    id: 'onboarding-novo',
    titulo: 'Onboarding do Novo Distribuidor',
    descricao: 'Processo para levar o novo membro à ação em 24 horas, garantindo que ele comece com confiança.',
    icone: '🚀',
    cor: 'orange',
    link: '/pt/wellness/fluxos/onboarding-novo',
    categoria: 'Recrutamento'
  },
  // Objeções
  {
    id: 'objecoes',
    titulo: 'Pacote de Objeções',
    descricao: 'Respostas estruturadas para as principais objeções, com 3 níveis: curta, explicada e estratégica.',
    icone: '🛡️',
    cor: 'red',
    link: '/pt/wellness/fluxos/objecoes',
    categoria: 'Objeções'
  }
]

const categorias = ['Todos', 'Ação Diária', 'Recrutamento', 'Objeções']

export default function FluxosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos')

  useEffect(() => {
    const raw = searchParams.get('categoria') || ''
    const norm = raw.trim().toLowerCase()
    if (norm === 'recrutamento') setCategoriaFiltro('Recrutamento')
    else if (norm === 'ação diária' || norm === 'acao diaria') setCategoriaFiltro('Ação Diária')
    else if (norm === 'objeções' || norm === 'objecoes') setCategoriaFiltro('Objeções')
  }, [searchParams])

  const fluxosFiltrados = categoriaFiltro === 'Todos' 
    ? fluxos 
    : fluxos.filter(f => f.categoria === categoriaFiltro)

  const getCorClasses = (cor: string) => {
    const cores: Record<string, string> = {
      green: 'bg-green-50 border-green-200 hover:bg-green-100',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      indigo: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      red: 'bg-red-50 border-red-200 hover:bg-red-100'
    }
    return cores[cor] || 'bg-gray-50 border-gray-200 hover:bg-gray-100'
  }

  return (
    // Layout server-side já valida autenticação, perfil e assinatura
    <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">🔄 Fluxos & Ações</h1>
                <p className="text-lg text-gray-600">
                  Processos prontos que você segue para vender, convidar, acompanhar e duplicar
                </p>
              </div>

              {/* Filtros */}
              <div className="mb-6 flex flex-wrap gap-2">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaFiltro(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoriaFiltro === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid de Fluxos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fluxosFiltrados.map((fluxo) => (
                  <button
                    key={fluxo.id}
                    onClick={() => router.push(fluxo.link)}
                    className={`${getCorClasses(fluxo.cor)} rounded-xl p-6 border-2 shadow-sm transition-all text-left group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {fluxo.icone}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{fluxo.titulo}</h3>
                          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{fluxo.descricao}</p>
                        <span className="inline-block px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
                          {fluxo.categoria}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ajuda NOEL */}
              <div className="mt-12 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Precisa de ajuda para personalizar algum fluxo ou criar uma variação?
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
