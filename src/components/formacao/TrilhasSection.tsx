'use client'

import Link from 'next/link'
import type { Trilha } from '@/types/formacao'

interface TrilhasSectionProps {
  trilhas: Trilha[]
}

// Estrutura de Partes do Livro
const partesDoLivro = [
  {
    id: 'parte1',
    titulo: 'Parte I — Fundamentos da Filosofia YLADA',
    subtitulo: 'O capítulo que a faculdade deveria ter começado.',
    cor: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'parte2',
    titulo: 'Parte II — O Método YLADA para Nutris 2.0',
    subtitulo: 'Capítulos práticos, estilo playbook.',
    cor: 'from-purple-600 to-pink-600'
  },
  {
    id: 'parte3',
    titulo: 'Parte III — Ferramentas Aplicáveis',
    subtitulo: 'Quizzes, scripts, checklists, planilhas.',
    cor: 'from-green-600 to-teal-600'
  },
  {
    id: 'parte4',
    titulo: 'Parte IV — Casos, Exemplos e Situações Reais',
    subtitulo: 'Aplicações práticas para resolver problemas do dia a dia.',
    cor: 'from-orange-600 to-red-600'
  }
]

export default function TrilhasSection({ trilhas }: TrilhasSectionProps) {
  const trilhaRecomendada = trilhas.find(t => t.is_recommended) || trilhas[0]
  const trilhasRestantes = trilhas.filter(t => t.id !== trilhaRecomendada?.id)

  if (trilhas.length === 0) {
    return (
      <div className="space-y-8">
        {/* Introdução: O Livro que Faltou na Faculdade */}
        <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              YLADA – O Livro que Faltou na Faculdade
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Um manual prático, organizado e aplicável que toda nutricionista deveria ter recebido, mas nunca recebeu.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-600">Nenhum pilar disponível no momento.</p>
          <p className="text-sm text-gray-500 mt-2">Os pilares do Método YLADA estarão disponíveis em breve!</p>
        </div>
      </div>
    )
  }

  // Agrupar trilhas por parte (por enquanto, todas na Parte II)
  // Futuramente, cada trilha terá um campo 'parte_id' no banco
  const trilhasPorParte = {
    parte1: [],
    parte2: trilhas.filter(t => t.is_recommended || !t.is_recommended), // Todas por enquanto
    parte3: [],
    parte4: []
  }

  return (
    <div className="space-y-12">
      {/* Introdução aos Pilares */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏛️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            A Filosofia do Método YLADA
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Os fundamentos que estruturam sua transformação em Nutri-Empresária.
          </p>
        </div>
        
        <div className="bg-white rounded-xl p-6 border-l-4 border-blue-400">
          <p className="text-gray-700 leading-relaxed mb-4">
            Cada Pilar é uma <strong>seção do método</strong> que contém fundamentos, blocos de conteúdo, exercícios práticos e ferramentas aplicáveis.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Você pode acessar os Pilares por conta própria ou seguir a <strong>Jornada de 30 Dias</strong>, que organiza tudo passo a passo.
          </p>
        </div>
      </div>

      {/* Estrutura de Partes do Livro */}
      {partesDoLivro.map((parte, index) => {
        const trilhasDaParte = index === 1 ? trilhas : [] // Por enquanto, só Parte II tem trilhas
        
        if (trilhasDaParte.length === 0 && index !== 1) return null // Não mostrar partes vazias ainda
        
        return (
          <div key={parte.id} className="space-y-6">
            {/* Cabeçalho da Parte */}
            <div className={`bg-gradient-to-r ${parte.cor} rounded-xl p-6 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold">Parte {index + 1}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{parte.titulo}</h2>
              <p className="text-white/90 text-lg">{parte.subtitulo}</p>
            </div>

            {/* Capítulos da Parte */}
            {index === 1 && (
              <>
                {/* Capítulo Recomendado */}
                {trilhaRecomendada && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">✨ Pilar Essencial</h3>
                    <Link
                      href={`/pt/nutri/formacao/trilha/${trilhaRecomendada.id}`}
                      className="block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {trilhaRecomendada.thumbnail_url && (
                          <img
                            src={trilhaRecomendada.thumbnail_url}
                            alt={trilhaRecomendada.title}
                            className="w-full sm:w-32 h-32 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 text-white">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                              Pilar 1
                            </span>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                              {trilhaRecomendada.badge || 'Essencial'}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">{trilhaRecomendada.title}</h3>
                          <p className="text-blue-100 mb-2 line-clamp-2">{trilhaRecomendada.short_description || trilhaRecomendada.description}</p>
                          <p className="text-blue-200 text-sm mb-4 italic">Este é o capítulo fundamental para iniciar sua jornada na Filosofia YLADA.</p>
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span>{trilhaRecomendada.estimated_hours}h</span>
                            <span>•</span>
                            <span>{trilhaRecomendada.modulos_count || 0} seções</span>
                            {trilhaRecomendada.progress_percentage > 0 && (
                              <>
                                <span>•</span>
                                <span>{Math.round(trilhaRecomendada.progress_percentage)}% concluído</span>
                              </>
                            )}
                          </div>
                          {trilhaRecomendada.progress_percentage > 0 && (
                            <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                              <div
                                className="bg-white h-2 rounded-full transition-all"
                                style={{ width: `${trilhaRecomendada.progress_percentage}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Continuar Assistindo */}
                {trilhas.some(t => t.progress_percentage > 0 && t.progress_percentage < 100) && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">▶️ Continuar Lendo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trilhas
                        .filter(t => t.progress_percentage > 0 && t.progress_percentage < 100)
                        .slice(0, 2)
                        .map((trilha, idx) => (
                          <Link
                            key={trilha.id}
                            href={`/pt/nutri/formacao/trilha/${trilha.id}`}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    Pilar {idx + 2}
                                  </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{trilha.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{trilha.short_description || trilha.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                              <span>{trilha.estimated_hours}h • {trilha.level}</span>
                              <span>{Math.round(trilha.progress_percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${trilha.progress_percentage}%` }}
                              ></div>
                            </div>
                          </Link>
                        ))}
                    </div>
                  </div>
                )}

                {/* Todos os Capítulos */}
                {trilhasRestantes.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">📚 Todos os Pilares</h3>
                      <span className="text-sm text-gray-600">{trilhas.length} pilar{trilhas.length !== 1 ? 'es' : ''} disponível{trilhas.length !== 1 ? 'eis' : ''}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trilhasRestantes.map((trilha, idx) => {
                        const totalAulasEstimado = (trilha.modulos_count || 0) * 2
                        const aulasConcluidas = Math.round((trilha.progress_percentage / 100) * totalAulasEstimado)
                        
                        return (
                          <Link
                            key={trilha.id}
                            href={`/pt/nutri/formacao/trilha/${trilha.id}`}
                            className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    Pilar {idx + 2}
                                  </span>
                                  {trilha.badge && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      trilha.badge === 'Novo' ? 'bg-green-100 text-green-800' :
                                      trilha.badge === 'Essencial' ? 'bg-blue-100 text-blue-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {trilha.badge}
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{trilha.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{trilha.short_description || trilha.description}</p>
                              </div>
                              {trilha.thumbnail_url && (
                                <img
                                  src={trilha.thumbnail_url}
                                  alt={trilha.title}
                                  className="w-16 h-16 object-cover rounded-lg ml-4"
                                />
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{trilha.estimated_hours}h • {trilha.level}</span>
                                <span>{trilha.modulos_count || 0} seções</span>
                              </div>
                              
                              {trilha.progress_percentage > 0 && (
                                <div>
                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                    <span>{aulasConcluidas} de {totalAulasEstimado} páginas lidas</span>
                                    <span>{Math.round(trilha.progress_percentage)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full transition-all"
                                      style={{ width: `${trilha.progress_percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                              
                              {trilha.progress_percentage === 0 && totalAulasEstimado > 0 && (
                                <div className="text-xs text-gray-500">
                                  0 de {totalAulasEstimado} páginas lidas
                                </div>
                              )}
                              
                              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                {trilha.progress_percentage > 0 ? 'Continuar Pilar' : 'Acessar Pilar'}
                              </button>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

