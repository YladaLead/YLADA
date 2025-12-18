'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BrandingPreviewProps {
  logoUrl?: string
  brandColor?: string
  brandName?: string
  professionalCredential?: string
  userSlug?: string
}

export default function BrandingPreview({
  logoUrl,
  brandColor = '#3B82F6', // Azul padrão
  brandName,
  professionalCredential,
  userSlug
}: BrandingPreviewProps) {
  const [previewType, setPreviewType] = useState<'form' | 'tool'>('form')

  // Se não tem dados de branding, mostrar mensagem
  const hasNoBranding = !logoUrl && !brandName && !professionalCredential

  return (
    <div className="space-y-4">
      {/* Tabs para escolher tipo de preview */}
      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setPreviewType('form')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            previewType === 'form'
              ? 'border-b-2 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{
            borderBottomColor: previewType === 'form' ? brandColor : 'transparent'
          }}
        >
          📋 Preview Formulário
        </button>
        <button
          onClick={() => setPreviewType('tool')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            previewType === 'tool'
              ? 'border-b-2 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{
            borderBottomColor: previewType === 'tool' ? brandColor : 'transparent'
          }}
        >
          🔧 Preview Ferramenta
        </button>
      </div>

      {/* Container do preview */}
      <div className="bg-gray-100 rounded-lg p-6">
        {hasNoBranding ? (
          <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <div className="text-gray-400 text-4xl mb-3">🎨</div>
            <p className="text-gray-500 font-medium mb-2">
              Nenhuma personalização definida
            </p>
            <p className="text-sm text-gray-400">
              Preencha os campos acima para ver o preview da sua marca
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header com branding */}
            <div 
              className="p-6 text-white"
              style={{ backgroundColor: brandColor }}
            >
              <div className="flex items-center space-x-4">
                {logoUrl && (
                  <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={logoUrl}
                      alt="Logo"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {brandName || 'Seu Nome Profissional'}
                  </h2>
                  {professionalCredential && (
                    <p className="text-sm opacity-90 mt-1">
                      {professionalCredential}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Conteúdo do preview baseado no tipo */}
            {previewType === 'form' ? (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Formulário de Anamnese
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      style={{
                        borderColor: brandColor,
                        opacity: 0.7
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      style={{
                        borderColor: brandColor,
                        opacity: 0.7
                      }}
                    />
                  </div>
                  <button
                    disabled
                    className="w-full py-3 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor: brandColor,
                      opacity: 0.7
                    }}
                  >
                    Enviar Formulário
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Calculadora Nutricional
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        placeholder="70"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        style={{
                          borderColor: brandColor,
                          opacity: 0.7
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        placeholder="170"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        style={{
                          borderColor: brandColor,
                          opacity: 0.7
                        }}
                      />
                    </div>
                  </div>
                  <button
                    disabled
                    className="w-full py-3 rounded-lg text-white font-semibold"
                    style={{
                      backgroundColor: brandColor,
                      opacity: 0.7
                    }}
                  >
                    Calcular
                  </button>
                </div>
              </div>
            )}

            {/* Footer com link */}
            {userSlug && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Link público: <span className="font-mono font-semibold">ylada.app/nutri/{userSlug}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dicas da LYA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">💡</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-blue-900 mb-1">
              Dica da LYA
            </p>
            <p className="text-sm text-blue-800">
              Use cores que transmitam confiança e profissionalismo. Verde representa saúde e vitalidade, 
              azul transmite confiança, e laranja estimula o apetite e energia. Peça ajuda à LYA para 
              escolher a cor ideal para sua marca! 🎨
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
