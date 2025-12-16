'use client'

import Link from 'next/link'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'
import PageLayout from '@/components/shared/PageLayout'
import Section from '@/components/shared/Section'
import Card from '@/components/shared/Card'
import { useState } from 'react'

export default function ManualTecnicoPage() {
  return <ManualTecnicoContent />
}

const secoesBiblioteca = [
  {
    id: 'manual-tecnico',
    titulo: 'Manual Técnico',
    icon: '📖',
    descricao: 'Guia completo de uso do sistema YLADA',
    itens: [
      { titulo: 'Como usar Captação YLADA', descricao: 'Aprenda a usar as ferramentas de captação do sistema' },
      { titulo: 'Como usar Gestão GSAL', descricao: 'Domine a gestão simplificada da sua nutri' },
      { titulo: 'Como usar Formulários', descricao: 'Crie e gerencie formulários de avaliação' },
      { titulo: 'Como criar Links de ferramentas', descricao: 'Crie e personalize seus links YLADA' },
      { titulo: 'Como divulgar sua ferramenta', descricao: 'Estratégias para divulgar e gerar leads' },
      { titulo: 'Guia da Rotina YLADA', descricao: 'Como organizar sua rotina usando o sistema' }
    ]
  },
  {
    id: 'tutoriais-video',
    titulo: 'Tutoriais em Vídeo',
    icon: '🎥',
    descricao: 'Vídeos explicativos das funcionalidades',
    itens: [
      { titulo: 'Tutorial: Criar seu primeiro link', descricao: 'Passo a passo para criar e personalizar links' },
      { titulo: 'Tutorial: Gerenciar clientes no GSAL', descricao: 'Como usar o sistema de gestão de clientes' },
      { titulo: 'Tutorial: Criar quizzes personalizados', descricao: 'Crie quizzes que geram leads' }
    ]
  },
  {
    id: 'pdfs-formacao',
    titulo: 'PDFs da Formação',
    icon: '📄',
    descricao: 'Materiais complementares do método',
    itens: [
      { titulo: 'PDF: Guia Completo do Método YLADA', descricao: 'Manual completo em PDF' },
      { titulo: 'PDF: Scripts de Atendimento', descricao: 'Scripts prontos para usar' },
      { titulo: 'PDF: Checklist de Rotina Mínima', descricao: 'Checklist diário em PDF' }
    ]
  },
  {
    id: 'bonus',
    titulo: 'Bônus Exclusivos',
    icon: '🎁',
    descricao: 'Conteúdos extras e ferramentas',
    itens: [
      { titulo: 'Bônus: Templates de Stories', descricao: 'Templates prontos para Instagram' },
      { titulo: 'Bônus: Planilhas de Acompanhamento', descricao: 'Planilhas editáveis em Excel' }
    ]
  }
]

function ManualTecnicoContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [secaoAtiva, setSecaoAtiva] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 flex">
        <NutriSidebar
          isMobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <div className="flex-1 lg:ml-56">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Biblioteca</h1>
            <div className="w-10"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
            <Section
              title="🎒 Biblioteca / Materiais Extras"
              subtitle="Recursos de apoio para sua jornada de transformação"
            >
              {/* Seções da Biblioteca */}
              <div className="space-y-6">
                {secoesBiblioteca.map((secao) => (
                  <Card key={secao.id} className="mb-6">
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => setSecaoAtiva(secaoAtiva === secao.id ? null : secao.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{secao.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{secao.titulo}</h3>
                          <p className="text-sm text-gray-600">{secao.descricao}</p>
                        </div>
                      </div>
                      <svg
                        className={`w-6 h-6 text-gray-400 transition-transform ${
                          secaoAtiva === secao.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    {secaoAtiva === secao.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {secao.itens.map((item, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <h4 className="font-semibold text-gray-900 mb-2">{item.titulo}</h4>
                              <p className="text-sm text-gray-600 mb-3">{item.descricao}</p>
                              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                                Acessar →
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </Section>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
