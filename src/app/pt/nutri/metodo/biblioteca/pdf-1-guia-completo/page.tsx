'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import { ContentContainer, Heading, Paragraph, Section, Divider, InfoBox } from '@/components/formacao/ContentComponents'

export default function PDF1GuiaCompletoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link 
            href="/pt/nutri/metodo" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Método YLADA
          </Link>
          <span className="text-gray-400">→</span>
          <Link 
            href="/pt/nutri/metodo/biblioteca" 
            className="hover:text-blue-600 transition-all duration-200 ease-out"
          >
            Biblioteca
          </Link>
          <span className="text-gray-400">→</span>
          <span className="text-gray-700 font-medium">Guia Completo do Método YLADA</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Heading level={1} className="mb-2">
                Guia Completo do Método YLADA
              </Heading>
              <Paragraph className="text-lg text-gray-600 mb-0">
                O manual prático que toda nutricionista deveria ter recebido, mas nunca recebeu.
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

        {/* Content Container */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <ContentContainer>
            <Section>
              <Paragraph className="text-center italic text-gray-500 py-8">
                O conteúdo completo do Guia será inserido aqui assim que fornecido.
              </Paragraph>
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

        {/* Navegação */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/pt/nutri/metodo/biblioteca"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            ← Voltar para Biblioteca
          </Link>
          <Link
            href="/pt/nutri/metodo"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 ease-out hover:shadow-md hover:opacity-90 font-medium text-center"
          >
            Ver Método YLADA →
          </Link>
        </div>
      </div>
    </div>
  )
}

