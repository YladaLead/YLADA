'use client'

import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function ManualTecnicoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pt/nutri/metodo"
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            ← Voltar para o Método YLADA
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manual Técnico YLADA
          </h1>
          <p className="text-lg text-gray-700">
            Como aplicar o Método YLADA dentro do sistema. Guias práticos para usar cada ferramenta e funcionalidade.
          </p>
        </div>

        {/* Lista de Guias */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { titulo: 'Como usar Captação YLADA', descricao: 'Aprenda a usar as ferramentas de captação do sistema' },
            { titulo: 'Como usar Gestão GSAL', descricao: 'Domine a gestão simplificada da sua nutri' },
            { titulo: 'Como usar Formulários', descricao: 'Crie e gerencie formulários de avaliação' },
            { titulo: 'Como criar Links de ferramentas', descricao: 'Crie e personalize seus links ILADA' },
            { titulo: 'Como divulgar sua ferramenta', descricao: 'Estratégias para divulgar e gerar leads' },
            { titulo: 'Guia da Rotina YLADA', descricao: 'Como organizar sua rotina usando o sistema' }
          ].map((guia, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2">{guia.titulo}</h3>
              <p className="text-sm text-gray-600 mb-4">{guia.descricao}</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Ler Manual →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

