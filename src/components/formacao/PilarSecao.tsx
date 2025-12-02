'use client'

import Link from 'next/link'
import type { PilarSecao as PilarSecaoType } from '@/types/pilares'

interface PilarSecaoProps {
  secao: PilarSecaoType
  pilarId: string
}

export default function PilarSecao({ secao, pilarId }: PilarSecaoProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
      {/* Título da Seção */}
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        {secao.titulo}
      </h3>

      {/* Conteúdo da Seção */}
      <div className="prose prose-lg max-w-none mb-6">
        {secao.conteudo ? (
          <div className="text-gray-700 leading-relaxed">
            {secao.conteudo.split('\n').map((line, index) => {
              const trimmedLine = line.trim()
              
              // Detectar listas com bullet points
              if (trimmedLine.startsWith('•')) {
                return (
                  <div key={index} className="ml-6 mb-2 flex items-start">
                    <span className="mr-2 text-blue-600">•</span>
                    <span>{trimmedLine.substring(1).trim()}</span>
                  </div>
                )
              }
              
              // Parágrafos normais
              if (trimmedLine) {
                return (
                  <p key={index} className="mb-4">
                    {trimmedLine}
                  </p>
                )
              }
              
              // Linhas vazias (espaçamento)
              return <div key={index} className="h-2" />
            })}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-center italic">
              Conteúdo desta seção será preenchido em breve.
            </p>
          </div>
        )}
      </div>

      {/* Exercícios Relacionados */}
      {secao.exercicios_relacionados && secao.exercicios_relacionados.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">💪 Exercícios Relacionados</h4>
          <div className="flex flex-wrap gap-2">
            {secao.exercicios_relacionados.map((exercicioId) => (
              <Link
                key={exercicioId}
                href={`/pt/nutri/metodo/exercicios/${exercicioId}`}
                className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Exercício {exercicioId} →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ferramentas Relacionadas */}
      {secao.ferramentas_relacionadas && secao.ferramentas_relacionadas.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">🛠️ Ferramentas Relacionadas</h4>
          <div className="flex flex-wrap gap-2">
            {secao.ferramentas_relacionadas.map((ferramentaId) => (
              <Link
                key={ferramentaId}
                href={`/pt/nutri/metodo/ferramentas/${ferramentaId}`}
                className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Ferramenta {ferramentaId} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

