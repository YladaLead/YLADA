'use client'

import { useState } from 'react'
import Image from 'next/image'

interface PDFViewerProps {
  pdfUrl: string
  title?: string
}

export default function PDFViewer({ pdfUrl, title }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleDownload = () => {
    window.open(pdfUrl, '_blank')
  }

  if (!pdfUrl) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>Nenhum material disponível.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>⬇️</span>
            <span>Baixar PDF</span>
          </button>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {loading && (
          <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando PDF...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="aspect-[8.5/11] bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-4">📄</div>
              <p className="mb-2">Erro ao carregar PDF</p>
              <button
                onClick={handleDownload}
                className="text-blue-600 hover:underline"
              >
                Baixar PDF diretamente
              </button>
            </div>
          </div>
        )}

        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full aspect-[8.5/11]"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false)
            setError(true)
          }}
          title={title || 'PDF Viewer'}
        />
      </div>
    </div>
  )
}

