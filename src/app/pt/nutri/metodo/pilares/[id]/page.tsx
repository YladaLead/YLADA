'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { pilaresConfig } from '@/types/pilares'
import PilarAnotacao from '@/components/formacao/PilarAnotacao'

const coresPilares = [
  { bg: 'from-blue-500 to-indigo-600', light: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
  { bg: 'from-purple-500 to-pink-600', light: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  { bg: 'from-green-500 to-teal-600', light: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
  { bg: 'from-orange-500 to-red-600', light: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
  { bg: 'from-indigo-500 to-purple-600', light: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' }
]

const iconesPilares = ['🌟', '⚡', '🎯', '💎', '📊']

export default function PilarPage() {
  const params = useParams()
  const pilarId = params.id as string
  const pilarIndex = parseInt(pilarId) - 1
  const pilar = pilaresConfig.find(p => p.id === pilarId)
  const cores = coresPilares[pilarIndex] || coresPilares[0]
  const icone = iconesPilares[pilarIndex] || '✨'

  if (!pilar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Pilar não encontrado</p>
          <Link href="/pt/nutri/metodo/pilares" className="text-blue-600 hover:text-blue-700">
            ← Voltar para Sobre o Método
          </Link>
        </div>
      </div>
    )
  }

  // Navegação entre pilares
  const pilarAnterior = pilarIndex > 0 ? pilaresConfig[pilarIndex - 1] : null
  const proximoPilar = pilarIndex < pilaresConfig.length - 1 ? pilaresConfig[pilarIndex + 1] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Hero */}
      <div className={`bg-gradient-to-r ${cores.bg} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link 
              href="/pt/nutri/metodo/pilares" 
              className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
              ← Voltar para Sobre o Método
            </Link>
          </div>

          {/* Título */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
              {icone}
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Pilar {pilar.numero} de 5</p>
              <h1 className="text-3xl sm:text-4xl font-bold">
                {pilar.nome}
              </h1>
            </div>
          </div>

          {/* Subtítulo */}
          <p className="text-xl text-white/90 max-w-2xl">
            {pilar.subtitulo}
          </p>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Introdução Emocional */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-8">
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed whitespace-pre-line">
            {pilar.descricao_introducao}
          </p>
        </div>

        {/* Seções do Pilar */}
        {pilar.secoes && pilar.secoes.map((secao, index) => (
          <div 
            key={secao.id} 
            className={`rounded-2xl p-6 sm:p-8 mb-6 ${
              index === 0 
                ? `${cores.light} border ${cores.border}` 
                : 'bg-white border border-gray-100 shadow-sm'
            }`}
          >
            <h2 className={`text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-3 ${
              index === 0 ? cores.text : 'text-gray-900'
            }`}>
              {index === 0 ? '💫' : '💜'} {secao.titulo}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base sm:text-lg">
              {secao.conteudo}
            </p>
          </div>
        ))}

        {/* Mensagem de Conexão com a LYA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white mb-8">
          <div className="flex items-start gap-4">
            <div className="text-3xl">✨</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">A LYA está com você</h3>
              <p className="text-blue-100 leading-relaxed">
                Você não precisa decorar nada disso. A LYA vai aplicar este pilar com você na Jornada, 
                no momento certo, da forma certa. Seu único trabalho é confiar e seguir.
              </p>
            </div>
          </div>
        </div>

        {/* Campo de Anotação */}
        {pilar.campo_anotacao && (
          <div className="mb-8">
            <PilarAnotacao
              pilarId={pilar.id}
              placeholder={pilar.campo_anotacao}
            />
          </div>
        )}

        {/* Navegação entre Pilares */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {pilarAnterior ? (
            <Link
              href={`/pt/nutri/metodo/pilares/${pilarAnterior.id}`}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className="text-2xl">←</div>
              <div>
                <p className="text-xs text-gray-500">Pilar anterior</p>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {pilarAnterior.nome}
                </p>
              </div>
            </Link>
          ) : (
            <div></div>
          )}
          
          {proximoPilar ? (
            <Link
              href={`/pt/nutri/metodo/pilares/${proximoPilar.id}`}
              className="flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all group text-right"
            >
              <div>
                <p className="text-xs text-gray-500">Próximo pilar</p>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {proximoPilar.nome}
                </p>
              </div>
              <div className="text-2xl">→</div>
            </Link>
          ) : (
            <Link
              href="/pt/nutri/metodo/jornada"
              className="flex items-center justify-end gap-3 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-md transition-all group text-right"
            >
              <div>
                <p className="text-xs text-blue-100">Pronta para começar?</p>
                <p className="text-sm font-medium">
                  Ir para a Jornada →
                </p>
              </div>
              <div className="text-2xl">🚀</div>
            </Link>
          )}
        </div>

        {/* Rodapé */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            💡 Lembre-se: os pilares são a filosofia. A LYA é quem aplica com você.
          </p>
          <Link
            href="/pt/nutri/metodo/pilares"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Ver todos os pilares
          </Link>
        </div>
      </div>
    </div>
  )
}
