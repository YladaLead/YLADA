'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { fluxosClientes } from '@/lib/wellness-system/fluxos-clientes'
import { fluxosRecrutamento } from '@/lib/wellness-system/fluxos-recrutamento'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'

function GeradorLinkPageContent() {
  const { profile } = useWellnessProfile()
  const [tipoFluxo, setTipoFluxo] = useState<'cliente' | 'recrutamento'>('cliente')
  const [fluxoSelecionado, setFluxoSelecionado] = useState<string>('')
  const [linkGerado, setLinkGerado] = useState<string>('')
  const [linkCopiado, setLinkCopiado] = useState(false)

  const fluxos = tipoFluxo === 'cliente' ? fluxosClientes : fluxosRecrutamento
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'
  const userSlug = profile?.userSlug || 'seu-slug'

  const gerarLink = () => {
    if (!fluxoSelecionado) {
      alert('Selecione um fluxo primeiro')
      return
    }

    const rota = tipoFluxo === 'cliente'
      ? `/pt/wellness/system/vender/fluxos/${fluxoSelecionado}`
      : `/pt/wellness/system/recrutar/fluxos/${fluxoSelecionado}`

    const linkCompleto = `${baseUrl}${rota}`
    setLinkGerado(linkCompleto)
    setLinkCopiado(false)
  }

  const copiarLink = () => {
    if (linkGerado) {
      navigator.clipboard.writeText(linkGerado)
      setLinkCopiado(true)
      setTimeout(() => setLinkCopiado(false), 2000)
    }
  }

  const copiarMensagemComLink = () => {
    const fluxo = fluxos.find(f => f.id === fluxoSelecionado)
    const mensagem = `Olá! 👋

Que tal fazer um teste rápido e gratuito para descobrir seu perfil?

${fluxo?.nome || 'Diagnóstico'}: ${linkGerado}

São só ${fluxo?.perguntas.length || 5} perguntas e leva menos de 2 minutos! 😊`

    navigator.clipboard.writeText(mensagem)
    setLinkCopiado(true)
    setTimeout(() => setLinkCopiado(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Gerador de Link" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Gerador de Link
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gere links personalizados para compartilhar seus fluxos de diagnóstico
          </p>
        </div>

        {/* Formulário */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-6">
            {/* Tipo de Fluxo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Fluxo
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setTipoFluxo('cliente')
                    setFluxoSelecionado('')
                    setLinkGerado('')
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    tipoFluxo === 'cliente'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  💚 Vendas (Cliente)
                </button>
                <button
                  onClick={() => {
                    setTipoFluxo('recrutamento')
                    setFluxoSelecionado('')
                    setLinkGerado('')
                  }}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                    tipoFluxo === 'recrutamento'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  👥 Recrutamento
                </button>
              </div>
            </div>

            {/* Seleção de Fluxo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecione o Fluxo
              </label>
              <select
                value={fluxoSelecionado}
                onChange={(e) => {
                  setFluxoSelecionado(e.target.value)
                  setLinkGerado('')
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Selecione um fluxo...</option>
                {fluxos.map(fluxo => (
                  <option key={fluxo.id} value={fluxo.id}>
                    {fluxo.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão Gerar */}
            <button
              onClick={gerarLink}
              disabled={!fluxoSelecionado}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🔗 Gerar Link
            </button>
          </div>

          {/* Link Gerado */}
          {linkGerado && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Link Gerado
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4">
                <p className="text-sm text-gray-800 break-all font-mono">
                  {linkGerado}
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
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  📱 Copiar Mensagem com Link
                </button>
              </div>
            </div>
          )}

          {/* Dicas */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">
              💡 Dicas de Uso
            </h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• Compartilhe o link no WhatsApp, Instagram ou outras redes sociais</li>
              <li>• Use a opção "Copiar Mensagem com Link" para enviar já formatado</li>
              <li>• Acompanhe os diagnósticos no Histórico de Diagnósticos</li>
              <li>• Use os scripts da biblioteca para fazer follow-up</li>
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

export default function GeradorLinkPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <GeradorLinkPageContent />
    </ProtectedRoute>
  )
}

