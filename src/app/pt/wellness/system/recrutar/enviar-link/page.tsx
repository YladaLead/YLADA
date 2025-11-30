'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getApresentacaoNegocio } from '@/lib/wellness-system/apresentacao-negocio'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'

function EnviarLinkApresentacaoPageContent() {
  const { profile } = useWellnessProfile()
  const apresentacao = getApresentacaoNegocio()
  const [linkCopiado, setLinkCopiado] = useState(false)
  const [mensagemCopiada, setMensagemCopiada] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'
  const linkApresentacao = `${baseUrl}/pt/wellness/system/recrutar/apresentacao`

  const copiarLink = () => {
    navigator.clipboard.writeText(linkApresentacao)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  const copiarMensagemComLink = () => {
    const mensagem = `Olá! 👋

Tenho uma oportunidade interessante para compartilhar com você!

É sobre o mercado de bebidas funcionais - um mercado que está crescendo muito.

Quer conhecer? É só clicar no link abaixo:

${linkApresentacao}

São apenas alguns minutos e pode mudar sua perspectiva sobre renda! 🚀`

    navigator.clipboard.writeText(mensagem)
    setMensagemCopiada(true)
    setTimeout(() => setMensagemCopiada(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Enviar Link de Apresentação" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Enviar Link de Apresentação
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compartilhe o link da apresentação de negócio com pessoas interessadas
          </p>
        </div>

        {/* Link da Apresentação */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Link da Apresentação
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-800 break-all font-mono">
                {linkApresentacao}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copiarLink}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  linkCopiado
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {linkCopiado ? '✓ Link Copiado!' : '📋 Copiar Link'}
              </button>
              <button
                onClick={copiarMensagemComLink}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  mensagemCopiada
                    ? 'bg-green-600 text-white'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {mensagemCopiada ? '✓ Mensagem Copiada!' : '📱 Copiar Mensagem com Link'}
              </button>
            </div>
          </div>

          {/* Preview da Apresentação */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Preview da Apresentação
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">1. Abertura</h3>
                <p className="text-gray-700">{apresentacao.estrutura.abertura}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2. Demonstração</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {apresentacao.estrutura.demonstracao.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">3. História</h3>
                <p className="text-gray-700">{apresentacao.estrutura.historia}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4. Oportunidade</h3>
                <p className="text-gray-700">{apresentacao.estrutura.oportunidade}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">5. Plano Simples - 3 Ganhos</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>{apresentacao.estrutura.planoSimples.ganho1}</li>
                  <li>{apresentacao.estrutura.planoSimples.ganho2}</li>
                  <li>{apresentacao.estrutura.planoSimples.ganho3}</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">6. Fechamento</h3>
                <p className="text-gray-700">{apresentacao.estrutura.fechamento}</p>
              </div>
            </div>
          </div>

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              💡 Dicas de Uso
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Envie o link para pessoas que demonstraram interesse</li>
              <li>• Use os fluxos de recrutamento para identificar pessoas com potencial</li>
              <li>• Faça follow-up após enviar o link</li>
              <li>• Use os scripts da biblioteca para personalizar sua abordagem</li>
            </ul>
          </div>
        </div>

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function EnviarLinkApresentacaoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <EnviarLinkApresentacaoPageContent />
    </ProtectedRoute>
  )
}

