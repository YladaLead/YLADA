'use client'

import { useState } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import { ContentContainer, Heading, Paragraph, Section, Divider, InfoBox } from '@/components/formacao/ContentComponents'

export default function PDF9ManualTecnicoPage() {
  const [secoesAbertas, setSecoesAbertas] = useState<Set<string>>(new Set(['introducao']))

  const toggleSecao = (id: string) => {
    const novasSecoes = new Set(secoesAbertas)
    if (novasSecoes.has(id)) {
      novasSecoes.delete(id)
    } else {
      novasSecoes.add(id)
    }
    setSecoesAbertas(novasSecoes)
  }

  const secoes = [
    { id: 'introducao', titulo: 'Introdução ao Manual Técnico', icon: '📖' },
    { id: 'ferramentas-basicas', titulo: 'Ferramentas Básicas', icon: '🛠️' },
    { id: 'fluxos-avancados', titulo: 'Fluxos Avançados', icon: '🔄' },
    { id: 'quizzes-personalizados', titulo: 'Quizzes Personalizados', icon: '❓' },
    { id: 'gsal-integracao', titulo: 'Integração com GSAL', icon: '📊' },
    { id: 'devolutivas', titulo: 'Modelos de Devolutivas', icon: '📝' },
    { id: 'boas-praticas', titulo: 'Boas Práticas', icon: '✅' },
    { id: 'faq-tecnico', titulo: 'FAQ Técnico', icon: '💡' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/pt/nutri/metodo" className="hover:text-blue-600 transition-all duration-200 ease-out">Método YLADA</Link>
          <span className="text-gray-400">→</span>
          <Link href="/pt/nutri/metodo/biblioteca" className="hover:text-blue-600 transition-all duration-200 ease-out">Biblioteca</Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Manual Técnico das Ferramentas YLADA</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading level={1} className="mb-2">Manual Técnico das Ferramentas YLADA</Heading>
              <Paragraph className="text-lg text-gray-600 mb-0">
                Guia completo e avançado para uso técnico de todas as ferramentas do sistema.
              </Paragraph>
            </div>
            <Link
              href="/pt/nutri/metodo/biblioteca"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-sm"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Navegação Lateral + Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar de Navegação */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Navegação</h3>
              <nav className="space-y-2">
                {secoes.map((secao) => (
                  <button
                    key={secao.id}
                    onClick={() => toggleSecao(secao.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out ${
                      secoesAbertas.has(secao.id)
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{secao.icon}</span>
                    {secao.titulo}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <ContentContainer>
                {/* Seções Colapsáveis */}
                {secoes.map((secao) => (
                  <Section key={secao.id} className={secoesAbertas.has(secao.id) ? '' : 'hidden'}>
                    <div className="flex items-center justify-between mb-4">
                      <Heading level={2}>{secao.titulo}</Heading>
                      <button
                        onClick={() => toggleSecao(secao.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {secoesAbertas.has(secao.id) ? '−' : '+'}
                      </button>
                    </div>
                    
                    {secoesAbertas.has(secao.id) && (
                      <div>
                        <Paragraph className="text-center italic text-gray-500 py-8">
                          Conteúdo da seção será inserido em breve.
                        </Paragraph>
                        
                        {/* Área reservada para prints */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                          <p className="text-sm text-gray-500 mb-2">📸 Área para prints e exemplos visuais</p>
                          <p className="text-xs text-gray-400">Exemplos de uso serão inseridos aqui</p>
                        </div>
                      </div>
                    )}
                  </Section>
                ))}

                {/* Tabela de Boas Práticas (exemplo) */}
                <Section>
                  <Heading level={2}>Tabela de Boas Práticas</Heading>
                  <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ferramenta</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boas Práticas</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evitar</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Quizzes</td>
                          <td className="px-4 py-3 text-sm text-gray-600">Perguntas objetivas, resultados claros</td>
                          <td className="px-4 py-3 text-sm text-gray-600">Perguntas muito longas, resultados confusos</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm text-gray-900">Fluxos</td>
                          <td className="px-4 py-3 text-sm text-gray-600">Sequência lógica, CTAs claros</td>
                          <td className="px-4 py-3 text-sm text-gray-600">Muitos passos, falta de clareza</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Section>
              </ContentContainer>

              {/* Botão de Download */}
              <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                <button
                  disabled
                  className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium transition-all duration-200 ease-out"
                >
                  Baixar PDF (em breve)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Botão Aplicar no GSAL */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
          <p className="text-sm text-gray-700 mb-3">
            <strong>💡 Aplicar este conteúdo no GSAL:</strong>
          </p>
          <Link
            href="/pt/nutri/gsal"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium"
          >
            Aplicar no GSAL →
          </Link>
        </div>

        {/* Navegação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/pt/nutri/metodo/biblioteca"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            ← Voltar para Biblioteca
          </Link>
          <Link
            href="/pt/nutri/ferramentas/manual-tecnico"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            Ver Ferramentas + Uso Técnico →
          </Link>
        </div>
      </div>
    </div>
  )
}

