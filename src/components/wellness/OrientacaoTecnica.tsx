'use client'

import Link from 'next/link'
import type { OrientacaoItem, MentorInfo } from '@/types/orientation'

interface OrientacaoTecnicaProps {
  item: OrientacaoItem
  mentor?: MentorInfo
  sugestaoMentor?: {
    mostrar: boolean
    mensagem: string
    acao: string
    whatsapp?: string
  }
}

export default function OrientacaoTecnica({
  item,
  mentor,
  sugestaoMentor
}: OrientacaoTecnicaProps) {
  const copiarPassoAPasso = () => {
    const texto = `${item.titulo}\n\n${item.descricao}\n\nPasso a Passo:\n${item.passo_a_passo.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    
    navigator.clipboard.writeText(texto).then(() => {
      alert('Passo a passo copiado!')
    })
  }

  const abrirWhatsApp = () => {
    if (sugestaoMentor?.whatsapp) {
      const mensagem = encodeURIComponent(`Olá ${mentor?.nome}! Preciso de ajuda.`)
      window.open(`https://wa.me/${sugestaoMentor.whatsapp}?text=${mensagem}`, '_blank')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl">{item.icone}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">
            {item.titulo}
          </h3>
          <p className="text-gray-600 text-sm">{item.descricao}</p>
        </div>
      </div>

      {/* Atalho */}
      {item.atalho && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-green-800">
            <span className="font-semibold">📍 Onde está:</span> {item.atalho}
          </p>
        </div>
      )}

      {/* Passo a Passo */}
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 mb-4 text-base">Passo a Passo:</h4>
        <ol className="space-y-3">
          {item.passo_a_passo.map((passo, index) => (
            <li key={index} className="flex gap-3 text-gray-700">
              <span className="flex-shrink-0 w-7 h-7 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="flex-1 leading-relaxed">{passo}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Link
          href={item.caminho}
          className="flex-1 min-w-[150px] bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center transition-colors"
        >
          🚀 Ir para {item.titulo}
        </Link>
        <button
          onClick={copiarPassoAPasso}
          className="flex-1 min-w-[150px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          📋 Copiar Passo a Passo
        </button>
      </div>

      {/* Sugestão de Mentor */}
      {sugestaoMentor?.mostrar && mentor?.temMentor && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-3">
              {sugestaoMentor.mensagem}
            </p>
            {sugestaoMentor.whatsapp && (
              <button
                onClick={abrirWhatsApp}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                💬 {sugestaoMentor.acao}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

