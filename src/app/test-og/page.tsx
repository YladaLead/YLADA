'use client'

import { useState } from 'react'

export default function TestOGPage() {
  const [testUrl, setTestUrl] = useState('https://www.herbalead.com')

  const testWithFacebook = () => {
    window.open(`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(testUrl)}`, '_blank')
  }

  const testWithWhatsApp = () => {
    const message = `Teste de link: ${testUrl}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🧪 Teste de Open Graph (OG)
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL para testar:
              </label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://www.herbalead.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testWithFacebook}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                🔍 Testar com Facebook Debugger
              </button>
              
              <button
                onClick={testWithWhatsApp}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
              >
                📱 Testar com WhatsApp
              </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📋 Informações da Imagem OG
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>URL:</strong> https://www.herbalead.com/logos/herbalead/herbalead-og-image.png?v=2024</p>
                <p><strong>Dimensões:</strong> 1200x630px</p>
                <p><strong>Tipo:</strong> PNG</p>
                <p><strong>Alt:</strong> Herbalead - Your Lead Accelerator</p>
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                💡 Como testar:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Use o Facebook Debugger para verificar se a imagem está sendo carregada</li>
                <li>Teste no WhatsApp enviando o link para você mesmo</li>
                <li>Se a imagem não aparecer, pode ser cache do WhatsApp</li>
                <li>Tente adicionar parâmetros diferentes (?v=2024, ?t=123456)</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                ⚠️ Possíveis problemas:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
                <li>Cache do WhatsApp (pode demorar até 24h para atualizar)</li>
                <li>Imagem muito grande ou formato não suportado</li>
                <li>URL da imagem não acessível publicamente</li>
                <li>Configuração de CORS no servidor</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}